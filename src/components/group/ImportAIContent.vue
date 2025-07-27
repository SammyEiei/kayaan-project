<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { UploadResourceRequest } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const emit = defineEmits<{
  close: []
  imported: []
}>()

const userAIContent = ref<any[]>([])
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
    // TODO: Replace with actual API call
    // const response = await aiContentService.getUserContent()
    // userAIContent.value = response.data

    // Mock data
    userAIContent.value = mockAIContent
  } catch (error) {
    console.error('Failed to load AI content:', error)
  } finally {
    isLoading.value = false
  }
})

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'summary':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    case 'flashcards':
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
      return 'from-blue-500 to-indigo-600'
    case 'flashcards':
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
      return 'Summary'
    case 'flashcards':
      return 'Flashcards'
    case 'quiz':
      return 'Quiz'
    default:
      return 'AI Content'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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
  selectedContent.value = userAIContent.value.map((content) => content.id)
}

const deselectAll = () => {
  selectedContent.value = []
}

const importSelectedContent = async () => {
  if (selectedContent.value.length === 0) return

  isImporting.value = true
  try {
    for (const contentId of selectedContent.value) {
      const content = userAIContent.value.find((c) => c.id === contentId)
      if (content) {
        const resourceData: UploadResourceRequest = {
          groupId: props.groupId,
          type: 'imported_content',
          title: content.title,
          contentText: content.content,
        }
        await groupStore.uploadResource(resourceData)
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
          <h3 class="text-lg font-bold text-gray-900">Import AI Content</h3>
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
          <p class="text-gray-500">
            Create some AI-generated content first to import it to your group
          </p>
        </div>

        <!-- Content List -->
        <div v-else class="space-y-3">
          <div
            v-for="content in userAIContent"
            :key="content.id"
            class="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer"
            :class="
              selectedContent.includes(content.id)
                ? 'bg-purple-50 border-purple-300'
                : 'hover:bg-gray-50'
            "
            @click="toggleContentSelection(content.id)"
          >
            <!-- Checkbox -->
            <div class="flex-shrink-0 mt-1">
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                :class="
                  selectedContent.includes(content.id)
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-300'
                "
              >
                <svg
                  v-if="selectedContent.includes(content.id)"
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
                  :class="`bg-gradient-to-r ${getContentTypeColor(content.type)}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="getContentTypeIcon(content.type)"
                    />
                  </svg>
                </div>
                <div>
                  <h5 class="font-medium text-gray-900">{{ content.title }}</h5>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {{ getContentTypeLabel(content.type) }}
                    </span>
                    <span>{{ formatDate(content.createdAt) }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{{ content.content }}</p>
              <p class="text-xs text-gray-400 mt-1">Source: {{ content.source }}</p>
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
