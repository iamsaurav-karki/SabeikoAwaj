import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import axios from 'axios';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import SubmissionForm from './components/SubmissionForm';
import SubmissionCharts from './components/SubmissionCharts';
import BrowseSubmissions from './components/BrowseSubmissions';
import ContactForm from './components/ContactForm';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL ||  'http://localhost:5000/api';

// Toast context and component
const ToastContext = createContext();
function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timeout = useRef();
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setToast(null), 2500);
  };
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, background: toast.type === 'success' ? '#27ae60' : '#e74c3c', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 17, boxShadow: '0 4px 24px #0003', minWidth: 220, textAlign: 'center', letterSpacing: 0.2, opacity: 0.97, transition: 'opacity 0.2s' }}>{toast.msg}</div>
      )}
    </ToastContext.Provider>
  );
}
function useToast() { return useContext(ToastContext); }

function App() {
  // Dynamic state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [allSubLoading, setAllSubLoading] = useState(true);
  const [allSubError, setAllSubError] = useState(null);
  const [recentResolved, setRecentResolved] = useState([]);
  const [recentResolvedLoading, setRecentResolvedLoading] = useState(true);
  const [recentResolvedError, setRecentResolvedError] = useState(null);
  // Modal state
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    setStatsLoading(true);
    axios.get(`${API_BASE}/admin/stats`)
      .then(res => setStats(res.data))
      .catch(e => setStatsError('Could not load stats'))
      .finally(() => setStatsLoading(false));
    setRecentLoading(true);
    axios.get(`${API_BASE}/submissions/recent`)
      .then(res => setRecent(res.data))
      .catch(e => setRecentError('Could not load submissions'))
      .finally(() => setRecentLoading(false));
    setAllSubLoading(true);
    axios.get(`${API_BASE}/submissions`)
      .then(res => setAllSubmissions(res.data))
      .catch(e => setAllSubError('Could not load all submissions'))
      .finally(() => setAllSubLoading(false));
    setRecentResolvedLoading(true);
    axios.get(`${API_BASE}/submissions/recent-resolved`)
      .then(res => setRecentResolved(res.data))
      .catch(e => setRecentResolvedError('Could not load resolved submissions'))
      .finally(() => setRecentResolvedLoading(false));
  }, []);

  // Save user info on login
  const handleLoginSuccess = (userObj) => {
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    setShowLogin(false);
    setShowAdminLogin(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDashboard(false);
  };

  // Fetch user's submissions for dashboard
  const [userSubs, setUserSubs] = useState([]);
  const [userSubsLoading, setUserSubsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setUserSubsLoading(true);
      axios.get(`${API_BASE}/submissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          // Filter only user's submissions
          setUserSubs(res.data.filter(s => s.userid === user.id));
        })
        .catch(() => setUserSubs([]))
        .finally(() => setUserSubsLoading(false));
    }
  }, [user, showDashboard]);

  // Modal overlay with smooth transition
  const Modal = ({ children, onClose }) => {
    const [open, setOpen] = useState(true);
    const closeTimeout = useRef();
    const handleClose = () => {
      setOpen(false);
      closeTimeout.current = setTimeout(onClose, 320); // match CSS transition
    };
    useEffect(() => () => clearTimeout(closeTimeout.current), []);
    return (
      <div className={`modal-overlay ${open ? 'modal-overlay-open' : 'modal-overlay-close'}`}>
        <div className={`modal-content ${open ? 'modal-content-open' : 'modal-content-close'}`}>
          <button onClick={handleClose} style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 20, color: '#e74c3c', fontWeight: 900, cursor: 'pointer', boxShadow: '0 2px 8px #0001', zIndex: 2 }}>&times;</button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Mukta, Noto Sans Devanagari, Arial, sans-serif', background: '#f7fafd', minHeight: '100vh' }}>
        {/* Modern, Big Navbar */}
        <header style={{ background: 'rgba(255,255,255,0.97)', borderBottom: '4px solid #e74c3c', boxShadow: '0 4px 24px #0002', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(8px)' }}>
          <nav style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 2rem', minHeight: 60 }} aria-label="Main Navigation">
            <div className="navbar-logo-block" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flexShrink: 0 }}>
              <img src="/Flag_of_Nepal.png" alt="Nepal Flag" style={{ height: 40, borderRadius: 5, boxShadow: '0 2px 8px #0001', background: '#fff', border: '1.5px solid #e74c3c', flexShrink: 0 }} />
              <div style={{ maxWidth: 120, minWidth: 0, overflow: 'hidden' }}>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#1976d2', letterSpacing: 0.2, textShadow: '0 1px 4px #0001', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', lineHeight: 1.1 }}>सबेैको आवाज</span>
                <div style={{ fontSize: 11, color: '#e74c3c', fontWeight: 600, letterSpacing: 0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>जनताको आवाज, सरकारको जिम्मेवारी</div>
              </div>
            </div>
            <div style={{ flex: 1 }} /> {/* Spacer for separation */}
            <ul style={{ display: 'flex', alignItems: 'center', gap: 18, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap', background: 'rgba(255,255,255,0.7)', borderRadius: 12, boxShadow: '0 1px 8px #0001', paddingLeft: 18, paddingRight: 18 }}>
              <li><Link to="/" className="nav-btn" style={{ fontSize: 14, padding: '0.4rem 0.9rem', textDecoration: 'none', color: '#1976d2' }}>गृहपृष्ठ</Link></li>
              <li><Link to="/browse" className="nav-btn" style={{ fontSize: 14, padding: '0.4rem 0.9rem', textDecoration: 'none', color: '#1976d2' }}>Browse</Link></li>
              <li><Link to="/contact" className="nav-btn" style={{ fontSize: 14, padding: '0.4rem 0.9rem', textDecoration: 'none', color: '#1976d2' }}>Contact</Link></li>
              <li><button className="nav-btn success" style={{ fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={() => { setShowSubmission(true); setShowLogin(false); setShowRegister(false); }}>Submit Complaint</button></li>
              {user ? (
                <>
                  <li style={{ fontWeight: 700, color: '#1976d2', fontSize: 14, padding: '0.4rem 0.9rem' }}>Hi, {user.name}</li>
                  {user.role === 'admin' ? (
                    <li><Link to="/admin" className="nav-btn danger" style={{ fontSize: 14, padding: '0.4rem 0.9rem', textDecoration: 'none' }}>Admin Panel</Link></li>
                  ) : (
                    <li><button className="nav-btn primary" style={{ fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={() => setShowDashboard(true)}>Dashboard</button></li>
                  )}
                  <li><button className="nav-btn danger" style={{ fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><button className="nav-btn" style={{ color: '#1976d2', border: '2px solid #1976d2', background: '#fff', fontWeight: 700, fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={() => { setShowLogin(true); setShowRegister(false); setShowSubmission(false); }}>Login</button></li>
                  <li><button className="nav-btn primary" style={{ fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={() => { setShowRegister(true); setShowLogin(false); setShowSubmission(false); }}>Register</button></li>
                  <li><button className="nav-btn danger" style={{ fontSize: 14, padding: '0.4rem 0.9rem' }} onClick={() => setShowAdminLogin(true)}>Admin</button></li>
                </>
              )}
            </ul>
          </nav>
        </header>

        {/* Modals for Register/Login/Submission */}
        {showRegister && <Modal onClose={() => setShowRegister(false)}><RegisterForm onSuccess={() => setShowRegister(false)} /></Modal>}
        {showLogin && <Modal onClose={() => setShowLogin(false)}><LoginForm onSuccess={handleLoginSuccess} /></Modal>}
        {showAdminLogin && <Modal onClose={() => setShowAdminLogin(false)}><AdminLoginForm onSuccess={handleLoginSuccess} /></Modal>}
        {showSubmission && <Modal onClose={() => setShowSubmission(false)}><SubmissionForm onSuccess={() => setShowSubmission(false)} /></Modal>}
        {showDashboard && user && (
          <Modal onClose={() => setShowDashboard(false)}>
            <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px #0001' }}>
              <h2 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 800, marginBottom: 18 }}>Your Submissions</h2>
              {userSubsLoading ? <div>Loading...</div> : userSubs.length === 0 ? <div>No submissions yet.</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7fafd' }}>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Title</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Department</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
                      <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSubs.map(sub => (
                      <tr key={sub.id}>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{sub.title}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{sub.department}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{sub.status}</td>
                        <td style={{ padding: 8, border: '1px solid #eee' }}>{sub.createdat ? new Date(sub.createdat).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Modal>
        )}
        {showBrowse && (
          <Modal onClose={() => setShowBrowse(false)}>
            <BrowseSubmissions />
          </Modal>
        )}

        <Routes>
          <Route path="/browse" element={<BrowseSubmissions />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/admin" element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/" element={
            <>
              {/* Hero Section with Nepal image and overlay */}
              <section style={{
                background: `linear-gradient(120deg, #e3eafc 60%, #f7fafd 100%), url('/nepal2.jpg') no-repeat center/cover`,
                padding: '4.5rem 0 3.5rem 0',
                textAlign: 'left',
                position: 'relative',
                minHeight: 420,
                boxShadow: '0 4px 32px #0001',
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32
              }}>
                <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40 }}>
                  <div style={{ flex: 1, minWidth: 340, zIndex: 2 }}>
                    <span style={{ background: '#fff', color: '#e74c3c', fontWeight: 700, fontSize: 15, borderRadius: 8, padding: '3px 14px', boxShadow: '0 2px 8px #0001' }}>E-Governance Platform</span>
                    <h1 style={{ fontSize: 54, fontWeight: 900, color: '#1976d2', margin: '18px 0 8px 0', letterSpacing: 1, textShadow: '0 2px 8px #0001' }}>सबेैको आवाज</h1>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#e74c3c', marginBottom: 18, textShadow: '0 2px 8px #0001' }}>Sabeiko Awaj</h2>
                    <p style={{ color: '#1976d2', fontWeight: 700, fontSize: 20, marginBottom: 8, textShadow: '0 2px 8px #0001' }}>जनताको सहभागिता, पारदर्शिता र जवाफदेही शासनका लागि</p>
                    <p style={{ color: '#444', marginBottom: 22, fontSize: 17, fontWeight: 500, textShadow: '0 2px 8px #fff8' }}>सरकार, निकाय वा विभागमा गुनासो, सुझाव वा विचार दर्ता गर्नुहोस्।</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
                      <button className="primary-btn" style={{ fontSize: 18, padding: '0.8rem 2.2rem' }} onClick={() => { setShowSubmission(true); setShowLogin(false); setShowRegister(false); }}>Submit Complaint</button>
                      <Link to="/browse" className="secondary-btn" style={{ fontSize: 18, padding: '0.8rem 2.2rem', textDecoration: 'none', color: '#1976d2', border: '2px solid #1976d2', background: '#fff', fontWeight: 700 }}>Browse Submissions</Link>
                    </div>
                    <div style={{ display: 'flex', gap: 18, fontSize: 16, color: '#888', fontWeight: 500 }}>
                      <span>Anonymous Submission</span>
                      <span>•</span>
                      <span>Real-time Tracking</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 340, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                    <img src="/nepal1.jpg" alt="Nepal e-Governance" style={{ maxWidth: 400, width: '100%', borderRadius: 22, boxShadow: '0 8px 32px #0002', border: '4px solid #fff' }} />
                  </div>
                </div>
                {/* Decorative overlay */}
                <img src="/nepal5.jpg" alt="Nepal landscape" style={{ position: 'absolute', left: 0, bottom: 0, width: 220, opacity: 0.18, borderBottomLeftRadius: 32, zIndex: 1 }} />
                <img src="/nepal4.jpg" alt="Nepal landscape" style={{ position: 'absolute', right: 0, top: 0, width: 180, opacity: 0.13, borderTopRightRadius: 32, zIndex: 1 }} />
              </section>

              {/* How It Works */}
              <section style={{ background: '#fff', padding: '2.5rem 0 2rem 0', backgroundImage: "url('/nepal3.jpg')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom', backgroundSize: '320px', borderRadius: 24 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
                  <h2 style={{ fontWeight: 800, fontSize: 30, color: '#1976d2', marginBottom: 24, textAlign: 'center', textShadow: '0 2px 8px #0001' }}>How It Works</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                    <StepCard icon="📝" title="Fill the Form" desc="Register your complaint, suggestion, or opinion easily." />
                    <StepCard icon="🔎" title="Track Status" desc="Track your submission status in your dashboard (if registered)." />
                    <StepCard icon="🏛️" title="Govt. Reviews" desc="Relevant authorities review and respond to your submission." />
                    <StepCard icon="🌐" title="Browse Public" desc="View and support public submissions from others." />
                  </div>
                </div>
              </section>

              {/* Statistics */}
              <section style={{ background: '#f7fafd', padding: '2rem 0', backgroundImage: "url('/nepal4.jpg')", backgroundRepeat: 'no-repeat', backgroundPosition: 'left top', backgroundSize: '260px', borderRadius: 24 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
                  <h2 style={{ fontWeight: 800, fontSize: 30, color: '#1976d2', marginBottom: 24, textAlign: 'center', textShadow: '0 2px 8px #0001' }}>Platform Statistics</h2>
                  {statsLoading ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Loading statistics...</div>
                  ) : statsError ? (
                    <div style={{ textAlign: 'center', color: '#e74c3c' }}>{statsError}</div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                      <StatCard label="Total Submissions" value={stats.total} color="#1976d2" />
                      <StatCard label="Resolved" value={stats.resolved} color="#27ae60" />
                      <StatCard label="In Progress" value={stats.inProgress} color="#f1c40f" />
                      <StatCard label="Active Users" value={stats.activeUsers} color="#e74c3c" />
                    </div>
                  )}
                  {/* Charts */}
                  {allSubLoading ? (
                    <div style={{ textAlign: 'center', color: '#888', margin: '2rem 0' }}>Loading charts...</div>
                  ) : allSubError ? (
                    <div style={{ textAlign: 'center', color: '#e74c3c', margin: '2rem 0' }}>{allSubError}</div>
                  ) : (
                    <SubmissionCharts submissions={allSubmissions} />
                  )}
                </div>
              </section>

              {/* Recent Resolved Submissions */}
              <section style={{ background: '#fff', padding: '2rem 0', backgroundImage: "url('/nepal5.jpg')", backgroundRepeat: 'no-repeat', backgroundPosition: 'left bottom', backgroundSize: '220px', borderRadius: 24 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
                  <h2 style={{ fontWeight: 800, fontSize: 30, color: '#1976d2', marginBottom: 24, textAlign: 'center', textShadow: '0 2px 8px #0001' }}>Recently Resolved Submissions</h2>
                  {recentResolvedLoading ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Loading resolved submissions...</div>
                  ) : recentResolvedError ? (
                    <div style={{ textAlign: 'center', color: '#e74c3c' }}>{recentResolvedError}</div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                      {recentResolved.length === 0 ? <div style={{ color: '#888' }}>No resolved submissions yet.</div> : recentResolved.map((s, i) => (
                        <ResolvedSubmissionCard key={s.id || i} title={s.title} department={s.department} resolvedAt={s.updatedat || s.createdat} upvotes={s.upvotes || s.votes || 0} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Contacts Section */}
              <section style={{ background: '#f7fafd', padding: '2rem 0', backgroundImage: "url('/nepal3.jpg')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right top', backgroundSize: '220px', borderRadius: 24 }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
                  <h2 style={{ fontWeight: 800, fontSize: 30, color: '#1976d2', marginBottom: 24, textAlign: 'center', textShadow: '0 2px 8px #0001' }}>Important Contacts</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                    <ContactCard title="Emergency Services" color="#e74c3c" contacts={[
                      { name: 'Nepal Police', phone: '100' },
                      { name: 'Fire Service', phone: '101' },
                      { name: 'Ambulance', phone: '102' },
                      { name: 'Armed Police', phone: '114' },
                    ]} />
                    <ContactCard title="Government Departments" color="#1976d2" contacts={[
                      { name: 'Home Affairs', phone: '01-4211215' },
                      { name: 'Health', phone: '01-4262802' },
                      { name: 'Education', phone: '01-4200381' },
                      { name: 'Roads', phone: '01-4251190' },
                    ]} />
                    <ContactCard title="Health Services" color="#27ae60" contacts={[
                      { name: 'Bir Hospital', phone: '01-4221119' },
                      { name: 'Teaching Hospital', phone: '01-4412303' },
                      { name: 'Patan Hospital', phone: '01-5522278' },
                    ]} />
                    <ContactCard title="Municipal Services" color="#8e44ad" contacts={[
                      { name: 'Kathmandu Metro', phone: '01-4200465' },
                      { name: 'Lalitpur Metro', phone: '01-5544437' },
                      { name: 'Bhaktapur Metro', phone: '01-6610670' },
                    ]} />
                  </div>
                </div>
              </section>
            </>
          } />
        </Routes>

        {/* Footer */}
        <footer style={{ background: '#fff', borderTop: '1px solid #eee', padding: '1rem', textAlign: 'center', color: '#888', fontSize: 14, marginTop: 24 }}>
          <div style={{ marginBottom: 4 }}>
            <a href="https://www.nepal.gov.np/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', marginRight: 16 }}>नेपाल सरकार</a>
            <a href="https://mohp.gov.np/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', marginRight: 16 }}>स्वास्थ्य मन्त्रालय</a>
            <a href="https://moha.gov.np/" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>गृह मन्त्रालय</a>
          </div>
          © {new Date().getFullYear()} सबैको आवाज | Powered by Nepali Citizens
        </footer>
      </div>
    </Router>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <div style={{ background: '#f7fafd', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '1.5rem 2rem', minWidth: 200, maxWidth: 240, flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#444', fontSize: 15 }}>{desc}</div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem 2.5rem', minWidth: 180, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ color: '#222', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function SubmissionCard({ title, type, upvotes }) {
  return (
    <div style={{ background: '#f7fafd', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '1.2rem 1.5rem', minWidth: 220, maxWidth: 260, flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2', marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{type}</div>
      <div style={{ color: '#888', fontSize: 14 }}>👍 {upvotes} upvotes</div>
    </div>
  );
}

function ContactCard({ title, color, contacts }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '1.5rem 2rem', minWidth: 260, maxWidth: 320, flex: 1 }}>
      <div style={{ fontWeight: 700, color, fontSize: 18, marginBottom: 8 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {contacts.map((c, i) => (
          <li key={i} style={{ marginBottom: 8, color: '#444', fontSize: 15 }}>
            <span style={{ fontWeight: 600 }}>{c.name}:</span> <span style={{ color: '#1976d2' }}>{c.phone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResolvedSubmissionCard({ title, department, resolvedAt, upvotes }) {
  return (
    <div style={{ background: '#f7fafd', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '1.2rem 1.5rem', minWidth: 220, maxWidth: 260, flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2', marginBottom: 6 }}>{title}</div>
      <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Resolved</div>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Department: {department}</div>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 6 }}>Resolved At: {resolvedAt ? new Date(resolvedAt).toLocaleString() : ''}</div>
      <div style={{ color: '#888', fontSize: 14 }}>👍 {upvotes} upvotes</div>
    </div>
  );
}

function AdminRoute({ user, children }) {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppWrapper() {
  return <ToastProvider><App /></ToastProvider>;
}

export { useToast };
