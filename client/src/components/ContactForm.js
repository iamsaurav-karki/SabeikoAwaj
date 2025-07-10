import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      await axios.post(`${API_BASE}/contact`, form);
      setSuccess('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #0001' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 800, marginBottom: 18 }}>Contact Us</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={4} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }} />
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', background: '#1976d2', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{loading ? 'Sending...' : 'Send Message'}</button>
      {error && <div style={{ color: '#e74c3c', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: '#27ae60', marginTop: 12 }}>{success}</div>}
    </form>
  );
} 