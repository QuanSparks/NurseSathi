import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ns_token'));
  const [loading, setLoading] = useState(true);

  // On mount, verify token and load user
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('ns_token');
      if (storedToken) {
        try {
          const { user: me } = await getMe();
          setUser(me);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('ns_token');
          localStorage.removeItem('ns_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const saveSession = (token, user) => {
    localStorage.setItem('ns_token', token);
    localStorage.setItem('ns_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email, password) => {
    const { token, user } = await loginUser(email, password);
    saveSession(token, user);
    return user;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user } = await registerUser(payload);
    saveSession(token, user);
    return user;
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`;
  }, []);

  // Called after Google OAuth redirect returns ?token=...
  const handleGoogleToken = useCallback(async (googleToken) => {
    localStorage.setItem('ns_token', googleToken);
    setToken(googleToken);
    try {
      const { user: me } = await getMe();
      setUser(me);
      localStorage.setItem('ns_user', JSON.stringify(me));
      return me;
    } catch {
      logout();
      throw new Error('Failed to fetch user after Google login');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ns_token');
    localStorage.removeItem('ns_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ns_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isHospital: user?.role === 'hospital',
        login,
        register,
        loginWithGoogle,
        handleGoogleToken,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
