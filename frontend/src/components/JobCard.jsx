import { Link } from 'react-router-dom';

const JobCard = ({ job, showApply = false, onApply, applying }) => {
  const initials = job.hospital_name
    ? job.hospital_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'H';

  const getTypeColor = (type) => {
    const map = {
      'Full-time': { bg: '#dbeafe', color: '#1d4ed8' },
      'Part-time': { bg: '#fef3c7', color: '#92400e' },
      'Internship': { bg: '#d1fae5', color: '#065f46' },
      'Contract': { bg: '#ede9fe', color: '#5b21b6' },
    };
    return map[type] || { bg: '#f3f4f6', color: '#4b5563' };
  };

  const typeStyle = getTypeColor(job.type);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div style={styles.card} className="animate-fade">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.hospitalAvatar}>{initials}</div>
        <div style={styles.headerInfo}>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.hospital}>{job.hospital_name || 'Hospital'}</p>
        </div>
        {job.type && (
          <span style={{ ...styles.typeBadge, background: typeStyle.bg, color: typeStyle.color }}>
            {job.type}
          </span>
        )}
      </div>

      {/* Meta */}
      <div style={styles.meta}>
        {job.location && (
          <span style={styles.metaItem}>
            📍 {job.location}
          </span>
        )}
        {job.salary && (
          <span style={styles.metaItem}>
            💰 {job.salary}
          </span>
        )}
        <span style={styles.metaItem}>
          🕐 {timeAgo(job.created_at)}
        </span>
      </div>

      {/* Description snippet */}
      <p style={styles.description}>
        {job.description?.length > 120
          ? job.description.slice(0, 120) + '…'
          : job.description}
      </p>

      {/* Footer */}
      <div style={styles.footer}>
        <Link to={`/jobs/${job.id}`} style={styles.viewBtn} id={`job-view-${job.id}`}>
          View Details →
        </Link>
        {showApply && (
          <button
            style={styles.applyBtn}
            onClick={() => onApply?.(job.id)}
            disabled={applying}
            id={`job-apply-${job.id}`}
          >
            {applying ? 'Applying…' : 'Quick Apply'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'all 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    cursor: 'default',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  hospitalAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  headerInfo: { flex: 1, minWidth: 0 },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.15rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  hospital: { fontSize: '0.825rem', color: '#6b7280', fontWeight: 500 },
  typeBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: 600,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  metaItem: {
    fontSize: '0.8rem',
    color: '#6b7280',
    background: '#f9fafb',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
  },
  description: {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: 1.6,
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginTop: '0.25rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #f3f4f6',
  },
  viewBtn: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#2563eb',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  applyBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
    transition: 'all 0.2s',
  },
};

export default JobCard;
