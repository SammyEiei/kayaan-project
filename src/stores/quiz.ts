import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import QuizService, { QuizRequestDTO, QuizResponseDTO } from '../service/QuizService'
import { useAuthStore } from './auth'

export const useQuizStore = defineStore('quiz', () => {
  const quizList = ref<QuizResponseDTO[]>([])
  const currentQuiz = ref<QuizResponseDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed properties
  const activeQuizzes = computed(() => quizList.value.filter(quiz => quiz.id > 0))

  const quizzesByCategory = computed(() => (category: string) =>
    activeQuizzes.value.filter(quiz => quiz.category === category)
  )

  const quizzesBySubject = computed(() => (subject: string) =>
    activeQuizzes.value.filter(quiz =>
      quiz.questions.some(q => q.subject === subject)
    )
  )

  // Actions
  const fetchAllQuizzes = async () => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const quizzes = await QuizService.getAllQuizzesForUser(authStore.user.username)
      quizList.value = quizzes
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quizzes'
      console.error('Error fetching quizzes:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchQuizzesByCategory = async (category: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const quizzes = await QuizService.getQuizzesByCategory(authStore.user.username, category)
      // Update only quizzes of this category
      quizList.value = quizList.value.filter(q => q.category !== category)
      quizList.value.push(...quizzes)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quizzes by category'
      console.error('Error fetching quizzes by category:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchQuizzesBySubject = async (subject: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const quizzes = await QuizService.getQuizzesBySubject(authStore.user.username, subject)
      // Update only quizzes of this subject
      quizList.value = quizList.value.filter(q =>
        !q.questions.some(question => question.subject === subject)
      )
      quizList.value.push(...quizzes)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quizzes by subject'
      console.error('Error fetching quizzes by subject:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchQuizById = async (quizId: number) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const quiz = await QuizService.getQuizById(quizId, authStore.user.username)
      currentQuiz.value = quiz

      // Update in list if exists
      const index = quizList.value.findIndex(q => q.id === quizId)
      if (index !== -1) {
        quizList.value[index] = quiz
      } else {
        quizList.value.push(quiz)
      }

      return quiz
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quiz'
      console.error('Error fetching quiz:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createQuiz = async (data: QuizRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const newQuiz = await QuizService.createQuiz(data)
      quizList.value.push(newQuiz)
      return newQuiz
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create quiz'
      console.error('Error creating quiz:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuiz = async (quizId: number, data: QuizRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const updatedQuiz = await QuizService.updateQuiz(quizId, data, authStore.user.username)

      // Update in list
      const index = quizList.value.findIndex(q => q.id === quizId)
      if (index !== -1) {
        quizList.value[index] = updatedQuiz
      }

      // Update current quiz if it's the same
      if (currentQuiz.value?.id === quizId) {
        currentQuiz.value = updatedQuiz
      }

      return updatedQuiz
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update quiz'
      console.error('Error updating quiz:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteQuiz = async (quizId: number) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      await QuizService.deleteQuiz(quizId, authStore.user.username)

      // Remove from list
      quizList.value = quizList.value.filter(q => q.id !== quizId)

      // Clear current quiz if it's the same
      if (currentQuiz.value?.id === quizId) {
        currentQuiz.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete quiz'
      console.error('Error deleting quiz:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentQuiz = () => {
    currentQuiz.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    quizList.value = []
    currentQuiz.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    quizList,
    currentQuiz,
    loading,
    error,

    // Computed
    activeQuizzes,
    quizzesByCategory,
    quizzesBySubject,

    // Actions
    fetchAllQuizzes,
    fetchQuizzesByCategory,
    fetchQuizzesBySubject,
    fetchQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    clearCurrentQuiz,
    clearError,
    reset,
  }
})
