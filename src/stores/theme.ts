// src/stores/theme.ts
import { defineStore } from 'pinia'
import apiClient from '@/service/AxiosClient'
import { useAuthStore } from '@/stores/auth'

export interface Theme {
  id: number
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  textSecondaryColor: string
  borderColor: string
  successColor: string
  warningColor: string
  errorColor: string
  isDark: boolean
  isHighContrast: boolean
  isSystemTheme?: boolean
}

export interface UserThemeResponse {
  current: Theme
  presets: Theme[]
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    systemThemes: [] as Theme[],
    currentTheme: null as Theme | null,
    presets: [] as Theme[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    activeTheme: (state) => state.currentTheme || state.systemThemes[0],
    isDarkMode: (state) => state.currentTheme?.isDark || false,
    isHighContrast: (state) => state.currentTheme?.isHighContrast || false,
  },

  actions: {
    async fetchThemes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiClient.get('/api/themes')
        this.systemThemes = response.data
        console.log('Fetched themes:', this.systemThemes)
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch themes'
        console.error('Error fetching themes:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserTheme(userId: number) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiClient.get(`/api/users/${userId}/theme`)
        this.currentTheme = response.data.current
        this.presets = response.data.presets
        this.applyTheme(this.currentTheme!)
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch user theme'
        console.error('Error fetching user theme:', error)
        // Apply default theme if error
        if (this.systemThemes.length > 0) {
          this.applyTheme(this.systemThemes[0])
        }
      } finally {
        this.isLoading = false
      }
    },

    applyTheme(theme: Theme) {
      // Apply CSS variables at runtime
      const root = document.documentElement

      // Set color variables
      root.style.setProperty('--primary', theme.primaryColor)
      root.style.setProperty('--secondary', theme.secondaryColor)
      root.style.setProperty('--background', theme.backgroundColor)
      root.style.setProperty('--surface', theme.surfaceColor)
      root.style.setProperty('--text', theme.textColor)
      root.style.setProperty('--text-secondary', theme.textSecondaryColor)
      root.style.setProperty('--border', theme.borderColor)
      root.style.setProperty('--success', theme.successColor)
      root.style.setProperty('--warning', theme.warningColor)
      root.style.setProperty('--error', theme.errorColor)

      // Toggle dark mode class
      root.classList.toggle('dark', theme.isDark)

      // Toggle high contrast class
      root.classList.toggle('hc', theme.isHighContrast)

      // Update current theme
      this.currentTheme = theme
    },

    async saveCurrent(userId: number) {
      if (!this.currentTheme) return

      this.isLoading = true
      this.error = null
      try {
        await apiClient.put(`/api/users/${userId}/theme`, this.currentTheme)
      } catch (error: any) {
        this.error = error.message || 'Failed to save theme'
        console.error('Error saving theme:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async savePreset(userId: number, theme: Theme) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiClient.post(`/api/users/${userId}/presets`, theme)
        this.presets = response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to save preset'
        console.error('Error saving preset:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async removePreset(userId: number, presetId: number) {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiClient.delete(`/api/users/${userId}/presets/${presetId}`)
        this.presets = response.data
      } catch (error: any) {
        this.error = error.message || 'Failed to remove preset'
        console.error('Error removing preset:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async resetAll(userId: number) {
      this.isLoading = true
      this.error = null
      try {
        await apiClient.post(`/api/users/${userId}/reset-personalization`)
        // Fetch user theme again to get the reset state
        await this.fetchUserTheme(userId)
      } catch (error: any) {
        this.error = error.message || 'Failed to reset personalization'
        console.error('Error resetting personalization:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Initialize theme store
    async initialize() {
      const authStore = useAuthStore()

      // Fetch system themes first
      await this.fetchThemes()

      // If user is logged in, fetch their theme
      if (authStore.currentUserId) {
        await this.fetchUserTheme(authStore.currentUserId)
      } else {
        // Apply default theme for non-logged in users
        if (this.systemThemes.length > 0) {
          this.applyTheme(this.systemThemes[0])
        }
      }
    },
  },
})
