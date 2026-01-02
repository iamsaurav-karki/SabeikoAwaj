import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../App';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
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
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 680, 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)', 
      padding: '48px 42px 40px 42px', 
      borderRadius: 24, 
      boxShadow: '0 12px 48px rgba(25, 118, 210, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)', 
      position: 'relative',
      border: '1px solid rgba(25, 118, 210, 0.1)'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, transparent 100%)',
        borderRadius: '0 24px 0 100%',
        zIndex: 0
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            padding: '12px 24px',
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>📝 New Submission</span>
          </div>
          <h2 style={{ 
            color: '#1976d2', 
            fontWeight: 900, 
            fontSize: 32, 
            letterSpacing: 0.5, 
            margin: 0,
            textShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
          }}>Submit Your Concern</h2>
          <p style={{ color: '#666', fontSize: 15, marginTop: 8, fontWeight: 500 }}>Share your complaint, suggestion, or opinion with the government</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#1976d2', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 15,
            letterSpacing: 0.3
          }}>Title <span style={{ color: '#e74c3c' }}>*</span></label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            placeholder="Enter a clear, descriptive title"
            style={{ 
              width: '100%', 
              padding: '16px 18px', 
              borderRadius: 12, 
              border: '2px solid #e3eafc', 
              fontSize: 16, 
              marginTop: 4, 
              background: '#fff',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1976d2'}
            onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#1976d2', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 15,
            letterSpacing: 0.3
          }}>Content <span style={{ color: '#e74c3c' }}>*</span></label>
          <textarea 
            name="content" 
            value={form.content} 
            onChange={handleChange} 
            required 
            rows={6} 
            placeholder="Provide detailed information about your concern..."
            style={{ 
              width: '100%', 
              padding: '16px 18px', 
              borderRadius: 12, 
              border: '2px solid #e3eafc', 
              fontSize: 16, 
              marginTop: 4, 
              background: '#fff', 
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              lineHeight: 1.6
            }}
            onFocus={(e) => e.target.style.borderColor = '#1976d2'}
            onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
          />
        </div>

        <div style={{ marginBottom: 28, display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              fontWeight: 700, 
              color: '#1976d2', 
              marginBottom: 8, 
              display: 'block',
              fontSize: 15,
              letterSpacing: 0.3
            }}>Department <span style={{ color: '#e74c3c' }}>*</span></label>
            <select 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '16px 18px', 
                borderRadius: 12, 
                border: '2px solid #e3eafc', 
                fontSize: 16, 
                marginTop: 4, 
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%231976d2\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 18px center',
                paddingRight: '42px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
            >
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ 
              fontWeight: 700, 
              color: '#1976d2', 
              marginBottom: 8, 
              display: 'block',
              fontSize: 15,
              letterSpacing: 0.3
            }}>Type <span style={{ color: '#e74c3c' }}>*</span></label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              style={{ 
                width: '100%', 
                padding: '16px 18px', 
                borderRadius: 12, 
                border: '2px solid #e3eafc', 
                fontSize: 16, 
                marginTop: 4, 
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%231976d2\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 18px center',
                paddingRight: '42px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
            >
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
            color: '#fff', 
            padding: '18px 0', 
            border: 'none', 
            borderRadius: 12, 
            fontWeight: 800, 
            fontSize: 18, 
            marginTop: 8, 
            boxShadow: loading ? 'none' : '0 6px 20px rgba(25, 118, 210, 0.4)', 
            letterSpacing: 0.5,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(25, 118, 210, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
            }
          }}
        >
          {loading ? '⏳ Submitting...' : '✓ Submit Submission'}
        </button>

        <p style={{ 
          textAlign: 'center', 
          color: '#888', 
          fontSize: 13, 
          marginTop: 20,
          fontStyle: 'italic'
        }}>
          🔒 Your submission is secure and will be reviewed by the relevant department
        </p>
      </div>
    </form>
  );
} 