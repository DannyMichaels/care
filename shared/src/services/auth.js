import api from './apiConfig';
import { getStorage } from './storage';

export const loginUser = async (loginData) => {
  try {
    const resp = await api.post('/auth/login', { authentication: loginData });
    const storage = getStorage();
    await storage.setItem('authToken', resp?.data?.token);
    api.defaults.headers.common.authorization = `Bearer ${resp?.data?.token}`;
    return resp?.data?.user;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (registerData) => {
  try {
    const resp = await api.post('/users/', { user: registerData });
    const storage = getStorage();
    await storage.setItem('authToken', resp.data.token);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`;
    return resp.data.user;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async () => {
  const storage = getStorage();
  const token = await storage.getItem('authToken');
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    try {
      const resp = await api.get('/auth/verify');
      return resp.data;
    } catch (error) {
      throw error;
    }
  }
  return null;
};

export const removeToken = async () => {
  const storage = getStorage();
  await storage.removeItem('authToken');
  api.defaults.headers.common.authorization = null;
};

export const resetPassword = async (email, code, newPassword) => {
  const resp = await api.post('/auth/reset_password', {
    email,
    code,
    new_password: newPassword,
  });
  return resp.data;
};
