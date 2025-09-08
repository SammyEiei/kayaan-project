<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import { useAIContentStore } from '@/stores/aiContent'
import type { AIGeneratedContent } from '@/service/AIContentService'

interface Props {
  groupId: string
}

defineProps<Props>()
const router = useRouter()
const groupStore = useGroupStore()
const aiStore = useAIContentStore()

const emit = defineEmits<{
  close: []
  imported: []
}>()

const userAIContent = ref<AIGeneratedContent[]>([])
const selectedContent = ref<string[]>([])
const isImporting = ref(false)
const isLoading = ref(false)

// Mock AI content data
const mockAIContent = [
  {
    id: '1',
    type: 'summary',
    title: 'Introduction to Algorithms Summary',
    content: 'This is a comprehensive summary of the Introduction to Algorithms chapter...',
    createdAt: '2024-01-15T10:00:00Z',
    source: 'CS101 Course',
  },
  {
    id: '2',
    type: 'flashcards',
    title: 'Data Structures Flashcards',
    content: 'Flashcards covering key concepts in data structures...',
    createdAt: '2024-01-14T15:30:00Z',
    source: 'Data Structures Module',
  },
  {
    id: '3',
    type: 'quiz',
    title: 'Database Systems Quiz',
    content: 'Quiz questions covering database fundamentals...',
    createdAt: '2024-01-13T09:15:00Z',
    source: 'Database Course',
  },
]

onMounted(async () => {
  isLoading.value = true
  try {
    // Load AI content from store
    await aiStore.loadSavedContent()
    userAIContent.value = aiStore.getSavedContent

    // If no content in store, use mock data for demo
    if (userAIContent.value.length === 0) {
      console.log('No AI content found, using mock data for demo')
      userAIContent.value = mockAIContent as unknown as AIGeneratedContent[]
    }
  } catch (error) {
    console.error('Failed to load AI content:', error)
    // Fallback to mock data
    userAIContent.value = mockAIContent as unknown as AIGeneratedContent[]
  } finally {
    isLoading.value = false
  }
})

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'summary':
    case 'note':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    case 'flashcards':
    case 'flashcard':
      return 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    case 'quiz':
      return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  }
}

const getContentTypeColor = (type: string) => {
  switch (type) {
    case 'summary':
    case 'note':
      return 'from-blue-500 to-indigo-600'
    case 'flashcards':
    case 'flashcard':
      return 'from-green-500 to-emerald-600'
    case 'quiz':
      return 'from-purple-500 to-pink-600'
    default:
      return 'from-yellow-400 to-orange-500'
  }
}

const getContentTypeLabel = (type: string) => {
  switch (type) {
    case 'summary':
    case 'note':
      return 'Note'
    case 'flashcards':
    case 'flashcard':
      return 'Flashcards'
    case 'quiz':
      return 'Quiz'
    default:
      return 'AI Content'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getContentTitle = (content: AIGeneratedContent) => {
  try {
    const parsedContent = JSON.parse(content.content)

    // Use topic as title if available
    if (parsedContent.topic) {
      return parsedContent.topic
    }

    // Fallback to original title
    return content.title
  } catch {
    // If parsing fails, return original title
    return content.title
  }
}

const getContentPreview = (content: AIGeneratedContent) => {
  try {
    const parsedContent = JSON.parse(content.content)

    // Create preview based on content type
    if (parsedContent.topic) {
      if (parsedContent.flashcards && Array.isArray(parsedContent.flashcards)) {
        return `Flashcard set with ${parsedContent.flashcards.length} cards covering ${parsedContent.topic}`
      } else if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
        return `Quiz with ${parsedContent.questions.length} questions covering ${parsedContent.topic}`
      } else if (parsedContent.content && Array.isArray(parsedContent.content)) {
        return `Study notes covering ${parsedContent.topic} with ${parsedContent.content.length} key points`
      } else {
        return `Content covering ${parsedContent.topic}`
      }
    }

    // Fallback to original content if no topic
    return content.content.substring(0, 100) + (content.content.length > 100 ? '...' : '')
  } catch {
    // If parsing fails, return truncated original content
    return content.content.substring(0, 100) + (content.content.length > 100 ? '...' : '')
  }
}

const toggleContentSelection = (contentId: string) => {
  const index = selectedContent.value.indexOf(contentId)
  if (index > -1) {
    selectedContent.value.splice(index, 1)
  } else {
    selectedContent.value.push(contentId)
  }
}

const selectAll = () => {
  selectedContent.value = userAIContent.value.map((content) => String(content.id))
}

const deselectAll = () => {
  selectedContent.value = []
}

const importSelectedContent = async () => {
  if (selectedContent.value.length === 0) return

  isImporting.value = true
  try {
    for (const contentId of selectedContent.value) {
      const content = userAIContent.value.find((c) => String(c.id) === contentId)
      if (content) {
        // Determine content type and prepare content data
        let contentType: 'flashcard' | 'quiz' | 'note' = 'note'
        let contentData = content.content

        // Try to parse content to determine type
        try {
          const parsedContent = JSON.parse(content.content)
          if (parsedContent.type) {
            switch (parsedContent.type.toLowerCase()) {
              case 'flashcard':
                contentType = 'flashcard'
                break
              case 'quiz':
                contentType = 'quiz'
                break
              case 'note':
                contentType = 'note'
                break
              default:
                contentType = 'note'
            }
          } else if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
            contentType = 'quiz'
          } else if (parsedContent.flashcards && Array.isArray(parsedContent.flashcards)) {
            contentType = 'flashcard'
          } else if (parsedContent.cards && Array.isArray(parsedContent.cards)) {
            contentType = 'flashcard'
          }
        } catch {
          // If parsing fails, create a basic content structure
          contentData = JSON.stringify({
            type: contentType,
            topic: content.title,
            content: [content.content]
          })
        }

        // Create better title and description
        let finalTitle = content.title
        let finalDescription = ''

        // Try to extract better description from parsed content
        try {
          const parsedContent = JSON.parse(content.content)
          if (parsedContent.topic) {
            finalTitle = parsedContent.topic
          }

          // Create description based on content type
          if (contentType === 'flashcard' && parsedContent.flashcards) {
            finalDescription = `Flashcard set with ${parsedContent.flashcards.length} cards covering ${parsedContent.topic || 'various topics'}`
          } else if (contentType === 'quiz' && parsedContent.questions) {
            finalDescription = `Quiz with ${parsedContent.questions.length} questions covering ${parsedContent.topic || 'various topics'}`
          } else if (contentType === 'note' && parsedContent.content) {
            const contentItems = Array.isArray(parsedContent.content) ? parsedContent.content : [parsedContent.content]
            finalDescription = `Study notes covering ${parsedContent.topic || 'various topics'} with ${contentItems.length} key points`
          } else {
            finalDescription = `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content covering ${parsedContent.topic || 'various topics'}`
          }
        } catch {
          // Fallback to original content if parsing fails
          finalDescription = content.content.substring(0, 150) + (content.content.length > 150 ? '...' : '')
        }

        // Use new shareInteractiveContent API
        await groupStore.shareInteractiveContent({
          contentId: `ai-${content.id}`, // AI content ID format
          title: finalTitle,
          description: finalDescription,
          tags: [content.outputFormat || contentType],
          contentType: contentType,
          contentData: contentData
        })
      }
    }

    selectedContent.value = []
    emit('imported')
  } catch (error) {
    console.error('Failed to import content:', error)
  } finally {
    isImporting.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const goToAIContent = () => {
  emit('close')
  router.push('/ai-content-generator?tab=saved')
}

const goToAIGeneration = () => {
  emit('close')
  router.push('/ai-content-generator?tab=chat')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Import AI Content</h3>
            <p class="text-sm text-gray-500">Select content from your AI-generated library</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="goToAIContent"
            class="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            View All Content
          </button>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Selection Controls -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700">Select content to import</h4>
            <p class="text-sm text-gray-500">
              {{ selectedContent.length }} of {{ userAIContent.length }} selected
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click="selectAll"
              class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              Select All
            </button>
            <button
              @click="deselectAll"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3">
            <div
              class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-gray-600 font-medium">Loading your AI content...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="userAIContent.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No AI content found</h3>
          <p class="text-gray-500 mb-4">
            Create some AI-generated content first to import it to your group
          </p>
          <div class="flex gap-3 justify-center">
            <button
              @click="goToAIContent"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Go to My Content
            </button>
            <button
              @click="goToAIGeneration"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create AI Content
            </button>
          </div>
        </div>

        <!-- Content List -->
        <div v-else class="space-y-3">
          <div
            v-for="content in userAIContent"
            :key="content.id"
            class="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer"
            :class="
              selectedContent.includes(String(content.id))
                ? 'bg-purple-50 border-purple-300'
                : 'hover:bg-gray-50'
            "
            @click="toggleContentSelection(String(content.id))"
          >
            <!-- Checkbox -->
            <div class="flex-shrink-0 mt-1">
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                :class="
                  selectedContent.includes(String(content.id))
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-300'
                "
              >
                <svg
                  v-if="selectedContent.includes(String(content.id))"
                  class="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Content Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  :class="`bg-gradient-to-r ${getContentTypeColor(content.outputFormat)}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="getContentTypeIcon(content.outputFormat)"
                    />
                  </svg>
                </div>
                <div>
                  <h5 class="font-medium text-gray-900">{{ getContentTitle(content) }}</h5>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {{ getContentTypeLabel(content.outputFormat) }}
                    </span>
                    <span>{{ formatDate(content.createdAt) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{{ getContentPreview(content) }}</p>
              <p class="text-xs text-gray-400 mt-1">Source: AI Generated</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="importSelectedContent"
          :disabled="selectedContent.length === 0 || isImporting"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg v-if="isImporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span v-else>Import {{ selectedContent.length }} Items</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
