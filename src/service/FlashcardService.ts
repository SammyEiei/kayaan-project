import apiClient from './AxiosClient'

export interface FlashcardCardDTO {
  front: string
  back: string
}

export interface FlashcardDeckDTO {
  title: string
  subject?: string
  difficulty?: string
  tags?: string[]
  cards: FlashcardCardDTO[]
}

export interface FlashcardDeckResponse {
  id: number
  title: string
  subject?: string
  difficulty?: string
  tags?: string[]
  cards: FlashcardCardDTO[]
}

export function createFlashcardDeck(payload: FlashcardDeckDTO) {
  return apiClient
    .post<FlashcardDeckResponse>('/api/manual/flashcard', payload)
    .then(res => res.data)
}

export function getAllFlashcardDecks() {
  return apiClient
    .get<FlashcardDeckResponse[]>('/api/manual/flashcard')
    .then(res => res.data)
}

export function getFlashcardDeckById(id: number) {
  return apiClient
    .get<FlashcardDeckResponse>(`/api/manual/flashcard/${id}`)
    .then(res => res.data)
}

export function updateFlashcardDeck(id: number, payload: FlashcardDeckDTO) {
  return apiClient
    .put<FlashcardDeckResponse>(`/api/manual/flashcard/${id}`, payload)
    .then(res => res.data)
}

export function deleteFlashcardDeck(id: number) {
  return apiClient.delete<void>(`/api/manual/flashcard/${id}`)
}

