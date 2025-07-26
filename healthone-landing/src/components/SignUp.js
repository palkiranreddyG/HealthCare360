import React, { useState } from 'react';
import './SignUp.css';

const SignUp = ({ onSwitchToSignIn, onBackToLanding, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [accountType, setAccountType] = useState('user'); // 'user' or 'admin'
  const [role, setRole] = useState('doctor');
  const [validDoc, setValidDoc] = useState(null);
  const [docError, setDocError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDocError('');
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    if (accountType === 'admin' && !validDoc) {
      setDocError('Please upload valid documents for admin signup.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: accountType === 'admin' ? role : 'user'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Account created successfully!');
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        // Redirect to dashboard
        if (typeof onLoginSuccess === 'function') onLoginSuccess();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header/Logo */}
        <div className="signup-header">
          <div className="signup-logo">
            <img src={require('../assets/logo.png')} alt="Health Care 360° Logo" className="signup-logo-icon" />
            <div className="signup-logo-texts">
              <span className="signup-logo-text">Health Care 360°</span>
              <span className="signup-logo-subtext">AI-Powered Care</span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="signup-welcome">
          <p className="signup-subtitle">Create your account to get started with AI-powered healthcare</p>
        </div>

        {/* Security Banner */}
        <div className="signup-security-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
          </svg>
          <span><strong>Secure:</strong> Your health data is protected with end-to-end encryption</span>
        </div>

        {/* Sign Up Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Account Type Selector */}
          <div className="signup-field">
            <label className="signup-label">Register as</label>
            <select className="signup-input" value={accountType} onChange={e => setAccountType(e.target.value)} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Admin Type Dropdown (only if Admin) */}
          {accountType === 'admin' && (
            <div className="signup-field">
              <label className="signup-label">Admin Type</label>
              <select className="signup-input" value={role} onChange={e => setRole(e.target.value)} required>
                <option value="doctor">Doctor</option>
                <option value="medicine_hub">Medicine Delivery Hub</option>
                <option value="diagnostic_center">Diagnostic Center</option>
              </select>
            </div>
          )}

          {/* Full Name Field */}
          <div className="signup-field">
            <label className="signup-label">Full Name</label>
            <div className="signup-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#666"/>
              </svg>
              <input
                type="text"
                name="fullName"
                className="signup-input"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="signup-field">
            <label className="signup-label">Email Address</label>
            <div className="signup-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#666"/>
              </svg>
              <input
                type="email"
                name="email"
                className="signup-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="signup-field">
            <label className="signup-label">Phone Number</label>
            <div className="signup-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#666"/>
              </svg>
              <input
                type="tel"
                name="phone"
                className="signup-input"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="signup-field">
            <label className="signup-label">Password</label>
            <div className="signup-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#666"/>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="signup-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="signup-password-toggle"
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

          {/* Confirm Password Field */}
          <div className="signup-field">
            <label className="signup-label">Confirm Password</label>
            <div className="signup-input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#666"/>
              </svg>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="signup-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {showConfirmPassword ? (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#666"/>
                  ) : (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="#666"/>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Valid Documents Field (only for admin) */}
          {accountType === 'admin' && (
            <div className="signup-field">
              <label className="signup-label">Valid Documents</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={e => setValidDoc(e.target.files[0])}
                required={accountType === 'admin'}
                className="signup-input"
              />
              {docError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{docError}</div>}
            </div>
          )}

          {/* Terms and Privacy */}
          <div className="signup-terms">
            <label className="signup-checkbox">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="signup-checkbox-text">
                I agree to the <a href="#terms" className="signup-link">Terms of Service</a> and <a href="#privacy" className="signup-link">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <div className="signup-signin">
          <span>Already have an account? </span>
          <button onClick={onSwitchToSignIn} className="signup-signin-link">Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 