import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // change this if deployed
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
