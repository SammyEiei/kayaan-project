import axios from './AxiosClient'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/manual/quiz',
  headers: { 'Content-Type': 'application/json' },
})

export interface QuizQuestionDTO {
  questionText: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED'
  choices?: string[]
  correctAnswer?: string
  subject?: string
  difficulty?: string
  tags?: string[]
}

export interface QuizDTO {
  title: string
  questions: QuizQuestionDTO[]
}

export interface QuizResponse {
  id: number
  title: string
  createdByUsername: string
  questions: {
    id: number
    questionText: string
    type: string
    choices: string[]
    correctAnswer: string
    subject: string
    difficulty: string
    tags: string[]
  }[]
}

export function createQuiz(payload: QuizDTO) {
  return axios.post<QuizResponse>('/api/manual/quiz', payload).then((res) => res.data)
}

export function getAllQuizzes() {
  return axios.get<QuizResponse[]>('/api/manual/quiz').then((res) => res.data)
}

export function getQuizById(id: number) {
  return axios.get<QuizResponse>(`/api/manual/quiz/${id}`).then((res) => res.data)
}

export function deleteQuiz(id: number) {
  return axios.delete<void>(`/api/manual/quiz/${id}`)
}
