import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-main-row">
      <div className="footer-brand-col">
        <div className="footer-brand-row">
          <img src={require('../assets/logo.png')} alt="HealthOne Logo" className="footer-logo" />
          <div className="footer-brand-block">
            <span className="footer-brand-blue">HealthOne</span>
            <span className="footer-brand-gray">AI-Powered Healthcare</span>
          </div>
        </div>
        <div className="footer-desc centered">
          Revolutionizing healthcare delivery across India with AI-powered diagnostic tools, telemedicine platforms, and comprehensive health management solutions.
        </div>
        <div className="footer-badges-row centered">
          <span className="footer-outline-badge"><span className="footer-badge-icon">🛡️</span> HIPAA Compliant</span>
          <span className="footer-outline-badge"><span className="footer-badge-icon">✔️</span> ABDM Integrated</span>
        </div>
      </div>
      <div className="footer-links-cols">
        <div className="footer-col">
          <div className="footer-col-title">AI Features</div>
          <a href="#features">Symptom Checker</a>
          <a href="#features">Wound Analyzer</a>
          <a href="#features">Telemedicine</a>
          <a href="#features">Smart Delivery</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Resources</div>
          <a href="#">Health Education</a>
          <a href="#">Community Forum</a>
          <a href="#">API Docs</a>
          <a href="#">Support</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Company</div>
          <a href="#about">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom centered">
      <div className="footer-copyright">
        © 2024 HealthOne. All rights reserved. Built for SDG 3 - Good Health and Well-being.<br />
        Empowering healthcare accessibility across India through AI innovation.
      </div>
    </div>
  </footer>
);

export default Footer; 