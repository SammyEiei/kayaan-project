import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

// สร้าง axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  // ไม่ set default Content-Type เพื่อให้ axios จัดการตามชนิดของ data:
  // - object → application/json
  // - FormData → multipart/form-data
});

// Token validation helper
const validateToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    console.error('❌ Invalid token format:', token);
    return false;
  }

  try {
    // ตรวจสอบว่าเป็น valid JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Invalid JWT format - expected 3 parts, got:', parts.length);
      return false;
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    const expiration = new Date(payload.exp * 1000);

    if (expiration < new Date()) {
      console.warn('⚠️ Token expired, removing from storage');
      localStorage.removeItem('access_token');
      return false;
    }

    console.log('✅ Token is valid and not expired');
    return true;
  } catch (error) {
    console.error('❌ Token validation failed:', error);
    localStorage.removeItem('access_token');
    return false;
  }
};

// Request interceptor - เพิ่ม JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('🚀 ========== REQUEST INTERCEPTOR START ==========');
    console.log('🔍 Request URL:', config.url);
    console.log('🔍 Request method:', config.method?.toUpperCase());

    let tokenAdded = false;

    // ลำดับความสำคัญ: localStorage ก่อน (เพื่อไม่พึ่ง Pinia store)
    // 1. Try localStorage first (most reliable)
    const localStorageToken = localStorage.getItem('access_token');
    console.log('🔍 localStorage token:', localStorageToken ? `EXISTS (${localStorageToken.substring(0, 30)}...)` : 'NOT FOUND');

    if (localStorageToken) {
      const isValid = validateToken(localStorageToken);
      console.log('🔍 Token validation result:', isValid);

      if (isValid && config.headers) {
        config.headers.Authorization = `Bearer ${localStorageToken}`;
        console.log('✅ Authorization header SET (from localStorage)');
        console.log('🔑 Header value:', config.headers.Authorization.substring(0, 50) + '...');
        tokenAdded = true;
      }
    }

    // 2. Fallback to auth store if localStorage doesn't have token
    if (!tokenAdded) {
      console.log('⚠️ Trying auth store...');
      try {
        const authStore = useAuthStore();
        console.log('🔍 Auth store token:', authStore.token ? 'EXISTS' : 'NOT FOUND');

        if (authStore.token && validateToken(authStore.token)) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
            console.log('✅ Authorization header SET (from auth store)');
            tokenAdded = true;
          }
        } else {
          console.log('❌ No valid token in auth store');
        }
      } catch (error) {
        console.log('❌ Auth store not available:', error);
      }
    }

    if (!tokenAdded) {
      console.log('🚨 WARNING: No token added to request!');
    }

    console.log('🔍 Final Authorization header:', config.headers?.Authorization ? 'SET ✅' : 'NOT SET ❌');
    console.log('🏁 ========== REQUEST INTERCEPTOR END ==========');

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - จัดการ authentication errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.statusText, error.config?.url);
    console.error('❌ Error details:', error.response?.data);

    // เพิ่ม user-friendly error message
    if (error.response?.status === 400) {
      // Business logic error - แสดง error message จาก backend
      const message = error.response.data?.message || 'Invalid request';
      error.userMessage = message;
      console.log('⚠️ 400 Bad Request - Business logic error:', message);
      console.log('🔍 Setting userMessage on error object:', message);
      console.log('🔍 Error object after setting userMessage:', error);
    } else if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Logging out user');
      error.userMessage = 'Authentication failed. Please login again.';
      try {
        const authStore = useAuthStore();
        authStore.logout();
      } catch (storeError) {
        // Fallback to localStorage clear
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
      }

      // Redirect to login if not already there
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
    } else if (error.response?.status === 403) {
      console.log('🚫 403 Forbidden - Access denied');
      error.userMessage = 'Access denied. Please check your permissions or login again.';

      // Check if it's an authentication issue
      if (error.response?.data?.message?.includes('JWT') ||
          error.response?.data?.message?.includes('token') ||
          error.response?.data?.message?.includes('authentication')) {
        error.userMessage = 'Authentication failed. Please login again.';
        try {
          const authStore = useAuthStore();
          authStore.logout();
        } catch (storeError) {
          localStorage.removeItem('access_token');
        }
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      }
    } else if (error.response?.status === 404) {
      console.log('🔍 404 Not Found - Resource not found');
      error.userMessage = 'Resource not found. Please check your request.';
    } else if (error.response?.status === 500) {
      console.log('💥 500 Internal Server Error - Backend issue');
      error.userMessage = 'Server error. Please try again later.';
    } else {
      // Generic error message
      error.userMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
    }

    return Promise.reject(error);
  }
);

export default api;


