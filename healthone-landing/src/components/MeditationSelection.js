import React from 'react';

const meditations = [
  {
    key: 'mindful',
    title: 'Mindful Breathing',
    desc: 'Focus on your breath to center your mind',
    duration: '5 minutes',
  },
  {
    key: 'bodyscan',
    title: 'Body Scan',
    desc: 'Progressive relaxation through body awareness',
    duration: '10 minutes',
  },
  {
    key: 'loving',
    title: 'Loving Kindness',
    desc: 'Cultivate compassion for yourself and others',
    duration: '15 minutes',
  },
];

export default function MeditationSelection({ onSelect, onBack }) {
  return (
    <div style={{ maxWidth: 700, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ fontWeight: 800, fontSize: 32, marginBottom: 8, textAlign: 'center' }}>Choose Your Meditation</div>
      <div style={{ color: '#8ca0b3', fontSize: 19, marginBottom: 32, fontWeight: 500, textAlign: 'center' }}>Select a guided meditation session</div>
      {meditations.map(med => (
        <div
          key={med.key}
          onClick={() => onSelect(med)}
          style={{ width: '100%', background: '#fff', borderRadius: 14, border: '1.5px solid #e3eaf5', padding: '28px 32px', marginBottom: 24, cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(33,150,243,0.04)' }}
        >
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{med.title}</div>
          <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 10 }}>{med.desc}</div>
          <span style={{ background: '#e3f8ff', color: '#21a1f3', borderRadius: 16, padding: '6px 16px', fontWeight: 600, fontSize: 15 }}>{med.duration}</span>
        </div>
      ))}
      <button onClick={onBack} style={{ marginTop: 12, background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '14px 36px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Resources
      </button>
    </div>
  );
} 