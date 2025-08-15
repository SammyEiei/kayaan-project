import QuizService from './QuizService'
import NoteService from './NoteService'
import FlashcardService from './FlashcardService'
import ContentInfoService, { ContentInfo } from './ContentInfoService'
import { useAuthStore } from '../stores/auth'

export interface ContentItem {
  id: string
  type: 'quiz' | 'note' | 'flashcard'
  title: string
  subject: string
  tags: string[]
  difficulty: string
  createdAt: string
  category?: string
}

export async function getAllContent(): Promise<ContentItem[]> {
  try {
    const authStore = useAuthStore()

    // Try to get content from new ContentInfo service first
    try {
      const contentInfoList = await ContentInfoService.getAllActiveContentInfo()
      return contentInfoList.map((contentInfo): ContentItem => ({
        id: contentInfo.id,
        type: contentInfo.contentType.toLowerCase() as 'quiz' | 'note' | 'flashcard',
        title: contentInfo.title,
        subject: contentInfo.subject,
        tags: contentInfo.tags,
        difficulty: contentInfo.difficulty.toLowerCase(),
        createdAt: contentInfo.createdAt,
        category: contentInfo.subject,
      }))
    } catch (error) {
      console.log('ContentInfo service not available, falling back to legacy services')
    }

    // Fallback to legacy services
    let quizzes: any[] = []
    try {
      if (authStore.user?.username) {
        quizzes = await QuizService.getAllQuizzesForUser(authStore.user.username)
      }
    } catch (error) {
      console.log('Quiz service not available')
    }

    let notes: any[] = []
    try {
      if (authStore.user?.username) {
        notes = await NoteService.getAllNotesForUser(authStore.user.username)
      }
    } catch (error) {
      console.log('Note service not available')
    }

    let flashcards: any[] = []
    try {
      if (authStore.user?.username) {
        flashcards = await FlashcardService.getAllFlashcardsForUser(authStore.user.username)
      }
    } catch (error) {
      console.log('Flashcard service not available')
    }

    // Transform quizzes
    const quizItems: ContentItem[] = quizzes.map((quiz) => ({
      id: quiz.id.toString(),
      type: 'quiz' as const,
      title: quiz.title,
      subject: quiz.questions?.[0]?.subject || 'General',
      tags: quiz.questions?.[0]?.tags || [],
      difficulty: quiz.questions?.[0]?.difficulty || 'medium',
      createdAt: new Date().toISOString(), // You may want to add createdAt to backend
      category: quiz.category,
    }))

    // Transform notes
    const noteItems: ContentItem[] = notes.map((note) => ({
      id: note.id.toString(),
      type: 'note' as const,
      title: note.title,
      subject: note.subject || 'General',
      tags: note.tags || [],
      difficulty: note.difficulty || 'medium',
      createdAt: new Date().toISOString(),
      category: note.category,
    }))

    // Transform flashcards - group by category (deck title)
    const flashcardsByCategory = flashcards.reduce(
      (acc, card) => {
        const category = card.category || 'Untitled Deck'
        if (!acc[category]) {
          acc[category] = {
            id: `deck-${category}`,
            type: 'flashcard' as const,
            title: category,
            subject: card.subject || 'General',
            tags: card.tags || [],
            difficulty: card.difficulty || 'medium',
            createdAt: new Date().toISOString(),
            category: category,
            cards: [],
          }
        }
        acc[category].cards.push(card)
        return acc
      },
      {} as Record<string, any>,
    )

    const flashcardItems: ContentItem[] = Object.values(flashcardsByCategory)

    // Combine and sort by creation date (newest first)
    return [...quizItems, ...noteItems, ...flashcardItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch (error) {
    console.error('Error fetching content:', error)
    return []
  }
}
