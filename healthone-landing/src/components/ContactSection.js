import React from 'react';
import './ContactSection.css';

const ContactSection = (props) => (
  <section className="contact-section" id="contact" {...props}>
    <div className="contact-section-inner">
      {props.onBackToHome && (
        <button className="contact-back-btn" onClick={props.onBackToHome}>&larr; Back to Home</button>
      )}
      <h2 className="contact-title">
        Let's Transform Healthcare <span className="contact-title-accent">Together</span>
      </h2>
      <p className="contact-subtitle">
        Ready to revolutionize healthcare delivery? Connect with our team to explore partnerships, integrations, or learn more about our AI-powered solutions.
      </p>
      <div className="contact-main-row">
        <form className="contact-form">
          <div className="contact-form-title">Send us a Message</div>
          <div className="contact-form-row">
            <input className="contact-input" type="text" placeholder="Full Name" required />
            <input className="contact-input" type="email" placeholder="Email Address" required />
          </div>
          <div className="contact-form-row">
            <input className="contact-input" type="text" placeholder="Phone Number" required />
            <input className="contact-input" type="text" placeholder="Organization" />
          </div>
          <input className="contact-input" type="text" placeholder="Subject" required />
          <textarea className="contact-input contact-textarea" placeholder="Tell us about your healthcare needs, partnership ideas, or any questions you have about HealthOne..." required />
          <button className="contact-send-btn" type="submit">
            <span className="contact-send-icon">✈️</span> Send Message
          </button>
        </form>
        <div className="contact-info-card">
          <div className="contact-info-title">Reach Out Directly</div>
          <div className="contact-info-list">
            <div className="contact-info-item"><span className="contact-info-icon">📞</span> <b>Phone Support</b><br />+91 1800-123-HEALTH<br /><span className="contact-info-desc">24/7 Emergency Support</span></div>
            <div className="contact-info-item"><span className="contact-info-icon">✉️</span> <b>Email Us</b><br />hello@healthone.ai<br /><span className="contact-info-desc">Response within 4 hours</span></div>
            <div className="contact-info-item"><span className="contact-info-icon">📍</span> <b>Headquarters</b><br />Koramangala, Bangalore<br />Karnataka, India - 560034</div>
          </div>
        </div>
      </div>
      <div className="contact-support-row">
        <div className="contact-support-card">
          <div className="contact-support-title">🎧 Technical Support</div>
          <div className="contact-support-desc">For integration help, API documentation, and technical queries</div>
          <div className="contact-support-email">tech@healthone.ai</div>
        </div>
        <div className="contact-support-card">
          <div className="contact-support-title">🤝 Partnerships</div>
          <div className="contact-support-desc">Hospital integrations, healthcare provider partnerships</div>
          <div className="contact-support-email">partners@healthone.ai</div>
        </div>
        <div className="contact-support-card">
          <div className="contact-support-title">📅 Schedule Demo</div>
          <div className="contact-support-desc">Book a personalized demo for your healthcare institution</div>
          <button className="contact-support-btn">Book Now</button>
        </div>
        <div className="contact-support-card">
          <div className="contact-support-title">💬 Live Chat</div>
          <div className="contact-support-desc">Instant support through our AI-powered chat assistant</div>
          <button className="contact-support-btn">Start Chat</button>
        </div>
      </div>
      <div className="contact-guarantee-card">
        <div className="contact-guarantee-title">⚡ Quick Response Guarantee</div>
        <div className="contact-guarantee-desc">We're committed to responding to all inquiries within 4 hours during business days. For urgent healthcare matters, our 24/7 support line is always available.</div>
      </div>
    </div>
  </section>
);

export default ContactSection; 