<template>
  <div class="space-y-8 p-6">
    <!-- Welcome Section -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="flex justify-center mb-4">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Welcome to Your Learning Hub</h2>
      <p class="text-gray-600 text-lg">
        Create and manage your learning content. Build quizzes, flashcards, and notes to enhance your study experience.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Quick Create</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          @click="() => navigateToCreate('quiz')"
          class="group p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors duration-200">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span class="font-medium text-gray-900">Create Quiz</span>
          <span class="text-xs text-gray-600 mt-1">Interactive questions</span>
        </button>

        <button
          @click="() => navigateToCreate('flashcard')"
          class="group p-6 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div class="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors duration-200">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="font-medium text-gray-900">Create Flashcards</span>
          <span class="text-xs text-gray-600 mt-1">Study deck builder</span>
        </button>

        <button
          @click="() => navigateToCreate('note')"
          class="group p-6 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors duration-200">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="font-medium text-gray-900">Create Notes</span>
          <span class="text-xs text-gray-600 mt-1">Rich text editor</span>
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Find Your Content</h3>
      </div>

      <div class="space-y-4">
        <!-- Search Bar -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search your content..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          />
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              v-model="selectedSubject"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
            >
              <option v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject === 'all' ? 'All Subjects' : subject }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in allTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150"
                :class="selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Your Content</h3>
          <span class="bg-gray-100 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {{ filteredContent.length }} items
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in filteredContent"
          :key="item.id"
          class="group border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
        >
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div :class="getTypeColor(item.type)" class="w-8 h-8 rounded-lg flex items-center justify-center">
                <component :is="getContentIcon(item.type)" class="w-4 h-4 text-white" />
              </div>
              <span class="capitalize text-sm font-medium text-gray-600">{{ item.type }}</span>
            </div>
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="getDifficultyColor(item.difficulty)">
              {{ item.difficulty }}
            </span>
          </div>

          <!-- Card Content -->
          <div class="space-y-2 mb-4">
            <h3 class="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
              </svg>
              {{ item.subject }}
            </p>
            <div class="flex flex-wrap gap-1">
              <span v-for="tag in item.tags" :key="tag" class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(item.createdAt) }}
            </span>
            <button
              @click="() => emitEdit(item, item.type)"
              class="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors duration-150"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredContent.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No content found</h3>
        <p class="text-gray-600 mb-4">Try adjusting your filters or create some new content to get started.</p>
        <button
          @click="() => navigateToCreate('quiz')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          Create Your First Content
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['edit-content'])
const router = useRouter()
const searchQuery = ref('')
const selectedSubject = ref('all')
const selectedTags = ref<string[]>([])

const subjects = ['all', 'Programming', 'Mathematics', 'Science', 'History']
const allTags = ['javascript', 'react', 'hooks', 'basics', 'web', 'best-practices']

const mockContent = [
  {
    id: 1,
    type: 'quiz',
    title: 'JavaScript Fundamentals',
    subject: 'Programming',
    tags: ['javascript', 'basics'],
    difficulty: 'easy',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    type: 'flashcard',
    title: 'React Hooks',
    subject: 'Programming',
    tags: ['react', 'hooks'],
    difficulty: 'medium',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    type: 'note',
    title: 'Web Development Best Practices',
    subject: 'Programming',
    tags: ['web', 'best-practices'],
    difficulty: 'hard',
    createdAt: '2024-01-13'
  }
]

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'easy': return 'bg-green-100 text-green-700 border border-green-200'
    case 'medium': return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    case 'hard': return 'bg-red-100 text-red-700 border border-red-200'
    default: return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'quiz': return 'bg-blue-500'
    case 'flashcard': return 'bg-indigo-500'
    case 'note': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

const getContentIcon = (type: string) => {
  const icons = {
    quiz: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
    ]),
    flashcard: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253' })
    ]),
    note: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
    ])
  }
  return icons[type as keyof typeof icons] || icons.note
}

const filteredContent = computed(() => {
  return mockContent.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSubject = selectedSubject.value === 'all' || item.subject === selectedSubject.value
    const matchTags = selectedTags.value.length === 0 || selectedTags.value.some(tag => item.tags.includes(tag))
    return matchSearch && matchSubject && matchTags
  })
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const navigateToCreate = (type: string) => {
  switch (type) {
    case 'quiz':
      router.push('/QuizView')
      break
    case 'flashcard':
      router.push('/FlashcardView')
      break
    case 'note':
      router.push('/NoteView')
      break
  }
}

const emitEdit = (content: any, type: string) => {
  emit('edit-content', content, type)
}
</script>