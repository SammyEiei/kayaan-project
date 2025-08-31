import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ContentInfoService, { type ContentInfo, type CreateContentInfoRequest, type UpdateContentInfoRequest } from '../service/ContentInfoService'
import { useAuthStore } from './auth'

export const useContentInfoStore = defineStore('contentInfo', () => {
  const contentInfoList = ref<ContentInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed properties
  const activeContent = computed(() => contentInfoList.value.filter(content => content.isActive))

  const contentByType = computed(() => (type: 'QUIZ' | 'NOTE' | 'FLASHCARD') =>
    activeContent.value.filter(content => content.contentType === type)
  )

  const contentBySubject = computed(() => (subject: string) =>
    activeContent.value.filter(content =>
      content.subject.toLowerCase().includes(subject.toLowerCase())
    )
  )

  const contentByDifficulty = computed(() => (difficulty: string) =>
    activeContent.value.filter(content =>
      content.difficulty.toLowerCase() === difficulty.toLowerCase()
    )
  )

  // Actions
  const fetchAllContent = async () => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const content = await ContentInfoService.getContentInfoByUsername(authStore.user.username)
      contentInfoList.value = content
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch content'
      console.error('Error fetching content:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchContentByType = async (type: 'QUIZ' | 'NOTE' | 'FLASHCARD') => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const content = await ContentInfoService.getContentInfoByUsernameAndType(authStore.user.username, type)
      // Update only content of this type
      contentInfoList.value = contentInfoList.value.filter(c => c.contentType !== type)
      contentInfoList.value.push(...content)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch content by type'
      console.error('Error fetching content by type:', err)
    } finally {
      loading.value = false
    }
  }

  const createContent = async (data: CreateContentInfoRequest) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const newContent = await ContentInfoService.createContentInfo(data)
      contentInfoList.value.push(newContent)
      return newContent
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create content'
      console.error('Error creating content:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateContent = async (id: string, data: UpdateContentInfoRequest) => {
    loading.value = true
    error.value = null

    try {
      const updatedContent = await ContentInfoService.updateContentInfo(id, data)
      const index = contentInfoList.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contentInfoList.value[index] = updatedContent
      }
      return updatedContent
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update content'
      console.error('Error updating content:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteContent = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await ContentInfoService.softDeleteContentInfo(id)
      const index = contentInfoList.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contentInfoList.value[index].isActive = false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete content'
      console.error('Error deleting content:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    contentInfoList.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    contentInfoList,
    loading,
    error,

    // Computed
    activeContent,
    contentByType,
    contentBySubject,
    contentByDifficulty,

    // Actions
    fetchAllContent,
    fetchContentByType,
    createContent,
    updateContent,
    deleteContent,
    clearError,
    reset,
  }
})
