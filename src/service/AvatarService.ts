import { defineStore } from 'pinia'
import apiClient from '@/service/AxiosClient'
import { useAuthStore } from '@/stores/auth'

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    avatarUrl: null as string | null,
    rotation: 0 as number,
  }),
  actions: {
    updateAvatarUrl(userId: number, avatarUrl: string, rotation: number) {
      const authStore = useAuthStore()
      const token = authStore.token
      return apiClient
        .put(`/api/users/${userId}/avatar-url`, { avatarUrl, rotation })
        .then((res) => {
          this.avatarUrl = avatarUrl
          this.rotation = rotation
          return res
        })
        .catch((err) => {
          throw err
        })
    },

    uploadAvatar(userId: number, file: File) {
      const formData = new FormData()
      formData.append('file', file)

      const authStore = useAuthStore()
      const token = authStore.token

      return apiClient
        .post(`/api/users/${userId}/avatar-upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          this.avatarUrl = res.data.avatarUrl
          return res
        })
        .catch((err) => {
          throw err
        })
    },
  },
})
