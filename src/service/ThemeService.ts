import api from './api'

// Unified Theme interface matching theme store
export interface Theme {
  id: number
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
  current: Theme
  presets: Theme[]
}

export interface UpdateThemeRequest {
  themeId?: number
  presetId?: number
}

export async function getPredefinedThemes() {
  const res = await api.get<Theme[]>('/api/themes')
  return res.data
}

export async function getUserPresets(userId: number) {
  const res = await api.get<Theme[]>(`/api/users/${userId}/presets`)
  return res.data
}

export async function createUserPreset(userId: number, payload: Theme) {
  const res = await api.post<Theme[]>(`/api/users/${userId}/presets`, payload)
  return res.data
}

export async function deleteUserPreset(userId: number, presetId: number) {
  const res = await api.delete<Theme[]>(`/api/users/${userId}/presets/${presetId}`)
  return res.data
}

export async function setActiveTheme(userId: number, themeId?: number, presetId?: number) {
  const payload: UpdateThemeRequest = { themeId, presetId }
  await api.put(`/api/users/${userId}/theme`, payload)
}

export async function getActiveTheme(userId: number) {
  const res = await api.get<UserThemeResponse>(`/api/users/${userId}/theme`)
  return res.data
}

export async function resetPersonalization(userId: number) {
  await api.post(`/api/users/${userId}/reset-personalization`)
}
