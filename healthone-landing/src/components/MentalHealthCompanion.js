import React, { useState } from 'react';
import GuidedBreathingExercise from './GuidedBreathingExercise';
import GuidedMeditationSession from './GuidedMeditationSession';
import MeditationSelection from './MeditationSelection';
import SleepHygieneGuide from './SleepHygieneGuide';
import StressManagementSession from './StressManagementSession';
import CounselorChatSession from './CounselorChatSession';
import CounselorVideoSession from './CounselorVideoSession';

const BLUE = '#2196f3';
const LIGHT_BLUE = '#e3f0fd';
const TABS = ['AI Chat', 'Mood Tracker', 'Resources', 'Counselors', 'Insights'];

const moods = [
  { label: 'Very Sad', icon: '😢' },
  { label: 'Sad', icon: '🙁' },
  { label: 'Neutral', icon: '😐' },
  { label: 'Happy', icon: '🙂' },
  { label: 'Very Happy', icon: '😄' },
];

const mockMoodEntries = [
  { date: '2024-01-15', mood: 'Happy', note: 'Had a great day at work' },
  { date: '2024-01-14', mood: 'Neutral', note: 'Feeling okay, regular day' },
  { date: '2024-01-13', mood: 'Sad', note: 'Stressed about deadlines' },
];

const mockCounselors = [
  { name: 'Dr. Anjali Sharma', specialty: 'Anxiety & Depression', experience: 8, rating: 4.9, fee: 800, languages: ['Hindi', 'English'], available: 'Today' },
  { name: 'Dr. Rakesh Verma', specialty: 'Stress & Trauma', experience: 12, rating: 4.8, fee: 1000, languages: ['Hindi', 'English', 'Punjabi'], available: 'Tomorrow' },
  { name: 'Dr. Priya Patel', specialty: 'Relationship Issues', experience: 6, rating: 4.7, fee: 750, languages: ['Hindi', 'English', 'Gujarati'], available: 'Today' },
];

const mockInsights = {
  moodPattern: 'Your mood tends to be lower on Mondays and Tuesdays. Consider scheduling lighter activities on these days.',
  positiveTrigger: 'Social interactions consistently improve your mood. Try to maintain regular contact with friends and family.',
  sleepImpact: 'Poor sleep appears to correlate with lower mood ratings. Focus on maintaining a consistent sleep schedule.',
  recommendations: [
    { title: 'Morning Meditation', desc: 'Start your day with 10 minutes of mindfulness meditation to improve overall mood stability.' },
    { title: 'Exercise Routine', desc: 'Incorporate 30 minutes of physical activity 3 times a week to boost endorphins and reduce stress.' },
    { title: 'Gratitude Journaling', desc: 'Write down 3 things you’re grateful for each evening to cultivate positive thinking patterns.' },
  ]
};

const mockResources = [
  { title: 'Breathing Exercises', desc: 'Guided breathing techniques for anxiety relief', tag: 'Relaxation', duration: '5-10 minutes' },
  { title: 'Meditation Sessions', desc: 'Mindfulness practices for emotional balance', tag: 'Mindfulness', duration: '10-20 minutes' },
  { title: 'Sleep Hygiene', desc: 'Tips for better sleep and mental wellness', tag: 'Wellness', duration: 'Read in 5 minutes' },
  { title: 'Stress Management', desc: 'Practical techniques for handling daily stress', tag: 'Coping', duration: '15 minutes' },
];

const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

function MoodBar({ value }) {
  return (
    <div style={{ background: LIGHT_BLUE, borderRadius: 8, height: 12, margin: '12px 0', width: '100%' }}>
      <div style={{ background: BLUE, width: `${value * 20}%`, height: '100%', borderRadius: 8 }} />
    </div>
  );
}

const MentalHealthCompanion = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [tab, setTab] = useState('AI Chat');
  const [chat, setChat] = useState([
    { sender: 'ai', text: "Hello! I'm your AI mental health companion. How are you feeling today?", time: '10:30 AM' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodError, setMoodError] = useState('');
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [counselorsLoading, setCounselorsLoading] = useState(false);
  const [counselorsError, setCounselorsError] = useState('');
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [meditationStep, setMeditationStep] = useState('select'); // 'select' | 'session'
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [showSleepHygiene, setShowSleepHygiene] = useState(false);
  const [showStress, setShowStress] = useState(false);
  const [activeCounselor, setActiveCounselor] = useState(null);
  const [counselorMode, setCounselorMode] = useState(null); // 'chat' | 'video' | null

  // Fetch mood entries from backend
  React.useEffect(() => {
    if (tab === 'Mood Tracker') {
      setMoodLoading(true);
      fetch(`${BACKEND_URL}/api/mood`)
        .then(res => res.json())
        .then(data => { setMoodEntries(data); setMoodLoading(false); })
        .catch(() => { setMoodError('Failed to load mood entries'); setMoodLoading(false); });
    }
  }, [tab]);

  // Fetch resources, counselors, insights from backend when tab changes
  React.useEffect(() => {
    if (tab === 'Resources') {
      setResourcesLoading(true);
      setResourcesError('');
      fetch(`${BACKEND_URL}/api/resources`)
        .then(res => res.json())
        .then(data => { setResources(data); setResourcesLoading(false); })
        .catch(() => { setResourcesError('Failed to load resources'); setResourcesLoading(false); });
    }
    if (tab === 'Counselors') {
      setCounselorsLoading(true);
      setCounselorsError('');
      fetch(`${BACKEND_URL}/api/counselors`)
        .then(res => res.json())
        .then(data => { setCounselors(data); setCounselorsLoading(false); })
        .catch(() => { setCounselorsError('Failed to load counselors'); setCounselorsLoading(false); });
    }
    if (tab === 'Insights') {
      setInsightsLoading(true);
      setInsightsError('');
      // Get user ID from localStorage
      let user = null;
      try {
        const userObj = JSON.parse(localStorage.getItem('user'));
        user = userObj?._id || userObj?.userId || null;
      } catch {}
      fetch(`${BACKEND_URL}/api/mood`)
        .then(res => res.json())
        .then(moodEntries => {
          fetch(`${BACKEND_URL}/api/insights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moodEntries, chatHistory: chat, user }),
          })
            .then(res => res.json())
            .then(data => { setInsights(data); setInsightsLoading(false); })
            .catch(() => { setInsightsError('Failed to load insights'); setInsightsLoading(false); });
        })
        .catch(() => { setInsightsError('Failed to load insights'); setInsightsLoading(false); });
    }
  }, [tab]);

  // Save mood entry to backend
  const handleSaveMood = async () => {
    if (!selectedMood) return;
    setMoodLoading(true);
    setMoodError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood.label, note: moodNote })
      });
      if (res.ok) {
        setMoodNote('');
        setSelectedMood(null);
        // Refresh mood entries
        const entries = await fetch(`${BACKEND_URL}/api/mood`).then(r => r.json());
        setMoodEntries(entries);
      } else {
        setMoodError('Failed to save mood entry');
      }
    } catch (err) {
      setMoodError('Network error');
    }
    setMoodLoading(false);
  };

  // Helper function to format AI responses with proper styling
  const formatAIResponse = (text) => {
    if (!text) return '';
    let html = text;
    
    // Bold section headers
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1976d2; font-weight: 700;">$1</strong>');
    
    // Convert various bullet point formats to proper HTML lists
    html = html.replace(/\n\* /g, '</li><li style="margin: 8px 0; line-height: 1.5;">');
    html = html.replace(/\n• /g, '</li><li style="margin: 8px 0; line-height: 1.5;">');
    html = html.replace(/\n- /g, '</li><li style="margin: 8px 0; line-height: 1.5;">');
    
    // Add proper list structure
    if (html.includes('<li')) {
      html = '<ul style="margin: 12px 0; padding-left: 20px;">' + html.replace(/^/, '<li style="margin: 8px 0; line-height: 1.5;">') + '</li></ul>';
    }
    
    // Clean up any remaining asterisks that weren't converted
    html = html.replace(/\* /g, '');
    
    // Add line breaks for better spacing
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');
    
    // Add spacing after bold headers
    html = html.replace(/(<strong[^>]*>.*?<\/strong>)/g, '$1<br/>');
    
    return html;
  };

  // AI Chat logic
  const handleSend = async () => {
    if (!userInput.trim()) return;
    setChat([...chat, { sender: 'user', text: userInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setUserInput('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/gemini-chat/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      const data = await res.json();
      if (res.ok && data.response) {
        setChat(c => [...c, { sender: 'ai', text: data.response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setError(data.error || 'AI response failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  // Mood Tracker logic (mock)
  // Mood value mapping
  const moodValueMap = {
    'Very Sad': 1,
    'Sad': 2,
    'Neutral': 3,
    'Happy': 4,
    'Very Happy': 5,
  };

  // Calculate mood summary from moodEntries
  const last7 = moodEntries.slice(0, 7);
  const avgMood = last7.length > 0 ? (last7.reduce((sum, entry) => sum + (moodValueMap[entry.mood] || 3), 0) / last7.length).toFixed(1) : '-';
  const daysTracked = new Set(last7.map(e => e.date && e.date.slice(0, 10))).size;
  let trend = '-';
  if (last7.length >= 2) {
    const prev = moodValueMap[last7[1].mood] || 3;
    const curr = moodValueMap[last7[0].mood] || 3;
    trend = curr > prev ? 'Improving' : curr < prev ? 'Declining' : 'Stable';
  }

  // Helper for mood icon and color
  const moodMeta = {
    'Very Sad': { icon: '😢', color: '#e53935' },
    'Sad': { icon: '🙁', color: '#fb8c00' },
    'Neutral': { icon: '😐', color: BLUE },
    'Happy': { icon: '🙂', color: '#43a047' },
    'Very Happy': { icon: '😄', color: '#43a047' },
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: 0, color: BLUE }}>Mental Health Companion</h1>
          <div style={{ color: '#607d8b', fontSize: 18, marginBottom: 16 }}>Your 24/7 AI-powered emotional wellness support</div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ color: '#222', fontWeight: 600 }}>AI Powered</span>
          <span style={{ color: '#222', fontWeight: 600 }}>24/7 Support</span>
        </div>
      </div>
      {/* Crisis Support */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 18, margin: '24px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <strong style={{ fontSize: 20 }}>Crisis Support</strong><br />
            <span style={{ color: '#607d8b' }}>If you're having thoughts of self-harm, please reach out immediately</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ border: `1.5px solid ${LIGHT_BLUE}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>📞 Call Helpline: 9152987821</button>
          <button style={{ border: `1.5px solid ${LIGHT_BLUE}`, borderRadius: 8, padding: '8px 18px', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>💬 Emergency Chat</button>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${LIGHT_BLUE}`, marginBottom: 24 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: t === tab ? 700 : 600,
              fontSize: 17,
              color: t === tab ? BLUE : '#607d8b',
              padding: '12px 32px',
              borderBottom: t === tab ? `3px solid ${BLUE}` : 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'color 0.2s',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {tab === 'AI Chat' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 36, boxShadow: 'none', marginBottom: 32, border: '1.5px solid #f0f4fa' }}>
          <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12, color: '#222' }}>
            <span style={{ fontSize: 28, color: BLUE }} role="img" aria-label="chat">💬</span> AI Mental Health Assistant
          </div>
          <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 28 }}>Safe, confidential, and available 24/7 for emotional support</div>
          <div style={{ minHeight: 120, marginBottom: 28 }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 18 }}>
                <div style={{
                  background: '#fff',
                  color: '#222',
                  borderRadius: 14,
                  padding: '18px 22px',
                  maxWidth: 540,
                  fontSize: 17,
                  border: '1.5px solid #e3f0fd',
                  boxShadow: 'none',
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                }}>
                  {msg.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }} />
                  ) : (
                    msg.text
                  )}
                  <div style={{ fontSize: 14, color: '#8ca0b3', marginTop: 8 }}>{msg.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{ background: '#fff', color: BLUE, borderRadius: 14, padding: '18px 22px', maxWidth: 540, fontSize: 17, fontStyle: 'italic', border: '1.5px solid #e3f0fd', boxShadow: 'none' }}>
                  Typing...
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 0, borderTop: '1.5px solid #e3f0fd', paddingTop: 18 }}>
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e3f0fd', padding: 16, fontSize: 17, background: '#f9fbfd', color: '#222', outline: 'none' }}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={handleSend}
              style={{ background: BLUE, color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '0 32px', marginLeft: 12, cursor: 'pointer', boxShadow: 'none' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      {tab === 'Mood Tracker' && (
        <>
          <div style={{
            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
            borderRadius: 16,
            padding: '24px 18px 18px 18px', // reduced padding
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 30, color: '#fff', marginRight: 6 }} role="img" aria-label="heart">♡</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '2rem', color: '#111', marginBottom: 0, letterSpacing: -1 }}>How are you feeling today?</div>
                <div style={{ color: '#e3f0fd', fontSize: 16, marginTop: 2 }}>Track your mood to better understand your emotional patterns</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 2, margin: '18px 0 12px 0' }}>
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m)}
                  style={{
                    background: 'transparent',
                    border: selectedMood?.label === m.label ? '2px solid #fff' : '2px solid #b3d6fc',
                    color: selectedMood?.label === m.label ? BLUE : '#111',
                    borderRadius: 10,
                    padding: '16px 10px', // smaller padding
                    fontSize: 17,
                    fontWeight: 600,
                    minWidth: 90,
                    minHeight: 80,
                    cursor: 'pointer',
                    boxShadow: 'none',
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    backgroundColor: selectedMood?.label === m.label ? '#e3f0fd' : 'transparent',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
                  {m.label}
                </button>
              ))}
            </div>
            <textarea
              value={moodNote}
              onChange={e => setMoodNote(e.target.value)}
              placeholder="Add a note about your mood (optional)..."
              style={{ width: '100%', borderRadius: 10, border: 'none', padding: 12, fontSize: 16, marginBottom: 12, resize: 'none', color: '#222', background: '#fff', boxSizing: 'border-box', minHeight: 48 }}
              rows={2}
            />
            <button
              onClick={handleSaveMood}
              style={{ width: '100%', background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '12px 0', cursor: 'pointer', marginBottom: 0, boxShadow: 'none', letterSpacing: 0.5 }}
            >
              Save Mood Entry
            </button>
          </div>
          <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="trend">📈</span> Mood Summary
              </div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 18 }}>Your emotional wellness overview</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Average Mood (7 days)</div>
              <MoodBar value={avgMood === '-' ? 0 : avgMood} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8 }}>
                <div style={{ background: LIGHT_BLUE, borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 22, color: BLUE }}>{daysTracked}</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{avgMood}/5</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: trend === 'Declining' ? '#e53935' : trend === 'Improving' ? '#43a047' : '#607d8b' }}>{trend}</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="calendar">🗓️</span> Recent Mood Entries
              </div>
              {moodLoading ? (
                <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>Loading...</div>
              ) : moodEntries.length === 0 ? (
                <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>No mood entries yet.</div>
              ) : (
                <div style={{ maxHeight: 340, overflowY: 'auto', paddingRight: 8 }}>
                  {moodEntries.map((entry, idx) => {
                    const meta = moodMeta[entry.mood] || { icon: '😐', color: BLUE };
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#f9fbfd', borderRadius: 12, padding: '16px 18px', marginBottom: 12, boxShadow: '0 1px 4px rgba(33,150,243,0.04)', border: '1px solid #e3f0fd' }}>
                        <div style={{ fontSize: 28, marginRight: 16 }}>{meta.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 16, color: '#222' }}>{entry.date ? entry.date.slice(0, 10) : ''}</div>
                          <div style={{ color: '#607d8b', fontSize: 15, marginTop: 2 }}>{entry.note}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: meta.color, marginLeft: 12 }}>{entry.mood}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {tab === 'Resources' && (
        showBreathing ? (
          <GuidedBreathingExercise onEnd={() => setShowBreathing(false)} />
        ) : showMeditation ? (
          meditationStep === 'select' ? (
            <MeditationSelection
              onSelect={med => { setSelectedMeditation(med); setMeditationStep('session'); }}
              onBack={() => setShowMeditation(false)}
            />
          ) : (
            <GuidedMeditationSession
              meditation={selectedMeditation}
              onEnd={() => { setMeditationStep('select'); setShowMeditation(false); }}
            />
          )
        ) : showSleepHygiene ? (
          <SleepHygieneGuide onBack={() => setShowSleepHygiene(false)} />
        ) : showStress ? (
          <StressManagementSession onBack={() => setShowStress(false)} />
        ) : (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
            {resourcesLoading ? (
              <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>Loading...</div>
            ) : resourcesError ? (
              <div style={{ color: 'red', fontSize: 16, padding: 24 }}>{resourcesError}</div>
            ) : resources.length === 0 ? (
              <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>No resources found.</div>
            ) : resources.map((r, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{r.title}</div>
                <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>{r.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ background: LIGHT_BLUE, color: BLUE, borderRadius: 8, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>{r.tag}</span>
                  <span style={{ color: '#607d8b', fontSize: 15 }}>{r.duration}</span>
                </div>
                <button
                  style={{ background: BLUE, color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', width: '100%', cursor: 'pointer', marginTop: 8 }}
                  onClick={() => {
                    if (r.title === 'Breathing Exercises') setShowBreathing(true);
                    else if (r.title === 'Meditation Sessions') {
                      setShowMeditation(true);
                      setMeditationStep('select');
                      setSelectedMeditation(null);
                    } else if (r.title === 'Sleep Hygiene') {
                      setShowSleepHygiene(true);
                    } else if (r.title === 'Stress Management') {
                      setShowStress(true);
                    }
                  }}
                >
                  Start Session
                </button>
              </div>
            ))}
          </div>
        )
      )}
      {tab === 'Counselors' && (
        activeCounselor && counselorMode === 'chat' ? (
          <CounselorChatSession counselor={activeCounselor} onBack={() => { setActiveCounselor(null); setCounselorMode(null); }} />
        ) : activeCounselor && counselorMode === 'video' ? (
          <CounselorVideoSession counselor={activeCounselor} onBack={() => { setActiveCounselor(null); setCounselorMode(null); }} />
        ) : (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
            {counselorsLoading ? (
              <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>Loading...</div>
            ) : counselorsError ? (
              <div style={{ color: 'red', fontSize: 16, padding: 24 }}>{counselorsError}</div>
            ) : counselors.length === 0 ? (
              <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>No counselors found.</div>
            ) : counselors.map((c, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: 340, maxWidth: 420, background: '#fff', borderRadius: 16, padding: 36, boxShadow: 'none', border: '1.5px solid #e3eaf5', marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Brain SVG icon */}
                <div style={{ marginBottom: 18 }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8c-4.418 0-8 3.582-8 8v2c-2.21 0-4 1.79-4 4v2c-2.21 0-4 1.79-4 4v2c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8v-2c0-2.21-1.79-4-4-4v-2c0-2.21-1.79-4-4-4v-2c0-4.418-3.582-8-8-8z" stroke="#111" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 2, textAlign: 'center' }}>{c.name}</div>
                <div style={{ color: '#222', fontSize: 18, marginBottom: 18, textAlign: 'center' }}>{c.specialty}</div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ color: '#8ca0b3', fontSize: 16 }}>Experience</div>
                  <div style={{ fontWeight: 500, fontSize: 17 }}>{c.experience} years</div>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ color: '#8ca0b3', fontSize: 16 }}>Rating</div>
                  <div style={{ fontWeight: 500, fontSize: 17 }}>{c.rating}/5</div>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ color: '#8ca0b3', fontSize: 16 }}>Fee</div>
                  <div style={{ fontWeight: 500, fontSize: 17 }}>₹{c.fee}/session</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {c.languages.map((lang, i) => (
                    <span key={i} style={{ background: LIGHT_BLUE, color: BLUE, borderRadius: 16, padding: '4px 16px', fontWeight: 600, fontSize: 15 }}>{lang}</span>
                  ))}
                </div>
                <div style={{ color: '#222', fontWeight: 500, fontSize: 16, marginBottom: 18, textAlign: 'center' }}>
                  Available {c.available === 'Today' ? <b style={{ color: BLUE }}>Today</b> : <b>{c.available}</b>}
                </div>
                <div style={{ display: 'flex', gap: 18, width: '100%', marginTop: 'auto' }}>
                  <button onClick={() => { setActiveCounselor(c); setCounselorMode('video'); }} style={{ flex: 1, background: '#fff', color: '#222', border: '1.5px solid #dbeafe', borderRadius: 10, padding: '14px 0', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Video
                  </button>
                  <button onClick={() => { setActiveCounselor(c); setCounselorMode('chat'); }} style={{ flex: 1, background: '#fff', color: '#222', border: '1.5px solid #dbeafe', borderRadius: 10, padding: '14px 0', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5-2 4-2 4 2 4 2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {tab === 'Insights' && (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {insightsLoading ? (
            <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>Loading...</div>
          ) : insightsError ? (
            <div style={{ color: 'red', fontSize: 16, padding: 24 }}>{insightsError}</div>
          ) : !insights ? (
            <div style={{ color: '#607d8b', fontSize: 16, padding: 24 }}>No insights found.</div>
          ) : (
            <>
              {/* Weekly Insights Card */}
              <div style={{ flex: 1, minWidth: 380, background: '#fff', borderRadius: 16, padding: 32, border: '1.5px solid #e3eaf5', marginBottom: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10, color: '#222' }}>
                  <span style={{ fontSize: 22, color: BLUE }} role="img" aria-label="insights">💡</span> Weekly Insights
                </div>
                <div style={{ color: '#8ca0b3', fontSize: 16, marginBottom: 18, fontWeight: 400 }}>AI-powered analysis of your mental wellness</div>
                <div style={{ background: LIGHT_BLUE, borderRadius: 12, padding: '14px 18px', marginBottom: 18 }}>
                  <div style={{ color: BLUE, fontWeight: 700, fontSize: 17, marginBottom: 2 }}>Mood Pattern</div>
                  <div style={{ color: '#222', fontSize: 15 }} dangerouslySetInnerHTML={{ __html: formatAIResponse(insights.moodPattern) }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#111' }}>Positive Trigger</div>
                <div style={{ color: '#8ca0b3', fontSize: 15, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: formatAIResponse(insights.positiveTrigger) }} />
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#111' }}>Sleep Impact</div>
                <div style={{ color: '#8ca0b3', fontSize: 15 }} dangerouslySetInnerHTML={{ __html: formatAIResponse(insights.sleepImpact) }} />
              </div>
              {/* Personalized Recommendations Card */}
              <div style={{ flex: 1, minWidth: 380, background: '#fff', borderRadius: 16, padding: 32, border: '1.5px solid #e3eaf5', marginBottom: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10, color: '#222' }}>
                  <span style={{ fontSize: 22, color: BLUE }} role="img" aria-label="recommend">♡</span> Personalized Recommendations
                </div>
                <div style={{ color: '#8ca0b3', fontSize: 16, marginBottom: 18, fontWeight: 400 }}>Tailored strategies for better mental health</div>
                {insights.recommendations.map((rec, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 2 }}>{rec.title}</div>
                    <div style={{ color: '#8ca0b3', fontSize: 15 }} dangerouslySetInnerHTML={{ __html: formatAIResponse(rec.desc) }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MentalHealthCompanion; 