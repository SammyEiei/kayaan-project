<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useUnifiedContentStore } from '@/stores/unifiedContent'
import type { UnifiedContentDTO } from '@/service/UnifiedContentService'

interface Props {
  groupId: string
  groupName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  shared: [content: any]
}>()

const groupStore = useGroupStore()
const unifiedContentStore = useUnifiedContentStore()

// State
const selectedContent = ref<UnifiedContentDTO | null>(null)
const customTitle = ref('')
const description = ref('')
const tags = ref<string[]>([])
const newTag = ref('')
const isLoading = ref(false)
const isSharing = ref(false)

// Computed
const availableContent = computed(() => {
  return unifiedContentStore.content || []
})

const canShare = computed(() => {
  return selectedContent.value && customTitle.value.trim() && !isSharing.value
})

const contentIcon = computed(() => {
  if (!selectedContent.value) return '📄'

  switch (selectedContent.value.contentType) {
    case 'quiz':
      return '❓'
    case 'flashcard':
      return '🃏'
    case 'note':
      return '📝'
    default:
      return '📄'
  }
})

const contentTypeLabel = computed(() => {
  if (!selectedContent.value) return ''

  switch (selectedContent.value.contentType) {
    case 'quiz':
      return 'Quiz'
    case 'flashcard':
      return 'Flashcard'
    case 'note':
      return 'Note'
    default:
      return 'Content'
  }
})

// Methods
const selectContent = (content: UnifiedContentDTO) => {
  selectedContent.value = content
  customTitle.value = content.title
  description.value = `Shared from my personal library`
  tags.value = [...content.tags]
}

const addTag = () => {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  tags.value = tags.value.filter(tag => tag !== tagToRemove)
}

const handleShare = async () => {
  if (!selectedContent.value || !canShare.value) return

  isSharing.value = true
  try {
    const payload = {
      contentId: selectedContent.value.id,
      title: customTitle.value.trim(),
      description: description.value.trim() || undefined,
      tags: tags.value
    }

    const sharedContent = await groupStore.shareStudyContent(payload)

    emit('shared', sharedContent)
    emit('close')
  } catch (error) {
    console.error('Failed to share content:', error)
  } finally {
    isSharing.value = false
  }
}

const handleClose = () => {
  emit('close')
}

onMounted(async () => {
  isLoading.value = true
  try {
    await unifiedContentStore.fetchContent()
  } catch (error) {
    console.error('Failed to fetch content:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-3 p-6 border-b border-gray-200">
        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">Share Study Content</h3>
          <p class="text-sm text-gray-600">Share your content to {{ groupName }}</p>
        </div>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- Content Selection -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">Select Content to Share</h4>

          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="availableContent.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No content available to share</p>
            <p class="text-sm">Create some study content first</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
            <div
              v-for="content in availableContent"
              :key="content.id"
              @click="selectContent(content)"
              class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="
                selectedContent?.id === content.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              "
            >
              <div class="flex items-center gap-3">
                <div class="text-2xl">{{ contentIcon }}</div>
                <div class="flex-1 min-w-0">
                  <h5 class="font-medium text-gray-900 truncate">{{ content.title }}</h5>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {{ contentTypeLabel }}
                    </span>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {{ content.source }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ new Date(content.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                  <div v-if="content.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="tag in content.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="content.tags.length > 3" class="text-xs text-gray-500">
                      +{{ content.tags.length - 3 }} more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sharing Details -->
        <div v-if="selectedContent" class="space-y-6">
          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-semibold text-gray-900 mb-4">Sharing Details</h4>

            <!-- Title -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                v-model="customTitle"
                type="text"
                placeholder="Enter title for shared content"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                v-model="description"
                rows="3"
                placeholder="Add a description for the shared content"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            <!-- Tags -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(tag)"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="Add a tag"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  @keyup.enter="addTag"
                />
                <button
                  @click="addTag"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          @click="handleClose"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleShare"
          :disabled="!canShare"
          class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg v-if="isSharing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isSharing ? 'Sharing...' : 'Share Content' }}
        </button>
      </div>
    </div>
  </div>
</template>
