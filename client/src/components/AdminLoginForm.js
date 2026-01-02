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
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 480, 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)', 
      padding: '44px 40px 36px 40px', 
      borderRadius: 24, 
      boxShadow: '0 12px 48px rgba(231, 76, 60, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(231, 76, 60, 0.1)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, transparent 100%)',
        borderRadius: '0 24px 0 100%',
        zIndex: 0
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            padding: '12px 24px',
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>🔐 Admin Access</span>
          </div>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#e74c3c', 
            fontWeight: 900, 
            marginBottom: 8,
            fontSize: 28,
            letterSpacing: 0.5
          }}>Admin Login</h2>
          <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Restricted access - Admin only</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fee',
            border: '2px solid #e74c3c',
            color: '#c0392b',
            padding: '14px 18px',
            borderRadius: 12,
            marginBottom: 20,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: '#dfe',
            border: '2px solid #27ae60',
            color: '#155724',
            padding: '14px 18px',
            borderRadius: 12,
            marginBottom: 20,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14
          }}>
            ✅ {success}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#e74c3c', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 14,
            letterSpacing: 0.3
          }}>Email <span style={{ color: '#e74c3c' }}>*</span></label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            placeholder="admin@example.com"
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: 12, 
              border: '2px solid #ffe0e0', 
              fontSize: 15,
              marginTop: 4, 
              background: '#fff',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e74c3c'}
            onBlur={(e) => e.target.style.borderColor = '#ffe0e0'}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ 
            fontWeight: 700, 
            color: '#e74c3c', 
            marginBottom: 8, 
            display: 'block',
            fontSize: 14,
            letterSpacing: 0.3
          }}>Password <span style={{ color: '#e74c3c' }}>*</span></label>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            placeholder="Enter admin password"
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: 12, 
              border: '2px solid #ffe0e0', 
              fontSize: 15,
              marginTop: 4, 
              background: '#fff',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e74c3c'}
            onBlur={(e) => e.target.style.borderColor = '#ffe0e0'}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', 
            color: '#fff', 
            padding: '16px 0', 
            border: 'none', 
            borderRadius: 12, 
            fontWeight: 800, 
            fontSize: 17, 
            marginTop: 8, 
            boxShadow: loading ? 'none' : '0 6px 20px rgba(231, 76, 60, 0.4)', 
            letterSpacing: 0.5,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(231, 76, 60, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
            }
          }}
        >
          {loading ? '⏳ Authenticating...' : '🔐 Login as Admin'}
        </button>

        <p style={{ 
          textAlign: 'center', 
          color: '#888', 
          fontSize: 12, 
          marginTop: 20,
          fontStyle: 'italic'
        }}>
          ⚠️ This is a restricted area. Only authorized administrators can access.
        </p>
      </div>
    </form>
  );
} 