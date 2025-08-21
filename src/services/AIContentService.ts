import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/group';

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

export interface GenerationRequest {
  prompt: string
  type: string
  model: string
  temperature: number
  maxTokens: number
  language: string
  files?: File[]
}

export interface GenerationSettings {
  model: string
  temperature: number
  maxTokens: number
  language: string
}

export interface AIChatSession {
  id: string
  sessionName: string
  createdAt: Date
}

export interface AIChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIGenerationRequest {
  contentType: 'flashcard' | 'note' | 'quiz'
  topic: string
  description?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  count?: number
  language?: string
}

export interface AIGenerationResponse {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  estimatedTime?: number
  message?: string
}

export interface AIJobStatus {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: unknown
  error?: string
  createdAt: string
  updatedAt: string
}

class AIContentService {
  private baseUrl = '/ai'

  // Generate content using AI
  async generateContent(request: GenerationRequest): Promise<AIContent> {
    try {
      const formData = new FormData()
      formData.append('prompt', request.prompt)
      formData.append('type', request.type)
      formData.append('model', request.model)
      formData.append('temperature', request.temperature.toString())
      formData.append('maxTokens', request.maxTokens.toString())
      formData.append('language', request.language)

      if (request.files) {
        request.files.forEach((file, index) => {
          formData.append(`file_${index}`, file)
        })
      }

      const response = await apiClient.post(`${this.baseUrl}/generate-content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      console.error('Error generating content:', error)
      throw error
    }
  }

  // Get user's AI content history
  async getContentHistory(): Promise<AIContent[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/content-history`)
      return response.data
    } catch (error) {
      console.error('Error fetching content history:', error)
      throw error
    }
  }

  // Save generated content
  async saveContent(content: Partial<AIContent>): Promise<AIContent> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/content`, content)
      return response.data
    } catch (error) {
      console.error('Error saving content:', error)
      throw error
    }
  }

  // Delete content
  async deleteContent(contentId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/content/${contentId}`)
    } catch (error) {
      console.error('Error deleting content:', error)
      throw error
    }
  }

  // Get chat sessions
  async getChatSessions(): Promise<AIChatSession[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat-sessions`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      throw error
    }
  }

  // Create new chat session
  async createChatSession(sessionName: string): Promise<AIChatSession> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/chat-sessions`, { sessionName })
      return response.data
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw error
    }
  }

  // Get chat messages for a session
  async getChatMessages(sessionId: string): Promise<AIChatMessage[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/chat-sessions/${sessionId}/messages`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      throw error
    }
  }

  // Send message to chat session
  async sendChatMessage(sessionId: string, content: string): Promise<AIChatMessage> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/chat-sessions/${sessionId}/messages`, {
        content,
      })
      return response.data
    } catch (error) {
      console.error('Error sending chat message:', error)
      throw error
    }
  }

  // Update AI settings
  async updateSettings(settings: GenerationSettings): Promise<void> {
    try {
      await apiClient.put(`${this.baseUrl}/settings`, settings)
    } catch (error) {
      console.error('Error updating AI settings:', error)
      throw error
    }
  }

  // Get AI settings
  async getSettings(): Promise<GenerationSettings> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/settings`)
      return response.data
    } catch (error) {
      console.error('Error fetching AI settings:', error)
      throw error
    }
  }

  // ===== NEW AI GENERATION METHODS =====

  /**
   * สร้าง AI generation job ใหม่
   */
  async createGenerationJob(request: AIGenerationRequest): Promise<ApiResponse<AIGenerationResponse>> {
    const response = await apiClient.post(`${this.baseUrl}/generate`, request);
    return response.data;
  }

  /**
   * ตรวจสอบสถานะของ AI job
   */
  async getJobStatus(jobId: string): Promise<ApiResponse<AIJobStatus>> {
    const response = await apiClient.get(`${this.baseUrl}/jobs/${jobId}`);
    return response.data;
  }

  /**
   * ดึงรายการ AI jobs ของผู้ใช้
   */
  async getMyJobs(status?: string): Promise<ApiResponse<AIJobStatus[]>> {
    const response = await apiClient.get(`${this.baseUrl}/jobs/my`, {
      params: { status }
    });
    return response.data;
  }

  /**
   * ยกเลิก AI job
   */
  async cancelJob(jobId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/jobs/${jobId}`);
    return response.data;
  }

  /**
   * ดึง AI drafts ที่สร้างเสร็จแล้ว
   */
  async getAIDrafts(contentType?: string): Promise<ApiResponse<unknown[]>> {
    const response = await apiClient.get(`${this.baseUrl}/drafts`, {
      params: { contentType }
    });
    return response.data;
  }

  /**
   * บันทึก AI draft เป็นเนื้อหาจริง
   */
  async saveAIDraft(draftId: string, groupId: string): Promise<ApiResponse<unknown>> {
    const response = await apiClient.post(`${this.baseUrl}/drafts/${draftId}/save`, {
      groupId
    });
    return response.data;
  }

  /**
   * แก้ไข AI draft
   */
  async updateAIDraft(draftId: string, updates: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiClient.put(`${this.baseUrl}/drafts/${draftId}`, updates);
    return response.data;
  }

  /**
   * ลบ AI draft
   */
  async deleteAIDraft(draftId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/drafts/${draftId}`);
    return response.data;
  }

  // ===== FALLBACK MOCK METHODS (for development) =====

  async mockGenerateContent(request: GenerationRequest): Promise<AIContent> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockContent: AIContent = {
      id: Date.now().toString(),
      type: request.type as 'summary' | 'quiz' | 'flashcard' | 'notes',
      title: `Generated ${request.type} content`,
      content: `This is AI-generated content based on the prompt: "${request.prompt}"\n\nThis content was generated using model ${request.model} with temperature ${request.temperature} and max tokens ${request.maxTokens} in ${request.language === 'en' ? 'English' : request.language}.\n\nYou can edit this content as needed.`,
      sourcePrompt: request.prompt,
      createdAt: new Date(),
      isShared: false,
    }

    return mockContent
  }

  async mockGetContentHistory(): Promise<AIContent[]> {
    return [
      {
        id: '1',
        type: 'summary',
        title: 'Algorithm Lesson Summary',
        content: 'Summary of Algorithm lesson content...',
        sourcePrompt: 'Help summarize the Algorithm lesson',
        createdAt: new Date('2024-01-15'),
        isShared: false,
      },
      {
        id: '2',
        type: 'quiz',
        title: 'Data Structure Quiz',
        content: 'Data Structure quiz questions...',
        sourcePrompt: 'Create a Data Structure quiz',
        createdAt: new Date('2024-01-14'),
        isShared: true,
      },
    ]
  }
}

export const aiContentService = new AIContentService()
