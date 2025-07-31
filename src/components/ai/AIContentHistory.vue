<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AIContent } from '@/service/AIContentService'

interface Props {
  contentHistory: AIContent[]
  onSelectContent?: (content: AIContent) => void
  onDeleteContent?: (contentId: string) => void
}

const props = defineProps<Props>()
const selectedFilter = ref<string>('all')
const searchQuery = ref('')

const filters = [
  { id: 'all', name: 'All', icon: '📋' },
  { id: 'summary', name: 'Summary', icon: '📝' },
  { id: 'quiz', name: 'Quiz', icon: '❓' },
  { id: 'flashcard', name: 'Flashcards', icon: '🃏' },
  { id: 'notes', name: 'Notes', icon: '📋' },
]

const filteredContent = computed(() => {
  let filtered = props.contentHistory

  // Filter by type
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter((content) => content.type === selectedFilter.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (content) =>
        content.title.toLowerCase().includes(query) ||
        content.content.toLowerCase().includes(query) ||
        content.sourcePrompt.toLowerCase().includes(query),
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

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

const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const handleSelectContent = (content: AIContent) => {
  if (props.onSelectContent) {
    props.onSelectContent(content)
  }
}

const handleDeleteContent = (contentId: string, event: Event) => {
  event.stopPropagation()
  if (props.onDeleteContent) {
    props.onDeleteContent(contentId)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">Content History</h2>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">{{ filteredContent.length }} items</span>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search content..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-2">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="selectedFilter = filter.id"
          class="px-3 py-2 text-sm border rounded-lg transition-colors flex items-center gap-2"
          :class="
            selectedFilter === filter.id
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-300 hover:border-purple-300'
          "
        >
          <span>{{ filter.icon }}</span>
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div v-if="filteredContent.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No content found</h3>
      <p class="text-gray-500">
        {{
          searchQuery || selectedFilter !== 'all'
            ? 'Try changing your search or filter'
            : 'Create new content to get started'
        }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="content in filteredContent"
        :key="content.id"
        @click="handleSelectContent(content)"
        class="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
              :class="`bg-gradient-to-r ${getContentTypeColor(content.type)}`"
            >
              {{ getContentTypeIcon(content.type) }}
            </div>
            <div>
              <h3 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                {{ content.title }}
              </h3>
              <p class="text-xs text-gray-500">{{ getContentTypeLabel(content.type) }}</p>
            </div>
          </div>
          <button
            @click="handleDeleteContent(content.id, $event)"
            class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <!-- Content Preview -->
        <div class="mb-3">
          <p class="text-sm text-gray-600 line-clamp-3">
            {{ truncateText(content.content, 120) }}
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>{{ formatDate(content.createdAt) }}</span>
          <div class="flex items-center gap-2">
            <span
              v-if="content.isShared"
              class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
            >
              Shared
            </span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
