import axios from 'axios';
import { getStorage } from './storage';

let baseUrl = 'http://localhost:3000';

export const setBaseUrl = (url) => {
  baseUrl = url;
  api.defaults.baseURL = url;
};

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(async (config) => {
  try {
    const storage = getStorage();
    const token = await storage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Storage not initialized yet — skip auth header
  }
  return config;
});

export default api;
