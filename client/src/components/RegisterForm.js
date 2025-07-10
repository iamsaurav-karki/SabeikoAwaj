import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../App';

const API_BASE = process.env.NODE_ENV === 'production' ? 'https://sabeiko.ksaurav.com.np/api' : 'http://localhost:5000/api';

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/register`, form);
      showToast('दर्ता सफल!', 'success');
      setForm({ name: '', email: '', password: '' });
      setTimeout(() => { if (onSuccess) onSuccess(); }, 800);
    } catch (err) {
      showToast(err.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #0001' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 800, marginBottom: 18 }}>नयाँ खाता खोल्नुहोस्</h2>
      <div style={{ marginBottom: 16 }}>
        <label>नाम</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>इमेल</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>पासवर्ड</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', background: '#1976d2', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
} 