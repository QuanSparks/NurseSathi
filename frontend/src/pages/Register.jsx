import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-scale">
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>🏥 <span style={{ color: '#1d4ed8' }}>Nurse</span><span style={{ color: '#0d9488' }}>Sathi</span></Link>
          <h1 style={styles.title}>Create your account</h1>
          <p style={styles.subtitle}>Join thousands of nursing professionals</p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Role selector */}
        <div style={styles.roleRow}>
          <button
            type="button"
            style={{ ...styles.roleBtn, ...(form.role === 'student' ? styles.roleBtnActive : {}) }}
            onClick={() => setForm((f) => ({ ...f, role: 'student' }))}
            id="register-role-student"
          >
            🎓 Student
          </button>
          <button
            type="button"
            style={{ ...styles.roleBtn, ...(form.role === 'hospital' ? styles.roleBtnActive : {}) }}
            onClick={() => setForm((f) => ({ ...f, role: 'hospital' }))}
            id="register-role-hospital"
          >
            🏥 Hospital
          </button>
        </div>

        {/* Google */}
        <button
          style={styles.googleBtn}
          onClick={loginWithGoogle}
          type="button"
          id="register-google-btn"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          Sign up with Google
        </button>

        <div className="divider-text">or fill in details</div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              {form.role === 'hospital' ? 'Hospital / Organization Name' : 'Full Name'}
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              className="form-input"
              placeholder={form.role === 'hospital' ? 'Apollo Hospital Delhi' : 'Your full name'}
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">Phone (optional)</label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
            id="register-submit"
          >
            {loading ? 'Creating account…' : `Create ${form.role === 'hospital' ? 'Hospital' : 'Student'} Account`}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.switchLink} id="register-login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 68px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem',
  },
  header: { textAlign: 'center' },
  logo: { fontSize: '1.3rem', fontWeight: 800, textDecoration: 'none', display: 'block', marginBottom: '1.25rem' },
  title: { fontSize: '1.65rem', fontWeight: 800, color: '#111827', marginBottom: '0.3rem' },
  subtitle: { color: '#6b7280', fontSize: '0.875rem' },
  roleRow: { display: 'flex', gap: '0.75rem' },
  roleBtn: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    background: '#f9fafb',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#4b5563',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  roleBtnActive: {
    border: '1.5px solid #2563eb',
    background: 'rgba(37,99,235,0.06)',
    color: '#1d4ed8',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.8rem',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    background: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.9rem' },
  switchText: { textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' },
  switchLink: { color: '#2563eb', fontWeight: 600, textDecoration: 'none' },
};

export default Register;
