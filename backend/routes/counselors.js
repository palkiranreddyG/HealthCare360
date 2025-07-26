const express = require('express');
const router = express.Router();

// GET /api/counselors
router.get('/', (req, res) => {
  const counselors = [
    { name: 'Dr. Anjali Sharma', specialty: 'Anxiety & Depression', experience: 8, rating: 4.9, fee: 800, languages: ['Hindi', 'English'], available: 'Today' },
    { name: 'Dr. Rakesh Verma', specialty: 'Stress & Trauma', experience: 12, rating: 4.8, fee: 1000, languages: ['Hindi', 'English', 'Punjabi'], available: 'Tomorrow' },
    { name: 'Dr. Priya Patel', specialty: 'Relationship Issues', experience: 6, rating: 4.7, fee: 750, languages: ['Hindi', 'English', 'Gujarati'], available: 'Today' },
  ];
  res.json(counselors);
});

module.exports = router; 