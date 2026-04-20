import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🎓', title: 'For Nursing Students', desc: 'Build your profile, showcase your education and skills, and apply to internships with one click.' },
  { icon: '🏥', title: 'For Hospitals', desc: 'Post nursing positions, review qualified applicants, and manage your hiring pipeline effortlessly.' },
  { icon: '🔒', title: 'Secure & Trusted', desc: 'End-to-end encrypted profiles, verified hospital listings, and a safe application process.' },
  { icon: '⚡', title: 'Fast Matching', desc: 'Smart job recommendations tailored for nursing students based on your location and skills.' },
];

const stats = [
  { value: '500+', label: 'Hospitals Listed' },
  { value: '10K+', label: 'Students Registered' },
  { value: '2K+', label: 'Jobs Posted' },
  { value: '95%', label: 'Placement Rate' },
];

const jobTypes = ['ICU Nursing', 'Pediatric Care', 'Emergency Room', 'Surgery', 'Geriatric Nursing', 'Oncology'];

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={styles.root}>
      {/* ── Hero ──────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroGlow1} />
        <div style={styles.heroGlow2} />
        <div style={styles.heroContent}>
          <div style={styles.heroPill}>🩺 Nursing Careers Made Simple</div>
          <h1 style={styles.heroTitle}>
            Find Your Perfect<br />
            <span style={styles.heroGradient}>Nursing Opportunity</span>
          </h1>
          <p style={styles.heroSubtitle}>
            NurseSathi connects nursing students with top hospitals for internships
            and entry-level jobs — across India.
          </p>
          <div style={styles.heroCta}>
            {isAuthenticated ? (
              <Link
                to={user?.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/student'}
                style={styles.ctaPrimary}
                id="home-dashboard-btn"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={styles.ctaPrimary} id="home-register-btn">
                  Get Started Free
                </Link>
                <Link to="/jobs" style={styles.ctaSecondary} id="home-browse-btn">
                  Browse Jobs
                </Link>
              </>
            )}
          </div>

          {/* Search hint */}
          <div style={styles.searchRow}>
            {jobTypes.map((t) => (
              <Link key={t} to={`/jobs?search=${encodeURIComponent(t)}`} style={styles.searchTag}>
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Hero illustration card */}
        <div style={styles.heroCard}>
          <div style={styles.heroCardInner}>
            <div style={styles.heroCardHeader}>
              <div style={styles.heroCardAvatar}>🏥</div>
              <div>
                <p style={styles.heroCardTitle}>Apollo Hospital</p>
                <p style={styles.heroCardSub}>New Delhi · Full-time</p>
              </div>
              <span style={styles.heroCardBadge}>Hiring</span>
            </div>
            <p style={styles.heroCardJob}>ICU Staff Nurse (Fresher)</p>
            <p style={styles.heroCardDesc}>₹18,000 – ₹24,000/month · BSc Nursing required</p>
            <div style={styles.heroCardFooter}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Posted 2 days ago</span>
              <span style={styles.heroCardApply}>Apply Now →</span>
            </div>
          </div>
          <div style={{ ...styles.heroCardInner, marginTop: '0.75rem', opacity: 0.7 }}>
            <div style={styles.heroCardHeader}>
              <div style={{ ...styles.heroCardAvatar, background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>🏨</div>
              <div>
                <p style={styles.heroCardTitle}>AIIMS Delhi</p>
                <p style={styles.heroCardSub}>Delhi · Internship</p>
              </div>
              <span style={{ ...styles.heroCardBadge, background: '#d1fae5', color: '#065f46' }}>Open</span>
            </div>
            <p style={styles.heroCardJob}>Nursing Intern – Pediatrics</p>
            <p style={styles.heroCardDesc}>Stipend ₹10,000/month · GNM or BSc Nursing</p>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────── */}
      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            {stats.map((s) => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2>Everything you need to launch your career</h2>
            <p style={styles.sectionSub}>
              Built specifically for the nursing community in India.
            </p>
          </div>
          <div style={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────── */}
      <section style={styles.howSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={{ color: '#fff' }}>How NurseSathi works</h2>
            <p style={{ ...styles.sectionSub, color: 'rgba(255,255,255,0.7)' }}>
              Three simple steps to your dream nursing job
            </p>
          </div>
          <div style={styles.stepsGrid}>
            {[
              { step: '01', title: 'Create your profile', desc: 'Add your education, skills, and nursing qualifications.', icon: '✍️' },
              { step: '02', title: 'Browse & Apply', desc: 'Explore listings and apply to matching positions in one click.', icon: '🔍' },
              { step: '03', title: 'Get Hired', desc: "Hospitals review your profile and reach out directly.", icon: '🎉' },
            ].map((s) => (
              <div key={s.step} style={styles.stepCard}>
                <div style={styles.stepNum}>{s.step}</div>
                <div style={styles.stepIcon}>{s.icon}</div>
                <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────── */}
      <section style={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Ready to start your nursing career?</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Join thousands of nursing students already using NurseSathi.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={styles.ctaPrimary} id="home-bottom-register">
              Create Free Account
            </Link>
            <Link to="/jobs" style={styles.ctaSecondary} id="home-bottom-jobs">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer style={styles.footer}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontWeight: 700, color: '#1d4ed8' }}>🏥 NurseSathi</p>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            © {new Date().getFullYear()} NurseSathi. Connecting nurses with hospitals.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  root: { overflowX: 'hidden' },

  // Hero
  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #0f4c45 100%)',
    minHeight: '92vh',
    display: 'flex',
    alignItems: 'center',
    padding: '5rem 1.5rem 3rem',
    position: 'relative',
    overflow: 'hidden',
    gap: '3rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroGlow1: {
    position: 'absolute', top: '-20%', left: '-10%',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroGlow2: {
    position: 'absolute', bottom: '-20%', right: '-10%',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: '560px',
    zIndex: 1,
    flex: '1 1 320px',
  },
  heroPill: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '9999px',
    background: 'rgba(37,99,235,0.2)',
    border: '1px solid rgba(37,99,235,0.4)',
    color: '#93c5fd',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    letterSpacing: '0.02em',
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem,5vw,3.5rem)',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1.1,
    marginBottom: '1.25rem',
    letterSpacing: '-0.02em',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #60a5fa, #2dd4bf)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '2rem',
    lineHeight: 1.7,
  },
  heroCta: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.85rem 2rem',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #2563eb, #0d9488)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    boxShadow: '0 6px 24px rgba(37,99,235,0.4)',
    textDecoration: 'none',
    transition: 'all 0.25s',
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.85rem 2rem',
    borderRadius: '9999px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.25s',
    backdropFilter: 'blur(8px)',
  },
  searchRow: {
    display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
  },
  searchTag: {
    padding: '0.3rem 0.8rem',
    borderRadius: '9999px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.78rem',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },

  // Hero card
  heroCard: { flex: '0 1 340px', zIndex: 1 },
  heroCardInner: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '1.25rem',
  },
  heroCardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  heroCardAvatar: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#1d4ed8,#0d9488)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
    flexShrink: 0,
  },
  heroCardTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.1rem' },
  heroCardSub: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
  heroCardBadge: {
    marginLeft: 'auto', padding: '0.15rem 0.5rem', borderRadius: '9999px',
    background: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', fontWeight: 700,
  },
  heroCardJob: { fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' },
  heroCardDesc: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' },
  heroCardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' },
  heroCardApply: { fontSize: '0.8rem', fontWeight: 600, color: '#60a5fa' },

  // Stats
  statsSection: {
    background: '#fff',
    borderBottom: '1px solid #f3f4f6',
    padding: '2rem 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    textAlign: 'center',
  },
  statItem: { padding: '0.5rem' },
  statValue: { fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 },

  // Sections
  section: { padding: '5rem 0' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionSub: { color: '#6b7280', marginTop: '0.5rem', fontSize: '1rem' },

  // Features
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.25s',
  },
  featureIcon: { fontSize: '2rem', marginBottom: '1rem' },
  featureTitle: { fontWeight: 700, color: '#111827', marginBottom: '0.5rem' },
  featureDesc: { fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.65 },

  // How it works
  howSection: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f4c45 100%)',
    padding: '5rem 0',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
  },
  stepCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
  },
  stepNum: {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: 'rgba(96,165,250,0.3)',
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  stepIcon: { fontSize: '1.75rem', marginBottom: '0.75rem' },

  // CTA
  ctaBanner: {
    background: '#f9fafb',
    padding: '5rem 0',
    borderTop: '1px solid #e5e7eb',
  },

  // Footer
  footer: {
    background: '#fff',
    borderTop: '1px solid #e5e7eb',
    padding: '1.5rem 0',
  },
};

export default Home;
