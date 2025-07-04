import apiClient from './AxiosClient'

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

export interface FlashcardRequestDTO {
  frontText: string
  backText: string
  subject?: string
  difficulty?: string
  category?: string
  tags?: string[]
}

export interface FlashcardResponseDTO {
  id: number
  createdByUsername: string
  frontText: string
  backText: string
  subject?: string
  difficulty?: string
  category?: string
  tags?: string[]
}

export interface FlashcardDeckRequestDTO {
  title: string
  subject?: string
  difficulty?: string
  tags?: string[]
  cards: FlashcardItem[]
}

// Create multiple flashcards as a deck
export function createFlashcardDeck(payload: FlashcardDeckRequestDTO) {
  // Create promises for each card
  const cardPromises = payload.cards.map((card) =>
    apiClient.post<FlashcardResponseDTO>('/api/manual/flashcard', {
      frontText: card.front,
      backText: card.back,
      subject: payload.subject,
      difficulty: payload.difficulty,
      category: payload.title, // Use title as category to group them
      tags: payload.tags,
    }),
  )

  // Execute all promises
  return Promise.all(cardPromises)
}

export function getAllFlashcards() {
  return apiClient.get<FlashcardResponseDTO[]>('/api/manual/flashcard').then((res) => res.data)
}

export function getFlashcardById(id: number) {
  return apiClient.get<FlashcardResponseDTO>(`/api/manual/flashcard/${id}`).then((res) => res.data)
}

export function updateFlashcard(id: number, payload: FlashcardRequestDTO) {
  return apiClient
    .put<FlashcardResponseDTO>(`/api/manual/flashcard/${id}`, payload)
    .then((res) => res.data)
}

export function deleteFlashcard(id: number) {
  return apiClient.delete<void>(`/api/manual/flashcard/${id}`)
}

export function filterFlashcards(params: { category?: string; subject?: string }) {
  return apiClient
    .get<FlashcardResponseDTO[]>('/api/manual/flashcard/filter', { params })
    .then((res) => res.data)
}
