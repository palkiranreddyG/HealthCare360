import React, { useState } from 'react';

const TECHNIQUES = [
  {
    title: '5-4-3-2-1 Grounding',
    steps: [
      '5 things you can see',
      '4 things you can touch',
      '3 things you can hear',
      '2 things you can smell',
      '1 thing you can taste',
    ],
  },
  {
    title: 'Progressive Muscle Relaxation',
    steps: [
      'Tense your toes for 5 seconds',
      'Release and relax your toes',
      'Tense your calves for 5 seconds',
      'Release and relax your calves',
      'Continue with each muscle group',
    ],
  },
  {
    title: 'Cognitive Restructuring',
    steps: [
      'Identify the stressful thought',
      'Ask: Is this thought realistic?',
      'Consider alternative perspectives',
      'Replace with a balanced thought',
      'Practice the new thought pattern',
    ],
  },
];

export default function StressManagementSession({ onBack }) {
  const [idx, setIdx] = useState(0);
  const technique = TECHNIQUES[idx];

  return (
    <div style={{ maxWidth: 700, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26, color: '#222' }}>🛡️</span> Stress Management Techniques
      </div>
      <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 18 }}>Learn and practice effective stress reduction methods</div>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, textAlign: 'center' }}>{technique.title}</div>
      {technique.steps.map((step, i) => (
        <div key={i} style={{ width: '100%', background: '#fff', borderRadius: 12, border: '1.5px solid #e3eaf5', padding: '18px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18, fontSize: 19, fontWeight: 500 }}>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#f7fafd', color: '#2196f3', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #e3eaf5' }}>{i + 1}</span>
          {step}
        </div>
      ))}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{ background: '#fff', color: '#8ca0b3', border: '1.5px solid #e3eaf5', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
        >
          Previous Technique
        </button>
        <div style={{ color: '#8ca0b3', fontSize: 16 }}>Progress: {idx + 1} / {TECHNIQUES.length}</div>
        <button
          onClick={() => setIdx(i => Math.min(TECHNIQUES.length - 1, i + 1))}
          disabled={idx === TECHNIQUES.length - 1}
          style={{ background: '#fff', color: '#2196f3', border: '1.5px solid #e3eaf5', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: idx === TECHNIQUES.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next Technique
        </button>
      </div>
      <button onClick={onBack} style={{ marginTop: 32, background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '14px 36px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Resources
      </button>
    </div>
  );
} 