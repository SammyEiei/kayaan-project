import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  aiContentService,
  type CreateGenerationRequest,
  type GenerationStatus,
  type SaveContentRequest,
  type SaveContentResponse,
  type SavedContentResponse,
  type CreateTemplateRequest,
  type CreateTemplateResponse,
  type TemplatesResponse,
} from '@/service/AIContentService'
import { rateLimiter } from '@/utils/rateLimiter'
import { aiGenerationWebSocket } from '@/service/aiGenerationWebSocket'
import { useAuthStore } from '@/stores/auth'

export const useAIGenerationStore = defineStore('aiGeneration', () => {
  // State
  const generationRequests = ref<GenerationStatus[]>([])
  const savedContent = ref<SavedContentResponse['content']>([])
  const templates = ref<TemplatesResponse['content']>([])
  const currentRequest = ref<GenerationStatus | null>(null)
  const isGenerating = ref(false)
  const generationProgress = ref(0)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const pagination = ref({
    requests: { page: 0, size: 10, totalElements: 0, totalPages: 0 },
    content: { page: 0, size: 10, totalElements: 0, totalPages: 0 },
    templates: { page: 0, size: 10, totalElements: 0, totalPages: 0 }
  })

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
      {} as Record<string, GenerationStatus[]>,
    )
    return grouped
  })

  const contentByFormat = computed(() => {
    const grouped = savedContent.value.reduce(
      (acc, content) => {
        if (!acc[content.contentType]) {
          acc[content.contentType] = []
        }
        acc[content.contentType].push(content)
        return acc
      },
      {} as Record<string, typeof savedContent.value>,
    )
    return grouped
  })

  const activeRequests = computed(() => {
    return generationRequests.value.filter(req =>
      req.status === 'PENDING' || req.status === 'PROCESSING'
    )
  })

  const completedRequests = computed(() => {
    return generationRequests.value.filter(req => req.status === 'COMPLETED')
  })

  const failedRequests = computed(() => {
    return generationRequests.value.filter(req => req.status === 'FAILED')
  })

  // Actions
  // ✅ แก้ไข method signature ให้รับ parameter แยก
  const createGenerationRequest = async (
    requestData: {
      promptText: string
      outputFormat: 'quiz' | 'flashcard' | 'note'
      maxRetries: number
      useTemplate: boolean
    },
    file?: File
  ): Promise<number> => {
    loading.value = true
    error.value = null

    console.log('🏪 Store: Creating generation request with data:', { requestData, file: file?.name })

    try {
      const authStore = useAuthStore()
      const userId = authStore.user?.id?.toString() || 'anonymous'

      // Check rate limiting
      if (!rateLimiter.canMakeRequest('generationRequests', userId)) {
        const remaining = rateLimiter.getRemainingRequests('generationRequests', userId)
        const resetTime = rateLimiter.getTimeUntilReset('generationRequests', userId)
        throw new Error(`Rate limit exceeded. ${remaining} requests remaining. Reset in ${rateLimiter.formatTimeRemaining(resetTime)}`)
      }

      // ✅ สร้าง data object ตามที่ AIContentService คาดหวัง
      const createRequestData: CreateGenerationRequest = {
        request: requestData,
        file: file
      }

      console.log('🔄 Store: Calling aiContentService.createGenerationRequest...')
      const requestId = await aiContentService.createGenerationRequest(createRequestData)
      console.log('📝 Store: Received requestId from service:', requestId, typeof requestId)

      // Validate requestId ใน store level ด้วย
      if (requestId === null || requestId === undefined) {
        console.error('❌ Store: Invalid requestId received from service:', requestId)
        throw new Error('Service returned invalid request ID')
      }

      if (typeof requestId !== 'number' || requestId <= 0) {
        console.error('❌ Store: RequestId is not valid:', typeof requestId, requestId)
        throw new Error(`Service returned invalid request ID: ${requestId}`)
      }

      // Add to requests list
      const newRequest: GenerationStatus = {
        requestId,
        status: 'PENDING',
        progress: 0,
        retryCount: 0,
        maxRetries: requestData.maxRetries || 3,
        createdAt: new Date().toISOString(),
      }

      generationRequests.value.unshift(newRequest)
      currentRequest.value = newRequest

      // Subscribe to WebSocket updates
      if (aiGenerationWebSocket.isConnected()) {
        aiGenerationWebSocket.subscribeToGeneration(requestId)
      }

      console.log('✅ Store: Request created successfully with ID:', requestId)
      return requestId
    } catch (err) {
      console.error('💥 Store: createGenerationRequest failed:', err)
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
        request.status = 'PROCESSING'
        request.startedAt = new Date().toISOString()
      }

      // Start polling for status updates
      pollGenerationStatus(requestId)
    } catch (err) {
      isGenerating.value = false
      error.value = err instanceof Error ? err.message : 'Failed to start generation'
      throw err
    }
  }

  const pollGenerationStatus = async (requestId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await aiContentService.getGenerationStatus(requestId)
        updateRequestStatus(requestId, status)

        if (status.status === 'COMPLETED' || status.status === 'FAILED' || status.status === 'CANCELLED') {
          clearInterval(pollInterval)
          isGenerating.value = false
          generationProgress.value = 0
        }
      } catch (error) {
        clearInterval(pollInterval)
        isGenerating.value = false
        setError(error instanceof Error ? error.message : 'Failed to get status')
      }
    }, 2000) // Poll every 2 seconds
  }

  const updateRequestStatus = (requestId: number, status: Partial<GenerationStatus>) => {
    const requestIndex = generationRequests.value.findIndex(r => r.requestId === requestId)
    if (requestIndex !== -1) {
      generationRequests.value[requestIndex] = { ...generationRequests.value[requestIndex], ...status }
    }

    if (currentRequest.value?.requestId === requestId) {
      currentRequest.value = { ...currentRequest.value, ...status }
    }

    if (status.progress !== undefined) {
      generationProgress.value = status.progress
    }
  }

  const updateRequestProgress = (requestId: number, progress: number) => {
    updateRequestStatus(requestId, { progress })
  }

  const cancelGeneration = async (requestId: number): Promise<void> => {
    try {
      await aiContentService.cancelGeneration(requestId)
      updateRequestStatus(requestId, { status: 'CANCELLED' })
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
      updateRequestStatus(requestId, {
        status: 'PENDING',
        retryCount: (currentRequest.value?.retryCount || 0) + 1
      })
      await startGeneration(requestId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to retry generation'
      throw err
    }
  }

  const saveContent = async (data: SaveContentRequest): Promise<SaveContentResponse> => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const userId = authStore.user?.id?.toString() || 'anonymous'

      // Check rate limiting
      if (!rateLimiter.canMakeRequest('contentSaves', userId)) {
        const remaining = rateLimiter.getRemainingRequests('contentSaves', userId)
        const resetTime = rateLimiter.getTimeUntilReset('contentSaves', userId)
        throw new Error(`Rate limit exceeded. ${remaining} saves remaining. Reset in ${rateLimiter.formatTimeRemaining(resetTime)}`)
      }

      const response = await aiContentService.saveContent(data)

      // Refresh saved content
      await loadSavedContent()

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save content'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadGenerationRequests = async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    loading.value = true
    error.value = null

    try {
      const response = await aiContentService.getGenerationRequests(page, size, sortBy, sortDir)
      generationRequests.value = response.content.map(item => ({
        requestId: item.id,
        status: item.status as GenerationStatus['status'],
        progress: item.progress,
        retryCount: 0,
        maxRetries: 3,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))

      pagination.value.requests = {
        page: response.currentPage,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load generation requests'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadSavedContent = async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    loading.value = true
    error.value = null

    try {
      const response = await aiContentService.getSavedContent(page, size, sortBy, sortDir)
      savedContent.value = response.content

      pagination.value.content = {
        page: response.currentPage,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load saved content'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (data: CreateTemplateRequest): Promise<CreateTemplateResponse> => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const userId = authStore.user?.id?.toString() || 'anonymous'

      // Check rate limiting
      if (!rateLimiter.canMakeRequest('templateCreation', userId)) {
        const remaining = rateLimiter.getRemainingRequests('templateCreation', userId)
        const resetTime = rateLimiter.getTimeUntilReset('templateCreation', userId)
        throw new Error(`Rate limit exceeded. ${remaining} templates remaining. Reset in ${rateLimiter.formatTimeRemaining(resetTime)}`)
      }

      const response = await aiContentService.createTemplate(data)

      // Refresh templates
      await loadTemplates()

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create template'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadTemplates = async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    loading.value = true
    error.value = null

    try {
      const response = await aiContentService.getTemplates(page, size, sortBy, sortDir)
      templates.value = response.content

      pagination.value.templates = {
        page: response.currentPage,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load templates'
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadContent = async (contentId: number): Promise<void> => {
    try {
      const blob = await aiContentService.downloadContent(contentId)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-content-${contentId}.txt`
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

      // Remove from local state
      const index = savedContent.value.findIndex(c => c.id === contentId)
      if (index !== -1) {
        savedContent.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete content'
      throw err
    }
  }

  const previewContent = async (data: CreateGenerationRequest['request']): Promise<string> => {
    try {
      const authStore = useAuthStore()
      const userId = authStore.user?.id?.toString() || 'anonymous'

      // Check rate limiting
      if (!rateLimiter.canMakeRequest('previews', userId)) {
        const remaining = rateLimiter.getRemainingRequests('previews', userId)
        const resetTime = rateLimiter.getTimeUntilReset('previews', userId)
        throw new Error(`Rate limit exceeded. ${remaining} previews remaining. Reset in ${rateLimiter.formatTimeRemaining(resetTime)}`)
      }

      return await aiContentService.previewContent({
        promptText: data.promptText,
        outputFormat: data.outputFormat,
        maxRetries: data.maxRetries
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to preview content'
      throw err
    }
  }

  const getGenerationStats = async () => {
    try {
      return await aiContentService.getGenerationStats()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get generation stats'
      throw err
    }
  }

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const connectWebSocket = async () => {
    try {
      const authStore = useAuthStore()
      if (authStore.token) {
        await aiGenerationWebSocket.connect(authStore.token)
      }
    } catch (err) {
      console.error('Failed to connect WebSocket:', err)
    }
  }

  const disconnectWebSocket = () => {
    aiGenerationWebSocket.disconnect()
  }

  // Initialize store
  const initialize = async () => {
    try {
      await Promise.all([
        loadGenerationRequests(),
        loadSavedContent(),
        loadTemplates()
      ])
      await connectWebSocket()
    } catch (err) {
      console.error('Failed to initialize AI Generation store:', err)
    }
  }

  return {
    // State
    generationRequests,
    savedContent,
    templates,
    currentRequest,
    isGenerating,
    generationProgress,
    error,
    loading,
    pagination,

    // Getters
    recentRequests,
    requestsByStatus,
    contentByFormat,
    activeRequests,
    completedRequests,
    failedRequests,

    // Actions
    createGenerationRequest,
    startGeneration,
    pollGenerationStatus,
    updateRequestStatus,
    updateRequestProgress,
    cancelGeneration,
    retryGeneration,
    saveContent,
    loadGenerationRequests,
    loadSavedContent,
    createTemplate,
    loadTemplates,
    downloadContent,
    deleteContent,
    previewContent,
    getGenerationStats,
    setError,
    clearError,
    connectWebSocket,
    disconnectWebSocket,
    initialize
  }
})
