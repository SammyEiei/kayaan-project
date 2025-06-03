import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { User } from '@/types'

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    currentUserName(): string {
      return this.user?.username || ''
    },
    authorizationHeader(): string {
      return `Bearer ${this.token}`
    },
  },
  actions: {
    register(
      email: string,
      password: string,
      username: string,
      firstname: string,
      lastname: string,
    ) {
      return apiClient
        .post('/api/v1/auth/register', {
          email: email,
          password: password,
          username: username,
          firstname: firstname,
          lastname: lastname,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.user
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('access_token', this.token as string)
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          return response
        })
        .catch((error) => {
          throw error
        })
    },
    login(username: string, password: string) {
      return apiClient
        .post('/api/v1/auth/authenticate', {
          username: username,
          password: password,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.user
          localStorage.setItem('access_token', this.token as string)
          localStorage.setItem('user', JSON.stringify(this.user))
          return response
        })
        .catch((error) => {
          throw error
        })
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
    reload() {
      // โหลดข้อมูลจาก Local Storage ถ้ามี
      const token = localStorage.getItem('access_token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },
  },
})
