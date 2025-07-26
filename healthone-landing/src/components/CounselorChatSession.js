import React, { useState, useRef, useEffect } from 'react';

const MOCK_MESSAGES = [
  { sender: 'counselor', text: "Hello! I'm Dr. Priya. How are you feeling today?", time: '2:30 PM' },
  { sender: 'user', text: "Hi Dr. Priya, I've been feeling quite anxious lately.", time: '2:31 PM' },
  { sender: 'counselor', text: "I understand. Can you tell me more about what's been causing this anxiety?", time: '2:32 PM' },
];

const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

export default function CounselorChatSession({ counselor, onBack }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/gemini-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      if (res.ok && data.response) {
        setMessages(msgs => [...msgs, { sender: 'counselor', text: data.response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'counselor', text: 'Sorry, I could not process your request.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'counselor', text: 'Sorry, there was a problem connecting to the AI.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', background: '#fff', borderRadius: 18, border: '1.5px solid #e3eaf5', padding: 32, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 2 }}>Chat Session</div>
      <div style={{ color: '#8ca0b3', fontSize: 17, marginBottom: 18 }}>{counselor.name} - {counselor.specialty}</div>
      <div ref={chatRef} style={{ background: '#fafbfc', borderRadius: 12, padding: 24, minHeight: 260, maxHeight: 340, overflowY: 'auto', marginBottom: 18 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
            <div style={{
              background: msg.sender === 'user' ? '#1976d2' : '#f3f6fa',
              color: msg.sender === 'user' ? '#fff' : '#222',
              borderRadius: 16,
              padding: '12px 18px',
              maxWidth: 420,
              fontSize: 17,
              boxShadow: '0 1px 4px rgba(33,150,243,0.07)',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div>{msg.text}</div>
              <div style={{ fontSize: 13, color: msg.sender === 'user' ? '#e3f0fd' : '#8ca0b3', marginTop: 6, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ background: '#f3f6fa', color: '#8ca0b3', borderRadius: 16, padding: '12px 18px', fontSize: 17, fontStyle: 'italic' }}>Counselor is typing...</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e3eaf5', padding: 14, fontSize: 17 }}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          style={{ background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '0 32px', cursor: 'pointer' }}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {error && <div style={{ color: '#e53935', fontSize: 15, marginTop: 8 }}>{error}</div>}
      <button onClick={onBack} style={{ marginTop: 24, background: '#fff', color: '#111', border: '1.5px solid #e3eaf5', borderRadius: 10, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        Back
      </button>
    </div>
  );
} 