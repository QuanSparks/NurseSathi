import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/jobService';
import { applyToJob } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

const Jobs = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [applying, setApplying] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadJobs();
    // Read URL search param
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) setSearch(params.get('search'));
  }, []);

  const loadJobs = async (params = {}) => {
    setLoading(true);
    try {
      const { jobs } = await fetchJobs(params);
      setJobs(jobs);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (typeFilter !== 'All') params.type = typeFilter;
    if (locationFilter) params.location = locationFilter;
    loadJobs(params);
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      showToast('✅ Application submitted!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="page">
      {toast && (
        <div style={styles.toast}>
          {toast}
        </div>
      )}

      <div className="container">
        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Nursing Jobs & Internships</h1>
          <p style={styles.pageSub}>Find your perfect opportunity from {jobs.length}+ listings</p>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍  Search jobs, hospitals, skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            id="jobs-search"
          />
          <input
            type="text"
            className="form-input"
            placeholder="📍 Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ ...styles.searchInput, maxWidth: '200px' }}
            id="jobs-location"
          />
          <button type="submit" className="btn btn-primary" id="jobs-search-btn">
            Search
          </button>
        </form>

        {/* Type filters */}
        <div style={styles.filterRow}>
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              style={{ ...styles.filterChip, ...(typeFilter === t ? styles.filterChipActive : {}) }}
              onClick={() => setTypeFilter(t)}
              id={`jobs-filter-${t.toLowerCase()}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try different search terms or clear your filters</p>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setTypeFilter('All'); setLocationFilter(''); loadJobs(); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showApply={isAuthenticated && isStudent}
                onApply={handleApply}
                applying={applying === job.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageHeader: { marginBottom: '2rem' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.25rem' },
  pageSub: { color: '#6b7280', fontSize: '0.95rem' },
  searchBar: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    background: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  searchInput: { flex: 1, minWidth: '180px' },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.75rem',
  },
  filterChip: {
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    border: '1.5px solid #e5e7eb',
    background: '#f9fafb',
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  filterChipActive: {
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    border: '1.5px solid transparent',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  },
  toast: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#111827',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    animation: 'fadeIn 0.3s ease',
  },
};

export default Jobs;
