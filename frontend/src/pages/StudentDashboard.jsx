import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../services/applicationService';

const statusConfig = {
  applied:  { label: 'Applied',  className: 'status-applied',  icon: '📨' },
  reviewed: { label: 'Reviewed', className: 'status-reviewed', icon: '👀' },
  accepted: { label: 'Accepted', className: 'status-accepted', icon: '✅' },
  rejected: { label: 'Rejected', className: 'status-rejected', icon: '❌' },
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { applications } = await getMyApplications();
        setApplications(applications);
      } catch {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'applied').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="page">
      <div className="container">

        {/* Profile banner */}
        <div style={styles.profileBanner} className="animate-fade">
          <div style={styles.profileAvatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.profileName}>{user?.name}</h1>
            <p style={styles.profileMeta}>{user?.email}</p>
            {user?.education && <p style={styles.profileMeta}>🎓 {user.education}</p>}
            {user?.location && <p style={styles.profileMeta}>📍 {user.location}</p>}
          </div>
          <Link to="/profile" className="btn btn-secondary btn-sm" id="student-edit-profile">
            ✏️ Edit Profile
          </Link>
        </div>

        {/* Skills */}
        {user?.skills && (
          <div style={styles.skillsSection}>
            <h3 style={styles.skillsTitle}>Skills</h3>
            <div style={styles.skillsRow}>
              {user.skills.split(',').map((s) => (
                <span key={s} className="badge badge-teal">{s.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Applied', value: stats.total, color: '#1d4ed8' },
            { label: 'Under Review', value: stats.reviewed, color: '#d97706' },
            { label: 'Accepted', value: stats.accepted, color: '#059669' },
            { label: 'Rejected', value: stats.rejected, color: '#dc2626' },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Applications</h2>
            <Link to="/jobs" className="btn btn-primary btn-sm" id="student-browse-jobs">
              Browse More Jobs
            </Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Start applying to nursing jobs and internships</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div style={styles.appList}>
              {applications.map((app) => {
                const s = statusConfig[app.status] || statusConfig.applied;
                return (
                  <div key={app.id} style={styles.appCard} className="animate-fade">
                    <div style={styles.appMain}>
                      <div style={styles.appAvatar}>
                        {app.hospital_name?.slice(0, 2).toUpperCase() || 'H'}
                      </div>
                      <div style={styles.appInfo}>
                        <h3 style={styles.appTitle}>{app.job_title}</h3>
                        <p style={styles.appHospital}>{app.hospital_name}</p>
                        <div style={styles.appMeta}>
                          {app.job_location && <span style={styles.metaChip}>📍 {app.job_location}</span>}
                          {app.job_type && <span style={styles.metaChip}>{app.job_type}</span>}
                          {app.job_salary && <span style={styles.metaChip}>💰 {app.job_salary}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={styles.appRight}>
                      <span className={`badge ${s.className}`}>
                        {s.icon} {s.label}
                      </span>
                      <p style={styles.appDate}>
                        Applied {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileBanner: {
    background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(30,58,138,0.35)',
  },
  profileAvatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #60a5fa, #2dd4bf)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    flexShrink: 0,
    border: '3px solid rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  profileInfo: { flex: 1, minWidth: 0 },
  profileName: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' },
  profileMeta: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.15rem' },
  skillsSection: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.5rem',
  },
  skillsTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' },
  skillsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  statValue: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 },
  section: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #f3f4f6',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827' },
  appList: { display: 'flex', flexDirection: 'column' },
  appCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #f9fafb',
    transition: 'background 0.15s',
    flexWrap: 'wrap',
  },
  appMain: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 },
  appAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  appInfo: { flex: 1, minWidth: 0 },
  appTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.15rem' },
  appHospital: { fontSize: '0.825rem', color: '#6b7280', marginBottom: '0.4rem' },
  appMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  metaChip: {
    fontSize: '0.75rem',
    color: '#6b7280',
    background: '#f9fafb',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
  },
  appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 },
  appDate: { fontSize: '0.75rem', color: '#9ca3af' },
};

export default StudentDashboard;
