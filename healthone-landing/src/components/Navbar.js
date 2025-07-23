import React from 'react';
import './Navbar.css';

const Navbar = ({ onLoginClick, onSignUpClick, dashboard, onGoBack, onProfileClick, onGoToDashboard, loggedIn, onLogout, onContactClick, contact }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo-icon" aria-label="Health Care 360° Logo">
          <img src={require('../assets/logo.png')} alt="Health Care 360° Logo" style={{width: '48px', height: '48px'}} />
        </div>
        <div className="navbar-logo-texts">
          <span className="navbar-logo-text">Health Care 360°</span>
          <span className="navbar-logo-subtext navbar-logo-subtext-gray">AI-Powered Care</span>
        </div>
      </div>
      {(!dashboard) && (
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      )}
      <div className="navbar-actions">
        {dashboard ? (
          <>
            <button className="navbar-goback" onClick={onGoBack}>Go Back</button>
            <button className="navbar-logout" onClick={onLogout}>Logout</button>
          </>
        ) : loggedIn ? (
          <button className="navbar-dashboard" onClick={onGoToDashboard}>Go to Dashboard</button>
        ) : (
          <>
            <button className="navbar-login" onClick={onLoginClick}>Login</button>
            <button className="navbar-getstarted" onClick={onSignUpClick}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 