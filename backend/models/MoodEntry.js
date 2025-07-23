const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  mood: { type: String, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema); 