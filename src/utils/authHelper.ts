import { useAuthStore } from '@/stores/auth'

export interface AuthValidationResult {
  isValid: boolean
  token?: string
  reason?: string
}

/**
 * Comprehensive JWT token validation
 */
export function validateJwtToken(token: string): boolean {
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

  // Try to decode the payload to check if it's valid JSON
  try {
    const payload = JSON.parse(atob(parts[1]))

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('🕐 JWT token is expired')
      return false
    }

    return true
  } catch {
    console.warn('🔍 JWT token payload is not valid JSON')
    return false
  }
}

/**
 * Get current authentication status with detailed validation
 */
export function getAuthStatus(): AuthValidationResult {
  try {
    const auth = useAuthStore()

    if (!auth.isAuthenticated) {
      return {
        isValid: false,
        reason: 'User not authenticated'
      }
    }

    if (!auth.token) {
      return {
        isValid: false,
        reason: 'No token found'
      }
    }

    if (!validateJwtToken(auth.token)) {
      return {
        isValid: false,
        token: auth.token,
        reason: 'Invalid or expired token'
      }
    }

    return {
      isValid: true,
      token: auth.token
    }
  } catch (error) {
    return {
      isValid: false,
      reason: 'Auth store not accessible'
    }
  }
}

/**
 * Handle authentication errors consistently
 */
export function handleAuthError(error: unknown, context: string = 'API call'): void {
  console.error(`🚨 Authentication error in ${context}:`, error)

  const errorObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string }
  const status = errorObj.response?.status
  const message = errorObj.response?.data?.message || errorObj.message

  if (status === 401) {
    console.log('🔄 Token expired or invalid, logging out')
    const auth = useAuthStore()
    auth.logout()

    // Show user-friendly message
    if (typeof window !== 'undefined') {
      window.alert('Your session has expired. Please log in again.')
      window.location.href = '/login'
    }
  } else if (status === 403) {
    console.log('🚫 Access forbidden, check authentication')

    const authStatus = getAuthStatus()
    if (!authStatus.isValid) {
      console.log('🔄 Invalid authentication, redirecting to login')
      if (typeof window !== 'undefined') {
        window.alert('Authentication required. Please log in.')
        window.location.href = '/login'
      }
    }
        } else if (status === 500 && message?.includes('Authentication')) {
    console.log('🔧 Server authentication injection failed')

    const auth = useAuthStore()
    auth.logout()

    if (typeof window !== 'undefined') {
      window.alert('Authentication error occurred. Please log in again.')
      window.location.href = '/login'
    }
  }
}

/**
 * Ensure user is authenticated before making API calls
 */
export function ensureAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    const authStatus = getAuthStatus()

    if (authStatus.isValid) {
      console.log('✅ User is authenticated')
      resolve(true)
    } else {
      console.warn('❌ User is not authenticated:', authStatus.reason)

      if (typeof window !== 'undefined') {
        window.alert('Please log in to continue.')
        window.location.href = '/login'
      }

      resolve(false)
    }
  })
}

/**
 * Get headers with proper authentication
 */
export function getAuthHeaders(): Record<string, string> {
  const authStatus = getAuthStatus()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  if (authStatus.isValid && authStatus.token) {
    headers['Authorization'] = `Bearer ${authStatus.token}`
    console.log('✅ Authorization header added')
  } else {
    console.warn('❌ No valid token for authorization header')
  }

  return headers
}

/**
 * Log authentication status for debugging
 */
export function logAuthStatus(): void {
  const authStatus = getAuthStatus()

  console.log('🔍 Authentication Status Check:')
  console.log('  - Is Valid:', authStatus.isValid)
  console.log('  - Reason:', authStatus.reason || 'Valid authentication')
  console.log('  - Token Preview:', authStatus.token ? authStatus.token.substring(0, 30) + '...' : 'No token')

  if (authStatus.token) {
    try {
      const payload = JSON.parse(atob(authStatus.token.split('.')[1]))
      console.log('  - Token Expires:', new Date(payload.exp * 1000).toISOString())
      console.log('  - Username:', payload.sub || payload.username || 'Unknown')
    } catch {
      console.log('  - Token payload: Invalid format')
    }
  }
}

export default {
  validateJwtToken,
  getAuthStatus,
  handleAuthError,
  ensureAuthenticated,
  getAuthHeaders,
  logAuthStatus
}
