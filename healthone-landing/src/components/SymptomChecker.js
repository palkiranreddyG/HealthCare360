import React, { useState } from 'react';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickSymptoms, setQuickSymptoms] = useState([]);

  const BACKEND_URL = 'https://healthcare360-backend.onrender.com'; // ✅ backend URL

  React.useEffect(() => {
    fetch(`${BACKEND_URL}/api/quick-symptoms`)
      .then(res => res.json())
      .then(setQuickSymptoms)
      .catch(() => setQuickSymptoms([]));
  }, []);

  const handleQuickSymptom = (name) => {
    setSymptoms(symptoms ? symptoms + ', ' + name : name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAiResult('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze-symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, duration, severity }),
      });
      const data = await res.json();
      if (res.ok) setAiResult(data.aiResult);
      else setError(data.error || 'AI analysis failed');
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  function formatAiResult(result) {
    if (!result) return '';
    let html = result;
    html = html.replace(/(^|\n)(Analysis:)/g, '$1<strong>Analysis:</strong>');
    html = html.replace(/(^|\n)(Recommendations:)/g, '$1<strong>Recommendations:</strong>');
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n[-*] /g, '<ul><li>');
    html = html.replace(/\n/g, '<br/>');
    if (html.includes('<ul><li>')) html += '</li></ul>';
    html = html.replace(/(<strong>[^<]+<\/strong>)/g, '$1 ');
    return html;
  }

  return (
    <div className="symptom-checker-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: '#007AFF', fontWeight: 800, fontSize: '2.3rem', textAlign: 'center' }}>AI Symptom Checker</h1>
      <p style={{ textAlign: 'center', color: '#607d8b', marginBottom: 32 }}>
        Describe your symptoms and get instant AI-powered analysis with treatment recommendations.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 320, maxWidth: 480, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,122,255,0.07)', padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>Describe Your Symptoms</h2>
          <textarea
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="e.g., I have a headache, fever, and sore throat for 2 days..."
            rows={5}
            style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e3f0fd', padding: 12, fontSize: 16, marginBottom: 16 }}
            required
          />
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g., 2 days"
              style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e3f0fd', padding: 10, fontSize: 15 }}
              required
            />
            <input
              type="number"
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              placeholder="Severity (1-10)"
              min={1}
              max={10}
              style={{ width: 120, borderRadius: 8, border: '1.5px solid #e3f0fd', padding: 10, fontSize: 15 }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007AFF', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', cursor: 'pointer', marginTop: 8 }} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 320, maxWidth: 480, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,122,255,0.07)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>AI Analysis Results</h2>
          {aiResult ? (
            <div
              className="ai-analysis-results"
              style={{ color: '#222', fontSize: 17, marginTop: 16, whiteSpace: 'normal', textAlign: 'left', width: '100%' }}
              dangerouslySetInnerHTML={{ __html: formatAiResult(aiResult) }}
            />
          ) : (
            <div style={{ color: '#7b8a99', fontSize: 16, marginTop: 16, textAlign: 'center' }}>
              Enter your symptoms above to get AI analysis
            </div>
          )}
        </div>
      </form>
      <div style={{ margin: '0 auto', maxWidth: 900 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 16, textAlign: 'center' }}>Quick Symptom Check</h2>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {quickSymptoms.map(s => (
            <button key={s.name} onClick={() => handleQuickSymptom(s.name)} style={{ minWidth: 140, background: '#fff', border: '1.5px solid #e3f0fd', borderRadius: 12, padding: '22px 0', fontSize: 18, fontWeight: 600, color: '#222', boxShadow: '0 2px 8px rgba(0,122,255,0.07)', cursor: 'pointer', marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 32, marginBottom: 6 }}>{s.emoji}</span>
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
