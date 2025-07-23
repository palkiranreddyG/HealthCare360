import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import JoinSection from './components/JoinSection';
import SymptomChecker from './components/SymptomChecker';
import MentalHealthCompanion from './components/MentalHealthCompanion';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'signin', or 'signup'
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showMentalHealthCompanion, setShowMentalHealthCompanion] = useState(false);

  const handleLoginClick = () => {
    setShowSymptomChecker(false);
    setCurrentPage('signin');
  };

  const handleSignUpClick = () => {
    setShowSymptomChecker(false);
    setCurrentPage('signup');
  };

  const handleBackToLanding = () => {
    setShowSymptomChecker(false);
    setCurrentPage('landing');
  };

  const handleSwitchToSignUp = () => {
    setShowSymptomChecker(false);
    setCurrentPage('signup');
  };

  const handleSwitchToSignIn = () => {
    setShowSymptomChecker(false);
    setCurrentPage('signin');
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleGoToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedIn(false);
    setShowSymptomChecker(false);
    setCurrentPage('landing');
  };

  // Handler for Explore Feature button in FeaturesSection
  const handleExploreFeature = () => {
    setShowSymptomChecker(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowMentalHealthCompanion = () => {
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'signin') {
    return <SignIn onSwitchToSignUp={handleSwitchToSignUp} onBackToLanding={handleBackToLanding} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'signup') {
    return <SignUp onSwitchToSignIn={handleSwitchToSignIn} onBackToLanding={handleBackToLanding} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <>
        <Navbar
          dashboard
          onGoBack={handleBackToLanding}
          onProfileClick={() => alert('Profile clicked')}
          onLogout={handleLogout}
        />
        <Dashboard />
      </>
    );
  }

  // Landing page
  return (
    <div className="App">
      <Navbar
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        loggedIn={loggedIn}
        onGoToDashboard={handleGoToDashboard}
      />
      {!showSymptomChecker && !showMentalHealthCompanion && <>
        <HeroSection loggedIn={loggedIn} />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <button
            style={{ background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '16px 32px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(33,150,243,0.10)' }}
            onClick={handleShowMentalHealthCompanion}
          >
            Open Mental Health Companion
          </button>
        </div>
        <FeaturesSection
          onExploreFeature={handleExploreFeature}
          onExploreMentalHealthCompanion={handleShowMentalHealthCompanion}
        />
        <AboutSection id="about" />
        <ContactSection id="contact" />
        <JoinSection />
      </>}
      {showSymptomChecker && !showMentalHealthCompanion && <SymptomChecker />}
      {showMentalHealthCompanion && <MentalHealthCompanion />}
      <Footer />
    </div>
  );
}

export default App;
