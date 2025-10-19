import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  aiContentService,
  type AIContent,
  type CreateGenerationRequest,
  type CreateGenerationRequestDTO,
  type GenerationStatusDTO,
  type AIGeneratedContent,
  type SaveContentRequest,
  type SaveContentDTO,
  type AIDraft,
} from '@/service/AIContentService'
import { rateLimiter } from '@/utils/rateLimiter'
import { aiGenerationWebSocket } from '@/service/aiGenerationWebSocket'

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

  // Ensure arrays are always initialized
  const getGenerationRequests = computed(() => generationRequests.value || [])
  const getSavedContent = computed(() => savedContent.value || [])

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
  const createGenerationRequest = async (data: CreateGenerationRequest): Promise<number> => {
    loading.value = true
    error.value = null

    try {
      // Check rate limiting
      const userId = 'current-user' // TODO: Get from auth store
      if (!rateLimiter.canMakeRequest('generationRequests', userId)) {
        const remaining = rateLimiter.getRemainingRequests('generationRequests', userId)
        const resetTime = rateLimiter.getTimeUntilReset('generationRequests', userId)
        throw new Error(`Rate limit exceeded. ${remaining} requests remaining. Reset in ${rateLimiter.formatTimeRemaining(resetTime)}`)
      }

      const requestId = await aiContentService.createGenerationRequest(data)

      // Add to requests list
      const newRequest: GenerationStatusDTO = {
        requestId,
        status: 'pending',
        progress: 0,
        retryCount: 0,
        maxRetries: data.request?.maxRetries || 3,
        createdAt: new Date().toISOString(),
      }

      generationRequests.value.unshift(newRequest)
      currentRequest.value = newRequest

      // Subscribe to WebSocket updates
      if (aiGenerationWebSocket.isConnected()) {
        aiGenerationWebSocket.subscribeToGeneration(requestId)
      }

      return requestId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create generation request'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Legacy method for backward compatibility
  const _createGenerationRequestLegacy = async (data: CreateGenerationRequestDTO): Promise<number> => {
    return createGenerationRequest({
      request: {
        promptText: data.promptText,
        outputFormat: data.outputFormat as 'flashcard' | 'quiz' | 'note',
        maxRetries: data.maxRetries || 3
      }
    })
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

        // Convert status to lowercase for consistency with fallback values
        const mappedStatus: GenerationStatusDTO = {
          requestId: status.requestId,
          status: status.status.toLowerCase() as 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
          progress: status.progress || 0,
          errorMessage: status.errorMessage,
          retryCount: status.retryCount || 0,
          maxRetries: status.maxRetries || 3,
          createdAt: status.createdAt || new Date().toISOString(),
          startedAt: status.startedAt,
          completedAt: status.completedAt
        }

        // Update request in list
        const requestIndex = generationRequests.value.findIndex(r => r.requestId === requestId)
        if (requestIndex !== -1) {
          generationRequests.value[requestIndex] = mappedStatus
        }

        // Update current request
        if (currentRequest.value?.requestId === requestId) {
          currentRequest.value = mappedStatus
        }

        // Update progress
        generationProgress.value = status.progress

        // Stop polling if completed or failed
        if (mappedStatus.status === 'completed' || mappedStatus.status === 'failed' || mappedStatus.status === 'cancelled') {
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
      // Convert SaveContentDTO to SaveContentRequest format
      const saveRequest: SaveContentRequest = {
        generationRequestId: data.requestId,
        contentTitle: data.title,
        contentType: data.outputFormat as 'flashcard' | 'quiz' | 'note',
        contentData: data.content,
        saveToSupabase: true
      }

      const response = await aiContentService.saveContent(saveRequest)

      // Add to saved content list
      const newContent: AIGeneratedContent = {
        id: response.contentId,
        title: data.title,
        content: data.content,
        outputFormat: data.outputFormat,
        requestId: data.requestId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isNew: true, // เนื้อหาใหม่ที่เพิ่งบันทึก
        hasBeenViewed: false // ยังไม่ได้ดู
      }

      savedContent.value.unshift(newContent)
      return response.contentId
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

      // Update generation request status to 'deleted' if it exists
      console.log('🔍 Looking for generation request with contentId:', contentId)
      console.log('📋 Available generation requests:', generationRequests.value.map(r => ({
        requestId: r.requestId,
        status: r.status,
        createdAt: r.createdAt
      })))

      const relatedRequest = generationRequests.value.find(r => r.requestId === contentId)
      if (relatedRequest) {
        relatedRequest.status = 'deleted'
        console.log('✅ Updated generation request status to deleted:', contentId)
        console.log('📋 Updated request:', relatedRequest)
      } else {
        console.log('❌ No generation request found for contentId:', contentId)
        console.log('💡 This might be because the requestId and contentId are different')
        console.log('📋 Available requests:', generationRequests.value.map(r => ({
          id: r.requestId,
          status: r.status
        })))
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete content'
      throw err
    }
  }

  const loadGenerationRequests = async (): Promise<void> => {
    loading.value = true
    try {
      const response = await aiContentService.getGenerationRequests()
      // Extract content array from response and map to GenerationStatusDTO format
      generationRequests.value = response.content.map(item => ({
        requestId: item.id,
        status: item.status.toLowerCase() as 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'deleted',
        progress: item.progress,
        retryCount: 0,
        maxRetries: 3,
        createdAt: item.createdAt,
        startedAt: item.createdAt,
        completedAt: item.updatedAt
      }))
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
      const response = await aiContentService.getSavedContent()
            // Extract content array from response
      savedContent.value = response.content.map(item => {
        // ตรวจสอบจาก localStorage ว่าเนื้อหานี้เคยถูกดูหรือไม่
        const viewedContentIds = JSON.parse(localStorage.getItem('viewedContentIds') || '[]')
        const hasBeenViewed = viewedContentIds.includes(item.id)

        // ตรวจสอบวันที่สร้างเพื่อกำหนดว่าเป็นเนื้อหาเก่าหรือไม่
        const createdAt = new Date(item.createdAt)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

        // เนื้อหาเก่าที่สร้างเกิน 2 วันจะถือว่าไม่ใช่ "ใหม่" แม้ว่าจะยังไม่ได้ดู
        const isOldContent = daysDiff > 2

        return {
          id: item.id,
          title: item.contentTitle,
          content: item.contentData || '', // ใช้ content data จาก response
          outputFormat: item.contentType as 'flashcard' | 'quiz' | 'note' | 'summary',
          requestId: 0, // Not available in this response
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
          isNew: !hasBeenViewed && !isOldContent, // ใหม่ = ยังไม่ได้ดู และไม่ใช่เนื้อหาเก่า
          hasBeenViewed: hasBeenViewed
        }
      })
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

  const markContentAsViewed = (contentId: number): void => {
    // อัปเดตสถานะใน store
    const content = savedContent.value.find(c => c.id === contentId)
    if (content) {
      content.hasBeenViewed = true
      content.isNew = false
    }

    // บันทึกใน localStorage
    const viewedContentIds = JSON.parse(localStorage.getItem('viewedContentIds') || '[]')
    if (!viewedContentIds.includes(contentId)) {
      viewedContentIds.push(contentId)
      localStorage.setItem('viewedContentIds', JSON.stringify(viewedContentIds))
    }
  }

  const resetViewedStatus = (): void => {
    // ลบข้อมูลการดูทั้งหมดจาก localStorage
    localStorage.removeItem('viewedContentIds')

    // รีเซ็ตสถานะใน store
    savedContent.value.forEach(content => {
      content.hasBeenViewed = false
      // ตรวจสอบวันที่สร้างเพื่อกำหนด isNew
      const createdAt = new Date(content.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      content.isNew = daysDiff <= 2 // ใหม่ = สร้างภายใน 2 วัน
    })
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
    getGenerationRequests,
    getSavedContent,

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
    markContentAsViewed,
    resetViewedStatus,
    clearError,
  }
})
