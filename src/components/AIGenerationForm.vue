<template>

  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-xl shadow-lg border border-gray-200">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">สร้างเนื้อหาด้วย AI</h2>
            <p class="text-gray-600 mt-1">สร้าง Quiz, Note, และ Flashcard จากข้อความหรือไฟล์</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-sm text-gray-500">Rate Limit</div>
              <div class="text-lg font-semibold text-blue-600">
                {{ rateLimitInfo.remaining }}/{{ rateLimitInfo.limit }}
              </div>
              <div class="text-xs text-gray-400">
                Reset: {{ rateLimitInfo.resetTimeFormatted }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Prompt Input -->
        <div>
          <label for="promptText" class="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบายเนื้อหา *
          </label>
          <textarea
            id="promptText"
            v-model="formData.request.promptText"
            rows="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="อธิบายเนื้อหาที่คุณต้องการสร้าง เช่น: สร้าง Quiz เกี่ยวกับประวัติศาสตร์ไทย, สร้าง Note เกี่ยวกับการเขียนโปรแกรม Python, สร้าง Flashcard เกี่ยวกับคำศัพท์ภาษาอังกฤษ"
            required
          ></textarea>
          <div class="mt-1 text-sm text-gray-500">
            {{ formData.request.promptText.length }}/1000 ตัวอักษร
          </div>
        </div>

        <!-- Output Format Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            รูปแบบเนื้อหา *
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="format in outputFormats"
              :key="format.value"
              @click="selectFormat(format.value)"
              class="relative cursor-pointer"
            >
              <input
                type="radio"
                :value="format.value"
                v-model="formData.request.outputFormat"
                class="sr-only"
                :id="format.value"
              />
              <label
                :for="format.value"
                class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                :class="{
                  'border-blue-500 bg-blue-50': formData.request.outputFormat === format.value
                }"
              >
                <div class="w-12 h-12 mb-3 flex items-center justify-center text-2xl">
                  {{ format.icon }}
                </div>
                <div class="text-center">
                  <div class="font-medium text-gray-900">{{ format.label }}</div>
                  <div class="text-sm text-gray-500">{{ format.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            อัปโหลดไฟล์ (ไม่บังคับ)
          </label>
          <div
            @click="triggerFileInput"
            @drop.prevent="handleFileDrop"
            @dragover.prevent
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
          >
            <div v-if="!selectedFile" class="space-y-2">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-gray-600">
                <span class="font-medium text-blue-600 hover:text-blue-500">คลิกเพื่ออัปโหลด</span>
                หรือลากไฟล์มาวาง
              </div>
              <div class="text-sm text-gray-500">
                รองรับไฟล์ TXT, PDF, DOC, DOCX ขนาดไม่เกิน 10MB
              </div>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-center">
                <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-sm text-gray-600">
                <div class="font-medium">{{ selectedFile.name }}</div>
                <div class="text-gray-500">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
              <button
                type="button"
                @click.stop="removeFile"
                class="text-sm text-red-600 hover:text-red-700"
              >
                ลบไฟล์
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            @change="handleFileSelect"
            class="hidden"
          />
        </div>

        <!-- Advanced Options -->
        <div class="border-t border-gray-200 pt-6">
          <button
            type="button"
            @click="showAdvancedOptions = !showAdvancedOptions"
            class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <svg
              class="w-4 h-4 mr-2 transition-transform"
              :class="{ 'rotate-90': showAdvancedOptions }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            ตัวเลือกขั้นสูง
          </button>

          <div v-if="showAdvancedOptions" class="mt-4 space-y-4">
            <div>
              <label for="maxRetries" class="block text-sm font-medium text-gray-700 mb-2">
                จำนวนครั้งในการลองใหม่
              </label>
              <select
                id="maxRetries"
                v-model="formData.request.maxRetries"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 ครั้ง</option>
                <option value="2">2 ครั้ง</option>
                <option value="3">3 ครั้ง</option>
                <option value="5">5 ครั้ง</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Preview Button -->
        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="generatePreview"
            :disabled="!canPreview || previewLoading"
            class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="previewLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังสร้าง Preview...
            </span>
            <span v-else>ดูตัวอย่าง</span>
          </button>

          <div class="text-sm text-gray-500">
            ใช้ {{ rateLimitInfo.previewRemaining }}/{{ rateLimitInfo.previewLimit }} previews
          </div>
        </div>

        <!-- Preview Content -->
        <div v-if="previewText" class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">ตัวอย่างเนื้อหา:</h4>
          <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ previewText }}</div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!canSubmit || loading"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังสร้าง...
            </span>
            <span v-else>สร้างเนื้อหา</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Error Toast -->
    <div
      v-if="error"
      class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>
        <button @click="clearError" class="ml-4 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAIGenerationStore } from '@/stores/aiGeneration'
import { rateLimiter } from '@/utils/rateLimiter'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const aiGenerationStore = useAIGenerationStore()
const authStore = useAuthStore()

// Form data
const formData = ref({
  request: {
    promptText: '',
    outputFormat: 'flashcard' as 'flashcard' | 'quiz' | 'note',
    maxRetries: 3
  },
  file: undefined as File | undefined
})

// UI state
const loading = ref(false)
const previewLoading = ref(false)
const showAdvancedOptions = ref(false)
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const previewText = ref('')
const error = ref('')
const fileInput = ref<HTMLInputElement>()

// Output formats
const outputFormats = [
  {
    value: 'flashcard' as const,
    label: 'Flashcard',
    description: 'บัตรคำสำหรับท่องจำ',
    icon: '🃏'
  },
  {
    value: 'quiz' as const,
    label: 'Quiz',
    description: 'แบบทดสอบคำถาม',
    icon: '❓'
  },
  {
    value: 'note' as const,
    label: 'Note',
    description: 'สรุปเนื้อหา',
    icon: '📝'
  }
]

// Computed properties
const canSubmit = computed(() => {
  return formData.value.request.promptText.trim().length > 0 &&
         formData.value.request.promptText.length <= 1000
})

const canPreview = computed(() => {
  return formData.value.request.promptText.trim().length > 0 &&
         formData.value.request.promptText.length <= 1000
})

const rateLimitInfo = computed(() => {
  const userId = authStore.user?.id?.toString() || 'anonymous'
  const generationInfo = rateLimiter.getRateLimitInfo(userId).generationRequests
  const previewInfo = rateLimiter.getRateLimitInfo(userId).previews

  return {
    remaining: generationInfo.remaining,
    limit: generationInfo.limit,
    resetTimeFormatted: rateLimiter.formatTimeRemaining(generationInfo.resetTime),
    previewRemaining: previewInfo.remaining,
    previewLimit: previewInfo.limit
  }
})

// Methods
const selectFormat = (format: 'flashcard' | 'quiz' | 'note') => {
  formData.value.request.outputFormat = format
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    validateAndSetFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    validateAndSetFile(files[0])
  }
}

const validateAndSetFile = (file: File) => {
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
    return
  }

  // Check file type
  const allowedTypes = ['.txt', '.pdf', '.doc', '.docx']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(fileExtension)) {
    error.value = 'ไฟล์ไม่ถูกต้อง (รองรับเฉพาะ TXT, PDF, DOC, DOCX)'
    return
  }

  selectedFile.value = file
  formData.value.file = file
  clearError()
}

const removeFile = () => {
  selectedFile.value = null
  formData.value.file = undefined
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const generatePreview = async () => {
  if (!canPreview.value) return

  previewLoading.value = true
  clearError()

  try {
    const preview = await aiGenerationStore.previewContent(formData.value.request)
    previewText.value = preview
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ไม่สามารถสร้าง preview ได้'
  } finally {
    previewLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  clearError()

  try {
    const requestId = await aiGenerationStore.createGenerationRequest(formData.value)

    // Start generation
    await aiGenerationStore.startGeneration(requestId)

    // Navigate to status page
    router.push(`/ai-generation/status/${requestId}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ไม่สามารถสร้างเนื้อหาได้'
  } finally {
    loading.value = false
  }
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(() => {
  // Initialize store if needed
  if (aiGenerationStore.generationRequests.length === 0) {
    aiGenerationStore.initialize()
  }
})

onUnmounted(() => {
  // Clean up any ongoing operations
  clearError()
})
</script>

<style scoped>
/* Custom styles for better UX */
.border-dashed {
  border-style: dashed;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Custom radio button styling */
input[type="radio"]:checked + label {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* File upload area hover effects */
.border-dashed:hover {
  border-color: #60a5fa;
}
</style>
