<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { GroupResource } from '@/types/group'

interface Props {
  resource: GroupResource
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const showComments = ref(false)
const showActions = ref(false)

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'note':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    case 'file':
      return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    case 'link':
      return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    case 'imported_content':
      return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    default:
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  }
}

const getResourceColor = (type: string) => {
  switch (type) {
    case 'note':
      return 'from-blue-500 to-indigo-600'
    case 'file':
      return 'from-green-500 to-emerald-600'
    case 'link':
      return 'from-purple-500 to-pink-600'
    case 'imported_content':
      return 'from-yellow-400 to-orange-500'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

const getResourceTypeLabel = (type: string) => {
  switch (type) {
    case 'note':
      return 'Note'
    case 'file':
      return 'File'
    case 'link':
      return 'Link'
    case 'imported_content':
      return 'AI Content'
    default:
      return 'Resource'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const downloadResource = () => {
  if (props.resource.contentUrl) {
    window.open(props.resource.contentUrl, '_blank')
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.resource.contentUrl || '')
    // TODO: Show success toast
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const toggleComments = () => {
  showComments.value = !showComments.value
}
</script>

<template>
  <div
    class="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
          :class="`bg-gradient-to-r ${getResourceColor(resource.type)}`"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="getResourceIcon(resource.type)"
            />
          </svg>
        </div>
        <div>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full text-white"
            :class="`bg-gradient-to-r ${getResourceColor(resource.type)}`"
          >
            {{ getResourceTypeLabel(resource.type) }}
          </span>
        </div>
      </div>

      <!-- Actions Menu -->
      <div class="relative">
        <button
          @click="showActions = !showActions"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        <div
          v-if="showActions"
          class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
        >
          <div class="py-2">
            <button
              @click="downloadResource"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download
            </button>
            <button
              @click="copyLink"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Link
            </button>
            <hr class="my-1" />
            <button
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-4">
      <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ resource.title }}</h4>
      <p v-if="resource.contentText" class="text-sm text-gray-600 line-clamp-3 mb-3">
        {{ resource.contentText }}
      </p>
    </div>

    <!-- Meta Info -->
    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
      <div class="flex items-center gap-4">
        <span>by {{ resource.uploaderName }}</span>
        <span>{{ formatDate(resource.createdAt) }}</span>
      </div>
    </div>

    <!-- Stats & Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4">
        <button
          @click="toggleComments"
          class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {{ resource.commentCount }}
        </button>
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {{ resource.reactionCount }}
        </div>
      </div>

      <button
        @click="downloadResource"
        class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
      >
        View
      </button>
    </div>

    <!-- Comments Section (Collapsible) -->
    <div v-if="showComments" class="mt-4 pt-4 border-t border-gray-100">
      <div class="bg-gray-50 rounded-lg p-3">
        <p class="text-sm text-gray-500">Comments feature coming soon...</p>
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
