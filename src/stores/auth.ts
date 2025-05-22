import { defineStore } from 'pinia';
import { login as loginApi, AuthPayload } from '@/service/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
  }),
  actions: {
    async login(creds: AuthPayload) {
      const { data } = await loginApi(creds);
      this.token = data.accessToken;
      localStorage.setItem('token', this.token);
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
    },
  },

});



