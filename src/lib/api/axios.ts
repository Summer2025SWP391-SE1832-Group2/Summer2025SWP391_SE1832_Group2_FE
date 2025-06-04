import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

// Base API URL - replace with your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with custom config
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 20000, // 10 seconds
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const { token, isAuthenticated } = useAuthStore.getState();
    if (token && isAuthenticated) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
