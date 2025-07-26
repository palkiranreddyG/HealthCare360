import React, { useState } from 'react';

const demoInventory = [
  { medicine: 'Paracetamol', stock: 250, lastUpdated: '24/04/2024' },
  { medicine: 'Atorvastatin', stock: 130, lastUpdated: '22/04/2024' },
  { medicine: 'Amoxicillin', stock: 0, lastUpdated: '23/04/2024' },
  { medicine: 'Cetirizine', stock: 130, lastUpdated: '22/04/2024' },
];
const demoPendingOrders = [
  { id: 1, name: 'Jane Doe', type: 'Prescription', medicine: 'Prescription order', request: '', status: 'pending' },
  { id: 2, name: 'Sunil Verma', type: 'Paracetamol', medicine: 'Paracetamol', request: 'Request Paracetamol', status: 'pending' },
];
const demoDeliveryRequests = [
  { id: 1, name: 'Preeti Singh', medicine: 'Cetharzatol', request: "Preeti's Cetirizine", status: 'pending', statusText: 'Out for delivery', eta: '15 min' },
  { id: 2, name: 'Anil Kumar', medicine: 'Paracetamol', request: 'Request: Paracetamol', status: 'pending', statusText: 'Delivered', eta: 'Delivered' },
];
const demoEmergencies = [
  { id: 1, name: 'Suresh Yaday', distance: '0,5 km away', request: 'Need Amoxicillin' },
];

const MedicineHubDashboard = () => {
  const [inventory, setInventory] = useState(demoInventory);
  const [pendingOrders, setPendingOrders] = useState(demoPendingOrders);
  const [deliveryRequests] = useState(demoDeliveryRequests);
  const [emergencies] = useState(demoEmergencies);
  const [modal, setModal] = useState(null); // 'inventory', 'orders', 'tracking', 'emergencies'
  const [stockForm, setStockForm] = useState({ medicine: '', stock: '' });

  const handleApproveOrder = (id) => {
    setPendingOrders(pendingOrders.filter(o => o.id !== id));
  };
  const handleRejectOrder = (id) => {
    setPendingOrders(pendingOrders.filter(o => o.id !== id));
  };
  const handleStockFormChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };
  const handleStockFormSubmit = (e) => {
    e.preventDefault();
    if (!stockForm.medicine || !stockForm.stock) return;
    setInventory(inv => inv.map(item =>
      item.medicine === stockForm.medicine ? { ...item, stock: Number(stockForm.stock), lastUpdated: new Date().toLocaleDateString('en-GB') } : item
    ));
    setStockForm({ medicine: '', stock: '' });
    setModal(null);
  };

  return (
    <div style={{ padding: 32, background: '#f8fbff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 4 }}>Medical Hub Dashboard</div>
          <div style={{ color: '#7a8ca3', fontSize: 17 }}>Manage your medicine inventory and prescription orders</div>
        </div>
        <div>
          <button
            style={{ border: '1px solid #b0c4d6', background: '#fff', borderRadius: 8, padding: '7px 18px', fontWeight: 500, color: '#1976d2', cursor: 'pointer' }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Feature cards */}
      <div style={{ display: 'flex', gap: 32, margin: '32px 0 24px 0' }}>
        {[
          { icon: '⬆️', title: 'Upload Inventory', desc: 'Update medicine stock', modal: 'inventory' },
          { icon: '☑️', title: 'Orders', desc: 'Manage prescription requests', modal: 'orders' },
          { icon: '🕒', title: 'Tracking', desc: 'View and track deliveries', modal: 'tracking' },
          { icon: '❗', title: 'Emergencies', desc: 'Nearby emergency cases', modal: 'emergencies' },
        ].map((f, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', cursor: 'pointer' }}
            onClick={() => setModal(f.modal)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{f.title}</div>
            <div style={{ color: '#7a8ca3', fontSize: 15, textAlign: 'center' }}>{f.desc}</div>
          </div>
        ))}
      </div>
      {/* Inventory Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 24, marginBottom: 28, border: '1px solid #e3f0fd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Inventory</div>
          <button style={{ background: 'linear-gradient(90deg,#1976d2,#22c1c3)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => setModal('inventory')}>Update Stock</button>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <table style={{ flex: 1, width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f7faff', color: '#1976d2', fontWeight: 600 }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Medicine</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Stock</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e3f0fd' }}>
                  <td style={{ padding: 8 }}>{item.medicine}</td>
                  <td style={{ padding: 8 }}>{item.stock}</td>
                  <td style={{ padding: 8 }}>{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Orders, Delivery Requests, Emergencies */}
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Pending Orders */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Pending Orders <span style={{ float: 'right', color: '#1976d2', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Sort, All</span></div>
          {pendingOrders.map(o => (
            <div key={o.id} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{o.name}</div>
                <div style={{ color: '#7a8ca3', fontSize: 14 }}>{o.type}</div>
                {o.request && <div style={{ color: '#1976d2', fontSize: 13 }}>{o.request}</div>}
              </div>
              <div>
                <button style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '5px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleApproveOrder(o.id)}>Approve</button>
                <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRejectOrder(o.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
        {/* Delivery Requests */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Delivery Requests</div>
          {deliveryRequests.map(r => (
            <div key={r.id} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div style={{ color: '#1976d2', fontSize: 13 }}>{r.request}</div>
              </div>
              <button style={{ background: 'linear-gradient(90deg,#1976d2,#22c1c3)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal('tracking')}>View</button>
            </div>
          ))}
        </div>
        {/* Emergency Cases */}
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e3f0fd', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(30,136,229,0.04)', padding: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Emergency Cases</div>
          {emergencies.map(e => (
            <div key={e.id} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{e.name}</div>
                <div style={{ color: '#7a8ca3', fontSize: 14 }}>{e.distance}</div>
                <div style={{ color: '#1976d2', fontSize: 13 }}>{e.request}</div>
              </div>
              <button style={{ background: 'linear-gradient(90deg,#1976d2,#22c1c3)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal('emergencies')}>View</button>
            </div>
          ))}
        </div>
      </div>
      {/* Modals/Sections for feature cards */}
      {modal === 'inventory' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 16px 0 rgba(30,136,229,0.13)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>Update Inventory</div>
            <form onSubmit={handleStockFormSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 500 }}>Medicine:</label>
                <select name="medicine" value={stockForm.medicine} onChange={handleStockFormChange} style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #b0c4d6' }} required>
                  <option value="" disabled>Select medicine</option>
                  {inventory.map(item => <option key={item.medicine} value={item.medicine}>{item.medicine}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 500 }}>Stock:</label>
                <input name="stock" type="number" value={stockForm.stock} onChange={handleStockFormChange} style={{ marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #b0c4d6', width: 80 }} required min={0} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" style={{ marginRight: 10, background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(90deg,#1976d2,#22c1c3)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modal === 'orders' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 16px 0 rgba(30,136,229,0.13)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>Pending Orders</div>
            {pendingOrders.length === 0 && <div style={{ color: '#7a8ca3' }}>No pending orders.</div>}
            {pendingOrders.map(o => (
              <div key={o.id} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{o.name}</div>
                  <div style={{ color: '#7a8ca3', fontSize: 14 }}>{o.type}</div>
                  {o.request && <div style={{ color: '#1976d2', fontSize: 13 }}>{o.request}</div>}
                </div>
                <div>
                  <button style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '5px 14px', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleApproveOrder(o.id)}>Approve</button>
                  <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleRejectOrder(o.id)}>Reject</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button type="button" style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {modal === 'tracking' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 400, boxShadow: '0 2px 16px 0 rgba(30,136,229,0.13)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>Delivery Tracking</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, marginBottom: 18 }}>
              <thead>
                <tr style={{ background: '#f7faff', color: '#1976d2', fontWeight: 600 }}>
                  <th style={{ padding: 8, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Medicine</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
                  <th style={{ padding: 8, textAlign: 'left' }}>ETA</th>
                </tr>
              </thead>
              <tbody>
                {deliveryRequests.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e3f0fd' }}>
                    <td style={{ padding: 8 }}>{r.name}</td>
                    <td style={{ padding: 8 }}>{r.medicine}</td>
                    <td style={{ padding: 8 }}>{r.statusText}</td>
                    <td style={{ padding: 8 }}>{r.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {modal === 'emergencies' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 2px 16px 0 rgba(30,136,229,0.13)' }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>Emergency Cases</div>
            {emergencies.map(e => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600 }}>{e.name}</div>
                <div style={{ color: '#7a8ca3', fontSize: 14 }}>{e.distance}</div>
                <div style={{ color: '#1976d2', fontSize: 13 }}>{e.request}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button type="button" style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '7px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineHubDashboard; 