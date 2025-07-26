import React, { useState, useEffect, useRef } from 'react';
import './ChronicDiseaseTracker.css';

const tabs = ['Overview', 'Medications', 'Log Readings', 'History'];

export default function ChronicDiseaseTracker({ onClose }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState({ medicationsTaken: '-', readingsLogged: '-', healthScore: '-' });
  const [aiInsights, setAiInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [medications, setMedications] = useState([]);
  const [historyReadings, setHistoryReadings] = useState([]);
  const [logGlucose, setLogGlucose] = useState('');
  const [logBP, setLogBP] = useState('');
  const [logWeight, setLogWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [addMed, setAddMed] = useState({ name: '', dosage: '', frequency: '', next: '' });
  const [addMedOpen, setAddMedOpen] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [alertsError, setAlertsError] = useState('');
  const recentAlertsRef = useRef(null);

  // Helper function to format AI insights with proper styling
  const formatInsightText = (text) => {
    if (!text) return '';
    let html = text;
    
    // Convert various bullet point formats to proper HTML lists with better styling
    html = html.replace(/\n\* /g, '</li><li style="margin: 8px 0; line-height: 1.5; color: #333;">');
    html = html.replace(/\n• /g, '</li><li style="margin: 8px 0; line-height: 1.5; color: #333;">');
    html = html.replace(/\n- /g, '</li><li style="margin: 8px 0; line-height: 1.5; color: #333;">');
    
    // Add proper list structure with better styling
    if (html.includes('<li')) {
      html = '<ul style="margin: 12px 0; padding-left: 20px; list-style-type: none;">' + html.replace(/^/, '<li style="margin: 8px 0; line-height: 1.5; color: #333;">') + '</li></ul>';
    }
    
    // Clean up any remaining asterisks that weren't converted
    html = html.replace(/\* /g, '');
    
    // Add line breaks for better spacing
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');
    
    return html;
  };

  // Get user ID from localStorage
  let userId = null;
  try {
    const userObj = JSON.parse(localStorage.getItem('user'));
    userId = userObj?._id || userObj?.userId || null;
  } catch {}

  // Fetch all data on mount and when tab changes
  useEffect(() => {
    if (!userId) return;
    if (activeTab === 'Overview' || activeTab === 'Log Readings') {
      fetch(`/api/chronic/readings?user=${userId}`)
        .then(res => res.json())
        .then(readings => {
          // Metrics: latest reading
          const latest = readings[0] || {};
          // Fetch medications for health score
          fetch(`/api/chronic/medications?user=${userId}`)
            .then(res => res.json())
            .then(meds => {
              let score = 10;
              // Reading-based deductions
              if (latest.glucose !== undefined && latest.glucose !== null) {
                if (latest.glucose > 130) score -= 2;
                else if (latest.glucose > 110) score -= 1;
              }
              if (latest.bp) {
                const [sys, dia] = (latest.bp + '').split('/').map(Number);
                if (sys > 130 || dia > 85) score -= 2;
                else if (sys > 120 || dia > 80) score -= 1;
              }
              if (latest.weight !== undefined && latest.weight !== null) {
                if (latest.weight > 80) score -= 1;
                if (latest.weight > 90) score -= 2;
              }
              // Medication adherence deduction
              const medsTaken = meds.filter(m => m.taken).length;
              if (meds.length > 0 && medsTaken < meds.length) {
                score -= (meds.length - medsTaken); // -1 per missed med
              }
              // Reading completeness deduction
              if (readings.length < 7) {
                score -= (7 - readings.length) * 0.5; // -0.5 per missing day
              }
              if (score < 0) score = 0;
              setMetrics([
                { icon: '📈', label: 'Blood Glucose', value: latest.glucose ?? '-', unit: 'mg/dL', target: '120 mg/dL', color: '#ffb300' },
                { icon: '❤️', label: 'Blood Pressure', value: latest.bp ?? '-', unit: 'mmHg', target: '120/80 mmHg', color: '#29b6f6' },
                { icon: '🎯', label: 'Weight', value: latest.weight ?? '-', unit: 'kg', target: '75 kg', color: '#1976d2' },
                { icon: '🖥️', label: 'HbA1c', value: '-', unit: '%', target: '6.5 %', color: '#ab47bc' },
              ]);
              setSummary(s => ({
                ...s,
                medicationsTaken: `${medsTaken}/${meds.length}`,
                readingsLogged: readings.length + '/7',
                healthScore: score.toFixed(1) + '/10',
              }));
            });
        });
    }
    if (activeTab === 'Medications' || activeTab === 'Overview') {
      fetch(`/api/chronic/medications?user=${userId}`)
        .then(res => res.json())
        .then(meds => {
          setMedications(meds);
          setSummary(s => ({ ...s, medicationsTaken: `${meds.filter(m => m.taken).length}/${meds.length}` }));
        });
    }
    if (activeTab === 'History' || activeTab === 'Overview') {
      fetch(`/api/chronic/history?user=${userId}`)
        .then(res => res.json())
        .then(history => setHistoryReadings(history));
    }
    if (activeTab === 'Overview') {
      setInsightsLoading(true);
      setAlertsLoading(true);
      setInsightsError('');
      setAlertsError('');
      fetch('/api/chronic/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userId })
      })
        .then(res => res.json())
        .then(data => {
          setAiInsights(data.insights || []);
          setInsightsLoading(false);
          setAlerts(data.alerts || []);
          setAlertsLoading(false);
          if ((!data.insights || data.insights.length === 0)) setInsightsError('No AI insights available.');
          if ((!data.alerts || data.alerts.length === 0)) setAlertsError('No recent alerts available.');
        })
        .catch((err) => {
          setAiInsights([]);
          setInsightsLoading(false);
          setInsightsError('Failed to load AI insights.');
          setAlerts([]);
          setAlertsLoading(false);
          setAlertsError('Failed to load recent alerts.');
          console.error('Gemini AI error:', err);
        });
    }
  }, [activeTab, userId]);

  return (
    <div className="cdt-bg">
      <div className="cdt-container">
        <div className="cdt-header-row">
          <h1 className="cdt-title">Chronic Disease Tracker</h1>
          {/* Removed the close button for a cleaner, spread-out header */}
        </div>
        <div className="cdt-subtitle">Monitor and manage your health conditions</div>
        <div className="cdt-alert-row">
          {/* Removed the alert icon for a cleaner look */}
          <div>
            <div className="cdt-alert-main">Blood glucose levels have been elevated for 3 consecutive days</div>
            <div className="cdt-alert-desc">Consider adjusting diet or medication</div>
          </div>
          <button
            className="cdt-alert-btn"
            onClick={() => {
              if (recentAlertsRef.current) {
                recentAlertsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            View All Alerts
          </button>
        </div>
        <div className="cdt-metrics-row">
          {metrics.map((m, i) => (
            <div className="cdt-metric-card" key={i}>
              <div className="cdt-metric-icon" style={{ color: m.color }}>{m.icon}</div>
              <div className="cdt-metric-label">{m.label}</div>
              <div className="cdt-metric-value" style={{ color: m.color }}>{m.value} <span className="cdt-metric-unit">{m.unit}</span></div>
              <div className="cdt-metric-target">Target: {m.target}</div>
              <div className="cdt-metric-bar-bg">
                <div className="cdt-metric-bar" style={{ background: m.color, width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="cdt-tabs-row">
          {tabs.map(tab => (
            <button key={tab} className={`cdt-tab-btn${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>
        {activeTab === 'Overview' && (
          <>
            <div className="cdt-overview-row">
              <div className="cdt-summary-card">
                <div className="cdt-summary-title">Today's Summary</div>
                <div className="cdt-summary-desc">Your health status for today</div>
                <div className="cdt-summary-item">Medications Taken <span>{summary.medicationsTaken}</span></div>
                <div className="cdt-summary-item cdt-summary-highlight">Readings Logged <span>{summary.readingsLogged}</span></div>
                <div className="cdt-summary-item">Health Score <span>{summary.healthScore}</span></div>
              </div>
              <div className="cdt-insights-card">
                <div className="cdt-insights-title">⚡ AI Insights</div>
                <div className="cdt-insights-desc">Personalized recommendations</div>
                {insightsLoading && <div style={{ color: '#8ca0b3', marginTop: 16 }}>Loading AI insights...</div>}
                {insightsError && !insightsLoading && (!Array.isArray(historyReadings) || historyReadings.length === 0) && <div style={{ color: '#e53935', marginTop: 16 }}>{insightsError}</div>}
                {aiInsights.length === 0 && !insightsLoading && Array.isArray(historyReadings) && historyReadings.length > 0 && (
                  <div className="cdt-insight-item highlight">
                    <div className="cdt-insight-title">Recent Reading</div>
                    <div className="cdt-insight-desc">Your latest glucose is {historyReadings[0]?.glucose ?? '-'}, BP is {historyReadings[0]?.bp ?? '-'}, weight is {historyReadings[0]?.weight ?? '-'}{historyReadings[0]?.hba1c ? `, HbA1c is ${historyReadings[0].hba1c}` : ''}. Keep tracking for better insights.</div>
                  </div>
                )}
                {aiInsights.map((ins, i) => (
                  <div key={i} className={`cdt-insight-item${ins.highlight ? ' highlight' : ''}`}>
                    <div className="cdt-insight-title">{ins.title}</div>
                    <div className="cdt-insight-desc" dangerouslySetInnerHTML={{ __html: formatInsightText(ins.desc) }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="cdt-alerts-row" ref={recentAlertsRef}>
              <div className="cdt-alerts-title">Recent Alerts</div>
              {alertsLoading && <div style={{ color: '#8ca0b3', marginTop: 16 }}>Loading alerts...</div>}
              {alertsError && !alertsLoading && (!Array.isArray(historyReadings) || historyReadings.length === 0) && <div style={{ color: '#e53935', marginTop: 16 }}>{alertsError}</div>}
              {alerts.length === 0 && !alertsLoading && Array.isArray(historyReadings) && historyReadings.length > 0 && (
                <div className="cdt-alerts-item">
                  <span className="cdt-alerts-icon">⚠️</span>
                  <span className="cdt-alerts-main">New Health Reading Logged</span>
                  <span className="cdt-alerts-desc">Glucose: {historyReadings[0]?.glucose ?? '-'}, BP: {historyReadings[0]?.bp ?? '-'}, Weight: {historyReadings[0]?.weight ?? '-'}{historyReadings[0]?.hba1c ? `, HbA1c: ${historyReadings[0].hba1c}` : ''}</span>
                  <span className="cdt-alerts-time">Just now</span>
                </div>
              )}
              {alerts.map((a, i) => (
                <div className="cdt-alerts-item" key={i}>
                  <span className="cdt-alerts-icon">{a.icon || '⚠️'}</span>
                  <span className="cdt-alerts-main">{a.title}</span>
                  <span className="cdt-alerts-desc" dangerouslySetInnerHTML={{ __html: formatInsightText(a.desc) }} />
                  <span className="cdt-alerts-time">{a.time || ''}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'Medications' && (
          <div className="cdt-medications-row">
            <div className="cdt-medications-card">
              <div className="cdt-medications-title">
                <span className="cdt-medications-icon">💊</span>
                Medication Schedule
              </div>
              <div className="cdt-medications-desc">Track your daily medications</div>
              <button className="cdt-medication-add-btn" onClick={() => setAddMedOpen(o => !o)}>{addMedOpen ? 'Cancel' : '+ Add Medication'}</button>
              {addMedOpen && (
                <form className="cdt-medication-add-form" onSubmit={async e => {
                  e.preventDefault();
                  if (!addMed.name || !addMed.dosage || !addMed.frequency) return alert('Fill all required fields');
                  setLoading(true);
                  await fetch('/api/chronic/medications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...addMed, user: userId })
                  });
                  setAddMed({ name: '', dosage: '', frequency: '', next: '' });
                  setAddMedOpen(false);
                  setLoading(false);
                  // Refresh meds
                  fetch(`/api/chronic/medications?user=${userId}`)
                    .then(res => res.json())
                    .then(setMedications);
                  // Refresh AI insights and alerts
                  fetch(`/api/chronic/history?user=${userId}`)
                    .then(res => res.json())
                    .then(history => {
                      setInsightsLoading(true);
                      setAlertsLoading(true);
                      setInsightsError('');
                      setAlertsError('');
                      fetch('/api/chronic/ai-insights', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: userId })
                      })
                        .then(res => res.json())
                        .then(data => {
                          setAiInsights(data.insights || []);
                          setInsightsLoading(false);
                          setAlerts(data.alerts || []);
                          setAlertsLoading(false);
                          if ((!data.insights || data.insights.length === 0)) setInsightsError('No AI insights available.');
                          if ((!data.alerts || data.alerts.length === 0)) setAlertsError('No recent alerts available.');
                        })
                        .catch((err) => {
                          setAiInsights([]);
                          setInsightsLoading(false);
                          setInsightsError('Failed to load AI insights.');
                          setAlerts([]);
                          setAlertsLoading(false);
                          setAlertsError('Failed to load recent alerts.');
                          console.error('Gemini AI error:', err);
                        });
                    });
                }}>
                  <input className="cdt-medication-add-input" placeholder="Name" value={addMed.name} onChange={e => setAddMed(m => ({ ...m, name: e.target.value }))} required />
                  <input className="cdt-medication-add-input" placeholder="Dosage" value={addMed.dosage} onChange={e => setAddMed(m => ({ ...m, dosage: e.target.value }))} required />
                  <input className="cdt-medication-add-input" placeholder="Frequency" value={addMed.frequency} onChange={e => setAddMed(m => ({ ...m, frequency: e.target.value }))} required />
                  <input className="cdt-medication-add-input" placeholder="Next (e.g. 2:00 PM)" value={addMed.next} onChange={e => setAddMed(m => ({ ...m, next: e.target.value }))} />
                  <button className="cdt-medication-add-save" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                </form>
              )}
              {medications.length === 0 && <div style={{ color: '#8ca0b3', marginTop: 24 }}>No medications found.</div>}
              {Array.isArray(medications) && medications.map((med, i) => (
                <div className={`cdt-medication-item${!med.taken ? ' not-taken' : ''}`} key={med._id || i}>
                  <div className="cdt-medication-main">
                    <span className={`cdt-medication-icon${!med.taken ? ' not-taken' : ''}`}>💊</span>
                    <div className="cdt-medication-info">
                      <div className="cdt-medication-name">{med.name}</div>
                      <div className="cdt-medication-details">{med.dosage} - {med.frequency}</div>
                      <div className="cdt-medication-next">Next: {med.next}</div>
                    </div>
                  </div>
                  <div className="cdt-medication-action">
                    {med.taken ? (
                      <span className="cdt-medication-taken">Taken</span>
                    ) : (
                      <button className="cdt-medication-mark-btn" onClick={async () => {
                        setLoading(true);
                        await fetch(`/api/chronic/medications/${med._id}`, { method: 'PUT' });
                        setLoading(false);
                        // Refresh meds
                        fetch(`/api/chronic/medications?user=${userId}`)
                          .then(res => res.json())
                          .then(setMedications);
                        // Refresh AI insights and alerts
                        fetch(`/api/chronic/history?user=${userId}`)
                          .then(res => res.json())
                          .then(history => {
                            setInsightsLoading(true);
                            setAlertsLoading(true);
                            setInsightsError('');
                            setAlertsError('');
                            fetch('/api/chronic/ai-insights', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ user: userId })
                            })
                              .then(res => res.json())
                              .then(data => {
                                setAiInsights(data.insights || []);
                                setInsightsLoading(false);
                                setAlerts(data.alerts || []);
                                setAlertsLoading(false);
                                if ((!data.insights || data.insights.length === 0)) setInsightsError('No AI insights available.');
                                if ((!data.alerts || data.alerts.length === 0)) setAlertsError('No recent alerts available.');
                              })
                              .catch((err) => {
                                setAiInsights([]);
                                setInsightsLoading(false);
                                setInsightsError('Failed to load AI insights.');
                                setAlerts([]);
                                setAlertsLoading(false);
                                setAlertsError('Failed to load recent alerts.');
                                console.error('Gemini AI error:', err);
                              });
                          });
                      }}>Mark Taken</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'Log Readings' && (
          <div className="cdt-logreadings-row">
            <div className="cdt-logreadings-card">
              <div className="cdt-logreadings-title">
                <span className="cdt-logreadings-icon">＋</span>
                Log New Readings
              </div>
              <div className="cdt-logreadings-desc">Record your health measurements</div>
              <div className="cdt-logreadings-inputs">
                <div className="cdt-logreading-field">
                  <label className="cdt-logreading-label">Blood Glucose (mg/dL)</label>
                  <input className="cdt-logreading-input" type="text" placeholder="Enter glucose level" value={logGlucose} onChange={e => setLogGlucose(e.target.value)} />
                </div>
                <div className="cdt-logreading-field">
                  <label className="cdt-logreading-label">Blood Pressure (mmHg)</label>
                  <input className="cdt-logreading-input" type="text" placeholder="120/80" value={logBP} onChange={e => setLogBP(e.target.value)} />
                </div>
                <div className="cdt-logreading-field">
                  <label className="cdt-logreading-label">Weight (kg)</label>
                  <input className="cdt-logreading-input" type="text" placeholder="Enter weight" value={logWeight} onChange={e => setLogWeight(e.target.value)} />
                </div>
              </div>
              <div className="cdt-logreadings-action-row">
                <button className="cdt-logreadings-save-btn" onClick={async () => {
                  if (!logGlucose && !logBP && !logWeight) return alert('Enter at least one value');
                  setLoading(true);
                  await fetch('/api/chronic/readings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: userId, glucose: logGlucose, bp: logBP, weight: logWeight })
                  });
                  setLogGlucose('');
                  setLogBP('');
                  setLogWeight('');
                  setLoading(false);
                  // Refresh readings, metrics, summary, history
                  fetch(`/api/chronic/readings?user=${userId}`)
                    .then(res => res.json())
                    .then(readings => {
                      const latest = readings[0] || {};
                      setMetrics([
                        { icon: '📈', label: 'Blood Glucose', value: latest.glucose ?? '-', unit: 'mg/dL', target: '120 mg/dL', color: '#ffb300' },
                        { icon: '❤️', label: 'Blood Pressure', value: latest.bp ?? '-', unit: 'mmHg', target: '120/80 mmHg', color: '#29b6f6' },
                        { icon: '🎯', label: 'Weight', value: latest.weight ?? '-', unit: 'kg', target: '75 kg', color: '#1976d2' },
                        { icon: '🖥️', label: 'HbA1c', value: '-', unit: '%', target: '6.5 %', color: '#ab47bc' },
                      ]);
                      // Health score calculation
                      let score = 10;
                      if (latest.glucose !== undefined && latest.glucose !== null) {
                        if (latest.glucose > 130) score -= 2;
                        else if (latest.glucose > 110) score -= 1;
                      }
                      if (latest.bp) {
                        const [sys, dia] = (latest.bp + '').split('/').map(Number);
                        if (sys > 130 || dia > 85) score -= 2;
                        else if (sys > 120 || dia > 80) score -= 1;
                      }
                      if (latest.weight !== undefined && latest.weight !== null) {
                        if (latest.weight > 80) score -= 1;
                        if (latest.weight > 90) score -= 2;
                      }
                      if (score < 0) score = 0;
                      // Summary
                      setSummary(s => ({ ...s, readingsLogged: readings.length + '/7', healthScore: score.toFixed(1) + '/10' }));
                    });
                  fetch(`/api/chronic/history?user=${userId}`)
                    .then(res => res.json())
                    .then(history => {
                      setHistoryReadings(history);
                      // Immediately re-fetch AI insights and alerts based on updated history
                      setInsightsLoading(true);
                      setAlertsLoading(true);
                      setInsightsError('');
                      setAlertsError('');
                      fetch('/api/chronic/ai-insights', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: userId })
                      })
                        .then(res => res.json())
                        .then(data => {
                          setAiInsights(data.insights || []);
                          setInsightsLoading(false);
                          setAlerts(data.alerts || []);
                          setAlertsLoading(false);
                          if ((!data.insights || data.insights.length === 0)) setInsightsError('No AI insights available.');
                          if ((!data.alerts || data.alerts.length === 0)) setAlertsError('No recent alerts available.');
                        })
                        .catch((err) => {
                          setAiInsights([]);
                          setInsightsLoading(false);
                          setInsightsError('Failed to load AI insights.');
                          setAlerts([]);
                          setAlertsLoading(false);
                          setAlertsError('Failed to load recent alerts.');
                          console.error('Gemini AI error:', err);
                        });
                    });
                }} disabled={loading}>
                  <span className="cdt-logreadings-save-icon">＋</span>
                  {loading ? 'Saving...' : 'Save Readings'}
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'History' && (
          <div className="cdt-history-row">
            <div className="cdt-history-card">
              <div className="cdt-history-title">
                <span className="cdt-history-icon">🕒</span>
                Reading History
              </div>
              <div className="cdt-history-desc">Past 7 days of health measurements</div>
              {historyReadings.length === 0 && <div style={{ color: '#8ca0b3', marginTop: 24 }}>No readings found.</div>}
              {Array.isArray(historyReadings) && historyReadings.map((h, i) => (
                <div className="cdt-history-item" key={h._id || i}>
                  <div className="cdt-history-date">{h.date ? h.date.slice(0, 10) : '-'}</div>
                  <div className="cdt-history-values">
                    Glucose: <span className="cdt-history-glucose">{h.glucose ?? '-'} mg/dL</span>
                    &nbsp; BP: <span className="cdt-history-bp">{h.bp ?? '-'}</span>
                    &nbsp; Weight: <span className="cdt-history-weight">{h.weight ?? '-'} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 