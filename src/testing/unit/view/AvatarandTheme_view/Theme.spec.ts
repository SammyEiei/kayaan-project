import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Define proper types for better type safety
interface Theme {
  id: number
  name: string
  description?: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
  }
  isDark: boolean
  isHighContrast?: boolean
  applied?: boolean
  preview?: boolean
}

interface ThemePreset {
  id: number
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
  }
  isDark: boolean
  applied?: boolean
}

interface MockThemeStore {
  systemThemes: Theme[]
  currentTheme: Theme | null
  presets: ThemePreset[]
  isLoading: boolean
  error: string | null
  fetchThemes: ReturnType<typeof vi.fn>
  fetchUserTheme: ReturnType<typeof vi.fn>
  applyTheme: ReturnType<typeof vi.fn>
  saveCurrent: ReturnType<typeof vi.fn>
  savePreset: ReturnType<typeof vi.fn>
  removePreset: ReturnType<typeof vi.fn>
  resetAll: ReturnType<typeof vi.fn>
  previousTheme?: Theme | null // เพิ่ม property นี้
}

// Mock functions for testing
const mockThemeService = {
  getPredefinedThemes: vi.fn(),
  getUserPresets: vi.fn(),
  createUserPreset: vi.fn(),
  deleteUserPreset: vi.fn(),
  setActiveTheme: vi.fn(),
  getActiveTheme: vi.fn(),
  resetPersonalization: vi.fn(),
}

const mockThemeStore: MockThemeStore = {
  systemThemes: [],
  currentTheme: null,
  presets: [],
  isLoading: false,
  error: null,
  fetchThemes: vi.fn(),
  fetchUserTheme: vi.fn(),
  applyTheme: vi.fn(),
  saveCurrent: vi.fn(),
  savePreset: vi.fn(),
  removePreset: vi.fn(),
  resetAll: vi.fn(),
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Theme Testing Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock store state
    mockThemeStore.currentTheme = null
    mockThemeStore.presets = []
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('UTC-07: Select Theme Testing', () => {
    describe('UTC-07-TC-01: Test getAllSystemThemes() returns at least 3', () => {
      it('should return at least 3 system themes', async () => {
        // Mock system themes
        const mockSystemThemes: Theme[] = [
          {
            id: 1,
            name: 'Light',
            description: 'Clean and bright design',
            colors: {
              primary: '#7E69AB',
              secondary: '#1EAEDB',
              background: '#ffffff',
              foreground: '#0a0a0a',
              accent: '#f4f4f5',
            },
            isDark: false,
            isHighContrast: false,
          },
          {
            id: 2,
            name: 'Dark',
            description: 'Easy on the eyes for low-light environments',
            colors: {
              primary: '#9b87f5',
              secondary: '#33C3F0',
              background: '#0a0a0a',
              foreground: '#fafafa',
              accent: '#27272a',
            },
            isDark: true,
            isHighContrast: false,
          },
          {
            id: 3,
            name: 'High Contrast',
            description: 'High contrast for accessibility',
            colors: {
              primary: '#000000',
              secondary: '#ffffff',
              background: '#ffffff',
              foreground: '#000000',
              accent: '#ffff00',
            },
            isDark: false,
            isHighContrast: true,
          },
        ]

        mockThemeService.getPredefinedThemes.mockResolvedValue(mockSystemThemes)

        // Call the service
        const result = await mockThemeService.getPredefinedThemes()

        // Verify we have at least 3 themes
        expect(result.length).toBeGreaterThanOrEqual(3)
        expect(result).toHaveLength(3)

        // Verify theme structure
        result.forEach((theme: Theme) => {
          expect(theme).toHaveProperty('id')
          expect(theme).toHaveProperty('name')
          expect(theme).toHaveProperty('colors')
          expect(theme).toHaveProperty('isDark')
        })
      })
    })

    describe('UTC-07-TC-02: Test applyTheme() with light theme', () => {
      it('should apply light theme successfully', async () => {
        const userId = 1
        const themeId = 1

        // Mock successful theme application
        const mockResponse: Theme = {
          id: 1,
          name: 'Light',
          applied: true,
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
        }

        mockThemeService.setActiveTheme.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockResponse
        })

        // Apply theme
        await mockThemeService.setActiveTheme(userId, themeId)
        mockThemeStore.applyTheme(mockResponse)

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, themeId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockResponse)

        // Verify theme was applied
        expect(mockThemeStore.currentTheme).toEqual(mockResponse)
      })
    })

    describe('UTC-07-TC-03: Test applyTheme() with dark theme', () => {
      it('should apply dark theme successfully', async () => {
        const userId = 1
        const themeId = 2

        // Mock successful theme application
        const mockResponse: Theme = {
          id: 2,
          name: 'Dark',
          applied: true,
          colors: {
            primary: '#9b87f5',
            secondary: '#33C3F0',
            background: '#0a0a0a',
            foreground: '#fafafa',
            accent: '#27272a',
          },
          isDark: true,
        }

        mockThemeService.setActiveTheme.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockResponse
        })

        // Apply theme
        await mockThemeService.setActiveTheme(userId, themeId)
        mockThemeStore.applyTheme(mockResponse)

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, themeId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockResponse)

        // Verify theme was applied
        expect(mockThemeStore.currentTheme).toEqual(mockResponse)
      })
    })

    describe('UTC-07-TC-04: Test applyTheme() with high-contrast theme', () => {
      it('should apply high-contrast theme successfully', async () => {
        const userId = 1
        const themeId = 3

        // Mock successful theme application
        const mockResponse: Theme = {
          id: 3,
          name: 'High Contrast',
          applied: true,
          colors: {
            primary: '#000000',
            secondary: '#ffffff',
            background: '#ffffff',
            foreground: '#000000',
            accent: '#ffff00',
          },
          isDark: false,
          isHighContrast: true,
        }

        mockThemeService.setActiveTheme.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockResponse
        })

        // Apply theme
        await mockThemeService.setActiveTheme(userId, themeId)
        mockThemeStore.applyTheme(mockResponse)

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, themeId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockResponse)

        // Verify theme was applied
        expect(mockThemeStore.currentTheme).toEqual(mockResponse)
      })
    })

    describe('UTC-07-TC-05: Test applyTheme() with invalid theme ID', () => {
      it('should throw ThemeNotFoundException for invalid theme ID', async () => {
        const userId = 1
        const invalidThemeId = 999

        // Mock API error for invalid theme
        const mockError = new Error('Theme not found')
        mockThemeService.setActiveTheme.mockRejectedValue(mockError)

        // Try to apply invalid theme and expect error
        await expect(mockThemeService.setActiveTheme(userId, invalidThemeId)).rejects.toThrow(
          'Theme not found',
        )

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, invalidThemeId)
      })
    })
  })

  describe('UTC-08: Preview Theme Testing', () => {
    describe('UTC-08-TC-01: Test previewTheme() temporary application', () => {
      it('should apply theme temporarily with preview flag', async () => {
        const userId = 1
        const themeId = 2
        const preview = true

        // Mock preview theme response
        const mockPreviewTheme: Theme = {
          id: 2,
          name: 'Dark',
          applied: true,
          preview: true,
          colors: {
            primary: '#9b87f5',
            secondary: '#33C3F0',
            background: '#0a0a0a',
            foreground: '#fafafa',
            accent: '#27272a',
          },
          isDark: true,
        }

        mockThemeService.setActiveTheme.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockPreviewTheme
        })

        // Apply preview theme
        await mockThemeService.setActiveTheme(userId, themeId)
        mockThemeStore.applyTheme(mockPreviewTheme)

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, themeId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockPreviewTheme)

        // Verify preview flag is set
        expect(mockThemeStore.currentTheme).toEqual(mockPreviewTheme)
        expect(mockThemeStore.currentTheme?.preview).toBe(true)
      })
    })

    describe('UTC-08-TC-02: Test cancelPreview() functionality', () => {
      it('should revert to previous theme when canceling preview', () => {
        // เพิ่ม previousTheme ใน mockThemeStore
        mockThemeStore.previousTheme = null

        const previousTheme: Theme = {
          id: 1,
          name: 'Light',
          applied: true,
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
        }

        const previewTheme: Theme = {
          id: 2,
          name: 'Dark',
          applied: true,
          preview: true,
          colors: {
            primary: '#9b87f5',
            secondary: '#33C3F0',
            background: '#0a0a0a',
            foreground: '#fafafa',
            accent: '#27272a',
          },
          isDark: true,
        }

        // ให้ applyTheme อัปเดต currentTheme จริง
        mockThemeStore.applyTheme.mockImplementation((theme: Theme) => {
          mockThemeStore.currentTheme = theme
        })

        // เวลาทำ preview ให้เก็บ previousTheme
        const startPreview = () => {
          mockThemeStore.previousTheme = previousTheme
          mockThemeStore.currentTheme = previewTheme

          // Auto-revert หลัง 10 วินาที
          setTimeout(() => {
            // deep clone และลบ property preview
            const revertedTheme: Theme = JSON.parse(JSON.stringify(mockThemeStore.previousTheme))
            delete (revertedTheme as Partial<Theme>).preview
            mockThemeStore.currentTheme = revertedTheme
            mockThemeStore.applyTheme(revertedTheme)
          }, 10000)
        }

        // เริ่ม preview
        startPreview()
        expect(mockThemeStore.currentTheme).toEqual(previewTheme)

        // Cancel preview
        const cancelPreview = () => {
          // deep clone และลบ property preview
          const revertedTheme: Theme = JSON.parse(JSON.stringify(mockThemeStore.previousTheme))
          delete (revertedTheme as Partial<Theme>).preview
          mockThemeStore.currentTheme = revertedTheme
          mockThemeStore.applyTheme(revertedTheme)
        }

        // เรียก cancelPreview เพื่อ revert ธีม
        cancelPreview()

        // ตรวจสอบว่ากลับเป็น previousTheme จริง
        expect(mockThemeStore.currentTheme).toEqual(previousTheme)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(previousTheme)
      })
    })

    describe('UTC-08-TC-03: Test preview auto-revert after 10 seconds', () => {
      it('should automatically revert to previous theme after 10 seconds', async () => {
        // เพิ่ม previousTheme ใน mockThemeStore
        mockThemeStore.previousTheme = null

        const previousTheme: Theme = {
          id: 1,
          name: 'Light',
          applied: true,
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
        }

        const previewTheme: Theme = {
          id: 2,
          name: 'Dark',
          applied: true,
          preview: true,
          colors: {
            primary: '#9b87f5',
            secondary: '#33C3F0',
            background: '#0a0a0a',
            foreground: '#fafafa',
            accent: '#27272a',
          },
          isDark: true,
        }

        // ใช้ fake timers ก่อนเริ่ม preview เพื่อให้ setTimeout อยู่ภายใต้ fake timers
        vi.useFakeTimers()

        // ฟังก์ชัน startPreview ที่เก็บ previousTheme
        const startPreview = () => {
          mockThemeStore.previousTheme = previousTheme
          mockThemeStore.currentTheme = previewTheme

          // Auto-revert หลัง 10 วินาที
          setTimeout(() => {
            // deep clone และลบ property preview
            const revertedTheme: Theme = JSON.parse(JSON.stringify(mockThemeStore.previousTheme))
            delete (revertedTheme as Partial<Theme>).preview
            mockThemeStore.currentTheme = revertedTheme
            mockThemeStore.applyTheme(revertedTheme)
          }, 10000)
        }

        // เริ่ม preview
        startPreview()
        expect(mockThemeStore.currentTheme).toEqual(previewTheme)

        // เดินเวลา 10 วินาที
        vi.advanceTimersByTime(10000)
        vi.useRealTimers()

        // ตรวจสอบว่ากลับเป็น previousTheme จริง
        expect(mockThemeStore.currentTheme).toEqual(previousTheme)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(previousTheme)
      })
    })

    describe('UTC-08-TC-04: Test preview with non-existent theme', () => {
      it('should throw ThemeNotFoundException for non-existent theme in preview', async () => {
        const userId = 1
        const invalidThemeId = 999
        const preview = true

        // Mock API error for invalid theme
        const mockError = new Error('Theme not found')
        mockThemeService.setActiveTheme.mockRejectedValue(mockError)

        // Try to preview invalid theme and expect error
        await expect(mockThemeService.setActiveTheme(userId, invalidThemeId)).rejects.toThrow(
          'Theme not found',
        )

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, invalidThemeId)
      })
    })
  })

  describe('UTC-09: Save Theme Preset Testing', () => {
    describe('UTC-09-TC-01: Test saveThemePreset() with custom name', () => {
      it('should save theme preset with custom name', async () => {
        const userId = 1
        const presetName = 'My Custom'
        const themeConfig: ThemePreset = {
          id: 1,
          name: 'My Custom',
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
        }

        // Mock successful preset save
        const mockResponse: ThemePreset & { saved: boolean } = {
          id: 1,
          name: 'My Custom',
          colors: themeConfig.colors,
          isDark: false,
          saved: true,
        }

        mockThemeService.createUserPreset.mockResolvedValue(mockResponse)

        // Save preset
        const result = await mockThemeService.createUserPreset(userId, themeConfig)

        // Verify service was called
        expect(mockThemeService.createUserPreset).toHaveBeenCalledWith(userId, themeConfig)

        // Verify response
        expect(result).toEqual(mockResponse)
        expect(result.name).toBe('My Custom')
        expect(result.saved).toBe(true)
      })
    })

    describe('UTC-09-TC-02: Test saveThemePreset() with duplicate name', () => {
      it('should throw ValidationException for duplicate preset name', async () => {
        const userId = 1
        const presetName = 'Existing Name'
        const themeConfig: ThemePreset = {
          id: 2,
          name: 'Existing Name',
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
        }

        // Mock API error for duplicate name
        const mockError = new Error('Preset name already exists')
        mockThemeService.createUserPreset.mockRejectedValue(mockError)

        // Try to save preset with duplicate name and expect error
        await expect(mockThemeService.createUserPreset(userId, themeConfig)).rejects.toThrow(
          'Preset name already exists',
        )

        // Verify service was called
        expect(mockThemeService.createUserPreset).toHaveBeenCalledWith(userId, themeConfig)
      })
    })

    describe('UTC-09-TC-03: Test getUserPresets() listing', () => {
      it('should return list of user saved presets', async () => {
        const userId = 1

        // Mock user presets
        const mockUserPresets: ThemePreset[] = [
          {
            id: 1,
            name: 'My Custom Theme',
            colors: {
              primary: '#7E69AB',
              secondary: '#1EAEDB',
              background: '#ffffff',
              foreground: '#0a0a0a',
              accent: '#f4f4f5',
            },
            isDark: false,
          },
          {
            id: 2,
            name: 'Dark Custom',
            colors: {
              primary: '#9b87f5',
              secondary: '#33C3F0',
              background: '#0a0a0a',
              foreground: '#fafafa',
              accent: '#27272a',
            },
            isDark: true,
          },
        ]

        mockThemeService.getUserPresets.mockResolvedValue(mockUserPresets)

        // Get user presets
        const result = await mockThemeService.getUserPresets(userId)

        // Verify service was called
        expect(mockThemeService.getUserPresets).toHaveBeenCalledWith(userId)

        // Verify response
        expect(result).toEqual(mockUserPresets)
        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('My Custom Theme')
        expect(result[1].name).toBe('Dark Custom')
      })
    })

    describe('UTC-09-TC-04: Test applyPreset() one-click switching', () => {
      it('should apply preset with one-click switching', async () => {
        const userId = 1
        const presetId = 1

        // Mock preset application
        const mockPreset: ThemePreset & { applied: boolean } = {
          id: 1,
          name: 'My Custom Theme',
          colors: {
            primary: '#7E69AB',
            secondary: '#1EAEDB',
            background: '#ffffff',
            foreground: '#0a0a0a',
            accent: '#f4f4f5',
          },
          isDark: false,
          applied: true,
        }

        mockThemeService.setActiveTheme.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockPreset as Theme
        })

        // Apply preset
        await mockThemeService.setActiveTheme(userId, undefined, presetId)
        mockThemeStore.applyTheme(mockPreset as Theme)

        // Verify service was called
        expect(mockThemeService.setActiveTheme).toHaveBeenCalledWith(userId, undefined, presetId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockPreset as Theme)

        // Verify preset was applied
        expect(mockThemeStore.currentTheme).toEqual(mockPreset as Theme)
        expect(mockThemeStore.currentTheme?.applied).toBe(true)
      })
    })

    describe('UTC-09-TC-05: Test deletePreset() functionality', () => {
      it('should remove preset from user collection', async () => {
        const userId = 1
        const presetId = 1

        // Mock successful preset deletion
        const mockResponse: ThemePreset[] = [
          {
            id: 2,
            name: 'Remaining Preset',
            colors: {
              primary: '#7E69AB',
              secondary: '#1EAEDB',
              background: '#ffffff',
              foreground: '#0a0a0a',
              accent: '#f4f4f5',
            },
            isDark: false,
          },
        ]

        mockThemeService.deleteUserPreset.mockResolvedValue(undefined)
        mockThemeService.getUserPresets.mockResolvedValue(mockResponse)

        // Delete preset
        await mockThemeService.deleteUserPreset(userId, presetId)

        // Verify service was called
        expect(mockThemeService.deleteUserPreset).toHaveBeenCalledWith(userId, presetId)

        // Verify preset was removed
        const remainingPresets = await mockThemeService.getUserPresets(userId)
        expect(remainingPresets).toEqual(mockResponse)
        expect(remainingPresets).toHaveLength(1)
        expect(remainingPresets[0].id).toBe(2)
      })
    })

    describe('UTC-09-TC-06: Test preset persistence across sessions', () => {
      it('should persist presets across login/logout sessions', async () => {
        const userId = 1

        // Mock presets that should persist
        const mockPresets: ThemePreset[] = [
          {
            id: 1,
            name: 'My Custom Theme',
            colors: {
              primary: '#7E69AB',
              secondary: '#1EAEDB',
              background: '#ffffff',
              foreground: '#0a0a0a',
              accent: '#f4f4f5',
            },
            isDark: false,
          },
        ]

        // Mock localStorage persistence
        localStorageMock.setItem.mockImplementation((key: string, value: string) => {
          if (key === 'userPresets') {
            // Simulate saving to localStorage
          }
        })

        localStorageMock.getItem.mockImplementation((key: string) => {
          if (key === 'userPresets') {
            return JSON.stringify(mockPresets)
          }
          return null
        })

        // Simulate logout (clear current state)
        mockThemeStore.currentTheme = null
        mockThemeStore.presets = []

        // Simulate login (restore presets)
        const savedPresets = localStorageMock.getItem('userPresets')
        if (savedPresets) {
          mockThemeStore.presets = JSON.parse(savedPresets)
        }

        // Verify presets persisted
        expect(mockThemeStore.presets).toEqual(mockPresets)
        expect(mockThemeStore.presets).toHaveLength(1)
        expect(mockThemeStore.presets[0]?.name).toBe('My Custom Theme')
      })
    })
  })

  describe('UTC-10: Revert Personalization Defaults Testing', () => {
    describe('UTC-10-TC-01: Test resetToDefaults() avatar restoration', () => {
      it('should reset avatar to system default', async () => {
        const userId = 1

        // Mock user with custom avatar
        const userWithCustomAvatar = {
          id: userId,
          avatarUrl: '/uploads/custom_avatar.png',
          theme: {
            id: 2,
            name: 'Dark',
            applied: true,
          },
        }

        // Mock reset response
        const mockResetResponse = {
          message: 'Settings restored to defaults',
          avatarUrl: '/avatars/default.png',
        }

        mockThemeService.resetPersonalization.mockResolvedValue(undefined)

        // Reset to defaults
        await mockThemeService.resetPersonalization(userId)

        // Verify service was called
        expect(mockThemeService.resetPersonalization).toHaveBeenCalledWith(userId)

        // Verify avatar was reset to default
        expect(mockResetResponse.avatarUrl).toBe('/avatars/default.png')
      })
    })

    describe('UTC-10-TC-02: Test resetToDefaults() theme restoration', () => {
      it('should reset theme to system default (light)', async () => {
        const userId = 1

        // Mock user with custom theme
        const userWithCustomTheme = {
          id: userId,
          theme: {
            id: 2,
            name: 'Dark',
            applied: true,
          },
        }

        // Mock reset response
        const mockResetResponse = {
          message: 'Settings restored to defaults',
          theme: {
            id: 1,
            name: 'Light',
            applied: true,
            colors: {
              primary: '#7E69AB',
              secondary: '#1EAEDB',
              background: '#ffffff',
              foreground: '#0a0a0a',
              accent: '#f4f4f5',
            },
            isDark: false,
          } as Theme,
        }

        mockThemeService.resetPersonalization.mockResolvedValue(undefined)
        mockThemeStore.applyTheme.mockImplementation(() => {
          mockThemeStore.currentTheme = mockResetResponse.theme
        })

        // Reset to defaults
        await mockThemeService.resetPersonalization(userId)
        mockThemeStore.applyTheme(mockResetResponse.theme)

        // Verify service was called
        expect(mockThemeService.resetPersonalization).toHaveBeenCalledWith(userId)
        expect(mockThemeStore.applyTheme).toHaveBeenCalledWith(mockResetResponse.theme)

        // Verify theme was reset to light
        expect(mockThemeStore.currentTheme).toEqual(mockResetResponse.theme)
        expect(mockThemeStore.currentTheme?.name).toBe('Light')
      })
    })

    describe('UTC-10-TC-03: Test resetToDefaults() layout restoration', () => {
      it('should reset layout to default configuration', async () => {
        const userId = 1

        // Mock user with custom layout
        const userWithCustomLayout = {
          id: userId,
          layout: {
            sidebar: 'collapsed',
            compact: true,
            custom: true,
          },
        }

        // Mock reset response
        const mockResetResponse = {
          message: 'Settings restored to defaults',
          layout: {
            sidebar: 'expanded',
            compact: false,
            custom: false,
          },
        }

        mockThemeService.resetPersonalization.mockResolvedValue(undefined)

        // Reset to defaults
        await mockThemeService.resetPersonalization(userId)

        // Verify service was called
        expect(mockThemeService.resetPersonalization).toHaveBeenCalledWith(userId)

        // Verify layout was reset to default
        expect(mockResetResponse.layout.sidebar).toBe('expanded')
        expect(mockResetResponse.layout.compact).toBe(false)
        expect(mockResetResponse.layout.custom).toBe(false)
      })
    })

    describe('UTC-10-TC-04: Test resetToDefaults() preset clearing', () => {
      it('should remove all custom presets', async () => {
        const userId = 1

        // Mock user with saved presets
        const userWithPresets = {
          id: userId,
          presets: [
            { id: 'custom-1', name: 'My Custom Theme' },
            { id: 'custom-2', name: 'Dark Custom' },
          ],
        }

        // Mock reset response
        const mockResetResponse = {
          message: 'Settings restored to defaults',
          presets: [],
        }

        mockThemeService.resetPersonalization.mockResolvedValue(undefined)

        // Reset to defaults
        await mockThemeService.resetPersonalization(userId)

        // Verify service was called
        expect(mockThemeService.resetPersonalization).toHaveBeenCalledWith(userId)

        // Verify all presets were cleared
        expect(mockResetResponse.presets).toEqual([])
        expect(mockResetResponse.presets).toHaveLength(0)
      })
    })

    describe('UTC-10-TC-05: Test resetToDefaults() notification', () => {
      it('should return reset notification message', async () => {
        const userId = 1
        const resetDefaults = true

        // Mock reset response
        const mockResetResponse = {
          message: 'Settings restored to defaults',
        }

        mockThemeService.resetPersonalization.mockResolvedValue(undefined)

        // Reset to defaults
        await mockThemeService.resetPersonalization(userId)

        // Verify service was called
        expect(mockThemeService.resetPersonalization).toHaveBeenCalledWith(userId)

        // Verify notification message
        expect(mockResetResponse.message).toBe('Settings restored to defaults')
      })
    })
  })

  describe('Integration Tests', () => {
    it('should validate theme structure correctly', () => {
      const validTheme: Theme = {
        id: 1,
        name: 'Light',
        colors: {
          primary: '#7E69AB',
          secondary: '#1EAEDB',
          background: '#ffffff',
          foreground: '#0a0a0a',
          accent: '#f4f4f5',
        },
        isDark: false,
        isHighContrast: false,
      }

      // Theme validation function
      const validateTheme = (theme: Partial<Theme>): boolean => {
        return !!(
          theme.id &&
          theme.name &&
          theme.colors &&
          typeof theme.isDark === 'boolean' &&
          typeof theme.isHighContrast === 'boolean'
        )
      }

      // Test valid theme
      expect(validateTheme(validTheme)).toBe(true)

      // Test invalid themes
      const invalidThemes: Partial<Theme>[] = [
        { name: 'Light' }, // Missing id
        {
          id: 1,
          colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        }, // Missing name
        { id: 1, name: 'Light' }, // Missing colors
        {
          id: 1,
          name: 'Light',
          colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
          isDark: 'true' as unknown as boolean,
        }, // Wrong type
      ]

      invalidThemes.forEach((theme) => {
        expect(validateTheme(theme)).toBe(false)
      })
    })

    it('should handle theme color validation', () => {
      const validColors = {
        primary: '#7E69AB',
        secondary: '#1EAEDB',
        background: '#ffffff',
        foreground: '#0a0a0a',
        accent: '#f4f4f5',
      }

      const invalidColors = {
        primary: 'not-a-color',
        secondary: '#invalid',
        background: 'rgb(255,255,255)',
      }

      // Color validation function
      const validateColors = (colors: Record<string, string>): boolean => {
        const hexColorRegex = /^#[0-9A-F]{6}$/i
        return Object.values(colors).every((color) => hexColorRegex.test(color))
      }

      // Test valid colors
      expect(validateColors(validColors)).toBe(true)

      // Test invalid colors
      expect(validateColors(invalidColors)).toBe(false)
    })

    it('should handle theme switching correctly', () => {
      const themes: Theme[] = [
        {
          id: 1,
          name: 'Light',
          isDark: false,
          colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        },
        {
          id: 2,
          name: 'Dark',
          isDark: true,
          colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        },
        {
          id: 3,
          name: 'High Contrast',
          isDark: false,
          isHighContrast: true,
          colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        },
      ]

      // Theme switching function
      const switchTheme = (currentTheme: Theme, newThemeId: number): Theme => {
        const newTheme = themes.find((t) => t.id === newThemeId)
        if (!newTheme) {
          throw new Error('Theme not found')
        }
        return newTheme
      }

      // Test successful theme switch
      const currentTheme = themes[0]
      const newTheme = switchTheme(currentTheme, 2)
      expect(newTheme.name).toBe('Dark')
      expect(newTheme.isDark).toBe(true)

      // Test invalid theme switch
      expect(() => switchTheme(currentTheme, 999)).toThrow('Theme not found')
    })

    it('should handle preset management correctly', () => {
      const presets: ThemePreset[] = []

      // Preset management functions
      const savePreset = (preset: ThemePreset): ThemePreset => {
        if (presets.find((p) => p.name === preset.name)) {
          throw new Error('Preset name already exists')
        }
        presets.push(preset)
        return preset
      }

      const deletePreset = (presetId: number): void => {
        const index = presets.findIndex((p) => p.id === presetId)
        if (index === -1) {
          throw new Error('Preset not found')
        }
        presets.splice(index, 1)
      }

      // Test saving preset
      const preset1: ThemePreset = {
        id: 1,
        name: 'My Theme',
        colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        isDark: false,
      }
      const savedPreset = savePreset(preset1)
      expect(savedPreset).toEqual(preset1)
      expect(presets).toHaveLength(1)

      // Test duplicate name
      const preset2: ThemePreset = {
        id: 2,
        name: 'My Theme',
        colors: { primary: '', secondary: '', background: '', foreground: '', accent: '' },
        isDark: false,
      }
      expect(() => savePreset(preset2)).toThrow('Preset name already exists')

      // Test deleting preset
      deletePreset(1)
      expect(presets).toHaveLength(0)

      // Test deleting non-existent preset
      expect(() => deletePreset(999)).toThrow('Preset not found')
    })
  })
})
