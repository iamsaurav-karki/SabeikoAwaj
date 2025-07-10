import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaEye } from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api';

export default function BrowseSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteLoading, setVoteLoading] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleVote = async (id) => {
    setVoteLoading(v => ({ ...v, [id]: true }));
    // Optimistically update UI
    setSubmissions(subs => subs.map(s => s.id === id ? { ...s, votes: (parseInt(s.votes || 0) + 1) } : s));
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/submissions/${id}/vote`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      // Optionally, re-fetch to sync with backend
      // fetchSubmissions();
    } catch (err) {
      alert('Failed to vote.');
      // Rollback optimistic update
      setSubmissions(subs => subs.map(s => s.id === id ? { ...s, votes: (parseInt(s.votes || 1) - 1) } : s));
    } finally {
      setVoteLoading(v => ({ ...v, [id]: false }));
    }
  };

  const handleView = (sub) => {
    setSelected(sub);
    setViewModal(true);
  };

  const closeModal = () => {
    setViewModal(false);
    setTimeout(() => setSelected(null), 320); // match modal transition
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading submissions...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 900, marginBottom: 32, fontSize: 32, letterSpacing: 1 }}>Browse Public Submissions</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', width: '100%' }}>No submissions found.</div>
        ) : submissions.map(sub => (
          <div key={sub.id} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #0001', padding: 28, margin: '0 0 32px 0', width: 'calc(33% - 22px)', minWidth: 320, maxWidth: 370, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', border: '1.5px solid #e3f0fa' }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#1976d2', marginBottom: 6 }}>{sub.title}</div>
            <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Department: <span style={{ color: '#333' }}>{sub.department}</span></div>
            <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Status: <span style={{ color: sub.status === 'resolved' ? '#27ae60' : sub.status === 'in progress' ? '#f1c40f' : '#e74c3c', fontWeight: 700 }}>{sub.status}</span></div>
            <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Date: <span style={{ color: '#333' }}>{sub.createdat ? new Date(sub.createdat).toLocaleString() : ''}</span></div>
            <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Type: <span style={{ color: '#333' }}>{sub.type || 'Complaint'}</span></div>
            <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 2 }}>By: <span style={{ color: '#333' }}>{sub.userid ? 'Registered User' : 'Anonymous'}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
              <button onClick={() => handleVote(sub.id)} disabled={voteLoading[sub.id]} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px #0001' }}>
                <FaThumbsUp /> {voteLoading[sub.id] ? 'Voting...' : 'Vote'}
              </button>
              <span style={{ color: '#1976d2', fontWeight: 800, fontSize: 18 }}>Votes: {sub.votes || 0}</span>
              <button onClick={() => handleView(sub)} style={{ background: '#fff', color: '#1976d2', border: '2px solid #1976d2', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}><FaEye /> View</button>
            </div>
          </div>
        ))}
      </div>
      {viewModal && selected && (
        <Modal onClose={closeModal}>
          <h2 style={{ color: '#1976d2', marginBottom: 18, textAlign: 'left', fontWeight: 800, lineHeight: 1.2 }}>{selected.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', rowGap: 16, columnGap: 24, textAlign: 'left', fontSize: 16, alignItems: 'start', marginBottom: 22, paddingLeft: 16 }}>
            <div style={{ fontWeight: 700, color: '#555' }}>Department:</div>
            <div style={{ fontWeight: 400 }}>{selected.department}</div>
            <div style={{ fontWeight: 700, color: '#555' }}>Status:</div>
            <div style={{ color: selected.status === 'resolved' ? '#27ae60' : selected.status === 'in progress' ? '#f1c40f' : '#e74c3c', fontWeight: 700 }}>{selected.status}</div>
            <div style={{ fontWeight: 700, color: '#555' }}>Votes:</div>
            <div style={{ fontWeight: 400 }}>{selected.votes || 0}</div>
            <div style={{ fontWeight: 700, color: '#555' }}>Created At:</div>
            <div style={{ fontWeight: 400 }}>{selected.createdat ? new Date(selected.createdat).toLocaleString() : ''}</div>
            <div style={{ fontWeight: 700, color: '#555' }}>Type:</div>
            <div style={{ fontWeight: 400 }}>{selected.type || 'Complaint'}</div>
            <div style={{ fontWeight: 700, color: '#555' }}>By:</div>
            <div style={{ fontWeight: 400 }}>{selected.userid ? 'Registered User' : 'Anonymous'}</div>
          </div>
          <div style={{ fontWeight: 700, color: '#555', marginBottom: 8, textAlign: 'left', paddingLeft: 16 }}>Content:</div>
          <div style={{ background: '#f7fafd', padding: '20px 20px 20px 28px', borderRadius: 8, minHeight: 60, fontSize: 15, color: '#222', border: '1px solid #e3f0fa', textAlign: 'left', whiteSpace: 'pre-line', marginBottom: 6, marginLeft: 8 }}>{selected.content}</div>
        </Modal>
      )}
    </div>
  );
}

// Modal with smooth transition (copied from App.js)
function Modal({ children, onClose }) {
  const [open, setOpen] = useState(true);
  const closeTimeout = useRef();
  const handleClose = () => {
    setOpen(false);
    closeTimeout.current = setTimeout(onClose, 320);
  };
  useEffect(() => () => clearTimeout(closeTimeout.current), []);
  return (
    <div className={`modal-overlay ${open ? 'modal-overlay-open' : 'modal-overlay-close'}`}>
      <div className={`modal-content ${open ? 'modal-content-open' : 'modal-content-close'}`} style={{ maxWidth: 620, minWidth: 400, padding: '32px 32px 28px 32px' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 20, color: '#e74c3c', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px #0001', zIndex: 2 }}>&times;</button>
        {children}
      </div>
    </div>
  );
} 