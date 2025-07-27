<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { UploadResourceRequest } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const emit = defineEmits<{
  close: []
  uploaded: []
}>()

const resourceType = ref<'note' | 'file' | 'link'>('note')
const title = ref('')
const contentText = ref('')
const contentUrl = ref('')
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)

const resourceTypeOptions = [
  {
    value: 'note',
    label: 'Note',
    icon: 'document-text',
    description: 'Share a text note or study material',
  },
  {
    value: 'file',
    label: 'File',
    icon: 'document',
    description: 'Upload a document, image, or other file',
  },
  {
    value: 'link',
    label: 'Link',
    icon: 'link',
    description: 'Share a useful website or resource link',
  },
]

const getResourceTypeIcon = (icon: string) => {
  const icons = {
    'document-text':
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    document:
      'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  }
  return icons[icon as keyof typeof icons] || icons['document-text']
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const validateForm = () => {
  if (!title.value.trim()) return false

  switch (resourceType.value) {
    case 'note':
      return contentText.value.trim().length > 0
    case 'file':
      return selectedFile.value !== null
    case 'link':
      return contentUrl.value.trim().length > 0
    default:
      return false
  }
}

const uploadResource = async () => {
  if (!validateForm()) return

  isUploading.value = true
  try {
    const resourceData: UploadResourceRequest = {
      groupId: props.groupId,
      type: resourceType.value,
      title: title.value.trim(),
      contentText: resourceType.value === 'note' ? contentText.value.trim() : undefined,
      contentUrl: resourceType.value === 'link' ? contentUrl.value.trim() : undefined,
      file: selectedFile.value || undefined,
    }

    await groupStore.uploadResource(resourceData)

    // Reset form
    title.value = ''
    contentText.value = ''
    contentUrl.value = ''
    selectedFile.value = null

    emit('uploaded')
  } catch (error) {
    console.error('Failed to upload resource:', error)
  } finally {
    isUploading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Share Resource</h3>
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
      <div class="p-6 space-y-6">
        <!-- Resource Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Resource Type</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              v-for="option in resourceTypeOptions"
              :key="option.value"
              @click="resourceType = option.value"
              class="p-4 border-2 rounded-xl text-left transition-all duration-200"
              :class="
                resourceType === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="
                    resourceType === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="getResourceTypeIcon(option.icon)"
                    />
                  </svg>
                </div>
                <span class="font-medium text-gray-900">{{ option.label }}</span>
              </div>
              <p class="text-sm text-gray-500">{{ option.description }}</p>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div>
          <label for="resourceTitle" class="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="resourceTitle"
            v-model="title"
            type="text"
            placeholder="Enter resource title..."
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <!-- Content based on type -->
        <div v-if="resourceType === 'note'">
          <label for="noteContent" class="block text-sm font-medium text-gray-700 mb-2">
            Note Content *
          </label>
          <textarea
            id="noteContent"
            v-model="contentText"
            rows="6"
            placeholder="Write your note content..."
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          ></textarea>
        </div>

        <div v-else-if="resourceType === 'file'">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Upload File * </label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors"
          >
            <input
              type="file"
              @change="handleFileSelect"
              class="hidden"
              id="fileInput"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <label for="fileInput" class="cursor-pointer">
              <svg
                class="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p class="text-gray-600 mb-2">
                <span class="font-medium">Click to upload</span> or drag and drop
              </p>
              <p class="text-sm text-gray-500">PDF, DOC, TXT, JPG, PNG up to 10MB</p>
            </label>
            <div
              v-if="selectedFile"
              class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p class="text-sm text-green-800">
                <svg
                  class="w-4 h-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ selectedFile.name }} selected
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="resourceType === 'link'">
          <label for="linkUrl" class="block text-sm font-medium text-gray-700 mb-2"> URL * </label>
          <input
            id="linkUrl"
            v-model="contentUrl"
            type="url"
            placeholder="https://example.com"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
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
          @click="uploadResource"
          :disabled="!validateForm() || isUploading"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg v-if="isUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
          <span v-else>Share Resource</span>
        </button>
      </div>
    </div>
  </div>
</template>
