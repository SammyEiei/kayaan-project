import apiClient from './AxiosClient'
import { useAuthStore } from '../stores/auth'

// Helper function to validate JWT token
function isValidJwtToken(token: string): boolean {
  if (!token || token.trim() === '') {
    return false
  }

  // Check if token has the correct JWT format (3 parts separated by dots)
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }

  // Check if all parts are not empty
  if (parts.some(part => part.trim() === '')) {
    return false
  }

  return true
}

// Helper function to check if user is authenticated
function isUserAuthenticated(): boolean {
  const authStore = useAuthStore()
  return authStore.isAuthenticated && authStore.token !== null && isValidJwtToken(authStore.token)
}

export interface ThemeDto {
  id?: number
  name: string
  description?: string
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
  current: ThemeDto
  presets: ThemeDto[]
}

// Frontend theme format (for compatibility)
export interface Theme {
  id?: number
  name: string
  description?: string
  colors: Record<string, string>
  isDark: boolean
}

// Predefined themes for fallback when API is not available
export const predefinedThemes: Theme[] = [
  {
    id: 1,
    name: 'Light',
    description: 'Clean and bright design perfect for daytime use',
    colors: {
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
    },
    isDark: false,
  },
  {
    id: 2,
    name: 'Dark',
    description: 'Easy on the eyes for low-light environments',
    colors: {
      primary: '#9b87f5',
      secondary: '#33C3F0',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      border: '#27272a',
      success: '#22c55e',
      warning: '#eab308',
      error: '#f87171',
    },
    isDark: true,
  },
  {
    id: 3,
    name: 'Ocean',
    description: 'Calming blue tones inspired by the sea',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      border: '#bae6fd',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 4,
    name: 'Sunset',
    description: 'Warm oranges and purples like a beautiful sunset',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      background: '#fff7ed',
      surface: '#fed7aa',
      text: '#9a3412',
      textSecondary: '#c2410c',
      border: '#fdba74',
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 5,
    name: 'Forest',
    description: 'Natural greens bringing the outdoors inside',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      background: '#f0fdf4',
      surface: '#bbf7d0',
      text: '#064e3b',
      textSecondary: '#065f46',
      border: '#86efac',
      success: '#15803d',
      warning: '#a16207',
      error: '#b91c1c',
    },
    isDark: false,
  },
  {
    id: 6,
    name: 'Midnight',
    description: 'Deep blues and purples for the night owls',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      border: '#334155',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    isDark: true,
  },
  {
    id: 7,
    name: 'Rose',
    description: 'Elegant pink and rose tones for a feminine touch',
    colors: {
      primary: '#e11d48',
      secondary: '#f43f5e',
      background: '#fff1f2',
      surface: '#ffe4e6',
      text: '#881337',
      textSecondary: '#be123c',
      border: '#fecdd3',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 8,
    name: 'Amber',
    description: 'Warm golden tones for a cozy feel',
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#92400e',
      textSecondary: '#b45309',
      border: '#fde68a',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 9,
    name: 'Slate',
    description: 'Professional gray tones for business use',
    colors: {
      primary: '#475569',
      secondary: '#64748b',
      background: '#f8fafc',
      surface: '#f1f5f9',
      text: '#1e293b',
      textSecondary: '#475569',
      border: '#cbd5e1',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 10,
    name: 'Emerald',
    description: 'Rich green tones for a premium look',
    colors: {
      primary: '#047857',
      secondary: '#059669',
      background: '#ecfdf5',
      surface: '#d1fae5',
      text: '#064e3b',
      textSecondary: '#065f46',
      border: '#a7f3d0',
      success: '#15803d',
      warning: '#a16207',
      error: '#b91c1c',
    },
    isDark: false,
  },
  {
    id: 11,
    name: 'Violet',
    description: 'Royal purple tones for a luxurious feel',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textSecondary: '#6b21a8',
      border: '#ddd6fe',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 12,
    name: 'Cyan',
    description: 'Fresh cyan tones for a modern look',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      background: '#ecfeff',
      surface: '#cffafe',
      text: '#164e63',
      textSecondary: '#0e7490',
      border: '#a5f3fc',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    isDark: false,
  },
  {
    id: 13,
    name: 'Neon',
    description: 'Vibrant neon colors for a bold statement',
    colors: {
      primary: '#00ff88',
      secondary: '#00d4ff',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      success: '#00ff88',
      warning: '#ffff00',
      error: '#ff0080',
    },
    isDark: true,
  },
  {
    id: 14,
    name: 'Pastel',
    description: 'Soft pastel colors for a gentle experience',
    colors: {
      primary: '#f8b4d9',
      secondary: '#b4d9f8',
      background: '#fefefe',
      surface: '#fafafa',
      text: '#6b7280',
      textSecondary: '#9ca3af',
      border: '#e5e7eb',
      success: '#a7f3d0',
      warning: '#fde68a',
      error: '#fecaca',
    },
    isDark: false,
  },
  {
    id: 15,
    name: 'Monochrome',
    description: 'Clean black and white for minimalism',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      background: '#ffffff',
      surface: '#f9f9f9',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e5e5e5',
      success: '#000000',
      warning: '#666666',
      error: '#000000',
    },
    isDark: false,
  },
]

// Convert frontend theme to backend DTO
export function themeToDto(theme: Theme): ThemeDto {
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    primaryColor: theme.colors.primary || '#8b5cf6',
    secondaryColor: theme.colors.secondary || '#6366f1',
    backgroundColor: theme.colors.background || '#ffffff',
    surfaceColor: theme.colors.surface || '#f8fafc',
    textColor: theme.colors.text || '#1e293b',
    textSecondaryColor: theme.colors.textSecondary || '#64748b',
    borderColor: theme.colors.border || '#e2e8f0',
    successColor: theme.colors.success || '#10b981',
    warningColor: theme.colors.warning || '#f59e0b',
    errorColor: theme.colors.error || '#ef4444',
    isDark: theme.isDark,
    isHighContrast: false,
    isSystemTheme: false,
  }
}

// Convert backend DTO to frontend theme
export function dtoToTheme(dto: ThemeDto): Theme {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    colors: {
      primary: dto.primaryColor,
      secondary: dto.secondaryColor,
      background: dto.backgroundColor,
      surface: dto.surfaceColor,
      text: dto.textColor,
      textSecondary: dto.textSecondaryColor,
      border: dto.borderColor,
      success: dto.successColor,
      warning: dto.warningColor,
      error: dto.errorColor,
    },
    isDark: dto.isDark,
  }
}

export async function getPredefinedThemes(): Promise<Theme[]> {
  // Backend doesn't have predefined themes API, so return local predefined themes
  console.log('Using local predefined themes (backend doesn\'t have this endpoint)')
  return predefinedThemes
}

export async function getUserTheme(userId: number): Promise<{ current: Theme; presets: Theme[] }> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.info('User not authenticated. Using default theme as fallback.')
      return {
        current: predefinedThemes[0],
        presets: [],
      }
    }

    const response = await apiClient.get<{ current: ThemeDto; presets: ThemeDto[] }>(`/api/users/${userId}/theme`)
    return {
      current: dtoToTheme(response.data.current),
      presets: response.data.presets.map(dtoToTheme),
    }
  } catch (error: unknown) {
    // Check if it's a 403/401 error (authentication/authorization issue)
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.info(`Authentication/Authorization issue for user ${userId}. Using default theme as fallback.`)
      // Return default theme as fallback
      return {
        current: predefinedThemes[0],
        presets: [],
      }
    }

    // Log other errors but don't throw for now
    console.warn('Failed to fetch user theme (non-auth error):', error)
    return {
      current: predefinedThemes[0],
      presets: [],
    }
  }
}

export async function saveUserTheme(userId: number, theme: Theme): Promise<void> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.info('User not authenticated. Theme will be saved locally only.')
      return
    }

    const themeDto = themeToDto(theme)
    await apiClient.put(`/api/users/${userId}/theme`, themeDto)
  } catch (error: unknown) {
    // Check if it's a 403/401 error (authentication/authorization issue)
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.warn(`Authentication/Authorization issue for user ${userId}. Theme will be saved locally only.`)
      // Don't throw error for auth issues, just log and continue
      return
    }

    console.error('Failed to save user theme:', error)
    throw error
  }
}

export async function createUserPreset(userId: number, theme: Theme): Promise<Theme[]> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.info('User not authenticated. Preset will be saved locally only.')
      return []
    }

    const themeDto = themeToDto(theme)
    const response = await apiClient.post<ThemeDto[]>(`/api/users/${userId}/presets`, themeDto)
    return response.data.map(dtoToTheme)
  } catch (error: unknown) {
    // Check if it's a 403/401 error (authentication/authorization issue)
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.warn(`Authentication/Authorization issue for user ${userId}. Preset will be saved locally only.`)
      // Return empty array for auth issues
      return []
    }

    console.error('Failed to create user preset:', error)
    throw error
  }
}

export async function deleteUserPreset(userId: number, presetId: number): Promise<Theme[]> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.info('User not authenticated. Preset deletion will be handled locally only.')
      return []
    }

    const response = await apiClient.delete<ThemeDto[]>(`/api/users/${userId}/presets/${presetId}`)
    return response.data.map(dtoToTheme)
  } catch (error: unknown) {
    // Check if it's a 403/401 error (authentication/authorization issue)
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.warn(`Authentication/Authorization issue for user ${userId}. Preset deletion will be handled locally only.`)
      // Return empty array for auth issues
      return []
    }

    console.error('Failed to delete user preset:', error)
    throw error
  }
}

export async function resetPersonalization(userId: number): Promise<void> {
  try {
    // Check if user is authenticated
    if (!isUserAuthenticated()) {
      console.info('User not authenticated. Reset will be handled locally only.')
      return
    }

    await apiClient.post(`/api/users/${userId}/reset-personalization`)
  } catch (error: unknown) {
    // Check if it's a 403/401 error (authentication/authorization issue)
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.warn(`Authentication/Authorization issue for user ${userId}. Reset will be handled locally only.`)
      // Don't throw error for auth issues, just log and continue
      return
    }

    console.error('Failed to reset personalization:', error)
    throw error
  }
}
