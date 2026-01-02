import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../App';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login`, form);
      showToast('लगइन सफल!', 'success');
      localStorage.setItem('token', res.data.token);
      setTimeout(() => { if (onSuccess) onSuccess(res.data.user); }, 800);
    } catch (err) {
      showToast(err.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 480, 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)', 
      padding: '44px 40px 36px 40px', 
      borderRadius: 24, 
      boxShadow: '0 12px 48px rgba(25, 118, 210, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(25, 118, 210, 0.1)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
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
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>🔐 Sign In</span>
          </div>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#1976d2', 
            fontWeight: 900, 
            marginBottom: 8,
            fontSize: 28,
            letterSpacing: 0.5
          }}>लगइन गर्नुहोस्</h2>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Welcome back! Please login to continue</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#1976d2', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 14,
            letterSpacing: 0.3
          }}>इमेल (Email) <span style={{ color: '#e74c3c' }}>*</span></label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            placeholder="your.email@example.com"
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: 12, 
              border: '2px solid #e3eafc', 
              fontSize: 15,
              marginTop: 4, 
              background: '#fff',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1976d2'}
            onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#1976d2', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 14,
            letterSpacing: 0.3
          }}>पासवर्ड (Password) <span style={{ color: '#e74c3c' }}>*</span></label>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            placeholder="Enter your password"
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: 12, 
              border: '2px solid #e3eafc', 
              fontSize: 15,
              marginTop: 4, 
              background: '#fff',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1976d2'}
            onBlur={(e) => e.target.style.borderColor = '#e3eafc'}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
            color: '#fff', 
            padding: '16px 0', 
            border: 'none', 
            borderRadius: 12, 
            fontWeight: 800, 
            fontSize: 17, 
            marginTop: 8, 
            boxShadow: loading ? 'none' : '0 6px 20px rgba(25, 118, 210, 0.4)', 
            letterSpacing: 0.5,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
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
          {loading ? '⏳ Logging in...' : '✓ Login'}
        </button>
      </div>
    </form>
  );
} 