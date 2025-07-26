const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. Blood Test Report, X-Ray
  date: { type: Date, required: true },
  doctor: { type: String, required: true },
  hospital: { type: String, required: true },
  status: { type: String, required: true }, // e.g. Normal, Clear, Controlled
  fileUrl: { type: String }, // for file download if needed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema); 