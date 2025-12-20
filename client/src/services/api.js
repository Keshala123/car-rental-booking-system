/**
 * API Service
 * Centralized API calls using Axios
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for logging (development)
api.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔵 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`🟢 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API ENDPOINTS
// ============================================

/**
 * User signup
 */
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * User login
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user bookings
 */
export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings');
    // Backend returns { success, count, data }
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// CAR API ENDPOINTS
// ============================================

/**
 * Get all cars with optional filters
 */
export const getCars = async (filters = {}) => {
  try {
    const response = await api.get('/cars', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single car by ID
 */
export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// BOOKING API ENDPOINTS
// ============================================

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all bookings (with optional filters)
 */
export const getBookings = async (filters = {}) => {
  try {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// CONTACT API ENDPOINTS
// ============================================

/**
 * Submit contact form
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get(API_BASE_URL.replace('/api', ''));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
