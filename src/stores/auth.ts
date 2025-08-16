import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { User } from '../types'
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
  avatarRotation?: number
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
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json', // ไม่ตั้ง Content-Type เป็น default
  },
})

// Helper function to build full URL
function buildFullUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined

  // If already absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Build full URL
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

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
    currentUserAvatar: (state) => buildFullUrl(state.user?.avatarUrl),
    // Add debug getter
    debugToken: (state) => {
      console.log('🔍 Auth Store Debug - Token:', state.token ? 'EXISTS' : 'NOT FOUND')
      console.log('🔍 Auth Store Debug - User:', state.user)
      console.log('🔍 Auth Store Debug - UserId:', state.userId)
      if (state.token) {
        console.log('🔑 Token preview:', state.token.substring(0, 20) + '...')
        console.log('📅 Token length:', state.token.length)
        console.log('✅ Is valid JWT:', state.token.split('.').length === 3)
      }
      return state.token
    }
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

      // Apply token and user info
      await applyToken(this, data.access_token, data.user)

      // If no user info from response, fetch it
      if (!data.user) {
        await this.fetchUserInfo()
      }

      return data
    },

    async login(username: string, password: string) {
      const { data } = await apiClient.post('/api/v1/auth/authenticate', {
        username,
        password,
      })

      if (isTokenExpired(data.access_token)) throw new Error('Token is expired')

      // Apply token and user info
      await applyToken(this, data.access_token, data.user)

      // If no user info from response, fetch it
      if (!data.user) {
        await this.fetchUserInfo()
      }

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
          avatarRotation: data.avatarRotation,
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
    setAvatarUrl(avatarUrl: string, rotation?: number) {
      if (!this.user) return console.error('No user in store')

      this.user = {
        ...this.user,
        avatarUrl,
        avatarRotation: rotation ?? this.user.avatarRotation ?? 0,
      }

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
    setAvatar(newAvatarUrl: string, rotation?: number) {
      this.setAvatarUrl(newAvatarUrl, rotation)
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

    async initialize() {
      console.log('🔍 Auth store initialization started')
      const stored = localStorage.getItem('access_token')
      console.log('🔍 Stored token:', stored ? 'EXISTS' : 'NOT FOUND')
      console.log('🔍 Token value:', stored?.substring(0, 50) + '...')

      if (!stored) {
        console.log('🔍 No stored token found')
        return
      }

      if (isTokenExpired(stored)) {
        console.log('🔍 Token expired, logging out')
        this.logout()
        return
      }

      console.log('🔍 Token is valid, restoring...')
      // restore token & headers
      this.token = stored
      axios.defaults.headers.common['Authorization'] = this.authorizationHeader
      apiClient.defaults.headers['Authorization'] = this.authorizationHeader

      // Also set the Authorization header for the apiClient instance used by ThemeService
      if (apiClient.defaults.headers) {
        apiClient.defaults.headers['Authorization'] = this.authorizationHeader
      }

      // quick info from JWT
      try {
        const payload = jwtDecode<JwtPayload>(stored)
        this.userId = Number(payload.sub)
        this.roles = payload.roles ?? []
        console.log('🔍 JWT payload decoded:', { userId: this.userId, roles: this.roles })
      } catch (error) {
        console.error('Failed to decode JWT token:', error)
        this.logout()
        return
      }

      // restore user if possible
      const userStr = localStorage.getItem('user')
      if (userStr && userStr !== 'undefined') {
        try {
          this.user = JSON.parse(userStr)
          if (this.user?.id) this.userId = this.user.id
          console.log('🔍 User restored from localStorage:', this.user)
        } catch {
          console.log('🔍 Failed to parse user from localStorage')
        }
      }

      // Always fetch fresh user info to get latest avatar
      console.log('🔍 Fetching fresh user info...')
      await this.fetchUserInfo()
      console.log('🔍 Auth store initialization completed')
      console.log('🔍 Final auth state:', {
        token: !!this.token,
        userId: this.userId,
        user: this.user
      })
    },
  },
})

/* ----------  helper: set token & defaults ---------- */
const applyToken = async (store: ReturnType<typeof useAuthStore>, accessToken: string, userInfo?: User) => {
  try {
    // Validate JWT token format
    const parts = accessToken.split('.')
    if (parts.length !== 3 || parts.some(part => part.trim() === '')) {
      throw new Error('Invalid JWT token format')
    }

    const payload = jwtDecode<JwtPayload>(accessToken)

    store.token = accessToken
    store.userId = Number(payload.sub)
    store.roles = payload.roles ?? []

    // If userInfo provided from backend, use it
    if (userInfo) {
      store.user = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        roles: userInfo.roles || store.roles,
        avatarUrl: userInfo.avatarUrl,
        avatarRotation: userInfo.avatarRotation,
        password: '',
      }
    }

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('userId', String(store.userId))
    if (store.user) {
      localStorage.setItem('user', JSON.stringify(store.user))
    }

    axios.defaults.headers.common['Authorization'] = store.authorizationHeader
    apiClient.defaults.headers['Authorization'] = store.authorizationHeader

    // Also set the Authorization header for the apiClient instance used by ThemeService
    if (apiClient.defaults.headers) {
      apiClient.defaults.headers['Authorization'] = store.authorizationHeader
    }
  } catch (error) {
    console.error('Failed to apply token:', error)
    // Clear any invalid token data
    store.token = null
    store.user = null
    store.userId = null
    store.roles = []
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    throw error
  }
}
