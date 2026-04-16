

import axios from 'axios';

// Use the correct API URL. To override for different environments, set VITE_API_BASE_URL in your .env.development file.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    const requestUrl = error.config?.url || '';
    const isAuthRequest =
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/register') ||
      requestUrl.includes('/api/auth/register-status');

    if (error.response?.status === 401 && token && !isAuthRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  getRegisterStatus: () => api.get('/api/auth/register-status'),
  getProfile: () => api.get('/api/auth/me'),
};

// Sessions API
export const sessionsAPI = {
  create: (sessionData) => api.post('/api/sessions', sessionData),
  list: () => api.get('/api/sessions'),
  getQR: (id) => api.get(`/api/sessions/${id}/qr`),
  close: (id) => api.patch(`/api/sessions/${id}/close`),
};

// Attendance API
export const attendanceAPI = {
  mark: (sessionCode) => api.post('/api/attendance/mark', { sessionCode }),
  report: (sessionId) => api.get(`/api/attendance/report?sessionId=${sessionId}`),
};

// Users API
export const usersAPI = {
  list: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/api/users?${params.toString()}`);
  },
};

export default api;
