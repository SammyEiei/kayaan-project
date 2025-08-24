import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  aiContentService,
  type AIContent,
  type GenerationRequest,
} from '@/service/AIContentService'

export const useAIContentStore = defineStore('aiContent', () => {
  // State
  const contentHistory = ref<AIContent[]>([])
  const currentContent = ref<AIContent | null>(null)
  const isGenerating = ref(false)
  const generationProgress = ref(0)

  // Getters
  const recentContent = computed(() => {
    return contentHistory.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  const contentByType = computed(() => {
    const grouped = contentHistory.value.reduce(
      (acc, content) => {
        if (!acc[content.type]) {
          acc[content.type] = []
        }
        acc[content.type].push(content)
        return acc
      },
      {} as Record<string, AIContent[]>,
    )
    return grouped
  })

  // Actions
  const generateContent = async (request: GenerationRequest) => {
    isGenerating.value = true
    generationProgress.value = 0

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        generationProgress.value += Math.random() * 20
        if (generationProgress.value >= 100) {
          clearInterval(progressInterval)
        }
      }, 500)

      // Use mock service for now
      const generatedContent = await aiContentService.mockGenerateContent(request)

      currentContent.value = generatedContent
      contentHistory.value.unshift(generatedContent)

      return generatedContent
    } catch (error) {
      console.error('Error generating content:', error)
      throw error
    } finally {
      isGenerating.value = false
      generationProgress.value = 0
    }
  }

  const saveContent = async (content: Partial<AIContent>) => {
    try {
      const savedContent = await aiContentService.saveContent(content)

      // Update in history if it exists
      const index = contentHistory.value.findIndex((c) => c.id === savedContent.id)
      if (index !== -1) {
        contentHistory.value[index] = savedContent
      } else {
        contentHistory.value.unshift(savedContent)
      }

      currentContent.value = savedContent
      return savedContent
    } catch (error) {
      console.error('Error saving content:', error)
      throw error
    }
  }

  const deleteContent = async (contentId: string) => {
    try {
      await aiContentService.deleteContent(contentId)

      // Remove from history
      contentHistory.value = contentHistory.value.filter((c) => c.id !== contentId)

      // Clear current content if it's the deleted one
      if (currentContent.value?.id === contentId) {
        currentContent.value = null
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      throw error
    }
  }

  const loadContentHistory = async () => {
    try {
      // Use mock service for now
      const history = await aiContentService.mockGetContentHistory()
      contentHistory.value = history
    } catch (error) {
      console.error('Error loading content history:', error)
      throw error
    }
  }

  const setCurrentContent = (content: AIContent | null) => {
    currentContent.value = content
  }

  const clearCurrentContent = () => {
    currentContent.value = null
  }

  return {
    // State
    contentHistory,
    currentContent,
    isGenerating,
    generationProgress,

    // Getters
    recentContent,
    contentByType,

    // Actions
    generateContent,
    saveContent,
    deleteContent,
    loadContentHistory,
    setCurrentContent,
    clearCurrentContent,
  }
})
