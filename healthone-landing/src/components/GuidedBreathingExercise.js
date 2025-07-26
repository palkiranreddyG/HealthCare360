import React, { useEffect, useRef, useState } from 'react';

const BLUE = '#2196f3';
const LIGHT_BLUE = '#e3f0fd';

const PHASES = [
  { label: 'Inhale', duration: 4, desc: 'Breathe in deeply...' },
  { label: 'Hold', duration: 5, desc: 'Hold your breath...' },
  { label: 'Exhale', duration: 6, desc: 'Breathe out slowly...' },
  { label: 'Hold', duration: 5, desc: 'Hold your breath...' },
];

export default function GuidedBreathingExercise({ onEnd }) {
  const [state, setState] = useState({ phaseIdx: 0, count: PHASES[0].duration });
  const [cycles, setCycles] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [animate, setAnimate] = useState(true);
  const timer = useRef();

  useEffect(() => {
    setAnimate(true);
    const animTimeout = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(animTimeout);
  }, [state.phaseIdx]);

  useEffect(() => {
    timer.current = setInterval(() => {
      setState(prev => {
        if (prev.count > 1) {
          return { ...prev, count: prev.count - 1 };
        }
        // Next phase
        const nextIdx = prev.phaseIdx === PHASES.length - 1 ? 0 : prev.phaseIdx + 1;
        if (nextIdx === 0) setCycles(cy => cy + 1);
        return { phaseIdx: nextIdx, count: PHASES[nextIdx].duration };
      });
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(timer.current);
  }, []);

  // End session handler
  const handleEnd = () => {
    clearInterval(timer.current);
    if (onEnd) onEnd();
  };

  // Format elapsed time
  const formatTime = s => `${String(Math.floor(s / 60)).padStart(1, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Animated circle style
  const circleStyle = animate
    ? {
        width: 200,
        height: 200,
        borderRadius: '50%',
        border: `8px solid ${BLUE}`,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 56,
        fontWeight: 700,
        color: '#111',
        marginBottom: 18,
        transition: 'all 0.3s',
        boxShadow: '0 2px 16px rgba(33,150,243,0.08)',
      }
    : {
        width: 160,
        height: 160,
        borderRadius: '50%',
        border: `5px solid #e3eaf5`,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        fontWeight: 700,
        color: '#111',
        marginBottom: 18,
        transition: 'all 0.3s',
        boxShadow: '0 2px 16px rgba(33,150,243,0.08)',
      };

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8c-4.418 0-8 3.582-8 8v2c-2.21 0-4 1.79-4 4v2c-2.21 0-4 1.79-4 4v2c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8v-2c0-2.21-1.79-4-4-4v-2c0-2.21-1.79-4-4-4v-2c0-4.418-3.582-8-8-8z" stroke="#111" strokeWidth="2.2" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontWeight: 700, fontSize: 28 }}>Guided Breathing Exercise</span>
      </div>
      <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 32 }}>Follow the rhythm to reduce anxiety and stress</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={circleStyle}>{state.count}</div>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{PHASES[state.phaseIdx].label}</div>
        <div style={{ color: '#8ca0b3', fontSize: 16 }}>{PHASES[state.phaseIdx].desc}</div>
      </div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>{cycles}</div>
          <div style={{ color: '#8ca0b3', fontSize: 15 }}>Breath Cycles</div>
        </div>
        <div style={{ textAlign: 'center', background: LIGHT_BLUE, borderRadius: 12, padding: '12px 36px' }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: BLUE }}>{formatTime(elapsed)}</div>
          <div style={{ color: '#8ca0b3', fontSize: 15 }}>Time Elapsed</div>
        </div>
      </div>
      <button onClick={handleEnd} style={{ marginTop: 12, background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '14px 36px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 12 12 12 12 21"/></svg>
        End Session
      </button>
    </div>
  );
} 