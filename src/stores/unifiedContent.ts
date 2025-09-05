import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UnifiedContentService, type UnifiedContentDTO, type UnifiedContentParams } from '@/service/UnifiedContentService'

export const useUnifiedContentStore = defineStore('unifiedContent', () => {
  // State
  const content = ref<UnifiedContentDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const summary = ref({
    totalAiContent: 0,
    totalManualContent: 0,
    contentTypeCounts: {
      quiz: 0,
      flashcard: 0,
      note: 0
    }
  })

  // Getters
  const allContent = computed(() => content.value)

  const contentByType = computed(() => (type: 'quiz' | 'flashcard' | 'note') =>
    content.value.filter(item => item.contentType === type)
  )

  const contentBySource = computed(() => (source: 'ai' | 'manual') =>
    content.value.filter(item => item.source === source)
  )

  const recentContent = computed(() =>
    content.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  )

  const contentStats = computed(() => summary.value)

  // Actions
  const fetchContent = async (params: UnifiedContentParams = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await UnifiedContentService.getUserContent(params)
      content.value = response.content
      summary.value = response.summary
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch content'
      console.error('Error fetching unified content:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshContent = async () => {
    await fetchContent()
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    content.value = []
    loading.value = false
    error.value = null
    summary.value = {
      totalAiContent: 0,
      totalManualContent: 0,
      contentTypeCounts: {
        quiz: 0,
        flashcard: 0,
        note: 0
      }
    }
  }

  return {
    // State
    content,
    loading,
    error,
    summary,

    // Getters
    allContent,
    contentByType,
    contentBySource,
    recentContent,
    contentStats,

    // Actions
    fetchContent,
    refreshContent,
    clearError,
    reset,
  }
})
