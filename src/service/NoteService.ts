import api from './api'

// DTOs matching backend NoteRequestDTO
export interface NoteRequestDTO {
  title: string
  content: string
  subject?: string
  difficulty?: string
  category?: string
  imageUrl?: string
  tags?: string[]
}

// DTOs matching backend NoteResponseDTO
export interface NoteResponseDTO {
  id: number
  createdByUsername: string
  title: string
  content: string
  subject?: string
  difficulty?: string
  category?: string
  imageUrl?: string
  tags?: string[]
}

export class NoteService {
  private static readonly BASE_URL = '/note'

  /**
   * Create new note
   */
  static async createNote(data: NoteRequestDTO): Promise<NoteResponseDTO> {
    const response = await api.post(this.BASE_URL, data)
    return response.data
  }

  /**
   * Get all notes for a user
   */
  static async getAllNotesForUser(username: string): Promise<NoteResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}`)
    return response.data
  }

  /**
   * Get notes by category
   */
  static async getNotesByCategory(username: string, category: string): Promise<NoteResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/category/${encodeURIComponent(category)}`)
    return response.data
  }

  /**
   * Get notes by subject
   */
  static async getNotesBySubject(username: string, subject: string): Promise<NoteResponseDTO[]> {
    const response = await api.get(`${this.BASE_URL}/user/${username}/subject/${encodeURIComponent(subject)}`)
    return response.data
  }

  /**
   * Get note by ID
   */
  static async getNoteById(id: number, username: string): Promise<NoteResponseDTO> {
    const response = await api.get(`${this.BASE_URL}/${id}/user/${username}`)
    return response.data
  }

  /**
   * Update note
   */
  static async updateNote(id: number, data: NoteRequestDTO, username: string): Promise<NoteResponseDTO> {
    const response = await api.put(`${this.BASE_URL}/${id}/user/${username}`, data)
    return response.data
  }

  /**
   * Delete note (soft delete)
   */
  static async deleteNote(id: number, username: string): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}/user/${username}`)
  }

  // Legacy methods for backward compatibility
  static async createNoteLegacy(payload: NoteRequestDTO): Promise<NoteResponseDTO> {
    return this.createNote(payload)
  }

  static async getAllNotes(): Promise<NoteResponseDTO[]> {
    // This will need username from auth store
    throw new Error('getAllNotes() is deprecated. Use getAllNotesForUser(username) instead.')
  }

  static async getNoteByIdLegacy(id: number): Promise<NoteResponseDTO> {
    // This will need username from auth store
    throw new Error('getNoteByIdLegacy() is deprecated. Use getNoteById(id, username) instead.')
  }

  static async updateNoteLegacy(id: number, payload: NoteRequestDTO): Promise<NoteResponseDTO> {
    // This will need username from auth store
    throw new Error('updateNoteLegacy() is deprecated. Use updateNote(id, data, username) instead.')
  }

  static async deleteNoteLegacy(id: number): Promise<void> {
    // This will need username from auth store
    throw new Error('deleteNoteLegacy() is deprecated. Use deleteNote(id, username) instead.')
  }

  static async filterNotes(params: { category?: string; subject?: string }): Promise<NoteResponseDTO[]> {
    // This will need username from auth store
    throw new Error('filterNotes() is deprecated. Use getNotesByCategory() or getNotesBySubject() instead.')
  }
}

export default NoteService
