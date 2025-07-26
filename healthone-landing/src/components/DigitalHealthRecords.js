import React, { useState, useEffect } from 'react';
import './DigitalHealthRecords.css';

const RECORD_TYPES = [
  'Blood Test Report',
  'Chest X-Ray',
  'Diabetes Checkup',
  'Vaccination Record',
  'Other',
];
const STATUS_OPTIONS = [
  'Normal',
  'Clear',
  'Controlled',
  'Complete',
  'Pending',
];

const DigitalHealthRecords = () => {
  const [tab, setTab] = useState('Medical Records');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [sharing, setSharing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: '',
    date: '',
    doctor: '',
    hospital: '',
    status: '',
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showAddSummary, setShowAddSummary] = useState({ type: '', open: false });
  const [summaryInput, setSummaryInput] = useState('');
  const [addingSummary, setAddingSummary] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [providerForm, setProviderForm] = useState({ name: '', meta: '' });
  const [addingProvider, setAddingProvider] = useState(false);

  useEffect(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem('user'));
      setUser(userObj || {});
    } catch {
      setUser({});
    }
  }, []);

  // Fetch records
  useEffect(() => {
    if (!user || !user._id) return;
    setLoading(true);
    setError('');
    fetch(`/api/health-records/records?user=${user._id}`)
      .then(res => res.json())
      .then(data => { setRecords(data); setLoading(false); })
      .catch(() => { setError('Failed to load records'); setLoading(false); });
  }, [user]);

  // Fetch summary
  useEffect(() => {
    if (!user || !user._id) return;
    fetch(`/api/health-records/summary?user=${user._id}`)
      .then(res => res.json())
      .then(setSummary)
      .catch(() => {});
  }, [user]);

  // Fetch timeline
  useEffect(() => {
    if (!user || !user._id) return;
    fetch(`/api/health-records/timeline?user=${user._id}`)
      .then(res => res.json())
      .then(setTimeline)
      .catch(() => {});
  }, [user]);

  // Fetch sharing
  useEffect(() => {
    if (!user || !user._id) return;
    fetch(`/api/health-records/sharing?user=${user._id}`)
      .then(res => res.json())
      .then(data => setSharing(data.providers || []))
      .catch(() => {});
  }, [user]);

  // Add record modal form submit
  const handleFormChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };
  const handleAddRecord = async e => {
    e.preventDefault();
    if (!form.type || !form.date || !form.doctor || !form.hospital || !form.status) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('user', user._id);
    fd.append('type', form.type);
    fd.append('date', form.date);
    fd.append('doctor', form.doctor);
    fd.append('hospital', form.hospital);
    fd.append('status', form.status);
    if (form.file) fd.append('file', form.file);
    await fetch('/api/health-records/records', {
      method: 'POST',
      body: fd,
    });
    setShowModal(false);
    setForm({ type: '', date: '', doctor: '', hospital: '', status: '', file: null });
    setUploading(false);
    // Refresh
    fetch(`/api/health-records/records?user=${user._id}`)
      .then(res => res.json())
      .then(data => { setRecords(data); setLoading(false); });
  };

  // Add allergy/chronic
  const handleAddSummary = async (type) => {
    setAddingSummary(true);
    await fetch('/api/health-records/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user._id, type, value: summaryInput })
    });
    setShowAddSummary({ type: '', open: false });
    setSummaryInput('');
    setAddingSummary(false);
    // Refresh summary
    fetch(`/api/health-records/summary?user=${user._id}`)
      .then(res => res.json())
      .then(setSummary);
  };

  // Revoke access
  const handleRevokeAccess = async (id) => {
    await fetch(`/api/health-records/sharing/${id}`, { method: 'DELETE' });
    fetch(`/api/health-records/sharing?user=${user._id}`)
      .then(res => res.json())
      .then(data => setSharing(data.providers || []));
  };

  const handleProviderFormChange = e => {
    const { name, value } = e.target;
    setProviderForm(f => ({ ...f, [name]: value }));
  };
  const handleAddProvider = async e => {
    e.preventDefault();
    setAddingProvider(true);
    await fetch('/api/health-records/sharing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user._id, name: providerForm.name, meta: providerForm.meta })
    });
    setShowAddProvider(false);
    setProviderForm({ name: '', meta: '' });
    setAddingProvider(false);
    // Refresh
    fetch(`/api/health-records/sharing?user=${user._id}`)
      .then(res => res.json())
      .then(data => setSharing(data.providers || []));
  };

  // Helper to get file extension
  const getFileExt = (url) => url ? url.split('.').pop().toLowerCase() : '';

  // Copy to clipboard helper
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="dhr-root">
      <div className="dhr-header-row">
        <div>
          <h1 className="dhr-title">Digital Health Records</h1>
          <div className="dhr-subtitle">Secure, blockchain-powered medical history</div>
        </div>
        <div className="dhr-badges">
          <span className="dhr-badge dhr-badge-abdm">ABDM Integrated</span>
          <span className="dhr-badge dhr-badge-blockchain">Blockchain Secured</span>
        </div>
      </div>
      <div className="dhr-profile-card">
        <div className="dhr-profile-left">
          <div className="dhr-profile-initials">{user.fullName ? user.fullName[0] : 'U'}</div>
        </div>
        <div className="dhr-profile-main">
          <div className="dhr-profile-name">{user.fullName || 'User'}</div>
          <div className="dhr-profile-id">Aadhaar: XXXX-XXXX-1234</div>
        </div>
        <div className="dhr-profile-stats">
          <div className="dhr-profile-stat">
            <div className="dhr-profile-stat-value">{summary?.bloodGroup || '-'}</div>
            <div className="dhr-profile-stat-label">Blood Group</div>
          </div>
          <div className="dhr-profile-stat">
            <div className="dhr-profile-stat-value">{summary?.allergies?.length || 0}</div>
            <div className="dhr-profile-stat-label">Known Allergies</div>
          </div>
          <div className="dhr-profile-stat">
            <div className="dhr-profile-stat-value">{summary?.chronic?.length || 0}</div>
            <div className="dhr-profile-stat-label">Chronic Conditions</div>
          </div>
          <div className="dhr-profile-stat">
            <div className="dhr-profile-stat-value">{records.length}</div>
            <div className="dhr-profile-stat-label">Total Records</div>
          </div>
        </div>
        <div className="dhr-profile-right">
          <button className="dhr-share-btn">Share with Doctor</button>
          <div className="dhr-verified">Verified Profile</div>
        </div>
      </div>
      <div className="dhr-search-row">
        <div className="dhr-search-box">
          <span className="dhr-search-icon">🔍</span>
          <input className="dhr-search-input" placeholder="Search medical records..." />
        </div>
        <div className="dhr-filter-box">
          <span className="dhr-filter-icon">⏷</span>
          <select className="dhr-filter-select">
            <option>All Records</option>
            <option>Lab Reports</option>
            <option>Imaging</option>
            <option>Vaccinations</option>
          </select>
        </div>
        <button className="dhr-add-record-btn" onClick={() => setShowModal(true)}>+ Add Record</button>
      </div>
      <div className="dhr-tabs">
        <button className={tab === 'Medical Records' ? 'active' : ''} onClick={() => setTab('Medical Records')}>Medical Records</button>
        <button className={tab === 'Health Summary' ? 'active' : ''} onClick={() => setTab('Health Summary')}>Health Summary</button>
        <button className={tab === 'Timeline' ? 'active' : ''} onClick={() => setTab('Timeline')}>Timeline</button>
        <button className={tab === 'Sharing' ? 'active' : ''} onClick={() => setTab('Sharing')}>Sharing</button>
      </div>
      {loading && <div style={{ margin: 32, color: '#1976d2' }}>Loading...</div>}
      {error && <div style={{ margin: 32, color: 'red' }}>{error}</div>}
      {tab === 'Medical Records' && !loading && (
        <div className="dhr-records-list">
          {records.map((rec, i) => (
            <div className="dhr-record-item-grid" key={rec._id || i}>
              <div className="dhr-record-type-col">
                <span className="dhr-record-icon" style={{cursor: rec.fileUrl ? 'pointer' : 'default'}} onClick={() => rec.fileUrl && setPreviewFile({url: rec.fileUrl, type: rec.type})}>📄</span>
                <span className="dhr-record-type">{rec.type}</span>
              </div>
              <div className="dhr-record-date-col">{rec.date?.slice(0, 10)}</div>
              <div className="dhr-record-doctor-col">{rec.doctor}</div>
              <div className="dhr-record-hospital-col">{rec.hospital}</div>
              <div className="dhr-record-status-col">
                <span className="dhr-record-status">{rec.status}</span>
              </div>
              <div className="dhr-record-actions-col">
                {rec.fileUrl && <button className="dhr-download-btn" onClick={() => setPreviewFile({url: rec.fileUrl, type: rec.type})}>⬇️</button>}
                <button className="dhr-share-btn" onClick={() => setShareFile({url: rec.fileUrl})}>🔗</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'Health Summary' && summary && (
        <div className="dhr-summary-row">
          <div className="dhr-summary-card dhr-summary-allergies">
            <div className="dhr-summary-title"><span className="dhr-summary-icon">♡</span> Allergies & Conditions</div>
            <div className="dhr-summary-section">
              <div className="dhr-summary-label">Allergies
                <button className="dhr-summary-add-btn" onClick={() => setShowAddSummary({ type: 'allergy', open: true })}>+</button>
              </div>
              <div className="dhr-summary-chips">
                {summary.allergies?.map((a, i) => <span className="dhr-chip" key={i}>{a}</span>)}
              </div>
            </div>
            <div className="dhr-summary-section">
              <div className="dhr-summary-label">Chronic Conditions
                <button className="dhr-summary-add-btn" onClick={() => setShowAddSummary({ type: 'chronic', open: true })}>+</button>
              </div>
              <div className="dhr-summary-chips">
                {summary.chronic?.map((c, i) => <span className="dhr-chip dhr-chip-blue" key={i}>{c}</span>)}
              </div>
            </div>
          </div>
          <div className="dhr-summary-card dhr-summary-vitals">
            <div className="dhr-summary-title"><span className="dhr-summary-icon">🩺</span> Vital Information</div>
            <div className="dhr-summary-vital-row">
              <span>Blood Group</span>
              <span className="dhr-summary-vital-value">{summary.bloodGroup}</span>
            </div>
            <div className="dhr-summary-vital-row">
              <span>Emergency Contact</span>
              <span className="dhr-summary-vital-value">{summary.emergencyContact}</span>
            </div>
            <div className="dhr-summary-vital-row">
              <span>Last Checkup</span>
              <span className="dhr-summary-vital-value">{summary.lastCheckup}</span>
            </div>
          </div>
        </div>
      )}
      {showAddSummary.open && (
        <div className="dhr-modal-overlay">
          <div className="dhr-modal">
            <h2>Add {showAddSummary.type === 'allergy' ? 'Allergy' : 'Chronic Condition'}</h2>
            <form onSubmit={e => { e.preventDefault(); handleAddSummary(showAddSummary.type); }}>
              <input type="text" value={summaryInput} onChange={e => setSummaryInput(e.target.value)} required placeholder={`Enter ${showAddSummary.type === 'allergy' ? 'allergy' : 'condition'}`} />
              <div className="dhr-modal-actions">
                <button type="button" onClick={() => setShowAddSummary({ type: '', open: false })} disabled={addingSummary}>Cancel</button>
                <button type="submit" disabled={addingSummary}>{addingSummary ? 'Adding...' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {tab === 'Timeline' && (
        <div className="dhr-timeline-card">
          <div className="dhr-timeline-title"><span className="dhr-timeline-icon">⏰</span> Medical Timeline</div>
          <div className="dhr-timeline-subtitle">Chronological view of your medical history</div>
          <div className="dhr-timeline-list">
            {timeline.map((rec, i) => (
              <div className="dhr-timeline-row" key={rec._id || i}>
                <div className="dhr-timeline-main">
                  <span className="dhr-timeline-icon-doc">📄</span>
                  <div>
                    <div className="dhr-timeline-type">{rec.type}</div>
                    <div className="dhr-timeline-meta">{rec.doctor} - {rec.hospital}</div>
                    <span className="dhr-timeline-status">{rec.status}</span>
                  </div>
                </div>
                <div className="dhr-timeline-date">{rec.date?.slice(0, 10)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'Sharing' && (
        <div className="dhr-sharing-card">
          <div className="dhr-sharing-title"><span className="dhr-sharing-icon">🔗</span> Record Sharing</div>
          <div className="dhr-sharing-subtitle">Control who can access your medical records</div>
          <div className="dhr-sharing-section">
            <div className="dhr-sharing-label">Authorized Healthcare Providers</div>
            <div className="dhr-sharing-list">
              {sharing.map((prov, i) => (
                <div className="dhr-sharing-provider-row" key={prov.id || i}>
                  <div>
                    <div className="dhr-sharing-provider-name">{prov.name}</div>
                    <div className="dhr-sharing-provider-meta">{prov.meta}</div>
                  </div>
                  <button className="dhr-sharing-revoke-btn" onClick={() => handleRevokeAccess(prov.id)}>Revoke Access</button>
                </div>
              ))}
            </div>
          </div>
          <div className="dhr-sharing-grant-row" onClick={() => setShowAddProvider(true)} style={{cursor:'pointer'}}>
            <span className="dhr-sharing-grant-plus">+</span> <span className="dhr-sharing-grant-label">Grant Access to New Provider</span>
          </div>
          {showAddProvider && (
            <div className="dhr-modal-overlay">
              <div className="dhr-modal">
                <h2>Grant Access to New Provider</h2>
                <form onSubmit={handleAddProvider}>
                  <label>Name
                    <input type="text" name="name" value={providerForm.name} onChange={handleProviderFormChange} required />
                  </label>
                  <label>Hospital/Department
                    <input type="text" name="meta" value={providerForm.meta} onChange={handleProviderFormChange} required />
                  </label>
                  <div className="dhr-modal-actions">
                    <button type="button" onClick={() => setShowAddProvider(false)} disabled={addingProvider}>Cancel</button>
                    <button type="submit" disabled={addingProvider}>{addingProvider ? 'Adding...' : 'Grant Access'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Add Record Modal */}
      {showModal && (
        <div className="dhr-modal-overlay">
          <div className="dhr-modal">
            <h2>Add Medical Record</h2>
            <form onSubmit={handleAddRecord}>
              <label>Type
                <select name="type" value={form.type} onChange={handleFormChange} required>
                  <option value="">Select type</option>
                  {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Date
                <input type="date" name="date" value={form.date} onChange={handleFormChange} required />
              </label>
              <label>Doctor
                <input type="text" name="doctor" value={form.doctor} onChange={handleFormChange} required />
              </label>
              <label>Hospital
                <input type="text" name="hospital" value={form.hospital} onChange={handleFormChange} required />
              </label>
              <label>Status
                <select name="status" value={form.status} onChange={handleFormChange} required>
                  <option value="">Select status</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>File
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFormChange} />
              </label>
              <div className="dhr-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</button>
                <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* File Preview Modal */}
      {previewFile && (
        <div className="dhr-modal-overlay">
          <div className="dhr-modal dhr-preview-modal">
            <button className="dhr-modal-close" onClick={() => setPreviewFile(null)}>&times;</button>
            <h2>Report Preview</h2>
            {getFileExt(previewFile.url) === 'pdf' ? (
              <iframe src={previewFile.url} title="PDF Preview" width="100%" height="400px" style={{border:0}} />
            ) : getFileExt(previewFile.url).match(/jpg|jpeg|png/) ? (
              <img src={previewFile.url} alt="Report Preview" style={{maxWidth:'100%', maxHeight:400, borderRadius:8}} />
            ) : (
              <a href={previewFile.url} target="_blank" rel="noopener noreferrer">Download File</a>
            )}
          </div>
        </div>
      )}
      {/* Share Modal */}
      {shareFile && (
        <div className="dhr-modal-overlay">
          <div className="dhr-modal dhr-preview-modal">
            <button className="dhr-modal-close" onClick={() => setShareFile(null)}>&times;</button>
            <h2>Share Record</h2>
            {shareFile.url ? (
              <>
                <div className="dhr-share-link-box">
                  <input type="text" value={window.location.origin + shareFile.url} readOnly style={{width:'100%'}} />
                  <button className="dhr-share-copy-btn" onClick={() => handleCopyLink(shareFile.url)}>{copied ? 'Copied!' : 'Copy Link'}</button>
                </div>
                <div style={{fontSize:'0.98rem', color:'#4a90e2', marginTop:8}}>Anyone with this link can view/download the report.</div>
              </>
            ) : (
              <div style={{color:'red'}}>No file attached to this record.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalHealthRecords; 