import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import * as ThemeService from '@/service/ThemeService'

// Mock ThemeService
vi.mock('@/service/ThemeService', () => ({
  getPredefinedThemes: vi.fn(),
  getUserTheme: vi.fn(),
  saveUserTheme: vi.fn(),
  createUserPreset: vi.fn(),
  deleteUserPreset: vi.fn(),
  resetPersonalization: vi.fn(),
}))

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    currentUserId: 123,
  }),
}))

describe('useThemeStore', () => {
  const mockTheme = {
    id: 1,
    name: 'Test Theme',
    description: 'Test description',
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#000000',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
    },
    isDark: false,
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('should have initial state', () => {
      const store = useThemeStore()
      expect(store.systemThemes).toEqual([store.systemThemes[0]]) // default theme
      expect(store.currentTheme).toBeNull()
      expect(store.presets).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('should return active theme', () => {
      const store = useThemeStore()
      expect(store.activeTheme).toBe(store.systemThemes[0])
    })

    it('should return current theme when set', () => {
      const store = useThemeStore()
      store.currentTheme = mockTheme
      expect(store.activeTheme).toBe(mockTheme)
    })

    it('should return isDarkMode correctly', () => {
      const store = useThemeStore()
      expect(store.isDarkMode).toBe(false)

      store.currentTheme = { ...mockTheme, isDark: true }
      expect(store.isDarkMode).toBe(true)
    })
  })

  describe('fetchThemes', () => {
    it('should fetch themes successfully', async () => {
      const store = useThemeStore()
      const mockThemes = [mockTheme]
      vi.mocked(ThemeService.getPredefinedThemes).mockResolvedValue(mockThemes)

      await store.fetchThemes()

      expect(store.isLoading).toBe(false)
      expect(store.systemThemes).toEqual(mockThemes)
      expect(store.error).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      const store = useThemeStore()
      const error = new Error('API Error')
      vi.mocked(ThemeService.getPredefinedThemes).mockRejectedValue(error)

      await store.fetchThemes()

      expect(store.isLoading).toBe(false)
      expect(store.systemThemes).toEqual([store.systemThemes[0]]) // keep default
      expect(store.error).toBeNull()
    })
  })

  describe('fetchUserTheme', () => {
    it('should fetch user theme successfully', async () => {
      const store = useThemeStore()
      const mockUserThemeData = {
        current: mockTheme,
        presets: [mockTheme],
      }
      vi.mocked(ThemeService.getUserTheme).mockResolvedValue(mockUserThemeData)

      await store.fetchUserTheme(123)

      expect(store.isLoading).toBe(false)
      expect(store.currentTheme).toEqual(mockTheme)
      expect(store.presets).toEqual([mockTheme])
      expect(store.error).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      const store = useThemeStore()
      const error = new Error('API Error')
      vi.mocked(ThemeService.getUserTheme).mockRejectedValue(error)

      await store.fetchUserTheme(123)

      expect(store.isLoading).toBe(false)
      expect(store.currentTheme).toBeNull()
      expect(store.error).toBeNull()
    })
  })

  describe('applyTheme', () => {
    it('should apply theme to DOM', () => {
      const store = useThemeStore()
      const root = document.documentElement

      store.applyTheme(mockTheme)

      expect(store.currentTheme).toEqual(mockTheme)
      expect(root.style.getPropertyValue('--primary')).toBe('#ff0000')
      expect(root.style.getPropertyValue('--secondary')).toBe('#00ff00')
      expect(root.style.getPropertyValue('--background')).toBe('#ffffff')
      expect(root.style.getPropertyValue('--surface')).toBe('#f8f9fa')
      expect(root.style.getPropertyValue('--text')).toBe('#000000')
      expect(root.style.getPropertyValue('--text-secondary')).toBe('#6c757d')
      expect(root.style.getPropertyValue('--border')).toBe('#dee2e6')
      expect(root.style.getPropertyValue('--success')).toBe('#28a745')
      expect(root.style.getPropertyValue('--warning')).toBe('#ffc107')
      expect(root.style.getPropertyValue('--error')).toBe('#dc3545')
    })

    it('should toggle dark mode class', () => {
      const store = useThemeStore()
      const root = document.documentElement

      // Light theme
      store.applyTheme(mockTheme)
      expect(root.classList.contains('dark')).toBe(false)

      // Dark theme
      store.applyTheme({ ...mockTheme, isDark: true })
      expect(root.classList.contains('dark')).toBe(true)
    })
  })

  describe('saveCurrent', () => {
    it('should save current theme successfully', async () => {
      const store = useThemeStore()
      store.currentTheme = mockTheme
      vi.mocked(ThemeService.saveUserTheme).mockResolvedValue()

      await store.saveCurrent(123)

      expect(store.isLoading).toBe(false)
      expect(ThemeService.saveUserTheme).toHaveBeenCalledWith(123, mockTheme)
      expect(store.error).toBeNull()
    })

    it('should handle API errors', async () => {
      const store = useThemeStore()
      store.currentTheme = mockTheme
      const error = new Error('API Error')
      vi.mocked(ThemeService.saveUserTheme).mockRejectedValue(error)

      await expect(store.saveCurrent(123)).rejects.toThrow('API Error')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Failed to save theme')
    })
  })

  describe('savePreset', () => {
    it('should save preset successfully', async () => {
      const store = useThemeStore()
      const mockPresets = [mockTheme]
      vi.mocked(ThemeService.createUserPreset).mockResolvedValue(mockPresets)

      await store.savePreset(123, mockTheme)

      expect(store.isLoading).toBe(false)
      expect(store.presets).toEqual(mockPresets)
      expect(ThemeService.createUserPreset).toHaveBeenCalledWith(123, mockTheme)
      expect(store.error).toBeNull()
    })

    it('should handle API errors', async () => {
      const store = useThemeStore()
      const error = new Error('API Error')
      vi.mocked(ThemeService.createUserPreset).mockRejectedValue(error)

      await expect(store.savePreset(123, mockTheme)).rejects.toThrow('API Error')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Failed to save preset')
    })
  })

  describe('removePreset', () => {
    it('should remove preset successfully', async () => {
      const store = useThemeStore()
      const mockPresets = [mockTheme]
      vi.mocked(ThemeService.deleteUserPreset).mockResolvedValue(mockPresets)

      await store.removePreset(123, 456)

      expect(store.isLoading).toBe(false)
      expect(store.presets).toEqual(mockPresets)
      expect(ThemeService.deleteUserPreset).toHaveBeenCalledWith(123, 456)
      expect(store.error).toBeNull()
    })

    it('should handle API errors', async () => {
      const store = useThemeStore()
      const error = new Error('API Error')
      vi.mocked(ThemeService.deleteUserPreset).mockRejectedValue(error)

      await expect(store.removePreset(123, 456)).rejects.toThrow('API Error')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Failed to remove preset')
    })
  })

  describe('resetAll', () => {
    it('should reset all settings successfully', async () => {
      const store = useThemeStore()
      const mockUserThemeData = {
        current: mockTheme,
        presets: [],
      }
      vi.mocked(ThemeService.resetPersonalization).mockResolvedValue()
      vi.mocked(ThemeService.getUserTheme).mockResolvedValue(mockUserThemeData)

      await store.resetAll(123)

      expect(store.isLoading).toBe(false)
      expect(ThemeService.resetPersonalization).toHaveBeenCalledWith(123)
      expect(ThemeService.getUserTheme).toHaveBeenCalledWith(123)
      expect(store.error).toBeNull()
    })

    it('should handle API errors', async () => {
      const store = useThemeStore()
      const error = new Error('API Error')
      vi.mocked(ThemeService.resetPersonalization).mockRejectedValue(error)

      await expect(store.resetAll(123)).rejects.toThrow('API Error')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Failed to reset personalization')
    })
  })

  describe('initialize', () => {
    it('should initialize theme store successfully', async () => {
      const store = useThemeStore()
      const mockThemes = [mockTheme]
      const mockUserThemeData = {
        current: mockTheme,
        presets: [mockTheme],
      }
      vi.mocked(ThemeService.getPredefinedThemes).mockResolvedValue(mockThemes)
      vi.mocked(ThemeService.getUserTheme).mockResolvedValue(mockUserThemeData)

      await store.initialize()

      expect(ThemeService.getPredefinedThemes).toHaveBeenCalled()
      expect(ThemeService.getUserTheme).toHaveBeenCalledWith(123)
      expect(store.systemThemes).toEqual(mockThemes)
      expect(store.currentTheme).toEqual(mockTheme)
      expect(store.presets).toEqual([mockTheme])
    })

    it('should handle missing user gracefully', async () => {
      const store = useThemeStore()
      const mockThemes = [mockTheme]
      vi.mocked(ThemeService.getPredefinedThemes).mockResolvedValue(mockThemes)
      // Mock auth store to return null userId
      vi.mocked(require('@/stores/auth').useAuthStore).mockReturnValue({
        currentUserId: null,
      })

      await store.initialize()

      expect(ThemeService.getPredefinedThemes).toHaveBeenCalled()
      expect(ThemeService.getUserTheme).not.toHaveBeenCalled()
      expect(store.systemThemes).toEqual(mockThemes)
    })
  })
})
