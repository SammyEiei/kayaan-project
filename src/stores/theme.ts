// src/stores/theme.ts
import { defineStore } from 'pinia'
import { useAuthStore } from '../stores/auth'
import {
  predefinedThemes,
  getUserTheme,
  saveUserTheme,
  createUserPreset,
  deleteUserPreset,
  resetPersonalization,
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
    activeTheme: (state) => {
      try {
        return state.currentTheme || state.systemThemes[0] || predefinedThemes[0]
      } catch (error) {
        console.error('Error getting active theme:', error)
        return predefinedThemes[0]
      }
    },
    isDarkMode: (state) => {
      try {
        return state.currentTheme?.isDark || false
      } catch (error) {
        console.error('Error getting dark mode:', error)
        return false
      }
    },
    // Get themes by category
    lightThemes: (state) => {
      try {
        if (!state.systemThemes || state.systemThemes.length === 0) {
          return predefinedThemes.filter(theme => !theme.isDark)
        }
        const themes = state.systemThemes.filter(theme => theme && !theme.isDark)
        return themes
      } catch (error) {
        console.error('Error getting light themes:', error)
        return predefinedThemes.filter(theme => !theme.isDark)
      }
    },
    darkThemes: (state) => {
      try {
        if (!state.systemThemes || state.systemThemes.length === 0) {
          return predefinedThemes.filter(theme => theme.isDark)
        }
        const themes = state.systemThemes.filter(theme => theme && theme.isDark)
        return themes
      } catch (error) {
        console.error('Error getting dark themes:', error)
        return predefinedThemes.filter(theme => theme.isDark)
      }
    },
    // Get popular themes (first 6)
    popularThemes: (state) => {
      try {
        if (!state.systemThemes || state.systemThemes.length === 0) {
          return predefinedThemes.slice(0, 6)
        }
        const themes = state.systemThemes.slice(0, 6)
        return themes
      } catch (error) {
        console.error('Error getting popular themes:', error)
        return predefinedThemes.slice(0, 6)
      }
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
      try {
        // Validate theme object
        if (!theme || !theme.colors) {
          console.error('Invalid theme provided to applyTheme:', theme)
          return
        }

        // Apply CSS variables at runtime
        const root = document.documentElement

        // Default colors as fallback
        const defaultColors = {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }

        // Set color variables with fallback
        Object.entries(theme.colors).forEach(([key, value]) => {
          const colorValue = value || defaultColors[key as keyof typeof defaultColors] || '#000000'
          root.style.setProperty(`--${key}`, colorValue)
        })

        // Toggle dark mode class safely
        if (theme.isDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }

        // Update current theme
        this.currentTheme = theme
      } catch (error) {
        console.error('Error applying theme:', error)
        // Apply fallback theme
        const fallbackTheme = predefinedThemes[0]
        if (fallbackTheme) {
          this.applyTheme(fallbackTheme)
        }
      }
    },

    async saveCurrent(userId: number, silent: boolean = false) {
      if (!this.currentTheme) return

      if (!silent) {
        this.isLoading = true
      }
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
    getRandomTheme(): Theme | null {
      try {
        if (!this.systemThemes || this.systemThemes.length === 0) {
          console.warn('No system themes available for random selection')
          return null
        }
        const randomIndex = Math.floor(Math.random() * this.systemThemes.length)
        return this.systemThemes[randomIndex] || null
      } catch (error) {
        console.error('Error getting random theme:', error)
        return null
      }
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
      try {
        const authStore = useAuthStore()

        // Load local predefined themes (backend doesn't have this endpoint)
        await this.fetchThemes()

        // Ensure we have themes available
        if (!this.systemThemes || this.systemThemes.length === 0) {
          console.warn('No themes available, using fallback')
          this.systemThemes = [...predefinedThemes]
        }

        // Always apply a default theme first
        const defaultTheme = this.systemThemes[0] || predefinedThemes[0]
        this.applyTheme(defaultTheme)

        // Check if user is authenticated and has valid token
        if (authStore.currentUserId && authStore.isAuthenticated && authStore.token) {
          try {
            await this.fetchUserTheme(authStore.currentUserId)
          } catch (error) {
            console.info('Failed to fetch user theme during initialization, using default theme')
            // Continue with default theme (already applied above)
          }
        } else {
          console.info('User not authenticated, using default theme')
          // Default theme already applied above
        }
      } catch (error) {
        console.error('Error during theme store initialization:', error)
        // Ensure we have a fallback theme
        this.systemThemes = [...predefinedThemes]
        this.applyTheme(predefinedThemes[0])
      }
    },
  },
})
