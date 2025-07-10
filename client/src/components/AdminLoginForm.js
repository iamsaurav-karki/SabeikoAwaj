import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'production' ? 'https://sabeiko.ksaurav.com.np/api' : 'http://localhost:5000/api';

export default function AdminLoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/login`, form);
      const { token, user } = res.data;
      if (user.role !== 'admin') {
        setError('Access denied. Only admins can log in here.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      setSuccess('Login successful!');
      setTimeout(() => onSuccess(user), 1000); // Pass user object up
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #0001' }}>
      <h2 style={{ textAlign: 'center', color: '#e74c3c', fontWeight: 800, marginBottom: 18 }}>Admin Login</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', background: '#e74c3c', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{loading ? 'Logging in...' : 'Login'}</button>
      {error && <div style={{ color: '#e74c3c', marginTop: 12, textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: '#27ae60', marginTop: 12, textAlign: 'center' }}>{success}</div>}
    </form>
  );
} 