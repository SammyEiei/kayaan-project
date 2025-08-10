import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getPredefinedThemes,
  getUserTheme,
  saveUserTheme,
  createUserPreset,
  deleteUserPreset,
  resetPersonalization,
  themeToDto,
  dtoToTheme,
  type Theme,
  type ThemeDto,
} from '@/service/ThemeService'

// Mock AxiosClient
vi.mock('@/service/AxiosClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

import apiClient from '@/service/AxiosClient'

describe('ThemeService', () => {
  const mockTheme: Theme = {
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

  const mockThemeDto: ThemeDto = {
    id: 1,
    name: 'Test Theme',
    description: 'Test description',
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00',
    backgroundColor: '#ffffff',
    surfaceColor: '#f8f9fa',
    textColor: '#000000',
    textSecondaryColor: '#6c757d',
    borderColor: '#dee2e6',
    successColor: '#28a745',
    warningColor: '#ffc107',
    errorColor: '#dc3545',
    isDark: false,
    isHighContrast: false,
    isSystemTheme: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('themeToDto', () => {
    it('should convert frontend theme to backend DTO', () => {
      const result = themeToDto(mockTheme)
      expect(result).toEqual(mockThemeDto)
    })

    it('should handle missing colors with defaults', () => {
      const incompleteTheme: Theme = {
        id: 1,
        name: 'Incomplete Theme',
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
        },
        isDark: true,
      }

      const result = themeToDto(incompleteTheme)
      expect(result.primaryColor).toBe('#ff0000')
      expect(result.secondaryColor).toBe('#00ff00')
      expect(result.backgroundColor).toBe('#ffffff') // default
      expect(result.isDark).toBe(true)
    })
  })

  describe('dtoToTheme', () => {
    it('should convert backend DTO to frontend theme', () => {
      const result = dtoToTheme(mockThemeDto)
      expect(result).toEqual(mockTheme)
    })

    it('should handle all color fields', () => {
      const result = dtoToTheme(mockThemeDto)
      expect(result.colors.primary).toBe('#ff0000')
      expect(result.colors.secondary).toBe('#00ff00')
      expect(result.colors.background).toBe('#ffffff')
      expect(result.colors.surface).toBe('#f8f9fa')
      expect(result.colors.text).toBe('#000000')
      expect(result.colors.textSecondary).toBe('#6c757d')
      expect(result.colors.border).toBe('#dee2e6')
      expect(result.colors.success).toBe('#28a745')
      expect(result.colors.warning).toBe('#ffc107')
      expect(result.colors.error).toBe('#dc3545')
    })
  })

  describe('getPredefinedThemes', () => {
    it('should fetch predefined themes successfully', async () => {
      const mockResponse = { data: [mockThemeDto] }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await getPredefinedThemes()
      expect(apiClient.get).toHaveBeenCalledWith('/api/themes')
      expect(result).toEqual([mockTheme])
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(getPredefinedThemes()).rejects.toThrow('API Error')
    })
  })

  describe('getUserTheme', () => {
    it('should fetch user theme successfully', async () => {
      const mockResponse = {
        data: {
          current: mockThemeDto,
          presets: [mockThemeDto],
        },
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await getUserTheme(123)
      expect(apiClient.get).toHaveBeenCalledWith('/api/users/123/theme')
      expect(result).toEqual({
        current: mockTheme,
        presets: [mockTheme],
      })
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(getUserTheme(123)).rejects.toThrow('API Error')
    })
  })

  describe('saveUserTheme', () => {
    it('should save user theme successfully', async () => {
      vi.mocked(apiClient.put).mockResolvedValue({})

      await saveUserTheme(123, mockTheme)
      expect(apiClient.put).toHaveBeenCalledWith('/api/users/123/theme', mockThemeDto)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.put).mockRejectedValue(error)

      await expect(saveUserTheme(123, mockTheme)).rejects.toThrow('API Error')
    })
  })

  describe('createUserPreset', () => {
    it('should create user preset successfully', async () => {
      const mockResponse = { data: [mockThemeDto] }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await createUserPreset(123, mockTheme)
      expect(apiClient.post).toHaveBeenCalledWith('/api/users/123/presets', mockThemeDto)
      expect(result).toEqual([mockTheme])
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(createUserPreset(123, mockTheme)).rejects.toThrow('API Error')
    })
  })

  describe('deleteUserPreset', () => {
    it('should delete user preset successfully', async () => {
      const mockResponse = { data: [mockThemeDto] }
      vi.mocked(apiClient.delete).mockResolvedValue(mockResponse)

      const result = await deleteUserPreset(123, 456)
      expect(apiClient.delete).toHaveBeenCalledWith('/api/users/123/presets/456')
      expect(result).toEqual([mockTheme])
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.delete).mockRejectedValue(error)

      await expect(deleteUserPreset(123, 456)).rejects.toThrow('API Error')
    })
  })

  describe('resetPersonalization', () => {
    it('should reset personalization successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({})

      await resetPersonalization(123)
      expect(apiClient.post).toHaveBeenCalledWith('/api/users/123/reset-personalization')
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(resetPersonalization(123)).rejects.toThrow('API Error')
    })
  })
})
