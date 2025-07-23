import React from 'react';
import './JoinSection.css';

const JoinSection = () => (
  <section className="join-section">
    <div className="join-badge-row">
      <button className="join-badge">Join the Healthcare Revolution</button>
    </div>
    <h1 className="join-title">
      Ready to Experience the Future<br />of <span className="join-title-accent">Healthcare?</span>
    </h1>
    <div className="join-subtitle">
      Join thousands of healthcare professionals and patients who are already transforming<br />
      health outcomes with HealthOne's AI-powered platform.
    </div>
    <div className="join-buttons-row">
      <button className="join-btn join-btn-primary">Start Your Health Journey <span className="join-btn-arrow">→</span></button>
      <button className="join-btn join-btn-secondary"><span className="join-btn-icon">⚙️</span> Explore AI Features</button>
    </div>
  </section>
);

export default JoinSection; 