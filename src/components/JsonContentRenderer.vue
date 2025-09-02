<template>
  <div class="json-content-renderer">
    <!-- Quiz Renderer -->
    <div v-if="contentType === 'quiz'" class="quiz-renderer">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ quizData?.topic }}</h3>
            <p class="text-sm text-gray-500">{{ quizData?.questions?.length || 0 }} questions</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(question, index) in quizData?.questions || []"
            :key="question.id"
            class="border rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-start space-x-3">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <p class="font-medium text-gray-900 mb-2">{{ question.question }}</p>
                <div class="space-y-1">
                  <div
                    v-for="(option, optionIndex) in question.options"
                    :key="optionIndex"
                    :class="[
                      'px-3 py-2 rounded text-sm',
                      option === question.correctAnswer
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-white text-gray-700 border border-gray-200'
                    ]"
                  >
                    <span class="font-medium mr-2">{{ String.fromCharCode(65 + optionIndex) }}.</span>
                    {{ option }}
                    <span v-if="option === question.correctAnswer" class="ml-2 text-green-600">✓</span>
                  </div>
                </div>
                <p v-if="question.explanation" class="mt-2 text-sm text-gray-600 italic">
                  {{ question.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Renderer -->
    <div v-else-if="contentType === 'note'" class="note-renderer">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ noteData?.topic }}</h3>
            <p class="text-sm text-gray-500">{{ noteData?.content?.length || 0 }} sections</p>
          </div>
        </div>

        <div class="space-y-6">
          <div
            v-for="(section, index) in noteData?.content || []"
            :key="index"
            class="border-l-4 border-orange-200 pl-4"
          >
            <h4 class="font-medium text-gray-900 mb-2">{{ section.feature }}</h4>
            <div class="prose prose-sm text-gray-700">
              <p>{{ section.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flashcard Renderer -->
    <div v-else-if="contentType === 'flashcard'" class="flashcard-renderer">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ flashcardData?.topic }}</h3>
            <p class="text-sm text-gray-500">{{ flashcardData?.flashcards?.length || 0 }} cards</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(card, index) in flashcardData?.flashcards || []"
            :key="index"
            class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="bg-purple-50 px-4 py-3 border-b">
              <h5 class="font-medium text-purple-900">Card {{ index + 1 }}</h5>
            </div>
            <div class="p-4 space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Question:</p>
                <p class="text-gray-900">{{ card.question }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Answer:</p>
                <p class="text-gray-700">{{ card.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-renderer">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-800">
            Unknown content type: {{ contentType }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuizJSON, NoteJSON, FlashcardJSON } from '@/utils/jsonContentValidators'

interface Props {
  contentType: 'quiz' | 'note' | 'flashcard'
  contentData: string // JSON string
  title?: string
}

const props = defineProps<Props>()

// Parse JSON content
const parsedContent = computed(() => {
  try {
    return JSON.parse(props.contentData)
  } catch (error) {
    console.error('Failed to parse content data:', error)
    return null
  }
})

// Typed content accessors
const quizData = computed(() => {
  return props.contentType === 'quiz' ? parsedContent.value as QuizJSON : null
})

const noteData = computed(() => {
  return props.contentType === 'note' ? parsedContent.value as NoteJSON : null
})

const flashcardData = computed(() => {
  return props.contentType === 'flashcard' ? parsedContent.value as FlashcardJSON : null
})
</script>

<style scoped>
.json-content-renderer {
  /* Component-specific styles */
}

.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
