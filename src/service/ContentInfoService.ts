import api from './api'

export interface ContentInfo {
  id: string
  title: string
  subject: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  contentType: 'QUIZ' | 'NOTE' | 'FLASHCARD'
  tags: string[]
  createdBy: {
    id: string
    username: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContentInfoRequest {
  title: string
  subject: string
  difficulty: string
  tags: string[]
  contentType: 'QUIZ' | 'NOTE' | 'FLASHCARD'
}

export interface UpdateContentInfoRequest {
  title?: string
  subject?: string
  difficulty?: string
  tags?: string[]
}

export class ContentInfoService {
  private static readonly BASE_URL = '/content-info'

  /**
   * Create new content info
   */
  static async createContentInfo(data: CreateContentInfoRequest): Promise<ContentInfo> {
    const response = await api.post(this.BASE_URL, data)
    return response.data
  }

  /**
   * Update existing content info
   */
  static async updateContentInfo(id: string, data: UpdateContentInfoRequest): Promise<ContentInfo> {
    const response = await api.put(`${this.BASE_URL}/${id}`, data)
    return response.data
  }

  /**
   * Soft delete content info
   */
  static async softDeleteContentInfo(id: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`)
  }

  /**
   * Get content info by ID
   */
  static async getContentInfoById(id: string): Promise<ContentInfo> {
    const response = await api.get(`${this.BASE_URL}/${id}`)
    return response.data
  }

  /**
   * Get all content info by username
   */
  static async getContentInfoByUsername(username: string): Promise<ContentInfo[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}`)
    return response.data
  }

  /**
   * Get content info by username and content type
   */
  static async getContentInfoByUsernameAndType(
    username: string,
    contentType: 'QUIZ' | 'NOTE' | 'FLASHCARD'
  ): Promise<ContentInfo[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/type/${contentType}`)
    return response.data
  }

  /**
   * Get content info by username and subject
   */
  static async getContentInfoByUsernameAndSubject(
    username: string,
    subject: string
  ): Promise<ContentInfo[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/subject/${encodeURIComponent(subject)}`)
    return response.data
  }

  /**
   * Get content info by username and difficulty
   */
  static async getContentInfoByUsernameAndDifficulty(
    username: string,
    difficulty: string
  ): Promise<ContentInfo[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/difficulty/${difficulty.toUpperCase()}`)
    return response.data
  }

  /**
   * Get all active content info
   */
  static async getAllActiveContentInfo(): Promise<ContentInfo[]> {
    const response = await api.get(`${this.BASE_URL}/active`)
    return response.data
  }
}

export default ContentInfoService
