import AxiosClient from './AxiosClient'
import { useStudyStreakStore } from '@/stores/studyStreak'

// Data Models
export interface CreateGenerationRequest {
  request: {
    promptText: string
    outputFormat: 'flashcard' | 'quiz' | 'note'
    maxRetries?: number
  }
  file?: File // Optional uploaded file
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface GenerationStatus {
  requestId: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  progress: number // 0-100
  errorMessage?: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  retryCount: number
  maxRetries: number
}

export interface GenerationRequestsResponse {
  content: Array<{
    id: number
    promptText: string
    outputFormat: string
    status: string
    progress: number
    createdAt: string
    updatedAt: string
  }>
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export interface SaveContentRequest {
  generationRequestId: number
  contentTitle: string
  contentType: 'flashcard' | 'quiz' | 'note'
  contentData: string // JSON string
  saveToSupabase?: boolean
  customFileName?: string
}

export interface SaveContentResponse {
  contentId: number
  supabaseFilePath?: string
  fileSize?: number
}

export interface SavedContentResponse {
  content: Array<{
    id: number
    contentTitle: string
    contentType: string
    contentData?: string // เพิ่ม content data field
    contentVersion: number
    supabaseFilePath?: string
    fileSize?: number
    isSaved: boolean
    createdAt: string
  }>
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export interface CreateTemplateRequest {
  templateName: string
  templateDescription?: string
  promptText: string
  outputFormat: 'flashcard' | 'quiz' | 'note'
  isPublic?: boolean
  isActive?: boolean
}

export interface CreateTemplateResponse {
  templateId: number
  templateName: string
  usageCount: number
}

export interface TemplatesResponse {
  content: Array<{
    id: number
    templateName: string
    templateDescription?: string
    promptText: string
    outputFormat: string
    isPublic: boolean
    isActive: boolean
    usageCount: number
    createdAt: string
  }>
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

// Legacy interfaces for backward compatibility
export interface CreateGenerationRequestDTO {
  promptText: string
  outputFormat: string
  additionalContext?: string
  maxRetries?: number
  useTemplate?: boolean
  templateId?: number
}

export interface ApiResponseDTO<T> {
  success: boolean
  message?: string
  data?: T
  errorCode?: string
  timestamp: string
}

export interface GenerationStatusDTO {
  requestId: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'deleted'
  progress: number
  errorMessage?: string
  retryCount: number
  maxRetries: number
  createdAt: string
  startedAt?: string
  completedAt?: string
}

export interface AIContent {
  id: string
  type: 'summary' | 'quiz' | 'flashcard' | 'notes'
  title: string
  content: string
  sourcePrompt: string
  sourceFileUrl?: string
  createdAt: Date
  isShared: boolean
}

export interface AIPromptTemplate {
  id: number
  name: string
  description: string
  promptText: string
  outputFormat: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface SaveContentDTO {
  requestId: number
  title: string
  content: string
  outputFormat: string
}

export interface AIGeneratedContent {
  id: number
  title: string
  content: string
  outputFormat: string
  requestId: number
  createdAt: string
  updatedAt: string
  isNew?: boolean
  hasBeenViewed?: boolean
}

export interface AIJob {
  id: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: string
  data: Record<string, unknown>
  createdAt: string
  updatedAt?: string
}

export interface AIDraft {
  id: number
  title: string
  content: string
  promptText: string
  outputFormat: string
  status?: string
  createdAt: string
  updatedAt: string
}

class AIContentService {
  private client = AxiosClient
  private baseUrl = '/ai/generation'  // ไม่ใส่ /api เพราะ AxiosClient จะเพิ่มให้อัตโนมัติ

  // 1. Generation Requests - New API endpoints
  async createGenerationRequest(data: CreateGenerationRequest): Promise<number> {
    const formData = new FormData()
    formData.append('request', JSON.stringify(data.request))

    if (data.file) {
      formData.append('file', data.file)
    }

    console.log('🚀 Sending generation request:', {
      request: data.request,
      file: data.file ? data.file.name : 'none',
      hasFile: !!data.file,
      url: `${this.baseUrl}/request`
    })

    try {
      const fullUrl = `${this.baseUrl}/request`
      console.log('📤 About to send POST request to:', fullUrl)
      console.log('📦 FormData contents check:', formData.has('request'), formData.has('file'))
      console.log('🔧 AxiosClient baseURL:', this.client.defaults.baseURL)
      console.log('🌐 Full URL will be:', `${this.client.defaults.baseURL}${fullUrl}`)

      // AxiosClient จะจัดการ Authorization header ให้เองแล้ว
      // ไม่ต้องส่ง Content-Type เพราะ browser จะตั้งให้อัตโนมัติสำหรับ FormData
      const response = await this.client.post(fullUrl, formData)

      console.log('📡 Response received successfully!')
      console.log('📊 Response status:', response.status)
      console.log('📄 Response data:', response.data)
      console.log('🔍 Response data type:', typeof response.data)
      console.log('🏷️ Response data keys:', Object.keys(response.data || {}))

      if (!response.data) {
        console.error('❌ No response data received')
        throw new Error('No response data received from server')
      }

      console.log('🔍 Checking response.data.success:', response.data.success)
      if (!response.data.success) {
        console.error('❌ Request failed:', response.data.message)
        throw new Error(response.data.message || 'Generation request failed')
      }

      // Backend ส่ง requestId - ลองหาใน data field หลายๆ รูปแบบ
      console.log('🎯 Extracting requestId from response.data.data:', response.data.data)
      console.log('🔢 Type of response.data.data:', typeof response.data.data)

      let requestId = response.data.data

      // ถ้า requestId เป็น undefined ลองหาใน path อื่น
      if (!requestId && requestId !== 0) {
        console.log('🔍 response.data.data is undefined, trying alternative paths...')

        // ลอง response.data.requestId
        if (response.data.requestId) {
          console.log('📍 Found requestId in response.data.requestId:', response.data.requestId)
          requestId = response.data.requestId
        }
        // ลอง response.data.id
        else if (response.data.id) {
          console.log('📍 Found requestId in response.data.id:', response.data.id)
          requestId = response.data.id
        }
        // ลอง response.data ตรงๆ (ถ้าเป็น number)
        else if (typeof response.data === 'number') {
          console.log('📍 response.data is a number directly:', response.data)
          requestId = response.data
        }
        // ลอง nested object
        else if (response.data.data && typeof response.data.data === 'object') {
          console.log('📍 response.data.data is object, checking nested fields...')
          if (response.data.data.requestId) {
            requestId = response.data.data.requestId
          } else if (response.data.data.id) {
            requestId = response.data.data.id
          }
        }
      }

      console.log('📝 Final extracted requestId:', requestId, 'Type:', typeof requestId)

      if (!requestId && requestId !== 0) {
        console.error('❌ Could not find requestId in any expected location')
        console.error('🔍 Full response.data structure:', JSON.stringify(response.data, null, 2))
        throw new Error('Invalid request ID received from server - could not locate requestId in response')
      }

      if (typeof requestId !== 'number') {
        console.error('❌ RequestId is not a number:', typeof requestId, requestId)
        // ลองแปลงเป็น number
        const parsedId = Number(requestId)
        if (isNaN(parsedId)) {
          throw new Error(`Request ID must be a number, got ${typeof requestId}: ${requestId}`)
        }
        console.log('⚠️ Converting requestId to number:', parsedId)
        return parsedId
      }

      if (requestId < 0) {
        console.error('❌ RequestId is negative:', requestId)
        throw new Error('Request ID cannot be negative')
      }

      console.log('✅ Request created successfully with ID:', requestId)
      return requestId

    } catch (error: unknown) {
      console.error('💥 CreateGenerationRequest failed:', error)

      const axiosError = error as { response?: { status: number; statusText: string; data?: unknown }; request?: unknown }

      console.error('🚨 Full error object:', error)

      if (axiosError && axiosError.response) {
        // Backend ตอบกลับมา แต่มี error status
        console.error('📡 Backend responded with error:')
        console.error('   Status:', axiosError.response.status)
        console.error('   StatusText:', axiosError.response.statusText)
        console.error('   Data:', axiosError.response.data)
        console.error('   Data Type:', typeof axiosError.response.data)

        // ลองดู structure ของ response data
        if (axiosError.response.data && typeof axiosError.response.data === 'object') {
          console.error('   Data Keys:', Object.keys(axiosError.response.data))
          console.error('   Data JSON:', JSON.stringify(axiosError.response.data, null, 2))
        }

        const errorData = axiosError.response.data as {
          success?: boolean
          error?: string
          message?: string
        }

        if (errorData && errorData.message) {
          // Enhanced error handling for specific error types
          let errorMessage = errorData.message

          // Clean up duplicate error messages
          if (errorMessage.includes('Failed to create generation request: Failed to create generation request:')) {
            errorMessage = errorMessage.replace('Failed to create generation request: Failed to create generation request:', 'Failed to create generation request:')
          }

          // Handle rate limit with specific error type
          if (errorData.error === 'GENERATION_REQUEST_FAILED' && errorMessage.toLowerCase().includes('rate limit')) {
            throw new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded. Please wait before making another request.')
          } else if (errorMessage.toLowerCase().includes('rate limit')) {
            throw new Error('RATE_LIMIT_EXCEEDED: Rate limit exceeded. Please wait before making another request.')
          } else if (errorData.error === 'GENERATION_REQUEST_FAILED') {
            throw new Error(`GENERATION_FAILED: ${errorMessage}`)
          } else {
            throw new Error(`Backend error: ${errorMessage}`)
          }
        } else {
          throw new Error(`HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`)
        }
      } else if (axiosError && axiosError.request) {
        // Request ส่งออกไปแล้ว แต่ไม่ได้รับ response
        console.error('🌐 No response from backend - Request details:')
        console.error('   Request object:', axiosError.request)
        throw new Error('Cannot connect to backend server. Please check if the server is running.')
      } else {
        // Error อื่นๆ เช่น setup request ผิด
        console.error('⚙️ Request setup error:', error)
        if (error instanceof Error) {
          console.error('   Error message:', error.message)
          console.error('   Error stack:', error.stack)
          throw error
        }
        throw new Error('Failed to create generation request')
      }
    }
  }

  async getGenerationStatus(requestId: number): Promise<GenerationStatus> {
    const response = await this.client.get(`${this.baseUrl}/status/${requestId}`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  async startGeneration(requestId: number): Promise<void> {
    // ตรวจสอบ requestId ก่อนส่ง
    if (!requestId && requestId !== 0) {
      throw new Error(`Invalid requestId: ${requestId}`)
    }

    if (typeof requestId !== 'number') {
      throw new Error(`RequestId must be a number, got ${typeof requestId}: ${requestId}`)
    }

    if (requestId < 0) {
      throw new Error(`RequestId cannot be negative: ${requestId}`)
    }

    console.log('🎯 Starting generation for ID:', requestId)

    try {
      const response = await this.client.post(`${this.baseUrl}/${requestId}/generate`)

      console.log('📡 Start generation response:', {
        status: response.status,
        data: response.data
      })

      if (!response.data.success) {
        console.error('❌ Start generation failed:', response.data.message)
        throw new Error(response.data.message || 'Failed to start generation')
      }

      console.log('✅ Generation started successfully for ID:', requestId)

    } catch (error) {
      console.error('💥 StartGeneration failed for ID:', requestId, error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to start generation')
    }
  }

  async retryGeneration(requestId: number): Promise<void> {
    const response = await this.client.post(`${this.baseUrl}/${requestId}/retry`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  }

  async getGenerationRequests(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<GenerationRequestsResponse> {
    const response = await this.client.get(`${this.baseUrl}/requests?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  // 2. Content Management - New API endpoints
  async saveContent(data: SaveContentRequest): Promise<SaveContentResponse> {
    const response = await this.client.post(`${this.baseUrl}/content/save`, data)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    // 🔥 Update Study Streak - AI generated content saved
    try {
      console.log('🔥 AIContentService: Starting streak update process...')
      const streakStore = useStudyStreakStore()
      const contentId = response.data.data.id

      console.log('🔥 AIContentService: Updating study streak for AI content save', {
        contentId,
        contentType: data.contentType,
        contentTitle: data.contentTitle
      })

      const result = await streakStore.completeContentCreation(
        contentId,
        `Saved AI generated ${data.contentType}: ${data.contentTitle}`
      )

      console.log('✅ AIContentService: Study streak updated successfully', result)
    } catch (streakError) {
      console.error('❌ AIContentService: Failed to update study streak', streakError)
      console.error('❌ Error details:', {
        message: (streakError as Error).message,
        stack: (streakError as Error).stack
      })
      // ไม่ throw error เพื่อไม่ให้กระทบการ save content
    }

    return response.data.data
  }

  async getSavedContent(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<SavedContentResponse> {
    const response = await this.client.get(`${this.baseUrl}/content?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  // Legacy methods for backward compatibility
  async createGenerationRequestLegacy(data: CreateGenerationRequestDTO): Promise<number> {
    const response = await this.client.post(`${this.baseUrl}/create`, data)
    return response.data.data.requestId
  }

  async getGenerationRequestsLegacy(): Promise<GenerationStatusDTO[]> {
    const response = await this.client.get(`${this.baseUrl}/requests`)
    return response.data.data
  }

  async getSavedContentLegacy(): Promise<AIGeneratedContent[]> {
    const response = await this.client.get(`${this.baseUrl}/content`)
    return response.data.data
  }

  async downloadContent(contentId: number): Promise<Blob> {
    const response = await this.client.get(`${this.baseUrl}/content/${contentId}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  async deleteContent(contentId: number): Promise<void> {
    await this.client.delete(`${this.baseUrl}/content/${contentId}`)
  }

  async cancelGeneration(requestId: number): Promise<void> {
    const response = await this.client.post(`${this.baseUrl}/${requestId}/cancel`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  }

  // Additional methods for templates and stats
  async createTemplate(data: CreateTemplateRequest): Promise<CreateTemplateResponse> {
    const response = await this.client.post(`${this.baseUrl}/templates`, data)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  async getTemplates(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<TemplatesResponse> {
    const response = await this.client.get(`${this.baseUrl}/templates?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  async previewContent(data: { promptText: string; outputFormat: string; maxRetries?: number }): Promise<string> {
    const response = await this.client.post(`${this.baseUrl}/preview`, data)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }

  async getGenerationStats(): Promise<Record<string, unknown>> {
    const response = await this.client.get(`${this.baseUrl}/stats`)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    return response.data.data
  }
}

export const aiContentService = new AIContentService()
