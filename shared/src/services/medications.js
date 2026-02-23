import api from './apiConfig';

export const getRXGuideMeds = async () => {
  const resp = await api.get('/medications/rx_guide');
  return resp.data;
};

export const getAllMeds = async () => {
  try {
    const resp = await api.get('/medications');
    return resp?.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardMeds = async (date) => {
  const utc_offset = new Date().getTimezoneOffset();
  const resp = await api.get('/medications/dashboard', { params: { date, utc_offset } });
  return resp.data;
};

export const getOneMed = async (id) => {
  const resp = await api.get(`/medications/${id}`);
  return resp.data;
};

export const postMed = async (medData) => {
  const resp = await api.post('/medications', { medication: medData });
  return resp.data;
};

export const putMed = async (id, medData, options = {}) => {
  const resp = await api.put(`/medications/${id}`, { medication: medData, ...options });
  return resp.data;
};

export const destroyMed = async (id) => {
  const resp = await api.delete(`/medications/${id}`);
  return resp;
};

export const getOccurrences = async (medId, from, to) => {
  const resp = await api.get(`/medications/${medId}/occurrences`, { params: { from, to } });
  return resp.data;
};

export const getBatchOccurrences = async (from, to) => {
  const resp = await api.get('/medication_occurrences', { params: { from, to } });
  return resp.data;
};

export const createOccurrence = async (medId, data) => {
  const resp = await api.post(`/medications/${medId}/occurrences`, data);
  return resp.data;
};

export const updateOccurrence = async (medId, occId, data) => {
  const resp = await api.put(`/medications/${medId}/occurrences/${occId}`, data);
  return resp.data;
};

export const deleteOccurrence = async (medId, occId) => {
  const resp = await api.delete(`/medications/${medId}/occurrences/${occId}`);
  return resp;
};

