const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const Order = require('../models/Order');

const upload = multer({ dest: path.join(__dirname, '../public/uploads/') });

// GET /api/resources
router.get('/', (req, res) => {
  const resources = [
    { title: 'Breathing Exercises', desc: 'Guided breathing techniques for anxiety relief', tag: 'Relaxation', duration: '5-10 minutes' },
    { title: 'Meditation Sessions', desc: 'Mindfulness practices for emotional balance', tag: 'Mindfulness', duration: '10-20 minutes' },
    { title: 'Sleep Hygiene', desc: 'Tips for better sleep and mental wellness', tag: 'Wellness', duration: 'Read in 5 minutes' },
    { title: 'Stress Management', desc: 'Practical techniques for handling daily stress', tag: 'Coping', duration: '15 minutes' },
  ];
  res.json(resources);
});

// Expanded medicine dictionary for demo
const MEDICINE_LIST = [
  'paracetamol', 'amoxicillin', 'ibuprofen', 'cetirizine', 'vitamin d3', 'azithromycin', 'atorvastatin', 'metformin', 'omeprazole', 'amoxiclav', 'aspirin', 'amlodipine', 'losartan', 'pantoprazole', 'levocetirizine', 'dolo', 'crocin', 'calpol', 'zincovit', 'doxycycline', 'blood pressure kit',
  'augmentin', 'enzoflam', 'pan d', 'hexigel'
];

// Fuzzy string matching (Levenshtein distance)
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// POST /api/ocr-prescription (now using Tesseract.js)
router.post('/ocr-prescription', upload.single('file'), async (req, res) => {
  console.log('OCR prescription endpoint hit');
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File uploaded:', req.file.path);
    // OCR with Tesseract.js
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    // Advanced parsing: fuzzy match, multi-line, better regex
    const foundMeds = [];
    const lowerText = text.toLowerCase();
    const lines = lowerText.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const med of MEDICINE_LIST) {
        const words = line.split(/\s+/);
        for (let w = 0; w < words.length; w++) {
          // Only match if word is at least 5 chars and Levenshtein distance <= 1, or exact substring
          if ((words[w].length >= 5 && levenshtein(words[w], med) <= 1) || line.includes(med)) {
            // Try to get full medicine name (e.g., 'augmentin 625mg')
            let medName = words.slice(w, w + 2).join(' ').replace(/[^a-z0-9+\- ]/gi, '').trim();
            // Clean up: if medName is too short or doesn't include med, use med
            if (!medName.toLowerCase().includes(med) || medName.length < 5) medName = med.charAt(0).toUpperCase() + med.slice(1);
            // Look for dosage pattern in this line or next 2 lines
            let quantity = '';
            let foundQty = false;
            for (let lookahead = 0; lookahead <= 2 && i + lookahead < lines.length; lookahead++) {
              const dosageLine = lines[i + lookahead];
              const qtyMatch = dosageLine.match(/(\d[\-x\/\d ]+x ?\d+ ?(days|day|week|weeks)?)/i);
              if (qtyMatch) {
                quantity = qtyMatch[1].replace(/\s+/g, ' ').trim();
                foundQty = true;
                break;
              } else {
                const altMatch = dosageLine.match(/(\d+\s*tab.*?for\s*\d+\s*(days|day|week|weeks))/i);
                if (altMatch) {
                  quantity = altMatch[1].replace(/\s+/g, ' ').trim();
                  foundQty = true;
                  break;
                }
              }
            }
            // Avoid duplicates and partials
            if (!foundMeds.find(m => m.name === medName && m.quantity === quantity) && medName.length >= 5) {
              foundMeds.push({
                name: medName,
                quantity: quantity
              });
            }
          }
        }
      }
    }
    console.log('Extracted text:', text);
    console.log('Medicines found:', foundMeds);
    res.json({ medicines: foundMeds, rawText: text });
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: 'Failed to process prescription', details: err.message });
  }
});

// POST /api/resources/save-order
router.post('/save-order', async (req, res) => {
  try {
    const { items, date, status, orderId, user } = req.body;
    const order = await Order.create({ items, date, status, orderId, user });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order', details: err.message });
  }
});

// GET /api/resources/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// Debug test route
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ ok: true });
});

module.exports = router; 