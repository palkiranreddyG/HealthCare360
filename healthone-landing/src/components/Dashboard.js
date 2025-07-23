import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const mockUser = {
  name: 'John Doe',
  healthScore: 85,
  checkups: 4,
  medications: 2,
  reports: 12,
  activities: [
    { text: 'Symptom check completed', time: '2 hours ago' },
    { text: 'Prescription refilled', time: '1 day ago' },
    { text: 'Video consultation', time: '3 days ago' },
    { text: 'Health report generated', time: '1 week ago' },
  ],
  upcoming: [
    { doctor: 'Dr. Sarah Wilson', specialty: 'Cardiology', time: 'Today, 2:30 PM' },
    { doctor: 'Dr. Mike Chen', specialty: 'Dermatology', time: 'Tomorrow, 10:00 AM' },
  ]
};

const Dashboard = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.fullName) setUserName(user.fullName);
      else if (user && user.name) setUserName(user.name);
    } catch (e) {}
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <div className="dashboard-header-left">
          <h1 className="dashboard-welcome">Welcome back, {userName}!</h1>
          <div className="dashboard-subtitle">Your health dashboard is ready</div>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-healthscore-badge">Health Score: {mockUser.healthScore}%</div>
          <button className="dashboard-notifications-btn">Notifications</button>
        </div>
      </div>
      <div className="dashboard-features-row">
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon dashboard-feature-icon-ai" />
          <div className="dashboard-feature-title">AI Symptom Checker</div>
          <div className="dashboard-feature-desc">Get instant health insights</div>
        </div>
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon dashboard-feature-icon-wound" />
          <div className="dashboard-feature-title">Wound Analyzer</div>
          <div className="dashboard-feature-desc">Analyze injuries with AI</div>
        </div>
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon dashboard-feature-icon-video" />
          <div className="dashboard-feature-title">Video Consultation</div>
          <div className="dashboard-feature-desc">Connect with doctors</div>
        </div>
        <div className="dashboard-feature-card">
          <div className="dashboard-feature-icon dashboard-feature-icon-medicine" />
          <div className="dashboard-feature-title">Medicine Delivery</div>
          <div className="dashboard-feature-desc">Order prescriptions</div>
        </div>
      </div>
      <div className="dashboard-metrics-row">
        <div className="dashboard-metrics-title">Health Metrics</div>
        <div className="dashboard-metrics-cards">
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{mockUser.healthScore}%</div>
            <div className="dashboard-metric-label">Health Score</div>
            <div className="dashboard-metric-change">↑ +5%</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{mockUser.checkups}</div>
            <div className="dashboard-metric-label">Checkups</div>
            <div className="dashboard-metric-change">↑ +2</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{mockUser.medications}</div>
            <div className="dashboard-metric-label">Medications</div>
            <div className="dashboard-metric-change">0</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{mockUser.reports}</div>
            <div className="dashboard-metric-label">Reports</div>
            <div className="dashboard-metric-change">↑ +3</div>
          </div>
        </div>
      </div>
      <div className="dashboard-main-row">
        <div className="dashboard-activities-col">
          <div className="dashboard-section-title">Recent Activities</div>
          <div className="dashboard-activities-list">
            {mockUser.activities.map((a, i) => (
              <div className="dashboard-activity-item" key={i}>
                <span className="dashboard-activity-dot" />
                <span className="dashboard-activity-text">{a.text}</span>
                <span className="dashboard-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-upcoming-col">
          <div className="dashboard-section-title">Upcoming</div>
          <div className="dashboard-upcoming-list">
            {mockUser.upcoming.map((u, i) => (
              <div className="dashboard-upcoming-item" key={i}>
                <div className="dashboard-upcoming-doctor">{u.doctor}</div>
                <div className="dashboard-upcoming-specialty">{u.specialty}</div>
                <div className="dashboard-upcoming-time">{u.time}</div>
              </div>
            ))}
          </div>
          <button className="dashboard-schedule-btn">Schedule New</button>
        </div>
      </div>
      <div className="dashboard-bottom-row">
        <div className="dashboard-bottom-card dashboard-bottom-records">
          <div className="dashboard-bottom-title">Health Records</div>
          <div className="dashboard-bottom-desc">Digital health ID & reports</div>
          <button className="dashboard-bottom-btn">Access Records</button>
        </div>
        <div className="dashboard-bottom-card dashboard-bottom-education">
          <div className="dashboard-bottom-title">Health Education</div>
          <div className="dashboard-bottom-desc">AR guides & health literacy</div>
          <button className="dashboard-bottom-btn">Learn More</button>
        </div>
        <div className="dashboard-bottom-card dashboard-bottom-community">
          <div className="dashboard-bottom-title">Community</div>
          <div className="dashboard-bottom-desc">Health forum & support</div>
          <button className="dashboard-bottom-btn">Join Community</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 