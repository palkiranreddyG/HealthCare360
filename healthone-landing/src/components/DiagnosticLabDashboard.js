import React, { useState } from 'react';

const demoBookings = [
  { id: 1, name: 'John Smith', test: 'Blood Test', date: '26/07/2023, 14:00', status: 'pending' },
  { id: 2, name: 'Sarah Johnson', test: 'X-Ray', date: '25/07/2023, 00:00', status: 'pending' },
  { id: 3, name: 'Michael Brown', test: 'MRI', date: '25/07/2023, 15:30', status: 'pending' },
  { id: 4, name: 'Emily Davis', test: 'CT Scan', date: '24/07/2023, 10:45', status: 'pending' },
  { id: 5, name: 'David Wilson', test: 'Urine Test', date: '24/07/2023, 11:15', status: 'pending' },
];
const demoPricing = [
  { id: 1, test: 'Blood Test', price: 50 },
  { id: 2, test: 'X-Ray', price: 80 },
  { id: 3, test: 'MRI', price: 200 },
  { id: 4, test: 'CT Scan', price: 150 },
  { id: 5, test: 'Urine Test', price: 40 },
];

const DiagnosticLabDashboard = () => {
  const [bookings, setBookings] = useState(demoBookings);
  const [pricing, setPricing] = useState(demoPricing);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const handleAccept = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'accepted' } : b));
  };
  const handleReject = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
  };
  const handleEdit = (id, price) => {
    setEditId(id);
    setEditPrice(price.toString());
  };
  const handleEditSave = (id) => {
    setPricing(pricing.map(p => p.id === id ? { ...p, price: Number(editPrice) } : p));
    setEditId(null);
    setEditPrice('');
  };

  return (
    <div style={{ padding: 32, background: '#f8fbff', minHeight: '100vh' }}>
      <div style={{ color: '#1976d2', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Diagnostic Lab</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 4 }}>Welcome back!</div>
          <div style={{ color: '#7a8ca3', fontSize: 17 }}>Your lab dashboard is ready</div>
        </div>
        <div>
          <button
            style={{ border: '1px solid #1976d2', background: '#fff', borderRadius: 8, padding: '7px 18px', fontWeight: 500, color: '#1976d2', cursor: 'pointer', marginLeft: 8 }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 32, margin: '32px 0 24px 0' }}>
        {[
          { icon: '📋', label: 'Upcoming Appointments', value: 8 },
          { icon: '📋', label: 'Digital Reports Uploaded', value: 12 },
          { icon: '📋', label: 'Tests Pricing Set', value: 20 },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{c.label}</div>
            <div style={{ color: '#1976d2', fontWeight: 700, fontSize: 28 }}>{c.value}</div>
          </div>
        ))}
      </div>
      {/* Key Features and Test Bookings */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 28 }}>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Key Features</div>
          <ul style={{ color: '#222', fontSize: 15, margin: 0, paddingLeft: 18 }}>
            <li>Accept or reject test bookings</li>
            <li>Upload digital reports to patient at health vault</li>
            <li>Set test pricing</li>
            <li>Track upcoming appointments</li>
          </ul>
        </div>
        <div style={{ flex: 2, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Test Bookings</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f7faff', color: '#1976d2', fontWeight: 600 }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Patient Name</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Test</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Appointment Date</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #e3f0fd' }}>
                  <td style={{ padding: 8 }}>{b.name}</td>
                  <td style={{ padding: 8 }}>{b.test}</td>
                  <td style={{ padding: 8 }}>{b.date}</td>
                  <td style={{ padding: 8 }}>
                    {b.status === 'pending' && <>
                      <button style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '5px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleAccept(b.id)}>Accept</button>
                      <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleReject(b.id)}>Reject</button>
                    </>}
                    {b.status === 'accepted' && <span style={{ color: '#22c1c3', fontWeight: 600 }}>Accepted</span>}
                    {b.status === 'rejected' && <span style={{ color: '#e57373', fontWeight: 600 }}>Rejected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Test Pricing */}
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Test Pricing</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f7faff', color: '#1976d2', fontWeight: 600 }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Test</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Price</th>
                <th style={{ padding: 8, textAlign: 'left' }}></th>
              </tr>
            </thead>
            <tbody>
              {pricing.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e3f0fd' }}>
                  <td style={{ padding: 8 }}>{p.test}</td>
                  <td style={{ padding: 8 }}>
                    {editId === p.id ? (
                      <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} style={{ width: 70, padding: 4, borderRadius: 6, border: '1px solid #b0c4d6' }} />
                    ) : (
                      `₹${p.price}`
                    )}
                  </td>
                  <td style={{ padding: 8 }}>
                    {editId === p.id ? (
                      <>
                        <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleEditSave(p.id)}>Save</button>
                        <button style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '5px 14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => { setEditId(null); setEditPrice(''); }}>Cancel</button>
                      </>
                    ) : (
                      <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleEdit(p.id, p.price)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticLabDashboard; 