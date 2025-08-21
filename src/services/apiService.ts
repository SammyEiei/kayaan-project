import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_TIMEOUT = 30000 // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore()

      try {
        // Try to refresh token
        await authStore.refreshToken()

        // Retry original request with new token
        const token = authStore.token
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

// Generic API methods
export const apiService = {
  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // File upload
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Error handling
  handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 400:
          return new Error(data?.message || 'Bad Request')
        case 401:
          return new Error('Unauthorized - Please login again')
        case 403:
          return new Error('Forbidden - You don\'t have permission')
        case 404:
          return new Error('Resource not found')
        case 409:
          return new Error(data?.message || 'Conflict - Resource already exists')
        case 422:
          return new Error(data?.message || 'Validation failed')
        case 429:
          return new Error('Too many requests - Please try again later')
        case 500:
          return new Error('Internal server error - Please try again later')
        default:
          return new Error(data?.message || `Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from server - Please check your connection')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  },

  // Utility methods
  isNetworkError(error: any): boolean {
    return !error.response && error.request
  },

  isAuthError(error: any): boolean {
    return error.response?.status === 401 || error.response?.status === 403
  },

  isValidationError(error: any): boolean {
    return error.response?.status === 422
  },

  getValidationErrors(error: any): Record<string, string[]> {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      return error.response.data.errors
    }
    return {}
  },
}

// Export axios instance for direct use if needed
export { apiClient }

// Export default apiService
export default apiService





