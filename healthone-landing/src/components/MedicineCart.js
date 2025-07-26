import React, { useState } from 'react';

const randomMedicines = [
  { name: 'TAB. PARACETAMOL', units: '2' },
  { name: 'CAP. AMOXICILLIN', units: '1' },
  { name: 'TAB. CETIRIZINE', units: '1' },
  { name: 'SYR. IBUPROFEN', units: '10ml' },
  { name: 'TAB. METFORMIN', units: '1' },
];

export default function MedicineCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (med) => {
    setCart([...cart, med]);
  };

  return (
    <div style={{ maxWidth: 400, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(33,198,251,0.08)', padding: 24 }}>
      <h2 style={{ marginBottom: 18 }}>Medicines</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {randomMedicines.map((med, i) => (
          <li key={i} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e3f0fd', paddingBottom: 10 }}>
            <div>
              <b>{med.name}</b><br />
              <span style={{ color: '#1976d2', fontSize: '1rem' }}>Dosage: {med.units}</span>
            </div>
            <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => addToCart(med)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: 32 }}>Cart</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cart.map((med, i) => (
          <li key={i} style={{ marginBottom: 8 }}>{med.name} (Dosage: {med.units})</li>
        ))}
      </ul>
    </div>
  );
} 