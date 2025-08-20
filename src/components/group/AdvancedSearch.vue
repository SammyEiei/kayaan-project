<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Advanced Search</h3>
      </div>

      <button
        @click="toggleAdvanced"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
      >
        <span>{{ showAdvanced ? 'Hide' : 'Show' }} Advanced</span>
        <svg
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': showAdvanced }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Basic Search -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search resources, notes, files..."
          class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <svg
          class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

    <!-- Advanced Filters -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showAdvanced" class="space-y-6 overflow-hidden">
        <!-- Resource Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Resource Type</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label
              v-for="type in resourceTypes"
              :key="type.value"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedTypes.includes(type.value) }"
            >
              <input
                type="checkbox"
                :value="type.value"
                v-model="selectedTypes"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="type.icon"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-700">{{ type.label }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              v-model="dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              v-model="dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Uploader Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Uploaded By</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="uploader in availableUploaders"
              :key="uploader"
              class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedUploaders.includes(uploader) }"
            >
              <input
                type="checkbox"
                :value="uploader"
                v-model="selectedUploaders"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">{{ uploader }}</span>
            </label>
          </div>
        </div>

        <!-- Tags Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Tags</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="tag in availableTags"
              :key="tag"
              class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedTags.includes(tag) }"
            >
              <input
                type="checkbox"
                :value="tag"
                v-model="selectedTags"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">#{{ tag }}</span>
            </label>
          </div>
        </div>

        <!-- Sort Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label
              v-for="option in sortOptions"
              :key="option.value"
              class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': sortBy === option.value }"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="sortBy"
                name="sortBy"
                class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="option.icon"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-700">{{ option.label }}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-6 border-t border-gray-200">
      <div class="flex items-center gap-4">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Clear All
        </button>
        <span class="text-sm text-gray-500">
          {{ filteredCount }} results found
        </span>
      </div>

      <div class="flex gap-3">
        <button
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          @click="applyFilters"
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  resources: any[]
  onFiltersChange?: (filters: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  resources: () => [],
  onFiltersChange: undefined
})

// Search state
const searchQuery = ref('')
const showAdvanced = ref(false)

// Filter states
const selectedTypes = ref<string[]>([])
const dateFrom = ref('')
const dateTo = ref('')
const selectedUploaders = ref<string[]>([])
const selectedTags = ref<string[]>([])
const sortBy = ref('newest')

// Resource type options
const resourceTypes = [
  { value: 'note', label: 'Notes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { value: 'file', label: 'Files', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { value: 'link', label: 'Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { value: 'quiz', label: 'Quizzes', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'flashcard', label: 'Flashcards', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { value: 'imported_content', label: 'AI Content', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' }
]

// Sort options
const sortOptions = [
  { value: 'newest', label: 'Newest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'oldest', label: 'Oldest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'title', label: 'Title A-Z', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z' },
  { value: 'popular', label: 'Most Popular', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
]

// Computed properties
const availableUploaders = computed(() => {
  const uploaders = new Set(props.resources.map(r => r.uploaderName))
  return Array.from(uploaders).sort()
})

const availableTags = computed(() => {
  const tags = new Set()
  props.resources.forEach(resource => {
    if (resource.tags) {
      resource.tags.forEach((tag: string) => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const filteredCount = computed(() => {
  return props.resources.length
})

// Methods
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTypes.value = []
  dateFrom.value = ''
  dateTo.value = ''
  selectedUploaders.value = []
  selectedTags.value = []
  sortBy.value = 'newest'
}

const resetFilters = () => {
  clearFilters()
  applyFilters()
}

const applyFilters = () => {
  const filters = {
    searchQuery: searchQuery.value,
    selectedTypes: selectedTypes.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    selectedUploaders: selectedUploaders.value,
    selectedTags: selectedTags.value,
    sortBy: sortBy.value
  }

  if (props.onFiltersChange) {
    props.onFiltersChange(filters)
  }
}

// Watch for changes and apply filters
watch([searchQuery, selectedTypes, dateFrom, dateTo, selectedUploaders, selectedTags, sortBy], () => {
  applyFilters()
}, { deep: true })
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
