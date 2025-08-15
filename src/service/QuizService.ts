import api from './api'

// DTOs matching backend QuizRequestDTO
export interface QuizQuestionRequestDTO {
  questionText: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED'
  choices?: string[]
  correctAnswer?: string
  subject?: string
  difficulty?: string
  tags?: string[]
}

export interface QuizRequestDTO {
  title: string
  questions: QuizQuestionRequestDTO[]
}

// DTOs matching backend QuizResponseDTO
export interface QuizQuestionResponse {
  id: number
  questionText: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED'
  choices: string[]
  correctAnswer: string
  subject: string
  difficulty: string
  tags: string[]
}

export interface QuizResponseDTO {
  id: number
  title: string
  createdByUsername: string
  category?: string
  questions: QuizQuestionResponse[]
}

export class QuizService {
  private static readonly BASE_URL = '/quiz'

  /**
   * Create new quiz
   */
  static async createQuiz(data: QuizRequestDTO): Promise<QuizResponseDTO> {
    const response = await api.post(this.BASE_URL, data)
    return response.data
  }

  /**
   * Get all quizzes for a user
   */
  static async getAllQuizzesForUser(username: string): Promise<QuizResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}`)
    return response.data
  }

  /**
   * Get quizzes by category
   */
  static async getQuizzesByCategory(username: string, category: string): Promise<QuizResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/category/${encodeURIComponent(category)}`)
    return response.data
  }

  /**
   * Get quizzes by subject
   */
  static async getQuizzesBySubject(username: string, subject: string): Promise<QuizResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/subject/${encodeURIComponent(subject)}`)
    return response.data
  }

  /**
   * Get quiz by ID
   */
  static async getQuizById(quizId: number, username: string): Promise<QuizResponseDTO> {
    const response = await api.get(`${this.BASE_URL}/${quizId}/user/${username}`)
    return response.data
  }

  /**
   * Update quiz
   */
  static async updateQuiz(quizId: number, data: QuizRequestDTO, username: string): Promise<QuizResponseDTO> {
    const response = await api.put(`${this.BASE_URL}/${quizId}/user/${username}`, data)
    return response.data
  }

  /**
   * Delete quiz (soft delete)
   */
  static async deleteQuiz(quizId: number, username: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${quizId}/user/${username}`)
  }

  // Legacy methods for backward compatibility
  static async createQuizLegacy(payload: QuizRequestDTO): Promise<QuizResponseDTO> {
    return this.createQuiz(payload)
  }

  static async getAllQuizzes(): Promise<QuizResponseDTO[]> {
    // This will need username from auth store
    throw new Error('getAllQuizzes() is deprecated. Use getAllQuizzesForUser(username) instead.')
  }

  static async getQuizByIdLegacy(id: number): Promise<QuizResponseDTO> {
    // This will need username from auth store
    throw new Error('getQuizByIdLegacy() is deprecated. Use getQuizById(id, username) instead.')
  }

  static async deleteQuizLegacy(id: number): Promise<void> {
    // This will need username from auth store
    throw new Error('deleteQuizLegacy() is deprecated. Use deleteQuiz(id, username) instead.')
  }
}

export default QuizService
