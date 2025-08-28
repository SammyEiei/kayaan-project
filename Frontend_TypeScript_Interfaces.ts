// Frontend TypeScript Interfaces for AI Content
// ใช้กับ Frontend components เพื่อ type safety

// ==================== Common Interfaces ====================

export interface AIContentMetadata {
  title: string
  subject: string
  difficulty: 'easy' | 'intermediate' | 'advanced'
  estimatedTime?: string
  tags: string[]
  language: 'th' | 'en'
  createdAt: string
  version?: string
  author?: {
    name: string
    type: 'ai' | 'human'
  }
  statistics?: {
    wordsCount: number
    readabilityScore: number
    complexity: string
  }
}

export interface APIResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  meta: {
    requestId: string
    processingTime: string
    tokensUsed: number
    model: string
    contentType: 'note' | 'quiz' | 'flashcard' | 'summary'
    generationParams: {
      prompt: string
      outputFormat: string
      language: string
      difficulty: string
    }
  }
}

export interface APIError {
  success: false
  message: string
  errorCode?: string
  details?: {
    type: 'validation_error' | 'api_error' | 'processing_error'
    field?: string
    suggestion?: string
  }
  meta: {
    requestId: string
    timestamp: string
  }
}

// ==================== Note Content Interfaces ====================

export interface NoteExample {
  title: string
  code: string
  language: string
}

export interface NoteSection {
  id: number
  title: string
  level: number
  content: string[]
  examples?: NoteExample[]
  keyPoints?: string[]
}

export interface NoteReference {
  title: string
  url: string
}

export interface NoteContent {
  topic: string
  summary?: string
  sections: NoteSection[]
  conclusion?: string
  references?: NoteReference[]
}

export interface AINote {
  type: 'note'
  metadata: AIContentMetadata
  content: NoteContent
}

// ==================== Quiz Content Interfaces ====================

export interface QuizOption {
  id: string
  text: string
  correct: boolean
}

export interface QuizValidation {
  minLength?: number
  maxLength?: number
  mustInclude?: string[]
}

export interface QuizRubricCriteria {
  name: string
  maxPoints: number
  description: string
}

export interface QuizRubric {
  criteria: QuizRubricCriteria[]
}

export interface WordLimit {
  min: number
  max: number
}

export interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'multiple-select'
  question: string
  points: number

  // Multiple choice & Multiple select
  options?: QuizOption[]

  // True/False
  answer?: boolean

  // Short answer & Essay
  sampleAnswer?: string
  keywords?: string[]
  validation?: QuizValidation
  rubric?: QuizRubric
  wordLimit?: WordLimit

  // Common
  explanation?: string
  hints?: string[]
}

export interface QuizFeedback {
  excellent: {
    message: string
    minScore: number
  }
  good: {
    message: string
    minScore: number
  }
  needsImprovement: {
    message: string
    minScore: number
  }
}

export interface QuizContent {
  instructions?: string
  questions: QuizQuestion[]
  feedback?: QuizFeedback
}

export interface AIQuiz {
  type: 'quiz'
  metadata: AIContentMetadata & {
    totalQuestions: number
    passingScore: number
  }
  content: QuizContent
}

// ==================== Flashcard Content Interfaces ====================

export interface FlashcardCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface FlashcardExample {
  title: string
  code: string
  language: string
}

export interface FlashcardSide {
  text: string
  type: 'text' | 'image' | 'code'
  additionalInfo?: string
  details?: string[]
  example?: FlashcardExample
}

export interface FlashcardCard {
  id: number
  categoryId: string
  difficulty: 'easy' | 'medium' | 'hard'
  front: FlashcardSide
  back: FlashcardSide
  tags: string[]
  studyNotes?: string
}

export interface StudyMode {
  id: string
  name: string
  description: string
}

export interface FlashcardContent {
  description: string
  categories: FlashcardCategory[]
  cards: FlashcardCard[]
  studyModes: StudyMode[]
}

export interface AIFlashcard {
  type: 'flashcard'
  metadata: AIContentMetadata & {
    totalCards: number
  }
  content: FlashcardContent
}

// ==================== Summary Content Interfaces ====================

export interface SummaryKeyPoint {
  id: number
  title: string
  description: string
  importance: 'high' | 'medium' | 'low'
  icon: string
}

export interface ComparisonItem {
  aspect: string
  classComponent: string
  functionalComponent: string
  advantage: 'class' | 'functional' | 'equal'
}

export interface SummaryComparison {
  title: string
  items: ComparisonItem[]
}

export interface SummaryContent {
  topic: string
  overview: string
  keyPoints: SummaryKeyPoint[]
  quickFacts: string[]
  comparison?: SummaryComparison
  conclusion: string
  nextSteps: string[]
}

export interface AISummary {
  type: 'summary'
  metadata: AIContentMetadata
  content: SummaryContent
}

// ==================== Union Types ====================

export type AIContentType = AINote | AIQuiz | AIFlashcard | AISummary

export type ContentFormat = 'note' | 'quiz' | 'flashcard' | 'summary'

// ==================== Request/Response Types ====================

export interface ContentGenerationRequest {
  prompt: string
  outputFormat: ContentFormat
  language: 'th' | 'en'
  difficulty: 'easy' | 'intermediate' | 'advanced'
  additionalParams?: {
    includeExamples?: boolean
    includeCodeSnippets?: boolean
    questionCount?: number // สำหรับ quiz
    cardCount?: number     // สำหรับ flashcard
  }
}

export interface ContentGenerationResponse extends APIResponse<AIContentType> {}

// ==================== Frontend Component Props ====================

export interface InteractiveNoteProps {
  content: string // JSON string ที่ parse เป็น AINote
  title?: string
}

export interface InteractiveQuizProps {
  content: string // JSON string ที่ parse เป็น AIQuiz
}

export interface InteractiveFlashcardProps {
  content: string // JSON string ที่ parse เป็น AIFlashcard
}

// ==================== Helper Types ====================

export interface ParsedContent<T extends AIContentType = AIContentType> {
  isValid: boolean
  data: T | null
  error?: string
}

export interface ContentParser {
  parseNote: (content: string) => ParsedContent<AINote>
  parseQuiz: (content: string) => ParsedContent<AIQuiz>
  parseFlashcard: (content: string) => ParsedContent<AIFlashcard>
  parseSummary: (content: string) => ParsedContent<AISummary>
  parseAny: (content: string) => ParsedContent<AIContentType>
}

// ==================== Store Types ====================

export interface AIContentState {
  // Generation state
  isGenerating: boolean
  generationProgress: number
  currentRequest: {
    id: string
    prompt: string
    format: ContentFormat
    status: 'pending' | 'processing' | 'completed' | 'failed'
  } | null

  // Content state
  generatedContent: AIContentType | null
  savedContent: AIContentType[]

  // UI state
  selectedFormat: ContentFormat
  selectedDifficulty: 'easy' | 'intermediate' | 'advanced'
  selectedLanguage: 'th' | 'en'

  // Error state
  error: string | null
}

export interface AIContentActions {
  // Generation actions
  generateContent: (request: ContentGenerationRequest) => Promise<void>
  cancelGeneration: () => void

  // Content actions
  saveGeneratedContent: () => Promise<void>
  loadSavedContent: () => Promise<void>
  deleteContent: (id: number) => Promise<void>

  // UI actions
  setFormat: (format: ContentFormat) => void
  setDifficulty: (difficulty: 'easy' | 'intermediate' | 'advanced') => void
  setLanguage: (language: 'th' | 'en') => void
  clearError: () => void
}

// ==================== Utility Functions Types ====================

export interface ContentValidator {
  validateNote: (content: unknown) => content is AINote
  validateQuiz: (content: unknown) => content is AIQuiz
  validateFlashcard: (content: unknown) => content is AIFlashcard
  validateSummary: (content: unknown) => content is AISummary
  validateAny: (content: unknown) => content is AIContentType
}

export interface ContentFormatter {
  formatNoteForDisplay: (note: AINote) => {
    title: string
    sections: Array<{
      title: string
      content: string[]
      level: number
    }>
  }

  formatQuizForDisplay: (quiz: AIQuiz) => {
    title: string
    totalQuestions: number
    questions: Array<{
      id: number
      question: string
      type: string
      options?: string[]
    }>
  }

  formatFlashcardForDisplay: (flashcard: AIFlashcard) => {
    title: string
    totalCards: number
    categories: Array<{
      id: string
      name: string
      cardCount: number
    }>
    cards: Array<{
      id: number
      front: string
      back: string
      category: string
    }>
  }
}

// ==================== API Service Types ====================

export interface AIContentService {
  generateContent: (request: ContentGenerationRequest) => Promise<ContentGenerationResponse>
  getGenerationStatus: (requestId: string) => Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    result?: AIContentType
  }>
  getSavedContent: () => Promise<{
    content: Array<{
      id: number
      title: string
      type: ContentFormat
      content: string
      createdAt: string
    }>
  }>
  saveContent: (content: AIContentType) => Promise<{ success: boolean }>
  deleteContent: (id: number) => Promise<{ success: boolean }>
}

// ==================== Component State Types ====================

export interface NoteDisplayState {
  currentSection: number
  showTableOfContents: boolean
  fontSize: number
  theme: 'light' | 'dark' | 'sepia'
}

export interface QuizDisplayState {
  currentQuestion: number
  userAnswers: Record<number, string | string[]>
  showResults: boolean
  timeRemaining?: number
  isSubmitted: boolean
}

export interface FlashcardDisplayState {
  currentCard: number
  isFlipped: boolean
  studyMode: 'learn' | 'review' | 'test'
  selectedCategory?: string
  correctAnswers: number
  totalAnswered: number
}

// ==================== Export All ====================

export type {
  // Main content types
  AINote,
  AIQuiz,
  AIFlashcard,
  AISummary,
  AIContentType,

  // Component props
  InteractiveNoteProps,
  InteractiveQuizProps,
  InteractiveFlashcardProps,

  // API types
  ContentGenerationRequest,
  ContentGenerationResponse,
  APIResponse,
  APIError,

  // Store types
  AIContentState,
  AIContentActions,

  // Service types
  AIContentService,

  // Utility types
  ContentValidator,
  ContentFormatter,
  ParsedContent,
  ContentParser,

  // State types
  NoteDisplayState,
  QuizDisplayState,
  FlashcardDisplayState
}

// ==================== Type Guards ====================

export function isAINote(content: unknown): content is AINote {
  return typeof content === 'object' &&
         content !== null &&
         'type' in content &&
         content.type === 'note'
}

export function isAIQuiz(content: unknown): content is AIQuiz {
  return typeof content === 'object' &&
         content !== null &&
         'type' in content &&
         content.type === 'quiz'
}

export function isAIFlashcard(content: unknown): content is AIFlashcard {
  return typeof content === 'object' &&
         content !== null &&
         'type' in content &&
         content.type === 'flashcard'
}

export function isAISummary(content: unknown): content is AISummary {
  return typeof content === 'object' &&
         content !== null &&
         'type' in content &&
         content.type === 'summary'
}

export function isAIContentType(content: unknown): content is AIContentType {
  return isAINote(content) ||
         isAIQuiz(content) ||
         isAIFlashcard(content) ||
         isAISummary(content)
}
