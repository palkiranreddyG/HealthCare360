import React from 'react';
import './Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleGoBack = () => {
    if (location.pathname === '/health-records') {
      navigate('/');
    } else if (props.onGoBack) {
      props.onGoBack();
    }
  };
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
      {(!props.dashboard) && (
        <ul className="navbar-links">
          <li><button className="navbar-link-btn" onClick={() => props.onNavigateSection('home')}>Home</button></li>
          <li><button className="navbar-link-btn" onClick={() => props.onNavigateSection('features')}>Features</button></li>
          <li><button className="navbar-link-btn" onClick={() => props.onNavigateSection('about')}>About</button></li>
          <li><button className="navbar-link-btn" onClick={() => props.onNavigateSection('contact')}>Contact</button></li>
        </ul>
      )}
      <div className="navbar-actions">
        {props.dashboard ? (
          <>
            <button className="navbar-goback" onClick={handleGoBack}>Go Back</button>
            <button className="navbar-logout" onClick={props.onLogout}>Logout</button>
          </>
        ) : props.loggedIn ? (
          <button className="navbar-dashboard" onClick={props.onGoToDashboard}>Go to Dashboard</button>
        ) : (
          <>
            <button className="navbar-login" onClick={props.onLoginClick}>Login</button>
            <button className="navbar-getstarted" onClick={props.onSignUpClick}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 