import apiClient from './AxiosClient'
import axios from './AxiosClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/manual/note',
  headers: { 'Content-Type': 'application/json' },
})

export interface NoteRequestDTO {
  title: string
  content: string
  subject?: string
  difficulty?: string
  category?: string
  imageUrl?: string
  tags?: string[]
  groupIds?: number[]
}

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
  groupIds?: number[]
}

export function createNote(payload: NoteRequestDTO) {
  return apiClient.post<NoteResponseDTO>('/api/manual/note', payload).then((res) => res.data)
}

export function getAllNotes() {
  return apiClient.get<NoteResponseDTO[]>('/api/manual/note').then((res) => res.data)
}

export function getNoteById(id: number) {
  return apiClient.get<NoteResponseDTO>(`/api/manual/note/${id}`).then((res) => res.data)
}

export function updateNote(id: number, payload: NoteRequestDTO) {
  return apiClient.put<NoteResponseDTO>(`/api/manual/note/${id}`, payload).then((res) => res.data)
}

export function deleteNote(id: number) {
  return apiClient.delete<void>(`/api/manual/note/${id}`)
}

export function filterNotes(params: { category?: string; subject?: string }) {
  return apiClient
    .get<NoteResponseDTO[]>('/api/manual/note/filter', { params })
    .then((res) => res.data)
}
