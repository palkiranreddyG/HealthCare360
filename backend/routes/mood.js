const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');

// Add a mood entry
router.post('/', async (req, res) => {
  try {
    const { mood, note, user } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood is required' });
    const entry = await MoodEntry.create({ mood, note, user });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save mood entry', details: err.message });
  }
});

// Get recent mood entries (optionally by user)
router.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    const query = user ? { user } : {};
    const entries = await MoodEntry.find(query).sort({ date: -1 }).limit(20);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood entries', details: err.message });
  }
});

module.exports = router; 