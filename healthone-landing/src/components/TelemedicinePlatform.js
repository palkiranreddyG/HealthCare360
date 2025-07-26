import React, { useState } from 'react';
import './TelemedicinePlatform.css';

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    experience: 12,
    rating: 4.9,
    reviews: 1250,
    nextAvailable: 'Today 2:30 PM',
    fee: 500,
    languages: ['Hindi', 'English'],
    img: '',
    hospital: 'AIIMS Delhi',
    slots: {
      today: ['10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM'],
      tomorrow: ['10:00 AM', '11:00 AM', '2:30 PM'],
      dayAfter: ['11:30 AM', '2:00 PM'],
    },
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    reviews: 890,
    nextAvailable: 'Today 4:00 PM',
    fee: 800,
    languages: ['Hindi', 'English', 'Punjabi'],
    img: '',
    hospital: 'Fortis Hospital',
    slots: {
      today: ['10:00 AM', '10:30 AM', '11:00 AM', '4:00 PM'],
      tomorrow: ['10:00 AM', '11:00 AM', '2:30 PM'],
      dayAfter: ['11:30 AM', '2:00 PM'],
    },
  },
  {
    id: 3,
    name: 'Dr. Anjali Mehta',
    specialty: 'Dermatology',
    experience: 8,
    rating: 4.9,
    reviews: 650,
    nextAvailable: 'Tomorrow 10:00 AM',
    fee: 600,
    languages: ['Hindi', 'English', 'Gujarati'],
    img: '',
    hospital: 'Ruby Hall Clinic',
    slots: {
      today: ['10:00 AM', '10:30 AM', '11:00 AM'],
      tomorrow: ['10:00 AM', '11:00 AM', '2:30 PM'],
      dayAfter: ['11:30 AM', '2:00 PM'],
    },
  },
  {
    id: 4,
    name: 'Dr. Kavita Rao',
    specialty: 'Pediatrics',
    experience: 10,
    rating: 4.7,
    reviews: 720,
    nextAvailable: 'Today 5:00 PM',
    fee: 700,
    languages: ['English', 'Marathi'],
    img: '',
    hospital: 'Apollo Hospital',
    slots: {
      today: ['11:00 AM', '1:00 PM', '5:00 PM'],
      tomorrow: ['9:30 AM', '12:00 PM', '3:00 PM'],
      dayAfter: ['10:00 AM', '2:00 PM'],
    },
  },
  {
    id: 5,
    name: 'Dr. Suresh Patil',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.6,
    reviews: 540,
    nextAvailable: 'Tomorrow 11:00 AM',
    fee: 900,
    languages: ['Hindi', 'English', 'Kannada'],
    img: '',
    hospital: 'Sancheti Hospital',
    slots: {
      today: ['2:00 PM', '3:00 PM'],
      tomorrow: ['11:00 AM', '1:00 PM', '4:00 PM'],
      dayAfter: ['10:30 AM', '12:00 PM'],
    },
  },
  {
    id: 6,
    name: 'Dr. Neha Gupta',
    specialty: 'Neurology',
    experience: 11,
    rating: 4.8,
    reviews: 610,
    nextAvailable: 'Today 6:00 PM',
    fee: 1200,
    languages: ['English', 'Hindi'],
    img: '',
    hospital: 'Jehangir Hospital',
    slots: {
      today: ['12:00 PM', '6:00 PM'],
      tomorrow: ['10:00 AM', '2:00 PM'],
      dayAfter: ['11:00 AM', '3:00 PM'],
    },
  },
  {
    id: 7,
    name: 'Dr. Arvind Menon',
    specialty: 'Psychiatry',
    experience: 14,
    rating: 4.7,
    reviews: 480,
    nextAvailable: 'Tomorrow 9:00 AM',
    fee: 1000,
    languages: ['English', 'Malayalam'],
    img: '',
    hospital: 'NIMHANS',
    slots: {
      today: ['3:00 PM', '5:00 PM'],
      tomorrow: ['9:00 AM', '11:00 AM', '1:00 PM'],
      dayAfter: ['10:00 AM', '12:00 PM'],
    },
  },
  {
    id: 8,
    name: 'Dr. Sunita Joshi',
    specialty: 'ENT',
    experience: 9,
    rating: 4.5,
    reviews: 390,
    nextAvailable: 'Today 7:00 PM',
    fee: 650,
    languages: ['Hindi', 'English', 'Bengali'],
    img: '',
    hospital: 'KEM Hospital',
    slots: {
      today: ['7:00 PM', '8:00 PM'],
      tomorrow: ['10:00 AM', '12:00 PM'],
      dayAfter: ['11:00 AM', '1:00 PM'],
    },
  },
  {
    id: 9,
    name: 'Dr. Ramesh Iyer',
    specialty: 'Ophthalmology',
    experience: 13,
    rating: 4.6,
    reviews: 520,
    nextAvailable: 'Tomorrow 2:00 PM',
    fee: 750,
    languages: ['English', 'Tamil'],
    img: '',
    hospital: 'LV Prasad Eye Institute',
    slots: {
      today: ['4:00 PM', '6:00 PM'],
      tomorrow: ['2:00 PM', '4:00 PM'],
      dayAfter: ['10:00 AM', '12:00 PM'],
    },
  },
];

const SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'ENT',
  'Ophthalmology',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Oncology',
  'Endocrinology',
  'Urology',
  'Rheumatology',
  'Gynecology',
  'Dentistry',
  'Radiology',
  'Anesthesiology',
  'Pathology',
  'Surgery',
  'Other',
];
const LANGUAGES = ['Hindi', 'English', 'Punjabi', 'Gujarati', 'Marathi', 'Kannada', 'Malayalam', 'Bengali', 'Tamil'];

export default function TelemedicinePlatform() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dateTab, setDateTab] = useState('today');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const filteredDoctors = DOCTORS.filter(doc =>
    (!search || doc.name.toLowerCase().includes(search.toLowerCase())) &&
    (!specialty || doc.specialty === specialty) &&
    (!language || doc.languages.includes(language))
  );

  const handleBook = async () => {
    if (!selectedTime || !selectedDoctor) return;
    setBookingSuccess(true);
    // Get userId from localStorage (same logic as Dashboard.js)
    let userId = null;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      userId = user?._id || user?.userId || null;
    } catch (e) {}
    // Compose appointment time (today/tomorrow/dayAfter)
    let date = new Date();
    if (dateTab === 'tomorrow') date.setDate(date.getDate() + 1);
    if (dateTab === 'dayAfter') date.setDate(date.getDate() + 2);
    // Parse selectedTime (e.g., '10:00 AM')
    const [timeStr, ampm] = selectedTime.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
    // POST appointment
    if (userId) {
      console.log('Booking appointment for:', selectedDoctor.name, 'at', date.toISOString());
      await fetch(`/api/user-dashboard/${userId}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          time: date,
          status: 'upcoming',
        }),
      });
      // POST activity
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const dateLabel = `${day}/${month}/${year}`;
      await fetch(`/api/user-dashboard/${userId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultation',
          description: `Booked consultation with Dr. ${selectedDoctor.name} (${selectedDoctor.specialty}) for ${selectedTime} on ${dateLabel}`,
          time: new Date(),
        }),
      });
      // If on dashboard, trigger a refresh
      if (window.location.pathname === '/dashboard') {
        window.location.reload();
      }
    }
    setTimeout(() => setBookingSuccess(false), 2500);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    setChatInput('');
    // Simulate doctor reply
    setTimeout(() => {
      setChatMessages(msgs => [...msgs, { sender: 'doctor', text: 'Thank you for your message. How can I help you?' }]);
    }, 1200);
  };

  return (
    <div className="tele-bg">
      <div className="tele-container">
        <div className="tele-header">
          <div className="tele-header-icon"> <span role="img" aria-label="video">📹</span> </div>
          <div>
            <h1 className="tele-title">Telemedicine Platform</h1>
            <div className="tele-subtitle">Connect with certified healthcare professionals through HD video consultations</div>
            <div className="tele-badges-row">
              <span className="tele-badge"><span role="img" aria-label="video">📹</span> HD Video Calls</span>
              <span className="tele-badge tele-badge-blue"><span role="img" aria-label="clock">🕒</span> Instant Booking</span>
            </div>
          </div>
        </div>
        <div className="tele-search-row">
          <input className="tele-search-input" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="tele-search-select" value={specialty} onChange={e => setSpecialty(e.target.value)}>
            <option value="">Specialty</option>
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="tele-search-select" value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="">Language</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="tele-search-btn">Search Doctors</button>
        </div>
        <div className="tele-main-row">
          <div className="tele-doctors-list">
            <div className="tele-section-title">Available Doctors</div>
            {filteredDoctors.map(doc => (
              <div
                className={`tele-doctor-card${selectedDoctor && selectedDoctor.id === doc.id ? ' selected' : ''}`}
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setBookingSuccess(false);
                  setChatOpen(false);
                  setChatMessages([]);
                }}
              >
                <div className="tele-doctor-avatar"><span role="img" aria-label="doctor">👩‍⚕️</span></div>
                <div className="tele-doctor-main">
                  <div className="tele-doctor-name">{doc.name}</div>
                  <div className="tele-doctor-specialty">{doc.specialty}</div>
                  <div className="tele-doctor-exp">{doc.experience} years experience</div>
                  <div className="tele-doctor-meta-row">
                    <span className="tele-doctor-rating">⭐ {doc.rating} <span className="tele-doctor-reviews">({doc.reviews})</span></span>
                    <span className="tele-doctor-next">🕒 {doc.nextAvailable}</span>
                  </div>
                  <div className="tele-doctor-langs-row">
                    {doc.languages.map(l => <span className="tele-doctor-lang" key={l}>{l}</span>)}
                  </div>
                  <div className="tele-doctor-hospital">{doc.hospital}</div>
                </div>
                <div className="tele-doctor-fee">
                  <div className="tele-doctor-fee-amt">₹{doc.fee}</div>
                  <div className="tele-doctor-fee-label">Consultation</div>
                </div>
              </div>
            ))}
          </div>
          <div className="tele-book-panel">
            <div className="tele-section-title">Book Appointment</div>
            {!selectedDoctor ? (
              <div className="tele-book-empty">
                <div className="tele-book-empty-icon"><span role="img" aria-label="user">👤</span></div>
                <div className="tele-book-empty-text">Select a doctor to book appointment</div>
              </div>
            ) : (
              <div className="tele-book-details">
                <div className="tele-book-doc-row">
                  <div className="tele-book-doc-avatar"><span role="img" aria-label="doctor">👩‍⚕️</span></div>
                  <div>
                    <div className="tele-book-doc-name">{selectedDoctor.name}</div>
                    <div className="tele-book-doc-specialty">{selectedDoctor.specialty}</div>
                  </div>
                </div>
                <div className="tele-book-label">Select Date</div>
                <div className="tele-book-date-row">
                  <button className={`tele-book-date-btn${dateTab === 'today' ? ' active' : ''}`} onClick={() => { setDateTab('today'); setSelectedTime(''); }}>Today</button>
                  <button className={`tele-book-date-btn${dateTab === 'tomorrow' ? ' active' : ''}`} onClick={() => { setDateTab('tomorrow'); setSelectedTime(''); }}>Tomorrow</button>
                  <button className={`tele-book-date-btn${dateTab === 'dayAfter' ? ' active' : ''}`} onClick={() => { setDateTab('dayAfter'); setSelectedTime(''); }}>Day After</button>
                </div>
                <div className="tele-book-label">Available Times</div>
                <div className="tele-book-slots-row">
                  {(selectedDoctor.slots[dateTab] || []).map(slot => (
                    <button
                      className={`tele-book-slot-btn${selectedTime === slot ? ' selected' : ''}`}
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="tele-book-label">Consultation Fee</div>
                <div className="tele-book-fee-row">₹{selectedDoctor.fee}</div>
                <button className="tele-book-video-btn" onClick={handleBook} disabled={!selectedTime}>📹 Book Video Consultation</button>
                <div className="tele-book-alt-row">
                  {/* Removed Call button */}
                  <button className="tele-book-alt-btn" onClick={() => setChatOpen(true)}>💬 Chat</button>
                </div>
                {bookingSuccess && <div className="tele-book-success">Booking confirmed for <b>{selectedTime}</b>! You will receive a link for your video consultation.</div>}
                <div className="tele-book-doc-hospital">{selectedDoctor.hospital}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Chat Modal */}
      {chatOpen && selectedDoctor && (
        <div className="tele-chat-modal-bg" onClick={() => setChatOpen(false)}>
          <div className="tele-chat-modal" onClick={e => e.stopPropagation()}>
            <div className="tele-chat-header">
              <span className="tele-chat-doc-avatar"><span role="img" aria-label="doctor">👩‍⚕️</span></span>
              <span className="tele-chat-doc-name">Chat with {selectedDoctor.name}</span>
              <button className="tele-chat-close" onClick={() => setChatOpen(false)}>×</button>
            </div>
            <div className="tele-chat-messages">
              {chatMessages.length === 0 && <div className="tele-chat-empty">No messages yet. Start the conversation!</div>}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`tele-chat-msg${msg.sender === 'user' ? ' user' : ' doctor'}`}>{msg.text}</div>
              ))}
            </div>
            <form className="tele-chat-form" onSubmit={handleSendChat}>
              <input
                className="tele-chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..."
                autoFocus
              />
              <button className="tele-chat-send" type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 