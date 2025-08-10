import axios from 'axios'

/**
 * Axios instance used across the app. The base URL comes from the
 * `VITE_BACKEND_URL` env variable to match the rest of the codebase.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
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
  const token = localStorage.getItem('access_token')
  if (isValidJwtToken(token || '')) {
    cfg.headers.Authorization = `Bearer ${token}`
  } else {
    // Remove Authorization header if token is invalid
    delete cfg.headers.Authorization
  }
  return cfg
})

export default api
