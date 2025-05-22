import api from './api';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface AuthPayload {
  username: string;
  password: string;
}

export function register(payload: RegisterPayload) {
  return api.post('/auth/register', payload);
}

// authService.ts
export function login(payload: AuthPayload) {
  return api.post<{ accessToken: string }>('/auth/authenticate', payload);
}

