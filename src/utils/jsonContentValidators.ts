/**
 * JSON Content Validators for Manual Generation Migration
 * Validates content before sending to new JSON APIs
 */

// Common interfaces
export interface BaseJSONContent {
  topic: string
  type: 'quiz' | 'note' | 'flashcard'
}

// Quiz JSON interfaces
export interface QuizJSON extends BaseJSONContent {
  type: 'quiz'
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'open-ended'
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

// Note JSON interfaces
export interface NoteJSON extends BaseJSONContent {
  type: 'note'
  content: NoteSection[]
}

export interface NoteSection {
  feature: string
  description: string
}

// Flashcard JSON interfaces
export interface FlashcardJSON extends BaseJSONContent {
  type: 'flashcard'
  flashcards: FlashcardItem[]
}

export interface FlashcardItem {
  question: string
  answer: string
}

// New API request interface
export interface ManualContentRequest {
  contentTitle: string
  contentType: 'quiz' | 'note' | 'flashcard'
  contentData: string // JSON string
  subject: string
  difficulty: string
  tags: string[]
}

// Validation functions
export class JSONContentValidator {

  static validateQuizJSON(data: unknown): QuizJSON {
    const quiz = data as QuizJSON

    if (!quiz.topic || typeof quiz.topic !== 'string') {
      throw new Error('Quiz topic is required and must be a string')
    }

    if (quiz.type !== 'quiz') {
      throw new Error('Type must be "quiz"')
    }

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      throw new Error('Questions array is required and must not be empty')
    }

    quiz.questions.forEach((q, index) => {
      if (!q.id || typeof q.id !== 'number') {
        throw new Error(`Question ${index + 1}: ID is required and must be a number`)
      }

      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Question ${index + 1}: question text is required`)
      }

      if (!q.correctAnswer || typeof q.correctAnswer !== 'string') {
        throw new Error(`Question ${index + 1}: correctAnswer is required`)
      }

      // Validate based on question type
      if (q.type === 'multiple-choice') {
        if (!Array.isArray(q.options) || q.options.length === 0) {
          throw new Error(`Question ${index + 1}: options array is required for multiple-choice questions`)
        }
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Question ${index + 1}: correctAnswer must be one of the options`)
        }
      } else if (q.type === 'true-false') {
        if (!Array.isArray(q.options) || q.options.length !== 2) {
          throw new Error(`Question ${index + 1}: true-false questions must have exactly 2 options`)
        }
        if (!['true', 'false'].includes(q.correctAnswer.toLowerCase())) {
          throw new Error(`Question ${index + 1}: correctAnswer must be "true" or "false"`)
        }
      } else if (q.type === 'open-ended') {
        // Open-ended questions don't need options validation
        if (!q.correctAnswer.trim()) {
          throw new Error(`Question ${index + 1}: answer cannot be empty`)
        }
      }
    })

    return quiz
  }

  static validateNoteJSON(data: unknown): NoteJSON {
    const note = data as NoteJSON

    if (!note.topic || typeof note.topic !== 'string') {
      throw new Error('Note topic is required and must be a string')
    }

    if (note.type !== 'note') {
      throw new Error('Type must be "note"')
    }

    if (!Array.isArray(note.content) || note.content.length === 0) {
      throw new Error('Content array is required and must not be empty')
    }

    note.content.forEach((section, index) => {
      if (!section.feature || typeof section.feature !== 'string') {
        throw new Error(`Section ${index + 1}: feature is required`)
      }

      if (!section.description || typeof section.description !== 'string') {
        throw new Error(`Section ${index + 1}: description is required`)
      }
    })

    return note
  }

  static validateFlashcardJSON(data: unknown): FlashcardJSON {
    const flashcard = data as FlashcardJSON

    if (!flashcard.topic || typeof flashcard.topic !== 'string') {
      throw new Error('Flashcard topic is required and must be a string')
    }

    if (flashcard.type !== 'flashcard') {
      throw new Error('Type must be "flashcard"')
    }

    if (!Array.isArray(flashcard.flashcards) || flashcard.flashcards.length === 0) {
      throw new Error('Flashcards array is required and must not be empty')
    }

    flashcard.flashcards.forEach((card, index) => {
      if (!card.question || typeof card.question !== 'string') {
        throw new Error(`Card ${index + 1}: question is required`)
      }

      if (!card.answer || typeof card.answer !== 'string') {
        throw new Error(`Card ${index + 1}: answer is required`)
      }
    })

    return flashcard
  }

  static validateJSONContent(type: string, data: unknown): QuizJSON | NoteJSON | FlashcardJSON {
    switch (type) {
      case 'quiz':
        return this.validateQuizJSON(data)
      case 'note':
        return this.validateNoteJSON(data)
      case 'flashcard':
        return this.validateFlashcardJSON(data)
      default:
        throw new Error(`Unsupported content type: ${type}`)
    }
  }
}

// Content conversion utilities
export class ContentConverter {

  /**
   * Convert current Manual Quiz format to JSON format
   */
  static quizToJSON(quizData: {
    title: string
    questions: Array<{
      questionText: string
      type: string
      choices: string[]
      correctAnswer: string
      explanation?: string
    }>
  }): QuizJSON {
    return {
      topic: quizData.title,
      type: 'quiz',

      questions: quizData.questions.map((q, index) => {
                // Handle different question types
        let validChoices: string[] = []
        let validCorrectAnswer = q.correctAnswer

        if (q.type === 'MULTIPLE_CHOICE') {
          // Filter out empty choices for multiple choice
          validChoices = q.choices.filter(choice => choice.trim())

          // Ensure correctAnswer is one of the valid choices
          if (validChoices.length > 0 && !validChoices.includes(q.correctAnswer)) {
            validCorrectAnswer = validChoices[0]
          }
        } else if (q.type === 'TRUE_FALSE') {
          // For true/false, normalize the answer
          validChoices = ['true', 'false']
          validCorrectAnswer = q.correctAnswer?.toLowerCase() === 'true' ? 'true' : 'false'
        } else if (q.type === 'OPEN_ENDED') {
          // For open-ended, no options needed
          validChoices = []
          validCorrectAnswer = q.correctAnswer?.trim() || 'No answer provided'
        }

        return {
          id: index + 1,
          type: q.type?.toLowerCase().replace('_', '-') as QuizQuestion['type'] || 'multiple-choice',
          question: q.questionText,
          options: validChoices,
          correctAnswer: validCorrectAnswer,
          explanation: q.explanation
        }
      })
    }
  }

  /**
   * Convert current Manual Note format to JSON format
   */
  static noteToJSON(noteData: {
    title: string
    content: string
  }): NoteJSON {
    // Split content into sections (simple splitting by double newlines)
    const sections = noteData.content.split('\n\n').filter(section => section.trim())

    return {
      topic: noteData.title,
      type: 'note',
      content: sections.map((section, index) => ({
        feature: `Section ${index + 1}`,
        description: section.trim()
      }))
    }
  }

  /**
   * Convert current Manual Flashcard format to JSON format
   */
  static flashcardToJSON(flashcardData: {
    title: string
    frontText: string
    backText: string
  }): FlashcardJSON {
    return {
      topic: flashcardData.title,
      type: 'flashcard',
      flashcards: [{
        question: flashcardData.frontText,
        answer: flashcardData.backText
      }]
    }
  }
}

// Utilities for working with JSON content
export class JSONContentUtils {

  /**
   * Parse and validate JSON content string
   */
  static parseAndValidate(contentData: string, contentType: string): QuizJSON | NoteJSON | FlashcardJSON {
    try {
      const parsed = JSON.parse(contentData)
      return JSONContentValidator.validateJSONContent(contentType, parsed)
    } catch (error) {
      throw new Error(`Invalid JSON content: ${error}`)
    }
  }

  /**
   * Create content preview from JSON
   */
  static createPreview(jsonContent: QuizJSON | NoteJSON | FlashcardJSON): string {
    switch (jsonContent.type) {
      case 'quiz':
        return `Quiz: ${jsonContent.topic} (${jsonContent.questions.length} questions)`
      case 'note':
        return `Note: ${jsonContent.topic} (${jsonContent.content.length} sections)`
      case 'flashcard':
        return `Flashcard Set: ${jsonContent.topic} (${jsonContent.flashcards.length} cards)`
      default:
        return 'Unknown content type'
    }
  }

  /**
   * Extract metadata from JSON content
   */
  static extractMetadata(jsonContent: QuizJSON | NoteJSON | FlashcardJSON) {
    const baseMetadata = {
      title: jsonContent.topic,
      type: jsonContent.type
    }

    switch (jsonContent.type) {
      case 'quiz':
        return {
          ...baseMetadata,
          itemCount: jsonContent.questions.length,
          questionTypes: [...new Set(jsonContent.questions.map(q => q.type))]
        }
      case 'note':
        return {
          ...baseMetadata,
          itemCount: jsonContent.content.length,
          totalLength: jsonContent.content.reduce((sum, section) => sum + section.description.length, 0)
        }
      case 'flashcard':
        return {
          ...baseMetadata,
          itemCount: jsonContent.flashcards.length
        }
    }
  }
}

export default {
  JSONContentValidator,
  ContentConverter,
  JSONContentUtils
}
