const mongoose = require('mongoose');

const ChronicReadingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  glucose: { type: Number, required: false },
  bp: { type: String, required: false },
  weight: { type: Number, required: false },
});

module.exports = mongoose.model('ChronicReading', ChronicReadingSchema); 