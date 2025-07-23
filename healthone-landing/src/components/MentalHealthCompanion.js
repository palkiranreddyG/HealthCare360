import React, { useState } from 'react';

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

  // Fetch mood entries from backend
  React.useEffect(() => {
    if (tab === 'Mood Tracker') {
      setMoodLoading(true);
      fetch('/api/mood')
        .then(res => res.json())
        .then(data => { setMoodEntries(data); setMoodLoading(false); })
        .catch(() => { setMoodError('Failed to load mood entries'); setMoodLoading(false); });
    }
  }, [tab]);

  // Save mood entry to backend
  const handleSaveMood = async () => {
    if (!selectedMood) return;
    setMoodLoading(true);
    setMoodError('');
    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood.label, note: moodNote })
      });
      if (res.ok) {
        setMoodNote('');
        setSelectedMood(null);
        // Refresh mood entries
        const entries = await fetch('/api/mood').then(r => r.json());
        setMoodEntries(entries);
      } else {
        setMoodError('Failed to save mood entry');
      }
    } catch (err) {
      setMoodError('Network error');
    }
    setMoodLoading(false);
  };

  // AI Chat logic
  const handleSend = async () => {
    if (!userInput.trim()) return;
    setChat([...chat, { sender: 'user', text: userInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setUserInput('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini-chat/chat', {
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
  const avgMood = 3.3;
  const trend = 'Declining';
  const daysTracked = 7;

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
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="chat">💬</span> AI Mental Health Assistant
          </div>
          <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 18 }}>Safe, confidential, and available 24/7 for emotional support</div>
          <div style={{ background: LIGHT_BLUE, borderRadius: 10, padding: 18, minHeight: 120, marginBottom: 18 }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div style={{
                  background: msg.sender === 'user' ? '#e3f0fd' : '#fff',
                  color: '#222',
                  borderRadius: 8,
                  padding: '10px 16px',
                  maxWidth: 400,
                  fontSize: 16,
                  boxShadow: '0 1px 4px rgba(33,150,243,0.07)',
                }}>
                  {msg.text}
                  <div style={{ fontSize: 12, color: '#607d8b', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{ background: '#fff', color: BLUE, borderRadius: 8, padding: '10px 16px', maxWidth: 400, fontSize: 16, fontStyle: 'italic', boxShadow: '0 1px 4px rgba(33,150,243,0.07)' }}>
                  Gemini is typing...
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, borderRadius: 8, border: `1.5px solid ${LIGHT_BLUE}`, padding: 12, fontSize: 16 }}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={handleSend}
              style={{ background: BLUE, color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 24px', cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      {tab === 'Mood Tracker' && (
        <>
          <div style={{ background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', borderRadius: 14, padding: 28, marginBottom: 32 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
              <span role="img" aria-label="heart">💙</span> How are you feeling today?
            </div>
            <div style={{ color: '#e3f0fd', marginBottom: 18 }}>Track your mood to better understand your emotional patterns</div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 18 }}>
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood(m)}
                  style={{
                    background: selectedMood?.label === m.label ? '#fff' : 'transparent',
                    color: selectedMood?.label === m.label ? '#2196f3' : '#fff',
                    border: '2px solid #fff',
                    borderRadius: 10,
                    padding: '18px 24px',
                    fontSize: 20,
                    fontWeight: 600,
                    minWidth: 110,
                    cursor: 'pointer',
                    boxShadow: selectedMood?.label === m.label ? '0 2px 8px rgba(33,150,243,0.12)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32 }}>{m.icon}</div>
                  {m.label}
                </button>
              ))}
            </div>
            <textarea
              value={moodNote}
              onChange={e => setMoodNote(e.target.value)}
              placeholder="Add a note about your mood (optional)..."
              style={{ width: '100%', borderRadius: 8, border: 'none', padding: 14, fontSize: 16, marginBottom: 12, resize: 'none' }}
              rows={2}
            />
            <button
              onClick={handleSaveMood}
              style={{ width: '100%', background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 18, border: '2px solid #fff', borderRadius: 8, padding: '12px 0', cursor: 'pointer', marginBottom: 0 }}
            >
              Save Mood Entry
            </button>
            {moodLoading && <div style={{ color: '#fff', marginTop: 8 }}>Loading...</div>}
            {moodError && <div style={{ color: '#fff', marginTop: 8 }}>{moodError}</div>}
          </div>
          <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="trend">📈</span> Mood Summary
              </div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 18 }}>Your emotional wellness overview</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Average Mood (7 days)</div>
              <MoodBar value={avgMood} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8 }}>
                <div style={{ background: LIGHT_BLUE, borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 22, color: BLUE }}>{daysTracked}</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{avgMood}/5</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: trend === 'Declining' ? '#e53935' : '#43a047' }}>{trend}</div>
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
                moodEntries.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx < moodEntries.length - 1 ? `1px solid ${LIGHT_BLUE}` : 'none', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{entry.date ? entry.date.slice(0, 10) : ''}</div>
                      <div style={{ color: '#607d8b', fontSize: 15 }}>{entry.note}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: entry.mood === 'Happy' ? '#43a047' : entry.mood === 'Sad' ? '#e53935' : '#607d8b' }}>{entry.mood}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
      {tab === 'Resources' && (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {mockResources.map((r, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{r.title}</div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>{r.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ background: LIGHT_BLUE, color: BLUE, borderRadius: 8, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>{r.tag}</span>
                <span style={{ color: '#607d8b', fontSize: 15 }}>{r.duration}</span>
              </div>
              <button style={{ background: BLUE, color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', width: '100%', cursor: 'pointer', marginTop: 8 }}>Start Session</button>
            </div>
          ))}
        </div>
      )}
      {tab === 'Counselors' && (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {mockCounselors.map((c, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>🧠</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{c.name}</div>
                  <div style={{ color: '#607d8b', fontSize: 15 }}>{c.specialty}</div>
                </div>
              </div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>Experience: <b>{c.experience} years</b></div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>Rating: <b>{c.rating}/5</b></div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>Fee: <b>₹{c.fee}/session</b></div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {c.languages.map((lang, i) => (
                  <span key={i} style={{ background: LIGHT_BLUE, color: BLUE, borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 14 }}>{lang}</span>
                ))}
              </div>
              <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 8 }}>Available {c.available === 'Today' ? <b style={{ color: BLUE }}>Today</b> : <b>{c.available}</b>}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button style={{ background: '#fff', color: BLUE, border: `2px solid ${BLUE}`, borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Video</button>
                <button style={{ background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Chat</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'Insights' && (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="insights">💡</span> Weekly Insights
            </div>
            <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 12 }}>AI-powered analysis of your mental wellness</div>
            <div style={{ background: LIGHT_BLUE, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ color: BLUE, fontWeight: 700, fontSize: 16 }}>Mood Pattern</div>
              <div style={{ color: '#222', fontSize: 15 }}>{mockInsights.moodPattern}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Positive Trigger</div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 12 }}>{mockInsights.positiveTrigger}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Sleep Impact</div>
            <div style={{ color: '#222', fontSize: 15 }}>{mockInsights.sleepImpact}</div>
          </div>
          <div style={{ flex: 1, minWidth: 340, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="recommend">💙</span> Personalized Recommendations
            </div>
            <div style={{ color: '#607d8b', fontSize: 15, marginBottom: 12 }}>Tailored strategies for better mental health</div>
            {mockInsights.recommendations.map((rec, idx) => (
              <div key={idx} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{rec.title}</div>
                <div style={{ color: '#222', fontSize: 15 }}>{rec.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthCompanion; 