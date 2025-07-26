const express = require('express');
const Family = require('../models/Family');
const User = require('../models/User');
const router = express.Router();

// Create a family for a user
router.post('/', async (req, res) => {
  try {
    const { userId, familyId } = req.body;
    const family = new Family({ user: userId, familyId, members: [] });
    await family.save();
    res.status(201).json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a user's family
router.get('/:userId', async (req, res) => {
  try {
    const family = await Family.findOne({ user: req.params.userId });
    if (!family) return res.status(404).json({ error: 'Family not found' });
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a family member
router.post('/:familyId/member', async (req, res) => {
  try {
    const { name, relation, age, lastCheckup, prescriptions, conditions, child } = req.body;
    const family = await Family.findOne({ familyId: req.params.familyId });
    if (!family) return res.status(404).json({ error: 'Family not found' });
    family.members.push({ name, relation, age, lastCheckup, prescriptions, conditions, child });
    await family.save();
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a family member
router.delete('/:familyId/member/:memberId', async (req, res) => {
  try {
    const family = await Family.findOne({ familyId: req.params.familyId });
    if (!family) return res.status(404).json({ error: 'Family not found' });
    family.members.id(req.params.memberId).remove();
    await family.save();
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a family member
router.put('/:familyId/member/:memberId', async (req, res) => {
  try {
    const family = await Family.findOne({ familyId: req.params.familyId });
    if (!family) return res.status(404).json({ error: 'Family not found' });
    const member = family.members.id(req.params.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    Object.assign(member, req.body);
    await family.save();
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 