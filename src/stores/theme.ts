// src/stores/theme.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '../stores/auth'
import {
  getPredefinedThemes,
  getUserTheme,
  saveUserTheme,
  createUserPreset,
  deleteUserPreset,
  resetPersonalization,
  predefinedThemes,
  type Theme,
  type ThemeDto,
} from '../service/ThemeService'

export const useThemeStore = defineStore('theme', {
  state: () => {
    console.log('Initializing theme store with predefined themes:', predefinedThemes.length)
    return {
      systemThemes: predefinedThemes as Theme[],
      currentTheme: null as Theme | null,
      presets: [] as Theme[],
      isLoading: false,
      error: null as string | null,
    }
  },

  getters: {
    activeTheme: (state) => state.currentTheme || state.systemThemes[0],
    isDarkMode: (state) => state.currentTheme?.isDark || false,
    // Get themes by category
    lightThemes: (state) => {
      const themes = state.systemThemes.filter(theme => !theme.isDark)
      console.log('Light themes count:', themes.length, 'from total:', state.systemThemes.length)
      return themes
    },
    darkThemes: (state) => {
      const themes = state.systemThemes.filter(theme => theme.isDark)
      console.log('Dark themes count:', themes.length, 'from total:', state.systemThemes.length)
      return themes
    },
    // Get popular themes (first 6)
    popularThemes: (state) => {
      const themes = state.systemThemes.slice(0, 6)
      console.log('Popular themes count:', themes.length, 'from total:', state.systemThemes.length)
      return themes
    },
  },

  actions: {
    async fetchThemes() {
      this.isLoading = true
      this.error = null
      try {
        // Backend doesn't have predefined themes API, so use local themes directly
        this.systemThemes = predefinedThemes
        console.log('Using local predefined themes:', this.systemThemes.length, 'themes available')
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.warn('Failed to load predefined themes:', errorMessage)
        // Keep predefined themes if error
        this.systemThemes = predefinedThemes
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserTheme(userId: number) {
      this.isLoading = true
      this.error = null
      try {
        const userThemeData = await getUserTheme(userId)
        this.currentTheme = userThemeData.current
        this.presets = userThemeData.presets
        this.applyTheme(this.currentTheme!)
      } catch (error: unknown) {
        // This should not happen now since getUserTheme handles all errors
        console.warn('Unexpected error in fetchUserTheme:', error)
        this.applyTheme(predefinedThemes[0])
      } finally {
        this.isLoading = false
      }
    },

    applyTheme(theme: Theme) {
      // Apply CSS variables at runtime
      const root = document.documentElement

      // Set color variables
      root.style.setProperty('--primary', theme.colors.primary)
      root.style.setProperty('--secondary', theme.colors.secondary)
      root.style.setProperty('--background', theme.colors.background)
      root.style.setProperty('--surface', theme.colors.surface)
      root.style.setProperty('--text', theme.colors.text)
      root.style.setProperty('--text-secondary', theme.colors.textSecondary)
      root.style.setProperty('--border', theme.colors.border)
      root.style.setProperty('--success', theme.colors.success)
      root.style.setProperty('--warning', theme.colors.warning)
      root.style.setProperty('--error', theme.colors.error)

      // Toggle dark mode class
      root.classList.toggle('dark', theme.isDark)

      // Update current theme
      this.currentTheme = theme
    },

    async saveCurrent(userId: number) {
      if (!this.currentTheme) return

      this.isLoading = true
      this.error = null
      try {
        await saveUserTheme(userId, this.currentTheme)
      } catch (error: unknown) {
        // Check if it's an authentication error
        const axiosError = error as { response?: { status?: number } }
        if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
          this.error = 'Authentication required. Theme saved locally only.'
          console.warn('Authentication required for theme saving')
          // Don't throw error for auth issues
          return
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to save theme'
        this.error = errorMessage
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
        const updatedPresets = await createUserPreset(userId, theme)
        this.presets = updatedPresets
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save preset'
        this.error = errorMessage
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
        const updatedPresets = await deleteUserPreset(userId, presetId)
        this.presets = updatedPresets
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove preset'
        this.error = errorMessage
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
        await resetPersonalization(userId)
        // Fetch user theme again to get the reset state
        await this.fetchUserTheme(userId)
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to reset personalization'
        this.error = errorMessage
        console.error('Error resetting personalization:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Get theme by name
    getThemeByName(name: string): Theme | undefined {
      return this.systemThemes.find(theme => theme.name === name)
    },

    // Get theme by ID
    getThemeById(id: number): Theme | undefined {
      return this.systemThemes.find(theme => theme.id === id)
    },

    // Get random theme
    getRandomTheme(): Theme {
      const randomIndex = Math.floor(Math.random() * this.systemThemes.length)
      return this.systemThemes[randomIndex]
    },

    // Get themes by color family
    getThemesByColorFamily(family: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray' | 'dark'): Theme[] {
      const colorMap = {
        blue: ['Ocean', 'Cyan'],
        green: ['Forest', 'Emerald'],
        purple: ['Violet', 'Midnight'],
        orange: ['Sunset', 'Amber'],
        pink: ['Rose', 'Pastel'],
        gray: ['Slate', 'Monochrome'],
        dark: ['Dark', 'Midnight', 'Neon'],
      }

      const themeNames = colorMap[family] || []
      return this.systemThemes.filter(theme => themeNames.includes(theme.name))
    },

    // Initialize theme store
    async initialize() {
      const authStore = useAuthStore()

      // Load local predefined themes (backend doesn't have this endpoint)
      await this.fetchThemes()

      // Ensure we have themes available
      if (this.systemThemes.length === 0) {
        console.warn('No themes available, using fallback')
        this.systemThemes = predefinedThemes
      }

      // Check if user is authenticated and has valid token
      if (authStore.currentUserId && authStore.isAuthenticated && authStore.token) {
        try {
          await this.fetchUserTheme(authStore.currentUserId)
        } catch (error) {
          console.info('Failed to fetch user theme during initialization, using default theme')
          // Continue with default theme
          this.applyTheme(this.systemThemes[0])
        }
      } else {
        console.info('User not authenticated, using default theme')
        // Apply default theme for non-logged in users
        this.applyTheme(this.systemThemes[0])
      }
    },
  },
})
