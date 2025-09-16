<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import InteractiveQuiz from '@/components/InteractiveQuiz.vue'
import InteractiveFlashcard from '@/components/InteractiveFlashcard.vue'
import InteractiveNote from '@/components/InteractiveNote.vue'
import { markdownToHtml } from '@/utils/markdownConverter'

const router = useRouter()

// State
const contentData = ref<{
  id: string
  title: string
  content: Record<string, unknown>
  contentType: string
  source: string
  description?: string
  contentData?: string  // JSON string ของ interactive content
} | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Computed
const contentType = computed(() => {
  if (!contentData.value?.content) return null

  const content = contentData.value.content
  let detectedType = null

  // First, try to get type from contentData.contentType
  if (contentData.value.contentType && typeof contentData.value.contentType === 'string') {
    const contentTypeFromData = contentData.value.contentType.toLowerCase()

    // Use contentType if it's a valid interactive content type
    if (['flashcard', 'quiz', 'note'].includes(contentTypeFromData)) {
      detectedType = contentTypeFromData
    } else {
    }
  }

  // If not found, try to detect from content structure
  if (!detectedType) {
    // Check if content.content is a stringified JSON
    if (typeof content.content === 'string') {

      // Try to detect type from string content first (before parsing)
      const contentString = content.content.toLowerCase()
      if (contentString.includes('"flashcards"') || contentString.includes('"cards"')) {
        detectedType = 'flashcard'
      } else if (contentString.includes('"questions"')) {
        detectedType = 'quiz'
      } else if (contentString.includes('"type": "note"') || contentString.includes('"content":')) {
        detectedType = 'note'
      }

      // If we still don't have a type, try to parse the JSON
      if (!detectedType) {
        try {
          const parsedInnerContent = JSON.parse(content.content)

          // Check inner content type
          if (parsedInnerContent.type) {
            detectedType = parsedInnerContent.type.toLowerCase()
          } else if (parsedInnerContent.questions && Array.isArray(parsedInnerContent.questions)) {
            detectedType = 'quiz'
          } else if (parsedInnerContent.flashcards && Array.isArray(parsedInnerContent.flashcards)) {
            detectedType = 'flashcard'
          } else if (parsedInnerContent.cards && Array.isArray(parsedInnerContent.cards)) {
            detectedType = 'flashcard'
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse inner content:', parseError)
        }
      }
    }

    // Fallback to outer content structure
    if (!detectedType) {
      if (content.type && typeof content.type === 'string') {
        detectedType = content.type.toLowerCase()
      } else if (content.questions && Array.isArray(content.questions)) {
        detectedType = 'quiz'
      } else if (content.flashcards && Array.isArray(content.flashcards)) {
        detectedType = 'flashcard'
      } else if (content.cards && Array.isArray(content.cards)) {
        detectedType = 'flashcard'
      } else if (content.content && Array.isArray(content.content)) {
        detectedType = 'note'
      }
    }
  }

  // Final fallback based on title or other hints
  if (!detectedType) {
    const title = contentData.value?.title?.toLowerCase() || ''
    if (title.includes('flashcard') || title.includes('card')) {
      detectedType = 'flashcard'
    } else if (title.includes('quiz') || title.includes('question')) {
      detectedType = 'quiz'
    } else if (title.includes('note')) {
      detectedType = 'note'
    } else {
      detectedType = 'note' // Default fallback
    }
  }

  return detectedType
})
const contentTitle = computed(() => contentData.value?.title || 'Untitled Content')
const isSharedContent = computed(() => contentData.value?.source === 'shared')

// InteractiveNote-style UI state
const fontSize = ref(16)
const lineHeight = ref(1.6)
const theme = ref<'light' | 'dark' | 'sepia'>('light')
const showTableOfContents = ref(true)
const readingProgress = ref(0)
const activeSection = ref('')

// เพิ่ม computed properties สำหรับ interactive content detection
// const isInteractiveContent = computed(() => {
//   return contentData.value?.contentType && contentData.value?.contentData
// })

// Methods
const loadContent = () => {
  try {
    const storedContent = localStorage.getItem('sharedContentToView')

    if (storedContent) {
      const parsedContent = JSON.parse(storedContent)
      contentData.value = parsedContent

      // ตรวจสอบว่าเป็น interactive content หรือไม่
      if (parsedContent.contentType && parsedContent.contentData) {
        // Interactive content detected
      }

      // Clear the stored content after loading
      localStorage.removeItem('sharedContentToView')
    } else {
      error.value = 'No content found to display'
      console.warn('⚠️ No content found in localStorage')
    }
  } catch (err) {
    error.value = 'Failed to load content'
    console.error('❌ Error loading content:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  // ตรวจสอบว่ามี group ID ที่เก็บไว้ใน localStorage หรือไม่
  const storedGroupId = localStorage.getItem('contentViewerSourceGroupId')

  if (storedGroupId) {
    // ถ้ามี group ID ที่เก็บไว้ ให้กลับไปที่ group นั้นพร้อมเปิด library tab
    router.push({
      name: 'group-detail',
      params: { id: storedGroupId },
      query: { tab: 'library' }
    })
    // ลบ group ID ที่เก็บไว้หลังจากใช้แล้ว
    localStorage.removeItem('contentViewerSourceGroupId')
    return
  }

  // Fallback: ใช้ router.back() ปกติ
  router.back()
}

// InteractiveNote-style methods
const increaseFontSize = () => {
  if (fontSize.value < 24) fontSize.value += 2
}

const decreaseFontSize = () => {
  if (fontSize.value > 12) fontSize.value -= 2
}

const toggleTheme = () => {
  const themes: ('light' | 'dark' | 'sepia')[] = ['light', 'dark', 'sepia']
  const currentIndex = themes.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  theme.value = themes[nextIndex]
}

const scrollToSection = (title: string) => {
  const element = document.getElementById(`section-${title.replace(/\s+/g, '-').toLowerCase()}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = title
  }
}

// Update reading progress on scroll
const updateReadingProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  readingProgress.value = Math.round(progress)

  // Update active section
  const sectionElements = document.querySelectorAll('[id^="section-"]')
  let currentSection = ''

  sectionElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 100) {
      currentSection = element.id.replace('section-', '').replace(/-/g, ' ')
    }
  })

  if (currentSection) {
    activeSection.value = currentSection
  }
}

const getContentIcon = () => {
  const type = contentType.value?.toLowerCase()
  switch (type) {
    case 'quiz':
      return 'M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75M6.5 10h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3m-11 7h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3'
    case 'flashcard':
      return 'M2 16c0 2.21 0 3.316.702 4.054q.169.178.37.327C3.908 21 5.16 21 7.667 21h.666c2.506 0 3.759 0 4.595-.62q.201-.147.37-.326C14 19.316 14 18.211 14 16c0-2.21 0-3.316-.702-4.054a3 3 0 0 0-.37-.327C12.092 11 10.84 11 8.333 11h-.666c-2.506 0-3.759 0-4.595.62a3 3 0 0 0-.37.326C2 12.684 2 13.789 2 16m8-8c0-2.21 0-3.316.702-4.054q.168-.178.37-.327C11.908 3 13.16 3 15.667 3h.666c2.506 0 3.759 0 4.595.62q.201.148.37.326C22 4.684 22 5.789 22 8c0 2.21 0 3.316-.702 4.054a3 3 0 0 1-.37.327c-.758.562-1.86.614-3.928.618M2 15h12m-4-8h12M2 9c0-3.317 2.683-6 6-6l-.857 1.714M22 15c0 3.317-2.683 6-6 6l.857-1.714'
    case 'note':
      return 'M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5'
    default:
      return 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-2-6H6v-2h12v2zm-4 4H6v-2h8v2z'
  }
}

const getContentIconColor = () => {
  const type = contentType.value?.toLowerCase()
  switch (type) {
    case 'quiz':
      return 'text-orange-600'
    case 'flashcard':
      return 'text-purple-600'
    case 'note':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}

const getContentTypeLabel = () => {
  const type = contentType.value?.toLowerCase()
  switch (type) {
    case 'quiz':
      return 'Quiz'
    case 'flashcard':
      return 'Flashcard'
    case 'note':
      return 'Note'
    default:
      return 'Content'
  }
}

const getContentTypeBadgeColor = () => {
  const type = contentType.value?.toLowerCase()
  switch (type) {
    case 'quiz':
      return 'bg-orange-100 text-orange-800'
    case 'flashcard':
      return 'bg-purple-100 text-purple-800'
    case 'note':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getProcessedContent = () => {
  if (!contentData.value?.content) return '{}'

  const content = contentData.value.content

  // Validate content before processing
  if (!validateContent(content)) {
    console.warn('⚠️ Invalid content structure')
    return '{}'
  }

  // If content.content is a stringified JSON, parse it and return the inner content
  if (typeof content.content === 'string') {

    // First, try to extract content manually (more reliable for malformed JSON)
    try {
      const manualExtract = extractContentManually(content.content)
      if (manualExtract) {
        return JSON.stringify(manualExtract)
      } else {
      }
    } catch (manualError) {
      console.warn('⚠️ Manual extraction failed:', manualError)
    }

    // If manual extraction fails, try JSON parsing with repair
    try {
      // Try to fix common JSON issues before parsing
      let jsonString = content.content.trim()

      // Check if JSON string is properly terminated
      if (!jsonString.endsWith('}') && !jsonString.endsWith(']')) {
        console.warn('⚠️ JSON string appears to be truncated, attempting to fix...')

        // Try to find the last complete object/array
        const lastBrace = jsonString.lastIndexOf('}')
        const lastBracket = jsonString.lastIndexOf(']')
        const cutIndex = Math.max(lastBrace, lastBracket)

        if (cutIndex > 0) {
          jsonString = jsonString.substring(0, cutIndex + 1)
        }
      }

      const parsedInnerContent = JSON.parse(jsonString)
      return JSON.stringify(parsedInnerContent)
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed:', parseError)

      // Create a fallback content based on detected type
      const detectedType = contentType.value || 'note'
      const fallbackContent = createFallbackContent(detectedType, content.content)
      return JSON.stringify(fallbackContent)
    }
  }

  // Otherwise return the outer content
  return JSON.stringify(content)
}

// Create fallback content when all parsing methods fail
const createFallbackContent = (type: string, rawContent: string) => {
  const baseContent = {
    type: type,
    topic: 'Extracted Content',
    source: 'fallback'
  }

  switch (type) {
    case 'flashcard':
      // Try to extract at least one question-answer pair
      const questionMatch = rawContent.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
      const answerMatch = rawContent.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)

      if (questionMatch && answerMatch) {
        return {
          ...baseContent,
          flashcards: [{
            question: questionMatch[1].replace(/\\"/g, '"'),
            answer: answerMatch[1].replace(/\\"/g, '"')
          }]
        }
      } else {
        // Try to extract from the visible part of the content
        const visibleContent = rawContent.substring(0, 500) // First 500 characters
        const visibleQuestion = visibleContent.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
        const visibleAnswer = visibleContent.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)

        if (visibleQuestion && visibleAnswer) {
          return {
            ...baseContent,
            flashcards: [{
              question: visibleQuestion[1].replace(/\\"/g, '"'),
              answer: visibleAnswer[1].replace(/\\"/g, '"')
            }]
          }
        } else {
          return {
            ...baseContent,
            flashcards: [{
              question: 'Content could not be fully parsed',
              answer: 'Please check the original content'
            }]
          }
        }
      }

    case 'quiz':
      return {
        ...baseContent,
        questions: [{
          question: 'Content could not be fully parsed',
          options: ['Please check the original content', 'Content may be corrupted', 'Try refreshing'],
          answer: 0
        }]
      }

    case 'note':
    default:
      return {
        ...baseContent,
        content: 'Content could not be fully parsed. The original content may be corrupted or incomplete.'
      }
  }
}

// Manual content extraction for malformed JSON
const extractContentManually = (jsonString: string) => {
  try {

    // First, try to detect the type from the string
    let detectedType = null
    if (jsonString.includes('"flashcards"') || jsonString.includes('"cards"')) {
      detectedType = 'flashcard'
    } else if (jsonString.includes('"questions"')) {
      detectedType = 'quiz'
    } else if (jsonString.includes('"type": "note"')) {
      detectedType = 'note'
    }


    // Try to extract flashcard data using regex
    if (detectedType === 'flashcard' || !detectedType) {
      const flashcardMatch = jsonString.match(/"flashcards":\s*\[(.*?)\]/s)
      if (flashcardMatch) {
        const flashcardContent = flashcardMatch[1]

        // Try to find individual flashcard objects with more flexible regex
        const cardMatches = flashcardContent.match(/\{[^}]*"question"[^}]*"answer"[^}]*\}/g)
        if (cardMatches && cardMatches.length > 0) {
          const flashcards = cardMatches.map((card, index) => {
            try {
              return JSON.parse(card)
            } catch {
              // Extract question and answer manually using more flexible regex
              const questionMatch = card.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
              const answerMatch = card.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)
              return {
                question: questionMatch ? questionMatch[1].replace(/\\"/g, '"') : `Question ${index + 1}`,
                answer: answerMatch ? answerMatch[1].replace(/\\"/g, '"') : `Answer ${index + 1}`
              }
            }
          })

          return {
            type: 'flashcard',
            topic: 'Extracted Content',
            flashcards: flashcards
          }
        } else {
          // If no complete card objects found, try to extract individual question/answer pairs
          const questionMatches = flashcardContent.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/g)
          const answerMatches = flashcardContent.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)

          if (questionMatches && answerMatches && questionMatches.length === answerMatches.length) {
            const flashcards = questionMatches.map((q, index) => {
              const questionMatch = q.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
              const answerMatch = answerMatches[index]?.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)
              return {
                question: questionMatch ? questionMatch[1].replace(/\\"/g, '"') : `Question ${index + 1}`,
                answer: answerMatch ? answerMatch[1].replace(/\\"/g, '"') : `Answer ${index + 1}`
              }
            })

            return {
              type: 'flashcard',
              topic: 'Extracted Content',
              flashcards: flashcards
            }
          }
        }
      }
    }

    // Try to extract quiz data
    if (detectedType === 'quiz' || !detectedType) {
      const questionMatch = jsonString.match(/"questions":\s*\[(.*?)\]/s)
      if (questionMatch) {
        return {
          type: 'quiz',
          topic: 'Extracted Content',
          questions: [{ question: 'Question extracted', options: ['Option 1', 'Option 2'], answer: 0 }]
        }
      }
    }

    // Try to extract any content that looks like it has question/answer pairs (fallback for flashcard)
    if (detectedType === 'flashcard' || !detectedType) {

      // First try the original method
      const questionAnswerPairs = jsonString.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"[^}]*"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)
      if (questionAnswerPairs && questionAnswerPairs.length > 0) {
        const flashcards = questionAnswerPairs.map((pair, index) => {
          const questionMatch = pair.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
          const answerMatch = pair.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)
          return {
            question: questionMatch ? questionMatch[1].replace(/\\"/g, '"') : `Question ${index + 1}`,
            answer: answerMatch ? answerMatch[1].replace(/\\"/g, '"') : `Answer ${index + 1}`
          }
        })

        return {
          type: 'flashcard',
          topic: 'Extracted Content',
          flashcards: flashcards
        }
      }

      // If that fails, try a more aggressive approach - extract all questions and answers separately
      const allQuestions = jsonString.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/g)
      const allAnswers = jsonString.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)

      if (allQuestions && allAnswers && allQuestions.length > 0 && allAnswers.length > 0) {
        const minCount = Math.min(allQuestions.length, allAnswers.length)
        const flashcards = []

        for (let i = 0; i < minCount; i++) {
          const questionMatch = allQuestions[i].match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/)
          const answerMatch = allAnswers[i].match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/)

          if (questionMatch && answerMatch) {
            flashcards.push({
              question: questionMatch[1].replace(/\\"/g, '"'),
              answer: answerMatch[1].replace(/\\"/g, '"')
            })
          }
        }

        if (flashcards.length > 0) {
          return {
            type: 'flashcard',
            topic: 'Extracted Content',
            flashcards: flashcards
          }
        }
      }
    }

    return null
  } catch (error) {
    console.warn('⚠️ Manual extraction failed:', error)
    return null
  }
}

// Content validation
const validateContent = (content: unknown) => {
  if (!content) return false
  if (typeof content === 'object' && content !== null && Object.keys(content).length === 0) return false
  return true
}

// ✅ Check if content contains markdown patterns or is structured content
const isMarkdownContent = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false
  }

  try {
    // First check if it's JSON with structured content
    const jsonData = JSON.parse(content)
    if (jsonData.type === 'note' && jsonData.content && Array.isArray(jsonData.content)) {
      return true // Treat structured content as markdown-compatible
    }
  } catch {
    // Not JSON, continue with markdown pattern check
  }

  const markdownPatterns = [
    /^#{1,6}\s+/m,        // Headers
    /```[\s\S]*?```/,     // Code blocks
    /`[^`]+`/,            // Inline code
    /^\s*>\s+/m,          // Blockquotes
    /^\s*[-*+]\s+/m,      // Unordered lists
    /^\s*\d+\.\s+/m,      // Ordered lists
    /\*\*.*?\*\*/,        // Bold
    /\*.*?\*/,            // Italic
    /\[.*?\]\(.*?\)/,     // Links
    /!\[.*?\]\(.*?\)/     // Images
  ]

  return markdownPatterns.some(pattern => pattern.test(content))
}

// ✅ Extract markdown content from processed content
const extractMarkdownContent = (content: string): string => {
  if (!content || typeof content !== 'string') {
    return ''
  }

  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(content)

    // Check if it has a markdown field
    if (jsonData.markdown && typeof jsonData.markdown === 'string') {
      return jsonData.markdown
    }

    // Check if it has a content field that might be markdown
    if (jsonData.content && typeof jsonData.content === 'string') {
      return jsonData.content
    }

    // If it's a note object with structured content array
    if (jsonData.type === 'note' && jsonData.content && Array.isArray(jsonData.content)) {
      // Convert structured content to markdown format
      let markdownContent = `# ${jsonData.topic || 'Note'}\n\n`

      jsonData.content.forEach((item: any, index: number) => {
        if (item.feature && item.description) {
          markdownContent += `## ${item.feature}\n\n${item.description}\n\n`
        } else if (typeof item === 'string') {
          markdownContent += `${item}\n\n`
        } else if (item.title && item.content) {
          markdownContent += `## ${item.title}\n\n${item.content}\n\n`
        }
      })

      return markdownContent
    }

    // If it's a note object, try to extract content
    if (jsonData.type === 'note' && jsonData.content) {
      if (typeof jsonData.content === 'string') {
        return jsonData.content
      } else if (Array.isArray(jsonData.content)) {
        return jsonData.content.join('\n')
      }
    }

    // Return the original content if it looks like markdown
    if (isMarkdownContent(content)) {
      return content
    }

    // Fallback: return the content as-is
    return content
  } catch (error) {
    // If not JSON, return the content as-is if it looks like markdown
    if (isMarkdownContent(content)) {
      return content
    }

    return content
  }
}

// ✅ Enhanced Markdown content parsing (same as InteractiveNote)
const parseMarkdownContent = (markdown: string) => {
  const lines = markdown.split('\n')
  const sections: { level: number; title: string; content: string[] }[] = []
  let currentSection: { level: number; title: string; content: string[] } | null = null
  let currentContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Check for headers
    if (trimmedLine.startsWith('#')) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent
        sections.push(currentSection)
      }

      // Start new section
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const title = trimmedLine.replace(/^#+\s*/, '').trim()
      if (title) {
        currentSection = { level, title, content: [] }
        currentContent = []
      }
    } else {
      // Add content to current section
      if (trimmedLine) {
        currentContent.push(line) // Keep original line with indentation
      } else if (currentContent.length > 0) {
        // Add empty line only if we have content
        currentContent.push('')
      }
    }
  }

  // Add last section
  if (currentSection) {
    currentSection.content = currentContent
    if (currentContent.length > 0) {
      sections.push(currentSection)
    }
  }

  // If no sections found, create a default one with all content
  if (sections.length === 0) {
    const allContent = lines.filter(l => l.trim())
    if (allContent.length > 0) {
      sections.push({
        level: 1,
        title: 'Content',
        content: allContent
      })
    }
  }

  return sections
}

// ✅ Computed property for parsed markdown sections
const parsedMarkdownSections = computed(() => {
  const content = getProcessedContent()
  if (!isMarkdownContent(content)) {
    return []
  }

  const markdownContent = extractMarkdownContent(content)
  return parseMarkdownContent(markdownContent)
})

// InteractiveNote-style computed properties
const tableOfContents = computed(() =>
  parsedMarkdownSections.value.filter(section => section.level <= 3)
)

const contentStyle = computed(() => ({
  '--font-size': `${fontSize.value}px`,
  '--line-height': lineHeight.value,
  lineHeight: lineHeight.value,
}))

const themeClasses = computed(() => {
  switch (theme.value) {
    case 'dark':
      return 'bg-slate-800 text-slate-200'
    case 'sepia':
      return 'bg-amber-50 text-slate-800'
    default:
      return 'bg-white text-slate-900'
  }
})

// Error handling for content processing (currently unused to prevent infinite loops)
// const handleContentError = (err: unknown) => {
//   console.error('Content processing error:', err)
//   // Show user-friendly error message
//   error.value = 'Unable to display content. Please try again.'
// }

// Loading state for content processing
// const isProcessingContent = ref(false)

onMounted(() => {
  loadContent()
  // Add scroll listener for reading progress
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  // Remove scroll listener
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8" :class="getContentIconColor()">
                     <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getContentIcon()" />
                     </svg>
                   </div>
                   <div>
                <h1 class="text-lg font-semibold text-gray-900">{{ contentTitle }}</h1>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getContentTypeBadgeColor()">
                    {{ getContentTypeLabel() }}
                  </span>
                  <span
                    v-if="isSharedContent"
                    class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                  >
                    Shared Content
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Share
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading content...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="goBack"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>

      <!-- Content Display -->
      <div v-else-if="contentData" class="space-y-6">
        <!-- Content Info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">{{ contentData.title }}</h2>
            <div class="flex items-center gap-2">
                 <span class="px-3 py-1 text-sm rounded-full font-medium" :class="getContentTypeBadgeColor()">
                   {{ getContentTypeLabel() }}
                 </span>
              <span
                v-if="isSharedContent"
                class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
              >
                Shared
              </span>
            </div>
          </div>

          <div v-if="contentData.description" class="text-gray-600 mb-4">
            {{ contentData.description }}
          </div>
        </div>

        <!-- Interactive Content -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <!-- Quiz Content -->
          <InteractiveQuiz
            v-if="contentType?.toLowerCase() === 'quiz'"
            :content="getProcessedContent()"
            :title="contentData.title"
          />

          <!-- Flashcard Content -->
          <InteractiveFlashcard
            v-else-if="contentType?.toLowerCase() === 'flashcard'"
            :content="getProcessedContent()"
            :title="contentData.title"
          />


          <!-- Note Content with InteractiveNote-style UI -->
          <div v-else-if="contentType?.toLowerCase() === 'note'" class="note-content-container">
            <!-- InteractiveNote-style Layout -->
            <div class="min-h-screen" :class="themeClasses">
              <!-- Header with Controls -->
              <div class="border-b border-slate-200 sticky top-0 z-10" :class="theme === 'dark' ? 'bg-slate-700 border-slate-600' : theme === 'sepia' ? 'bg-amber-100 border-amber-200' : 'bg-white border-slate-200'">
                <div class="flex items-center justify-between px-6 py-4">
                  <div class="flex items-center gap-4">
                    <!-- Font Size Controls -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="decreaseFontSize"
                        class="p-2 transition-colors"
                        :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                        title="Decrease font size"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="text-sm font-medium" :class="theme === 'dark' ? 'text-slate-200' : theme === 'sepia' ? 'text-slate-700' : 'text-slate-700'">{{ fontSize }}px</span>
                      <button
                        @click="increaseFontSize"
                        class="p-2 transition-colors"
                        :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                        title="Increase font size"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
          </div>

                    <!-- Line Height Controls -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="lineHeight = Math.max(1.2, lineHeight - 0.1)"
                        class="p-2 transition-colors"
                        :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                        title="Decrease line height"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="text-sm font-medium" :class="theme === 'dark' ? 'text-slate-200' : theme === 'sepia' ? 'text-slate-700' : 'text-slate-700'">{{ lineHeight.toFixed(1) }}</span>
                      <button
                        @click="lineHeight = Math.min(2.0, lineHeight + 0.1)"
                        class="p-2 transition-colors"
                        :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                        title="Increase line height"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <!-- Theme Toggle -->
                    <button
                      @click="toggleTheme"
                      class="p-2 transition-colors"
                      :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                      :title="`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'sepia' : 'light'} theme`"
                    >
                      <svg v-if="theme === 'light'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <svg v-else-if="theme === 'dark'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </button>
                  </div>

                  <!-- Table of Contents Toggle -->
                  <button
                    @click="showTableOfContents = !showTableOfContents"
                    class="p-2 transition-colors"
                    :class="theme === 'dark' ? 'text-slate-300 hover:text-slate-100' : theme === 'sepia' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-600 hover:text-slate-900'"
                    title="Toggle table of contents"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex">
                <!-- Table of Contents -->
                <div
                  v-if="showTableOfContents"
                  class="w-64 p-6 border-r min-h-screen"
                  :class="theme === 'dark' ? 'border-slate-600 bg-slate-700' : theme === 'sepia' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'"
                >
                  <h3 class="font-semibold mb-4" :class="theme === 'dark' ? 'text-slate-100' : theme === 'sepia' ? 'text-slate-800' : 'text-slate-900'">Table of Contents</h3>
                  <nav class="space-y-1">
                    <button
                      v-for="section in tableOfContents"
                      :key="section.title"
                      @click="scrollToSection(section.title)"
                      class="block w-full text-left px-3 py-2 rounded-lg transition-all duration-200"
                      :class="[
                        activeSection === section.title
                          ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                          : theme === 'dark'
                            ? 'hover:bg-slate-700 text-slate-300 hover:text-slate-100'
                            : theme === 'sepia'
                              ? 'hover:bg-amber-100 text-slate-600 hover:text-slate-800'
                              : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900',
                        {
                          'pl-3': section.level === 1,
                          'pl-6': section.level === 2,
                          'pl-9': section.level === 3,
                        }
                      ]"
                    >
                      <span class="text-sm" :class="{ 'font-semibold': section.level === 1, 'font-medium': section.level === 2 }">
                        {{ section.title }}
                      </span>
                      <div v-if="section.content.length > 0" class="text-xs mt-1" :class="theme === 'dark' ? 'text-slate-400' : theme === 'sepia' ? 'text-slate-600' : 'text-slate-500'">
                        {{ section.content.length }} paragraphs
                      </div>
                    </button>
                  </nav>
                </div>

                <!-- Main Content -->
                <div class="flex-1 p-8 max-w-4xl mx-auto" :class="theme === 'dark' ? 'bg-slate-800' : theme === 'sepia' ? 'bg-amber-50' : 'bg-white'">
                  <!-- Title -->
                  <header class="mb-12 pb-6 border-b-2" :class="theme === 'dark' ? 'border-slate-600' : theme === 'sepia' ? 'border-amber-200' : 'border-slate-200'">
                    <h1 class="text-4xl font-bold mb-4" :class="theme === 'dark' ? 'text-slate-100' : theme === 'sepia' ? 'text-slate-800' : 'text-slate-900'">{{ contentData.title }}</h1>
                    <div class="flex items-center gap-4 text-sm" :class="theme === 'dark' ? 'text-slate-400' : theme === 'sepia' ? 'text-slate-600' : 'text-slate-600'">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {{ parsedMarkdownSections.length }} sections
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {{ getProcessedContent().split(' ').length }} words
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ Math.ceil(getProcessedContent().split(' ').length / 200) }} min
                      </span>
                    </div>
                  </header>

                  <!-- Content -->
                  <article class="prose prose-slate max-w-none" :style="contentStyle">
                    <!-- Check if content contains markdown -->
                    <div v-if="isMarkdownContent(getProcessedContent())">
                      <!-- Enhanced Markdown Content with InteractiveNote-style sections -->
                      <div
                        v-for="(section, sectionIndex) in parsedMarkdownSections"
                        :key="section.title"
                        :id="`section-${section.title.replace(/\s+/g, '-').toLowerCase()}`"
                        class="mb-12 scroll-mt-20"
                      >
                        <!-- Section Header with visual separator -->
                        <div class="relative mb-6">
                          <h1
                            v-if="section.level === 1"
                            class="font-bold text-3xl flex items-center gap-3"
                            :class="theme === 'dark' ? 'text-slate-100' : theme === 'sepia' ? 'text-slate-800' : 'text-slate-900'"
                          >
                            <span class="text-blue-500 font-normal">{{ String(sectionIndex + 1).padStart(2, '0') }}</span>
                            {{ section.title }}
                          </h1>
                          <h2
                            v-else-if="section.level === 2"
                            class="font-bold text-2xl flex items-center gap-3"
                            :class="theme === 'dark' ? 'text-slate-200' : theme === 'sepia' ? 'text-slate-700' : 'text-slate-800'"
                          >
                            <span class="w-8 h-1 bg-blue-500 rounded"></span>
                            {{ section.title }}
                          </h2>
                          <h3
                            v-else-if="section.level === 3"
                            class="font-semibold text-xl"
                            :class="theme === 'dark' ? 'text-slate-300' : theme === 'sepia' ? 'text-slate-700' : 'text-slate-700'"
                          >
                            {{ section.title }}
                          </h3>
                          <h4
                            v-else
                            class="font-medium text-lg"
                            :class="theme === 'dark' ? 'text-slate-400' : theme === 'sepia' ? 'text-slate-600' : 'text-slate-600'"
                          >
                            {{ section.title }}
                          </h4>
                        </div>

                        <!-- Section Content with Enhanced Markdown rendering -->
                        <div v-if="section.content.length > 0" class="markdown-section-content">
                          <!-- ✅ Render entire section content as Markdown -->
                          <div
                            class="markdown-content prose prose-slate max-w-none"
                            v-html="markdownToHtml(section.content.join('\n'))"
                          ></div>
                        </div>

                        <!-- Empty section indicator -->
                        <div v-else class="italic" :class="theme === 'dark' ? 'text-slate-500' : theme === 'sepia' ? 'text-slate-500' : 'text-slate-400'">
                          (No content in this section)
                        </div>

                        <!-- Section separator -->
                        <div v-if="sectionIndex < parsedMarkdownSections.length - 1" class="mt-8 border-b" :class="theme === 'dark' ? 'border-slate-600' : theme === 'sepia' ? 'border-amber-200' : 'border-slate-200'"></div>
                      </div>
                    </div>

                    <!-- Fallback to InteractiveNote for structured content -->
                    <div v-else>
          <InteractiveNote
            :content="getProcessedContent()"
            :title="contentData.title"
          />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <!-- Fallback for unknown content types -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Unsupported Content Type</h3>
            <p class="text-gray-600">Content type "{{ contentType }}" is not yet supported for viewing.</p>
            <button
              @click="goBack"
              class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ Enhanced Note Content Styling */
.note-content-container {
  @apply w-full;
}

.note-content-wrapper {
  @apply w-full;
}

.markdown-note-content {
  @apply bg-white;
}

.markdown-note-renderer {
  @apply w-full;
}

.structured-note-content {
  @apply w-full;
}

/* ✅ InteractiveNote-style sections */
.markdown-note-sections {
  @apply w-full;
}

.markdown-section-content {
  @apply w-full;
}

/* Enhanced markdown rendering styles - matching InteractiveNote */
.markdown-content {
  @apply text-slate-700 leading-relaxed;
}

/* Override prose styles for better Markdown rendering */
.markdown-content.prose {
  @apply max-w-none;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  @apply font-bold text-slate-900;
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-content h1 {
  @apply text-3xl mb-6 mt-10;
}
.markdown-content h2 {
  @apply text-2xl mb-4 mt-8;
}
.markdown-content h3 {
  @apply text-xl mb-3 mt-6;
}
.markdown-content h4 {
  @apply text-lg mb-2 mt-4;
}

.markdown-content p {
  @apply mb-4 text-slate-700 leading-relaxed;
  margin-top: 0;
}

.markdown-content ul,
.markdown-content ol {
  @apply mb-4;
  margin-top: 0;
}

.markdown-content li {
  @apply mb-2 text-slate-700;
}

.markdown-content blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic text-slate-600 my-4 bg-blue-50 py-2 rounded-r;
  margin-top: 0;
}

.markdown-content code {
  @apply bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono border;
}

.markdown-content pre {
  @apply bg-slate-100 text-slate-800 p-4 rounded-lg overflow-x-auto my-4 border border-slate-200;
  margin-top: 0;
}

.markdown-content pre code {
  @apply bg-transparent p-0 border-0;
}

.markdown-content strong {
  @apply font-semibold text-slate-900;
}

.markdown-content em {
  @apply italic text-slate-700;
}

.markdown-content a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content img {
  @apply max-w-full h-auto rounded-lg shadow-sm my-4;
}

.markdown-content hr {
  @apply my-8 border-slate-300;
}

/* List styling improvements */
.markdown-content ul {
  @apply list-disc list-inside space-y-1;
}

.markdown-content ol {
  @apply list-decimal list-inside space-y-1;
}

.markdown-content li {
  @apply ml-0;
}

/* Nested lists */
.markdown-content ul ul,
.markdown-content ol ol,
.markdown-content ul ol,
.markdown-content ol ul {
  @apply mt-2 ml-4;
}
</style>
