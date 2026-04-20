import api from './api';

export const applyToJob = async (jobId, coverLetter = '') => {
  const { data } = await api.post(`/jobs/${jobId}/apply`, { coverLetter });
  return data;
};

export const getMyApplications = async () => {
  const { data } = await api.get('/applications/mine');
  return data;
};

export const getHospitalApplications = async () => {
  const { data } = await api.get('/applications');
  return data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
  return data;
};
