<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAIContentStore } from '@/stores/aiContent'
import type { AIGeneratedContent } from '@/service/AIContentService'
import InteractiveQuiz from './InteractiveQuiz.vue'
import InteractiveNote from './InteractiveNote.vue'
import InteractiveFlashcard from './InteractiveFlashcard.vue'

const aiStore = useAIContentStore()

// UI state
const selectedFormat = ref<string>('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const viewMode = ref<'grid' | 'list'>('grid')
const showDeleteModal = ref(false)
const showDetailModal = ref(false)
const contentToDelete = ref<AIGeneratedContent | null>(null)
const selectedContent = ref<AIGeneratedContent | null>(null)
const currentViewMode = ref<'detail' | 'interactive'>('detail')

// Format options
const formatOptions = [
  { value: 'all', label: 'All Formats', icon: 'List' },
  { value: 'summary', label: 'Summary', icon: 'FileText', color: 'text-blue-600 bg-blue-50' },
  { value: 'quiz', label: 'Quiz', icon: 'HelpCircle', color: 'text-green-600 bg-green-50' },
  { value: 'flashcard', label: 'Flashcards', icon: 'Cards', color: 'text-purple-600 bg-purple-50' },
  { value: 'note', label: 'Notes', icon: 'StickyNote', color: 'text-orange-600 bg-orange-50' },
]

// Computed properties
const filteredContent = computed(() => {
  let filtered = aiStore.getSavedContent

  // Filter by format
  if (selectedFormat.value !== 'all') {
    filtered = filtered.filter(content => content.outputFormat === selectedFormat.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(content =>
      content.title.toLowerCase().includes(query) ||
      content.content.toLowerCase().includes(query) ||
      content.outputFormat.toLowerCase().includes(query)
    )
  }

  return filtered
})

const paginatedContent = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredContent.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredContent.value.length / itemsPerPage.value)
})

// Methods
const handleFormatChange = (format: string) => {
  selectedFormat.value = format
  currentPage.value = 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleViewModeChange = (mode: 'grid' | 'list') => {
  viewMode.value = mode
}

const handleDownload = async (content: AIGeneratedContent) => {
  try {
    await aiStore.downloadContent(content.id)
  } catch (error) {
    console.error('Failed to download content:', error)
  }
}

const handleDelete = async (content: AIGeneratedContent) => {
  contentToDelete.value = content
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!contentToDelete.value) return

  try {
    await aiStore.deleteContent(contentToDelete.value.id)
    showDeleteModal.value = false
    contentToDelete.value = null
  } catch (error) {
    console.error('Failed to delete content:', error)
  }
}

const handleViewDetails = (content: AIGeneratedContent) => {
  selectedContent.value = content
  currentViewMode.value = 'detail'
  showDetailModal.value = true
}

const handleInteractiveView = (content: AIGeneratedContent) => {
  selectedContent.value = content
  currentViewMode.value = 'interactive'
  showDetailModal.value = true
}

const getFormatIcon = (format: string) => {
  const formatOption = formatOptions.find(option => option.value === format)
  return formatOption?.icon || 'File'
}

const getFormatColor = (format: string) => {
  const formatOption = formatOptions.find(option => option.value === format)
  return formatOption?.color || 'text-slate-600 bg-slate-50'
}

const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Helper functions สำหรับ parse และ format content
const tryParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return null
  }
}

const extractTopicTitle = (content: AIGeneratedContent) => {
  // Try to parse content and extract topic from JSON first
  const parsedContent = tryParseJSON(content.content)
  if (parsedContent && parsedContent.topic && typeof parsedContent.topic === 'string') {
    return parsedContent.topic
  }

  // Fallback: สร้างชื่อตามลำดับสำหรับแต่ละประเภทเนื้อหา
  const contentIndex = filteredContent.value.findIndex(c => c.id === content.id) + 1

  switch (content.outputFormat.toLowerCase()) {
    case 'flashcard':
      return `Flashcard ${contentIndex}`
    case 'note':
      return `Note ${contentIndex}`
    case 'quiz':
      return `Quiz ${contentIndex}`
    case 'summary':
      return `Summary ${contentIndex}`
    default:
      return `Content ${contentIndex}`
  }
}

const generateContentPreview = (content: AIGeneratedContent): string => {
  const parsedContent = tryParseJSON(content.content)

  if (!parsedContent) {
    return truncateText(content.content, 150)
  }

  // Check if new API format (with metadata) or current API format
  const isNewFormat = !!(parsedContent.metadata && parsedContent.content)

  // สร้าง preview ตาม content type
  switch (content.outputFormat) {
    case 'note':
      if (isNewFormat) {
        const metadata = parsedContent.metadata as Record<string, unknown> || {}
        const contentData = parsedContent.content as Record<string, unknown> || {}
        const topic = (contentData.topic as string) || (metadata.title as string) || content.title
        const sections = Array.isArray(contentData.sections) ? contentData.sections : []
        const difficulty = (metadata.difficulty as string) || 'beginner'
        const readTime = (metadata.estimatedReadTime as string) || '5 นาที'
        return `📝 ${topic} • ${sections.length} หัวข้อ • ระดับ ${difficulty} • อ่าน ${readTime}`
      } else {
        // Current API format: { title, content: [{ feature, description }] }
        const title = (parsedContent.title as string) || content.title || 'Study Notes'
        const contentArray = Array.isArray(parsedContent.content) ? parsedContent.content : []
        const readTime = `${Math.max(1, Math.ceil(contentArray.length * 2))} นาที`
        return `📝 ${title} • ${contentArray.length} หัวข้อ • อ่าน ${readTime}`
      }

    case 'quiz':
      if (isNewFormat) {
        const metadata = parsedContent.metadata as Record<string, unknown> || {}
        const contentData = parsedContent.content as Record<string, unknown> || {}
        const quizTitle = (contentData.title as string) || (metadata.title as string) || content.title
        const questions = Array.isArray(contentData.questions) ? contentData.questions : []
        const difficulty = (metadata.difficulty as string) || 'beginner'
        const duration = (metadata.estimatedTime as string) || '10 นาที'
        return `🧠 ${quizTitle} • ${questions.length} คำถาม • ระดับ ${difficulty} • ${duration}`
      } else {
        // Current API format: { questions: [{ question, options, answer }] }
        const title = content.title || 'Quiz'
        const questions = Array.isArray(parsedContent.questions) ? parsedContent.questions : []
        return `🧠 ${title} • ${questions.length} คำถาม • ทดสอบความรู้`
      }

    case 'flashcard':
      if (isNewFormat) {
        const metadata = parsedContent.metadata as Record<string, unknown> || {}
        const contentData = parsedContent.content as Record<string, unknown> || {}
        const deckTitle = (contentData.title as string) || (metadata.title as string) || content.title
        const cards = Array.isArray(contentData.cards) ? contentData.cards : []
        const categories = Array.isArray(contentData.categories) ? contentData.categories.length : 1
        return `${deckTitle} • ${cards.length} Cards • ${categories} Categories`
      } else {
        // Current API format: { flashcards: [{ question, answer }] } or { prompt, response }
        let title = content.title || 'Flashcards'
        let cardCount = 0

        if (Array.isArray(parsedContent.flashcards)) {
          cardCount = parsedContent.flashcards.length
        } else if (parsedContent.prompt && parsedContent.response) {
          cardCount = 1
          // Extract topic from prompt if possible
          const prompt = parsedContent.prompt as string
          if (prompt.includes('photosynthesis')) title = 'Photosynthesis Study'
          else if (prompt.includes('HTML')) title = 'HTML Study'
          else if (prompt.includes('CSS')) title = 'CSS Study'
          else title = prompt.split(' ').slice(0, 3).join(' ') || 'Study Cards'
        }

        return `${title} • ${cardCount} Cards • Interactive Study`
      }

    case 'summary':
      if (isNewFormat) {
        const metadata = parsedContent.metadata as Record<string, unknown> || {}
        const contentData = parsedContent.content as Record<string, unknown> || {}
        const summaryTitle = (contentData.topic as string) || (metadata.title as string) || content.title
        const keyPoints = Array.isArray(contentData.keyPoints) ? contentData.keyPoints : []
        const readTime = (metadata.estimatedReadTime as string) || '5 min'
        return `${summaryTitle} • ${keyPoints.length} Key Points • ${readTime} read`
      } else {
        // Current API format: { summary, keyPoints }
        const title = content.title || 'Summary'
        const keyPoints = Array.isArray(parsedContent.keyPoints) ? parsedContent.keyPoints : []
        return `${title} • ${keyPoints.length} Key Points • Content Summary`
      }

    default:
      return truncateText(content.content, 150)
  }
}

const isValidJSONContent = (content: AIGeneratedContent): boolean => {
  const parsedContent = tryParseJSON(content.content)
  if (!parsedContent) return false

  // ตรวจสอบว่าเป็น supported content type
  const supportedTypes = ['note', 'quiz', 'flashcard', 'summary']
  const isSupportedType = supportedTypes.includes(content.outputFormat.toLowerCase())

  if (!isSupportedType) return false

  // ตรวจสอบ structure ตาม content type
  switch (content.outputFormat.toLowerCase()) {
    case 'note':
      // New format: { metadata, content: { sections } }
      // Current format: { title, content: [{ feature, description }] }
      // Alternative formats: { topic, content: {...} } or any object with content structure
      const hasNewNoteFormat = !!(parsedContent.metadata && parsedContent.content?.sections)
      const hasCurrentNoteFormat = !!(parsedContent.title && Array.isArray(parsedContent.content))
      const hasTopicFormat = !!(parsedContent.topic || parsedContent.content)
      const hasAnyNoteStructure = !!(
        parsedContent.sections ||
        parsedContent.content ||
        Object.keys(parsedContent).length > 0
      )

      console.log('🔍 Note validation check:', {
        hasNewNoteFormat,
        hasCurrentNoteFormat,
        hasTopicFormat,
        hasAnyNoteStructure,
        keys: Object.keys(parsedContent),
        contentType: typeof parsedContent.content,
        isContentArray: Array.isArray(parsedContent.content)
      })

      return hasNewNoteFormat || hasCurrentNoteFormat || hasTopicFormat || hasAnyNoteStructure

    case 'flashcard':
      // New format: { metadata, content: { cards } }
      // Current format: { flashcards: [{ question, answer }] }
      // Prompt/response format: { prompt, response }
      const hasNewFlashcardFormat = !!(parsedContent.metadata && parsedContent.content?.cards)
      const hasCurrentFlashcardFormat = !!(Array.isArray(parsedContent.flashcards))
      const hasPromptResponseFormat = !!(parsedContent.prompt && parsedContent.response)
      return hasNewFlashcardFormat || hasCurrentFlashcardFormat || hasPromptResponseFormat

    case 'quiz':
      // New format: { metadata, content: { questions } }
      // Current format: { questions: [{ question, options, answer }] }
      const hasNewQuizFormat = !!(parsedContent.metadata && parsedContent.content?.questions)
      const hasCurrentQuizFormat = !!(Array.isArray(parsedContent.questions))
      return hasNewQuizFormat || hasCurrentQuizFormat

    case 'summary':
      // New format: { metadata, content: { keyPoints } }
      // Current format: { summary, keyPoints }
      const hasNewSummaryFormat = !!(parsedContent.metadata && parsedContent.content?.keyPoints)
      const hasCurrentSummaryFormat = !!(parsedContent.summary || Array.isArray(parsedContent.keyPoints))
      return hasNewSummaryFormat || hasCurrentSummaryFormat

    default:
      return false
  }
}

const renderContentPreview = (content: AIGeneratedContent): string => {
  const parsedContent = tryParseJSON(content.content)

  if (!parsedContent) {
    // Fallback for non-JSON content - show formatted text instead of raw JSON
    const contentText = content.content || 'No content available'
    return `<div class="space-y-4">
      <h3 class="text-lg font-semibold text-slate-900">${content.title}</h3>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-sm text-yellow-800">⚠️ Content format needs updating. Showing raw content below:</p>
      </div>
      <div class="text-sm text-slate-600 whitespace-pre-wrap max-h-96 overflow-y-auto border rounded p-3 bg-slate-50">
        ${contentText.substring(0, 1000)}${contentText.length > 1000 ? '...' : ''}
      </div>
    </div>`
  }

  try {
    switch (content.outputFormat) {
      case 'note':
        return renderNotePreview(parsedContent)
      case 'quiz':
        return renderQuizPreview(parsedContent)
      case 'flashcard':
        return renderFlashcardPreview(parsedContent)
      case 'summary':
        return renderSummaryPreview(parsedContent)
      default:
        return `<div class="text-center py-8">
          <p class="text-slate-500">Preview not available for "${content.outputFormat}" content type.</p>
          <p class="text-sm text-slate-400 mt-2">Content ID: ${content.id}</p>
        </div>`
    }
  } catch (error) {
    console.error('Error rendering preview:', error)
    return `<div class="space-y-4">
      <h3 class="text-lg font-semibold text-slate-900">${content.title}</h3>
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-800">❌ Error rendering preview. Please try interactive mode.</p>
      </div>
    </div>`
  }
}

// Deleted unused ContentPreviewDisplay component - using inline rendering instead

const renderNotePreview = (parsedContent: Record<string, unknown>) => {
  // Handle both new API format และ legacy format
  const isNewFormat = !!(parsedContent.metadata && parsedContent.content)

  let title: string, sections: Record<string, unknown>[], difficulty: string, readTime: string, tags: unknown[], overview: string

  if (isNewFormat) {
    // New API format with metadata structure
    const metadata = parsedContent.metadata as Record<string, unknown> || {}
    const contentData = parsedContent.content as Record<string, unknown> || {}

    title = (metadata.title as string) || (contentData.topic as string) || 'Study Notes'
    difficulty = (metadata.difficulty as string) || 'beginner'
    readTime = (metadata.estimatedReadTime as string) || '5 min'
    tags = Array.isArray(metadata.tags) ? metadata.tags : []
    sections = Array.isArray(contentData.sections) ? contentData.sections : []
    overview = (contentData.overview as string) || 'Learning notes'
  } else {
    // Current API format: { title, content: [{ feature, description }] }
    title = (parsedContent.title as string) || 'Study Notes'
    const contentArray = Array.isArray(parsedContent.content) ? parsedContent.content : []

    // Convert content array to sections format
    sections = contentArray.map((item: Record<string, unknown>, index: number) => ({
      id: index + 1,
      title: item.feature || item.title || `Section ${index + 1}`,
      content: [item.description || item.content || 'No content available']
    }))

    difficulty = 'beginner'
    readTime = `${Math.max(1, Math.ceil(sections.length * 2))} min`
    tags = []
    overview = `Study notes about ${title}`
  }

  let html = `<div class="space-y-6">`

  // Header section
  html += `<div class="border-b border-slate-200 pb-4">`
  html += `<h3 class="text-xl font-bold text-slate-900 mb-2 flex items-center">`
  html += `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`
  html += `</svg>${title}</h3>`
  html += `<div class="flex flex-wrap gap-2 mb-3">`
  html += `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Level: ${difficulty}</span>`
  html += `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">`
  html += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
  html += `</svg>${readTime}</span>`
  html += `<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${sections.length} Sections</span>`
  html += `</div>`
  if (overview) {
    html += `<p class="text-slate-600 text-sm">${overview}</p>`
  }
  html += `</div>`

  // Tags section
  if (tags.length > 0) {
    html += `<div class="flex flex-wrap gap-1">`
    tags.slice(0, 5).forEach((tag: unknown) => {
      html += `<span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">#${tag}</span>`
    })
    html += `</div>`
  }

  // Sections preview
  if (sections.length > 0) {
    html += `<div class="space-y-3">`
    html += `<h4 class="font-semibold text-slate-800 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>`
    html += `</svg>Content Overview:</h4>`
    sections.slice(0, 4).forEach((section: unknown, index: number) => {
      const sectionData = section as Record<string, unknown>
      const sectionTitle = sectionData.title as string || `Section ${index + 1}`
      const sectionContent = Array.isArray(sectionData.content) ? sectionData.content : []

      html += `<div class="border-l-4 border-blue-300 pl-4 py-2 bg-blue-50 rounded-r">`
      html += `<h5 class="font-medium text-slate-800 mb-1">${index + 1}. ${sectionTitle}</h5>`

      if (sectionContent.length > 0 && typeof sectionContent[0] === 'string') {
        const preview = (sectionContent[0] as string).substring(0, 120)
        html += `<p class="text-sm text-slate-600">${preview}${(sectionContent[0] as string).length > 120 ? '...' : ''}</p>`
      }
      html += `</div>`
    })

    if (sections.length > 4) {
      html += `<div class="text-center py-2">`
      html += `<span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">+${sections.length - 4} more sections...</span>`
      html += `</div>`
    }
    html += `</div>`
  }

  html += `</div>`
  return html
}

const renderQuizPreview = (parsedContent: Record<string, unknown>) => {
  const metadata = parsedContent.metadata as Record<string, unknown> || {}
  const contentData = parsedContent.content as Record<string, unknown> || {}

  const title = (metadata.title as string) || (contentData.title as string) || 'Interactive Quiz'
  const difficulty = (metadata.difficulty as string) || 'beginner'
  const duration = (metadata.estimatedTime as string) || '10 min'
  const subject = (metadata.subject as string) || 'General'
  const questions = Array.isArray(contentData.questions) ? contentData.questions : []
  const instructions = (contentData.instructions as string) || 'Complete the quiz to test your understanding'

  // Count question types
  const questionTypes = questions.reduce((acc: Record<string, number>, q: unknown) => {
    const questionData = q as Record<string, unknown>
    const type = questionData.type as string || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  let html = `<div class="space-y-6">`

  // Header section
  html += `<div class="border-b border-slate-200 pb-4">`
  html += `<h3 class="text-xl font-bold text-slate-900 mb-2 flex items-center">`
  html += `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
  html += `</svg>${title}</h3>`
  html += `<div class="flex flex-wrap gap-2 mb-3">`
  html += `<span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Level: ${difficulty}</span>`
  html += `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center">`
  html += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
  html += `</svg>${duration}</span>`
  html += `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${questions.length} Questions</span>`
  html += `<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${subject}</span>`
  html += `</div>`
  html += `<p class="text-slate-600 text-sm">${instructions}</p>`
  html += `</div>`

  // Question types summary
  if (Object.keys(questionTypes).length > 0) {
    html += `<div class="bg-slate-50 p-4 rounded-lg">`
    html += `<h4 class="font-semibold text-slate-800 mb-2 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>`
    html += `</svg>Question Types:</h4>`
    html += `<div class="flex flex-wrap gap-2">`
    Object.entries(questionTypes).forEach(([type, count]) => {
      const typeLabel = type === 'multiple-choice' ? 'Multiple Choice' :
                       type === 'true-false' ? 'True/False' :
                       type === 'essay' ? 'Essay' :
                       type === 'short-answer' ? 'Short Answer' : type
      html += `<span class="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded">${typeLabel}: ${count}</span>`
    })
    html += `</div>`
    html += `</div>`
  }

  // Sample questions preview
  if (questions.length > 0) {
    html += `<div class="space-y-3">`
    html += `<h4 class="font-semibold text-slate-800 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>`
    html += `</svg>Sample Questions:</h4>`
    questions.slice(0, 3).forEach((question: unknown, index: number) => {
      const questionData = question as Record<string, unknown>
      const questionText = questionData.question as string || 'Question'
      const questionType = questionData.type as string || 'unknown'
      const options = Array.isArray(questionData.options) ? questionData.options : []

      html += `<div class="border border-slate-200 rounded-lg p-4 bg-white">`
      html += `<div class="flex items-center gap-2 mb-2">`
      html += `<span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">${index + 1}</span>`
      html += `<span class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">${questionType}</span>`
      html += `</div>`
      html += `<p class="text-sm text-slate-800 font-medium mb-2">${questionText}</p>`

      if (options.length > 0) {
        html += `<div class="space-y-1">`
        options.slice(0, 4).forEach((option: unknown, optIndex: number) => {
          const optionText = typeof option === 'string' ? option : (option as Record<string, unknown>)?.text as string || 'ตัวเลือก'
          const letter = String.fromCharCode(65 + optIndex) // A, B, C, D
          html += `<div class="text-xs text-slate-600 ml-4">• ${letter}. ${optionText}</div>`
        })
        html += `</div>`
      }
      html += `</div>`
    })

    if (questions.length > 3) {
      html += `<div class="text-center py-2">`
      html += `<span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">+${questions.length - 3} more questions...</span>`
      html += `</div>`
    }
    html += `</div>`
  }

  html += `</div>`
  return html
}

const renderFlashcardPreview = (parsedContent: Record<string, unknown>) => {
  // Handle both new API format และ current API format
  const isNewFormat = !!(parsedContent.metadata && parsedContent.content)

    let title: string = 'Study Flashcards'
  let cards: Record<string, unknown>[] = []
  let difficulty: string = 'beginner'
  let subject: string = 'General'
  let categories: Record<string, unknown>[] = []
  let instructions: string = 'Interactive flashcard set for study and review'

  if (isNewFormat) {
    // New API format with metadata structure
    const metadata = parsedContent.metadata as Record<string, unknown> || {}
    const contentData = parsedContent.content as Record<string, unknown> || {}

    title = (metadata.title as string) || (contentData.title as string) || 'Study Flashcards'
    difficulty = (metadata.difficulty as string) || 'beginner'
    subject = (metadata.subject as string) || 'General'
    cards = Array.isArray(contentData.cards) ? contentData.cards : []
    categories = Array.isArray(contentData.categories) ? contentData.categories : []
    instructions = (contentData.instructions as string) || 'ใช้การ์ดแฟลชเพื่อฝึกจำและทบทวน'
    } else {
    // Current API format: { flashcards: [{ question, answer }] } or { prompt, response }
    if (Array.isArray(parsedContent.flashcards)) {
      title = 'Study Flashcards'
      const flashcardsArray = parsedContent.flashcards

      // Convert flashcards array to cards format
      cards = flashcardsArray.map((item: Record<string, unknown>, index: number) => ({
        id: index + 1,
        front: { text: item.question || 'Question' },
        back: { text: item.answer || 'Answer', details: item.answer || 'Answer' },
        categoryId: 'general'
      }))
    } else if (parsedContent.prompt && parsedContent.response) {
      // Handle prompt/response format
      const prompt = parsedContent.prompt as string

      // Extract topic from prompt
      if (prompt.includes('photosynthesis')) title = 'Photosynthesis Study Cards'
      else if (prompt.includes('HTML')) title = 'HTML Study Cards'
      else if (prompt.includes('CSS')) title = 'CSS Study Cards'
      else title = prompt.split(' ').slice(0, 3).join(' ') + ' Cards' || 'Study Cards'

      cards = [{
        id: 1,
        front: { text: prompt },
        back: { text: parsedContent.response as string, details: parsedContent.response as string },
        categoryId: 'general'
      }]
    }

    categories = [{ id: 'general', name: 'General' }]
    difficulty = 'beginner'
    subject = 'General'
    instructions = `Interactive flashcard set with ${cards.length} card${cards.length > 1 ? 's' : ''} for study and review`
  }

  // นับการ์ดในแต่ละหมวดหมู่
  const categoryStats = categories.reduce((acc: Record<string, number>, cat: unknown) => {
    const category = cat as Record<string, unknown>
    const categoryId = category.id as string || 'unknown'
    const categoryName = category.name as string || categoryId
    const cardCount = cards.filter((card: unknown) => {
      const cardData = card as Record<string, unknown>
      return cardData.categoryId === categoryId
    }).length
    acc[categoryName] = cardCount
    return acc
  }, {})

  let html = `<div class="space-y-6">`

  // Header section
  html += `<div class="border-b border-slate-200 pb-4">`
  html += `<h3 class="text-xl font-bold text-slate-900 mb-2">`
  html += `<svg class="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>`
  html += `</svg>${title}</h3>`
  html += `<div class="flex flex-wrap gap-2 mb-3">`
  html += `<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Level: ${difficulty}</span>`
  html += `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">${cards.length} Cards</span>`
  html += `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">${categories.length} Categories</span>`
  html += `<span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">${subject}</span>`
  html += `</div>`
  html += `<p class="text-slate-600 text-sm">${instructions}</p>`
  html += `</div>`

  // Categories summary
  if (Object.keys(categoryStats).length > 0) {
    html += `<div class="bg-slate-50 p-4 rounded-lg">`
    html += `<h4 class="font-semibold text-slate-800 mb-2 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>`
    html += `</svg>Categories:</h4>`
    html += `<div class="grid grid-cols-2 gap-2">`
    Object.entries(categoryStats).forEach(([categoryName, count]) => {
      html += `<div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded">`
      html += `<span class="text-sm text-slate-700">${categoryName}</span>`
      html += `<span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">${count} Cards</span>`
      html += `</div>`
    })
    html += `</div>`
    html += `</div>`
  }

    // Sample cards preview (front side only)
  if (cards.length > 0) {
    html += `<div class="space-y-3">`
    html += `<h4 class="font-semibold text-slate-800 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`
    html += `</svg>Sample Cards:</h4>`
    cards.slice(0, 3).forEach((card: Record<string, unknown>, index: number) => {
      const front = card.front as Record<string, unknown> || {}
      const frontText = front.text as string || 'Question'
      const categoryId = card.categoryId as string
      const category = categories.find((cat: Record<string, unknown>) => {
        return cat.id === categoryId
      }) || {}
      const categoryName = category.name as string || 'General'

      html += `<div class="border border-slate-200 rounded-lg bg-white overflow-hidden">`

      // Front side only
      html += `<div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100">`
      html += `<div class="flex items-center justify-between mb-3">`
      html += `<div class="flex items-center">`
      html += `<svg class="w-4 h-4 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
      html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2"></path>`
      html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"></path>`
      html += `</svg>`
      html += `<span class="text-xs font-bold text-purple-700">Card ${index + 1}</span>`
      html += `</div>`
      html += `<span class="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">${categoryName}</span>`
      html += `</div>`
      html += `<p class="text-sm text-slate-800 font-medium leading-relaxed">${frontText}</p>`
      html += `</div>`

      html += `</div>`
    })

    if (cards.length > 3) {
      html += `<div class="text-center py-2">`
      html += `<span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">+${cards.length - 3} more cards...</span>`
      html += `</div>`
    }
    html += `</div>`
  }

  html += `</div>`
  return html
}

const renderSummaryPreview = (parsedContent: Record<string, unknown>) => {
  const metadata = parsedContent.metadata as Record<string, unknown> || {}
  const contentData = parsedContent.content as Record<string, unknown> || {}

  const title = (metadata.title as string) || (contentData.topic as string) || 'Content Summary'
  const difficulty = (metadata.difficulty as string) || 'beginner'
  const readTime = (metadata.estimatedReadTime as string) || '5 min'
  const subject = (metadata.subject as string) || 'General'
  const tags = Array.isArray(metadata.tags) ? metadata.tags : []
  const overview = (contentData.overview as string) || 'Content summary and key insights'
  const keyPoints = Array.isArray(contentData.keyPoints) ? contentData.keyPoints : []
  const conclusion = (contentData.conclusion as string) || ''

  let html = `<div class="space-y-6">`

  // Header section
  html += `<div class="border-b border-slate-200 pb-4">`
  html += `<h3 class="text-xl font-bold text-slate-900 mb-2 flex items-center">`
  html += `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`
  html += `</svg>${title}</h3>`
  html += `<div class="flex flex-wrap gap-2 mb-3">`
  html += `<span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Level: ${difficulty}</span>`
  html += `<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">`
  html += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
  html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
  html += `</svg>${readTime}</span>`
  html += `<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">${keyPoints.length} Key Points</span>`
  html += `<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">${subject}</span>`
  html += `</div>`
  html += `<p class="text-slate-600 text-sm leading-relaxed">${overview}</p>`
  html += `</div>`

  // Tags section
  if (tags.length > 0) {
    html += `<div class="flex flex-wrap gap-1">`
    tags.slice(0, 6).forEach((tag: unknown) => {
      html += `<span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">#${tag}</span>`
    })
    html += `</div>`
  }

  // Key points preview
  if (keyPoints.length > 0) {
    html += `<div class="space-y-3">`
    html += `<h4 class="font-semibold text-slate-800 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>`
    html += `</svg>Key Points:</h4>`
    html += `<div class="space-y-3">`
    keyPoints.slice(0, 5).forEach((point: unknown, index: number) => {
      const pointData = point as Record<string, unknown>
      const pointTitle = pointData.title as string || `Key Point ${index + 1}`
      const pointContent = pointData.content as string || pointData.description as string || 'Details'
      const examples = Array.isArray(pointData.examples) ? pointData.examples : []

      html += `<div class="border-l-4 border-yellow-400 pl-4 py-3 bg-yellow-50 rounded-r">`
      html += `<h5 class="font-medium text-slate-800 mb-2 flex items-center gap-2">`
      html += `<span class="w-5 h-5 bg-yellow-400 text-white rounded-full flex items-center justify-center text-xs font-bold">${index + 1}</span>`
      html += `${pointTitle}</h5>`
      html += `<p class="text-sm text-slate-700 mb-2 leading-relaxed">${pointContent}</p>`

      if (examples.length > 0) {
        html += `<div class="text-xs text-slate-600">`
        html += `<span class="font-medium">ตัวอย่าง:</span> `
        html += examples.slice(0, 2).map((ex: unknown) => `"${ex}"`).join(', ')
        if (examples.length > 2) html += ` และอีก ${examples.length - 2} ตัวอย่าง`
        html += `</div>`
      }
      html += `</div>`
    })
    html += `</div>`

    if (keyPoints.length > 5) {
      html += `<div class="text-center py-2">`
      html += `<span class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">+${keyPoints.length - 5} more key points...</span>`
      html += `</div>`
    }
    html += `</div>`
  }

  // Conclusion section
  if (conclusion) {
    html += `<div class="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-400">`
    html += `<h4 class="font-semibold text-slate-800 mb-2 flex items-center">`
    html += `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    html += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>`
    html += `</svg>Conclusion:</h4>`
    html += `<p class="text-sm text-slate-700 leading-relaxed">${conclusion}</p>`
    html += `</div>`
  }

  html += `</div>`
  return html
}

// Load data on mount
onMounted(async () => {
  try {
    await aiStore.loadSavedContent()

    // ถ้ามี currentRequest แสดงว่ามาจาก GenerationHistory
    if (aiStore.currentRequest) {
      console.log('Viewing content from request:', aiStore.currentRequest.requestId)
      // อาจจะเพิ่ม auto-scroll หรือ highlight ในอนาคต
    }
  } catch (error) {
    console.error('Failed to load saved content:', error)
  }
})

// Content preview rendering is now handled inline
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">My Content Library</h1>
      <p class="text-slate-600">Manage and organize your saved AI-generated content</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Total Content</p>
            <p class="text-lg font-semibold text-slate-900">{{ aiStore.getSavedContent.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Quizzes</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getSavedContent.filter(c => c.outputFormat === 'quiz').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Flashcards</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getSavedContent.filter(c => c.outputFormat === 'flashcard').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Notes</p>
            <p class="text-lg font-semibold text-slate-900">
              {{ aiStore.getSavedContent.filter(c => c.outputFormat === 'note').length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-slate-200 p-4">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 rounded-lg">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-slate-600">Downloads</p>
            <p class="text-lg font-semibold text-slate-900">0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <!-- Format Filter -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Format Filter</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in formatOptions"
                :key="option.value"
                @click="handleFormatChange(option.value)"
                :class="
                  selectedFormat === option.value
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                "
                class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="option.icon === 'List'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  <path v-else-if="option.icon === 'FileText'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path v-else-if="option.icon === 'HelpCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="option.icon === 'Cards'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Search -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search by title or content..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-700">View:</label>
          <div class="flex border border-slate-300 rounded-lg">
            <button
              @click="handleViewModeChange('grid')"
              :class="
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              "
              class="px-3 py-2 text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="handleViewModeChange('list')"
              :class="
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              "
              class="px-3 py-2 text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid/List -->
    <div v-if="paginatedContent.length > 0">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="content in paginatedContent"
          :key="content.id"
          @click="handleViewDetails(content)"
          class="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span :class="getFormatColor(content.outputFormat)" class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="getFormatIcon(content.outputFormat) === 'FileText'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path v-else-if="getFormatIcon(content.outputFormat) === 'HelpCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="getFormatIcon(content.outputFormat) === 'Cards'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {{ content.outputFormat }}
              </span>
              <div class="flex items-center gap-1">
                <button
                  @click.stop="handleDownload(content)"
                  class="text-slate-400 hover:text-slate-600 transition-colors"
                  title="Download"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button
                  @click.stop="handleDelete(content)"
                  class="text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{{ extractTopicTitle(content) }}</h3>
            <p class="text-sm text-slate-600 mb-4 line-clamp-3">{{ generateContentPreview(content) }}</p>

            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>{{ new Date(content.createdAt).toLocaleDateString() }}</span>
              <div class="flex items-center gap-1 text-blue-600">
                <span class="text-sm font-medium">Click to view</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="content in paginatedContent"
                :key="content.id"
                @click="handleViewDetails(content)"
                class="hover:bg-slate-50 cursor-pointer"
              >
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-slate-900">{{ extractTopicTitle(content) }}</div>
                    <div class="text-sm text-slate-500 line-clamp-2">{{ generateContentPreview(content) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getFormatColor(content.outputFormat)" class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="getFormatIcon(content.outputFormat) === 'FileText'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      <path v-else-if="getFormatIcon(content.outputFormat) === 'HelpCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path v-else-if="getFormatIcon(content.outputFormat) === 'Cards'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ content.outputFormat }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ new Date(content.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click.stop="(e: Event) => handleViewDetails(content)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      v-if="content.outputFormat === 'quiz' || content.outputFormat === 'flashcard' || content.outputFormat === 'note'"
                      @click.stop="(e: Event) => handleInteractiveView(content)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                      title="Interactive view"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="handleDownload(content)"
                      class="text-slate-600 hover:text-slate-900 transition-colors"
                      title="Download"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button
                      @click.stop="(e: Event) => handleDelete(content)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="handlePageChange(page)"
              :class="
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 bg-white hover:bg-slate-50'
              "
              class="px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg transition-colors"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        <div class="text-sm text-slate-500">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredContent.length) }} of {{ filteredContent.length }} results
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg border border-slate-200 p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No saved content found</h3>
      <p class="text-slate-600 mb-6">Start generating content to see your saved items here.</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900">Confirm Deletion</h3>
        </div>

        <p class="text-slate-600 mb-6">
          Are you sure you want to delete "{{ contentToDelete?.title }}"? This action cannot be undone.
        </p>

        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Content Detail Modal -->
    <div v-if="showDetailModal && selectedContent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div class="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">{{ extractTopicTitle(selectedContent) }}</h3>
              <p class="text-sm text-slate-500">
                {{ currentViewMode === 'detail' ? 'Content Details' : 'Interactive View' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- View Mode Toggle -->
            <div v-if="selectedContent.outputFormat === 'quiz' || selectedContent.outputFormat === 'flashcard' || selectedContent.outputFormat === 'note'" class="flex items-center gap-2">
              <button
                @click="currentViewMode = 'detail'"
                :class="currentViewMode === 'detail' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'"
                class="px-3 py-1 text-sm rounded-lg transition-colors"
              >
                Details
              </button>
              <button
                @click="currentViewMode = 'interactive'"
                :class="currentViewMode === 'interactive' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700'"
                class="px-3 py-1 text-sm rounded-lg transition-colors"
              >
                Try me!
              </button>
            </div>
            <button
              @click="showDetailModal = false"
              class="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="overflow-y-auto max-h-[calc(95vh-140px)]">
          <!-- Detail View -->
          <div v-if="currentViewMode === 'detail'" class="p-6">
            <!-- Content Info -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div class="bg-slate-50 p-4 rounded-lg">
                <h4 class="font-medium text-slate-900 mb-2">Content Type</h4>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {{ selectedContent.outputFormat }}
                  </span>
                </div>
              </div>
              <div class="bg-slate-50 p-4 rounded-lg">
                <h4 class="font-medium text-slate-900 mb-2">Created</h4>
                <p class="text-sm text-slate-600">{{ new Date(selectedContent.createdAt).toLocaleDateString() }}</p>
              </div>
              <div class="bg-slate-50 p-4 rounded-lg">
                <h4 class="font-medium text-slate-900 mb-2">Last Updated</h4>
                <p class="text-sm text-slate-600">{{ new Date(selectedContent.updatedAt).toLocaleDateString() }}</p>
              </div>
            </div>

            <!-- Content Body -->
            <div class="bg-slate-50 p-6 rounded-lg">
              <h4 class="font-medium text-slate-900 mb-4">Content Preview</h4>
              <div class="prose prose-slate max-w-none">
                <!-- Always try formatted preview first -->
                <div class="bg-white p-4 rounded-lg border">
                  <div v-html="renderContentPreview(selectedContent)"></div>
                </div>
              </div>

              <!-- Switch to Interactive View Button -->
              <div class="mt-4 pt-4 border-t border-slate-200">
                <button
                  @click="currentViewMode = 'interactive'"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  Try Interactive Mode
                </button>
              </div>
            </div>
          </div>

          <!-- Interactive View -->
          <div v-else-if="currentViewMode === 'interactive'" class="p-6">
            <!-- Back to Details Button -->
            <div class="mb-4">
              <button
                @click="currentViewMode = 'detail'"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Details
              </button>
            </div>

            <!-- Interactive Components -->
            <div v-if="isValidJSONContent(selectedContent)" class="min-h-[400px]">
              <InteractiveQuiz
                v-if="selectedContent.outputFormat === 'quiz'"
                :key="`quiz-${selectedContent.id}`"
                :content="selectedContent.content"
              />
              <InteractiveNote
                v-else-if="selectedContent.outputFormat === 'note'"
                :key="`note-${selectedContent.id}`"
                :content="selectedContent.content"
                :title="extractTopicTitle(selectedContent)"
              />
              <InteractiveFlashcard
                v-else-if="selectedContent.outputFormat === 'flashcard'"
                :key="`flashcard-${selectedContent.id}`"
                :content="selectedContent.content"
              />
              <!-- Summary Interactive View -->
              <div
                v-else-if="selectedContent.outputFormat === 'summary'"
                :key="`summary-${selectedContent.id}`"
                class="bg-white rounded-lg p-6"
              >
                <div v-html="renderContentPreview(selectedContent)"></div>
              </div>
              <div v-else class="text-center py-12">
                <p class="text-slate-500">Interactive mode not available for "{{ selectedContent.outputFormat }}" content type.</p>
              </div>
            </div>

            <!-- Fallback for invalid JSON -->
            <div v-else class="text-center py-12">
              <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-slate-900 mb-2">Interactive Mode Unavailable</h3>
              <p class="text-slate-500">This content cannot be displayed in interactive mode.</p>
              <p class="text-sm text-slate-400 mt-2">The content may not be in the proper JSON format.</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between p-6 border-t border-slate-200">
          <div class="text-sm text-slate-500">
            Content ID: {{ selectedContent.id }}
          </div>
          <div class="flex gap-3">
            <button
              @click="handleDownload(selectedContent)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button
              @click="showDetailModal = false"
              class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
