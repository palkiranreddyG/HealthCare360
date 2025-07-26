const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const ProviderAccess = require('../models/ProviderAccess');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/health-records'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET /api/health-records?user=USERID
router.get('/records', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const records = await MedicalRecord.find({ user }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records', details: err.message });
  }
});

// POST /api/health-records (with file upload)
router.post('/records', upload.single('file'), async (req, res) => {
  try {
    const { user, type, date, doctor, hospital, status } = req.body;
    if (!user || !type || !date || !doctor || !hospital || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let fileUrl = '';
    if (req.file) {
      fileUrl = `/uploads/health-records/${req.file.filename}`;
    }
    const record = await MedicalRecord.create({ user, type, date, doctor, hospital, status, fileUrl });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add record', details: err.message });
  }
});

// DELETE /api/health-records/:id
router.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await MedicalRecord.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record', details: err.message });
  }
});

// GET /api/health-summary?user=USERID
router.get('/summary', async (req, res) => {
  // TODO: Replace with real data from User model
  res.json({
    allergies: ['Penicillin', 'Dust'],
    chronic: ['Type 2 Diabetes'],
    bloodGroup: 'B+',
    emergencyContact: '+91-9876543210',
    lastCheckup: '2024-01-15',
  });
});

// GET /api/health-timeline?user=USERID
router.get('/timeline', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const records = await MedicalRecord.find({ user }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline', details: err.message });
  }
});

// GET /api/health-sharing?user=USERID
router.get('/sharing', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ error: 'User ID required' });
    const providers = await ProviderAccess.find({ user });
    res.json({ providers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch providers', details: err.message });
  }
});

// POST /api/health-sharing
router.post('/sharing', async (req, res) => {
  try {
    const { user, name, meta } = req.body;
    if (!user || !name || !meta) return res.status(400).json({ error: 'Missing required fields' });
    const provider = await ProviderAccess.create({ user, name, meta });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add provider', details: err.message });
  }
});

// DELETE /api/health-sharing/:id
router.delete('/sharing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ProviderAccess.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke provider', details: err.message });
  }
});

module.exports = router; 