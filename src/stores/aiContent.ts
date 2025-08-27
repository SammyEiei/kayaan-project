import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  aiContentService,
  type AIContent,
  type CreateGenerationRequestDTO,
  type GenerationStatusDTO,
  type AIPromptTemplate,
  type AIGeneratedContent,
  type SaveContentDTO,
  type AIDraft,
} from '@/service/AIContentService'

export const useAIContentStore = defineStore('aiContent', () => {
  // State
  const generationRequests = ref<GenerationStatusDTO[]>([])
  const savedContent = ref<AIGeneratedContent[]>([])
  const drafts = ref<AIDraft[]>([])
  const currentRequest = ref<GenerationStatusDTO | null>(null)
  const currentContent = ref<AIContent | null>(null)
  const isGenerating = ref(false)
  const generationProgress = ref(0)
  const error = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const recentRequests = computed(() => {
    return generationRequests.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  const requestsByStatus = computed(() => {
    const grouped = generationRequests.value.reduce(
      (acc, request) => {
        if (!acc[request.status]) {
          acc[request.status] = []
        }
        acc[request.status].push(request)
        return acc
      },
      {} as Record<string, GenerationStatusDTO[]>,
    )
    return grouped
  })

  const contentByFormat = computed(() => {
    const grouped = savedContent.value.reduce(
      (acc, content) => {
        if (!acc[content.outputFormat]) {
          acc[content.outputFormat] = []
        }
        acc[content.outputFormat].push(content)
        return acc
      },
      {} as Record<string, AIGeneratedContent[]>,
    )
    return grouped
  })



  // Actions
  const createGenerationRequest = async (data: CreateGenerationRequestDTO): Promise<number> => {
    loading.value = true
    error.value = null

    try {
      const requestId = await aiContentService.createGenerationRequest(data)

      // Add to requests list
      const newRequest: GenerationStatusDTO = {
        requestId,
        status: 'pending',
        progress: 0,
        retryCount: 0,
        maxRetries: data.maxRetries || 3,
        createdAt: new Date().toISOString(),
      }

      generationRequests.value.unshift(newRequest)
      currentRequest.value = newRequest

      return requestId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create generation request'
      throw err
    } finally {
      loading.value = false
    }
  }

  const startGeneration = async (requestId: number): Promise<void> => {
    isGenerating.value = true
    generationProgress.value = 0

    try {
      await aiContentService.startGeneration(requestId)

      // Update request status
      const request = generationRequests.value.find(r => r.requestId === requestId)
      if (request) {
        request.status = 'processing'
        request.startedAt = new Date().toISOString()
      }

      // Start polling for status
      pollGenerationStatus(requestId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start generation'
      throw err
    }
  }

  const pollGenerationStatus = async (requestId: number): Promise<void> => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await aiContentService.getGenerationStatus(requestId)

        // Update request in list
        const requestIndex = generationRequests.value.findIndex(r => r.requestId === requestId)
        if (requestIndex !== -1) {
          generationRequests.value[requestIndex] = status
        }

        // Update current request
        if (currentRequest.value?.requestId === requestId) {
          currentRequest.value = status
        }

        // Update progress
        generationProgress.value = status.progress

        // Stop polling if completed or failed
        if (status.status === 'completed' || status.status === 'failed' || status.status === 'cancelled') {
          clearInterval(pollInterval)
          isGenerating.value = false
          generationProgress.value = 0
        }
      } catch (err) {
        console.error('Error polling generation status:', err)
        clearInterval(pollInterval)
        isGenerating.value = false
        error.value = 'Failed to get generation status'
      }
    }, 2000) // Poll every 2 seconds
  }

  const cancelGeneration = async (requestId: number): Promise<void> => {
    try {
      await aiContentService.cancelGeneration(requestId)

      // Update request status
      const request = generationRequests.value.find(r => r.requestId === requestId)
      if (request) {
        request.status = 'cancelled'
      }

      isGenerating.value = false
      generationProgress.value = 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel generation'
      throw err
    }
  }

  const retryGeneration = async (requestId: number): Promise<void> => {
    try {
      await aiContentService.retryGeneration(requestId)

      // Update request status
      const request = generationRequests.value.find(r => r.requestId === requestId)
      if (request) {
        request.status = 'pending'
        request.retryCount += 1
      }

      // Start generation again
      await startGeneration(requestId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to retry generation'
      throw err
    }
  }

  const saveContent = async (data: SaveContentDTO): Promise<number> => {
    try {
      const contentId = await aiContentService.saveContent(data)

      // Add to saved content list
      const newContent: AIGeneratedContent = {
        id: contentId,
        title: data.title,
        content: data.content,
        outputFormat: data.outputFormat,
        requestId: data.requestId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      savedContent.value.unshift(newContent)
      return contentId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save content'
      throw err
    }
  }

  const downloadContent = async (contentId: number): Promise<void> => {
    try {
      // Find the content to get its details
      const content = savedContent.value.find(c => c.id === contentId)
      if (!content) {
        throw new Error('Content not found')
      }

      // Create content for download based on format
      let downloadContent = ''
      let fileName = ''
      let fileType = ''

      switch (content.outputFormat) {
        case 'summary':
          downloadContent = `# ${content.title}\n\n${content.content}`
          fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}_summary`
          fileType = 'text/markdown'
          break
        case 'quiz':
          downloadContent = `# ${content.title}\n\n${content.content}`
          fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}_quiz`
          fileType = 'text/markdown'
          break
        case 'flashcard':
          downloadContent = `# ${content.title}\n\n${content.content}`
          fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}_flashcards`
          fileType = 'text/markdown'
          break
        case 'note':
          downloadContent = `# ${content.title}\n\n${content.content}`
          fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}_notes`
          fileType = 'text/markdown'
          break
        default:
          downloadContent = content.content
          fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, '_')}`
          fileType = 'text/plain'
      }

      // Create blob and download
      const blob = new Blob([downloadContent], { type: fileType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download content'
      throw err
    }
  }

  const deleteContent = async (contentId: number): Promise<void> => {
    try {
      await aiContentService.deleteContent(contentId)

      // Remove from saved content list
      savedContent.value = savedContent.value.filter(c => c.id !== contentId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete content'
      throw err
    }
  }

  const loadGenerationRequests = async (): Promise<void> => {
    loading.value = true
    try {
      const requests = await aiContentService.getGenerationRequests()
      generationRequests.value = requests
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load generation requests'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadSavedContent = async (): Promise<void> => {
    loading.value = true
    try {
      const content = await aiContentService.getSavedContent()
      savedContent.value = content
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load saved content'
      throw err
    } finally {
      loading.value = false
    }
  }



  const previewContent = async (data: CreateGenerationRequestDTO): Promise<string> => {
    try {
      return await aiContentService.previewContent(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to preview content'
      throw err
    }
  }

  const setCurrentRequest = (request: GenerationStatusDTO | null) => {
    currentRequest.value = request
  }

  const setCurrentContent = (content: AIContent | null) => {
    currentContent.value = content
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    generationRequests,
    savedContent,
    drafts,
    currentRequest,
    currentContent,
    isGenerating,
    generationProgress,
    error,
    loading,

    // Getters
    recentRequests,
    requestsByStatus,
    contentByFormat,

    // Actions
    createGenerationRequest,
    startGeneration,
    cancelGeneration,
    retryGeneration,
    saveContent,
    downloadContent,
    deleteContent,
    loadGenerationRequests,
    loadSavedContent,

    previewContent,
    setCurrentRequest,
    setCurrentContent,
    clearError,
  }
})
