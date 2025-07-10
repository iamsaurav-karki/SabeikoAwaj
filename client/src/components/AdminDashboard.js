import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaCheck, FaExchangeAlt, FaUserCog } from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api';

const DEPARTMENTS = [
  'Home Affairs',
  'Health',
  'Education',
  'Roads',
  'Municipality',
  'Police',
  'Other'
];
const STATUS_OPTIONS = ['pending', 'in progress', 'resolved'];

const ActionButton = ({ onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    title={label}
    style={{
      background: color,
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      margin: '0 4px',
      padding: '6px 10px',
      cursor: 'pointer',
      fontSize: 16,
      display: 'inline-flex',
      alignItems: 'center',
      boxShadow: '0 1px 4px #0001',
      transition: 'background 0.2s',
    }}
  >
    {icon}
  </button>
);

const SubmissionTable = ({ submissions, onAction }) => (
  <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #0001' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
      <thead>
        <tr style={{ background: '#f7fafd' }}>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'left', fontWeight: 700, color: '#333' }}>Title</th>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'left', fontWeight: 700, color: '#333' }}>Department</th>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'left', fontWeight: 700, color: '#333' }}>Status</th>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'center', fontWeight: 700, color: '#333' }}>Votes</th>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'left', fontWeight: 700, color: '#333' }}>Created At</th>
          <th style={{ padding: '12px 16px', borderBottom: '2px solid #eee', textAlign: 'center', fontWeight: 700, color: '#333' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map(sub => (
          <tr key={sub.id} style={{ borderTop: '1px solid #f2f2f2' }}>
            <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1976d2' }}>{sub.title}</td>
            <td style={{ padding: '12px 16px' }}>{sub.department}</td>
            <td style={{ padding: '12px 16px' }}>
              <span style={{
                background: sub.status === 'resolved' ? '#27ae60' : sub.status === 'in progress' ? '#f1c40f' : '#e74c3c',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'capitalize'
              }}>{sub.status}</span>
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#555' }}>{sub.votes}</td>
            <td style={{ padding: '12px 16px', fontSize: 14, color: '#666' }}>{new Date(sub.createdat).toLocaleString()}</td>
            <td style={{ padding: '12px 16px', textAlign: 'center', minWidth: 220 }}>
              <ActionButton onClick={() => onAction('view', sub)} icon={<FaEye />} label="View" color="#1976d2" />
              <ActionButton onClick={() => onAction('edit', sub)} icon={<FaEdit />} label="Edit" color="#27ae60" />
              <ActionButton onClick={() => onAction('status', sub)} icon={<FaExchangeAlt />} label="Update Status" color="#f1c40f" />
              <ActionButton onClick={() => onAction('reach', sub)} icon={<FaUserCog />} label="Reach Government" color="#8e44ad" />
              <ActionButton onClick={() => onAction('delete', sub)} icon={<FaTrash />} label="Delete" color="#e74c3c" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 480, boxShadow: '0 8px 32px #0002', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
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

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      setError('Failed to fetch submissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAction = (action, submission) => {
    setModal({ open: true, type: action, submission });
    if (action === 'edit') {
      setForm({
        title: submission.title,
        content: submission.content,
        department: submission.department
      });
    }
    if (action === 'status') setStatus(submission.status);
    if (action === 'reach') setAssignDept(submission.department);
    if (action === 'delete') setDeleteConfirm(false);
  };

  const closeModal = () => setModal({ open: false, type: '', submission: null });

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
    } catch (err) {
      alert('Failed to update submission.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/admin/submissions/${modal.submission.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
    } catch (err) {
      alert('Failed to delete submission.');
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
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReachGovernment = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Assign department
      await axios.post(`${API_BASE}/admin/submissions/${modal.submission.id}/assign`, { department: assignDept }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update status to 'in progress'
      await axios.post(`${API_BASE}/admin/submissions/${modal.submission.id}/status`, { status: 'in progress' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchSubmissions();
    } catch (err) {
      alert('Failed to reach government.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- MODALS ---
  const renderModal = () => {
    if (!modal.open) return null;
    const { type, submission } = modal;
    if (!submission) return null;
    if (type === 'view') {
      return (
        <Modal open onClose={closeModal}>
          <h2 style={{ color: '#1976d2', marginBottom: 12 }}>{submission.title}</h2>
          <div style={{ marginBottom: 8 }}><b>Department:</b> {submission.department}</div>
          <div style={{ marginBottom: 8 }}><b>Status:</b> <span style={{ color: submission.status === 'resolved' ? '#27ae60' : submission.status === 'in progress' ? '#f1c40f' : '#e74c3c', fontWeight: 700 }}>{submission.status}</span></div>
          <div style={{ marginBottom: 8 }}><b>Votes:</b> {submission.votes}</div>
          <div style={{ marginBottom: 8 }}><b>Created At:</b> {new Date(submission.createdat).toLocaleString()}</div>
          <div style={{ marginBottom: 8 }}><b>Content:</b></div>
          <div style={{ background: '#f7fafd', padding: 12, borderRadius: 8, minHeight: 60 }}>{submission.content}</div>
        </Modal>
      );
    }
    if (type === 'edit') {
      return (
        <Modal open onClose={closeModal}>
          <h2 style={{ color: '#27ae60', marginBottom: 12 }}>Edit Submission</h2>
          <div style={{ marginBottom: 12 }}>
            <label>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Department</label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <button onClick={handleEdit} disabled={actionLoading} style={{ width: '100%', background: '#27ae60', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{actionLoading ? 'Saving...' : 'Save Changes'}</button>
        </Modal>
      );
    }
    if (type === 'delete') {
      return (
        <Modal open onClose={closeModal}>
          <h2 style={{ color: '#e74c3c', marginBottom: 16 }}>Delete Submission</h2>
          <p>Are you sure you want to delete <b>{submission.title}</b>? This action cannot be undone.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button onClick={closeModal} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }}>Cancel</button>
            <button onClick={handleDelete} disabled={actionLoading} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }}>{actionLoading ? 'Deleting...' : 'Delete'}</button>
          </div>
        </Modal>
      );
    }
    if (type === 'status') {
      return (
        <Modal open onClose={closeModal}>
          <h2 style={{ color: '#f1c40f', marginBottom: 16 }}>Update Status</h2>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 18 }}>
            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
          <button onClick={handleStatusUpdate} disabled={actionLoading} style={{ width: '100%', background: '#f1c40f', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{actionLoading ? 'Updating...' : 'Update Status'}</button>
        </Modal>
      );
    }
    if (type === 'reach') {
      return (
        <Modal open onClose={closeModal}>
          <h2 style={{ color: '#8e44ad', marginBottom: 16 }}>Reach Government</h2>
          <select value={assignDept} onChange={e => setAssignDept(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 18 }}>
            {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <button onClick={handleReachGovernment} disabled={actionLoading} style={{ width: '100%', background: '#8e44ad', color: '#fff', padding: 12, border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16 }}>{actionLoading ? 'Reaching...' : 'Reach Government'}</button>
        </Modal>
      );
    }
    return null;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading submissions...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1400, margin: '2rem auto', padding: '0 2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#e74c3c', fontWeight: 800 }}>Admin Dashboard</h1>
        <button onClick={fetchSubmissions} style={{ background: '#1976d2', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          &#x21bb; Refresh
        </button>
      </header>
      <p style={{ marginBottom: '2rem', color: '#555' }}>
        Welcome, Admin. Here you can manage all user submissions.
      </p>

      {submissions.length > 0 ? (
        <SubmissionTable submissions={submissions} onAction={handleAction} />
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 12 }}>
          <p>No submissions found.</p>
        </div>
      )}
      {renderModal()}
    </div>
  );
} 