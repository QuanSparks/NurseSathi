import api from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.patch('/auth/profile', updates);
  return data;
};
