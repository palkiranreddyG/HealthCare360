const express = require('express');
const router = express.Router();
const axios = require('axios');
const SleepAssessment = require('../models/SleepAssessment');

// POST /api/insights
router.post('/', async (req, res) => {
  const { moodEntries, chatHistory, user } = req.body;
  try {
    // Fetch latest sleep assessment
    let sleepRating = null;
    if (user) {
      const latest = await SleepAssessment.findOne({ user }).sort({ date: -1 });
      if (latest) sleepRating = latest.rating;
    } else {
      const latest = await SleepAssessment.findOne().sort({ date: -1 });
      if (latest) sleepRating = latest.rating;
    }
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    // Compose prompt
    const prompt = `You are a mental health AI assistant. Analyze the following user's mood entries, chat history, and sleep quality rating, and provide personalized insights:

Mood Entries (date, mood, note):\n${JSON.stringify(moodEntries, null, 2)}\n\nChat History (latest 10):\n${JSON.stringify(chatHistory.slice(-10), null, 2)}\n\nSleep Quality Rating (1-5, 5=best): ${sleepRating ?? 'Not provided'}

Respond in JSON with this structure:
{
  "moodPattern": "• [Personalized mood observation]",
  "positiveTrigger": "• [What improves their mood]",
  "sleepImpact": "• [Sleep-mood connection]",
  "recommendations": [
    {"title": "Morning Meditation", "desc": "• [Specific actionable tip]"},
    {"title": "Exercise Routine", "desc": "• [Specific actionable tip]"},
    {"title": "Gratitude Journaling", "desc": "• [Specific actionable tip]"}
  ]
}

Keep responses personal, actionable, and conversational. Use bullet points naturally.`;
    const geminiRes = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    // Try to parse Gemini's response as JSON
    let insights = null;
    try {
      const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      insights = JSON.parse(text);
    } catch (e) {}
    if (insights && insights.moodPattern && insights.positiveTrigger && insights.sleepImpact && Array.isArray(insights.recommendations)) {
      return res.json(insights);
    }
    // Fallback to static
    throw new Error('Gemini did not return valid JSON');
  } catch (err) {
    // Fallback static data
    res.json({
      moodPattern: '• Your mood tends to be lower on Mondays and Tuesdays',
      positiveTrigger: '• Social interactions consistently improve your mood',
      sleepImpact: '• Poor sleep correlates with lower mood ratings',
      recommendations: [
        { title: 'Morning Meditation', desc: '• Start your day with 10 minutes of mindfulness' },
        { title: 'Exercise Routine', desc: '• Incorporate 30 minutes of activity 3 times per week' },
        { title: 'Gratitude Journaling', desc: '• Write down 3 things you\'re grateful for each evening' },
      ]
    });
  }
});

module.exports = router; 