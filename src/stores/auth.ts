import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { User } from '@/types'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  sub: string // user id stored as subject
  roles?: string[]
  exp: number
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token)
    const exp = decoded.exp
    return exp * 1000 < Date.now()
  } catch {
    return true
  }
}

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
    user: null as User | null, // keep for now (e.g. username display)
    userId: null as number | null,
    roles: [] as string[],
  }),
  getters: {
    currentUserName(state): string {
      return state.user?.username || ''
    },
    authorizationHeader(state): string {
      return state.token ? `Bearer ${state.token}` : ''
    },
    currentUserId(state): number | null {
      return state.userId
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
        .then(({ data }) => {
          applyToken(this, data.access_token, data.user)
          return data
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
        .then(({ data }) => {
          const token = data.access_token
          if (isTokenExpired(token)) throw new Error('Token is expired')
          applyToken(this, token, data.user)
          return data
        })
        .catch((error) => {
          throw error
        })
    },
    logout() {
      this.token = null
      this.user = null
      this.userId = null
      this.roles = []
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
    reload() {
      const stored = localStorage.getItem('access_token')
      if (!stored) return // ไม่ได้ login

      if (isTokenExpired(stored)) {
        return this.logout()
      }

      // decode and restore id/roles
      const { sub, roles } = jwtDecode<JwtPayload>(stored)
      this.token = stored
      this.userId = Number(sub)
      this.roles = roles ?? []

      axios.defaults.headers.common['Authorization'] = this.authorizationHeader

      // optional: restore user (ไม่บังคับ)
      const userStr = localStorage.getItem('user')
      if (userStr && userStr !== 'undefined') {
        try {
          this.user = JSON.parse(userStr)
        } catch {
          /* ignore */
        }
      }
    },
  },
})

const applyToken = (store: any, accessToken: string, user?: User) => {
  const payload = jwtDecode<JwtPayload>(accessToken)
  store.token = accessToken
  store.userId = Number(payload.sub)
  store.roles = payload.roles ?? []
  store.user = user ?? null

  localStorage.setItem('access_token', accessToken)
  if (user) localStorage.setItem('user', JSON.stringify(user))

  axios.defaults.headers.common['Authorization'] = store.authorizationHeader
}
