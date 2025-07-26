const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/public/uploads'));
app.use('/uploads/health-records', cors(), express.static(__dirname + '/public/uploads/health-records'));

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gkrsolutions77:visionary1@cluster0.kalz47a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SymptomQuerySchema = new mongoose.Schema({
  symptoms: String,
  duration: String,
  severity: String,
  aiResult: String,
  createdAt: { type: Date, default: Date.now },
});
const SymptomQuery = mongoose.model('SymptomQuery', SymptomQuerySchema);

function rulesBasedAnalysis(symptoms) {
  const s = symptoms.toLowerCase();
  if (s.includes('fever')) return 'You may have a fever. Stay hydrated, rest, and monitor your temperature. If fever persists for more than 3 days or is very high, consult a doctor.';
  if (s.includes('cough')) return 'A cough can be caused by many things. If it is persistent, severe, or with blood, see a doctor. Stay hydrated and rest.';
  if (s.includes('headache')) return 'Headaches are common. Rest, drink water, and avoid screen time. If severe or with other symptoms, consult a doctor.';
  if (s.includes('nausea')) return 'Nausea can be caused by infection, food, or stress. Eat light, stay hydrated, and rest. If vomiting or severe, see a doctor.';
  if (s.includes('fatigue')) return 'Fatigue can be due to lack of sleep, stress, or illness. Rest, eat well, and monitor. If persistent, consult a doctor.';
  if (s.includes('sore throat')) return 'A sore throat is often viral. Drink warm fluids, rest, and monitor. If severe or with fever, see a doctor.';
  return 'Please provide more details about your symptoms for a better analysis.';
}

async function getGeminiAnalysis(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data.candidates[0].content.parts[0].text;
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gemini-chat', require('./routes/gemini'));
app.use('/api/mood', require('./routes/mood'));
const resourcesRoute = require('./routes/resources');
console.log('Resources route loaded');
app.use('/api/resources', resourcesRoute);
app.use('/api/counselors', require('./routes/counselors'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/sleep-assessment', require('./routes/sleepAssessment'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/visualai', require('./routes/visualai'));
app.use('/api/chronic', require('./routes/chronic'));
app.use('/api/health-records', require('./routes/healthRecords'));
app.use('/api/family', require('./routes/family'));
app.use('/api/user-dashboard', require('./routes/userDashboard'));

app.post('/api/analyze-symptoms', async (req, res) => {
  console.log('Received analyze-symptoms request:', req.body);
  const { symptoms, duration, severity } = req.body;
  try {
    const structuredPrompt = `You are a medical AI assistant. Analyze the following patient symptoms and provide brief, actionable advice:

Patient Symptoms: ${symptoms}
Duration: ${duration}
Severity: ${severity}/10

Provide a concise response (2-3 sentences max) with:
• Brief assessment
• 1-2 immediate actions to take
• When to see a doctor

Keep it short and practical. No long explanations.`;

    const aiResult = await getGeminiAnalysis(structuredPrompt);
    const saved = await SymptomQuery.create({ symptoms, duration, severity, aiResult });
    res.json({ aiResult });
  } catch (err) {
    console.error('Gemini API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'AI analysis failed', details: err.message });
  }
});

app.get('/api/quick-symptoms', (req, res) => {
  res.json([
    { name: 'Fever', emoji: '🌡️' },
    { name: 'Headache', emoji: '🥴' },
    { name: 'Cough', emoji: '😷' },
    { name: 'Fatigue', emoji: '🥱' },
    { name: 'Sore Throat', emoji: '🤒' },
    { name: 'Nausea', emoji: '🤢' },
    { name: 'Shortness of Breath', emoji: '👃‍💨' },
  ]);
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await SymptomQuery.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Health Care 360° Backend API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
});
