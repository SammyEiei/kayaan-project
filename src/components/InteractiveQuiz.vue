<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { convertToMixedQuiz, type SimpleQuestion } from '@/utils/quizParser'

interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'open-ended'
  question: string
  options?: Array<{
    id: string
    text: string
    correct: boolean
  }>
  correctAnswer: string | string[] | boolean
  explanation?: string
  points?: number
  keywords?: string[]
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

  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(content)

    // If it's a structured quiz object
    if (jsonData.questions && Array.isArray(jsonData.questions)) {
      return parseJsonQuiz(jsonData)
    }
  } catch {
    // Not JSON, continue with text parsing
    console.log('Not JSON, parsing as text')
  }

  // Original text parsing logic
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
      if (questionText.includes('true/false')) {
        currentQuestion.type = 'true-false'
        currentQuestion.options = [
          { id: 'true', text: 'true', correct: false },
          { id: 'false', text: 'false', correct: false }
        ]
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
      const optionText = line.replace(/^[A-D]\)\s*/, '')
      const optionId = line.match(/^([A-D])\)/)?.[1] || 'A'
      currentQuestion.options?.push({
        id: optionId,
        text: optionText,
        correct: false
      })
      console.log('Added option:', optionText)
    } else if (line.includes('True/False')) {
      currentQuestion.type = 'true-false'
      currentQuestion.options = [
        { id: 'true', text: 'True', correct: false },
        { id: 'false', text: 'False', correct: false }
      ]
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

// Parse JSON quiz content with Quiz Parser support
const parseJsonQuiz = (jsonData: Record<string, unknown>): QuizQuestion[] => {
  console.log('Parsing JSON quiz data:', jsonData)

  // Check if this is already a converted quiz format from Quiz Parser
  if (jsonData.questions && Array.isArray(jsonData.questions)) {
    return jsonData.questions.map((q: Record<string, unknown>) => ({
      id: q.id as number || 0,
      type: q.type as QuizQuestion['type'] || 'multiple-choice',
      question: q.question as string || '',
      options: q.options as QuizQuestion['options'],
      correctAnswer: q.correctAnswer as QuizQuestion['correctAnswer'] || '',
      explanation: q.explanation as string,
      points: q.points as number,
      keywords: q.keywords as string[]
    }))
  }

  // Check if this is simple format that needs conversion
  if (jsonData.simpleQuestions && Array.isArray(jsonData.simpleQuestions)) {
    console.log('Converting simple questions to mixed quiz format')
    const simpleQuestions = jsonData.simpleQuestions as SimpleQuestion[]
    const convertedQuiz = convertToMixedQuiz(simpleQuestions, {
      questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
      distributionMode: 'round-robin',
      language: 'th'
    })

    return convertedQuiz.map(q => ({
      id: q.id,
      type: q.type === 'open-ended' ? 'short-answer' : q.type,
      question: q.question,
      options: q.type === 'multiple-choice' ? q.options :
               q.type === 'true-false' ? [
                 { id: 'true', text: 'จริง', correct: q.correctAnswer === true },
                 { id: 'false', text: 'เท็จ', correct: q.correctAnswer === false }
               ] : undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points,
      keywords: q.type === 'open-ended' ? q.keywords : undefined
    } as QuizQuestion))
  }

  // Fallback: try to detect simple Q&A format and convert using Quiz Parser
  if (jsonData.content && Array.isArray(jsonData.content)) {
    console.log('Detecting simple Q&A format, converting with Quiz Parser')
    const simpleQuestions: SimpleQuestion[] = jsonData.content.map((item: Record<string, unknown>) => ({
      question: item.question as string || '',
      answer: item.answer as string || '',
      context: item.context as string,
      difficulty: item.difficulty as 'easy' | 'medium' | 'hard'
    }))

    if (simpleQuestions.length > 0) {
      const convertedQuiz = convertToMixedQuiz(simpleQuestions, {
        questionTypes: ['multiple-choice', 'true-false', 'open-ended'],
        distributionMode: 'round-robin',
        language: 'th',
        generateExplanations: true
      })

      return convertedQuiz.map(q => ({
        id: q.id,
        type: q.type === 'open-ended' ? 'short-answer' : q.type,
        question: q.question,
        options: q.type === 'multiple-choice' ? q.options :
                 q.type === 'true-false' ? [
                   { id: 'true', text: 'จริง', correct: q.correctAnswer === true },
                   { id: 'false', text: 'เท็จ', correct: q.correctAnswer === false }
                 ] : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        keywords: q.type === 'open-ended' ? q.keywords : undefined
      } as QuizQuestion))
    }
  }

  console.log('No compatible format found, returning empty array')
  return []
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

// Check if current question has a valid answer
const isAnswerProvided = computed(() => {
  const answer = userAnswers.value[currentQuestion.value.id]

  // For different question types, check if answer is provided
  if (currentQuestion.value.type === 'short-answer' || currentQuestion.value.type === 'open-ended') {
    // For text answers, check if there's actual content (not just whitespace)
    return answer && typeof answer === 'string' && answer.trim().length > 0
  } else {
    // For multiple choice, true/false, etc.
    return answer !== undefined && answer !== null && answer !== ''
  }
})

// Development mode check
const isDevelopmentMode = computed(() => {
  return import.meta.env.DEV
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

const handleAnswerInput = () => {
  // Force reactivity update
  console.log('Answer input changed:', userAnswers.value[currentQuestion.value.id])
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
             answer.every(ans => (question.correctAnswer as string[]).includes(ans))
    }
    return false
  }

  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(answer as string)
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

  // Debug individual questions
  questions.value.forEach((q, index) => {
    console.log(`Question ${index + 1}:`, {
      id: q.id,
      type: q.type,
      question: q.question,
      optionsCount: Array.isArray(q.options) ? q.options.length : 0,
      optionsType: Array.isArray(q.options) && q.options.length > 0 ? typeof q.options[0] : 'none',
      optionsPreview: Array.isArray(q.options) ? q.options.slice(0, 2) : 'none',
      correctAnswer: q.correctAnswer
    })
  })

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

                <!-- Debug info for question type (development only) -->
        <!-- <div v-if="isDevelopmentMode" class="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Debug: Question Type = <strong>{{ currentQuestion.type }}</strong>,
          ID = {{ currentQuestion.id }}
        </div> -->

        <!-- Multiple Choice -->
        <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
          <div v-if="!currentQuestion.options || currentQuestion.options.length === 0"
               class="text-red-600 bg-red-50 p-4 rounded-lg">
            ⚠️ No options available for this question. Please check the content format.
            <br>
            <small>Question ID: {{ currentQuestion.id }}, Type: {{ currentQuestion.type }}</small>
          </div>
          <button
            v-else
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(typeof option === 'string' ? option : option.text)"
            :class="
              isAnswerSelected(typeof option === 'string' ? option : option.text)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            "
            class="w-full p-4 text-left border-2 rounded-lg transition-colors"
          >
            <span class="font-medium mr-3">{{ String.fromCharCode(65 + index) }}.</span>
            {{ typeof option === 'string' ? option : option.text }}
          </button>
        </div>

        <!-- True/False -->
        <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
          <button
            v-for="option in currentQuestion.options || [
              { id: 'true', text: 'true', correct: false },
              { id: 'false', text: 'false', correct: false }
            ]"
            :key="typeof option === 'string' ? option : option.id"
            @click="selectAnswer(typeof option === 'string' ? option : option.text)"
            :class="
              isAnswerSelected(typeof option === 'string' ? option : option.text)
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-slate-300 hover:bg-slate-50'
            "
            class="w-full p-4 text-left border-2 rounded-lg transition-colors"
          >
            {{ typeof option === 'string' ? option : option.text }}
          </button>
        </div>

        <!-- Short Answer -->
        <div v-else-if="currentQuestion.type === 'short-answer'" class="space-y-3">
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="4"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Type your answer here..."
            @input="handleAnswerInput"
          ></textarea>

                    <!-- Debug info (for development) -->
          <div v-if="isDevelopmentMode" class="text-xs text-gray-500">
            Debug: Answer length = {{ userAnswers[currentQuestion.id]?.length || 0 }},
            Is provided = {{ isAnswerProvided }}
          </div>
        </div>

        <!-- Open Ended (similar to short answer but longer) -->
        <div v-else-if="currentQuestion.type === 'open-ended'" class="space-y-3">
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="6"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Provide your detailed answer here..."
            @input="handleAnswerInput"
          ></textarea>

                    <!-- Debug info (for development) -->
          <div v-if="isDevelopmentMode" class="text-xs text-gray-500">
            Debug: Answer length = {{ userAnswers[currentQuestion.id]?.length || 0 }},
            Is provided = {{ isAnswerProvided }}
          </div>
        </div>

        <!-- Fallback for unsupported question types -->
        <div v-else class="space-y-3">
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">
              <strong>Unsupported question type:</strong> {{ currentQuestion.type }}
            </p>
            <p class="text-yellow-700 text-xs mt-1">
              This question type is not yet supported in the interactive quiz.
            </p>
          </div>

          <!-- Allow manual text input as fallback -->
          <textarea
            v-model="userAnswers[currentQuestion.id]"
            rows="4"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Please provide your answer here..."
            @input="handleAnswerInput"
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
          :disabled="!isAnswerProvided"
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
