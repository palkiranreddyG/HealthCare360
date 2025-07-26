const express = require('express');
const router = express.Router();
const SleepAssessment = require('../models/SleepAssessment');

// POST /api/sleep-assessment
router.post('/', async (req, res) => {
  try {
    const { rating, user } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });
    const assessment = await SleepAssessment.create({ rating, user });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment', details: err.message });
  }
});

// GET /api/sleep-assessment/latest?user=...
router.get('/latest', async (req, res) => {
  try {
    const { user } = req.query;
    const query = user ? { user } : {};
    const latest = await SleepAssessment.findOne(query).sort({ date: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessment', details: err.message });
  }
});

module.exports = router; 