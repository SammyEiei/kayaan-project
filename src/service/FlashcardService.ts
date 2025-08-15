import api from './api'

// DTOs matching backend FlashcardRequestDTO
export interface FlashcardRequestDTO {
  frontText: string
  backText: string
  subject?: string
  difficulty?: string
  category?: string
  tags?: string[]
  frontImageUrl?: string
  backImageUrl?: string
}

// DTOs matching backend FlashcardResponseDTO
export interface FlashcardResponseDTO {
  id: number
  createdByUsername: string
  frontText: string
  backText: string
  subject?: string
  difficulty?: string
  category?: string
  tags?: string[]
  frontImageUrl?: string
  backImageUrl?: string
}

// Legacy interfaces for backward compatibility
export interface FlashcardDTO {
  id?: number
  title: string
  cards: FlashcardItem[]
  subject?: string
  difficulty?: string
  tags?: string[]
}

export interface FlashcardItem {
  id: string
  front: string
  back: string
}

export interface FlashcardDeckRequestDTO {
  title: string
  subject?: string
  difficulty?: string
  tags?: string[]
  cards: FlashcardItem[]
}

export class FlashcardService {
  private static readonly BASE_URL = '/flashcard'

  /**
   * Create new flashcard
   */
  static async createFlashcard(data: FlashcardRequestDTO): Promise<FlashcardResponseDTO> {
    const response = await api.post(this.BASE_URL, data)
    return response.data
  }

  /**
   * Get all flashcards for a user
   */
  static async getAllFlashcardsForUser(username: string): Promise<FlashcardResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}`)
    return response.data
  }

  /**
   * Get flashcards by category
   */
  static async getFlashcardsByCategory(username: string, category: string): Promise<FlashcardResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/category/${encodeURIComponent(category)}`)
    return response.data
  }

  /**
   * Get flashcards by subject
   */
  static async getFlashcardsBySubject(username: string, subject: string): Promise<FlashcardResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/subject/${encodeURIComponent(subject)}`)
    return response.data
  }

  /**
   * Get flashcard by ID
   */
  static async getFlashcardById(id: number, username: string): Promise<FlashcardResponseDTO> {
    const response = await api.get(`${this.BASE_URL}/${id}/user/${username}`)
    return response.data
  }

  /**
   * Update flashcard
   */
  static async updateFlashcard(id: number, data: FlashcardRequestDTO, username: string): Promise<FlashcardResponseDTO> {
    const response = await api.put(`${this.BASE_URL}/${id}/user/${username}`, data)
    return response.data
  }

  /**
   * Delete flashcard (soft delete)
   */
  static async deleteFlashcard(id: number, username: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}/user/${username}`)
  }

  // Legacy methods for backward compatibility
  static async createFlashcardDeck(payload: FlashcardDeckRequestDTO): Promise<FlashcardResponseDTO[]> {
    // Create promises for each card
    const cardPromises = payload.cards.map((card) =>
      this.createFlashcard({
        frontText: card.front,
        backText: card.back,
        subject: payload.subject,
        difficulty: payload.difficulty,
        category: payload.title, // Use title as category to group them
        tags: payload.tags,
      })
    )

    // Execute all promises
    return Promise.all(cardPromises)
  }

  static async getAllFlashcards(): Promise<FlashcardResponseDTO[]> {
    // This will need username from auth store
    throw new Error('getAllFlashcards() is deprecated. Use getAllFlashcardsForUser(username) instead.')
  }

  static async getFlashcardByIdLegacy(id: number): Promise<FlashcardResponseDTO> {
    // This will need username from auth store
    throw new Error('getFlashcardByIdLegacy() is deprecated. Use getFlashcardById(id, username) instead.')
  }

  static async updateFlashcardLegacy(id: number, payload: FlashcardRequestDTO): Promise<FlashcardResponseDTO> {
    // This will need username from auth store
    throw new Error('updateFlashcardLegacy() is deprecated. Use updateFlashcard(id, data, username) instead.')
  }

  static async deleteFlashcardLegacy(id: number): Promise<void> {
    // This will need username from auth store
    throw new Error('deleteFlashcardLegacy() is deprecated. Use deleteFlashcard(id, username) instead.')
  }

  static async filterFlashcards(params: { category?: string; subject?: string }): Promise<FlashcardResponseDTO[]> {
    // This will need username from auth store
    throw new Error('filterFlashcards() is deprecated. Use getFlashcardsByCategory() or getFlashcardsBySubject() instead.')
  }
}

export default FlashcardService
