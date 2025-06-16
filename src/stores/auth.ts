import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { User } from '@/types'
import { jwtDecode } from 'jwt-decode'

/* ----------  types ---------- */
type JwtPayload = {
  sub: string // user-id ถูกเก็บที่ subject
  username?: string
  roles?: string[]
  exp: number
}

interface UserInfo {
  id: number
  username: string
  email: string
  firstname: string
  lastname: string
  avatarUrl?: string
  roles: string[]
}

/* ----------  helpers ---------- */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/* ----------  axios instance ---------- */
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/* ----------  Pinia Store ---------- */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    userId: null as number | null,
    roles: [] as string[],
  }),

  getters: {
    currentUserName: (state) => state.user?.username || '',
    authorizationHeader: (state) => (state.token ? `Bearer ${state.token}` : ''),
    currentUserId: (state) => state.userId,
    isAuthenticated: (state) => !!state.token && !isTokenExpired(state.token),
  },

  actions: {
    /* ----- register & login ----- */
    async register(
      email: string,
      password: string,
      username: string,
      firstname: string,
      lastname: string,
    ) {
      const { data } = await apiClient.post('/api/v1/auth/register', {
        email,
        password,
        username,
        firstname,
        lastname,
      })
      await applyToken(this, data.access_token, data.user)
      await this.fetchUserInfo()
      return data
    },

    async login(username: string, password: string) {
      const { data } = await apiClient.post('/api/v1/auth/authenticate', {
        username,
        password,
      })
      if (isTokenExpired(data.access_token)) throw new Error('Token is expired')

      await applyToken(this, data.access_token, data.user)
      await this.fetchUserInfo()
      return data
    },

    /* ----- user info ----- */
    async fetchUserInfo() {
      if (!this.token) return

      try {
        const { data } = await apiClient.get<UserInfo>('/api/users/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        this.user = {
          id: data.id,
          username: data.username,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
          roles: data.roles,
          avatarUrl: data.avatarUrl,
          password: '', // never keep password
        }
        this.userId = data.id
        this.roles = data.roles ?? []

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('userId', String(data.id))
        return data
      } catch (err) {
        console.error('fetchUserInfo failed → fallback decode JWT', err)
        if (this.token) {
          const p = jwtDecode<JwtPayload>(this.token)
          this.userId = Number(p.sub)
          this.roles = p.roles ?? []
        }
      }
    },

    /* ----- avatar helpers ----- */
    setAvatarUrl(avatarUrl: string) {
      if (!this.user) return console.error('No user in store')
      this.user = { ...this.user, avatarUrl }
      try {
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (e) {
        console.error('localStorage update failed', e)
      }
    },

    /** generic updater */
    updateUser(updates: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...updates }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    /** shortcut that AvatarEditor เรียก */
    setAvatar(newAvatarUrl: string) {
      this.setAvatarUrl(newAvatarUrl)
    },

    /* ----- logout / reload ----- */
    logout() {
      this.token = null
      this.user = null
      this.userId = null
      this.roles = []

      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('userId')

      delete axios.defaults.headers.common['Authorization']
      delete apiClient.defaults.headers['Authorization']
    },

    async reload() {
      const stored = localStorage.getItem('access_token')
      if (!stored) return

      if (isTokenExpired(stored)) {
        this.logout()
        return
      }

      // restore token & headers
      this.token = stored
      axios.defaults.headers.common['Authorization'] = this.authorizationHeader
      apiClient.defaults.headers['Authorization'] = this.authorizationHeader

      // quick info from JWT
      const payload = jwtDecode<JwtPayload>(stored)
      this.userId = Number(payload.sub)
      this.roles = payload.roles ?? []

      // restore user if possible
      const userStr = localStorage.getItem('user')
      if (userStr && userStr !== 'undefined') {
        try {
          this.user = JSON.parse(userStr)
          if (this.user?.id) this.userId = this.user.id
        } catch {
          /* ignore */
        }
      }

      if (!this.user || !this.user.email) {
        await this.fetchUserInfo()
      }
    },
  },
})

/* ----------  helper: set token & defaults ---------- */
const applyToken = async (store: any, accessToken: string, user?: User) => {
  const payload = jwtDecode<JwtPayload>(accessToken)

  store.token = accessToken
  store.userId = Number(payload.sub)
  store.roles = payload.roles ?? []
  store.user = user ?? store.user

  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('userId', String(store.userId))
  if (user) localStorage.setItem('user', JSON.stringify(user))

  axios.defaults.headers.common['Authorization'] = store.authorizationHeader
  apiClient.defaults.headers['Authorization'] = store.authorizationHeader
}
