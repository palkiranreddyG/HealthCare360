import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  let userId = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userId = user?._id || user?.userId || null;
  } catch (e) {}

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.fullName) setUserName(user.fullName);
      else if (user && user.name) setUserName(user.name);
    } catch (e) {}
  }, []);

  // Add a function to fetch dashboard data
  const fetchDashboardData = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/user-dashboard/${userId}`)
      .then(res => res.json())
      .then(data => { setDashboardData(data); setLoading(false); })
      .catch(e => { setError('Failed to load dashboard'); setLoading(false); });
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh on tab/page visibility
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [userId]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!dashboardData) return <div style={{ padding: 40, textAlign: 'center' }}>No dashboard data.</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <div className="dashboard-header-left">
          <h1 className="dashboard-welcome">Welcome back, {userName}!</h1>
          <div className="dashboard-subtitle">Your health dashboard is ready</div>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-healthscore-badge">Health Score: {dashboardData.healthScore}%</div>
          <button className="dashboard-notifications-btn" onClick={() => setShowNotifications(true)}>Notifications</button>
          <button className="dashboard-refresh-btn dashboard-notifications-btn" onClick={fetchDashboardData} style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="refresh">🔄</span> Refresh
          </button>
        </div>
      </div>
      <div className="dashboard-features-row">
        <div className="dashboard-feature-card" onClick={() => {
          localStorage.setItem('openFeature', 'symptomChecker');
          window.location.href = '/';
        }} style={{ cursor: 'pointer' }}>
          <div className="dashboard-feature-icon dashboard-feature-icon-ai" />
          <div className="dashboard-feature-title">AI Symptom Checker</div>
          <div className="dashboard-feature-desc">Get instant health insights</div>
        </div>
        <div className="dashboard-feature-card" onClick={() => {
          localStorage.setItem('openFeature', 'familyMode');
          window.location.href = '/';
        }} style={{ cursor: 'pointer' }}>
          <div className="dashboard-feature-icon dashboard-feature-icon-family" />
          <div className="dashboard-feature-title">Family Mode</div>
          <div className="dashboard-feature-desc">Manage your family’s health in one place</div>
        </div>
        <div className="dashboard-feature-card" onClick={() => {
          localStorage.setItem('openFeature', 'telemedicine');
          window.location.href = '/';
        }} style={{ cursor: 'pointer' }}>
          <div className="dashboard-feature-icon dashboard-feature-icon-video" />
          <div className="dashboard-feature-title">Video Consultation</div>
          <div className="dashboard-feature-desc">Connect with doctors</div>
        </div>
        <div className="dashboard-feature-card" onClick={() => {
          localStorage.setItem('openFeature', 'medicineDelivery');
          window.location.href = '/';
        }} style={{ cursor: 'pointer' }}>
          <div className="dashboard-feature-icon dashboard-feature-icon-medicine" />
          <div className="dashboard-feature-title">Medicine Delivery</div>
          <div className="dashboard-feature-desc">Order prescriptions</div>
        </div>
      </div>
      <div className="dashboard-metrics-row">
        <div className="dashboard-metrics-title">Health Metrics</div>
        <div className="dashboard-metrics-cards">
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{dashboardData.healthScore}%</div>
            <div className="dashboard-metric-label">Health Score</div>
            <div className="dashboard-metric-change">↑ +5%</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{dashboardData.checkups}</div>
            <div className="dashboard-metric-label">Checkups</div>
            <div className="dashboard-metric-change">↑ +2</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{dashboardData.medications}</div>
            <div className="dashboard-metric-label">Medications</div>
            <div className="dashboard-metric-change">0</div>
          </div>
          <div className="dashboard-metric-card">
            <div className="dashboard-metric-value">{dashboardData.reports}</div>
            <div className="dashboard-metric-label">Reports</div>
            <div className="dashboard-metric-change">↑ +3</div>
          </div>
        </div>
      </div>
      <div className="dashboard-main-row">
        <div className="dashboard-activities-col">
          <div className="dashboard-section-title">Recent Activities</div>
          <div className="dashboard-activities-list">
            {dashboardData.activities.map((a, i) => (
              <div className="dashboard-activity-item" key={i}>
                <span className="dashboard-activity-dot" />
                <span className="dashboard-activity-text">
                  {a.type === 'feature' && a.description.startsWith('Visited feature: ')
                    ? `Visited ${a.description.replace('Visited feature: ', '')}`
                    : a.description}
                </span>
                <span className="dashboard-activity-time">{a.time ? new Date(a.time).toLocaleString() : ''}</span>
              </div>
            ))}
          </div>
          <button className="dashboard-schedule-btn" style={{ marginTop: 18 }} onClick={() => {
            localStorage.setItem('openFeature', 'telemedicine');
            window.location.href = '/';
          }}>Schedule New</button>
        </div>
        <div className="dashboard-upcoming-col">
          <div className="dashboard-section-title">Notifications</div>
          <div className="dashboard-upcoming-notifications">
            {dashboardData.notifications.length === 0 && <div style={{ color: '#b0c4d6', textAlign: 'center', marginBottom: 8 }}>No notifications.</div>}
            {dashboardData.notifications.map((n, i) => (
              <div key={i} className="dashboard-upcoming-notification-item">
                <div>{n.message}</div>
                <div style={{ color: '#7a8ca3', fontSize: 13 }}>{n.time}</div>
              </div>
            ))}
          </div>
          <div className="dashboard-upcoming-list">
            {dashboardData.upcoming.map((u, i) => {
              const dateObj = u.time ? new Date(u.time) : null;
              const timeStr = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              const dateStr = dateObj ? dateObj.toLocaleDateString() : '';
              return (
                <div className="dashboard-upcoming-item" key={i}>
                  <div className="dashboard-upcoming-desc">
                    You have an appointment with Dr. {u.doctor} ({u.specialty}) at {timeStr} on {dateStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="dashboard-bottom-row">
        <div className="dashboard-bottom-card dashboard-bottom-records">
          <div className="dashboard-bottom-title">Health Records</div>
          <div className="dashboard-bottom-desc">Digital health ID & reports</div>
          <button className="dashboard-bottom-btn" onClick={() => navigate('/health-records')}>Access Records</button>
        </div>
        <div className="dashboard-bottom-card dashboard-bottom-education">
          <div className="dashboard-bottom-title">Health Education</div>
          <div className="dashboard-bottom-desc">AR guides & health literacy</div>
          <button className="dashboard-bottom-btn" onClick={() => navigate('/education')}>Learn More</button>
        </div>
        <div className="dashboard-bottom-card dashboard-bottom-community">
          <div className="dashboard-bottom-title">Community</div>
          <div className="dashboard-bottom-desc">Health forum & support</div>
          <button className="dashboard-bottom-btn" onClick={() => navigate('/community')}>Join Community</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 