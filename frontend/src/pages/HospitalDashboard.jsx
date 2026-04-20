import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postJob, fetchMyJobs, deleteJob } from '../services/jobService';
import { getHospitalApplications, updateApplicationStatus } from '../services/applicationService';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Post job form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', salary: '', type: 'Full-time', requirements: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([fetchMyJobs(), getHospitalApplications()]);
      setJobs(jobsRes.jobs);
      setApplications(appsRes.applications);
    } catch {
      showToast('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await postJob(form);
      showToast('✅ Job posted successfully!');
      setShowForm(false);
      setForm({ title: '', description: '', location: '', salary: '', type: 'Full-time', requirements: '' });
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to post job');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job? This action cannot be undone.')) return;
    try {
      await deleteJob(jobId);
      setJobs((j) => j.filter((job) => job.id !== jobId));
      showToast('Job deleted');
    } catch {
      showToast('Failed to delete job');
    }
  };

  const handleStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplications((apps) => apps.map((a) => a.id === appId ? { ...a, status } : a));
      showToast(`Application marked as ${status}`);
    } catch {
      showToast('Failed to update status');
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'H';

  const statusColors = {
    applied: { bg: '#dbeafe', color: '#1d4ed8' },
    reviewed: { bg: '#fef3c7', color: '#92400e' },
    accepted: { bg: '#d1fae5', color: '#065f46' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
  };

  return (
    <div className="page">
      {toast && <div style={styles.toast}>{toast}</div>}
      <div className="container">

        {/* Banner */}
        <div style={styles.banner} className="animate-fade">
          <div style={styles.bannerAvatar}>{initials}</div>
          <div style={styles.bannerInfo}>
            <h1 style={styles.bannerName}>{user?.name}</h1>
            <p style={styles.bannerMeta}>{user?.email}</p>
            {user?.location && <p style={styles.bannerMeta}>📍 {user.location}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setShowForm(true); setTab('jobs'); }}
              id="hospital-post-job-btn"
            >
              + Post a Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: 'Jobs Posted', value: jobs.length, color: '#1d4ed8' },
            { label: 'Total Applicants', value: applications.length, color: '#0d9488' },
            { label: 'Accepted', value: applications.filter((a) => a.status === 'accepted').length, color: '#059669' },
            { label: 'Pending Review', value: applications.filter((a) => a.status === 'applied').length, color: '#d97706' },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(tab === 'jobs' ? styles.tabActive : {}) }} onClick={() => setTab('jobs')} id="hospital-tab-jobs">
            My Jobs ({jobs.length})
          </button>
          <button style={{ ...styles.tab, ...(tab === 'applications' ? styles.tabActive : {}) }} onClick={() => setTab('applications')} id="hospital-tab-apps">
            Applications ({applications.length})
          </button>
        </div>

        {/* Post Job Form */}
        {showForm && (
          <div style={styles.formCard} className="animate-scale">
            <div style={styles.formHeader}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Post a New Job</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handlePost} style={styles.form}>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Job Title *</label>
                  <input id="job-form-title" className="form-input" placeholder="ICU Staff Nurse" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Type</label>
                  <select id="job-form-type" className="form-input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    {['Full-time', 'Part-time', 'Internship', 'Contract'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location</label>
                  <input id="job-form-location" className="form-input" placeholder="New Delhi" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Salary / Stipend</label>
                  <input id="job-form-salary" className="form-input" placeholder="₹18,000 – ₹24,000/month" value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea id="job-form-description" className="form-input" rows={4} placeholder="Describe responsibilities, work environment, and what the nurse will do…" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea id="job-form-requirements" className="form-input" rows={3} placeholder="BSc Nursing / GNM, 0-2 years experience, etc." value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" disabled={posting} id="job-form-submit">
                  {posting ? 'Posting…' : 'Post Job'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : tab === 'jobs' ? (
          jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No jobs posted yet</h3>
              <p>Post your first nursing job to start receiving applications</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowForm(true)}>Post First Job</button>
            </div>
          ) : (
            <div style={styles.jobList}>
              {jobs.map((job) => (
                <div key={job.id} style={styles.jobRow}>
                  <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <div style={styles.jobMeta}>
                      {job.type && <span style={styles.metaChip}>{job.type}</span>}
                      {job.location && <span style={styles.metaChip}>📍 {job.location}</span>}
                      {job.salary && <span style={styles.metaChip}>💰 {job.salary}</span>}
                    </div>
                  </div>
                  <div style={styles.jobRight}>
                    <span style={styles.appCount}>{job.application_count || 0} applicant{job.application_count !== 1 ? 's' : ''}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)} id={`hospital-delete-job-${job.id}`}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <h3>No applications yet</h3>
              <p>Applications will appear here once candidates apply to your jobs</p>
            </div>
          ) : (
            <div style={styles.jobList}>
              {applications.map((app) => {
                const sc = statusColors[app.status] || statusColors.applied;
                return (
                  <div key={app.id} style={styles.appCard}>
                    <div style={styles.appAvatar}>{app.student_name?.slice(0, 2).toUpperCase()}</div>
                    <div style={styles.appInfo}>
                      <h3 style={styles.appName}>{app.student_name}</h3>
                      <p style={styles.appRole}>Applied for: <strong>{app.job_title}</strong></p>
                      {app.student_education && <p style={styles.appDetail}>🎓 {app.student_education}</p>}
                      {app.student_email && <p style={styles.appDetail}>✉️ {app.student_email}</p>}
                      {app.student_phone && <p style={styles.appDetail}>📞 {app.student_phone}</p>}
                    </div>
                    <div style={styles.appActions}>
                      <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                        {app.status}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {app.status !== 'accepted' && (
                          <button className="btn btn-success btn-sm" onClick={() => handleStatus(app.id, 'accepted')} id={`app-accept-${app.id}`}>Accept</button>
                        )}
                        {app.status !== 'reviewed' && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleStatus(app.id, 'reviewed')} id={`app-review-${app.id}`}>Review</button>
                        )}
                        {app.status !== 'rejected' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleStatus(app.id, 'rejected')} id={`app-reject-${app.id}`}>Reject</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    background: '#111827', color: '#fff', padding: '0.75rem 1.5rem',
    borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600,
    zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
  },
  banner: {
    background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
    borderRadius: '20px', padding: '2rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    marginBottom: '1.5rem', flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(30,58,138,0.35)',
  },
  bannerAvatar: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #60a5fa, #2dd4bf)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem', fontWeight: 800, flexShrink: 0,
    border: '3px solid rgba(255,255,255,0.2)',
  },
  bannerInfo: { flex: 1, minWidth: 0 },
  bannerName: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' },
  bannerMeta: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.1rem' },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem', marginBottom: '1.75rem',
  },
  statCard: {
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '12px', padding: '1.25rem', textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  statVal: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 },
  tabs: {
    display: 'flex', gap: '0.25rem', marginBottom: '1.25rem',
    background: '#f3f4f6', padding: '0.25rem', borderRadius: '10px', width: 'fit-content',
  },
  tab: {
    padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none',
    background: 'transparent', fontSize: '0.875rem', fontWeight: 600,
    color: '#6b7280', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
  },
  tabActive: { background: '#fff', color: '#111827', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  formCard: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
    padding: '1.75rem', marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  closeBtn: {
    width: '28px', height: '28px', borderRadius: '50%', border: 'none',
    background: '#f3f4f6', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  jobList: {
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden',
  },
  jobRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb', flexWrap: 'wrap', gap: '1rem',
  },
  jobInfo: { flex: 1, minWidth: 0 },
  jobTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.4rem' },
  jobMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  metaChip: {
    fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb',
    padding: '0.2rem 0.5rem', borderRadius: '6px',
  },
  jobRight: { display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 },
  appCount: { fontSize: '0.825rem', color: '#6b7280', fontWeight: 500 },
  appCard: {
    display: 'flex', alignItems: 'flex-start', gap: '1rem',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid #f9fafb', flexWrap: 'wrap',
  },
  appAvatar: {
    width: '42px', height: '42px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
  },
  appInfo: { flex: 1, minWidth: 0 },
  appName: { fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.15rem' },
  appRole: { fontSize: '0.825rem', color: '#6b7280', marginBottom: '0.3rem' },
  appDetail: { fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.1rem' },
  appActions: {
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    alignItems: 'flex-end', flexShrink: 0,
  },
  statusBadge: {
    display: 'inline-block', padding: '0.2rem 0.6rem',
    borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600,
    textTransform: 'capitalize',
  },
};

export default HospitalDashboard;
