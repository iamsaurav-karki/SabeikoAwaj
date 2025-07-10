import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../App';

const API_BASE = process.env.NODE_ENV === 'production' ? 'https://sabeiko.ksaurav.com.np/api' : 'http://localhost:5000/api';
const DEPARTMENTS = [
  'Home Affairs',
  'Health',
  'Education',
  'Roads',
  'Municipality',
  'Police',
  'Other'
];
const TYPES = [
  { value: 'complaint', label: 'Complaint' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'opinion', label: 'Opinion' }
];

export default function SubmissionForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    department: DEPARTMENTS[0],
    type: TYPES[0].value
  });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await axios.post(`${API_BASE}/submit`, form, { headers });
      showToast('Submission successful!', 'success');
      setForm({ title: '', content: '', department: DEPARTMENTS[0], type: TYPES[0].value });
      setTimeout(() => { if (onSuccess) onSuccess(); }, 800);
    } catch (err) {
      showToast(err.response?.data?.error || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 540, margin: '0 auto', background: 'linear-gradient(120deg, #f7fafd 80%, #e3eafc 100%)', padding: '40px 36px 32px 36px', borderRadius: 22, boxShadow: '0 8px 32px #1976d220, 0 2px 12px #0001', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 900, marginBottom: 26, fontSize: 26, letterSpacing: 0.2, textShadow: '0 2px 8px #0001' }}>Submit Complaint / Suggestion / Opinion</h2>
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontWeight: 700, color: '#1976d2', marginBottom: 6, display: 'block' }}>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: '13px 12px', borderRadius: 10, border: '1.5px solid #bcd2f7', fontSize: 17, marginTop: 2, background: '#fff' }} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontWeight: 700, color: '#1976d2', marginBottom: 6, display: 'block' }}>Content</label>
        <textarea name="content" value={form.content} onChange={handleChange} required rows={5} style={{ width: '100%', padding: '13px 12px', borderRadius: 10, border: '1.5px solid #bcd2f7', fontSize: 17, marginTop: 2, background: '#fff', resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: 22, display: 'flex', gap: 18 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 700, color: '#1976d2', marginBottom: 6, display: 'block' }}>Department</label>
          <select name="department" value={form.department} onChange={handleChange} style={{ width: '100%', padding: '13px 12px', borderRadius: 10, border: '1.5px solid #bcd2f7', fontSize: 17, marginTop: 2, background: '#fff' }}>
            {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 700, color: '#1976d2', marginBottom: 6, display: 'block' }}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '13px 12px', borderRadius: 10, border: '1.5px solid #bcd2f7', fontSize: 17, marginTop: 2, background: '#fff' }}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(90deg, #1976d2 80%, #1565c0 100%)', color: '#fff', padding: '15px 0', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 19, marginTop: 8, boxShadow: '0 2px 8px #1976d220', letterSpacing: 0.2 }}>{loading ? 'Submitting...' : 'Submit'}</button>
    </form>
  );
} 