import React, { useEffect, useRef, useState } from 'react';

const BLUE = '#2196f3';
const GRADIENT = 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)';
const LIGHT_BLUE = '#e3f0fd';

const MEDITATIONS = {
  mindful: {
    title: 'Mindful Breathing',
    subtitle: 'Focus on your breath to center your mind',
    duration: 300,
  },
  bodyscan: {
    title: 'Body Scan',
    subtitle: 'Progressive relaxation through body awareness',
    duration: 600,
  },
  loving: {
    title: 'Loving Kindness',
    subtitle: 'Cultivate compassion for yourself and others',
    duration: 900,
  },
};

export default function GuidedMeditationSession({ meditation, onEnd }) {
  const meta = meditation && MEDITATIONS[meditation.key] ? MEDITATIONS[meditation.key] : MEDITATIONS.mindful;
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef();

  useEffect(() => {
    timer.current = setInterval(() => {
      setElapsed(e => {
        if (e < meta.duration) return e + 1;
        clearInterval(timer.current);
        if (onEnd) onEnd();
        return e;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [onEnd, meta.duration]);

  // Format time left
  const timeLeft = meta.duration - elapsed;
  const formatTime = s => `${String(Math.floor(s / 60)).padStart(1, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = Math.min(1, elapsed / meta.duration);

  // End session handler
  const handleEnd = () => {
    clearInterval(timer.current);
    if (onEnd) onEnd();
  };

  // Sound handler (placeholder)
  const handleSound = () => {
    // Optionally play/pause sound here
    alert('Sound feature coming soon!');
  };

  return (
    <div style={{ maxWidth: 700, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontSize: 28, color: BLUE }} role="img" aria-label="insights">💡</span>
        <span style={{ fontWeight: 700, fontSize: 32 }}>{meta.title}</span>
      </div>
      <div style={{ color: '#8ca0b3', fontSize: 19, marginBottom: 32, fontWeight: 500 }}>{meta.subtitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ width: 260, height: 260, borderRadius: '50%', background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 700, color: '#111', marginBottom: 18, boxShadow: '0 2px 16px rgba(33,150,243,0.08)' }}>
          <div style={{ color: '#111', fontWeight: 700, fontSize: 48 }}>{formatTime(timeLeft)}</div>
          <div style={{ color: '#222', fontWeight: 400, fontSize: 20, position: 'absolute', marginTop: 60 }}>remaining</div>
        </div>
        <div style={{ width: 420, height: 10, borderRadius: 8, background: LIGHT_BLUE, margin: '18px 0 0 0', position: 'relative' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: BLUE, borderRadius: 8, transition: 'width 0.3s' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
        <button onClick={handleSound} style={{ background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '18px 36px', fontWeight: 600, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19 12c0-2.21-1.79-4-4-4"/><path d="M19 12c0 2.21-1.79 4-4 4"/></svg>
        </button>
        <button onClick={handleEnd} style={{ background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '18px 36px', fontWeight: 600, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 12 12 12 12 21"/></svg>
        </button>
      </div>
    </div>
  );
} 