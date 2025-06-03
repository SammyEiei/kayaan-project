import { defineStore } from 'pinia'

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    avatar: '', // URL หรือ base64
    theme: 'light', // 'light' | 'dark' | 'high-contrast'
    themePresets: [] as { name: string; config: any }[],
  }),
  actions: {
    setAvatar(avatar: string) {
      this.avatar = avatar
      localStorage.setItem('avatar', avatar)
    },
    setTheme(theme: string) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    },
    saveThemePreset(name: string, config: any) {
      this.themePresets.push({ name, config })
      localStorage.setItem('themePresets', JSON.stringify(this.themePresets))
    },
    loadFromStorage() {
      this.avatar = localStorage.getItem('avatar') || ''
      this.theme = localStorage.getItem('theme') || 'light'
      this.themePresets = JSON.parse(localStorage.getItem('themePresets') || '[]')
    },
    resetAll() {
      this.avatar = ''
      this.theme = 'light'
      this.themePresets = []
      localStorage.removeItem('avatar')
      localStorage.removeItem('theme')
      localStorage.removeItem('themePresets')
    },
  },
})
