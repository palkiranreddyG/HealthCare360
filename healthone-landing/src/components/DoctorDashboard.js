import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const mockDoctor = {
  name: 'Dr. Anusha',
  appointments: [
    { time: '9:00 AM', patient: 'Rohit Patel' },
    { time: '11:00 AM', patient: 'Aisha Verma' },
    { time: '3:00 PM', patient: 'Vikram Singh' },
  ],
  consultRequests: [
    { name: 'Alek Joshi', specialty: 'General Medicine', time: '10:24 AM' },
    { name: 'Sunita Reddy', specialty: 'General Medicine', time: '9:57 AM' },
    { name: 'Aishan Verma', specialty: 'General Medicine', time: '9:57 AM' },
  ],
  chat: [
    { sender: 'Mohan Kumar', message: 'Thank you, doctor!' },
  ],
};

const mockPatients = [
  { _id: 'p1', fullName: 'Rohit Patel', records: ['Blood Test: Normal', 'X-Ray: Clear', 'Prescription: Amoxicillin 500mg, 3x/day', 'ECG: Normal'] },
  { _id: 'p2', fullName: 'Aisha Verma', records: ['MRI: Normal', 'Prescription: Paracetamol 500mg, 2x/day', 'Allergy Test: Negative', 'Blood Pressure: 120/80'] },
  { _id: 'p3', fullName: 'Vikram Singh', records: ['ECG: Normal', 'Prescription: Ibuprofen 400mg, 2x/day', 'Cholesterol: Borderline', 'Ultrasound: Normal'] },
  { _id: 'p4', fullName: 'Priya Sharma', records: ['Blood Sugar: 110 mg/dL', 'Prescription: Metformin 500mg, 1x/day', 'Eye Test: Normal', 'Dental Checkup: Cavity filled'] },
  { _id: 'p5', fullName: 'Anil Kumar', records: ['X-Ray: Minor fracture', 'Prescription: Calcium tablets, 1x/day', 'Physiotherapy: 5 sessions', 'Follow-up: 2 weeks'] },
  { _id: 'p6', fullName: 'Sneha Rao', records: ['Thyroid Test: Normal', 'Prescription: Levothyroxine 50mcg, 1x/day', 'Vitamin D: Low', 'Supplements: Advised'] },
];

const mockChats = {
  p1: [
    { sender: 'Rohit Patel', text: 'Hello doctor, I have a mild fever.' },
    { sender: 'You', text: 'Take paracetamol and rest. Let me know if it persists.' },
    { sender: 'Rohit Patel', text: 'Thank you, doctor!' },
  ],
  p2: [
    { sender: 'Aisha Verma', text: 'Can I take my medicine after food?' },
    { sender: 'You', text: 'Yes, take it after food for best results.' },
  ],
  p3: [
    { sender: 'Vikram Singh', text: 'My cholesterol is borderline, what should I do?' },
    { sender: 'You', text: 'Reduce oily food and exercise regularly.' },
  ],
  p4: [
    { sender: 'Priya Sharma', text: 'Is my blood sugar level normal?' },
    { sender: 'You', text: 'Yes, your last report was normal.' },
  ],
  p5: [
    { sender: 'Anil Kumar', text: 'How long should I wear the cast?' },
    { sender: 'You', text: 'For at least 2 more weeks, then come for a checkup.' },
  ],
  p6: [
    { sender: 'Sneha Rao', text: 'Should I continue vitamin D supplements?' },
    { sender: 'You', text: 'Yes, continue for another month.' },
  ],
};

const mockConsultRequests = [
  { id: 'c1', patient: 'Aisha Verma', reason: 'Fever and headache', time: '2024-06-10 10:00 AM' },
  { id: 'c2', patient: 'Vikram Singh', reason: 'Routine checkup', time: '2024-06-11 11:30 AM' },
  { id: 'c3', patient: 'Priya Sharma', reason: 'Follow-up for diabetes', time: '2024-06-12 09:00 AM' },
  { id: 'c4', patient: 'Anil Kumar', reason: 'Fracture pain', time: '2024-06-13 02:00 PM' },
];
const mockForumPosts = [
  { id: 1, author: 'User1', question: 'How to manage diabetes?', replies: ['Eat healthy, exercise regularly.', 'Monitor blood sugar regularly.'] },
  { id: 2, author: 'User2', question: 'What is the best way to recover from flu?', replies: ['Rest, fluids, and paracetamol.', 'Consult a doctor if fever persists.'] },
  { id: 3, author: 'User3', question: 'Can I exercise with high blood pressure?', replies: ['Yes, but consult your doctor first.', 'Start with light exercises.'] },
  { id: 4, author: 'User4', question: 'What foods help boost immunity?', replies: ['Citrus fruits, garlic, and spinach.', 'Stay hydrated and sleep well.'] },
  { id: 5, author: 'User5', question: 'How often should I get a health checkup?', replies: ['Once a year is recommended.', 'More often if you have chronic conditions.'] },
];

// Add demo appointments data
const mockAppointments = [
  { id: 'a1', patient: 'Rohit Patel', reason: 'General Checkup', time: '2024-06-10 09:00 AM' },
  { id: 'a2', patient: 'Aisha Verma', reason: 'Fever Follow-up', time: '2024-06-10 10:30 AM' },
  { id: 'a3', patient: 'Vikram Singh', reason: 'Routine checkup', time: '2024-06-11 11:30 AM' },
  { id: 'a4', patient: 'Priya Sharma', reason: 'Diabetes Review', time: '2024-06-12 09:00 AM' },
  { id: 'a5', patient: 'Anil Kumar', reason: 'Fracture Review', time: '2024-06-13 02:00 PM' },
];

const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

const DoctorDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [consultRequests, setConsultRequests] = useState(mockConsultRequests);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [showForum, setShowForum] = useState(false);
  const [forumReply, setForumReply] = useState('');
  const [forumPosts, setForumPosts] = useState(mockForumPosts);

  // Fetch doctorId from localStorage
  let doctorId = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    doctorId = user?._id || user?.userId || null;
  } catch (e) {}

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.fullName) setDoctorName(user.fullName);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    // Fetch appointments
    fetch(`${BACKEND_URL}/api/doctor/${doctorId}/appointments`)
      .then(res => res.json())
      .then(data => { if (data.success) setAppointments(data.appointments); });
    // Fetch consult requests
    fetch(`${BACKEND_URL}/api/doctor/${doctorId}/consult-requests`)
      .then(res => res.json())
      .then(data => { if (data.success) setConsultRequests(data.requests); });
  }, [doctorId]);

  // When selectedPatient changes, load mock chat
  useEffect(() => {
    if (selectedPatient) {
      setChatMessages(mockChats[selectedPatient] || []);
    } else {
      setChatMessages([]);
    }
  }, [selectedPatient]);

  const handleAcceptConsult = (id) => {
    const req = consultRequests.find(r => r.id === id);
    if (req) setAcceptedRequests([...acceptedRequests, req]);
    setConsultRequests(consultRequests.filter(r => r.id !== id));
    if (!selectedPatient && req) setSelectedPatient(getPatientIdByName(req.patient));
  };
  const handleRejectConsult = (id) => {
    setConsultRequests(consultRequests.filter(r => r.id !== id));
    if (selectedPatient && acceptedRequests.every(r => getPatientIdByName(r.patient) !== selectedPatient)) setSelectedPatient('');
  };
  function getPatientIdByName(name) {
    const p = mockPatients.find(p => p.fullName === name);
    return p ? p._id : '';
  }

  // Calendar logic (simple placeholder)
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSendChat = () => {
    if (chatInput.trim() && selectedPatient) {
      setChatMessages([...chatMessages, { sender: 'You', text: chatInput }]);
      setChatInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Demo: clicking feature cards opens modals
  const handleFeatureClick = (feature) => {
    if (feature === 'history') {
      setHistoryPatient(mockPatients[0]);
      setShowPatientHistory(true);
    } else if (feature === 'forum') {
      setShowForum(true);
    }
  };

  return (
    <div className="admin-dashboard-root" style={{ background: '#f7faff', minHeight: '100vh' }}>
      <div className="admin-dashboard-header-row">
        <div className="admin-dashboard-header-left">
          <img src={require('../assets/logo.png')} alt="Health Care 360° Logo" className="admin-dashboard-logo" />
          <span className="admin-dashboard-logo-text">Health Care 360°</span>
        </div>
        <div className="admin-dashboard-header-right">
          <button
            style={{ border: '1px solid #b0c4d6', background: '#fff', borderRadius: 8, padding: '7px 18px', fontWeight: 500, color: '#1976d2', cursor: 'pointer' }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          >
            Logout
          </button>
        </div>
      </div>
      <h1 className="admin-dashboard-welcome" style={{ marginBottom: 18 }}>Welcome back, {doctorName || mockDoctor.name}!</h1>
      {/* Top row: feature cards */}
      <div className="admin-dashboard-feature-row" style={{ marginBottom: 32 }}>
        <div className="admin-dashboard-feature-card" style={{ alignItems: 'center', justifyContent: 'center' }} onClick={() => handleFeatureClick('calendar')}>
          <span className="admin-dashboard-feature-icon" style={{ color: '#1976d2', fontSize: 28, marginRight: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="4" fill="#e3f0fd"/><rect x="7" y="8" width="10" height="2" rx="1" fill="#1976d2"/><rect x="7" y="12" width="7" height="2" rx="1" fill="#1976d2"/></svg>
          </span>
          <span>View appointments</span>
        </div>
        <div className="admin-dashboard-feature-card" style={{ alignItems: 'center', justifyContent: 'center' }} onClick={() => handleFeatureClick('consults')}>
          <span className="admin-dashboard-feature-icon" style={{ color: '#1976d2', fontSize: 28, marginRight: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="4" fill="#e3f0fd"/><rect x="7" y="8" width="10" height="2" rx="1" fill="#1976d2"/><rect x="7" y="12" width="7" height="2" rx="1" fill="#1976d2"/></svg>
          </span>
          <span>Accept/reject consult requests</span>
        </div>
        <div className="admin-dashboard-feature-card" style={{ alignItems: 'center', justifyContent: 'center' }} onClick={() => handleFeatureClick('chat')}>
          <span className="admin-dashboard-feature-icon" style={{ color: '#1976d2', fontSize: 28, marginRight: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="4" fill="#e3f0fd"/><rect x="7" y="8" width="10" height="2" rx="1" fill="#1976d2"/><rect x="7" y="12" width="7" height="2" rx="1" fill="#1976d2"/></svg>
          </span>
          <span>Chat with patients</span>
        </div>
        <div className="admin-dashboard-feature-card" style={{ alignItems: 'center', justifyContent: 'center' }} onClick={() => handleFeatureClick('history')}>
          <span className="admin-dashboard-feature-icon" style={{ color: '#1976d2', fontSize: 28, marginRight: 12 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="4" fill="#e3f0fd"/><rect x="7" y="8" width="10" height="2" rx="1" fill="#1976d2"/><rect x="7" y="12" width="7" height="2" rx="1" fill="#1976d2"/></svg>
          </span>
          <span>Access patient history</span>
        </div>
      </div>
      {/* Bottom row: grid of cards */}
      {/* In the main grid, update to only two cards (Calendar and Chat), each wider for balance: */}
      <div className="admin-dashboard-main-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, marginTop: 24 }}>
        <div className="admin-dashboard-calendar-card" style={{ minWidth: 400, maxWidth: 520, padding: 40, borderRadius: 18 }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 10 }}>April {today.getFullYear()}</div>
          <div className="admin-dashboard-calendar-grid">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="admin-dashboard-calendar-day-label">{d}</div>)}
            {days.map(day => (
              <div
                key={day}
                className={`admin-dashboard-calendar-day${day === today.getDate() ? ' selected' : ''}`}
                onClick={() => setSelectedDate(new Date(today.getFullYear(), today.getMonth(), day))}
              >{day}</div>
            ))}
          </div>
          <div className="admin-dashboard-calendar-appts" style={{ marginTop: 18 }}>
            {appointments.map(a => (
              <div key={a._id} className="admin-dashboard-calendar-appt" style={{ fontWeight: 500 }}>{new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {a.user?.fullName || 'Patient'}</div>
            ))}
          </div>
          <button className="admin-dashboard-community-btn" style={{ marginTop: 18, fontWeight: 600 }} onClick={() => handleFeatureClick('forum')}>Reply to Community Health Forum posts</button>
        </div>
        <div className="admin-dashboard-chat-card" style={{ minWidth: 400, maxWidth: 520, padding: 40, borderRadius: 18 }}>
          <div className="admin-dashboard-chat-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 14 }}>Chat</div>
          {/* Patient selector */}
          <select
            className="admin-dashboard-chat-input"
            style={{ marginBottom: 10, fontSize: 15 }}
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
          >
            <option value="" disabled>Select patient</option>
            {mockPatients.map(p => (
              <option key={p._id} value={p._id}>{p.fullName}</option>
            ))}
          </select>
          <div className="admin-dashboard-chat-box" style={{ minHeight: 60, maxHeight: 120, marginBottom: 10 }}>
            {chatMessages.map((m, i) => (
              <div key={i} className="admin-dashboard-chat-message" style={{ fontSize: 15, marginBottom: 6 }}><b>{m.sender || 'You'}:</b> {m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            <input
              className="admin-dashboard-chat-input"
              placeholder="Type a message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
              style={{ fontSize: 15 }}
              disabled={!selectedPatient}
            />
            <button className="dashboard-notifications-btn" onClick={handleSendChat} style={{ marginLeft: 8, fontWeight: 600 }} disabled={!selectedPatient}>Send</button>
          </div>
        </div>
        {/* In the main grid, update the Appointments card to have a white background card: */}
        <div className="admin-dashboard-appointments-card" style={{ minWidth: 400, maxWidth: 520, padding: 40, borderRadius: 18, background: '#fff', boxShadow: '0 2px 8px 0 rgba(30, 136, 229, 0.07)' }}>
          <div className="admin-dashboard-appointments-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 18 }}>Appointments</div>
          {mockAppointments.map(a => (
            <div key={a.id} className="admin-dashboard-appointment-item" style={{ marginBottom: 14, fontSize: 17, fontWeight: 500 }}>
              <b>{a.patient}</b> - {a.reason} <span style={{ color: '#7a8ca3', fontSize: 13, fontWeight: 400 }}>({a.time})</span>
            </div>
          ))}
        </div>
      </div>
      {/* Second row: more consult requests and chat (optional, for full match) */}
      <div className="admin-dashboard-main-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24 }}>
        <div className="admin-dashboard-consult-card" style={{ minWidth: 260, padding: 24, borderRadius: 18 }}>
          <div style={{ marginTop: 32 }}>
            <div className="admin-dashboard-consult-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 14 }}>Consult Requests</div>
            {consultRequests.length === 0 && <div style={{ color: '#7a8ca3', marginBottom: 8 }}>No pending consult requests.</div>}
            {consultRequests.map(r => (
              <div key={r.id} className="admin-dashboard-consult-item" style={{ marginBottom: 16 }}>
                <div><b>{r.patient}</b> - {r.reason} <span style={{ color: '#7a8ca3', fontSize: 13 }}>({r.time})</span></div>
                <div style={{ marginTop: 6 }}>
                  <button className="dashboard-notifications-btn" style={{ marginRight: 8 }} onClick={() => handleAcceptConsult(r.id)}>Accept</button>
                  <button className="dashboard-modal-close-btn" onClick={() => handleRejectConsult(r.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* In the Access Patient History card, remove the button and show mock data directly: */}
        <div className="admin-dashboard-patient-card" style={{ minWidth: 400, maxWidth: 520, padding: 40, borderRadius: 18, background: '#fff', boxShadow: '0 2px 8px 0 rgba(30, 136, 229, 0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1976d2"><rect x="4" y="4" width="16" height="16" rx="4" fill="#e3f0fd"/><rect x="8" y="8" width="8" height="2" rx="1" fill="#1976d2"/><rect x="8" y="12" width="5" height="2" rx="1" fill="#1976d2"/></svg>
            <div className="admin-dashboard-patient-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: 8 }}>Access Patient History</div>
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ fontWeight: 500, marginBottom: 10 }}>Rohit Patel</div>
            <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
              <li>Blood Test: Normal</li>
              <li>X-Ray: Clear</li>
              <li>Prescription: Amoxicillin 500mg, 3x/day</li>
              <li>ECG: Normal</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Patient History Modal */}
      {showPatientHistory && historyPatient && (
        <div className="dashboard-modal-bg">
          <div className="dashboard-modal-card">
            <div className="dashboard-modal-header">Patient History: {historyPatient.fullName}</div>
            <div className="dashboard-modal-body">
              {historyPatient.records.map((rec, i) => <div key={i}>{rec}</div>)}
            </div>
            <div className="dashboard-modal-actions">
              <button className="dashboard-modal-close-btn" onClick={() => setShowPatientHistory(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Forum Modal */}
      {showForum && (
        <div className="dashboard-modal-bg">
          <div className="dashboard-modal-card">
            <div className="dashboard-modal-header">Community Health Forum</div>
            <div className="dashboard-modal-body">
              {forumPosts.map(post => (
                <div key={post.id} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600 }}>{post.author}:</div>
                  <div style={{ marginBottom: 6 }}>{post.question}</div>
                  <div style={{ color: '#1976d2', marginBottom: 6 }}>Replies:</div>
                  {post.replies.map((r, i) => <div key={i} style={{ marginLeft: 12, marginBottom: 4 }}>{r}</div>)}
                  <input
                    className="admin-dashboard-chat-input"
                    placeholder="Type a reply..."
                    value={forumReply}
                    onChange={e => setForumReply(e.target.value)}
                    style={{ fontSize: 15, marginTop: 6 }}
                  />
                  <button
                    className="dashboard-notifications-btn"
                    style={{ marginLeft: 8, fontWeight: 600, marginTop: 6 }}
                    onClick={() => {
                      setForumPosts(forumPosts.map(p => p.id === post.id ? { ...p, replies: [...p.replies, forumReply] } : p));
                      setForumReply('');
                    }}
                  >Reply</button>
                </div>
              ))}
            </div>
            <div className="dashboard-modal-actions">
              <button className="dashboard-modal-close-btn" onClick={() => setShowForum(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard; 