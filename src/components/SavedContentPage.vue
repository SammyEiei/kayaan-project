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
  let filtered = aiStore.savedContent

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

// Load data on mount
onMounted(async () => {
  try {
    await aiStore.loadSavedContent()
  } catch (error) {
    console.error('Failed to load saved content:', error)
  }
})
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
            <p class="text-lg font-semibold text-slate-900">{{ aiStore.savedContent.length }}</p>
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
              {{ aiStore.savedContent.filter(c => c.outputFormat === 'quiz').length }}
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
              {{ aiStore.savedContent.filter(c => c.outputFormat === 'flashcard').length }}
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
              {{ aiStore.savedContent.filter(c => c.outputFormat === 'note').length }}
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

            <h3 class="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{{ content.title }}</h3>
            <p class="text-sm text-slate-600 mb-4 line-clamp-3">{{ truncateText(content.content) }}</p>

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
                    <div class="text-sm font-medium text-slate-900">{{ content.title }}</div>
                    <div class="text-sm text-slate-500 line-clamp-2">{{ truncateText(content.content, 80) }}</div>
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
                      @click.stop="handleViewDetails(content)"
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
                      @click.stop="handleInteractiveView(content)"
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
                      @click.stop="handleDelete(content)"
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
              <h3 class="text-lg font-semibold text-slate-900">{{ selectedContent.title }}</h3>
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
                Interactive
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
              <h4 class="font-medium text-slate-900 mb-4">Content</h4>
              <div class="prose prose-slate max-w-none">
                <div class="whitespace-pre-wrap text-slate-700">{{ selectedContent.content }}</div>
              </div>
            </div>
          </div>

          <!-- Interactive View -->
          <div v-else-if="currentViewMode === 'interactive'" class="p-6">
            <InteractiveQuiz
              v-if="selectedContent.outputFormat === 'quiz'"
              :key="selectedContent.id"
              :content="selectedContent.content"
            />
            <InteractiveNote
              v-else-if="selectedContent.outputFormat === 'note'"
              :content="selectedContent.content"
              :title="selectedContent.title"
            />
            <InteractiveFlashcard
              v-else-if="selectedContent.outputFormat === 'flashcard'"
              :content="selectedContent.content"
            />
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
