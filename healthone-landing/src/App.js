import React, { useState, useEffect } from 'react';
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
import VisualAIAnalyzer from './components/VisualAIAnalyzer';
import FirstAidTrainer from './components/FirstAidTrainer';
import CommunityHealthForum from './components/CommunityHealthForum';
import ChronicDiseaseTracker from './components/ChronicDiseaseTracker';
import TelemedicinePlatform from './components/TelemedicinePlatform';
import SmartMedicineDelivery from './components/SmartMedicineDelivery';
import DigitalHealthRecords from './components/DigitalHealthRecords';
import FamilyModeDashboard from './components/FamilyModeDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import MedicineHubDashboard from './components/MedicineHubDashboard';
import DiagnosticLabDashboard from './components/DiagnosticLabDashboard';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'signin', or 'signup'
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showMentalHealthCompanion, setShowMentalHealthCompanion] = useState(false);
  const [showVisualAIAnalyzer, setShowVisualAIAnalyzer] = useState(false);
  const [showFirstAidTrainer, setShowFirstAidTrainer] = useState(false);
  const [showCommunityHealthForum, setShowCommunityHealthForum] = useState(false);
  const [showChronicTracker, setShowChronicTracker] = useState(false);
  const [showFamilyMode, setShowFamilyMode] = useState(false);

  useEffect(() => {
    // On landing page mount, check for openFeature flag
    if (window.location.pathname === '/') {
      const openFeature = localStorage.getItem('openFeature');
      if (openFeature === 'symptomChecker') {
        setShowSymptomChecker(true);
        localStorage.removeItem('openFeature');
      } else if (openFeature === 'familyMode') {
        setShowFamilyMode(true);
        localStorage.removeItem('openFeature');
      } else if (openFeature === 'telemedicine') {
        setShowChronicTracker(false);
        setShowFamilyMode(false);
        setShowSymptomChecker(false);
        setShowMentalHealthCompanion(false);
        setShowVisualAIAnalyzer(false);
        setShowFirstAidTrainer(false);
        setShowCommunityHealthForum(false);
        setShowChronicTracker(false);
        setTimeout(() => setShowChronicTracker(false), 0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          window.location.href = '/telemedicine';
        }, 100);
        localStorage.removeItem('openFeature');
      } else if (openFeature === 'medicineDelivery') {
        window.location.href = '/medicine-delivery';
        localStorage.removeItem('openFeature');
      }
      // Scroll to section if scrollToSection is set
      const scrollToSection = localStorage.getItem('scrollToSection');
      if (scrollToSection) {
        // Use a longer delay to ensure the page is fully rendered
        setTimeout(() => {
          if (scrollToSection === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const el = document.getElementById(scrollToSection);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              console.log('Section not found:', scrollToSection);
            }
          }
          localStorage.removeItem('scrollToSection');
        }, 500); // Increased delay to 500ms
      }
    }
  }, []);

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
    setShowVisualAIAnalyzer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowVisualAIAnalyzer = () => {
    setShowVisualAIAnalyzer(true);
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowMentalHealthCompanion = () => {
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowFirstAidTrainer = () => {
    setShowFirstAidTrainer(true);
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(false);
    setShowVisualAIAnalyzer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowCommunityHealthForum = () => {
    setShowCommunityHealthForum(true);
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(false);
    setShowVisualAIAnalyzer(false);
    setShowFirstAidTrainer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowFamilyMode = () => {
    setShowFamilyMode(true);
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(false);
    setShowVisualAIAnalyzer(false);
    setShowFirstAidTrainer(false);
    setShowCommunityHealthForum(false);
    setShowChronicTracker(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowDigitalHealthRecords = () => {
    window.location.href = '/health-records';
  };

  // Handler for navbar section navigation from feature routes
  const handleNavigateFromFeature = (sectionId) => {
    console.log('handleNavigateFromFeature called with sectionId:', sectionId);
    // Store the section to scroll to
    localStorage.setItem('scrollToSection', sectionId);
    // Navigate to landing page using window.location.href
    window.location.href = '/';
  };

  // Handler for navbar section navigation
  const handleNavigateSection = (sectionId) => {
    setCurrentPage('landing');
    setShowSymptomChecker(false);
    setShowMentalHealthCompanion(false);
    setShowVisualAIAnalyzer(false);
    setShowFirstAidTrainer(false);
    setShowCommunityHealthForum(false);
    setShowChronicTracker(false);
    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100); // Wait for landing page to render
  };

  if (currentPage === 'signin') {
    return <SignIn onSwitchToSignUp={handleSwitchToSignUp} onBackToLanding={handleBackToLanding} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'signup') {
    return <SignUp onSwitchToSignIn={handleSwitchToSignIn} onBackToLanding={handleBackToLanding} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'dashboard') {
    // Role-based dashboard routing
    let userRole = 'user';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      userRole = user?.role || 'user';
    } catch (e) {}
    if (userRole === 'doctor') {
      return <DoctorDashboard />;
    }
    if (userRole === 'medicine_hub') {
      return <MedicineHubDashboard />;
    }
    if (userRole === 'diagnostic_center') {
      return <DiagnosticLabDashboard />;
    }
    // Add more admin dashboards here as needed
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
    <Routes>
      <Route path="/" element={
        <div className="App">
          <Navbar
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
            loggedIn={loggedIn}
            onGoToDashboard={handleGoToDashboard}
            onNavigateSection={handleNavigateSection}
          />
          {!showSymptomChecker && !showMentalHealthCompanion && !showVisualAIAnalyzer && !showFirstAidTrainer && !showCommunityHealthForum && !showChronicTracker && !showFamilyMode && <>
            <HeroSection loggedIn={loggedIn} />
            <FeaturesSection
              onExploreFeature={handleExploreFeature}
              onExploreMentalHealthCompanion={handleShowMentalHealthCompanion}
              onExploreFamilyMode={handleShowFamilyMode}
              onExploreVisualAIAnalyzer={handleShowVisualAIAnalyzer}
              onExploreFirstAidTrainer={handleShowFirstAidTrainer}
              onExploreCommunityHealthForum={handleShowCommunityHealthForum}
              onShowChronicTracker={() => setShowChronicTracker(true)}
              onShowDigitalHealthRecords={handleShowDigitalHealthRecords}
            />
            <AboutSection id="about" />
            <ContactSection id="contact" />
            <JoinSection />
          </>}
          {showSymptomChecker && !showMentalHealthCompanion && !showVisualAIAnalyzer && !showFirstAidTrainer && !showCommunityHealthForum && <SymptomChecker />}
          {showMentalHealthCompanion && !showVisualAIAnalyzer && !showFirstAidTrainer && !showCommunityHealthForum && <MentalHealthCompanion />}
          {showVisualAIAnalyzer && !showFirstAidTrainer && !showCommunityHealthForum && <VisualAIAnalyzer />}
          {showFirstAidTrainer && !showCommunityHealthForum && <FirstAidTrainer />}
          {showCommunityHealthForum && <CommunityHealthForum />}
          {showChronicTracker && <ChronicDiseaseTracker onClose={() => setShowChronicTracker(false)} />}
          {showFamilyMode && <FamilyModeDashboard onClose={() => setShowFamilyMode(false)} />}
          <Footer />
        </div>
      } />
      <Route path="/telemedicine" element={<><Navbar loggedIn={loggedIn} onGoToDashboard={handleGoToDashboard} onNavigateSection={handleNavigateFromFeature} /><TelemedicinePlatform /></>} />
      <Route path="/medicine-delivery" element={<><Navbar loggedIn={loggedIn} onGoToDashboard={handleGoToDashboard} onNavigateSection={handleNavigateFromFeature} /><SmartMedicineDelivery /></>} />
      <Route path="/health-records" element={<><Navbar loggedIn={loggedIn} onGoToDashboard={handleGoToDashboard} onNavigateSection={handleNavigateFromFeature} /><DigitalHealthRecords /></>} />
      <Route path="/family-mode" element={<><Navbar loggedIn={loggedIn} onGoToDashboard={handleGoToDashboard} onNavigateSection={handleNavigateFromFeature} /><FamilyModeDashboard /></>} />
      <Route path="/symptom-checker" element={<><Navbar loggedIn={loggedIn} onGoToDashboard={handleGoToDashboard} onNavigateSection={handleNavigateFromFeature} /><SymptomChecker /></>} />
    </Routes>
  );
}

export default App;
