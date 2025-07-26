const mongoose = require('mongoose');
const ChronicReading = require('../models/ChronicReading');
const Medication = require('../models/Medication');
const MedicalRecord = require('../models/MedicalRecord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare360';

async function seed(userId) {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Chronic Reading
  await ChronicReading.create({
    user: userId,
    date: new Date(),
    glucose: 110,
    bp: '120/80',
    weight: 70
  });
  // Medication
  await Medication.create({
    user: userId,
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Once daily',
    taken: true,
    createdAt: new Date()
  });
  // Medical Record (Checkup)
  await MedicalRecord.create({
    user: userId,
    type: 'Checkup',
    date: new Date(),
    doctor: 'Dr. Smith',
    hospital: 'City Hospital',
    status: 'Completed',
    createdAt: new Date()
  });
  // Medical Record (Report)
  await MedicalRecord.create({
    user: userId,
    type: 'Report',
    date: new Date(),
    doctor: 'Dr. Smith',
    hospital: 'City Hospital',
    status: 'Completed',
    createdAt: new Date()
  });

  console.log('Seeded health data for user:', userId);
  await mongoose.disconnect();
}

if (require.main === module) {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node seedUserHealthData.js <userId>');
    process.exit(1);
  }
  seed(userId).catch(err => { console.error(err); process.exit(1); });
} 