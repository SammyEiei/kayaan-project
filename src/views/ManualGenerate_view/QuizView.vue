<template>
  <div class="max-w-5xl mx-auto space-y-6 p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ editingContent ? 'Edit Quiz' : 'Create New Quiz' }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ editingContent ? 'Update your quiz content' : 'Build an interactive quiz for your students' }}
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 font-medium"
          @click="onBack"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
          @click="handleSave"
          :disabled="isSaving"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span v-if="!isSaving">Save Quiz</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</div>
    <div v-if="successMessage" class="text-green-600 mt-2">{{ successMessage }}</div>

    <!-- Quiz Details -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Quiz Information</h3>
      </div>

      <div>
        <label for="quiz-title" class="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
        <input
          id="quiz-title"
          v-model="title"
          placeholder="Enter an engaging quiz title..."
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="quiz-subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            id="quiz-subject"
            v-model="subject"
            placeholder="e.g., Mathematics, Science, History"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          />
        </div>
        <div>
          <label for="quiz-tags" class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            id="quiz-tags"
            v-model="tags"
            placeholder="concepts, practice, exam-prep"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          />
        </div>
      </div>

      <div>
        <label for="difficulty-level" class="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
        <div id="difficulty-level" class="flex gap-3" role="radiogroup" aria-labelledby="difficulty-level">
          <button
            v-for="diff in difficultyOptions"
            :key="diff.value"
            @click="difficulty = diff.value"
            :class="[
              'px-4 py-2.5 rounded-lg font-medium border transition-all duration-150 flex items-center gap-2',
              difficulty === diff.value
                ? diff.activeClass + ' transform scale-105'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            ]"
          >
            <span>{{ diff.emoji }}</span>
            <span class="capitalize">{{ diff.value }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Questions Section -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Questions</h3>
          <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {{ questions.length }} questions
          </span>
        </div>
        <button
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-150 font-medium shadow-sm flex items-center gap-2"
          @click="addQuestion"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Question
        </button>
      </div>

      <div class="space-y-6">
        <div v-for="(question, index) in questions" :key="question.id" class="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <!-- Question Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-medium">
                {{ index + 1 }}
              </span>
              <h4 class="text-lg font-medium text-gray-900">Question {{ index + 1 }}</h4>
            </div>
            <button
              v-if="questions.length > 1"
              @click="removeQuestion(question.id)"
              class="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-150 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Question Type -->
            <div>
              <label for="question-type" class="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                id="question-type"
                v-model="question.type"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 bg-white"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="open-ended">Open-ended</option>
              </select>
            </div>

            <!-- Question Content -->
            <div>
              <label for="question-text" class="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <textarea
                id="question-text"
                v-model="question.question"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 resize-none"
                rows="3"
                placeholder="Enter your question here..."
              ></textarea>
            </div>

            <!-- Multiple Choice Options -->
            <div v-if="question.type === 'multiple-choice'" class="space-y-4">
              <fieldset id="answer-options" class="space-y-3 border-0 p-0">
                <legend class="block text-base font-semibold text-gray-700 mb-2">Answer Options</legend>
                <div v-for="(option, i) in question.options" :key="i" class="flex items-center gap-4">
                  <span class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-medium text-gray-700">
                    {{ String.fromCharCode(65 + i) }}
                  </span>
                  <input
                    v-model="question.options[i]"
                    class="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                    :placeholder="'Option ' + String.fromCharCode(65 + i)"
                  />
                  <div class="flex items-center">
                    <input
                      type="radio"
                      :id="'correct-' + question.id + '-' + i"
                      :name="'correct-' + question.id"
                      :value="String.fromCharCode(65 + i)"
                      v-model="question.correctAnswer"
                      class="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500"
                    >
                    <label :for="'correct-' + question.id + '-' + i" class="ml-3 text-lg font-medium text-gray-700">
                      Correct
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <!-- Remove the separate Correct Answer section since it's now integrated with options -->
            <div v-if="question.type !== 'multiple-choice'">
              <label for="correct-answer" class="block text-sm font-medium text-gray-700 mb-2">Answer</label>

              <select
                v-if="question.type === 'true-false'"
                v-model="question.correctAnswer"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 bg-white"
              >
                <option value="">Select answer...</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              <textarea
                v-else
                v-model="question.correctAnswer"
                rows="3"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 resize-none"
                placeholder="Enter the correct answer or explanation..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="questions.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
        <p class="text-gray-600 mb-4">Start building your quiz by adding your first question.</p>
        <button
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-150 font-medium shadow-sm flex items-center gap-2 mx-auto"
          @click="addQuestion"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create First Question
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizContent {
  title: string;
  subject: string;
  tags: string[];
  difficulty: string;
  questions: Question[];
}

const router = useRouter()
const quizStore = useQuizStore()

const props = defineProps<{ editingContent?: QuizContent }>()

const title = ref(props.editingContent?.title || '')
const subject = ref(props.editingContent?.subject || '')
const tags = ref(props.editingContent?.tags?.join(', ') || '')
const difficulty = ref(props.editingContent?.difficulty || 'easy')
const questions = ref<Question[]>(
  props.editingContent?.questions?.map((q) => ({
    ...q,
    options: q.options || ['', '', '', ''],
    correctAnswer: q.type === 'multiple-choice' ? (Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer) : q.correctAnswer
  })) || [
    {
      id: '1',
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]
)

const difficultyOptions = [
  {
    value: 'easy',
    emoji: '🟢',
    activeClass: 'border-green-500 bg-green-50 text-green-700'
  },
  {
    value: 'medium',
    emoji: '🟡',
    activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700'
  },
  {
    value: 'hard',
    emoji: '🔴',
    activeClass: 'border-red-500 bg-red-50 text-red-700'
  }
]

const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function addQuestion() {
  questions.value.push({
    id: Date.now().toString(),
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  })
}

function removeQuestion(id: string) {
  questions.value = questions.value.filter(q => q.id !== id)
}

function onBack() {
  router.push('/MyContentView')
}

async function handleSave() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!title.value.trim()) {
    errorMessage.value = 'Please enter a quiz title'
    return
  }

  if (questions.value.length === 0) {
    errorMessage.value = 'Please add at least one question'
    return
  }

  for (let i = 0; i < questions.value.length; i++) {
    const q = questions.value[i]
    if (!q.question.trim()) {
      errorMessage.value = `Question ${i + 1} cannot be empty`
      return
    }
    if (q.type === 'multiple-choice') {
      const filled = q.options.filter(o => o.trim())
      if (filled.length < 2) {
        errorMessage.value = `Question ${i + 1} must have at least 2 answer choices`
        return
      }
    }
    if (!q.correctAnswer) {
      errorMessage.value = `Please select a correct answer for question ${i + 1}`
      return
    }
  }

  isSaving.value = true
  const quizPayload = {
    title: title.value,
    questions: questions.value.map(q => ({
      questionText: q.question,
      type: (q.type === 'multiple-choice'
        ? 'MULTIPLE_CHOICE'
        : q.type === 'true-false'
          ? 'TRUE_FALSE'
          : 'OPEN_ENDED') as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED',
      choices: q.type === 'multiple-choice' ? q.options : undefined,
      correctAnswer: q.correctAnswer,
      subject: subject.value,
      difficulty: difficulty.value,
      tags: tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
    })),
  }
  try {
    await quizStore.createQuiz(quizPayload)
    successMessage.value = 'Quiz saved successfully!'
    setTimeout(() => {
      onBack()
    }, 1000)
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to save quiz'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* Focus states */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}

/* Custom scrollbar for textareas */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
