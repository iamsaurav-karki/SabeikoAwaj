import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.NODE_ENV === 'production' ? 'https://sabeiko.ksaurav.com.np/api' : 'http://localhost:5000/api';

const ITEMS_PER_PAGE = 10;

export default function UserDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/submissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only user's submissions
      const userSubs = res.data.filter(s => {
        const userId = s.userid || s.userId;
        return userId && userId.toString() === user.id.toString();
      });
      setSubmissions(userSubs);
    } catch (err) {
      setError('Failed to load submissions. Please try again.');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions by status
  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    const status = (sub.status || 'pending').toLowerCase();
    return status === filterStatus.toLowerCase();
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

  // Pagination calculations
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
      return status === 'in progress' || status === 'pending';
    }).length,
    pending: submissions.filter(s => (s.status || '').toLowerCase() === 'pending').length
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)',
      padding: '2rem 0'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '0 2rem' 
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 40,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          padding: '40px 36px',
          borderRadius: 24,
          boxShadow: '0 12px 48px rgba(25, 118, 210, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <div style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            padding: '12px 24px',
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>📊 Your Dashboard</span>
          </div>
          <h1 style={{ 
            color: '#1976d2', 
            fontWeight: 900, 
            marginBottom: 8,
            fontSize: 36,
            letterSpacing: 0.5
          }}>Your Submissions</h1>
          <p style={{ color: '#666', fontSize: 16, marginTop: 4 }}>Track and manage all your submissions</p>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 32
        }}>
          <StatCard label="Total" value={stats.total} color="#1976d2" icon="📝" />
          <StatCard label="Resolved" value={stats.resolved} color="#27ae60" icon="✅" />
          <StatCard label="In Progress" value={stats.inProgress} color="#f1c40f" icon="🔄" />
          <StatCard label="Pending" value={stats.pending} color="#e74c3c" icon="⏳" />
        </div>

        {/* Filters and Sort */}
        <div style={{ 
          background: '#fff',
          padding: '20px 24px',
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 700, 
              color: '#1976d2', 
              marginBottom: 8,
              fontSize: 14
            }}>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: '10px 14px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: 15,
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 700, 
              color: '#1976d2', 
              marginBottom: 8,
              fontSize: 14
            }}>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={{ 
                width: '100%', 
                padding: '10px 14px', 
                borderRadius: 10, 
                border: '2px solid #e3eafc', 
                fontSize: 15,
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={fetchSubmissions}
              style={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ color: '#888', fontSize: 16 }}>Loading your submissions...</div>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px solid #e74c3c'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ color: '#e74c3c', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{error}</div>
            <button 
              onClick={fetchSubmissions}
              style={{ 
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14
              }}
            >
              Try Again
            </button>
          </div>
        ) : paginatedSubmissions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '2px dashed #e3eafc'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
            <h3 style={{ color: '#1976d2', fontWeight: 700, marginBottom: 8 }}>No Submissions Found</h3>
            <p style={{ color: '#888', fontSize: 15 }}>
              {filterStatus !== 'all' 
                ? `No submissions with status "${filterStatus}" found.`
                : 'Start by submitting your first complaint, suggestion, or opinion!'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e3eafc',
              marginBottom: 24
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                padding: '20px 24px',
                color: '#fff'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr',
                  gap: 16,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase'
                }}>
                  <div>Title</div>
                  <div>Department</div>
                  <div>Status</div>
                  <div>Date</div>
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
                        gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr',
                        gap: 16,
                        padding: '20px 24px',
                        borderBottom: idx < paginatedSubmissions.length - 1 ? '1px solid #e3eafc' : 'none',
                        transition: 'background 0.2s',
                        alignItems: 'center',
                        background: idx % 2 === 0 ? '#fff' : '#f8f9ff'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#f8f9ff'}
                    >
                      <div style={{ fontWeight: 600, color: '#333', fontSize: 15, lineHeight: 1.4 }}>
                        {sub.title}
                      </div>
                      <div style={{ color: '#666', fontSize: 14, fontWeight: 500 }}>
                        {sub.department}
                      </div>
                      <div>
                        {getStatusBadge(sub.status)}
                      </div>
                      <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>
                        {date ? new Date(date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
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
                gap: 8,
                flexWrap: 'wrap',
                background: '#fff',
                padding: '20px',
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ 
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '2px solid #e3eafc',
                    background: currentPage === 1 ? '#f5f5f5' : '#fff',
                    color: currentPage === 1 ? '#ccc' : '#1976d2',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: 14
                  }}
                >
                  ← Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 10,
                          border: '2px solid #e3eafc',
                          background: currentPage === page 
                            ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' 
                            : '#fff',
                          color: currentPage === page ? '#fff' : '#1976d2',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 14,
                          minWidth: 44,
                          boxShadow: currentPage === page ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none'
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} style={{ padding: '0 8px', color: '#888' }}>...</span>;
                  }
                  return null;
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ 
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: '2px solid #e3eafc',
                    background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                    color: currentPage === totalPages ? '#ccc' : '#1976d2',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: 14
                  }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Results Info */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: 20,
              color: '#666',
              fontSize: 14
            }}>
              Showing {startIndex + 1} to {Math.min(endIndex, sortedSubmissions.length)} of {sortedSubmissions.length} submissions
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      padding: '24px',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      border: `2px solid ${color}20`,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

