import api from './api'

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}
export interface AuthPayload {
  email: string // rename from username -> email
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  resetCode: string
  newPassword: string
}

export const register = (payload: RegisterPayload) => api.post('/api/v1/auth/register', payload)

// authService.ts
export const login = (payload: AuthPayload) => api.post('/api/v1/auth/authenticate', payload)

// Password Reset APIs
export const forgotPassword = (payload: ForgotPasswordPayload) => api.post('/api/auth/forgot-password', payload)

export const resetPassword = (payload: ResetPasswordPayload) => api.post('/api/auth/reset-password', payload)
