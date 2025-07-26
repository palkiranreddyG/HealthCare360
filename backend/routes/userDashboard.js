const express = require('express');
const router = express.Router();
const ChronicReading = require('../models/ChronicReading');
const Medication = require('../models/Medication');
const MedicalRecord = require('../models/MedicalRecord');
const Activity = require('../models/Activity');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Message = require('../models/Message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare360';

// GET /api/user-dashboard/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = req.params.userId;
    // Health Score: from latest chronic reading
    const latestReading = await ChronicReading.findOne({ user }).sort({ date: -1 });
    let healthScore = 85;
    if (latestReading) {
      healthScore = 100;
      if (latestReading.glucose > 130) healthScore -= 10;
      if (latestReading.bp) {
        const [sys, dia] = (latestReading.bp + '').split('/').map(Number);
        if (sys > 130 || dia > 85) healthScore -= 10;
      }
      if (latestReading.weight > 80) healthScore -= 5;
    }
    // Checkups: count of health records of type 'Checkup'
    const checkups = await MedicalRecord.countDocuments({ user, type: 'Checkup' });
    // Medications: count of Medication
    const medications = await Medication.countDocuments({ user });
    // Reports: count of MedicalRecord
    const reports = await MedicalRecord.countDocuments({ user });
    // Activities: latest 10
    const activities = await Activity.find({ user }).sort({ time: -1 }).limit(10);
    // Upcoming: next 5 appointments
    const now = new Date();
    const upcoming = await Appointment.find({ user, time: { $gte: now }, status: 'upcoming' }).sort({ time: 1 }).limit(5);
    // Notifications: remove hardcoded notifications
    const notifications = [];
    res.json({ healthScore, checkups, medications, reports, activities, upcoming, notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user-dashboard/:userId/activities
router.get('/:userId/activities', async (req, res) => {
  try {
    const user = req.params.userId;
    const activities = await Activity.find({ user }).sort({ time: -1 }).limit(10);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user-dashboard/:userId/activities
router.post('/:userId/activities', async (req, res) => {
  try {
    const user = req.params.userId;
    const { type, description, time } = req.body;
    const activity = new Activity({ user, type, description, time: time ? new Date(time) : new Date() });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user-dashboard/:userId/appointments
router.get('/:userId/appointments', async (req, res) => {
  try {
    const user = req.params.userId;
    const now = new Date();
    const appointments = await Appointment.find({ user, time: { $gte: now }, status: 'upcoming' }).sort({ time: 1 }).limit(5);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user-dashboard/:userId/appointments
router.post('/:userId/appointments', async (req, res) => {
  try {
    const user = req.params.userId;
    const { doctor, specialty, time, status } = req.body;
    const appointment = new Appointment({ user, doctor, specialty, time: new Date(time), status: status || 'upcoming' });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctor/:doctorId/appointments
router.get('/doctor/:doctorId/appointments', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctor: doctorId, type: 'appointment' })
      .populate('user', 'fullName email phone')
      .sort({ time: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/doctor/:doctorId/consult-requests
router.get('/doctor/:doctorId/consult-requests', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const requests = await Appointment.find({ doctor: doctorId, type: 'consult_request', status: 'pending' })
      .populate('user', 'fullName email phone')
      .sort({ time: 1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/doctor/:doctorId/consult-requests/:requestId/accept
router.post('/doctor/:doctorId/consult-requests/:requestId/accept', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Appointment.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    request.status = 'accepted';
    request.type = 'appointment';
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/doctor/:doctorId/consult-requests/:requestId/reject
router.post('/doctor/:doctorId/consult-requests/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Appointment.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    request.status = 'rejected';
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/doctor/:doctorId/chat/:userId
router.get('/doctor/:doctorId/chat/:userId', async (req, res) => {
  try {
    const { doctorId, userId } = req.params;
    const messages = await Message.find({ doctor: doctorId, user: userId }).sort({ time: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/doctor/:doctorId/chat/:userId
router.post('/doctor/:doctorId/chat/:userId', async (req, res) => {
  try {
    const { doctorId, userId } = req.params;
    const { text } = req.body;
    const message = new Message({ doctor: doctorId, user: userId, text });
    await message.save();
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router; 