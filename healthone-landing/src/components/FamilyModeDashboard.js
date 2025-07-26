import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FamilyModeDashboard.css';

const emptyMember = { name: '', relation: '', age: '', lastCheckup: '', prescriptions: 0, conditions: [], child: false };

const mockRecords = [
  { date: '2024-01-15', type: 'Checkup', doctor: 'Dr. Sharma', hospital: 'City Hospital', notes: 'Routine checkup, all normal.' },
  { date: '2023-12-10', type: 'Prescription', doctor: 'Dr. Mehta', hospital: 'Apollo', notes: 'Prescribed Metformin.' },
];

const BACKEND_URL = 'https://healthcare360-backend.onrender.com';

const FamilyModeDashboard = () => {
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState(emptyMember);
  const [viewMember, setViewMember] = useState(null);
  const [showRecords, setShowRecords] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteMemberIdx, setDeleteMemberIdx] = useState(null);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const navigate = useNavigate();

  // Get userId from localStorage
  let userId = null;
  try {
    const userObj = JSON.parse(localStorage.getItem('user'));
    userId = userObj?._id || userObj?.userId || null;
  } catch {}

  // Fetch family on mount
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/api/family/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFamily(data);
          setLoading(false);
        } else {
          // No family found, create one
          const newFamilyId = 'FAM-' + userId;
          fetch(`${BACKEND_URL}/api/family`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, familyId: newFamilyId })
          })
            .then(res => res.json())
            .then(fam => { setFamily(fam); setLoading(false); })
            .catch(e => { setError('Failed to create family'); setLoading(false); });
        }
      })
      .catch(e => { setError('Failed to load family'); setLoading(false); });
  }, [userId]);

  // Add member
  const handleAddMember = async () => {
    if (!family) return;
    const member = { ...newMember, age: Number(newMember.age), prescriptions: Number(newMember.prescriptions), child: newMember.relation.toLowerCase().includes('son') || newMember.relation.toLowerCase().includes('daughter') };
    setLoading(true);
    const res = await fetch(`${BACKEND_URL}/api/family/${family.familyId}/member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    const data = await res.json();
    setFamily(data);
    setShowAdd(false);
    setNewMember(emptyMember);
    setLoading(false);
  };

  // Delete member
  const handleDeleteMember = async idx => {
    if (!family) return;
    const memberId = family.members[idx]._id;
    setLoading(true);
    await fetch(`${BACKEND_URL}/api/family/${family.familyId}/member/${memberId}`, { method: 'DELETE' });
    // Refetch family
    const res = await fetch(`${BACKEND_URL}/api/family/${userId}`);
    const data = await res.json();
    setFamily(data);
    setDeleteMemberIdx(null);
    setLoading(false);
  };

  // Edit member
  const handleEditMember = async () => {
    if (!family) return;
    const memberId = family.members[editMember.idx]._id;
    setLoading(true);
    await fetch(`${BACKEND_URL}/api/family/${family.familyId}/member/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editMember.data, age: Number(editMember.data.age), prescriptions: Number(editMember.data.prescriptions), child: editMember.data.relation.toLowerCase().includes('son') || editMember.data.relation.toLowerCase().includes('daughter') })
    });
    // Refetch family
    const res = await fetch(`${BACKEND_URL}/api/family/${userId}`);
    const data = await res.json();
    setFamily(data);
    setShowEdit(false);
    setEditMember(null);
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading family...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!family) return <div style={{ padding: 40, textAlign: 'center' }}>No family found.</div>;

  return (
    <div className="family-root">
      <div className="family-dashboard">
        <h1 className="family-title">Family Health Management</h1>
        <div className="family-dashboard-header">
          <div>
            <div className="family-dashboard-desc">Manage health records for your entire family</div>
          </div>
          <div className="family-id-badge">Family ID: {family.familyId}</div>
        </div>
        <div className="family-stats-row">
          <div className="family-stat family-stat-blue">
            <div className="family-stat-icon">👥</div>
            <div className="family-stat-value">{Array.isArray(family.members) ? family.members.length : 0}</div>
            <div className="family-stat-label">Total Members</div>
          </div>
          <div className="family-stat family-stat-green">
            <div className="family-stat-icon">🧑</div>
            <div className="family-stat-value">{Array.isArray(family.members) ? family.members.filter(m => !m.child).length : 0}</div>
            <div className="family-stat-label">Adults</div>
          </div>
          <div className="family-stat family-stat-purple">
            <div className="family-stat-icon">😊</div>
            <div className="family-stat-value">{Array.isArray(family.members) ? family.members.filter(m => m.child).length : 0}</div>
            <div className="family-stat-label">Children</div>
          </div>
          <div className="family-stat family-stat-orange">
            <div className="family-stat-icon">💊</div>
            <div className="family-stat-value">{Array.isArray(family.members) ? family.members.reduce((sum, m) => sum + (m.prescriptions || 0), 0) : 0}</div>
            <div className="family-stat-label">Prescriptions</div>
          </div>
        </div>
        <button className="family-add-btn" onClick={() => setShowAdd(true)}>+ Add Family Member</button>
        <div className="family-members-row">
          {Array.isArray(family.members) && family.members.map((m, i) => (
            <div className="family-member-card" key={m._id || i}>
              <div className={`family-member-avatar${m.child ? ' child' : ''}`}>{m.child ? '😊' : '🧑'}</div>
              <div className="family-member-name">{m.name}</div>
              <div className="family-member-relation">{m.relation}</div>
              <div className="family-member-info">Age: <b>{m.age} years</b></div>
              <div className="family-member-info">Last Checkup: <b>{m.lastCheckup}</b></div>
              <div className="family-member-info">Prescriptions: <b>{m.prescriptions}</b></div>
              <div className="family-member-info">Conditions:</div>
              <div className="family-member-conditions">
                {Array.isArray(m.conditions) && m.conditions.length === 0 ? <span className="family-chip">None</span> : null}
                {Array.isArray(m.conditions) && m.conditions.length > 0 && m.conditions.map((c, j) => <span className="family-chip" key={j}>{c}</span>)}
              </div>
              {m.child && <div className="family-child-badge">Child Account</div>}
              <div className="family-member-actions">
                <button className="family-view-btn" onClick={() => { setViewMember(m); setShowRecords(true); }}>View Records</button>
                <button className="family-appoint-btn" onClick={() => navigate('/telemedicine')}>Book Appointment</button>
                <button className="family-edit-btn" onClick={() => { setEditMember({ idx: i, data: { ...m } }); setShowEdit(true); }}>Edit</button>
                <button className="family-delete-btn" onClick={() => setDeleteMemberIdx(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {/* Add Member Modal */}
        {showAdd && (
          <div className="family-modal-bg">
            <div className="family-modal">
              <div className="family-modal-header">Add Family Member</div>
              <div className="family-modal-body">
                <input className="family-modal-input" placeholder="Name" value={newMember.name} onChange={e => setNewMember(n => ({ ...n, name: e.target.value }))} />
                <input className="family-modal-input" placeholder="Relation" value={newMember.relation} onChange={e => setNewMember(n => ({ ...n, relation: e.target.value }))} />
                <input className="family-modal-input" placeholder="Age" type="number" value={newMember.age} onChange={e => setNewMember(n => ({ ...n, age: e.target.value }))} />
                <input className="family-modal-input" placeholder="Last Checkup (YYYY-MM-DD)" value={newMember.lastCheckup} onChange={e => setNewMember(n => ({ ...n, lastCheckup: e.target.value }))} />
                <input className="family-modal-input" placeholder="Prescriptions" type="number" value={newMember.prescriptions} onChange={e => setNewMember(n => ({ ...n, prescriptions: e.target.value }))} />
                <input className="family-modal-input" placeholder="Conditions (comma separated)" value={newMember.conditions.join(', ')} onChange={e => setNewMember(n => ({ ...n, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
              </div>
              <div className="family-modal-actions">
                <button className="family-modal-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="family-modal-save" onClick={handleAddMember}>Add</button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Member Modal */}
        {showEdit && editMember && (
          <div className="family-modal-bg">
            <div className="family-modal">
              <div className="family-modal-header">Edit Family Member</div>
              <div className="family-modal-body">
                <input className="family-modal-input" placeholder="Name" value={editMember.data.name} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, name: e.target.value } }))} />
                <input className="family-modal-input" placeholder="Relation" value={editMember.data.relation} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, relation: e.target.value } }))} />
                <input className="family-modal-input" placeholder="Age" type="number" value={editMember.data.age} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, age: e.target.value } }))} />
                <input className="family-modal-input" placeholder="Last Checkup (YYYY-MM-DD)" value={editMember.data.lastCheckup} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, lastCheckup: e.target.value } }))} />
                <input className="family-modal-input" placeholder="Prescriptions" type="number" value={editMember.data.prescriptions} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, prescriptions: e.target.value } }))} />
                <input className="family-modal-input" placeholder="Conditions (comma separated)" value={editMember.data.conditions.join(', ')} onChange={e => setEditMember(em => ({ ...em, data: { ...em.data, conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))} />
              </div>
              <div className="family-modal-actions">
                <button className="family-modal-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
                <button className="family-modal-save" onClick={handleEditMember}>Save</button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Member Confirmation Modal */}
        {deleteMemberIdx !== null && (
          <div className="family-modal-bg">
            <div className="family-modal">
              <div className="family-modal-header">Delete Family Member</div>
              <div className="family-modal-body">Are you sure you want to delete this member?</div>
              <div className="family-modal-actions">
                <button className="family-modal-cancel" onClick={() => setDeleteMemberIdx(null)}>Cancel</button>
                <button className="family-modal-save" onClick={() => handleDeleteMember(deleteMemberIdx)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        {/* View Records Modal */}
        {showRecords && viewMember && (
          <div className="family-modal-bg">
            <div className="family-modal">
              <div className="family-modal-header">{viewMember.name}'s Health Records</div>
              <div className="family-modal-body">
                <table className="family-records-table">
                  <thead>
                    <tr><th>Date</th><th>Type</th><th>Doctor</th><th>Hospital</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {mockRecords.map((rec, i) => (
                      <tr key={i}>
                        <td>{rec.date}</td>
                        <td>{rec.type}</td>
                        <td>{rec.doctor}</td>
                        <td>{rec.hospital}</td>
                        <td>{rec.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="family-modal-actions">
                <button className="family-modal-cancel" onClick={() => setShowRecords(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyModeDashboard; 