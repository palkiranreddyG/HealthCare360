import React, { useState } from 'react';
import './FirstAidTrainer.css';

const EMERGENCY_CONTACTS = [
  { label: 'Ambulance', number: '108', icon: '🚑', color: '#fff', border: '#e3eaf5' },
  { label: 'Police', number: '100', icon: '📞', color: '#21cbf3', border: '#e3f8ff' },
  { label: 'Fire', number: '101', icon: '🔥', color: '#ffbfae', border: '#ffeae3' },
  { label: 'Disaster', number: '1078', icon: '⚠️', color: '#fff', border: '#e3eaf5' },
  { label: 'Women Help', number: '1091', icon: '👩', color: '#fff', border: '#e3eaf5' },
];

const TABS = ['Tutorials', 'Emergency Protocols'];

const CATEGORIES = [
  'All Categories',
  'Cardiac Emergency',
  'Breathing Issues',
  'Wounds & Bleeding',
  'Burns',
  'Trauma & Injuries',
  'Poisoning',
];

const TUTORIALS = [
  {
    title: 'CPR (Cardiopulmonary Resuscitation)',
    desc: 'Learn life-saving chest compressions and rescue breathing',
    duration: '8 minutes',
    steps: 15,
    level: 'Critical',
    emergency: true,
    languages: ['Telugu', 'English', 'Marathi', 'Tamil'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/kGVtaG9ozAY/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=kGVtaG9ozAY',
    category: 'Cardiac Emergency',
    videos: [
      { title: 'Telugu', url: 'https://www.youtube.com/watch?v=kGVtaG9ozAY' },
      { title: 'English', url: 'https://www.youtube.com/watch?v=ewdKM9NYo1A' },
      { title: 'Marathi', url: 'https://www.youtube.com/watch?v=u5IpVl9tiA4' },
      { title: 'Tamil', url: 'https://www.youtube.com/watch?v=oAlwd6NYK8g' },
    ],
  },
  {
    title: 'Choking Relief',
    desc: 'Heimlich maneuver and back blows for airway obstruction',
    duration: '5 minutes',
    steps: 8,
    level: 'High',
    emergency: true,
    languages: ['English'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/ewmbiHraztk/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=ewmbiHraztk',
    category: 'Breathing Issues',
    videos: [
      { title: 'English', url: 'https://www.youtube.com/watch?v=ewmbiHraztk' },
    ],
  },
  {
    title: 'Wound Care & Bleeding Control',
    desc: 'Proper wound cleaning and bleeding management',
    duration: '6 minutes',
    steps: 12,
    level: 'Medium',
    emergency: false,
    languages: ['English'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/gMMfl0wCxHM/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=gMMfl0wCxHM',
    category: 'Wounds & Bleeding',
    videos: [
      { title: 'English', url: 'https://www.youtube.com/watch?v=gMMfl0wCxHM' },
    ],
  },
  {
    title: 'Burn Treatment',
    desc: 'First aid for thermal, chemical, and electrical burns',
    duration: '7 minutes',
    steps: 10,
    level: 'Medium',
    emergency: false,
    languages: ['English'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/LIaqKI7B8EI/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=LIaqKI7B8EI',
    category: 'Burns',
    videos: [
      { title: 'English', url: 'https://www.youtube.com/watch?v=LIaqKI7B8EI' },
    ],
  },
  {
    title: 'Fracture & Sprain Management',
    desc: 'Immobilization and support for bone and joint injuries',
    duration: '9 minutes',
    steps: 14,
    level: 'Medium',
    emergency: false,
    languages: ['English'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/sPzXAVNVJr0/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=sPzXAVNVJr0',
    category: 'Trauma & Injuries',
    videos: [
      { title: 'English', url: 'https://www.youtube.com/watch?v=sPzXAVNVJr0' },
    ],
  },
  {
    title: 'Poisoning Response',
    desc: 'Emergency steps for accidental poisoning incidents',
    duration: '4 minutes',
    steps: 6,
    level: 'High',
    emergency: true,
    languages: ['English'],
    moreLangs: 0,
    img: 'https://img.youtube.com/vi/PgGUSAM6XJw/hqdefault.jpg',
    video: 'https://www.youtube.com/watch?v=PgGUSAM6XJw',
    category: 'Poisoning',
    videos: [
      { title: 'English', url: 'https://www.youtube.com/watch?v=PgGUSAM6XJw' },
    ],
  },
];

const PROTOCOLS = [
  {
    title: 'Heart Attack',
    steps: [
      'Call 108 immediately',
      'Help victim sit down and rest',
      'Loosen tight clothing',
      'Give aspirin if available and no allergies',
      'Monitor breathing and pulse',
    ],
  },
  {
    title: 'Severe Bleeding',
    steps: [
      'Apply direct pressure with clean cloth',
      'Elevate injured area if possible',
      'Apply pressure to pressure points',
      'Call 108 for medical help',
      'Monitor for shock symptoms',
    ],
  },
  {
    title: 'Unconsciousness',
    steps: [
      'Check for responsiveness',
      'Check breathing and pulse',
      'Place in recovery position',
      'Clear airway if needed',
      'Call emergency services',
    ],
  },
  {
    title: 'Burns',
    steps: [
      'Remove victim from source of burn',
      'Cool burn with running water for 10-20 minutes',
      'Remove tight items (rings, belts) from area',
      'Cover burn with sterile, non-fluffy dressing',
      'Do not apply creams or break blisters',
      'Call emergency services if severe',
    ],
  },
  {
    title: 'Choking',
    steps: [
      'Ask if victim can cough or speak',
      'Encourage coughing if possible',
      'Give 5 back blows between shoulder blades',
      'If needed, give 5 abdominal thrusts (Heimlich maneuver)',
      'Repeat until object is expelled or help arrives',
    ],
  },
  {
    title: 'Fracture or Sprain',
    steps: [
      'Immobilize the injured area',
      'Apply a cold pack to reduce swelling',
      'Elevate limb if possible',
      'Do not try to realign bone',
      'Seek medical attention',
    ],
  },
  {
    title: 'Drowning',
    steps: [
      'Remove person from water safely',
      'Check for breathing and pulse',
      'Call emergency services',
      'If not breathing, start CPR',
      'Keep victim warm and monitor until help arrives',
    ],
  },
  {
    title: 'Electric Shock',
    steps: [
      'Turn off power source if safe',
      'Do not touch victim with bare hands if still in contact',
      'Call emergency services',
      'Check for breathing and pulse',
      'Start CPR if needed',
      'Treat burns and injuries',
    ],
  },
  {
    title: 'Poisoning',
    steps: [
      'Check for danger to yourself and victim',
      'Call emergency services or poison helpline',
      'Do not induce vomiting unless instructed',
      'Keep victim still and monitor breathing',
      'Provide information about the poison if possible',
    ],
  },
  {
    title: 'Asthma Attack',
    steps: [
      'Help the person sit upright and stay calm',
      'Assist with their inhaler (2 puffs every 2 minutes, up to 10 puffs)',
      'Loosen tight clothing',
      'Call emergency services if no improvement',
      'Monitor breathing and be ready to start CPR if needed',
    ],
  },
];

export default function FirstAidTrainer() {
  const [tab, setTab] = useState('Tutorials');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef();
  const [openVideo, setOpenVideo] = useState(null); // { title, video }

  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const filteredTutorials = TUTORIALS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All Categories' || t.category === category)
  );

  // Helper to extract YouTube video ID
  const getYouTubeId = url => {
    const match = url.match(/(?:v=|\.be\/)([\w-]{11})/);
    return match ? match[1] : '';
  };

  return (
    <div className="fat-bg">
      <div className="fat-container">
        {/* Header */}
        <div className="fat-header-row">
          <div>
            <h1 className="fat-title">First-Aid Trainer</h1>
            <div className="fat-subtitle">Interactive emergency care tutorials</div>
          </div>
          <div className="fat-header-actions">
            <span className="fat-lifesaving">♡ Life Saving</span>
            <button className="fat-lang-btn">🌐 28+ Languages</button>
          </div>
        </div>
        {/* Emergency Contacts */}
        <div className="fat-emergency-box">
          <div className="fat-emergency-left">
            <span className="fat-emergency-icon">⚠️</span>
            <div>
              <div className="fat-emergency-title">Emergency Contacts</div>
              <div className="fat-emergency-desc">Quick access to emergency services</div>
            </div>
          </div>
          <div className="fat-emergency-contacts">
            {EMERGENCY_CONTACTS.map((c, i) => (
              <div key={i} className="fat-emergency-contact" style={{ borderColor: c.border }}>
                <span className="fat-emergency-contact-icon">{c.icon}</span>
                <div className="fat-emergency-contact-num">{c.number}</div>
                <div className="fat-emergency-contact-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Search and Filter */}
        <div className="fat-search-row">
          <div className="fat-search-box">
            <span className="fat-search-icon">🔍</span>
            <input
              className="fat-search-input"
              placeholder="Search first-aid tutorials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="fat-filter-box" ref={dropdownRef}>
            <button className="fat-filter-btn" onClick={() => setDropdownOpen(o => !o)}>
              <span style={{ marginRight: 6 }}>⏷</span>
            </button>
            <span className="fat-filter-label" onClick={() => setDropdownOpen(o => !o)} style={{ cursor: 'pointer' }}>{category}</span>
            {dropdownOpen && (
              <div className="fat-category-dropdown">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat}
                    className={`fat-category-option${cat === category ? ' fat-category-option-active' : ''}`}
                    onClick={() => { setCategory(cat); setDropdownOpen(false); }}
                  >
                    {cat === category && <span className="fat-category-check">✔</span>}
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="fat-tabs-row">
          {TABS.map(t => (
            <button
              key={t}
              className={`fat-tab-btn${tab === t ? ' fat-tab-btn-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {tab === 'Tutorials' && (
          <div className="fat-tutorials-grid">
            {filteredTutorials.map((t, i) => (
              <div key={i} className={`fat-tutorial-card${i === 2 ? ' fat-tutorial-card-active' : ''}`}>
                <div className="fat-tutorial-img" onClick={() => setOpenVideo(t)} style={{ cursor: 'pointer' }}>
                  <img src={t.img} alt={t.title} />
                  <div className="fat-tutorial-img-overlay">
                    <span className="fat-tutorial-play">▶</span>
                  </div>
                </div>
                <div className="fat-tutorial-level-row">
                  {t.level && <span className={`fat-tutorial-level fat-tutorial-level-${t.level.toLowerCase()}`}>{t.level}</span>}
                  {t.emergency && <span className="fat-tutorial-emergency">⚠️ Emergency</span>}
                </div>
                <div className="fat-tutorial-title">{t.title}</div>
                <div className="fat-tutorial-desc">{t.desc}</div>
                <div className="fat-tutorial-meta-row">
                  <span className="fat-tutorial-meta">⏱ {t.duration}</span>
                  <span className="fat-tutorial-meta">{t.steps} steps</span>
                </div>
                <div className="fat-tutorial-langs-row">
                  {t.languages.map((lang, idx) => (
                    <span key={idx} className="fat-tutorial-lang">{lang}</span>
                  ))}
                  {t.moreLangs > 0 && <span className="fat-tutorial-lang-more">+{t.moreLangs}</span>}
                </div>
                <button className="fat-tutorial-start-btn" onClick={() => setOpenVideo(t)}>▶ Start Tutorial</button>
                {/* Additional videos thumbnails */}
                {t.videos && t.videos.length > 0 && (
                  <div className="fat-tutorial-videos-row">
                    {t.videos.map((v, vidx) => {
                      const isYouTube = v.url.includes('youtube.com');
                      const ytId = isYouTube ? getYouTubeId(v.url) : null;
                      return (
                        <div key={vidx} className="fat-tutorial-video-thumb" onClick={() => v.external ? window.open(v.url, '_blank') : setOpenVideo({ ...t, video: v.url, img: isYouTube ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : t.img })} style={{ cursor: 'pointer' }}>
                          <img src={isYouTube ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '/redcross-burns-thumb.png'} alt={v.title} />
                          <div className="fat-tutorial-video-title">{v.title}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab === 'Emergency Protocols' && (
          <div className="fat-protocols-grid">
            {PROTOCOLS.map((p, idx) => (
              <div className="fat-protocol-card" key={p.title}>
                <div className="fat-protocol-header-row">
                  <span className="fat-protocol-icon">⚠️</span>
                  <span className="fat-protocol-title">{p.title}</span>
                </div>
                <div className="fat-protocol-subtitle">Step-by-step emergency response protocol</div>
                <ol className="fat-protocol-steps">
                  {p.steps.map((step, i) => (
                    <li key={i} className="fat-protocol-step"><span className="fat-protocol-step-num">{i+1}</span> {step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
        {/* My Progress tab and content removed */}
      </div>
      {/* Video Modal */}
      {openVideo && (
        <div className="fat-video-modal" onClick={() => setOpenVideo(null)}>
          <div className="fat-video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="fat-video-modal-close" onClick={() => setOpenVideo(null)}>&times;</button>
            <div className="fat-video-modal-title">{openVideo.title}</div>
            <div className="fat-video-modal-player">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${getYouTubeId(openVideo.video)}?autoplay=1`}
                title={openVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 