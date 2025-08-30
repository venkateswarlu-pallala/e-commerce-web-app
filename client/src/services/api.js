// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://e-commerce-web-app-1-mwiv.onrender.com'; // Your deployed backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to attach token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;