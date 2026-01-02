import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaCheck, FaExchangeAlt, FaUserCog } from 'react-icons/fa';

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
const STATUS_OPTIONS = ['pending', 'in progress', 'resolved', 'rejected'];

const ITEMS_PER_PAGE = 15;

const ActionButton = ({ onClick, icon, label, color, isMobile }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      background: color,
      color: '#fff',
      border: 'none',
      borderRadius: isMobile ? 10 : 8,
      margin: isMobile ? '4px 2px' : '0 3px',
      padding: isMobile ? '10px 14px' : '8px 12px',
      cursor: 'pointer',
      fontSize: isMobile ? 16 : 14,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      transition: 'all 0.2s',
      minWidth: isMobile ? 44 : 'auto',
      minHeight: isMobile ? 44 : 'auto',
      touchAction: 'manipulation'
    }}
    onMouseEnter={(e) => {
      if (!isMobile) {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isMobile) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      }
    }}
  >
    {icon}
  </button>
);

function Modal({ open, onClose, children, isMobile }) {
  if (!open) return null;
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.6)', 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      padding: isMobile ? '1rem' : '0'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)', 
        borderRadius: isMobile ? 16 : 20, 
        padding: isMobile ? '24px' : '36px', 
        minWidth: isMobile ? 'auto' : 400, 
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? '100%' : 600, 
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 12px 48px rgba(0,0,0,0.3)', 
        position: 'relative',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: isMobile ? 12 : 16, 
            right: isMobile ? 16 : 20, 
            background: '#e74c3c', 
            border: 'none', 
            borderRadius: '50%', 
            width: isMobile ? 36 : 32, 
            height: isMobile ? 36 : 32, 
            fontSize: isMobile ? 24 : 20, 
            color: '#fff', 
            cursor: 'pointer',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
            touchAction: 'manipulation'
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, type: '', submission: null });
  const [form, setForm] = useState({ title: '', content: '', department: DEPARTMENTS[0] });
  const [status, setStatus] = useState('pending');
  const [assignDept, setAssignDept] = useState(DEPARTMENTS[0]);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      setError('Failed to fetch submissions. Please try again later.');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter and sort submissions
  const filteredSubmissions = submissions.filter(sub => {
    // Status filter
    if (filterStatus !== 'all') {
      const subStatus = (sub.status || 'pending').toLowerCase();
      if (subStatus !== filterStatus.toLowerCase()) return false;
    }
    
    // Department filter
    if (filterDepartment !== 'all') {
      if (sub.department !== filterDepartment) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = (sub.title || '').toLowerCase();
      const content = (sub.content || '').toLowerCase();
      if (!title.includes(query) && !content.includes(query)) return false;
    }
    
    return true;
  });

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const aDate = a.createdat || a.createdAt;
    const bDate = b.createdat || b.createdAt;
    
    if (sortBy === 'date-desc') {
      const aTime = aDate ? (aDate instanceof Date ? aDate.getTime() : new Date(aDate).getTime()) : 0;
      const bTime = bDate ? (bDate instanceof Date ? bDate.getTime() : new Date(bDate).getTime()) : 0;
      return bTime - aTime;
    } else if (sortBy === 'date-asc') {
      const aTime = aDate ? (aDate instanceof Date ? aDate.getTime() : new Date(aDate).getTime()) : 0;
      const bTime = bDate ? (bDate instanceof Date ? bDate.getTime() : new Date(bDate).getTime()) : 0;
      return aTime - bTime;
    } else if (sortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    } else if (sortBy === 'title-desc') {
      return (b.title || '').localeCompare(a.title || '');
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, endIndex);

  // Statistics
  const stats = {
    total: submissions.length,
    resolved: submissions.filter(s => (s.status || '').toLowerCase() === 'resolved').length,
    inProgress: submissions.filter(s => {
      const status = (s.status || '').toLowerCase();
      return status === 'in progress';
    }).length,
    pending: submissions.filter(s => (s.status || '').toLowerCase() === 'pending').length
  };

  const handleAction = (action, submission) => {
    setModal({ open: true, type: action, submission });
    if (action === 'edit') {
      setForm({
        title: submission.title,
        content: submission.content,
        department: submission.department
      });
    }
    if (action === 'status') setStatus(submission.status || 'pending');
    if (action === 'reach') setAssignDept(submission.department || DEPARTMENTS[0]);
    if (action === 'delete') setDeleteConfirm(false);
  };

  const closeModal = () => setModal({ open: false, type: '', submission: null });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ACTION HANDLERS ---
  const handleEdit = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/admin/submissions/${modal.submission.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
      alert('Submission updated successfully!');
    } catch (err) {
      alert('Failed to update submission: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/admin/submissions/${modal.submission.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
      alert('Submission deleted successfully!');
    } catch (err) {
      alert('Failed to delete submission: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/admin/submissions/${modal.submission.id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReachGovernment = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/admin/submissions/${modal.submission.id}/assign`, { department: assignDept }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.post(`${API_BASE}/admin/submissions/${modal.submission.id}/status`, { status: 'in progress' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
      alert('Submission assigned and status updated successfully!');
    } catch (err) {
      alert('Failed to reach government: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    const statusColors = {
      'pending': { bg: '#fff3cd', color: '#856404', icon: '⏳' },
      'in progress': { bg: '#d1ecf1', color: '#0c5460', icon: '🔄' },
      'resolved': { bg: '#d4edda', color: '#155724', icon: '✅' },
      'rejected': { bg: '#f8d7da', color: '#721c24', icon: '❌' }
    };
    const statusInfo = statusColors[statusLower] || statusColors['pending'];
    
    return (
      <span style={{ 
        display: 'inline-block',
        background: statusInfo.bg,
        color: statusInfo.color,
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        textTransform: 'capitalize',
        border: `1px solid ${statusInfo.color}20`
      }}>
        {statusInfo.icon} {status || 'pending'}
      </span>
    );
  };

  // --- MODALS ---
  const renderModal = () => {
    if (!modal.open) return null;
    const { type, submission } = modal;
    if (!submission) return null;
    
    if (type === 'view') {
      return (
        <Modal open onClose={closeModal} isMobile={isMobile}>
          <h2 style={{ color: '#1976d2', marginBottom: 20, fontWeight: 900, fontSize: isMobile ? 20 : 24 }}>{submission.title}</h2>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Department:</b> <span style={{ color: '#333' }}>{submission.department}</span></div>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Status:</b> {getStatusBadge(submission.status)}</div>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Votes:</b> <span style={{ color: '#333', fontWeight: 700 }}>{submission.votes || 0}</span></div>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Type:</b> <span style={{ color: '#333' }}>{submission.type || 'Complaint'}</span></div>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Created At:</b> <span style={{ color: '#333' }}>{submission.createdat ? new Date(submission.createdat).toLocaleString() : 'N/A'}</span></div>
          <div style={{ marginBottom: 12, fontSize: 15 }}><b style={{ color: '#555' }}>Content:</b></div>
          <div style={{ background: '#f7fafd', padding: 16, borderRadius: 12, minHeight: 80, border: '1px solid #e3eafc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{submission.content}</div>
        </Modal>
      );
    }
    if (type === 'edit') {
      return (
        <Modal open onClose={closeModal} isMobile={isMobile}>
          <h2 style={{ color: '#27ae60', marginBottom: 20, fontWeight: 900, fontSize: isMobile ? 20 : 24 }}>Edit Submission</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#27ae60', marginBottom: 8 }}>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #e3eafc', fontSize: 15 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#27ae60', marginBottom: 8 }}>Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #e3eafc', fontSize: 15, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#27ae60', marginBottom: 8 }}>Department</label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #e3eafc', fontSize: 15 }}>
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <button onClick={handleEdit} disabled={actionLoading} style={{ width: '100%', background: actionLoading ? '#94a3b8' : 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', color: '#fff', padding: 14, border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: actionLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)' }}>{actionLoading ? 'Saving...' : '✓ Save Changes'}</button>
        </Modal>
      );
    }
    if (type === 'delete') {
      return (
        <Modal open onClose={closeModal} isMobile={isMobile}>
          <h2 style={{ color: '#e74c3c', marginBottom: 20, fontWeight: 900, fontSize: isMobile ? 20 : 24 }}>Delete Submission</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Are you sure you want to delete <b style={{ color: '#e74c3c' }}>{submission.title}</b>? This action cannot be undone.</p>
          {!deleteConfirm && (
            <div style={{ background: '#fee', padding: 16, borderRadius: 10, marginBottom: 20, border: '2px solid #e74c3c' }}>
              <p style={{ color: '#c0392b', fontWeight: 700, margin: 0 }}>⚠️ Please confirm deletion</p>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={closeModal} style={{ background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleDelete} disabled={actionLoading} style={{ background: actionLoading ? '#94a3b8' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)' }}>{actionLoading ? 'Deleting...' : deleteConfirm ? '✓ Confirm Delete' : 'Delete'}</button>
          </div>
        </Modal>
      );
    }
    if (type === 'status') {
      return (
        <Modal open onClose={closeModal} isMobile={isMobile}>
          <h2 style={{ color: '#f1c40f', marginBottom: 20, fontWeight: 900, fontSize: isMobile ? 20 : 24 }}>Update Status</h2>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #e3eafc', marginBottom: 20, fontSize: 15 }}>
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
          <button onClick={handleStatusUpdate} disabled={actionLoading} style={{ width: '100%', background: actionLoading ? '#94a3b8' : 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)', color: '#fff', padding: 14, border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: actionLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(241, 196, 15, 0.3)' }}>{actionLoading ? 'Updating...' : '✓ Update Status'}</button>
        </Modal>
      );
    }
    if (type === 'reach') {
      return (
        <Modal open onClose={closeModal} isMobile={isMobile}>
          <h2 style={{ color: '#8e44ad', marginBottom: 20, fontWeight: 900, fontSize: isMobile ? 20 : 24 }}>Assign to Department</h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Assign this submission to a department and update status to "In Progress"</p>
          <select value={assignDept} onChange={e => setAssignDept(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '2px solid #e3eafc', marginBottom: 20, fontSize: 15 }}>
            {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <button onClick={handleReachGovernment} disabled={actionLoading} style={{ width: '100%', background: actionLoading ? '#94a3b8' : 'linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)', color: '#fff', padding: 14, border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: actionLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(142, 68, 173, 0.3)' }}>{actionLoading ? 'Assigning...' : '✓ Assign & Update Status'}</button>
        </Modal>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <div style={{ color: '#666', fontSize: 18 }}>Loading submissions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          textAlign: 'center',
          background: '#fff',
          padding: '40px',
          borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          maxWidth: 500
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
          <div style={{ color: '#e74c3c', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{error}</div>
          <button 
            onClick={fetchSubmissions}
            style={{ 
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)',
      padding: isMobile ? '1rem 0' : '2rem 0'
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
          padding: isMobile ? '20px 16px' : '32px 40px',
          borderRadius: isMobile ? 16 : 24,
          boxShadow: '0 12px 48px rgba(231, 76, 60, 0.15)',
          marginBottom: isMobile ? 20 : 32,
          border: '1px solid rgba(231, 76, 60, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'inline-block',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                padding: isMobile ? '8px 16px' : '10px 20px',
                borderRadius: 12,
                marginBottom: 12,
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
              }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 11 : 13, letterSpacing: 1, textTransform: 'uppercase' }}>🔐 Admin Dashboard</span>
              </div>
              <h1 style={{ color: '#e74c3c', fontWeight: 900, margin: 0, fontSize: isMobile ? 24 : 36, letterSpacing: 0.5 }}>Admin Dashboard</h1>
              <p style={{ color: '#666', fontSize: isMobile ? 13 : 15, marginTop: 8 }}>Manage all user submissions and platform operations</p>
            </div>
            <button 
              onClick={fetchSubmissions} 
              style={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white', 
                border: 'none', 
                padding: isMobile ? '10px 20px' : '12px 24px', 
                borderRadius: 12, 
                cursor: 'pointer', 
                fontWeight: 700,
                fontSize: isMobile ? 14 : 15,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.2s',
                width: isMobile ? '100%' : 'auto',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                }
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : isTablet 
              ? 'repeat(2, 1fr)' 
              : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? 12 : 20,
          marginBottom: isMobile ? 20 : 32
        }}>
          <StatCard label="Total" value={stats.total} color="#1976d2" icon="📝" isMobile={isMobile} />
          <StatCard label="Resolved" value={stats.resolved} color="#27ae60" icon="✅" isMobile={isMobile} />
          <StatCard label="In Progress" value={stats.inProgress} color="#f1c40f" icon="🔄" isMobile={isMobile} />
          <StatCard label="Pending" value={stats.pending} color="#e74c3c" icon="⏳" isMobile={isMobile} />
        </div>

        {/* Filters and Search */}
        <div style={{ 
          background: '#fff',
          padding: isMobile ? '16px' : '24px',
          borderRadius: 16,
          marginBottom: isMobile ? 16 : 24,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: isMobile ? 12 : 16,
          alignItems: isMobile ? 'stretch' : 'flex-end'
        }}>
          <div style={{ flex: isMobile ? '1 1 100%' : 2, minWidth: isMobile ? '100%' : 250 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#e74c3c', marginBottom: 8, fontSize: isMobile ? 13 : 14 }}>Search:</label>
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: isMobile ? '14px 16px' : '12px 16px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: isMobile ? 16 : 15,
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: isMobile ? '1 1 100%' : 1, minWidth: isMobile ? '100%' : 180 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#e74c3c', marginBottom: 8, fontSize: isMobile ? 13 : 14 }}>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: isMobile ? '14px 16px' : '12px 14px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: isMobile ? 16 : 15,
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div style={{ flex: isMobile ? '1 1 100%' : 1, minWidth: isMobile ? '100%' : 180 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#e74c3c', marginBottom: 8, fontSize: isMobile ? 13 : 14 }}>Department:</label>
            <select 
              value={filterDepartment} 
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: isMobile ? '14px 16px' : '12px 14px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: isMobile ? 16 : 15,
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <div style={{ flex: isMobile ? '1 1 100%' : 1, minWidth: isMobile ? '100%' : 180 }}>
            <label style={{ display: 'block', fontWeight: 700, color: '#e74c3c', marginBottom: 8, fontSize: isMobile ? 13 : 14 }}>Sort:</label>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: isMobile ? '14px 16px' : '12px 14px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: isMobile ? 16 : 15,
                boxSizing: 'border-box'
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Submissions Table/Cards */}
        {paginatedSubmissions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: isMobile ? '40px 16px' : '60px 20px',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px dashed #e3eafc'
          }}>
            <div style={{ fontSize: isMobile ? 48 : 64, marginBottom: 16 }}>📝</div>
            <h3 style={{ color: '#e74c3c', fontWeight: 700, marginBottom: 8, fontSize: isMobile ? 18 : 20 }}>No Submissions Found</h3>
            <p style={{ color: '#888', fontSize: isMobile ? 14 : 15 }}>
              {searchQuery || filterStatus !== 'all' || filterDepartment !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'No submissions have been created yet.'}
            </p>
          </div>
        ) : isMobile ? (
          /* Mobile Card View */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {paginatedSubmissions.map((sub) => {
                const date = sub.createdat || sub.createdAt;
                return (
                  <div 
                    key={sub.id} 
                    style={{ 
                      background: '#fff',
                      borderRadius: 16,
                      padding: '20px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #e3eafc'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: 12
                    }}>
                      <h3 
                        style={{ 
                          fontWeight: 700, 
                          color: '#1976d2', 
                          fontSize: 16, 
                          lineHeight: 1.4, 
                          margin: 0,
                          flex: 1,
                          cursor: 'pointer'
                        }} 
                        onClick={() => handleAction('view', sub)}
                      >
                        {sub.title}
                      </h3>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                      marginBottom: 16,
                      fontSize: 14
                    }}>
                      <div>
                        <div style={{ color: '#888', fontWeight: 600, marginBottom: 4 }}>Department</div>
                        <div style={{ color: '#333', fontWeight: 500 }}>{sub.department}</div>
                      </div>
                      <div>
                        <div style={{ color: '#888', fontWeight: 600, marginBottom: 4 }}>Status</div>
                        <div>{getStatusBadge(sub.status)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#888', fontWeight: 600, marginBottom: 4 }}>Votes</div>
                        <div style={{ color: '#333', fontWeight: 700 }}>{sub.votes || 0}</div>
                      </div>
                      <div>
                        <div style={{ color: '#888', fontWeight: 600, marginBottom: 4 }}>Date</div>
                        <div style={{ color: '#333', fontSize: 12 }}>
                          {date ? new Date(date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 8,
                      justifyContent: 'center',
                      paddingTop: 12,
                      borderTop: '1px solid #e3eafc'
                    }}>
                      <ActionButton onClick={() => handleAction('view', sub)} icon={<FaEye />} label="View" color="#1976d2" isMobile={isMobile} />
                      <ActionButton onClick={() => handleAction('edit', sub)} icon={<FaEdit />} label="Edit" color="#27ae60" isMobile={isMobile} />
                      <ActionButton onClick={() => handleAction('status', sub)} icon={<FaExchangeAlt />} label="Status" color="#f1c40f" isMobile={isMobile} />
                      <ActionButton onClick={() => handleAction('reach', sub)} icon={<FaUserCog />} label="Assign" color="#8e44ad" isMobile={isMobile} />
                      <ActionButton onClick={() => handleAction('delete', sub)} icon={<FaTrash />} label="Delete" color="#e74c3c" isMobile={isMobile} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Desktop Table View */
          <>
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e3eafc',
              marginBottom: 24,
              overflowX: isTablet ? 'auto' : 'visible'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                padding: isTablet ? '16px 20px' : '20px 24px',
                color: '#fff'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isTablet 
                    ? '2fr 1.2fr 1fr 0.8fr 1.2fr 2fr'
                    : '2fr 1.5fr 1.2fr 0.8fr 1.5fr 2.2fr',
                  gap: isTablet ? 12 : 16,
                  fontWeight: 700,
                  fontSize: isTablet ? 12 : 14,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  minWidth: isTablet ? 800 : 'auto'
                }}>
                  <div>Title</div>
                  <div>Department</div>
                  <div>Status</div>
                  <div style={{ textAlign: 'center' }}>Votes</div>
                  <div>Created At</div>
                  <div style={{ textAlign: 'center' }}>Actions</div>
                </div>
              </div>
              <div>
                {paginatedSubmissions.map((sub, idx) => {
                  const date = sub.createdat || sub.createdAt;
                  return (
                    <div 
                      key={sub.id} 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isTablet 
                          ? '2fr 1.2fr 1fr 0.8fr 1.2fr 2fr'
                          : '2fr 1.5fr 1.2fr 0.8fr 1.5fr 2.2fr',
                        gap: isTablet ? 12 : 16,
                        padding: isTablet ? '16px 20px' : '20px 24px',
                        borderBottom: idx < paginatedSubmissions.length - 1 ? '1px solid #e3eafc' : 'none',
                        transition: 'background 0.2s',
                        alignItems: 'center',
                        background: idx % 2 === 0 ? '#fff' : '#f8f9ff',
                        minWidth: isTablet ? 800 : 'auto'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f8f9ff'}
                    >
                      <div style={{ fontWeight: 600, color: '#1976d2', fontSize: isTablet ? 14 : 15, lineHeight: 1.4, cursor: 'pointer' }} onClick={() => handleAction('view', sub)}>
                        {sub.title}
                      </div>
                      <div style={{ color: '#666', fontSize: isTablet ? 13 : 14, fontWeight: 500 }}>
                        {sub.department}
                      </div>
                      <div>
                        {getStatusBadge(sub.status)}
                      </div>
                      <div style={{ textAlign: 'center', fontWeight: 700, color: '#555', fontSize: isTablet ? 13 : 14 }}>
                        {sub.votes || 0}
                      </div>
                      <div style={{ color: '#888', fontSize: isTablet ? 12 : 13, fontWeight: 500 }}>
                        {date ? new Date(date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </div>
                      <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
                        <ActionButton onClick={() => handleAction('view', sub)} icon={<FaEye />} label="View" color="#1976d2" isMobile={false} />
                        <ActionButton onClick={() => handleAction('edit', sub)} icon={<FaEdit />} label="Edit" color="#27ae60" isMobile={false} />
                        <ActionButton onClick={() => handleAction('status', sub)} icon={<FaExchangeAlt />} label="Status" color="#f1c40f" isMobile={false} />
                        <ActionButton onClick={() => handleAction('reach', sub)} icon={<FaUserCog />} label="Assign" color="#8e44ad" isMobile={false} />
                        <ActionButton onClick={() => handleAction('delete', sub)} icon={<FaTrash />} label="Delete" color="#e74c3c" isMobile={false} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: isMobile ? 6 : 8,
                flexWrap: 'wrap',
                background: '#fff',
                padding: isMobile ? '16px' : '20px',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                marginBottom: isMobile ? 16 : 20
              }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ 
                    padding: isMobile ? '12px 16px' : '10px 16px',
                    borderRadius: 10,
                    border: '2px solid #e3eafc',
                    background: currentPage === 1 ? '#f5f5f5' : '#fff',
                    color: currentPage === 1 ? '#ccc' : '#e74c3c',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: isMobile ? 15 : 14,
                    touchAction: 'manipulation',
                    minHeight: isMobile ? 44 : 'auto'
                  }}
                >
                  {isMobile ? '←' : '← Previous'}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - (isMobile ? 1 : 2) && page <= currentPage + (isMobile ? 1 : 2))
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: isMobile ? '12px 16px' : '10px 16px',
                          borderRadius: 10,
                          border: '2px solid #e3eafc',
                          background: currentPage === page 
                            ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' 
                            : '#fff',
                          color: currentPage === page ? '#fff' : '#e74c3c',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: isMobile ? 15 : 14,
                          minWidth: isMobile ? 44 : 44,
                          minHeight: isMobile ? 44 : 'auto',
                          boxShadow: currentPage === page ? '0 4px 12px rgba(231, 76, 60, 0.3)' : 'none',
                          touchAction: 'manipulation'
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - (isMobile ? 2 : 3) ||
                    page === currentPage + (isMobile ? 2 : 3)
                  ) {
                    return <span key={page} style={{ padding: '0 8px', color: '#888', fontSize: isMobile ? 15 : 14 }}>...</span>;
                  }
                  return null;
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ 
                    padding: isMobile ? '12px 16px' : '10px 16px',
                    borderRadius: 10,
                    border: '2px solid #e3eafc',
                    background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                    color: currentPage === totalPages ? '#ccc' : '#e74c3c',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: isMobile ? 15 : 14,
                    touchAction: 'manipulation',
                    minHeight: isMobile ? 44 : 'auto'
                  }}
                >
                  {isMobile ? '→' : 'Next →'}
                </button>
              </div>
            )}

            {/* Results Info */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: isMobile ? 16 : 20,
              color: '#666',
              fontSize: isMobile ? 13 : 14,
              padding: isMobile ? '0 1rem' : '0'
            }}>
              Showing {startIndex + 1} to {Math.min(endIndex, sortedSubmissions.length)} of {sortedSubmissions.length} submissions
            </div>
          </>
        )}

        {renderModal()}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, isMobile }) {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      padding: isMobile ? '16px' : '24px',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      border: `2px solid ${color}20`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: isMobile ? 24 : 32, marginBottom: isMobile ? 6 : 8 }}>{icon}</div>
      <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: isMobile ? 11 : 13, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
