import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import NoteService, { NoteRequestDTO, NoteResponseDTO } from '../service/NoteService'
import { useAuthStore } from './auth'

export const useNoteStore = defineStore('note', () => {
  const noteList = ref<NoteResponseDTO[]>([])
  const currentNote = ref<NoteResponseDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // Computed properties
  const activeNotes = computed(() => noteList.value.filter(note => note.id > 0))

  const notesByCategory = computed(() => (category: string) =>
    activeNotes.value.filter(note => note.category === category)
  )

  const notesBySubject = computed(() => (subject: string) =>
    activeNotes.value.filter(note => note.subject === subject)
  )

  const notesByDifficulty = computed(() => (difficulty: string) =>
    activeNotes.value.filter(note => note.difficulty === difficulty)
  )

  // Actions
  const fetchAllNotes = async () => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const notes = await NoteService.getAllNotesForUser(authStore.user.username)
      noteList.value = notes
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes'
      console.error('Error fetching notes:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchNotesByCategory = async (category: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const notes = await NoteService.getNotesByCategory(authStore.user.username, category)
      // Update only notes of this category
      noteList.value = noteList.value.filter(n => n.category !== category)
      noteList.value.push(...notes)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes by category'
      console.error('Error fetching notes by category:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchNotesBySubject = async (subject: string) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const notes = await NoteService.getNotesBySubject(authStore.user.username, subject)
      // Update only notes of this subject
      noteList.value = noteList.value.filter(n => n.subject !== subject)
      noteList.value.push(...notes)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch notes by subject'
      console.error('Error fetching notes by subject:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchNoteById = async (id: number) => {
    if (!authStore.user?.username) return

    loading.value = true
    error.value = null

    try {
      const note = await NoteService.getNoteById(id, authStore.user.username)
      currentNote.value = note

      // Update in list if exists
      const index = noteList.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noteList.value[index] = note
      } else {
        noteList.value.push(note)
      }

      return note
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch note'
      console.error('Error fetching note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNote = async (data: NoteRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const newNote = await NoteService.createNote(data)
      noteList.value.push(newNote)
      return newNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create note'
      console.error('Error creating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (id: number, data: NoteRequestDTO) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      const updatedNote = await NoteService.updateNote(id, data, authStore.user.username)

      // Update in list
      const index = noteList.value.findIndex(n => n.id === id)
      if (index !== -1) {
        noteList.value[index] = updatedNote
      }

      // Update current note if it's the same
      if (currentNote.value?.id === id) {
        currentNote.value = updatedNote
      }

      return updatedNote
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update note'
      console.error('Error updating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (id: number) => {
    if (!authStore.user?.username) throw new Error('User not authenticated')

    loading.value = true
    error.value = null

    try {
      await NoteService.deleteNote(id, authStore.user.username)

      // Remove from list
      noteList.value = noteList.value.filter(n => n.id !== id)

      // Clear current note if it's the same
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete note'
      console.error('Error deleting note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentNote = () => {
    currentNote.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    noteList.value = []
    currentNote.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    noteList,
    currentNote,
    loading,
    error,

    // Computed
    activeNotes,
    notesByCategory,
    notesBySubject,
    notesByDifficulty,

    // Actions
    fetchAllNotes,
    fetchNotesByCategory,
    fetchNotesBySubject,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    clearCurrentNote,
    clearError,
    reset,
  }
})
