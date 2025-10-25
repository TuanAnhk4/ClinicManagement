import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL của API Server NestJS
});

// Tự động đính kèm token vào mỗi yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;