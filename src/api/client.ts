import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  demoMode,
  demoSajuAnalyze, demoGwansangAnalyze,
  demoGetSajuHistory, demoGetGwansangHistory,
} from './demo';

const BASE_URL = 'http://localhost:4000/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          await AsyncStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(original);
        } catch {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    client.post('/auth/register', { email, password, name }),
  refresh: (refreshToken: string) =>
    client.post('/auth/refresh', { refreshToken }),
};

export const sajuApi = {
  analyze: (data: { birthDate: string; birthTime: string; gender: string }) =>
    demoMode ? demoSajuAnalyze() as any : client.post('/saju/analyze', data),
  getHistory: () =>
    demoMode ? demoGetSajuHistory() as any : client.get('/saju/history'),
};

export const gwansangApi = {
  analyze: (formData: FormData) =>
    demoMode ? demoGwansangAnalyze() as any : client.post('/gwansang/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: () =>
    demoMode ? demoGetGwansangHistory() as any : client.get('/gwansang/history'),
};

export default client;
