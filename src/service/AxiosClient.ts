import axios from "axios";
import { useAuthStore } from '../stores/auth'

// เก็บ VITE_BACKEND_URL เอาไว้แล้วเช็คว่ามี /api อยู่แล้วหรือไม่
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
const baseURL = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json', // ไม่ตั้ง Content-Type เป็น default
  }
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

// Add request interceptor to include authentication token
apiClient.interceptors.request.use((config) => {
  console.log('🚀 AxiosClient Request:', config.method?.toUpperCase(), config.url)
  console.log('🔧 Full URL:', (config.baseURL || '') + (config.url || ''))
  console.log('🔧 Base URL from config:', config.baseURL)
  console.log('🔧 Relative URL:', config.url)

  // Try to get token from auth store first
  let token: string | null = null
  try {
    const auth = useAuthStore()
    token = auth.token
    console.log('🔍 Auth store token:', token ? 'EXISTS' : 'NOT FOUND')
    console.log('🔍 Auth store isAuthenticated:', auth.isAuthenticated)
  } catch {
    console.log('❌ Could not access auth store, falling back to localStorage')
    // Fallback to localStorage if auth store is not available
    token = localStorage.getItem('access_token')
  }

  if (token && isValidJwtToken(token)) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
    console.log('✅ Authorization header added (valid JWT)')
    console.log('🔑 Token preview:', token.substring(0, 30) + '...')
    // console.log('🔑 Full Token:', token);
  } else {
    // Remove Authorization header if token is invalid
    delete config.headers.Authorization
    console.log('❌ No valid auth token found')
    console.log('❌ Token value check:', token ? 'EXISTS but INVALID' : 'NULL/UNDEFINED')
    if (token) {
      console.log('❌ Token format check:', token.split('.').length === 3 ? 'Valid JWT format' : 'Invalid JWT format')
    }
  }

  // สำคัญ: ถ้าเป็น FormData ให้ลบ Content-Type ออก
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
    console.log('🗑️ Removed Content-Type for FormData')
  } else {
    config.headers['Content-Type'] = 'application/json'
    console.log('📝 Set Content-Type to application/json')
  }

  // Log all headers for debugging
  console.log('📋 Request headers:', config.headers)

  return config
})

// Response interceptor: handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('❌ AxiosClient Error:', error.response?.status, error.response?.statusText)
    console.log('🔍 Error URL:', error.config?.url)
    console.log('📋 Response headers:', error.response?.headers)
    console.log('📄 Response data:', error.response?.data)

    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - logging out')
      try {
        const auth = useAuthStore()
        auth.logout()
        // Redirect to login if needed
        window.location.href = '/login'
      } catch (e) {
        console.error('Failed to logout:', e)
      }
    } else if (error.response?.status === 403) {
      console.log('🚨 403 Forbidden - check authorization')
    }
    return Promise.reject(error)
  }
)

export default apiClient
