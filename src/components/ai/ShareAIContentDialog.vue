<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AIContent } from '@/service/AIContentService'

interface StudyGroup {
  id: string
  name: string
  description: string
  memberCount: number
  isMember: boolean
}

interface Props {
  content: AIContent
  studyGroups: StudyGroup[]
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'share', groupId: string, contentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedGroups = ref<string[]>([])
const searchQuery = ref('')
const selectedTab = ref<'groups' | 'link'>('groups')

const filteredGroups = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.studyGroups
  }

  const query = searchQuery.value.toLowerCase()
  return props.studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(query) || group.description.toLowerCase().includes(query),
  )
})

const shareLink = computed(() => {
  return `${window.location.origin}/ai-content/${props.content.id}`
})

const toggleGroupSelection = (groupId: string) => {
  const index = selectedGroups.value.indexOf(groupId)
  if (index > -1) {
    selectedGroups.value.splice(index, 1)
  } else {
    selectedGroups.value.push(groupId)
  }
}

const selectAllGroups = () => {
  selectedGroups.value = props.studyGroups
    .filter((group) => group.isMember)
    .map((group) => group.id)
}

const deselectAllGroups = () => {
  selectedGroups.value = []
}

const handleShare = () => {
  selectedGroups.value.forEach((groupId) => {
    emit('share', groupId, props.content.id)
  })
  emit('close')
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // TODO: Show success toast
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const closeDialog = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900">Share Content</h3>
            <p class="text-sm text-gray-500">{{ content.title }}</p>
          </div>
        </div>
        <button
          @click="closeDialog"
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
        <!-- Tabs -->
        <div class="flex border-b border-gray-200 mb-6">
          <button
            @click="selectedTab = 'groups'"
            class="flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="
              selectedTab === 'groups'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            Study Groups
          </button>
          <button
            @click="selectedTab = 'link'"
            class="flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="
              selectedTab === 'link'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            ลิงก์
          </button>
        </div>

        <!-- Groups Tab -->
        <div v-if="selectedTab === 'groups'" class="space-y-4">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search study groups..."
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

          <!-- Selection Controls -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm text-gray-500">
                {{ selectedGroups.length }} of
                {{ studyGroups.filter((g) => g.isMember).length }} groups selected
              </span>
            </div>
            <div class="flex gap-2">
              <button
                @click="selectAllGroups"
                class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                @click="deselectAllGroups"
                class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Groups List -->
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              @click="group.isMember && toggleGroupSelection(group.id)"
              class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors"
              :class="group.isMember ? 'hover:border-purple-300' : 'opacity-50 cursor-not-allowed'"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                  :class="
                    selectedGroups.includes(group.id)
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-gray-300'
                  "
                >
                  <svg
                    v-if="selectedGroups.includes(group.id)"
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
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
                <p class="text-sm text-gray-500">{{ group.description }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-400">{{ group.memberCount }} members</span>
                  <span v-if="!group.isMember" class="text-xs text-orange-600">Not a member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Link Tab -->
        <div v-if="selectedTab === 'link'" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
            <div class="flex gap-2">
              <input
                :value="shareLink"
                readonly
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
              />
              <button
                @click="copyToClipboard(shareLink)"
                class="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div
                class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-blue-900">Note</h4>
                <p class="text-xs text-blue-700 mt-1">
                  This link will allow users to view this content but not edit it
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200">
        <button
          @click="closeDialog"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          v-if="selectedTab === 'groups'"
          @click="handleShare"
          :disabled="selectedGroups.length === 0"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200"
        >
          Share to {{ selectedGroups.length }} Groups
        </button>
      </div>
    </div>
  </div>
</template>
