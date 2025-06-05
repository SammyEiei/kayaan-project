import axios from './AxiosClient';

export interface QuizQuestionDto {
  questionText: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED';
  choices?: string[];
  correctAnswer?: string;
  subject?: string;
  difficulty?: string;
  tags?: string[];
}

export interface QuizDto {
  title: string;
  questions: QuizQuestionDto[];
}

export interface QuizResponse {
  id: number;
  title: string;
  createdByUsername: string;
  questions: {
    id: number;
    questionText: string;
    type: string;
    choices: string[];
    correctAnswer: string;
    subject: string;
    difficulty: string;
    tags: string[];
  }[];
}

export function createQuiz(payload: QuizDto) {
  return axios.post<QuizResponse>('/manual/quiz', payload).then(res => res.data);
}

export function getAllQuizzes() {
  return axios.get<QuizResponse[]>('/manual/quiz').then(res => res.data);
}

export function getQuizById(id: number) {
  return axios.get<QuizResponse>(`/manual/quiz/${id}`).then(res => res.data);
}

export function deleteQuiz(id: number) {
  return axios.delete<void>(`/manual/quiz/${id}`);
}
