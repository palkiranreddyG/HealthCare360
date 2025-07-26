import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommunityHealthForum.css';

const STATS = [
  { value: '4,127', label: 'Total Posts' },
  { value: '892', label: 'Active Today', accent: true },
  { value: '156', label: 'Expert Answers' },
  { value: '98%', label: 'Helpful Rate' },
];

const CATEGORIES = [
  { icon: '🤍', name: 'General Health' },
  { icon: '🧠', name: 'Mental Wellness' },
  { icon: '🍏', name: 'Nutrition & Diet' },
  { icon: '🏋️‍♂️', name: 'Fitness & Exercise' },
  { icon: '📈', name: 'Chronic Conditions' },
  { icon: '👶', name: 'Parenting & Child Health' },
];

const CATEGORY_OPTIONS = [
  'All Categories',
  ...CATEGORIES.map(c => c.name),
];

function getInitials(name) {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
}

// Helper for time ago
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(date).toLocaleDateString();
}

export default function CommunityHealthForum() {
  const [category, setCategory] = useState('All Categories');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General Health' });
  const [creating, setCreating] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [user] = useState({ _id: '663f1d1f1f1f1f1f1f1f1f1f', fullName: 'Test User', badge: 'Health Enthusiast' }); // Use the actual ObjectId from the database if needed
  const [contributors, setContributors] = useState([]);
  const [trending, setTrending] = useState([]);
  const dropdownRef = useRef();
  const commentsEndRef = useRef(null);
  const [shareTooltip, setShareTooltip] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPosts: '-', activeToday: '-', expertAnswers: '-', helpfulRate: '-' });
  const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

  // Fetch posts
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BACKEND_URL}/api/forum/posts${category && category !== 'All Categories' ? `?category=${encodeURIComponent(category)}` : ''}`)
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(e => { setError('Failed to load posts'); setLoading(false); });
  }, [category]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/forum/top-contributors`)
      .then(res => res.json())
      .then(setContributors)
      .catch(() => setContributors([]));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/forum/trending-topics`)
      .then(res => res.json())
      .then(setTrending)
      .catch(() => setTrending([]));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/forum/stats`)
      .then(res => res.json())
      .then(data => setStats({
        totalPosts: data.totalPosts ?? '-',
        activeToday: data.activeToday ?? '-',
        expertAnswers: data.expertAnswers ?? '-',
        helpfulRate: data.helpfulRate !== undefined ? data.helpfulRate + '%' : '-'
      }))
      .catch(() => setStats({ totalPosts: '-', activeToday: '-', expertAnswers: '-', helpfulRate: '-' }));
  }, []);

  // Dropdown close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Scroll to latest comment in chat
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [modalPost?.comments?.length]);

  // Open post modal
  const openPostModal = (post) => {
    setModalPost({ ...post, comments: null, loading: true, error: null });
    fetch(`${BACKEND_URL}/api/forum/posts/${post._id}`)
      .then(res => res.json())
      .then(data => setModalPost({ ...data, loading: false, error: null }))
      .catch(e => setModalPost({ ...post, loading: false, error: 'Failed to load post' }));
  };

  // Create new post
  const handleCreatePost = (e) => {
    e.preventDefault();
    setCreating(true);
    fetch(`${BACKEND_URL}/api/forum/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPost, user: user._id })
    })
      .then(res => res.json())
      .then(post => {
        setPosts([post, ...posts]);
        setShowModal(false);
        setNewPost({ title: '', content: '', category: 'General Health' });
        setCreating(false);
      })
      .catch(() => setCreating(false));
  };

  // Add comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!modalPost || !commentText.trim()) return;
    setCommentLoading(true);
    fetch(`${BACKEND_URL}/api/forum/posts/${modalPost._id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentText, user: user._id })
    })
      .then(res => res.json())
      .then(comment => {
        setModalPost({ ...modalPost, comments: [...(modalPost.comments || []), comment] });
        setCommentText('');
        setCommentLoading(false);
      })
      .catch(() => setCommentLoading(false));
  };

  // Like/unlike post
  const handleLikePost = (postId) => {
    fetch(`${BACKEND_URL}/api/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user._id })
    })
      .then(res => res.json())
      .then(() => {
        setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: p.likes.includes(user._id) ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] } : p));
        if (modalPost && modalPost._id === postId) {
          setModalPost({ ...modalPost, likes: modalPost.likes.includes(user._id) ? modalPost.likes.filter(id => id !== user._id) : [...modalPost.likes, user._id] });
        }
      });
  };

  // Like/unlike comment
  const handleLikeComment = (commentId) => {
    fetch(`${BACKEND_URL}/api/forum/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user._id })
    })
      .then(res => res.json())
      .then(() => {
        setModalPost(mp => ({
          ...mp,
          comments: mp.comments.map(c => c._id === commentId ? { ...c, likes: c.likes.includes(user._id) ? c.likes.filter(id => id !== user._id) : [...c.likes, user._id] } : c)
        }));
      });
  };

  // Share handler
  const handleShare = (postId) => {
    const url = window.location.origin + '/#discussion-' + postId;
    navigator.clipboard.writeText(url);
    setShareTooltip(postId);
    setTimeout(() => setShareTooltip(null), 1500);
  };

  return (
    <div className="chf-bg">
      <div className="chf-container">
        {/* Header */}
        <div className="chf-header-row">
          <div>
            <h1 className="chf-title">Community Health Forum</h1>
            <div className="chf-subtitle">Connect, share, and learn from health experts and peers</div>
          </div>
          <div className="chf-header-actions">
            <span className="chf-header-members">👥 50K+ Members</span>
            <span className="chf-header-verified">🛡️ Expert Verified</span>
          </div>
        </div>
        {/* Stats */}
        <div className="chf-stats-row">
          <div
            className="chf-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/forum')}
          >
            <div className="chf-stat-value">{stats.totalPosts}</div>
            <div className="chf-stat-label">Total Posts</div>
          </div>
          <div
            className="chf-stat-card chf-stat-accent"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/forum?filter=active-today')}
          >
            <div className="chf-stat-value" style={{ color: '#1976d2' }}>{stats.activeToday}</div>
            <div className="chf-stat-label">Active Today</div>
          </div>
          <div
            className="chf-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/forum?filter=expert-answers')}
          >
            <div className="chf-stat-value">{stats.expertAnswers}</div>
            <div className="chf-stat-label">Expert Answers</div>
          </div>
          <div
            className="chf-stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/forum/helpful-rate')}
          >
            <div className="chf-stat-value">{stats.helpfulRate}</div>
            <div className="chf-stat-label">Helpful Rate</div>
          </div>
        </div>
        {/* Search/Filter/New Post */}
        <div className="chf-search-row">
          <div className="chf-search-box">
            <span className="chf-search-icon">🔍</span>
            <input className="chf-search-input" placeholder="Search discussions, topics, or ask a question..." />
          </div>
          <div className="chf-filter-box" ref={dropdownRef}>
            <button className="chf-filter-btn" onClick={() => setDropdownOpen(o => !o)}>
              <span className="chf-filter-icon">&#128269;</span>
              <span className="chf-filter-label">{category}</span>
              <span className="chf-filter-chevron">▼</span>
            </button>
            {dropdownOpen && (
              <div className="chf-category-dropdown">
                {CATEGORY_OPTIONS.map(opt => (
                  <div
                    key={opt}
                    className={`chf-category-option${opt === category ? ' chf-category-option-active' : ''}`}
                    onClick={() => { setCategory(opt); setDropdownOpen(false); }}
                  >
                    {opt === category && <span className="chf-category-check">✔</span>}
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="chf-newpost-btn" onClick={() => setShowModal(true)}>＋ New Post</button>
        </div>
        {/* Main Content */}
        <div className="chf-main-row">
          <div className="chf-main-left">
            {/* Forum Categories */}
            <div className="chf-categories-card">
              <div className="chf-categories-title">Forum Categories</div>
              <div className="chf-categories-grid">
                {CATEGORIES.map((c, i) => (
                  <div className="chf-category-item" key={i}>
                    <span className="chf-category-icon">{c.icon}</span>
                    <span className="chf-category-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Discussions */}
            <div className="chf-recent-card">
              <div className="chf-recent-title">🗓️ Recent Discussions</div>
              {loading ? <div className="chf-loading">Loading...</div> : error ? <div className="chf-error">{error}</div> : posts.length === 0 ? <div className="chf-empty">No posts yet.</div> : posts.map((r, i) => (
                <div className="chf-discussion-item" key={r._id} onClick={() => openPostModal(r)}>
                  <div className="chf-discussion-avatar">{getInitials(r.user?.fullName)}</div>
                  <div className="chf-discussion-main">
                    <div className="chf-discussion-header">
                      <span className="chf-discussion-title">{r.title}</span>
                      {r.user?.expert && <span className="chf-expert-badge">🛡️ Expert</span>}
                    </div>
                    <div className="chf-discussion-meta">
                      <span className="chf-discussion-user">{r.user?.fullName}</span>
                      {r.user?.badge && <span className="chf-user-badge">{r.user.badge}</span>}
                      <span className="chf-discussion-time">{timeAgo(r.createdAt)}</span>
                    </div>
                    <div className="chf-discussion-desc">{r.content}</div>
                    <div className="chf-discussion-stats">
                      <span className="chf-discussion-stat"><span role="img" aria-label="comments">💬</span> {r.comments?.length || 0}</span>
                      <span className={`chf-discussion-stat chf-like-btn${r.likes?.includes(user._id) ? ' liked' : ''}`} onClick={e => { e.stopPropagation(); handleLikePost(r._id); }}>
                        <span role="img" aria-label="likes">👍</span> {r.likes?.length || 0}
                      </span>
                    </div>
                    <div className="chf-discussion-actions">
                      <span className="chf-discussion-action">↩️ Reply</span>
                      <span className="chf-discussion-action" onClick={e => { e.stopPropagation(); handleShare(r._id); }}>
                        ⤴️ Share
                        {shareTooltip === r._id && <span className="chf-share-tooltip">Link copied!</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chf-main-right">
            {/* Trending Topics (dynamic) */}
            <div className="chf-trending-card">
              <div className="chf-trending-title">📈 Trending Topics</div>
              {trending.length === 0 ? (
                <div className="chf-empty">No trending topics yet.</div>
              ) : trending.map(t => (
                <div className="chf-trending-item" key={t.topic}>
                  <span className="chf-trending-topic">{t.topic}</span>
                  <span className="chf-trending-count">{t.count}</span>
                </div>
              ))}
            </div>
            {/* Top Contributors (dynamic) */}
            <div className="chf-contributors-card">
              <div className="chf-contributors-title">🏅 Top Contributors</div>
              {contributors.length === 0 ? (
                <div className="chf-empty">No contributors yet.</div>
              ) : contributors.map(c => (
                <div className="chf-contributor-item" key={c.userId}>
                  <span className="chf-contributor-avatar">{getInitials(c.fullName)}</span>
                  <span className="chf-contributor-name">{c.fullName}</span>
                  <span className="chf-contributor-role">{c.postCount} posts</span>
                </div>
              ))}
            </div>
            {/* Community Guidelines */}
            <div className="chf-guidelines-card">
              <div className="chf-guidelines-title">🛡️ Community Guidelines</div>
              <ul className="chf-guidelines-list">
                <li>Be respectful and supportive</li>
                <li>Share verified health information</li>
                <li>Protect personal privacy</li>
                <li>No medical diagnosis</li>
                <li>Report inappropriate content</li>
              </ul>
              <button className="chf-guidelines-btn">Read Full Guidelines</button>
            </div>
          </div>
        </div>
        {/* Post Modal */}
        {modalPost && (
          <div className="chf-modal-bg" onClick={() => setModalPost(null)}>
            <div className="chf-modal" onClick={e => e.stopPropagation()}>
              <button className="chf-modal-close" onClick={() => setModalPost(null)}>×</button>
              {modalPost.loading ? <div className="chf-loading">Loading...</div> : modalPost.error ? <div className="chf-error">{modalPost.error}</div> : (
                <>
                  <div className="chf-modal-title">{modalPost.title}</div>
                  <div className="chf-modal-meta chf-modal-meta-center">
                    by {modalPost.user?.fullName}
                    {modalPost.user?.badge && <span className="chf-user-badge">{modalPost.user.badge}</span>}
                    <span className="chf-modal-time">{new Date(modalPost.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="chf-modal-content chf-modal-content-center">{modalPost.content}</div>
                  <div className="chf-modal-actions">
                    <button className={`chf-like-btn${modalPost.likes?.includes(user._id) ? ' liked' : ''}`} onClick={() => handleLikePost(modalPost._id)}>
                      <span role="img" aria-label="like">👍</span> {modalPost.likes?.length || 0}
                    </button>
                  </div>
                  <div className="chf-modal-comments-title">Live Discussion</div>
                  <div className="chf-modal-chat-list">
                    {modalPost.comments?.length === 0 ? <div className="chf-empty">No messages yet.</div> : modalPost.comments?.map((c, idx) => (
                      <div className={`chf-modal-chat-msg${c.user?._id === user._id ? ' self' : ''}`} key={c._id}>
                        <div className="chf-modal-chat-avatar">{getInitials(c.user?.fullName)}</div>
                        <div className="chf-modal-chat-bubble">
                          <div className="chf-modal-chat-meta">{c.user?.fullName} <span className="chf-modal-chat-time">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                          <div className="chf-modal-chat-content">{c.content}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </div>
                  <form className="chf-modal-chat-form" onSubmit={handleAddComment}>
                    <input className="chf-modal-chat-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Type a message..." disabled={commentLoading}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(e); } }}
                    />
                    <button className="chf-modal-chat-send" type="submit" disabled={commentLoading || !commentText.trim()}>
                      {commentLoading ? '...' : <span role="img" aria-label="send">➡️</span>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
        {/* New Post Modal */}
        {showModal && (
          <div className="chf-modal-bg" onClick={() => setShowModal(false)}>
            <div className="chf-modal" onClick={e => e.stopPropagation()}>
              <button className="chf-modal-close" onClick={() => setShowModal(false)}>×</button>
              <div className="chf-modal-title">Create New Post</div>
              <form className="chf-modal-form" onSubmit={handleCreatePost}>
                <input className="chf-modal-input" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Title" required />
                <textarea className="chf-modal-textarea" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} placeholder="Share your thoughts..." required />
                <select className="chf-modal-select" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
                <button className="chf-modal-btn" type="submit" disabled={creating}>{creating ? 'Posting...' : 'Post'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 