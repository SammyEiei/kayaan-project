import { defineStore } from 'pinia';
import { login as loginApi, AuthPayload } from '@/service/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token')
  }),
  actions: {
    async login(creds) {
      try{
        const { data } = await login(creds);
        this.token = data.accessToken;
        localStorage.setItem('token', this.token);
        return true;
      } catch{
        return false;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
    },
  },

});



