import React, { useRef, useState } from 'react';
import './VisualAIAnalyzer.css';

export default function VisualAIAnalyzer() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Demo result for UI
  const demoResult = {
    woundType: 'Minor Cut',
    confidence: 94,
    badges: [
      { label: 'Low Severity', color: 'green' },
      { label: 'Can Self-Treat', color: 'blue' }
    ],
    recommendations: [
      'Clean the wound gently with water',
      'Apply antiseptic',
      'Cover with bandage',
      'Monitor for signs of infection'
    ]
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = e => {
    e.stopPropagation();
    setImage(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      let imageUrl = image;
      // If the image is a blob (local file), upload it to the backend
      if (image.startsWith('blob:')) {
        // Convert blob URL to File object
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files[0]) {
          alert('Please select an image file.');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        const uploadRes = await fetch('/api/visualai/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error('Image upload failed');
        imageUrl = uploadData.url;
      }
      const response = await fetch('/api/visualai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to analyze image.' });
    }
    setLoading(false);
  };

  return (
    <div className="vai-bg">
      <div className="vai-container">
        {/* Back to Home button removed */}
        <div className="vai-header">
          <div className="vai-header-icon">
            <svg width="48" height="48" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><rect x="9" y="10" width="6" height="4" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div className="vai-title">Visual AI Analyzer</div>
          <div className="vai-subtitle">AI-powered wound detection and injury assessment with instant treatment suggestions</div>
          <div className="vai-badges-row">
            <span className="vai-badge vai-badge-blue">🌀 Computer Vision</span>
            <span className="vai-badge vai-badge-plain">⏱ 5s Analysis</span>
          </div>
        </div>
        <div className="vai-cards-row">
          {/* Upload Image Card */}
          <div className="vai-card">
            <div className="vai-card-header">
              <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><rect x="9" y="10" width="6" height="4" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
              <span>Upload Image</span>
            </div>
            <div className="vai-card-desc">Take a photo or upload an image of the wound or injury</div>
            <div className="vai-upload-area" onClick={handleUploadClick} style={{ position: 'relative' }}>
              {image ? (
                <>
                  <img src={image} alt="Uploaded" className="vai-upload-img-preview" />
                  <button className="vai-remove-btn" onClick={handleRemoveImage}>Remove</button>
                </>
              ) : (
                <>
                  <svg width="48" height="48" fill="none" stroke="#8ca0b3" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><rect x="9" y="10" width="6" height="4" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
                  <div className="vai-upload-text">Click to upload or take photo</div>
                  <div className="vai-upload-support">Supports JPG, PNG, HEIC</div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            <button className="vai-analyze-btn" disabled={!image || loading} onClick={handleAnalyze}>
              <span className="vai-analyze-icon">🌀</span> {loading ? 'Analyzing...' : 'Analyze Wound'}
            </button>
            <div className="vai-btn-row">
              <button className="vai-btn vai-btn-gallery" onClick={handleUploadClick}>
                <svg width="20" height="20" fill="none" stroke="#1976d2" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="7 9 12 4 17 9"/><line x1="12" y1="4" x2="12" y2="16"/></svg>
                Upload from Gallery
              </button>
              <button className="vai-btn vai-btn-photo" onClick={handleUploadClick}>
                <svg width="20" height="20" fill="none" stroke="#1976d2" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><rect x="9" y="10" width="6" height="4" rx="1"/><circle cx="12" cy="12" r="2"/></svg>
                Take Photo
              </button>
            </div>
          </div>
          {/* Analysis Results Card */}
          <div className="vai-card vai-analysis-card">
            <div className="vai-card-header">
              <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="4"/></svg>
              <span>Analysis Results</span>
            </div>
            {result && (
              <pre style={{ background: '#f5f5f5', color: '#222', padding: '12px', borderRadius: '8px', marginTop: '16px', fontSize: '0.95rem', overflowX: 'auto' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
            {result ? (
              <div className="vai-analysis-content">
                <div className="vai-analysis-row">
                  <div>
                    <div className="vai-analysis-label">Wound Type</div>
                    <div className="vai-analysis-type">{result.woundType}</div>
                  </div>
                  <div className="vai-confidence-label">Confidence</div>
                  <div className="vai-confidence-value">{result.confidence}%</div>
                </div>
                <div className="vai-badges-inline">
                  {Array.isArray(result.badges) && result.badges.map((b, i) => (
                    <span key={i} className={`vai-badge-pill vai-badge-${b.color}`}>{b.label}</span>
                  ))}
                </div>
                <div className="vai-recommend-label">Treatment Recommendations</div>
                <ol className="vai-recommend-list">
                  {Array.isArray(result.recommendations) && result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ol>
                <button className="vai-action-btn vai-action-primary">
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                  Book Video Consultation
                </button>
                <button className="vai-action-btn vai-action-secondary">
                  <svg width="20" height="20" fill="none" stroke="#1976d2" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  Save to Health Records
                </button>
              </div>
            ) : (
              <div className="vai-upload-area vai-upload-area-result">
                <svg width="48" height="48" fill="none" stroke="#8ca0b3" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="4"/></svg>
                <div className="vai-card-desc">Upload an image to get AI-powered wound analysis</div>
              </div>
            )}
          </div>
        </div>
        {/* Safety Guidelines */}
        <div className="vai-safety-box">
          <div className="vai-safety-header">
            <svg width="24" height="24" fill="none" stroke="#e53935" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
            <span>Important Safety Guidelines</span>
          </div>
          <ul className="vai-safety-list">
            <li>This AI analysis is for reference only and should not replace professional medical advice</li>
            <li>Seek immediate medical attention for severe wounds, deep cuts, or signs of infection</li>
            <li>Always consult a healthcare professional for proper diagnosis and treatment</li>
            <li>If unsure about the severity, it's better to seek medical help</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 