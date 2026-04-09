

import axios from 'axios';

// Use the correct API URL (adjust if your backend is on a different port)
const API_BASE_URL = 'https://qr-attendance-system-n2qn.onrender.com';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Sessions API
export const sessionsAPI = {
  create: (sessionData) => api.post('/sessions', sessionData),
  list: () => api.get('/sessions'),
  getQR: (id) => api.get(`/sessions/${id}/qr`),
  close: (id) => api.patch(`/sessions/${id}/close`),
};

// Attendance API
export const attendanceAPI = {
  mark: (sessionCode) => api.post('/attendance/mark', { sessionCode }),
  report: (sessionId) => api.get(`/attendance/report?sessionId=${sessionId}`),
};

// Users API
export const usersAPI = {
  list: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/users?${params.toString()}`);
  },
};

export default api;