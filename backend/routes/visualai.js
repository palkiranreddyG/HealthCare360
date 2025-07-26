const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/visualai/upload - upload an image and return its public URL
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ url: publicUrl });
});

// POST /api/visualai/analyze
router.post('/analyze', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  try {
    const response = await fetch('https://serverless.roboflow.com/infer/workflows/lahari-emuv4/classify-and-conditionally-detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: 'ABlqIdarznJh5zMSncBb',
        inputs: {
          image: { type: 'url', value: imageUrl.startsWith('http') ? imageUrl : `${req.protocol}://${req.get('host')}${imageUrl}` }
        }
      })
    });
    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze image', details: err.message });
  }
});

module.exports = router; 