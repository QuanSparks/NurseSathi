import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJob } from '../services/jobService';
import { applyToJob } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showCover, setShowCover] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { job } = await fetchJob(id);
        setJob(job);
      } catch {
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setApplying(true);
    try {
      await applyToJob(id, coverLetter);
      setMessage({ type: 'success', text: '🎉 Application submitted successfully!' });
      setShowCover(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to apply' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!job) return null;

  const initials = job.hospital_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'H';

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Back */}
        <Link to="/jobs" style={styles.back}>← Back to Jobs</Link>

        {/* Header card */}
        <div style={styles.headerCard} className="animate-fade">
          <div style={styles.headerTop}>
            <div style={styles.hospitalAvatar}>{initials}</div>
            <div style={{ flex: 1 }}>
              <h1 style={styles.jobTitle}>{job.title}</h1>
              <p style={styles.hospitalName}>{job.hospital_name}</p>
            </div>
            {job.type && (
              <span style={styles.typeBadge}>{job.type}</span>
            )}
          </div>

          <div style={styles.metaRow}>
            {job.location && <span style={styles.metaChip}>📍 {job.location}</span>}
            {job.salary && <span style={styles.metaChip}>💰 {job.salary}</span>}
            {job.hospital_email && <span style={styles.metaChip}>✉️ {job.hospital_email}</span>}
            {job.hospital_phone && <span style={styles.metaChip}>📞 {job.hospital_phone}</span>}
          </div>

          {/* Apply section */}
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
              {message.text}
            </div>
          )}

          {isAuthenticated && isStudent && !message?.type === 'success' && (
            <div style={styles.applySection}>
              {!showCover ? (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowCover(true)}
                  id="job-detail-apply-btn"
                >
                  Apply for This Position
                </button>
              ) : (
                <div style={styles.coverForm}>
                  <label className="form-label">Cover Letter (optional)</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Briefly describe why you're a good fit for this role…"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    id="job-detail-cover-letter"
                  />
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleApply}
                      disabled={applying}
                      id="job-detail-submit-application"
                    >
                      {applying ? 'Submitting…' : 'Submit Application'}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowCover(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div style={styles.applySection}>
              <Link to="/login" className="btn btn-primary btn-lg" id="job-detail-login-to-apply">
                Sign In to Apply
              </Link>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={styles.section} className="animate-fade">
          <h2 style={styles.sectionTitle}>Job Description</h2>
          <p style={styles.sectionText}>{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div style={styles.section} className="animate-fade">
            <h2 style={styles.sectionTitle}>Requirements</h2>
            <p style={styles.sectionText}>{job.requirements}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  back: {
    display: 'inline-block',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    marginBottom: '1.5rem',
    transition: 'color 0.2s',
  },
  headerCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    marginBottom: '1.5rem',
  },
  headerTop: { display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  hospitalAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  jobTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' },
  hospitalName: { fontSize: '1rem', color: '#6b7280', fontWeight: 500 },
  typeBadge: {
    padding: '0.3rem 0.9rem',
    borderRadius: '9999px',
    background: '#dbeafe',
    color: '#1d4ed8',
    fontSize: '0.8rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
  metaChip: {
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    fontSize: '0.825rem',
    color: '#4b5563',
  },
  applySection: { paddingTop: '1rem', borderTop: '1px solid #f3f4f6' },
  coverForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' },
  section: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '1.75rem 2rem',
    marginBottom: '1.25rem',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' },
  sectionText: { fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
};

export default JobDetail;
