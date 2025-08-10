import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
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
  const token = localStorage.getItem('access_token')
  if (isValidJwtToken(token || '')) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    // Remove Authorization header if token is invalid
    delete config.headers.Authorization
  }
  return config
})

export default apiClient
