import React, { useState } from 'react';
import './FeaturesSection.css';
import ChronicDiseaseTracker from './ChronicDiseaseTracker';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'AI Symptom Checker',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
    ),
    description: 'Advanced conversational AI for instant symptom analysis and smart health triage',
    points: [
      'Real-time symptom analysis',
      'NLP and ML-powered diagnosis',
      'Voice assistant interface',
      'Multilingual support',
    ],
    badges: ['99.2% Accuracy', '2s Response'],
    button: 'Explore Feature',
  },
  {
    title: 'Family Mode',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="10" r="3" fill="#1976d2"/>
        <circle cx="16" cy="10" r="3" fill="#21c6fb"/>
        <rect x="4" y="15" width="16" height="5" rx="2.5" fill="#e3f0fd"/>
      </svg>
    ),
    description: 'Manage your family’s health in one place. Add family members, track their records, and get personalized care suggestions.',
    points: [
      'Add and manage family profiles',
      'Centralized health records',
      'Family vaccination & checkup reminders',
      'Personalized family wellness tips',
    ],
    badges: ['New!'],
    button: 'Explore Feature',
  },
  {
    title: 'Telemedicine Platform',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/>
      </svg>
    ),
    description: 'Seamless video consultations with healthcare professionals',
    points: [
      'HD video consultations',
      'Smart specialist routing',
      'Instant appointment booking',
      'Digital prescription system',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'Smart Medicine Delivery',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3h12v2H6zm11 3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 9h-2v2h-2v-2H9v-2h2V9h2v2h2v2z" fill="currentColor"/>
      </svg>
    ),
    description: 'AI-powered medicine ordering with home delivery and smart refill reminders',
    points: [
      'Nearby pharmacy network',
      'Smart prescription uploads',
      'Real-time delivery tracking',
      'AI-powered refill reminders',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'Digital Health Records',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
      </svg>
    ),
    description: 'Aadhaar-integrated comprehensive patient history and medical continuity',
    points: [
      'Blockchain-secured records',
      'ABDM integration',
      'Instant access anywhere',
      'Doctor-patient sharing',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'Chronic Disease Tracker',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/>
      </svg>
    ),
    description: 'Predictive monitoring and management of chronic health conditions',
    points: [
      'Diabetes & BP monitoring',
      'Wearable integration',
      'Predictive health alerts',
      'Treatment optimization',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'First-Aid Trainer',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="currentColor"/>
      </svg>
    ),
    description: 'Interactive 3D animations and regional-language emergency care tutorials',
    points: [
      '3D animated instructions',
      'Regional language support',
      'Emergency care protocols',
      'CPR and first-aid training',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'Mental Health Companion',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
      </svg>
    ),
    description: 'AI-powered mental health support with mood tracking and crisis intervention',
    points: [
      '24/7 AI emotional support',
      'Mood pattern analysis',
      'Crisis intervention protocols',
      'Professional counselor network',
    ],
    badges: [],
    button: 'Explore Feature',
  },
  {
    title: 'Community Health Forum',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V15h-1.5v-3.5l-1.7-2.26A2.5 2.5 0 0 0 8.54 8H7.46c-.8 0-1.54.37-2.01 1L2.5 16H5v6h15z" fill="currentColor"/>
      </svg>
    ),
    description: 'Verified peer support and expert-moderated health discussions',
    points: [
      'Peer support networks',
      'Expert-verified content',
      'Health Q&A platform',
      'Community challenges',
    ],
    badges: [],
    button: 'Explore Feature',
  },
];

const FeaturesSection = (props) => {
  const navigate = useNavigate();
  return (
    <section className="features-section" id="features">
      <h2 className="features-title">Complete Healthcare <span className="features-title-accent">Ecosystem</span></h2>
      <p className="features-subtitle">
        Nine integrated AI-powered modules designed to revolutionize healthcare delivery across India, with special focus on rural and underserved communities.
      </p>
      <div className="features-cards">
        {features.map((feature, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            {feature.badges && feature.badges.length > 0 && (
              <div className="feature-badges">
                {feature.badges.map((badge, index) => (
                  <span key={index} className="feature-badge-pill">{badge}</span>
                ))}
              </div>
            )}
            <ul className="feature-points">
              {feature.points.map((point, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px', flexShrink: 0}}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#007AFF"/>
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
            {feature.button && (
              <button
                className="feature-btn"
                onClick={async () => {
                  // Log activity for feature visit
                  let userId = null;
                  try {
                    const user = JSON.parse(localStorage.getItem('user'));
                    userId = user?._id || user?.userId || null;
                  } catch (e) {}
                  if (userId) {
                    await fetch(`/api/user-dashboard/${userId}/activities`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'feature',
                        description: `Visited feature: ${feature.title}`,
                        time: new Date(),
                      }),
                    });
                  }
                  if (feature.title === 'Telemedicine Platform') {
                    navigate('/telemedicine');
                  } else if (feature.title === 'Smart Medicine Delivery') {
                    navigate('/medicine-delivery');
                  } else if (feature.title === 'Chronic Disease Tracker') {
                    props.onShowChronicTracker && props.onShowChronicTracker();
                  } else if (feature.title === 'Digital Health Records' && props.onShowDigitalHealthRecords) {
                    props.onShowDigitalHealthRecords();
                  } else if (idx === 0 && props.onExploreFeature) {
                    props.onExploreFeature();
                  } else if (feature.title === 'Family Mode' && props.onExploreFamilyMode) {
                    props.onExploreFamilyMode();
                  } else if (feature.title === 'Mental Health Companion' && props.onExploreMentalHealthCompanion) {
                    props.onExploreMentalHealthCompanion();
                  } else if (feature.title === 'First-Aid Trainer' && props.onExploreFirstAidTrainer) {
                    props.onExploreFirstAidTrainer();
                  } else if (feature.title === 'Community Health Forum' && props.onExploreCommunityHealthForum) {
                    props.onExploreCommunityHealthForum();
                  }
                }}
              >
                {feature.button}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 