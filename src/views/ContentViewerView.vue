<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import InteractiveQuiz from '@/components/InteractiveQuiz.vue'
import InteractiveFlashcard from '@/components/InteractiveFlashcard.vue'
import InteractiveNote from '@/components/InteractiveNote.vue'

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
    console.log('🔍 Found contentData.contentType:', contentTypeFromData)

    // Use contentType if it's a valid interactive content type
    if (['flashcard', 'quiz', 'note'].includes(contentTypeFromData)) {
      detectedType = contentTypeFromData
      console.log('🔍 Using contentData.contentType:', detectedType)
    } else {
      console.log('🔍 Invalid contentType, will detect from content structure')
    }
  }

  // If not found, try to detect from content structure
  if (!detectedType) {
    // Check if content.content is a stringified JSON
    if (typeof content.content === 'string') {
      console.log('🔍 Attempting to parse content string...')

      // Try to detect type from string content first (before parsing)
      const contentString = content.content.toLowerCase()
      if (contentString.includes('"flashcards"') || contentString.includes('"cards"')) {
        detectedType = 'flashcard'
        console.log('🔍 Detected flashcard from string content')
      } else if (contentString.includes('"questions"')) {
        detectedType = 'quiz'
        console.log('🔍 Detected quiz from string content')
      } else if (contentString.includes('"type": "note"') || contentString.includes('"content":')) {
        detectedType = 'note'
        console.log('🔍 Detected note from string content')
      }

      // If we still don't have a type, try to parse the JSON
      if (!detectedType) {
        try {
          const parsedInnerContent = JSON.parse(content.content)
          console.log('🔍 Successfully parsed inner content:', parsedInnerContent)

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
          console.log('🔍 Content string preview:', content.content.substring(0, 200) + '...')
        }
      }
    }

    // Fallback to outer content structure
    if (!detectedType) {
      if (content.type && typeof content.type === 'string') {
        detectedType = content.type.toLowerCase()
        console.log('🔍 Using outer content.type:', detectedType)
      } else if (content.questions && Array.isArray(content.questions)) {
        detectedType = 'quiz'
        console.log('🔍 Detected quiz from outer structure')
      } else if (content.flashcards && Array.isArray(content.flashcards)) {
        detectedType = 'flashcard'
        console.log('🔍 Detected flashcard from outer structure')
      } else if (content.cards && Array.isArray(content.cards)) {
        detectedType = 'flashcard'
        console.log('🔍 Detected flashcard from outer cards')
      } else if (content.content && Array.isArray(content.content)) {
        detectedType = 'note'
        console.log('🔍 Detected note from outer structure')
      }
    }
  }

  // Final fallback based on title or other hints
  if (!detectedType) {
    const title = contentData.value?.title?.toLowerCase() || ''
    if (title.includes('flashcard') || title.includes('card')) {
      detectedType = 'flashcard'
      console.log('🔍 Detected flashcard from title')
    } else if (title.includes('quiz') || title.includes('question')) {
      detectedType = 'quiz'
      console.log('🔍 Detected quiz from title')
    } else if (title.includes('note')) {
      detectedType = 'note'
      console.log('🔍 Detected note from title')
    } else {
      detectedType = 'note' // Default fallback
      console.log('🔍 Using default fallback: note')
    }
  }

  console.log('🔍 ContentViewer - Final detected contentType:', detectedType)
  return detectedType
})
const contentTitle = computed(() => contentData.value?.title || 'Untitled Content')
const isSharedContent = computed(() => contentData.value?.source === 'shared')

// เพิ่ม computed properties สำหรับ interactive content detection
const isInteractiveContent = computed(() => {
  return contentData.value?.contentType && contentData.value?.contentData
})

// Methods
const loadContent = () => {
  try {
    const storedContent = localStorage.getItem('sharedContentToView')
    console.log('🔍 Loading content from localStorage:', storedContent)

    if (storedContent) {
      const parsedContent = JSON.parse(storedContent)
      contentData.value = parsedContent
      console.log('✅ Content loaded successfully:', contentData.value)

      // ตรวจสอบว่าเป็น interactive content หรือไม่
      if (parsedContent.contentType && parsedContent.contentData) {
        console.log('🔍 Interactive content detected:', {
          contentType: parsedContent.contentType,
          hasContentData: !!parsedContent.contentData
        })
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
  router.back()
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
    console.log('🔍 Processing string content...')

    // First, try to extract content manually (more reliable for malformed JSON)
    try {
      const manualExtract = extractContentManually(content.content)
      if (manualExtract) {
        console.log('🔧 Successfully extracted content manually:', manualExtract)
        console.log('🔧 Manual extract type:', manualExtract.type)
        console.log('🔧 Manual extract flashcards count:', manualExtract.flashcards?.length || 0)
        return JSON.stringify(manualExtract)
      } else {
        console.log('🔧 Manual extraction returned null/undefined')
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
          console.log('🔧 Attempting to parse truncated JSON:', jsonString.substring(0, 100) + '...')
        }
      }

      const parsedInnerContent = JSON.parse(jsonString)
      console.log('🔍 Successfully parsed inner content:', parsedInnerContent)
      return JSON.stringify(parsedInnerContent)
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed:', parseError)
      console.log('🔍 Raw content string preview:', content.content.substring(0, 200) + '...')

      // Create a fallback content based on detected type
      const detectedType = contentType.value || 'note'
      const fallbackContent = createFallbackContent(detectedType, content.content)
      console.log('🔧 Returning fallback content:', fallbackContent)
      return JSON.stringify(fallbackContent)
    }
  }

  // Otherwise return the outer content
  console.log('🔍 Returning outer content:', content)
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
        console.log('🔧 Fallback: Found question-answer pair in raw content')
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
          console.log('🔧 Fallback: Found question-answer pair in visible content')
          return {
            ...baseContent,
            flashcards: [{
              question: visibleQuestion[1].replace(/\\"/g, '"'),
              answer: visibleAnswer[1].replace(/\\"/g, '"')
            }]
          }
        } else {
          console.log('🔧 Fallback: No question-answer pairs found, using generic content')
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
    console.log('🔧 Attempting manual extraction from:', jsonString.substring(0, 100) + '...')

    // First, try to detect the type from the string
    let detectedType = null
    if (jsonString.includes('"flashcards"') || jsonString.includes('"cards"')) {
      detectedType = 'flashcard'
    } else if (jsonString.includes('"questions"')) {
      detectedType = 'quiz'
    } else if (jsonString.includes('"type": "note"')) {
      detectedType = 'note'
    }

    console.log('🔧 Detected type from string:', detectedType)

    // Try to extract flashcard data using regex
    if (detectedType === 'flashcard' || !detectedType) {
      const flashcardMatch = jsonString.match(/"flashcards":\s*\[(.*?)\]/s)
      if (flashcardMatch) {
        console.log('🔧 Found flashcard data, attempting to extract...')
        const flashcardContent = flashcardMatch[1]

        // Try to find individual flashcard objects with more flexible regex
        const cardMatches = flashcardContent.match(/\{[^}]*"question"[^}]*"answer"[^}]*\}/g)
        if (cardMatches && cardMatches.length > 0) {
          console.log(`🔧 Found ${cardMatches.length} flashcard(s)`)
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
          console.log('🔧 No complete card objects found, trying to extract individual pairs...')
          const questionMatches = flashcardContent.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/g)
          const answerMatches = flashcardContent.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)

          if (questionMatches && answerMatches && questionMatches.length === answerMatches.length) {
            console.log(`🔧 Found ${questionMatches.length} question-answer pairs`)
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
        console.log('🔧 Found quiz data, attempting to extract...')
        return {
          type: 'quiz',
          topic: 'Extracted Content',
          questions: [{ question: 'Question extracted', options: ['Option 1', 'Option 2'], answer: 0 }]
        }
      }
    }

    // Try to extract any content that looks like it has question/answer pairs (fallback for flashcard)
    if (detectedType === 'flashcard' || !detectedType) {
      console.log('🔧 Trying to extract question-answer pairs from entire string...')

      // First try the original method
      const questionAnswerPairs = jsonString.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"[^}]*"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)
      if (questionAnswerPairs && questionAnswerPairs.length > 0) {
        console.log(`🔧 Found ${questionAnswerPairs.length} question-answer pair(s)`)
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
      console.log('🔧 Trying separate question/answer extraction...')
      const allQuestions = jsonString.match(/"question":\s*"([^"]*(?:\\.[^"]*)*)"/g)
      const allAnswers = jsonString.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/g)

      if (allQuestions && allAnswers && allQuestions.length > 0 && allAnswers.length > 0) {
        console.log(`🔧 Found ${allQuestions.length} questions and ${allAnswers.length} answers`)
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
          console.log(`🔧 Successfully extracted ${flashcards.length} flashcards`)
          return {
            type: 'flashcard',
            topic: 'Extracted Content',
            flashcards: flashcards
          }
        }
      }
    }

    console.log('🔧 No extractable content found')
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

// Error handling for content processing (currently unused to prevent infinite loops)
// const handleContentError = (err: unknown) => {
//   console.error('Content processing error:', err)
//   // Show user-friendly error message
//   error.value = 'Unable to display content. Please try again.'
// }

// Loading state for content processing
const isProcessingContent = ref(false)

onMounted(() => {
  loadContent()
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
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Share
            </button>
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
          <!-- Debug Info -->
          <!-- <div class="p-4 bg-gray-50 border-b text-xs text-gray-600">
            <strong>Debug Info:</strong> Content Type: "{{ contentType }}" | Content Keys: {{ Object.keys(contentData.content || {}).join(', ') }} | Processing: {{ isProcessingContent ? 'Yes' : 'No' }}<br>
            <strong>Content Preview:</strong> {{ typeof contentData.content?.content === 'string' ? contentData.content.content.substring(0, 100) + '...' : 'Not a string' }}<br>
            <strong>Component to Render:</strong> {{ contentType?.toLowerCase() === 'quiz' ? 'InteractiveQuiz' : contentType?.toLowerCase() === 'flashcard' ? 'InteractiveFlashcard' : contentType?.toLowerCase() === 'note' ? 'InteractiveNote' : 'Fallback' }}<br>
            <strong>Is Interactive Content:</strong> {{ isInteractiveContent ? 'Yes' : 'No' }}
          </div> -->

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

          <!-- Debug: Show processed content for flashcard -->
          <!-- <div v-if="contentType?.toLowerCase() === 'flashcard'" class="p-4 bg-yellow-50 border-t text-xs">
            <strong>Flashcard Content Debug:</strong><br>
            <pre>{{ getProcessedContent() }}</pre>
          </div> -->

          <!-- Note Content -->
          <InteractiveNote
            v-else-if="contentType?.toLowerCase() === 'note'"
            :content="getProcessedContent()"
            :title="contentData.title"
          />

          <!-- Fallback for unknown content types -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Unsupported Content Type</h3>
            <p class="text-gray-600">Content type "{{ contentType }}" is not yet supported for viewing.</p>
            <div class="mt-4 p-4 bg-gray-100 rounded-lg text-left">
              <p class="text-sm"><strong>Available content keys:</strong> {{ Object.keys(contentData.content || {}).join(', ') }}</p>
              <p class="text-sm"><strong>Content validation:</strong> {{ validateContent(contentData.content) ? 'Valid' : 'Invalid' }}</p>
              <p class="text-sm"><strong>Content structure:</strong></p>
              <pre class="text-xs mt-2 overflow-auto max-h-40">{{ JSON.stringify(contentData.content, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
