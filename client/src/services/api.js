import axios from 'axios';

// This line is correct. It will try to use the environment variable first.
// If REACT_APP_API_URL is not set (e.g., during local development without a .env file),
// it will fall back to 'http://localhost:5000/api'.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;