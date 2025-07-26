import React, { useState, useRef, useEffect } from 'react';
import './SmartMedicineDelivery.css';

const MEDICINES = [
  { name: 'Paracetamol 500mg', price: 15, pharmacy: 'Apollo Pharmacy', stock: true },
  { name: 'Amoxicillin 250mg', price: 120, pharmacy: 'MedPlus', stock: true },
  { name: 'Ibuprofen 400mg', price: 25, pharmacy: 'Netmeds', stock: false },
  { name: 'Cetirizine 10mg', price: 8, pharmacy: 'Apollo Pharmacy', stock: true },
];
const PHARMACIES = [
  { name: 'Apollo Pharmacy', distance: '0.5 km', time: '30 mins', rating: 4.8 },
  { name: 'MedPlus', distance: '1.2 km', time: '45 mins', rating: 4.6 },
  { name: 'Netmeds Store', distance: '2.1 km', time: '60 mins', rating: 4.7 },
];
const ORDERS = [
  { id: 'ORD001', medicine: 'Paracetamol 500mg', date: 'Today, 2:30 PM', status: 'Delivered' },
  { id: 'ORD002', medicine: 'Vitamin D3', date: 'Today, 11:00 AM', status: 'In Transit' },
  { id: 'ORD003', medicine: 'Blood Pressure Kit', date: 'Yesterday', status: 'Processing' },
];

const ORDER_STATUS_STEPS = [
  { label: 'Ordered', key: 'ordered' },
  { label: 'In Transit', key: 'intransit' },
  { label: 'Delivered', key: 'delivered' },
];

function getCurrentTimeString() {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `Today, ${hour12}:${mins} ${ampm}`;
}

function parsePrescriptionText(text) {
  // Extract medicines section
  const medSectionMatch = text.match(/Medicine Name[\s\S]*?Advice:/i);
  let medicines = [];
  if (medSectionMatch) {
    const medSection = medSectionMatch[0]
      .replace(/Medicine Name[\s\S]*?Duration\s*/i, '')
      .replace(/Advice:.*/is, '').trim();
    // Split by numbered lines
    const medLines = medSection.split(/\n\s*\d+\)/).filter(Boolean);
    medicines = medLines.map(line => {
      // Try to extract name, dosage, duration
      const parts = line.replace(/\(Tot:[^)]+\)/g, '').split(/\s{2,}|\s{1,}(?=\d)/);
      let [name, ...rest] = parts;
      name = name ? name.replace(/\n/g, ' ').trim() : '';
      let dosage = '', duration = '';
      if (rest.length > 0) {
        dosage = rest[0].trim();
        duration = rest.slice(1).join(' ').trim();
      }
      // Fallback: try to extract duration from end
      const durationMatch = line.match(/(\d+\s*Days?)/i);
      if (durationMatch) duration = durationMatch[1];
      return { name, dosage, duration };
    });
  }
  return medicines;
}

function highlightFields(text) {
  // Bold important fields
  const fields = [
    'Dr. ', 'Reg No', 'Ph:', 'Timing:', 'Date:', 'ID:', 'Address:', 'Weight (Kg):', 'Height (Cm):', 'BP:', 'Chief Complaints', 'Diagnosis:', 'Advice:', 'Follow Up:'
  ];
  let html = text;
  fields.forEach(f => {
    html = html.replace(new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<b>${f}</b>`);
  });
  // Bold 'Medicine Name Dosage Duration' header
  html = html.replace(/Medicine Name Dosage Duration/i, '<b>Medicine Name</b> <b>Dosage</b> <b>Duration</b>');
  return html;
}

export default function SmartMedicineDelivery() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [prescription, setPrescription] = useState({
    file: null,
    patient: '',
    doctor: '',
    phone: '',
    address: '',
  });
  const [extractedMeds, setExtractedMeds] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [trackOrder, setTrackOrder] = useState(null);
  const fileInputRef = useRef();
  const [orders, setOrders] = useState([]); // Start with no orders
  const [quantities, setQuantities] = useState({}); // { medicineName: quantity }
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // Fetch orders from backend when My Orders is opened
  useEffect(() => {
    if (showOrders) {
      fetch('/api/resources/orders')
        .then(res => res.json())
        .then(data => setOrders(data.orders || []));
      setOrdersLoaded(true);
    }
  }, [showOrders]);

  const filteredMeds = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (med, qty) => {
    const quantity = qty || quantities[med.name] || 1;
    const existing = cart.find(item => item.name === med.name);
    if (!existing) {
      setCart([...cart, { ...med, quantity }]);
    }
  };

  const updateCartQuantity = (name, qty) => {
    setCart(cart => cart.map(item => item.name === name ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (name) => {
    setCart(cart => cart.filter(item => item.name !== name));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    const newId = `ORD${Date.now()}`;
    const orderData = {
      items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      date: getCurrentTimeString(),
      status: 'Processing',
      orderId: newId,
      user: 'demo', // Replace with real user if available
    };
    try {
      await fetch('/api/resources/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 2500);
      // Optionally refresh orders if My Orders is open
      if (showOrders) {
        fetch('/api/resources/orders')
          .then(res => res.json())
          .then(data => setOrders(data.orders || []));
      }
    } catch (err) {
      alert('Failed to save order. Please try again.');
    }
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    if (!prescription.file) {
      setUploadSuccess(false);
      alert('Please upload a prescription image.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', prescription.file);
      // Optionally add patient/doctor info if needed
      const res = await fetch('/api/resources/ocr-prescription', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to process prescription');
      const data = await res.json();
      setExtractedMeds(data.medicines || []);
      setExtractedText(data.rawText || '');
      setUploadSuccess(true);
      setPrescription({ file: null, patient: '', doctor: '', phone: '', address: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (err) {
      setUploadSuccess(false);
      setExtractedMeds([]);
      setExtractedText('');
      alert('Failed to process prescription. Please try again.');
    }
  };

  if (showUpload) {
    return (
      <div className="med-bg">
        <div className="med-container">
          <div className="med-header">
            <div className="med-header-icon"><span role="img" aria-label="pill">💊</span></div>
            <div>
              <h1 className="med-title">Smart Medicine Delivery</h1>
              <div className="med-subtitle">AI-powered medicine ordering with home delivery and smart refill reminders</div>
              <div className="med-badges-row">
                <span className="med-badge">🚚 Fast Delivery</span>
                <span className="med-badge med-badge-blue">🕒 Track Orders</span>
              </div>
            </div>
          </div>
          <div className="med-actions-row">
            <button className="med-search-btn" onClick={() => { setShowUpload(false); setShowOrders(false); }}><span role="img" aria-label="search">🔍</span> Search Medicine</button>
            <button className="med-upload-btn med-upload-btn-active"><span role="img" aria-label="upload">⏫</span> Upload Prescription</button>
            <button className="med-orders-btn" onClick={() => { setShowOrders(true); setShowUpload(false); }}><span role="img" aria-label="orders">🚚</span> My Orders</button>
          </div>
          <div className="med-upload-card">
            <div className="med-upload-title"><span role="img" aria-label="upload">⏫</span> Upload Prescription</div>
            <div className="med-upload-subtitle">Upload your prescription for quick medicine ordering</div>
            <form className="med-upload-form" onSubmit={handleUploadPrescription}>
              <div className="med-upload-dropzone">
                <div className="med-upload-icon"><span role="img" aria-label="upload">⬆️</span></div>
                <div className="med-upload-label">Upload Prescription Image</div>
                <div className="med-upload-support">Supports JPG, PNG, PDF</div>
                <div className="med-upload-btn-row">
                  {/* Removed Take Photo button */}
                  <label className="med-upload-file-btn">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      onChange={e => setPrescription(p => ({ ...p, file: e.target.files[0] }))}
                    />
                    ⏫ Choose File
                  </label>
                </div>
                {prescription.file && <div className="med-upload-filename">{prescription.file.name}</div>}
              </div>
              <div className="med-upload-fields-row">
                <input className="med-upload-input" placeholder="Patient Name" value={prescription.patient} onChange={e => setPrescription(p => ({ ...p, patient: e.target.value }))} required />
                <input className="med-upload-input" placeholder="Doctor Name" value={prescription.doctor} onChange={e => setPrescription(p => ({ ...p, doctor: e.target.value }))} required />
              </div>
              <div className="med-upload-fields-row">
                <input className="med-upload-input" placeholder="Phone Number" value={prescription.phone} onChange={e => setPrescription(p => ({ ...p, phone: e.target.value }))} required />
                <input className="med-upload-input" placeholder="Delivery Address" value={prescription.address} onChange={e => setPrescription(p => ({ ...p, address: e.target.value }))} required />
              </div>
              <button className="med-upload-process-btn" type="submit">Process Prescription</button>
              {uploadSuccess && <div className="med-upload-success">Prescription uploaded successfully!</div>}
            </form>
            {(extractedMeds.length > 0 || extractedText) && (
              <div className="med-extracted-meds-card">
                {extractedMeds.length > 0 && (
                  <>
                    <div className="med-extracted-meds-title">Medicines from Prescription</div>
                    <table className="med-extracted-meds-table">
                      <thead>
                        <tr>
                          <th>Medicine Name</th>
                          <th>Quantity/Instructions</th>
                          <th>Add to Cart</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedMeds.map(med => (
                          <tr key={med.name}>
                            <td>{med.name}</td>
                            <td>{med.quantity || med.instructions || '-'}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                className="med-qty-input"
                                value={quantities[med.name] || 1}
                                onChange={e => setQuantities(q => ({ ...q, [med.name]: Math.max(1, +e.target.value) }))}
                                style={{ width: 48, marginRight: 8 }}
                              />
                              <button
                                className="med-add-cart-btn"
                                disabled={!med.stock}
                                onClick={() => addToCart(med, quantities[med.name])}
                              >
                                Add to Cart
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
                {extractedText && (
                  <div className="med-extracted-text-card">
                    <div className="med-extracted-text-title">Extracted Text</div>
                    {/* Parse and show medicines as table if found */}
                    {(() => {
                      const medicines = parsePrescriptionText(extractedText);
                      if (medicines.length > 0) {
                        return (
                          <table className="med-extracted-meds-table" style={{ marginBottom: 18 }}>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Dosage</th>
                                <th>Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicines.map((med, i) => (
                                <tr key={i}>
                                  <td>{med.name}</td>
                                  <td>{med.dosage}</td>
                                  <td>{med.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      }
                      return null;
                    })()}
                    {/* Show rest of text with bolded fields */}
                    <div className="med-extracted-text-content" style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: highlightFields(extractedText) }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showOrders) {
    return (
      <div className="med-bg">
        <div className="med-container">
          <div className="med-header">
            <div className="med-header-icon"><span role="img" aria-label="pill">💊</span></div>
            <div>
              <h1 className="med-title">Smart Medicine Delivery</h1>
              <div className="med-subtitle">AI-powered medicine ordering with home delivery and smart refill reminders</div>
              <div className="med-badges-row">
                <span className="med-badge">🚚 Fast Delivery</span>
                <span className="med-badge med-badge-blue">🕒 Track Orders</span>
              </div>
            </div>
          </div>
          <div className="med-actions-row">
            <button className="med-search-btn" onClick={() => { setShowOrders(false); setShowUpload(false); }}><span role="img" aria-label="search">🔍</span> Search Medicine</button>
            <button className="med-upload-btn" onClick={() => { setShowUpload(true); setShowOrders(false); }}><span role="img" aria-label="upload">⏫</span> Upload Prescription</button>
            <button className="med-orders-btn med-orders-btn-active"><span role="img" aria-label="orders">🚚</span> My Orders</button>
          </div>
          <div className="med-orders-card">
            <div className="med-orders-title">Order History</div>
            {orders.length === 0 && <div style={{ color: '#b0c4d6', textAlign: 'center', marginTop: 32 }}>No orders yet.</div>}
            {orders.map(order => (
              <div className="med-order-item" key={order.orderId}>
                <div className="med-order-main">
                  <div className="med-order-id">#{order.orderId}</div>
                  <div className="med-order-medicine">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
                  <div className="med-order-date">{order.date}</div>
                </div>
                <div className="med-order-side">
                  <div className={`med-order-status med-order-status-${order.status.replace(/\s/g, '').toLowerCase()}`}>{order.status}</div>
                  <button className="med-order-track" onClick={() => setTrackOrder(order)}>Track Order</button>
                </div>
              </div>
            ))}
          </div>
          {trackOrder && (
            <div className="med-track-modal-bg" onClick={() => setTrackOrder(null)}>
              <div className="med-track-modal" onClick={e => e.stopPropagation()}>
                <div className="med-track-header">
                  <span className="med-track-title">Order Tracking</span>
                  <button className="med-track-close" onClick={() => setTrackOrder(null)}>×</button>
                </div>
                <div className="med-track-id">Order ID: <b>#{trackOrder.orderId}</b></div>
                <div className="med-track-medicine">{trackOrder.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
                <div className="med-track-date">{trackOrder.date}</div>
                <div className="med-track-status-row">
                  {ORDER_STATUS_STEPS.map((step, idx) => {
                    const current = trackOrder.status.toLowerCase().replace(/\s/g, '') === step.key;
                    const completed =
                      (step.key === 'ordered') ||
                      (step.key === 'intransit' && ['intransit', 'delivered'].includes(trackOrder.status.toLowerCase().replace(/\s/g, '')))
                      || (step.key === 'delivered' && trackOrder.status.toLowerCase().replace(/\s/g, '') === 'delivered');
                    return (
                      <div key={step.key} className={`med-track-step${completed ? ' completed' : ''}${current ? ' current' : ''}`}>
                        <span className="med-track-step-label">{step.label}</span>
                        {idx < ORDER_STATUS_STEPS.length - 1 && <span className="med-track-step-arrow">→</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="med-track-status-badge med-order-status med-order-status-" style={{ marginTop: 12 }}>{trackOrder.status}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="med-bg">
      <div className="med-container">
        <div className="med-header">
          <div className="med-header-icon"><span role="img" aria-label="pill">💊</span></div>
          <div>
            <h1 className="med-title">Smart Medicine Delivery</h1>
            <div className="med-subtitle">AI-powered medicine ordering with home delivery and smart refill reminders</div>
            <div className="med-badges-row">
              <span className="med-badge">🚚 Fast Delivery</span>
              <span className="med-badge med-badge-blue">🕒 Track Orders</span>
            </div>
          </div>
        </div>
        <div className="med-actions-row">
          <button className="med-search-btn"><span role="img" aria-label="search">🔍</span> Search Medicine</button>
          <button className="med-upload-btn" onClick={() => { setShowUpload(true); setShowOrders(false); }}><span role="img" aria-label="upload">⏫</span> Upload Prescription</button>
          <button className="med-orders-btn" onClick={() => { setShowOrders(true); setShowUpload(false); }}><span role="img" aria-label="orders">🚚</span> My Orders</button>
        </div>
        <div className="med-main-row">
          <div className="med-left">
            <div className="med-search-card">
              <div className="med-search-title"><span role="img" aria-label="search">🔍</span> Search Medicines</div>
              <input
                className="med-search-input"
                placeholder="Search for medicines..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="med-results-title">Search Results</div>
            {filteredMeds.map(med => (
              <div className="med-result-card" key={med.name}>
                <div className="med-result-main">
                  <div className="med-result-name">{med.name}</div>
                  <div className="med-result-pharmacy">Available at {med.pharmacy}</div>
                  <div className="med-result-stock-row">
                    {med.stock ? <span className="med-result-stock">In Stock</span> : <span className="med-result-oos">Out of Stock</span>}
                  </div>
                </div>
                <div className="med-result-side">
                  <div className="med-result-price">₹{med.price}</div>
                  <input
                    type="number"
                    min="1"
                    className="med-qty-input"
                    value={quantities[med.name] || 1}
                    onChange={e => setQuantities(q => ({ ...q, [med.name]: Math.max(1, +e.target.value) }))}
                    style={{ width: 48, marginBottom: 8 }}
                  />
                  <button
                    className="med-add-cart-btn"
                    disabled={!med.stock || cart.find(item => item.name === med.name)}
                    onClick={() => addToCart(med, quantities[med.name])}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="med-right">
            <div className="med-pharmacies-card">
              <div className="med-pharmacies-title"><span role="img" aria-label="location">📍</span> Nearby Pharmacies</div>
              {PHARMACIES.map(pharm => (
                <div className="med-pharmacy-item" key={pharm.name}>
                  <div className="med-pharmacy-main">
                    <div className="med-pharmacy-name">{pharm.name}</div>
                    <div className="med-pharmacy-meta">{pharm.distance} <span className="med-pharmacy-dot">•</span> {pharm.time}</div>
                  </div>
                  <div className="med-pharmacy-side">
                    <div className="med-pharmacy-rating">★ {pharm.rating}</div>
                    <button className="med-pharmacy-view">View Store</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="med-cart-card">
              <div className="med-cart-title"><span role="img" aria-label="cart">💊</span> Cart Summary</div>
              {cart.length === 0 ? (
                <div className="med-cart-empty">
                  <span className="med-cart-empty-icon"><span role="img" aria-label="pill">💊</span></span>
                  <div>Your cart is empty</div>
                </div>
              ) : (
                <>
                  <ul className="med-cart-list">
                    {cart.map(item => (
                      <li key={item.name} className="med-cart-item">
                        <span>{item.name}</span>
                        <span style={{ marginLeft: 8, color: '#1976d2' }}>x{item.quantity}</span>
                        <input
                          type="number"
                          min="1"
                          className="med-qty-input"
                          value={item.quantity}
                          onChange={e => updateCartQuantity(item.name, Math.max(1, +e.target.value))}
                          style={{ width: 40, marginLeft: 8 }}
                        />
                        <button
                          className="med-cart-remove-btn"
                          onClick={() => removeFromCart(item.name)}
                          style={{ marginLeft: 8 }}
                        >
                          ×
                        </button>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="med-cart-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                  {orderSuccess && <div className="med-cart-success">Order placed successfully!</div>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 