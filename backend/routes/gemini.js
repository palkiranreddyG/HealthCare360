const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/gemini-chat
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const geminiRes = await axios.post(url, {
      contents: [{ parts: [{ text: message }] }]
    });
    const geminiText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({ response: geminiText });
  } catch (err) {
    console.error('Gemini API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Gemini API error', details: err.message });
  }
});

module.exports = router; 