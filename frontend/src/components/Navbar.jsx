import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isHospital, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🏥</span>
          <span>
            <span style={styles.logoNurse}>Nurse</span>
            <span style={styles.logoSathi}>Sathi</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <NavLink
            to="/jobs"
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
          >
            Browse Jobs
          </NavLink>

          {isAuthenticated && isStudent && (
            <NavLink
              to="/dashboard/student"
              style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
            >
              My Dashboard
            </NavLink>
          )}

          {isAuthenticated && isHospital && (
            <NavLink
              to="/dashboard/hospital"
              style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Auth actions */}
        <div style={styles.actions}>
          {isAuthenticated ? (
            <div style={styles.userMenu}>
              <button
                style={styles.userBtn}
                onClick={() => setMenuOpen((o) => !o)}
                id="navbar-user-menu"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ ...styles.avatarImg }} />
                ) : (
                  <div style={styles.avatarPlaceholder}>{initials}</div>
                )}
                <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>▼</span>
              </button>

              {menuOpen && (
                <div style={styles.dropdown} id="navbar-dropdown">
                  <div style={styles.dropdownUser}>
                    <p style={styles.dropdownName}>{user?.name}</p>
                    <p style={styles.dropdownEmail}>{user?.email}</p>
                    <span style={styles.roleBadge}>{user?.role}</span>
                  </div>
                  <div style={styles.dropdownDivider} />
                  <Link
                    to="/profile"
                    style={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    ⚙️ Edit Profile
                  </Link>
                  <button style={styles.dropdownItemBtn} onClick={handleLogout} id="navbar-logout">
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginBtn} id="navbar-login">
                Sign In
              </Link>
              <Link to="/register" style={styles.registerBtn} id="navbar-register">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(229,231,235,0.8)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: { fontSize: '1.5rem' },
  logoNurse: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#1d4ed8',
    letterSpacing: '-0.02em',
  },
  logoSathi: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#0d9488',
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    flex: 1,
    paddingLeft: '2rem',
  },
  link: {
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#4b5563',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  linkActive: {
    background: 'rgba(37,99,235,0.08)',
    color: '#2563eb',
    fontWeight: 600,
  },
  actions: { display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' },
  authButtons: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  loginBtn: {
    padding: '0.5rem 1.1rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    borderRadius: '8px',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  registerBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%)',
    color: '#fff',
    borderRadius: '9999px',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
    transition: 'all 0.2s',
  },
  userMenu: { position: 'relative' },
  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.75rem 0.35rem 0.35rem',
    background: 'rgba(243,244,246,0.8)',
    border: '1px solid rgba(229,231,235,0.8)',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  avatarImg: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  userName: { fontSize: '0.875rem', fontWeight: 600, color: '#374151' },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#fff',
    border: '1px solid rgba(229,231,235,0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    minWidth: '220px',
    overflow: 'hidden',
    animation: 'fadeIn 0.15s ease',
  },
  dropdownUser: { padding: '1rem 1.25rem' },
  dropdownName: { fontWeight: 600, fontSize: '0.9rem', color: '#111827', marginBottom: '0.1rem' },
  dropdownEmail: { fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.4rem' },
  roleBadge: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: 600,
    background: 'rgba(37,99,235,0.1)',
    color: '#1d4ed8',
    textTransform: 'capitalize',
  },
  dropdownDivider: { height: '1px', background: '#f3f4f6' },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.875rem',
    color: '#374151',
    textDecoration: 'none',
    transition: 'background 0.15s',
    cursor: 'pointer',
  },
  dropdownItemBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.875rem',
    color: '#ef4444',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: 'Inter, sans-serif',
  },
};

export default Navbar;
