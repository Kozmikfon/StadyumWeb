
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5275/api', // ✅ API adresini senin backend'e göre ayarla
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT token ekleme (opsiyonel)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
