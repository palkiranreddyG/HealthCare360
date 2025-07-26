import React, { useState } from 'react';

const BLUE = '#2196f3';
const GRADIENT = 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)';
const LIGHT_BLUE = '#e3f0fd';
const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

const guide = [
  {
    icon: '⏰',
    title: 'Environment',
    tips: [
      'Keep your bedroom cool (60-67°F)',
      'Use blackout curtains or eye mask',
      'Reduce noise or use white noise',
      'Invest in a comfortable mattress',
    ],
  },
  {
    icon: '⏰',
    title: 'Routine',
    tips: [
      'Go to bed at the same time every night',
      'Create a relaxing bedtime ritual',
      'Avoid screens 1 hour before bed',
      'Try reading or gentle stretching',
    ],
  },
  {
    icon: '⏰',
    title: 'Lifestyle',
    tips: [
      'Limit caffeine after 2 PM',
      'Avoid large meals before bedtime',
      'Get sunlight exposure during the day',
      'Exercise regularly but not close to bedtime',
    ],
  },
  {
    icon: '⏰',
    title: 'Mental',
    tips: [
      'Practice gratitude journaling',
      'Try meditation or deep breathing',
      'Keep a worry journal to clear your mind',
      'Use progressive muscle relaxation',
    ],
  },
];

export default function SleepHygieneGuide({ onBack }) {
  const [rating, setRating] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!rating) return;
    try {
      // Get user ID from localStorage
      let user = null;
      try {
        const userObj = JSON.parse(localStorage.getItem('user'));
        user = userObj?._id || userObj?.userId || null;
      } catch {}
      await fetch(`${BACKEND_URL}/api/sleep-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, user }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      alert('Failed to save assessment');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ fontWeight: 800, fontSize: 36, marginBottom: 6, textAlign: 'center' }}>Sleep Hygiene Guide</div>
      <div style={{ color: '#8ca0b3', fontSize: 20, marginBottom: 36, fontWeight: 500, textAlign: 'center' }}>Evidence-based tips for better sleep and mental wellness</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, width: '100%', justifyContent: 'center', marginBottom: 32 }}>
        {guide.map((g, idx) => (
          <div key={g.title} style={{ flex: '1 1 340px', minWidth: 340, background: '#fff', borderRadius: 16, border: '1.5px solid #e3eaf5', padding: 32, marginBottom: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 26, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <span style={{ fontSize: 26, color: '#222' }}>⏰</span> {g.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {g.tips.map((tip, i) => (
                <div key={i} style={{ color: '#111', fontSize: 18, marginBottom: 6, textAlign: 'left' }}>{tip}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', background: GRADIENT, borderRadius: 16, padding: 36, margin: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: '#fff', marginBottom: 10 }}>Sleep Quality Assessment</div>
        <div style={{ color: '#e3f0fd', fontSize: 20, marginBottom: 24 }}>Rate your sleep quality from the past week</div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => setRating(num)}
              style={{ width: 60, height: 60, borderRadius: 12, fontSize: 28, fontWeight: 700, background: rating === num ? '#fff' : 'rgba(255,255,255,0.15)', color: rating === num ? BLUE : '#fff', border: rating === num ? `2px solid ${BLUE}` : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          style={{ background: 'none', color: '#fff', border: '2px solid #fff', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 20, cursor: 'pointer', marginTop: 8 }}
        >
          {saved ? 'Saved!' : 'Save Assessment'}
        </button>
      </div>
      <button onClick={onBack} style={{ marginTop: 12, background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '14px 36px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Resources
      </button>
    </div>
  );
} 