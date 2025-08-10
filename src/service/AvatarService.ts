import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

interface AvatarUpdateData {
  avatarUrl: string
  rotation: number
}

interface AvatarResponse {
  userId: number
  avatarUrl: string
  rotation: number
}

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    avatarUrl: null as string | null,
    rotation: 0 as number,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    currentAvatar: (state) => state.avatarUrl,
    currentRotation: (state) => state.rotation,
  },

  actions: {
    // สำหรับ preset avatars (Dicebear URLs)
    async updateAvatarUrl(userId: number, data: AvatarUpdateData) {
      this.isLoading = true
      this.error = null

      console.log('🔄 Updating avatar URL:', data)

      try {
        const response = await api.put<AvatarResponse>(
          `/api/users/${userId}/avatar-url`,
          data,
        )

        console.log('✅ API Response:', response.data)

        // Update local state
        this.avatarUrl = data.avatarUrl
        this.rotation = data.rotation

        // Update auth store directly
        const authStore = useAuthStore()
        if (authStore.user) {
          // Direct update for immediate reactivity
          authStore.user.avatarUrl = data.avatarUrl

          // Update localStorage to persist
          const userStr = localStorage.getItem('user')
          if (userStr && userStr !== 'undefined') {
            try {
              const userData = JSON.parse(userStr)
              userData.avatarUrl = data.avatarUrl
              localStorage.setItem('user', JSON.stringify(userData))
              console.log('💾 Updated localStorage')
            } catch (e) {
              console.error('Failed to update localStorage:', e)
            }
          }

          console.log('✅ AuthStore updated:', authStore.user.avatarUrl)
        }

        return response.data
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update avatar'
        this.error = errorMessage
        console.error('❌ Update avatar URL error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Helper method to sync with auth store
    syncWithAuthStore() {
      const authStore = useAuthStore()
      if (authStore.user?.avatarUrl && this.avatarUrl !== authStore.user.avatarUrl) {
        console.log('🔄 Syncing avatar from auth store')
        this.avatarUrl = authStore.user.avatarUrl
      }
    },

    // Helper method to clear error
    clearError() {
      this.error = null
    },

    // Helper method to reset state
    reset() {
      this.avatarUrl = null
      this.rotation = 0
      this.error = null
      this.isLoading = false
    },

    // Load current user's avatar
    async loadUserAvatar(userId: number) {
      const authStore = useAuthStore()
      if (authStore.user?.avatarUrl) {
        console.log('📥 Loading user avatar:', authStore.user.avatarUrl)
        this.avatarUrl = authStore.user.avatarUrl

        // If we need to get rotation data from backend
        // You might want to add an endpoint to get current avatar details
        // For now, we'll just sync the URL
      }
    },
  },
})
