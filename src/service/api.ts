import axios from 'axios'
import { useAuthStore } from '../stores/auth'

/**
 * Axios instance used across the app. The base URL comes from the
 * `VITE_BACKEND_URL` env variable to match the rest of the codebase.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json', // ไม่ตั้ง Content-Type เป็น default
  },
})

// Helper function to validate JWT token
function isValidJwtToken(token: string): boolean {
  if (!token || token.trim() === '') {
    return false
  }

  // Check if token has the correct JWT format (3 parts separated by dots)
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }

  // Check if all parts are not empty
  if (parts.some(part => part.trim() === '')) {
    return false
  }

  return true
}

api.interceptors.request.use((cfg) => {
  console.log('🚀 API Request:', cfg.method?.toUpperCase(), cfg.url)
  console.log('🔧 Full URL:', (cfg.baseURL || '') + (cfg.url || ''))

  const auth = useAuthStore()
  console.log('🔍 Auth store token:', auth?.token ? 'EXISTS' : 'NOT FOUND')

  if (auth?.token && isValidJwtToken(auth.token)) {
    cfg.headers = cfg.headers ?? {}
    cfg.headers.Authorization = `Bearer ${auth.token}`
    console.log('✅ Authorization header added (valid JWT)')
    console.log('🔑 Token preview:', auth.token.substring(0, 20) + '...')
  } else {
    // Remove Authorization header if token is invalid
    delete cfg.headers.Authorization
    console.log('❌ No valid auth token found')
  }

  // สำคัญ: ถ้าเป็น FormData ให้ลบ Content-Type ออก
  if (cfg.data instanceof FormData) {
    delete cfg.headers['Content-Type']
    console.log('🗑️ Removed Content-Type for FormData')
  } else {
    cfg.headers['Content-Type'] = 'application/json'
    console.log('📝 Set Content-Type to application/json')
  }

  // Log all headers for debugging
  console.log('📋 Request headers:', cfg.headers)

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

export default api
