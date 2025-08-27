<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

interface Props {
  content: string
}

const props = defineProps<Props>()

// Quiz state
const questions = ref<QuizQuestion[]>([])
const currentQuestionIndex = ref(0)
const userAnswers = ref<Record<number, string | string[]>>({})
const showResults = ref(false)
const quizStarted = ref(false)

// Parse content to extract questions
const parseQuizContent = (content: string) => {
  console.log('Parsing content:', content)
  const lines = content.split('\n')
  const parsedQuestions: QuizQuestion[] = []
  let currentQuestion: Partial<QuizQuestion> = {}
  let questionId = 1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    console.log(`Line ${i}: "${line}"`)

    if (line.match(/^\d+\./)) {
      // Save previous question if exists
      if (currentQuestion.question) {
        console.log('Saving question:', currentQuestion)
        parsedQuestions.push({
          id: questionId++,
          type: currentQuestion.type || 'multiple-choice',
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer || '',
          explanation: currentQuestion.explanation
        } as QuizQuestion)
      }

      // Start new question
      const questionText = line.replace(/^\d+\.\s*/, '')
      currentQuestion = {
        question: questionText,
        options: [],
        type: 'multiple-choice'
      }

      // Check if it's True/False question
      if (questionText.includes('True/False')) {
        currentQuestion.type = 'true-false'
        currentQuestion.options = ['True', 'False']
        console.log('Set type to true-false for:', questionText)
      }
      // Check if it's Short Answer question
      else if (questionText.includes('Explain') || questionText.includes('Describe')) {
        currentQuestion.type = 'short-answer'
        console.log('Set type to short-answer for:', questionText)
      }

      console.log('New question:', currentQuestion)
    } else if (line.match(/^[A-D]\)/)) {
      // Multiple choice option
      currentQuestion.options?.push(line.replace(/^[A-D]\)\s*/, ''))
      console.log('Added option:', line.replace(/^[A-D]\)\s*/, ''))
    } else if (line.includes('True/False')) {
      currentQuestion.type = 'true-false'
      currentQuestion.options = ['True', 'False']
      console.log('Set type to true-false')
    } else if (line.includes('Explain') || line.includes('Describe')) {
      currentQuestion.type = 'short-answer'
      console.log('Set type to short-answer')
    } else if (line.startsWith('Answer:')) {
      // Extract correct answer
      currentQuestion.correctAnswer = line.replace(/^Answer:\s*/, '')
      console.log('Set answer:', currentQuestion.correctAnswer)
    } else if (line.trim() === '') {
      // Skip empty lines
      continue
    }
  }

  // Add last question
  if (currentQuestion.question) {
    console.log('Saving last question:', currentQuestion)
    parsedQuestions.push({
      id: questionId,
      type: currentQuestion.type || 'multiple-choice',
      question: currentQuestion.question,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer || '',
      explanation: currentQuestion.explanation
    } as QuizQuestion)
  }

  console.log('Final parsed questions:', parsedQuestions)
  return parsedQuestions
}

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

const correctAnswers = computed(() => {
  let correct = 0
  Object.keys(userAnswers.value).forEach(questionId => {
    const id = parseInt(questionId)
    const question = questions.value.find(q => q.id === id)
    const userAnswer = userAnswers.value[id]

    if (question && userAnswer) {
      if (Array.isArray(question.correctAnswer)) {
        if (Array.isArray(userAnswer) && userAnswer.length === question.correctAnswer.length) {
          correct += question.correctAnswer.every(ans => userAnswer.includes(ans)) ? 1 : 0
        }
      } else {
        correct += userAnswer === question.correctAnswer ? 1 : 0
      }
    }
  })
  return correct
})

const score = computed(() => {
  return totalQuestions.value > 0 ? Math.round((correctAnswers.value / totalQuestions.value) * 100) : 0
})

// Methods
const startQuiz = () => {
  quizStarted.value = true
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResults.value = false
}

const selectAnswer = (answer: string) => {
  userAnswers.value[currentQuestion.value.id] = answer
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
  } else {
    showResults.value = true
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const restartQuiz = () => {
  quizStarted.value = false
  showResults.value = false
  currentQuestionIndex.value = 0
  userAnswers.value = {}
}

const isAnswerSelected = (answer: string) => {
  return userAnswers.value[currentQuestion.value.id] === answer
}

const isAnswerCorrect = (questionId: number, answer: string | string[]) => {
  const question = questions.value.find(q => q.id === questionId)
  if (!question) return false

  if (Array.isArray(answer)) {
    if (Array.isArray(question.correctAnswer)) {
      return answer.length === question.correctAnswer.length &&
             answer.every(ans => question.correctAnswer.includes(ans))
    }
    return false
  }

  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(answer)
  }
  return question.correctAnswer === answer
}

const getUserAnswer = (questionId: number) => {
  return userAnswers.value[questionId] || ''
}

const parseAndSetQuestions = () => {
  console.log('=== PARSING QUIZ CONTENT ===')
  console.log('Content received:', props.content)
  questions.value = parseQuizContent(props.content)
  console.log('Final questions count:', questions.value.length)
  console.log('Questions:', questions.value)

  // Reset quiz state when content changes
  quizStarted.value = false
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResults.value = false
}

onMounted(() => {
  parseAndSetQuestions()
})

watch(() => props.content, () => {
  parseAndSetQuestions()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Quiz Start Screen -->
    <div v-if="!quizStarted" class="text-center py-12">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Interactive Quiz</h2>
      <p class="text-slate-600 mb-6">Test your knowledge with {{ totalQuestions }} questions</p>
      <button
        @click="startQuiz"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Quiz
      </button>
    </div>

    <!-- Quiz Questions -->
    <div v-else-if="!showResults" class="space-y-6">
      <!-- Progress Bar -->
      <div class="bg-slate-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="text-sm text-slate-500 text-center">
        Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-6">
          {{ currentQuestion.question }}
        </h3>

        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(option)"
            :class="
              isAnswerSelected(option)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            "
            class="w-full p-4 text-left border-2 rounded-lg transition-colors"
          >
            <span class="font-medium mr-3">{{ String.fromCharCode(65 + index) }}.</span>
            {{ option }}
          </button>
        </div>

        <!-- True/False -->
        <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
          <button
            v-for="option in currentQuestion.options || ['True', 'False']"
            :key="option"
            @click="selectAnswer(option)"
            :class="
              isAnswerSelected(option)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            "
            class="w-full p-4 text-left border-2 rounded-lg transition-colors"
          >
            {{ option }}
          </button>
        </div>

        <!-- Short Answer -->
        <div v-else-if="currentQuestion.type === 'short-answer'" class="space-y-3">
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="4"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Type your answer here..."
          ></textarea>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between">
        <button
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          @click="nextQuestion"
          :disabled="!userAnswers[currentQuestion.id]"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLastQuestion ? 'Finish Quiz' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Results Screen -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
      <div class="text-4xl font-bold text-blue-600 mb-2">{{ score }}%</div>
      <p class="text-slate-600 mb-6">
        You got {{ correctAnswers }} out of {{ totalQuestions }} questions correct
      </p>

      <!-- Score Message -->
      <div class="mb-8">
        <p v-if="score >= 90" class="text-green-600 font-medium">Excellent! Great job!</p>
        <p v-else-if="score >= 70" class="text-blue-600 font-medium">Good work! Keep it up!</p>
        <p v-else-if="score >= 50" class="text-yellow-600 font-medium">Not bad! Review the material and try again.</p>
        <p v-else class="text-red-600 font-medium">Keep studying! You'll get better with practice.</p>
      </div>

      <!-- Review Questions -->
      <div class="bg-white rounded-lg border border-slate-200 p-6 text-left">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Question Review</h3>
        <div class="space-y-4">
          <div
            v-for="question in questions"
            :key="question.id"
            class="border border-slate-200 rounded-lg p-4"
          >
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-medium text-slate-900">{{ question.question }}</h4>
              <span
                :class="
                  isAnswerCorrect(question.id, getUserAnswer(question.id))
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ isAnswerCorrect(question.id, getUserAnswer(question.id)) ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <div class="text-sm text-slate-600">
              <p><strong>Your answer:</strong> {{ getUserAnswer(question.id) || 'No answer' }}</p>
              <p><strong>Correct answer:</strong> {{ Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <button
          @click="restartQuiz"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>
