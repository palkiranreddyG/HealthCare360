import React, { useState } from 'react';
import './SignIn.css';

const SignIn = ({ onSwitchToSignUp, onBackToLanding, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [accountType, setAccountType] = useState('user'); // 'user' or 'admin'
  const [role, setRole] = useState('doctor');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: accountType === 'admin' ? role : 'user'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful!');
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        // Redirect to dashboard
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        {/* Header/Logo */}
        <div className="signin-header">
          <div className="signin-logo">
            <img src={require('../assets/logo.png')} alt="Health Care 360° Logo" className="signin-logo-icon" />
            <div className="signin-logo-texts">
              <span className="signin-logo-text">Health Care 360°</span>
              <span className="signin-logo-subtext">AI-Powered Care</span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="signin-welcome">
          <h1 className="signin-title">Welcome Back</h1>
        </div>



        {/* Sign In Form */}
        <form className="signin-form" onSubmit={handleSubmit}>
          {/* Account Type Selector */}
          <div className="signin-field">
            <label className="signin-label">Sign in as</label>
            <select className="signin-input" value={accountType} onChange={e => setAccountType(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Admin Type Dropdown (only if Admin) */}
          {accountType === 'admin' && (
            <div className="signin-field">
              <label className="signin-label">Admin Type</label>
              <select className="signin-input" value={role} onChange={e => setRole(e.target.value)} required>
                <option value="doctor">Doctor</option>
                <option value="medicine_hub">Medicine Delivery Hub</option>
                <option value="diagnostic_center">Diagnostic Center</option>
              </select>
            </div>
          )}

          {/* Email Field */}
          <div className="signin-field">
            <label className="signin-label">Email</label>
            <div className="signin-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#666"/>
              </svg>
              <input
                type="email"
                className="signin-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="signin-field">
            <label className="signin-label">Password</label>
            <div className="signin-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#666"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                className="signin-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="signin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {showPassword ? (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#666"/>
                  ) : (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#666"/>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Form Options */}
          <div className="signin-options">
            <label className="signin-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="signin-checkbox-text">Remember me</span>
            </label>
            <a href="#forgot-password" className="signin-forgot-link">Forgot password?</a>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="signin-signup">
          <span>Don't have an account? </span>
          <button onClick={onSwitchToSignUp} className="signin-signup-link">Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 