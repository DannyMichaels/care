import api from './apiConfig';

export const sendVerificationCode = async (email) => {
  const resp = await api.post('/email_verifications', { email });
  return resp.data;
};

export const verifyCode = async (email, code) => {
  const resp = await api.post('/email_verifications/verify', { email, code });
  return resp.data;
};
