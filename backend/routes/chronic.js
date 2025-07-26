const express = require('express');
const router = express.Router();
const ChronicReading = require('../models/ChronicReading');
const Medication = require('../models/Medication');
const axios = require('axios');

// Get all readings for a user (optionally by date range)
router.get('/readings', async (req, res) => {
  try {
    const { user, start, end } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const query = { user };
    if (start || end) {
      query.date = {};
      if (start) query.date.$gte = new Date(start);
      if (end) query.date.$lte = new Date(end);
    }
    const readings = await ChronicReading.find(query).sort({ date: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch readings', details: err.message });
  }
});

// Add a new reading
router.post('/readings', async (req, res) => {
  try {
    const { user, glucose, bp, weight, date } = req.body;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const reading = await ChronicReading.create({ user, glucose, bp, weight, date });
    res.json(reading);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save reading', details: err.message });
  }
});

// Get all medications for a user
router.get('/medications', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const meds = await Medication.find({ user }).sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medications', details: err.message });
  }
});

// Add a new medication
router.post('/medications', async (req, res) => {
  try {
    const { user, name, dosage, frequency, next } = req.body;
    if (!user || !name || !dosage || !frequency) return res.status(400).json({ error: 'Missing required fields' });
    const med = await Medication.create({ user, name, dosage, frequency, next });
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save medication', details: err.message });
  }
});

// Mark medication as taken
router.put('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const med = await Medication.findByIdAndUpdate(id, { taken: true }, { new: true });
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update medication', details: err.message });
  }
});

// Get reading history for a user (last 7 days)
router.get('/history', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const readings = await ChronicReading.find({ user, date: { $gte: weekAgo } }).sort({ date: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

// POST /api/chronic/ai-insights
router.post('/ai-insights', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ error: 'User required' });
    // Fetch last 7 days of readings
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const history = await ChronicReading.find({ user, date: { $gte: weekAgo } }).sort({ date: -1 });
    // Compose prompt for Gemini
    const prompt = `You are a chronic disease management AI assistant. Analyze the following user's last 7 days of readings and provide personalized health insights:

Readings (date, glucose, bp, weight):\n${JSON.stringify(history, null, 2)}

Respond in JSON with this structure:
{
  "insights": [
    {
      "title": "Glucose Management",
      "desc": "• [Personalized health tip]",
      "highlight": true
    },
    {
      "title": "Blood Pressure Tips", 
      "desc": "• [Personalized lifestyle advice]",
      "highlight": false
    },
    {
      "title": "Weight Management",
      "desc": "• [Personalized dietary/exercise tip]",
      "highlight": false
    }
  ],
  "alerts": [
    {
      "title": "Health Alert",
      "desc": "• [Personalized warning or reminder]",
      "icon": "⚠️",
      "time": "Now"
    }
  ]
}

Keep advice personal, actionable, and supportive. Use bullet points naturally.`;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const geminiRes = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    let insights = [], alerts = [];
    try {
      const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = JSON.parse(text);
      insights = parsed.insights || [];
      alerts = parsed.alerts || [];
    } catch (e) {}
    // Fallback: if no insights or alerts, try Gemini again with a more focused prompt
    if (history.length > 0 && ((!insights || insights.length === 0) || (!alerts || alerts.length === 0))) {
      const latest = history[0];
      // Estimate HbA1c if not present
      let estimatedHbA1c = null;
      if (!latest.hba1c) {
        try {
          const avgGlucose = history.reduce((sum, r) => sum + (r.glucose || 0), 0) / history.filter(r => r.glucose).length;
          const hba1cPrompt = `Estimate the HbA1c value for a patient based on the following average blood glucose over the last 7 days: ${avgGlucose.toFixed(1)} mg/dL. Respond with only the number, no units or explanation.`;
          const hba1cRes = await axios.post(url, { contents: [{ parts: [{ text: hba1cPrompt }] }] });
          let hba1cText = hba1cRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          estimatedHbA1c = parseFloat(hba1cText.match(/[\d.]+/));
          if (isNaN(estimatedHbA1c)) estimatedHbA1c = null;
        } catch (e) {}
        if (!estimatedHbA1c) {
          const avgGlucose = history.reduce((sum, r) => sum + (r.glucose || 0), 0) / history.filter(r => r.glucose).length;
          if (!isNaN(avgGlucose)) estimatedHbA1c = ((avgGlucose + 46.7) / 28.7).toFixed(2);
        }
      }
      // Fetch medication status
      let meds = [];
      try {
        meds = await Medication.find({ user }).sort({ createdAt: -1 });
      } catch {}
      const medsTaken = meds.filter(m => m.taken).length;
      const medsTotal = meds.length;
      const notTaken = meds.filter(m => !m.taken).map(m => m.name);
      // Try Gemini again for a single personalized insight and alert
      if ((!insights || insights.length === 0) || (!alerts || alerts.length === 0)) {
        try {
          const advancedPrompt = `You are a chronic disease management AI. Given the following health data, provide personalized insights:

Latest Reading: Glucose: ${latest.glucose ?? '-'}, BP: ${latest.bp ?? '-'}, Weight: ${latest.weight ?? '-'}, HbA1c: ${estimatedHbA1c ?? (latest.hba1c ?? '-')}
Medications taken: ${medsTaken}/${medsTotal}${notTaken.length ? ", missed: " + notTaken.join(", ") : ''}

Respond in JSON with this structure:
{
  "insights": [
    {
      "title": "Health Tip",
      "desc": "• [Personalized actionable advice]",
      "highlight": true
    }
  ],
  "alerts": [
    {
      "title": "Health Alert",
      "desc": "• [Personalized warning or reminder]",
      "icon": "⚠️",
      "time": "Now"
    }
  ]
}

Keep advice personal, actionable, and supportive. Use bullet points naturally.`;
          const advRes = await axios.post(url, { contents: [{ parts: [{ text: advancedPrompt }] }] });
          const advText = advRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const advParsed = JSON.parse(advText);
          if ((!insights || insights.length === 0) && advParsed.insights && advParsed.insights.length > 0) insights = advParsed.insights;
          if ((!alerts || alerts.length === 0) && advParsed.alerts && advParsed.alerts.length > 0) alerts = advParsed.alerts;
        } catch (e) {}
      }
      // If Gemini fails again, use static fallback with actionable advice
      let abnormal = false;
      let tips = [];
      let alertReasons = [];
      if (latest.glucose > 130) {
        abnormal = true;
        alertReasons.push('Your blood glucose is above the recommended range.');
        tips.push('Try to avoid sweets and sugary drinks today. Consider a walk after meals.');
      } else if (latest.glucose > 110) {
        tips.push('Limit high-carb foods to help keep your glucose in check.');
      }
      if (latest.bp && ((+latest.bp.split('/')[0]) > 130 || (+latest.bp.split('/')[1]) > 85)) {
        abnormal = true;
        alertReasons.push('Your blood pressure is elevated.');
        tips.push('Reduce salt intake and monitor your BP. Try a relaxation technique.');
      }
      if (latest.weight > 80) {
        tips.push('Try a 30-minute walk today or add more veggies to your meals.');
      }
      if (notTaken.length) {
        alertReasons.push('You missed your medication: ' + notTaken.join(', ') + '.');
        // Only add a tip if not already in tips
        if (!tips.some(t => t.includes('medication'))) {
          tips.push('Set a daily reminder to help you remember your medication.');
        }
      }
      // Ensure insights and alerts are distinct
      let insightText = '';
      if (tips.length) {
        insightText = '• ' + tips.join('\n• ');
      } else {
        insightText = '• Keep up your healthy habits and continue tracking';
      }
      if ((!insights || insights.length === 0)) {
        let insight = { title: abnormal ? 'Personalized Health Tip' : 'Daily Health Tip', desc: insightText, highlight: abnormal };
        insights = [insight];
      }
      let alertText = '';
      if (alertReasons.length) {
        alertText = '• ' + alertReasons.join('\n• ');
      } else {
        alertText = '• Stay consistent with your healthy routine';
      }
      let alertTitle = abnormal ? 'Abnormal Health Alert' : (notTaken.length ? 'Medication Reminder' : 'Health Reminder');
      if ((!alerts || alerts.length === 0)) {
        let alert = { icon: abnormal ? '⚠️' : (notTaken.length ? '💊' : 'ℹ️'), title: alertTitle, desc: alertText, time: 'Just now' };
        alerts = [alert];
      }
    }
    res.json({ insights, alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get AI insights', details: err.message });
  }
});

module.exports = router; 