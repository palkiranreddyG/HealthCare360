const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: { type: String, required: true },
  time: { type: Date, required: true },
  type: { type: String, enum: ['appointment', 'consult_request'], default: 'appointment' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'upcoming', 'completed'], default: 'upcoming' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema); 