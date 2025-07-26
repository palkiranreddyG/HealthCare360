const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema); 