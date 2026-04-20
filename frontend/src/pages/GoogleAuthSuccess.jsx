import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This page handles the Google OAuth redirect:
// /auth/google/success?token=<jwt>
const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const { handleGoogleToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/login?error=google_auth_failed');
      return;
    }

    handleGoogleToken(token)
      .then((user) => {
        navigate(user.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/student');
      })
      .catch(() => {
        navigate('/login?error=google_auth_failed');
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Completing Google sign-in…</p>
    </div>
  );
};

export default GoogleAuthSuccess;
