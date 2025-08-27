<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAIContentStore } from '@/stores/aiContent'
import type { CreateGenerationRequestDTO } from '@/service/AIContentService'

const aiStore = useAIContentStore()

// Step management
const currentStep = ref<'prompt' | 'preview' | 'generating' | 'result'>('prompt')

// Form data
const promptText = ref('')
const outputFormat = ref<'summary' | 'quiz' | 'flashcard' | 'note'>('summary')
const attachedFiles = ref<File[]>([])
const generationProgress = ref(0)
const generationStatus = ref('Initializing...')
const estimatedTime = ref<number | null>(null)
const showPreview = ref(false)
const previewContent = ref('')

// File upload
const fileInput = ref<HTMLInputElement>()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    attachedFiles.value.push(...newFiles)
  }
}

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

// Default prompts based on content type
const defaultPrompts = {
  summary: 'Create a comprehensive summary of the attached content, highlighting key points, main ideas, and important details. Organize the information in a clear, structured format that is easy to understand and review.',
  quiz: 'Generate a quiz based on the attached content with multiple choice questions, true/false questions, and short answer questions. Include questions that test understanding of key concepts, important details, and critical thinking skills.',
  flashcard: 'Create flashcards from the attached content covering key terms, concepts, definitions, and important facts. Each flashcard should have a clear question or term on the front and a concise, accurate answer on the back.',
  note: 'Transform the attached content into well-organized study notes with clear headings, bullet points, and structured information. Include key concepts, definitions, examples, and important details in an easy-to-review format.'
}

// Content type options
const outputFormats = [
  { value: 'summary', label: 'Summary', icon: 'FileText', description: 'Comprehensive content summary' },
  { value: 'quiz', label: 'Quiz', icon: 'HelpCircle', description: 'Interactive quiz questions' },
  { value: 'flashcard', label: 'Flashcards', icon: 'Cards', description: 'Study flashcards' },
  { value: 'note', label: 'Study Notes', icon: 'Edit', description: 'Organized study notes' }
]

// Validation
const isValid = computed(() => {
  return promptText.value.trim().length >= 10
})

const characterCount = computed(() => promptText.value.length)

// Navigation
const handleNext = () => {
  if (currentStep.value === 'prompt') {
    currentStep.value = 'preview'
  } else if (currentStep.value === 'preview') {
    handleGenerate()
  }
}

const handleBack = () => {
  if (currentStep.value === 'preview') {
    currentStep.value = 'prompt'
  }
}

// Update prompt when content type changes
const handleContentTypeChange = (type: 'summary' | 'quiz' | 'flashcard' | 'note') => {
  outputFormat.value = type
  promptText.value = defaultPrompts[type]
}



// Generation
const handleGenerate = async () => {
  if (!isValid.value) return

  currentStep.value = 'generating'
  generationProgress.value = 0
  generationStatus.value = 'Initializing...'

  try {
    const requestData: CreateGenerationRequestDTO = {
      promptText: promptText.value.trim(),
      outputFormat: outputFormat.value,
      additionalContext: undefined,
      maxRetries: 3,
      useTemplate: false,
      templateId: undefined,
    }

    const requestId = await aiStore.createGenerationRequest(requestData)
    await aiStore.startGeneration(requestId)

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      if (generationProgress.value < 90) {
        generationProgress.value += Math.random() * 10
        if (generationProgress.value < 30) {
          generationStatus.value = 'Analyzing content...'
        } else if (generationProgress.value < 60) {
          generationStatus.value = 'Generating content...'
        } else {
          generationStatus.value = 'Finalizing...'
        }
      }
    }, 1000)

    // Simulate completion
    setTimeout(() => {
      clearInterval(progressInterval)
      generationProgress.value = 100
      generationStatus.value = 'Complete!'
      setTimeout(() => {
        currentStep.value = 'result'
      }, 1000)
    }, 8000)

  } catch (error) {
    console.error('Generation failed:', error)
    currentStep.value = 'prompt'
  }
}

const resetGeneration = () => {
  currentStep.value = 'prompt'
  promptText.value = ''
  attachedFiles.value = []
  generationProgress.value = 0
  generationStatus.value = ''
  showPreview.value = false
  previewContent.value = ''
}

onMounted(() => {
  // Set default prompt
  promptText.value = defaultPrompts.summary
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            v-for="(step, index) in ['Prompt', 'Preview', 'Generating', 'Result']"
            :key="step"
            class="flex items-center"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
              :class="
                currentStep === step.toLowerCase() as any
                  ? 'bg-blue-600 text-white'
                  : index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              "
            >
              {{ index + 1 }}
            </div>
            <span
              class="ml-2 text-sm font-medium"
              :class="
                currentStep === step.toLowerCase() as any
                  ? 'text-blue-600'
                  : index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep)
                  ? 'text-green-600'
                  : 'text-slate-500'
              "
            >
              {{ step }}
            </span>
            <div
              v-if="index < 3"
              class="ml-4 w-12 h-0.5 bg-slate-200"
              :class="index < ['prompt', 'preview', 'generating', 'result'].indexOf(currentStep) ? 'bg-green-500' : ''"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="aiStore.error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ aiStore.error }}</p>
        </div>
        <button @click="aiStore.clearError" class="ml-auto text-red-400 hover:text-red-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Step 1: Prompt Configuration -->
    <div v-if="currentStep === 'prompt'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Step 1: Configure Your Content</h2>

        <!-- Content Type Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-3">Content Type</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="format in outputFormats"
              :key="format.value"
              @click="handleContentTypeChange(format.value as 'summary' | 'quiz' | 'flashcard' | 'note')"
              class="p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-sm"
              :class="
                outputFormat === format.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              "
            >
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="format.icon === 'FileText'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  <path v-else-if="format.icon === 'HelpCircle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="format.icon === 'Cards'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div>
                  <h3 class="font-medium text-slate-900">{{ format.label }}</h3>
                  <p class="text-sm text-slate-500">{{ format.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- File Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-3">Attach Files (Optional)</label>
          <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              @change="handleFileUpload"
              class="hidden"
            />
            <button
              @click="fileInput?.click()"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choose Files
            </button>
            <p class="text-sm text-slate-500 mt-2">Support: PDF, DOC, DOCX, TXT, MD (Max 10MB each) - Optional</p>
          </div>

          <!-- Attached Files List -->
          <div v-if="attachedFiles.length > 0" class="mt-4 space-y-2">
            <h4 class="text-sm font-medium text-slate-700">Attached Files:</h4>
            <div
              v-for="(file, index) in attachedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-slate-900">{{ file.name }}</p>
                  <p class="text-xs text-slate-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
              </div>
              <button
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Prompt Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">Generation Prompt</label>
          <textarea
            v-model="promptText"
            rows="6"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe what you want to generate. Be specific about the content, style, and requirements..."
            :class="{ 'border-red-300 focus:ring-red-500': promptText.length > 0 && !isValid }"
          ></textarea>
          <div class="flex justify-between items-center mt-2 text-sm">
            <span class="text-slate-500">
              Minimum 10 characters, maximum 2000 characters
            </span>
            <span
              :class="
                characterCount > 2000
                  ? 'text-red-500'
                  : characterCount >= 10
                  ? 'text-green-500'
                  : 'text-slate-400'
              "
            >
              {{ characterCount }}/2000
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-end">
        <button
          @click="handleNext"
          :disabled="!isValid"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next: Preview
        </button>
      </div>
    </div>

    <!-- Step 2: Preview -->
    <div v-if="currentStep === 'preview'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Step 2: Preview & Generate</h2>

        <!-- Settings Summary -->
        <div class="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 class="font-medium text-slate-900 mb-3">Generation Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-500">Content Type:</span>
              <p class="font-medium">{{ outputFormats.find(f => f.value === outputFormat)?.label }}</p>
            </div>
            <div>
              <span class="text-slate-500">Files Attached:</span>
              <p class="font-medium">{{ attachedFiles.length }} file(s)</p>
            </div>
          </div>
        </div>

        <!-- Prompt Preview -->
        <div class="mb-6">
          <h3 class="font-medium text-slate-900 mb-3">Prompt Preview</h3>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-blue-900">{{ promptText }}</p>
          </div>
        </div>

        <!-- Files Preview -->
        <div v-if="attachedFiles.length > 0" class="mb-6">
          <h3 class="font-medium text-slate-900 mb-3">Attached Files</h3>
          <div class="space-y-2">
            <div
              v-for="(file, index) in attachedFiles"
              :key="index"
              class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
            >
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-slate-900">{{ file.name }}</p>
                <p class="text-xs text-slate-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="mb-6">
          <h3 class="font-medium text-slate-900 mb-3">Attached Files</h3>
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <p class="text-slate-500">No files attached</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <button
          @click="handleBack"
          class="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          @click="handleGenerate"
          :disabled="!isValid"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate Content
        </button>
      </div>
    </div>

    <!-- Step 3: Generating -->
    <div v-if="currentStep === 'generating'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <h2 class="text-xl font-semibold text-slate-900 mb-6">Generating Your Content</h2>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${generationProgress}%` }"
            ></div>
          </div>
          <p class="text-lg font-medium text-slate-900">{{ Math.round(generationProgress) }}% Complete</p>
          <p class="text-slate-600 mt-2">{{ generationStatus }}</p>
          <p v-if="estimatedTime" class="text-sm text-slate-500 mt-1">
            Estimated time remaining: {{ estimatedTime }} seconds
          </p>
        </div>

        <!-- Cancel Button -->
        <button
          @click="resetGeneration"
          class="px-6 py-3 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          Cancel Generation
        </button>
      </div>
    </div>

    <!-- Step 4: Result -->
    <div v-if="currentStep === 'result'" class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Generation Complete!</h2>

        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium text-green-900">Content Generated Successfully</span>
          </div>
          <p class="text-green-800">Your {{ outputFormats.find(f => f.value === outputFormat)?.label.toLowerCase() }} has been created and is ready for use.</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="handleGenerate"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Regenerate
          </button>
          <button
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Content
          </button>
          <button
            @click="resetGeneration"
            class="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Start New
          </button>
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

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
