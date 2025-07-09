import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://coding-judge-backend-9czr.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
