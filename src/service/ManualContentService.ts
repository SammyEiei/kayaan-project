/**
 * Manual Content Service - New JSON-based API
 * Will replace individual QuizService, NoteService, FlashcardService
 */

import api from './api'
import { useAuthStore } from '../stores/auth'
import { JSONContentValidator, type QuizJSON, type NoteJSON, type FlashcardJSON } from '../utils/jsonContentValidators'

// Response interfaces
export interface ManualContentResponse {
  id: number
  contentTitle: string
  contentType: 'quiz' | 'note' | 'flashcard'
  contentData: string // JSON string
  subject: string
  difficulty: string
  tags: string[]
  createdByUsername: string
  createdAt: string
  updatedAt: string
}

export interface ManualContentListResponse {
  content: ManualContentResponse[]
  totalElements: number
  currentPage: number
  totalPages: number
  size: number
  success: boolean
  message: string
}

export interface CreateContentResponse {
  id: number
  success: boolean
  message: string
}

export interface UpdateContentResponse {
  success: boolean
  message: string
}

export interface DeleteContentResponse {
  success: boolean
  message: string
}

export interface ManualContentRequest {
  contentTitle: string
  contentType: 'quiz' | 'note' | 'flashcard'
  contentData: string // JSON string
  subject: string
  difficulty: string
  tags: string[]
}

/**
 * Manual Content Service for JSON-based content management
 * This will be the future replacement for individual content services
 */
export class ManualContentService {
  private static readonly BASE_URL = '/content/manual'
  private static readonly DEVELOPMENT_MODE = import.meta.env.DEV

  /**
   * Check if JSON APIs are available
   */
  private static async isJSONAPIReady(): Promise<boolean> {
    try {
      console.log('🔧 Checking JSON API readiness at:', `${this.BASE_URL}/stats`)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}/stats`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      const response = await api.get(`${this.BASE_URL}/stats`)
      return response.status === 200
    } catch (error) {
      console.warn('🔄 JSON APIs not ready yet')
      if (this.DEVELOPMENT_MODE) {
        console.error('❌ API readiness check failed:', error)
      }
      return false
    }
  }

  /**
   * Create new manual content (JSON format)
   */
  static async createContent(request: ManualContentRequest): Promise<CreateContentResponse> {
    try {
      console.log('🚀 Creating manual content...')
      console.log('📋 Request data:', request)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to create content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      // ✅ ตรวจสอบว่า contentData ไม่ว่างเปล่า
      if (!request.contentData || request.contentData.trim() === '') {
        throw new Error('Content data cannot be empty');
      }

      // ✅ ตรวจสอบ JSON structure
      let parsedContent: QuizJSON | NoteJSON | FlashcardJSON;
      try {
        parsedContent = JSON.parse(request.contentData);
      } catch (parseError) {
        throw new Error('Invalid JSON format in contentData');
      }

      // ✅ ตรวจสอบ content structure ตาม type
      if (!this.validateContentStructure(parsedContent, request.contentType)) {
        throw new Error(`Invalid content structure for ${request.contentType}`);
      }

      const response = await api.post(this.BASE_URL, request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Content created successfully')
      console.log('📡 Response status:', response.status)
      console.log('📡 Response data:', response.data)

      return response.data
    } catch (error: unknown) {
      console.error('❌ Content creation failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: { message?: string; error?: string }
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw error
    }
  }

  /**
   * Get all manual content for current user
   */
  static async getAllContent(page = 0, size = 20): Promise<ManualContentResponse[]> {
    try {
      console.log('🌐 Making API call to:', `${this.BASE_URL}?page=${page}&size=${size}`)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}?page=${page}&size=${size}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to fetch content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.get(`${this.BASE_URL}?page=${page}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Response status:', response.status)
      console.log('📡 Response data:', response.data)

      // Backend ส่ง array โดยตรง ไม่มี success field
      if (Array.isArray(response.data)) {
        console.log('✅ Content fetched:', response.data.length, 'items')
        return response.data
      } else {
        console.error('❌ Invalid response format from backend:', response.data)
        throw new Error('Invalid response format from backend')
      }

    } catch (error: unknown) {
      console.error('❌ Content fetch failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw new Error('Failed to fetch content')
    }
  }

  /**
   * Get manual content by type
   */
  static async getContentByType(type: 'quiz' | 'note' | 'flashcard'): Promise<ManualContentResponse[]> {
    try {
      console.log('🌐 Making API call to:', `${this.BASE_URL}?type=${type}`)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}?type=${type}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to fetch content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.get(`${this.BASE_URL}?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Response status:', response.status)
      console.log('📡 Response data:', response.data)

      // Backend ส่ง array โดยตรง
      if (Array.isArray(response.data)) {
        console.log('✅ Content by type fetched:', response.data.length, 'items')
        return response.data
      } else {
        console.error('❌ Invalid response format from backend:', response.data)
        throw new Error('Invalid response format from backend')
      }

    } catch (error: unknown) {
      console.error('❌ Content fetch by type failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw new Error('Failed to fetch content by type')
    }
  }

  /**
   * Get manual content by user
   */
  static async getContentByUser(): Promise<ManualContentResponse[]> {
    try {
      console.log('🌐 Making API call to:', `${this.BASE_URL}/user`)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}/user`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to fetch content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.get(`${this.BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Response status:', response.status)
      console.log('📡 Response data:', response.data)

      // Backend ส่ง array โดยตรง
      if (Array.isArray(response.data)) {
        console.log('✅ User content fetched:', response.data.length, 'items')
        return response.data
      } else {
        console.error('❌ Invalid response format from backend:', response.data)
        throw new Error('Invalid response format from backend')
      }

    } catch (error: unknown) {
      console.error('❌ User content fetch failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw new Error('Failed to fetch user content')
    }
  }

  /**
   * Get specific content by ID
   */
  static async getContentById(id: number): Promise<ManualContentResponse> {
    try {
      console.log('🌐 Making API call to:', `${this.BASE_URL}/${id}`)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}/${id}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to fetch content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.get(`${this.BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Response status:', response.status)
      console.log('📡 Response data:', response.data)

      return response.data
    } catch (error: unknown) {
      console.error('❌ Content fetch by ID failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw new Error('Failed to fetch content by ID')
    }
  }

  /**
   * Update existing content
   */
  static async updateContent(id: number, request: ManualContentRequest): Promise<UpdateContentResponse> {
    try {
      console.log('🔄 Updating content:', id)
      console.log('📋 Request data:', request)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}/${id}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to update content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.put(`${this.BASE_URL}/${id}`, request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Content updated successfully')
      console.log('📡 Response status:', response.status)
      console.log('📡 Response data:', response.data)

      return response.data
    } catch (error: unknown) {
      console.error('❌ Content update failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw error
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(id: number): Promise<DeleteContentResponse> {
    try {
      console.log('🗑️ Deleting content:', id)
      console.log('🔧 Full URL will be:', `${api.defaults.baseURL}${this.BASE_URL}/${id}`)
      console.log('🔧 API baseURL:', api.defaults.baseURL)
      console.log('🔧 ManualContentService BASE_URL:', this.BASE_URL)

      // Get auth token from store
      const authStore = useAuthStore()
      const token = authStore.token

      if (!token) {
        throw new Error('Authentication required. Please log in to delete content.')
      }

      console.log('🔑 Using auth token:', token.substring(0, 20) + '...')

      const response = await api.delete(`${this.BASE_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ Content deleted successfully')
      console.log('📡 Response status:', response.status)
      console.log('📡 Response data:', response.data)

      return response.data
    } catch (error: unknown) {
      console.error('❌ Content deletion failed:', error)
      const axiosError = error as {
        message?: string;
        response?: {
          status?: number;
          statusText?: string;
          data?: unknown
        };
        config?: {
          url?: string;
          baseURL?: string
        }
      }
      console.error('❌ Error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        baseURL: axiosError.config?.baseURL
      })
      throw error
    }
  }

  /**
   * Helper method to convert current format to new JSON format
   */
  static async migrateToJSONFormat(
    oldData: Record<string, unknown>,
    contentType: 'quiz' | 'note' | 'flashcard',
    metadata: {
      title: string
      subject: string
      difficulty: string
      tags: string[]
    }
  ): Promise<ManualContentRequest> {
    let jsonContent: QuizJSON | NoteJSON | FlashcardJSON

    switch (contentType) {
      case 'quiz':
        jsonContent = {
          topic: metadata.title,
          type: 'quiz',
          questions: (oldData.questions as Array<Record<string, unknown>>).map((q, index: number) => ({
            id: index + 1,
            type: 'multiple-choice',
            question: String(q.questionText || q.question || ''),
            options: (q.choices || q.options || []) as string[],
            correctAnswer: String(q.correctAnswer || ''),
            explanation: q.explanation ? String(q.explanation) : undefined
          }))
        }
        break

      case 'note':
        jsonContent = {
          topic: metadata.title,
          type: 'note',
          content: [{
            feature: 'Main Content',
            description: String(oldData.content || oldData.text || '')
          }]
        }
        break

      case 'flashcard':
        jsonContent = {
          topic: metadata.title,
          type: 'flashcard',
          flashcards: [{
            question: String(oldData.frontText || oldData.front || ''),
            answer: String(oldData.backText || oldData.back || '')
          }]
        }
        break

      default:
        throw new Error(`Unsupported content type: ${contentType}`)
    }

    return {
      contentTitle: metadata.title,
      contentType,
      contentData: JSON.stringify(jsonContent),
      subject: metadata.subject,
      difficulty: metadata.difficulty,
      tags: metadata.tags
    }
  }

  /**
   * Validate content structure based on content type
   */
  private static validateContentStructure(content: QuizJSON | NoteJSON | FlashcardJSON, contentType: string): boolean {
    try {
      switch (contentType) {
        case 'note':
          const noteContent = content as NoteJSON;
          if (!noteContent.content || !Array.isArray(noteContent.content) || noteContent.content.length === 0) {
            console.error('❌ Note content validation failed: content array is empty or missing');
            return false;
          }
          // ตรวจสอบว่าแต่ละ item มี feature และ description
          for (const item of noteContent.content) {
            if (!item.feature || !item.description) {
              console.error('❌ Note content validation failed: missing feature or description');
              return false;
            }
          }
          break;

        case 'quiz':
          const quizContent = content as QuizJSON;
          if (!quizContent.questions || !Array.isArray(quizContent.questions) || quizContent.questions.length === 0) {
            console.error('❌ Quiz content validation failed: questions array is empty or missing');
            return false;
          }
          // ตรวจสอบว่าแต่ละ question มี required fields
          for (const question of quizContent.questions) {
            if (!question.question || !question.correctAnswer) {
              console.error('❌ Quiz content validation failed: missing question or correctAnswer');
              return false;
            }
            if (question.type === 'multiple-choice' && (!question.options || question.options.length === 0)) {
              console.error('❌ Quiz content validation failed: multiple-choice question missing options');
              return false;
            }
          }
          break;

        case 'flashcard':
          const flashcardContent = content as FlashcardJSON;
          if (!flashcardContent.flashcards || !Array.isArray(flashcardContent.flashcards) || flashcardContent.flashcards.length === 0) {
            console.error('❌ Flashcard content validation failed: flashcards array is empty or missing');
            return false;
          }
          // ตรวจสอบว่าแต่ละ flashcard มี question และ answer
          for (const card of flashcardContent.flashcards) {
            if (!card.question || !card.answer) {
              console.error('❌ Flashcard content validation failed: missing question or answer');
              return false;
            }
          }
          break;

        default:
          console.error(`❌ Unknown content type: ${contentType}`);
          return false;
      }

      console.log('✅ Content structure validation passed');
      return true;
    } catch (error) {
      console.error('❌ Content structure validation error:', error);
      return false;
    }
  }

  // Mock data for development
  private static getMockContentList(): ManualContentListResponse {
    return {
      content: [
        {
          id: 1,
          contentTitle: 'Mock Quiz',
          contentType: 'quiz',
          contentData: JSON.stringify({
            topic: 'Mock Quiz',
            type: 'quiz',
            questions: [
              {
                id: 1,
                type: 'multiple-choice',
                question: 'What is 2+2?',
                options: ['3', '4', '5', '6'],
                correctAnswer: '4'
              }
            ]
          }),
          subject: 'Math',
          difficulty: 'easy',
          tags: ['mock', 'test'],
          createdByUsername: 'developer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          contentTitle: '22:44 Flashcard Deck (Backend Mock)',
          contentType: 'flashcard',
          contentData: JSON.stringify({
            topic: '22:44',
            type: 'flashcard',
            flashcards: [
              { question: '22:44', answer: '22:44' },
              { question: '22:44', answer: '22:44' },
              { question: '22:44', answer: '22:44' },
              { question: '22:44', answer: '22:44' },
              { question: '22:44', answer: '22:44' }
            ]
          }),
          subject: 'Test',
          difficulty: 'easy',
          tags: ['mock', 'flashcard', '22:44'],
          createdByUsername: 'test_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      totalElements: 2,
      currentPage: 0,
      totalPages: 1,
      size: 20,
      success: true,
      message: 'Mock data loaded'
    }
  }

  private static getMockContent(id: number): ManualContentResponse {
    return {
      id,
      contentTitle: `Mock Content ${id}`,
      contentType: 'quiz',
      contentData: JSON.stringify({
        topic: `Mock Content ${id}`,
        type: 'quiz',
        questions: []
      }),
      subject: 'Mock',
      difficulty: 'easy',
      tags: ['mock'],
      createdByUsername: 'developer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export default ManualContentService
