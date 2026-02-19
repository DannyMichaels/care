import api from './apiConfig';

export const postReport = async (reportData) => {
  const resp = await api.post('/reports', { report: reportData });
  return resp.data;
};

export const getAllReports = async (status) => {
  const params = status ? `?status=${status}` : '';
  const resp = await api.get(`/reports${params}`);
  return resp.data;
};

export const updateReport = async (id, status) => {
  const resp = await api.put(`/reports/${id}`, { status });
  return resp.data;
};

export const removeReportedInsight = async (id) => {
  const resp = await api.delete(`/reports/${id}/remove_insight`);
  return resp.data;
};

export const unhideReportedInsight = async (id) => {
  const resp = await api.patch(`/reports/${id}/unhide_insight`);
  return resp.data;
};
