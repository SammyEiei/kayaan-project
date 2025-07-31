<script setup lang="ts">
import { ref, watch } from 'vue'

interface AIContent {
  id: string
  type: 'summary' | 'quiz' | 'flashcard' | 'notes'
  title: string
  content: string
  sourcePrompt: string
  sourceFile?: File
  createdAt: Date
}

interface GenerationSettings {
  model: string
  temperature: number
  maxTokens: number
  language: string
}

interface Props {
  content: AIContent | null
  settings: GenerationSettings
}

interface Emits {
  (e: 'generate'): void
  (e: 'save'): void
  (e: 'prev'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editedContent = ref('')
const isEditing = ref(false)

// Initialize edited content when content changes
watch(
  () => props.content,
  (newContent) => {
    if (newContent) {
      editedContent.value = newContent.content
    }
  },
  { immediate: true },
)

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'summary':
      return '📝'
    case 'quiz':
      return '❓'
    case 'flashcard':
      return '🃏'
    case 'notes':
      return '📋'
    default:
      return '🤖'
  }
}

const getContentTypeColor = (type: string) => {
  switch (type) {
    case 'summary':
      return 'from-blue-500 to-indigo-600'
    case 'quiz':
      return 'from-purple-500 to-pink-600'
    case 'flashcard':
      return 'from-green-500 to-emerald-600'
    case 'notes':
      return 'from-yellow-500 to-orange-600'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

const getContentTypeLabel = (type: string) => {
  switch (type) {
    case 'summary':
      return 'Content Summary'
    case 'quiz':
      return 'Quiz'
    case 'flashcard':
      return 'Flashcards'
    case 'notes':
      return 'Notes'
    default:
      return 'AI Content'
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const startEditing = () => {
  isEditing.value = true
}

const saveEdit = () => {
  isEditing.value = false
  // TODO: Update content with edited version
}

const cancelEdit = () => {
  isEditing.value = false
  editedContent.value = props.content?.content || ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Content Header -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
            :class="`bg-gradient-to-r ${getContentTypeColor(content?.type || 'default')}`"
          >
            {{ getContentTypeIcon(content?.type || 'default') }}
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ content?.title || 'Generating content...' }}
            </h2>
            <p class="text-sm text-gray-500">
              {{ getContentTypeLabel(content?.type || 'default') }}
              <span v-if="content?.createdAt"> • Created {{ formatDate(content.createdAt) }} </span>
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            v-if="isEditing"
            @click="saveEdit"
            class="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save
          </button>
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Settings Info -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Model:</span>
            <span class="font-medium text-gray-900 ml-1">{{ settings.model }}</span>
          </div>
          <div>
            <span class="text-gray-500">Temperature:</span>
            <span class="font-medium text-gray-900 ml-1">{{ settings.temperature }}</span>
          </div>
          <div>
            <span class="text-gray-500">Max Tokens:</span>
            <span class="font-medium text-gray-900 ml-1">{{ settings.maxTokens }}</span>
          </div>
          <div>
            <span class="text-gray-500">Language:</span>
            <span class="font-medium text-gray-900 ml-1">{{
              settings.language === 'en' ? 'English' : settings.language
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Preview -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Content Preview</h3>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
          >
            Copy
          </button>
          <button
            class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      <!-- Content Display -->
      <div class="bg-gray-50 rounded-lg p-6 min-h-[300px]">
        <div v-if="!content" class="flex items-center justify-center h-64">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
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
            <h3 class="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p class="text-gray-500">Click "Generate Content" to get started</p>
          </div>
        </div>

        <div v-else>
          <div v-if="!isEditing" class="prose prose-gray max-w-none">
            <div class="whitespace-pre-wrap text-gray-800">{{ editedContent }}</div>
          </div>
          <textarea
            v-else
            v-model="editedContent"
            rows="12"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Generated content..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Source Information -->
    <div
      v-if="content?.sourcePrompt"
      class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Source Information</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm text-gray-600 mb-2">Prompt used:</p>
        <p class="text-gray-800 font-medium">{{ content.sourcePrompt }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between">
      <button
        @click="emit('prev')"
        class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <div class="flex gap-3">
        <button
          v-if="!content"
          @click="emit('generate')"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          Generate Content
        </button>
        <button
          v-if="content"
          @click="emit('save')"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Content
        </button>
        <button
          v-if="content"
          @click="emit('generate')"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Generate New
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1rem;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>
