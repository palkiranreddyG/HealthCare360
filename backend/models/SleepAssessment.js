const mongoose = require('mongoose');

const SleepAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SleepAssessment', SleepAssessmentSchema); 