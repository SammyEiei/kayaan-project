import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Main API client with interceptors
const baseURL = 'http://localhost:8080/api'
console.log('🔧 API baseURL:', baseURL)

// Helper function to check token in localStorage
function checkLocalStorageToken() {
  const token = localStorage.getItem('access_token')
  if (token) {
    const parts = token.split('.')
    console.log('🔍 localStorage token:', parts.length === 3 ? 'VALID JWT' : 'INVALID FORMAT')
    console.log('🔑 Token preview:', token.substring(0, 20) + '...')
    return token
  } else {
    console.log('❌ No token in localStorage')
    return null
  }
}

// Check token on startup
checkLocalStorageToken()

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_UPLOAD_URL || 'http://localhost:8080/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json', // ห้ามตั้ง Content-Type ทิ้งไว้เป็น default
  },
})

function isValidJwt(t?: string | null) {
  return !!t && t.split('.').length === 3 && t.indexOf(' ') < 0
}

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access_token')
  if (isValidJwt(token)) {
    cfg.headers.Authorization = `Bearer ${token}`
  }

  // สำคัญ: ถ้าเป็น FormData ให้ลบ Content-Type ออก
  if (cfg.data instanceof FormData) {
    delete (cfg.headers as any)['Content-Type']
  } else {
    (cfg.headers as any)['Content-Type'] = 'application/json'
  }

  return cfg
})

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.response?.statusText)
    console.log('🔍 Error URL:', error.config?.url)
    console.log('📋 Response headers:', error.response?.headers)
    console.log('📄 Response data:', error.response?.data)

    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - logging out')
      const auth = useAuthStore()
      auth.logout()
      // Redirect to login if needed
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.log('🚨 403 Forbidden - check authorization')
    }
    return Promise.reject(error)
  }
)


