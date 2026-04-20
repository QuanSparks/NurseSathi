import api from './api';

export const fetchJobs = async (params = {}) => {
  const { data } = await api.get('/jobs', { params });
  return data;
};

export const fetchJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

export const postJob = async (payload) => {
  const { data } = await api.post('/jobs', payload);
  return data;
};

export const fetchMyJobs = async () => {
  const { data } = await api.get('/jobs/mine');
  return data;
};

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};
