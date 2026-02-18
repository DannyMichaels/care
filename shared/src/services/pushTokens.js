import api from './apiConfig';

export const registerPushToken = async (token, platform) => {
  const resp = await api.post('/push_tokens', { token, platform });
  return resp.data;
};

export const removePushToken = async (id) => {
  const resp = await api.delete(`/push_tokens/${id}`);
  return resp;
};
