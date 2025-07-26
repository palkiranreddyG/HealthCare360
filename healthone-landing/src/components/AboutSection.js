import React from 'react';
import './AboutSection.css';

const AboutSection = (props) => (
  <section className="about-section" id="about" {...props}>
    <h2 className="about-title">
      Revolutionizing <span className="about-title-accent">Healthcare</span> Access
    </h2>
    <p className="about-subtitle">
      Born from the vision of democratizing healthcare across India, HealthOne leverages cutting-edge AI<br />
      to bridge the gap between advanced medical care and rural communities.
    </p>
    <div className="about-main-row">
      <div className="about-card about-mission">
        <div className="about-card-title"><span role="img" aria-label="target">🎯</span> Our Mission</div>
        <div className="about-card-desc">
          To make quality healthcare accessible to every Indian, especially in underserved rural areas, through AI-powered diagnostic tools, telemedicine platforms, and comprehensive health management solutions that work in local languages and understand local contexts.
        </div>
      </div>
      <div className="about-card about-why">
        <div className="about-card-title about-why-title">Why HealthOne?</div>
        <ul className="about-why-list">
          <li><span role="img" aria-label="globe">🌐</span> <b>28+ Languages Supported</b><br /><span className="about-why-desc">Native language support for every Indian state and union territory</span></li>
          <li><span role="img" aria-label="shield">🛡️</span> <b>99.9% Accuracy Rate</b><br /><span className="about-why-desc">AI models trained on diverse Indian health data for precise diagnostics</span></li>
          <li><span role="img" aria-label="clock">⏰</span> <b>24/7 AI Support</b><br /><span className="about-why-desc">Round-the-clock health assistance powered by advanced AI</span></li>
          <li><span role="img" aria-label="check">✔️</span> <b>ABDM Integrated</b><br /><span className="about-why-desc">Seamlessly integrated with India's digital health ecosystem</span></li>
        </ul>
      </div>
    </div>
    <div className="about-main-row">
      <div className="about-card about-vision">
        <div className="about-card-title"><span role="img" aria-label="eye">👁️</span> Our Vision</div>
        <div className="about-card-desc">
          A future where geographical boundaries don't limit access to healthcare, where AI assistants can provide instant medical guidance in every Indian language, and where preventive care becomes the norm rather than the exception.
        </div>
      </div>
      <div className="about-card about-values">
        <div className="about-card-title"><span role="img" aria-label="handshake">🤝</span> Our Values</div>
        <div className="about-values-list">
          <div><span role="img" aria-label="check">✔️</span> Accessibility First</div>
          <div><span role="img" aria-label="check">✔️</span> Cultural Sensitivity</div>
          <div><span role="img" aria-label="check">✔️</span> Privacy Focused</div>
          <div><span role="img" aria-label="check">✔️</span> Innovation Driven</div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection; 