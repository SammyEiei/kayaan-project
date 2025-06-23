import api from './api'

export interface Theme {
  id?: number
  name: string
  description?: string
  colors: Record<string, string>
  isDark: boolean
}

export async function getPredefinedThemes() {
  const res = await api.get<Theme[]>('/themes')
  return res.data
}

export async function getUserPresets(userId: number) {
  const res = await api.get<Theme[]>(`/users/${userId}/presets`)
  return res.data
}

export async function createUserPreset(userId: number, payload: Theme) {
  const res = await api.post<Theme>(`/users/${userId}/presets`, payload)
  return res.data
}

export async function deleteUserPreset(userId: number, presetId: number) {
  await api.delete(`/users/${userId}/presets/${presetId}`)
}

export async function setActiveTheme(userId: number, themeId?: number, presetId?: number) {
  await api.put(`/users/${userId}/theme`, null, { params: { themeId, presetId } })
}

export async function getActiveTheme(userId: number) {
  const res = await api.get(`/users/${userId}/theme`)
  return res.data
}

export async function resetPersonalization(userId: number) {
  await api.post(`/users/${userId}/reset-personalization`)
}
