import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import FlashcardService, { FlashcardRequestDTO, FlashcardResponseDTO } from '../service/FlashcardService'
import { useAuthStore } from './auth'

export const useFlashcardStore = defineStore('flashcard', () => {
  const flashcardList = ref<FlashcardResponseDTO[]>([])
  const currentFlashcard = ref<FlashcardResponseDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed properties
  const activeFlashcards = computed(() => flashcardList.value.filter(flashcard => flashcard.id > 0))

  const flashcardsByCategory = computed(() => (category: string) =>
    activeFlashcards.value.filter(flashcard => flashcard.category === category)
  )

  const flashcardsBySubject = computed(() => (subject: string) =>
    activeFlashcards.value.filter(flashcard => flashcard.subject === subject)
  )

  const flashcardsByDifficulty = computed(() => (difficulty: string) =>
    activeFlashcards.value.filter(flashcard => flashcard.difficulty === difficulty)
  )

  // Group flashcards by category for deck view
  const flashcardsByDeck = computed(() => {
    const decks: Record<string, FlashcardResponseDTO[]> = {}
    activeFlashcards.value.forEach(flashcard => {
      const category = flashcard.category || 'Uncategorized'
      if (!decks[category]) {
        decks[category] = []
      }
      decks[category].push(flashcard)
    })
    return decks
  })

  // Actions
  const fetchAllFlashcards = async () => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const flashcards = await FlashcardService.getAllFlashcardsForUser(authStore.user.username)
      flashcardList.value = flashcards
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch flashcards'
      console.error('Error fetching flashcards:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFlashcardsByCategory = async (category: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const flashcards = await FlashcardService.getFlashcardsByCategory(authStore.user.username, category)
      // Update only flashcards of this category
      flashcardList.value = flashcardList.value.filter(f => f.category !== category)
      flashcardList.value.push(...flashcards)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch flashcards by category'
      console.error('Error fetching flashcards by category:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFlashcardsBySubject = async (subject: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const flashcards = await FlashcardService.getFlashcardsBySubject(authStore.user.username, subject)
      // Update only flashcards of this subject
      flashcardList.value = flashcardList.value.filter(f => f.subject !== subject)
      flashcardList.value.push(...flashcards)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch flashcards by subject'
      console.error('Error fetching flashcards by subject:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFlashcardById = async (id: number) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const flashcard = await FlashcardService.getFlashcardById(id, authStore.user.username)
      currentFlashcard.value = flashcard

      // Update in list if exists
      const index = flashcardList.value.findIndex(f => f.id === id)
      if (index !== -1) {
        flashcardList.value[index] = flashcard
      } else {
        flashcardList.value.push(flashcard)
      }

      return flashcard
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch flashcard'
      console.error('Error fetching flashcard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFlashcard = async (data: FlashcardRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const newFlashcard = await FlashcardService.createFlashcard(data)
      flashcardList.value.push(newFlashcard)
      return newFlashcard
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create flashcard'
      console.error('Error creating flashcard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFlashcard = async (id: number, data: FlashcardRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const updatedFlashcard = await FlashcardService.updateFlashcard(id, data, authStore.user.username)

      // Update in list
      const index = flashcardList.value.findIndex(f => f.id === id)
      if (index !== -1) {
        flashcardList.value[index] = updatedFlashcard
      }

      // Update current flashcard if it's the same
      if (currentFlashcard.value?.id === id) {
        currentFlashcard.value = updatedFlashcard
      }

      return updatedFlashcard
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update flashcard'
      console.error('Error updating flashcard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFlashcard = async (id: number) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      await FlashcardService.deleteFlashcard(id, authStore.user.username)

      // Remove from list
      flashcardList.value = flashcardList.value.filter(f => f.id !== id)

      // Clear current flashcard if it's the same
      if (currentFlashcard.value?.id === id) {
        currentFlashcard.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete flashcard'
      console.error('Error deleting flashcard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentFlashcard = () => {
    currentFlashcard.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    flashcardList.value = []
    currentFlashcard.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    flashcardList,
    currentFlashcard,
    loading,
    error,

    // Computed
    activeFlashcards,
    flashcardsByCategory,
    flashcardsBySubject,
    flashcardsByDifficulty,
    flashcardsByDeck,

    // Actions
    fetchAllFlashcards,
    fetchFlashcardsByCategory,
    fetchFlashcardsBySubject,
    fetchFlashcardById,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    clearCurrentFlashcard,
    clearError,
    reset,
  }
})
