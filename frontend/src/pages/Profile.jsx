import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    education: user?.education || '',
    skills: user?.skills || '',
    hospital_name: user?.hospital_name || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await updateProfile(form);
      updateUser(updated);
      setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const isStudent = user?.role === 'student';

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Profile Header */}
        <div style={styles.profileHeader} className="animate-fade">
          <div style={styles.avatarWrap}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>{initials}</div>
            )}
          </div>
          <div>
            <h1 style={styles.name}>{user?.name}</h1>
            <p style={styles.email}>{user?.email}</p>
            <span style={styles.roleBadge}>{user?.role === 'student' ? '🎓 Nursing Student' : '🏥 Hospital'}</span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div style={styles.formCard} className="animate-fade">
          <h2 style={styles.formTitle}>Edit Profile</h2>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="profile-phone">Phone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="profile-location">Location</label>
                <input
                  id="profile-location"
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="New Delhi"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {isStudent && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-education">Education</label>
                  <input
                    id="profile-education"
                    type="text"
                    name="education"
                    className="form-input"
                    placeholder="BSc Nursing, Delhi University (2022–2026)"
                    value={form.education}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-skills">
                    Skills <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>(comma-separated)</span>
                  </label>
                  <input
                    id="profile-skills"
                    type="text"
                    name="skills"
                    className="form-input"
                    placeholder="ICU Care, Patient Monitoring, IV Administration"
                    value={form.skills}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {!isStudent && (
              <div className="form-group">
                <label className="form-label" htmlFor="profile-hospital">Hospital / Organization Name</label>
                <input
                  id="profile-hospital"
                  type="text"
                  name="hospital_name"
                  className="form-input"
                  placeholder="Apollo Hospital"
                  value={form.hospital_name}
                  onChange={handleChange}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="profile-save-btn"
              style={{ marginTop: '0.5rem' }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Account Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoKey}>Email</span>
            <span style={styles.infoVal}>{user?.email}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoKey}>Role</span>
            <span style={styles.infoVal} style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoKey}>Member since</span>
            <span style={styles.infoVal}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoKey}>Login method</span>
            <span style={styles.infoVal}>{user?.google_id ? 'Google' : 'Email & Password'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  avatarWrap: { flexShrink: 0 },
  avatarImg: {
    width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
    border: '3px solid #e5e7eb',
  },
  avatarPlaceholder: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #1d4ed8, #0d9488)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.75rem', fontWeight: 800,
  },
  name: { fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.2rem' },
  email: { fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.4rem' },
  roleBadge: {
    display: 'inline-block', padding: '0.25rem 0.75rem',
    borderRadius: '9999px', background: 'rgba(37,99,235,0.1)',
    color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 600,
  },
  formCard: {
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  formTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  infoCard: {
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '16px', padding: '1.75rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  infoTitle: { fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.65rem 0', borderBottom: '1px solid #f9fafb',
  },
  infoKey: { fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 },
  infoVal: { fontSize: '0.875rem', color: '#111827', fontWeight: 500 },
};

export default Profile;
