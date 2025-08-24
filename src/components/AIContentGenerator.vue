<script setup lang="ts">
import { ref, computed } from 'vue'
import AIContentPreview from './ai/AIContentPreview.vue'
import FileProcessingStatus from './ai/FileProcessingStatus.vue'

interface AIContent {
  id: string
  type: 'summary' | 'quiz' | 'flashcard' | 'notes'
  title: string
  content: string
  sourcePrompt: string
  sourceFile?: File
  createdAt: Date
}

const currentStep = ref<'input' | 'preview' | 'generating'>('input')
const selectedTemplate = ref<string>('')
const userPrompt = ref('')
const uploadedFiles = ref<File[]>([])
const isGenerating = ref(false)
const generatedContent = ref<AIContent | null>(null)
const generationProgress = ref(0)

const templates = [
  {
    id: 'summary',
    name: 'Content Summary',
    description: 'Summarize lessons or documents in an easy-to-understand format',
    icon: '📝',
    prompt:
      'Please help summarize the following content in an easy-to-understand format covering the key points:',
  },
  {
    id: 'quiz',
    name: 'Create Quiz',
    description: 'Generate quiz questions from content',
    icon: '❓',
    prompt: 'Create 10 quiz questions from the following content:',
  },
  {
    id: 'flashcard',
    name: 'Create Flashcards',
    description: 'Generate flashcards for memorization',
    icon: '🃏',
    prompt: 'Create flashcards from the following content with questions and answers:',
  },
  {
    id: 'notes',
    name: 'Create Notes',
    description: 'Generate structured notes',
    icon: '📋',
    prompt: 'Create structured notes from the following content:',
  },
]

const canProceed = computed(() => {
  if (currentStep.value === 'input') {
    return userPrompt.value.trim().length > 0 || uploadedFiles.value.length > 0
  }
  return true
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    uploadedFiles.value.push(...newFiles)
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const selectTemplate = (templateId: string) => {
  selectedTemplate.value = templateId
  const template = templates.find((t) => t.id === templateId)
  if (template) {
    userPrompt.value = template.prompt
  }
}

const nextStep = () => {
  if (currentStep.value === 'input') {
    currentStep.value = 'preview'
  }
}

const prevStep = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'input'
  }
}

const generateContent = async () => {
  isGenerating.value = true
  currentStep.value = 'generating'
  generationProgress.value = 0

  // Simulate generation progress
  const interval = setInterval(() => {
    generationProgress.value += Math.random() * 20
    if (generationProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        // Mock generated content
        generatedContent.value = {
          id: Date.now().toString(),
          type: selectedTemplate.value as 'summary' | 'quiz' | 'flashcard' | 'notes',
          title: `Generated ${templates.find((t) => t.id === selectedTemplate.value)?.name}`,
          content: 'This is AI-generated content...',
          sourcePrompt: userPrompt.value,
          createdAt: new Date(),
        }
        isGenerating.value = false
        currentStep.value = 'preview'
      }, 1000)
    }
  }, 500)
}

const saveContent = () => {
  // TODO: Save to database
  console.log('Saving content:', generatedContent.value)
}

const reset = () => {
  currentStep.value = 'input'
  selectedTemplate.value = ''
  userPrompt.value = ''
  uploadedFiles.value = []
  generatedContent.value = null
  generationProgress.value = 0
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
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
            <h1 class="text-xl font-bold text-gray-900">AI Content Generator</h1>
          </div>
          <button
            @click="reset"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center"
            :class="currentStep === 'input' ? 'text-purple-600' : 'text-gray-400'"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
              :class="
                currentStep === 'input'
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-gray-300'
              "
            >
              1
            </div>
            <span class="ml-2 font-medium">Input</span>
          </div>
          <div class="w-12 h-1 bg-gray-200 rounded-full">
            <div
              class="h-1 bg-purple-600 rounded-full transition-all duration-300"
              :style="{ width: currentStep === 'preview' ? '100%' : '0%' }"
            ></div>
          </div>
          <div
            class="flex items-center"
            :class="currentStep === 'preview' ? 'text-purple-600' : 'text-gray-400'"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
              :class="
                currentStep === 'preview'
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-gray-300'
              "
            >
              2
            </div>
            <span class="ml-2 font-medium">Preview</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto">
        <!-- Step 1: Input -->
        <div v-if="currentStep === 'input'" class="space-y-6">
          <!-- Template Selection -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Template</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="template in templates"
                :key="template.id"
                @click="selectTemplate(template.id)"
                class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                :class="
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                "
              >
                <div class="flex items-center gap-3">
                  <div class="text-2xl">{{ template.icon }}</div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
                    <p class="text-sm text-gray-500">{{ template.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Prompt Input -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Prompt or Description</h2>
            <textarea
              v-model="userPrompt"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe what you want AI to create for you..."
            ></textarea>
          </div>

          <!-- File Upload -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload Files (Optional)</h2>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                @change="handleFileUpload"
                class="hidden"
                id="file-upload"
                accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
              />
              <label for="file-upload" class="cursor-pointer">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-gray-400"
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
                  </div>
                  <div>
                    <p class="text-gray-600 font-medium">Click to upload files</p>
                    <p class="text-sm text-gray-500">Supports PDF, DOCX, TXT, Images</p>
                  </div>
                </div>
              </label>
            </div>

            <!-- Uploaded Files -->
            <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
          </div>
        </div>

        <!-- Step 2: Preview -->
        <AIContentPreview
          v-if="currentStep === 'preview'"
          :content="generatedContent"
          @generate="generateContent"
          @save="saveContent"
          @prev="prevStep"
        />

        <!-- Generating State -->
        <FileProcessingStatus
          v-if="currentStep === 'generating'"
          :progress="generationProgress"
          :is-generating="isGenerating"
        />

        <!-- Navigation -->
        <div v-if="currentStep === 'input'" class="flex justify-end mt-8">
          <button
            @click="nextStep"
            :disabled="!canProceed"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better UX */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.hover\:shadow-md:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
