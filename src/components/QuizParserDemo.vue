<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
      <h1 class="text-3xl font-bold mb-2">🎯 Quiz Parser Demo</h1>
      <p class="text-blue-100">Frontend Parsing System - แปลง Simple Format เป็น 3 รูปแบบคำถาม</p>
    </div>

    <!-- Controls -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">⚙️ Quiz Configuration</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <!-- Question Types -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Question Types:</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input v-model="selectedTypes" type="checkbox" value="multiple-choice" class="mr-2">
              Multiple Choice
            </label>
            <label class="flex items-center">
              <input v-model="selectedTypes" type="checkbox" value="true-false" class="mr-2">
              True/False
            </label>
            <label class="flex items-center">
              <input v-model="selectedTypes" type="checkbox" value="open-ended" class="mr-2">
              Open-ended
            </label>
          </div>
        </div>

        <!-- Distribution Mode -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Distribution Mode:</label>
          <select v-model="distributionMode" class="w-full p-2 border border-gray-300 rounded">
            <option value="round-robin">Round Robin</option>
            <option value="random">Random</option>
            <option value="weighted">Weighted</option>
          </select>
        </div>

        <!-- Language -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Language:</label>
          <select v-model="language" class="w-full p-2 border border-gray-300 rounded">
            <option value="th">Thai</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button @click="generateQuiz" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          🔄 Generate Quiz
        </button>
        <button @click="testAllFormats" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          🧪 Test All Formats
        </button>
        <button @click="showStats" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          📊 Show Statistics
        </button>
        <button @click="exportForInteractiveQuiz" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          📤 Export for InteractiveQuiz
        </button>
      </div>
    </div>

    <!-- Simple Questions Input -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">📝 Simple Questions Input</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Edit Questions:</label>
          <textarea
            v-model="simpleQuestionsInput"
            class="w-full h-64 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder="แก้ไขคำถามในรูปแบบ JSON..."
          ></textarea>
          <button @click="loadSampleQuestions" class="mt-2 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
            Load Sample Questions
          </button>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
          <div class="h-64 p-3 bg-gray-50 border border-gray-300 rounded overflow-y-auto">
            <div v-if="parsedSimpleQuestions.length > 0" class="space-y-2">
              <div v-for="(q, index) in parsedSimpleQuestions" :key="index" class="p-2 bg-white rounded border">
                <div class="font-medium text-sm">{{ index + 1 }}. {{ q.question }}</div>
                <div class="text-xs text-gray-600 mt-1">Answer: {{ q.answer }}</div>
                <div v-if="q.difficulty" class="text-xs text-blue-600">Difficulty: {{ q.difficulty }}</div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm">No valid questions found</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Quiz Display -->
    <div v-if="generatedQuiz.length > 0" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">🎲 Generated Mixed Quiz</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium mb-2">Quiz Questions:</h3>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div v-for="(question, index) in generatedQuiz" :key="question.id"
                 class="p-4 border rounded-lg"
                 :class="{
                   'border-blue-200 bg-blue-50': question.type === 'multiple-choice',
                   'border-green-200 bg-green-50': question.type === 'true-false',
                   'border-purple-200 bg-purple-50': question.type === 'open-ended'
                 }">

              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 text-xs rounded"
                      :class="{
                        'bg-blue-500 text-white': question.type === 'multiple-choice',
                        'bg-green-500 text-white': question.type === 'true-false',
                        'bg-purple-500 text-white': question.type === 'open-ended'
                      }">
                  {{ question.type.toUpperCase() }}
                </span>
                <span class="text-sm text-gray-600">{{ question.points }} points</span>
              </div>

              <div class="font-medium text-sm mb-2">{{ question.question }}</div>

              <!-- Multiple Choice Options -->
              <div v-if="question.type === 'multiple-choice' && question.options" class="text-xs space-y-1">
                <div v-for="option in question.options" :key="option.id"
                     class="flex items-center gap-2"
                     :class="{ 'font-medium text-green-600': option.correct }">
                  <span>{{ option.id }}.</span>
                  <span>{{ option.text }}</span>
                  <span v-if="option.correct" class="text-green-600">✓</span>
                </div>
              </div>

              <!-- True/False Answer -->
              <div v-else-if="question.type === 'true-false'" class="text-xs">
                <span class="font-medium">Answer: </span>
                <span class="text-green-600">{{ question.correctAnswer ? 'True' : 'False' }}</span>
              </div>

              <!-- Open-ended Info -->
              <div v-else-if="question.type === 'open-ended'" class="text-xs">
                <div><span class="font-medium">Expected: </span>{{ question.correctAnswer }}</div>
                <div v-if="question.keywords" class="mt-1">
                  <span class="font-medium">Keywords: </span>{{ question.keywords?.join(', ') }}
                </div>
              </div>

              <!-- Explanation -->
              <div v-if="question.explanation" class="text-xs text-gray-600 mt-2 italic">
                {{ question.explanation }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium mb-2">Quiz Statistics:</h3>
          <div class="bg-gray-50 p-4 rounded">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Total Questions:</span>
                <span class="font-medium">{{ quizStats.totalQuestions }}</span>
              </div>
              <div class="flex justify-between">
                <span>Multiple Choice:</span>
                <span class="font-medium text-blue-600">{{ quizStats.multipleChoice }}</span>
              </div>
              <div class="flex justify-between">
                <span>True/False:</span>
                <span class="font-medium text-green-600">{{ quizStats.trueFalse }}</span>
              </div>
              <div class="flex justify-between">
                <span>Open-ended:</span>
                <span class="font-medium text-purple-600">{{ quizStats.openEnded }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span>Total Points:</span>
                <span class="font-bold text-lg">{{ quizStats.totalPoints }}</span>
              </div>
            </div>
          </div>

          <h3 class="font-medium mb-2 mt-4">Export Options:</h3>
          <div class="space-y-2">
            <button @click="copyToClipboard('json')" class="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              📋 Copy as JSON
            </button>
            <button @click="copyToClipboard('interactive')" class="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              📋 Copy for InteractiveQuiz
            </button>
            <button @click="downloadQuiz" class="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              💾 Download Quiz File
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Results -->
    <div v-if="testResults" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">🧪 Test Results</h2>
      <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{{ testResults }}</pre>
    </div>

    <!-- Toast Notifications -->
    <div v-if="notification" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ notification }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { convertToMixedQuiz, type SimpleQuestion, type QuizConversionOptions } from '@/utils/quizParser'
import { sampleSimpleQuestions, runAllTests, analyzeConversionStats, integrateWithInteractiveQuiz } from '@/utils/quizParserDemo'

// Reactive state
const selectedTypes = ref<Array<'multiple-choice' | 'true-false' | 'open-ended'>>(['multiple-choice', 'true-false', 'open-ended'])
const distributionMode = ref<'round-robin' | 'random' | 'weighted'>('round-robin')
const language = ref<'th' | 'en'>('th')

const simpleQuestionsInput = ref('')
const generatedQuiz = ref<ReturnType<typeof convertToMixedQuiz>>([])
const testResults = ref('')
const notification = ref('')

// Load sample questions on mount
simpleQuestionsInput.value = JSON.stringify(sampleSimpleQuestions, null, 2)

// Computed properties
const parsedSimpleQuestions = computed(() => {
  try {
    return JSON.parse(simpleQuestionsInput.value) as SimpleQuestion[]
  } catch {
    return []
  }
})

const quizStats = computed(() => {
  if (generatedQuiz.value.length === 0) return {
    totalQuestions: 0,
    multipleChoice: 0,
    trueFalse: 0,
    openEnded: 0,
    totalPoints: 0
  }

  return {
    totalQuestions: generatedQuiz.value.length,
    multipleChoice: generatedQuiz.value.filter(q => q.type === 'multiple-choice').length,
    trueFalse: generatedQuiz.value.filter(q => q.type === 'true-false').length,
    openEnded: generatedQuiz.value.filter(q => q.type === 'open-ended').length,
    totalPoints: generatedQuiz.value.reduce((sum, q) => sum + (q.points || 0), 0)
  }
})

// Methods
const generateQuiz = () => {
  if (parsedSimpleQuestions.value.length === 0) {
    showNotification('❌ Please provide valid simple questions')
    return
  }

  const options: Partial<QuizConversionOptions> = {
    questionTypes: selectedTypes.value,
    distributionMode: distributionMode.value,
    language: language.value,
    generateExplanations: true
  }

  generatedQuiz.value = convertToMixedQuiz(parsedSimpleQuestions.value, options)
  showNotification(`✅ Generated ${generatedQuiz.value.length} questions`)
}

const testAllFormats = () => {
  console.log('🚀 Running all Quiz Parser tests...')
  const results = runAllTests()
  testResults.value = JSON.stringify(results, null, 2)
  showNotification('🧪 All tests completed - check console and results below')
}

const showStats = () => {
  if (generatedQuiz.value.length === 0) {
    showNotification('❌ Generate a quiz first')
    return
  }

  const stats = analyzeConversionStats(generatedQuiz.value)
  console.log('📊 Quiz Statistics:', stats)
  showNotification('📊 Statistics logged to console')
}

const exportForInteractiveQuiz = () => {
  if (generatedQuiz.value.length === 0) {
    showNotification('❌ Generate a quiz first')
    return
  }

  const exportData = integrateWithInteractiveQuiz()
  console.log('📤 Export for InteractiveQuiz:', exportData)
  showNotification('📤 Export data logged to console')
}

const loadSampleQuestions = () => {
  simpleQuestionsInput.value = JSON.stringify(sampleSimpleQuestions, null, 2)
  showNotification('📝 Sample questions loaded')
}

const copyToClipboard = (format: 'json' | 'interactive') => {
  let data = ''

  if (format === 'json') {
    data = JSON.stringify(generatedQuiz.value, null, 2)
  } else if (format === 'interactive') {
    const quizData = {
      metadata: {
        title: 'Generated Quiz',
        subject: 'General',
        difficulty: 'medium',
        language: language.value
      },
      content: {
        questions: generatedQuiz.value
      }
    }
    data = JSON.stringify(quizData, null, 2)
  }

  navigator.clipboard.writeText(data).then(() => {
    showNotification(`📋 ${format.toUpperCase()} copied to clipboard`)
  })
}

const downloadQuiz = () => {
  const quizData = {
    metadata: {
      title: 'Generated Quiz',
      createdAt: new Date().toISOString(),
      questionTypes: selectedTypes.value,
      distributionMode: distributionMode.value,
      language: language.value
    },
    quiz: generatedQuiz.value,
    statistics: quizStats.value
  }

  const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quiz-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)

  showNotification('💾 Quiz downloaded')
}

const showNotification = (message: string) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

// Watch for changes and auto-generate
watch([selectedTypes, distributionMode, language], () => {
  if (parsedSimpleQuestions.value.length > 0) {
    generateQuiz()
  }
}, { deep: true })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
