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

export const register = (payload: RegisterPayload) =>
  api.post('/auth/register', payload);

// authService.ts
export const login = (payload: AuthPayload) =>
  api.post('/auth/authenticate', payload);

