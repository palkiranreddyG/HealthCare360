const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  age: { type: Number, required: true },
  lastCheckup: { type: String },
  prescriptions: { type: Number, default: 0 },
  conditions: { type: [String], default: [] },
  child: { type: Boolean, default: false },
}, { _id: true });

const FamilySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyId: { type: String, required: true, unique: true },
  members: { type: [FamilyMemberSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Family', FamilySchema); 