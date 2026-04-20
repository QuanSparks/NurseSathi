import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Google Login */}
        <button
          style={styles.googleBtn}
          onClick={loginWithGoogle}
          id="login-google-btn"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="divider-text">or sign in with email</div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
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
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.switchLink} id="login-register-link">
            Create one free
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
    maxWidth: '440px',
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  header: { textAlign: 'center' },
  logo: { fontSize: '1.3rem', fontWeight: 800, textDecoration: 'none', display: 'block', marginBottom: '1.5rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.35rem' },
  subtitle: { color: '#6b7280', fontSize: '0.9rem' },
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
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  switchText: { textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' },
  switchLink: { color: '#2563eb', fontWeight: 600, textDecoration: 'none' },
};

export default Login;
