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

export const register = (payload: RegisterPayload) => api.post('/api/v1/auth/register', payload)

// authService.ts
export const login = (payload: AuthPayload) => api.post('/api/v1/auth/authenticate', payload)
