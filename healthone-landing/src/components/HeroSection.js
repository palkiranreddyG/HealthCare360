import React from 'react';
import './HeroSection.css';
import StatsSection from './StatsSection';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-icon">⚙️</span>
          India's Most Advanced AI Healthcare Platform
        </div>
        <h1 className="hero-title">Health Care 360°</h1>
        <p className="hero-subtitle">
          Revolutionary AI-powered healthcare ecosystem that brings <b>world-class medical care</b> to every corner of <span className="hero-india">India</span> through intelligent diagnosis and comprehensive health management.
        </p>
        <div className="hero-buttons">
          <button className="hero-btn hero-btn-primary">
            Start Your Health Journey <span className="hero-btn-arrow">→</span>
          </button>
          <button className="hero-btn hero-btn-secondary">
            <span className="hero-btn-play">▶</span> Watch Platform Demo
          </button>
        </div>
      </div>
      <div style={{color: 'red', fontSize: 32, textAlign: 'center'}}>TEST</div>
      <StatsSection />
    </section>
  );
};

export default HeroSection; 