import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Main API client with interceptors
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth?.token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${auth.token}`
  }
  return config
})

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      // Redirect to login if needed
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Plain fetch for signed URL uploads (no credentials, only content-type)
export async function plainFetch(url: string, init: RequestInit) {
  return fetch(url, init)
}
