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
} | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Computed
const contentType = computed(() => contentData.value?.contentType || 'note')
const contentTitle = computed(() => contentData.value?.title || 'Untitled Content')
const isSharedContent = computed(() => contentData.value?.source === 'shared')

// Methods
const loadContent = () => {
  try {
    const storedContent = localStorage.getItem('sharedContentToView')
    if (storedContent) {
      contentData.value = JSON.parse(storedContent)
      // Clear the stored content after loading
      localStorage.removeItem('sharedContentToView')
    } else {
      error.value = 'No content found to display'
    }
  } catch (err) {
    error.value = 'Failed to load content'
    console.error('Error loading content:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const getContentIcon = () => {
  const type = contentType.value.toLowerCase()
  switch (type) {
    case 'quiz':
      return '❓'
    case 'flashcard':
      return '🃏'
    case 'note':
      return '📝'
    default:
      return '📄'
  }
}

const getContentTypeLabel = () => {
  const type = contentType.value.toLowerCase()
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
              <div class="text-2xl">{{ getContentIcon() }}</div>
              <div>
                <h1 class="text-lg font-semibold text-gray-900">{{ contentTitle }}</h1>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
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
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
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
            v-if="contentType.toLowerCase() === 'quiz'"
            :content="JSON.stringify(contentData.content)"
            :title="contentData.title"
          />

          <!-- Flashcard Content -->
          <InteractiveFlashcard
            v-else-if="contentType.toLowerCase() === 'flashcard'"
            :content="JSON.stringify(contentData.content)"
            :title="contentData.title"
          />

          <!-- Note Content -->
          <InteractiveNote
            v-else-if="contentType.toLowerCase() === 'note'"
            :content="JSON.stringify(contentData.content)"
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
            <p class="text-gray-600">This content type is not yet supported for viewing.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
