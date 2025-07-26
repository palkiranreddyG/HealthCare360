import React, { useState, useRef, useEffect } from 'react';

const MOCK_MESSAGES = [
  { sender: 'counselor', text: "Hello! I'm Dr. Priya. How are you feeling today?", time: '2:30 PM' },
  { sender: 'user', text: "Hi Dr. Priya, I've been feeling quite anxious lately.", time: '2:31 PM' },
  { sender: 'counselor', text: "I understand. Can you tell me more about what's been causing this anxiety?", time: '2:32 PM' },
];

export default function CounselorVideoSession({ counselor, onBack }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [camError, setCamError] = useState('');
  const chatRef = useRef();
  const videoRef = useRef();
  const userCamRef = useRef();
  const userStreamRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Webcam logic
  useEffect(() => {
    setCamError('');
    if (!camEnabled) {
      if (userCamRef.current) userCamRef.current.srcObject = null;
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(track => track.stop());
        userStreamRef.current = null;
      }
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        userStreamRef.current = stream;
        if (userCamRef.current) userCamRef.current.srcObject = stream;
      })
      .catch(err => {
        setCamEnabled(false);
        setCamError('Unable to access your camera. Please check browser permissions and try again.');
        console.error('Camera access error:', err);
      });
    return () => {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach(track => track.stop());
        userStreamRef.current = null;
      }
    };
  }, [camEnabled]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(msgs => [
      ...msgs,
      { sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { sender: 'counselor', text: 'Thank you for sharing. How long have you been feeling this way?', time: new Date(Date.now() + 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInput('');
  };

  // Video controls
  const handleMute = () => {
    setMuted(m => !m);
    if (videoRef.current) videoRef.current.muted = !muted;
  };
  const handlePlayPause = () => {
    setPlaying(p => {
      if (videoRef.current) {
        if (p && !videoRef.current.paused) {
          videoRef.current.pause();
        } else if (!p && videoRef.current.paused) {
          videoRef.current.play();
        }
      }
      return !p;
    });
  };
  const handleCamToggle = () => {
    setCamEnabled(e => !e);
  };
  const handleRetryCam = () => {
    setCamEnabled(true);
    setCamError('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 32, display: 'flex', flexDirection: 'row', boxSizing: 'border-box', gap: 32 }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 2, alignSelf: 'flex-start' }}>Video Session</div>
        <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 18, alignSelf: 'flex-start' }}>{counselor.name} - {counselor.specialty}</div>
        <div style={{ width: 420, height: 280, borderRadius: 18, overflow: 'hidden', background: '#f3f6fa', marginBottom: 18, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Video element or placeholder */}
          <video
            ref={videoRef}
            width="420"
            height="280"
            style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#e3eaf5' }}
            controls={false}
            muted={muted}
            autoPlay
            loop
            poster="https://dummyimage.com/420x280/daeaf6/8ca0b3&text=Counselor+Video"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/mock-counselor-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={{ position: 'absolute', left: 16, bottom: 16, background: '#21cbf3', color: '#fff', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: 15 }}>Dr. Priya Sharma</div>
        </div>
        {/* User webcam feed */}
        <div style={{ width: 120, height: 90, borderRadius: 12, background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, position: 'relative', left: 140, top: -110, border: '3px solid #fff', boxShadow: '0 2px 8px rgba(33,150,243,0.12)', overflow: 'hidden', flexDirection: 'column' }}>
          {camEnabled ? (
            <video ref={userCamRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
          ) : (
            <>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>No Camera</span>
              {camError && <div style={{ color: '#ff5252', fontSize: 13, marginTop: 6, textAlign: 'center', fontWeight: 500 }}>{camError}</div>}
              <button onClick={handleRetryCam} style={{ marginTop: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Retry Camera</button>
            </>
          )}
          <div style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(33,150,243,0.85)', color: '#fff', borderRadius: 6, padding: '2px 10px', fontWeight: 600, fontSize: 13 }}>You</div>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: -60, marginBottom: 18 }}>
          <button onClick={handleMute} style={{ background: muted ? '#e3eaf5' : '#1976d2', color: muted ? '#222' : '#fff', border: 'none', borderRadius: 8, padding: '12px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" fill="none" stroke={muted ? '#222' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 1v22"/><path d="M5 5l7-4 7 4"/></svg>
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={handlePlayPause} style={{ background: playing ? '#1976d2' : '#e3eaf5', color: playing ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '12px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            {playing ? (
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
            )}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleCamToggle} style={{ background: camEnabled ? '#1976d2' : '#e3eaf5', color: camEnabled ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '12px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" fill="none" stroke={camEnabled ? '#fff' : '#222'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
            {camEnabled ? 'Disable Cam' : 'Enable Cam'}
          </button>
          <button style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 18px', fontWeight: 600, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={onBack}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23" /><line x1="23" y1="1" x2="1" y2="23" /></svg>
            End Call
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fafbfc', borderRadius: 12, padding: 18, minHeight: 260, maxHeight: 420 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Session Chat</div>
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              <div style={{
                background: msg.sender === 'user' ? '#1976d2' : '#f3f6fa',
                color: msg.sender === 'user' ? '#fff' : '#222',
                borderRadius: 16,
                padding: '10px 16px',
                maxWidth: 320,
                fontSize: 16,
                boxShadow: '0 1px 4px rgba(33,150,243,0.07)'
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: 12, color: msg.sender === 'user' ? '#e3f0fd' : '#8ca0b3', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e3eaf5', padding: 10, fontSize: 16 }}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            onClick={handleSend}
            style={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '0 24px', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 