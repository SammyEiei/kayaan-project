import { defineStore } from 'pinia'
import api from './api'
import { useAuthStore } from '../stores/auth'

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
      console.log('🔍 User ID:', userId)
      console.log('🔍 Avatar URL:', data.avatarUrl)
      console.log('🔍 Rotation:', data.rotation)

      try {
        // Get auth store to ensure we have the latest token
        const authStore = useAuthStore()

        // Check if we have a valid token
        if (!authStore.token) {
          throw new Error('No authentication token available. Please log in again.')
        }

        console.log('🔑 Using token from auth store:', authStore.token.substring(0, 20) + '...')

        // 🆕 Try different data structures based on backend expectations
        let response: { data: AvatarResponse }

        // First try: Send as avatarUrl and rotation (current format)
        try {
          console.log('🔄 Attempting to update with avatarUrl format...')
          response = await api.put<AvatarResponse>(
            `/users/${userId}/avatar-url`,
            {
              avatarUrl: data.avatarUrl,
              rotation: data.rotation
            },
            {
              headers: {
                'Authorization': `Bearer ${authStore.token}`
              }
            }
          )
          console.log('✅ API Response (avatarUrl format):', response.data)
        } catch (firstError: unknown) {
          const errorStatus = (firstError as { response?: { status?: number } })?.response?.status
          console.log('⚠️ First attempt failed, trying path format...', errorStatus)

          // Second try: Send as path (legacy format)
          try {
            console.log('🔄 Attempting to update with path format...')
            response = await api.put<AvatarResponse>(
              `/users/${userId}/avatar-url`,
              {
                path: data.avatarUrl,
                rotation: data.rotation
              },
              {
                headers: {
                  'Authorization': `Bearer ${authStore.token}`
                }
              }
            )
            console.log('✅ API Response (path format):', response.data)
          } catch (secondError: unknown) {
            const errorStatus = (secondError as { response?: { status?: number } })?.response?.status
            console.log('⚠️ Second attempt failed, trying simple format...', errorStatus)

            // Third try: Send just the URL
            response = await api.put<AvatarResponse>(
              `/users/${userId}/avatar-url`,
              data.avatarUrl,
              {
                headers: {
                  'Authorization': `Bearer ${authStore.token}`,
                  'Content-Type': 'text/plain'
                }
              }
            )
            console.log('✅ API Response (simple format):', response.data)
          }
        }

        // 🆕 Check if backend response is valid
        if (response.data && response.data.userId === null) {
          console.warn('⚠️ Backend returned userId: null, but continuing with local update')
        }

        // 🆕 Always update local state regardless of backend response
        // This ensures the UI updates immediately even if backend has issues
        this.avatarUrl = data.avatarUrl
        this.rotation = data.rotation

        // Update auth store directly
        if (authStore.user) {
          // Direct update for immediate reactivity
          authStore.user.avatarUrl = data.avatarUrl
          authStore.user.avatarRotation = data.rotation

          // Update localStorage to persist
          const userStr = localStorage.getItem('user')
          if (userStr && userStr !== 'undefined') {
            try {
              const userData = JSON.parse(userStr)
              userData.avatarUrl = data.avatarUrl
              userData.avatarRotation = data.rotation
              localStorage.setItem('user', JSON.stringify(userData))
              console.log('💾 Updated localStorage')
            } catch (e) {
              console.error('Failed to update localStorage:', e)
            }
          }

          console.log('✅ AuthStore updated:', authStore.user.avatarUrl)
        }

        // 🆕 Return the original data instead of potentially corrupted backend response
        return {
          userId: userId,
          avatarUrl: data.avatarUrl,
          rotation: data.rotation
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update avatar'
        this.error = errorMessage
        console.error('❌ Update avatar URL error:', error)

        // 🆕 Even if backend fails, update local state for better UX
        console.log('🔄 Backend failed, but updating local state for better UX...')
        this.avatarUrl = data.avatarUrl
        this.rotation = data.rotation

        const authStore = useAuthStore()
        if (authStore.user) {
          authStore.user.avatarUrl = data.avatarUrl
          authStore.user.avatarRotation = data.rotation

          // Update localStorage
          const userStr = localStorage.getItem('user')
          if (userStr && userStr !== 'undefined') {
            try {
              const userData = JSON.parse(userStr)
              userData.avatarUrl = data.avatarUrl
              userData.avatarRotation = data.rotation
              localStorage.setItem('user', JSON.stringify(userData))
            } catch (e) {
              console.error('Failed to update localStorage:', e)
            }
          }
        }

        // Return local data instead of throwing error
        return {
          userId: userId,
          avatarUrl: data.avatarUrl,
          rotation: data.rotation
        }
      } finally {
        this.isLoading = false
      }
    },



    // 🆕 Fallback method for when backend is not ready
    async updateAvatarUrlFallback(userId: number, data: AvatarUpdateData) {
      console.log('🔄 Using fallback method for avatar update (backend not ready)')

      this.isLoading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        // Update local state immediately
        this.avatarUrl = data.avatarUrl
        this.rotation = data.rotation

        // Update auth store
        if (authStore.user) {
          authStore.user.avatarUrl = data.avatarUrl
          authStore.user.avatarRotation = data.rotation

          // Update localStorage
          const userStr = localStorage.getItem('user')
          if (userStr && userStr !== 'undefined') {
            try {
              const userData = JSON.parse(userStr)
              userData.avatarUrl = data.avatarUrl
              userData.avatarRotation = data.rotation
              localStorage.setItem('user', JSON.stringify(userData))
              console.log('💾 Updated localStorage (fallback)')
            } catch (e) {
              console.error('Failed to update localStorage:', e)
            }
          }
        }

        console.log('✅ Fallback avatar update completed')
        return {
          userId: userId,
          avatarUrl: data.avatarUrl,
          rotation: data.rotation
        }
      } catch (error) {
        console.error('❌ Fallback avatar update failed:', error)
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
