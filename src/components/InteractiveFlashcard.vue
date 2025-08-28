<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Flashcard {
  id: number
  front: string
  back: string
  category?: string
}

interface Props {
  content: string
}

const props = defineProps<Props>()

// Flashcard state
const flashcards = ref<Flashcard[]>([])
const currentCardIndex = ref(0)
const isFlipped = ref(false)
const studyMode = ref<'learn' | 'review' | 'test'>('learn')
const showAnswer = ref(false)
const userAnswer = ref('')
const correctAnswers = ref(0)
const totalAnswered = ref(0)
const studySession = ref(false)

// Parse content to extract flashcards
const parseFlashcards = (content: string) => {
  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(content)

    // Check if new API format (with metadata) or current API format
    const isNewFormat = !!(jsonData.metadata && jsonData.content)

    if (isNewFormat) {
      // New API format: structured flashcard object
      const contentData = jsonData.content as Record<string, unknown>
      if (contentData.cards && Array.isArray(contentData.cards)) {
        return parseJsonFlashcards({ cards: contentData.cards })
      }
    } else {
      // Current API format: { flashcards: [{ question, answer }] }
      if (jsonData.flashcards && Array.isArray(jsonData.flashcards)) {
        return parseJsonFlashcards({ cards: jsonData.flashcards })
      }

      // Legacy format: { cards: [...] }
      if (jsonData.cards && Array.isArray(jsonData.cards)) {
        return parseJsonFlashcards(jsonData)
      }
    }
  } catch {
    // Not JSON, continue with text parsing
    console.log('Not JSON, parsing as text')
  }

  // Original text parsing logic
  const lines = content.split('\n')
  const parsedCards: Flashcard[] = []
  let currentCard: Partial<Flashcard> = {}
  let cardId = 1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.includes('Front:') || line.includes('Question:')) {
      // Save previous card if exists
      if (currentCard.front && currentCard.back) {
        parsedCards.push({
          id: cardId++,
          front: currentCard.front,
          back: currentCard.back,
          category: currentCard.category
        } as Flashcard)
      }

      // Start new card
      currentCard = {
        front: line.replace(/^(Front|Question):\s*/, ''),
        back: ''
      }
    } else if (line.includes('Back:') || line.includes('Answer:')) {
      currentCard.back = line.replace(/^(Back|Answer):\s*/, '')
    } else if (line.includes('Category:')) {
      currentCard.category = line.replace(/^Category:\s*/, '')
    }
  }

  // Add last card
  if (currentCard.front && currentCard.back) {
    parsedCards.push({
      id: cardId,
      front: currentCard.front,
      back: currentCard.back,
      category: currentCard.category
    } as Flashcard)
  }

  return parsedCards
}

// Parse JSON flashcard content
const parseJsonFlashcards = (jsonData: Record<string, unknown>): Flashcard[] => {
  const parsedCards: Flashcard[] = []

  if (jsonData.cards && Array.isArray(jsonData.cards)) {
    jsonData.cards.forEach((card: Record<string, unknown>, index: number) => {
      const flashcard: Flashcard = {
        id: card.id || index + 1,
        front: '',
        back: '',
        category: card.category
      }

      // Handle different card formats
      if (card.front && card.back) {
        // Standard front/back format
        flashcard.front = typeof card.front === 'string' ? card.front : card.front.text || ''
        flashcard.back = typeof card.back === 'string' ? card.back : card.back.text || ''
      } else if (card.question && card.answer) {
        // Question/answer format
        flashcard.front = card.question
        flashcard.back = card.answer
      }

      if (flashcard.front && flashcard.back) {
        parsedCards.push(flashcard)
      }
    })
  }

  return parsedCards
}

// Computed properties
const currentCard = computed(() => flashcards.value[currentCardIndex.value])
const totalCards = computed(() => flashcards.value.length)
const progress = computed(() => ((currentCardIndex.value + 1) / totalCards.value) * 100)
const isLastCard = computed(() => currentCardIndex.value === totalCards.value - 1)
const score = computed(() => totalAnswered.value > 0 ? Math.round((correctAnswers.value / totalAnswered.value) * 100) : 0)

// Methods
const startStudySession = (mode: 'learn' | 'review' | 'test') => {
  studyMode.value = mode
  studySession.value = true
  currentCardIndex.value = 0
  isFlipped.value = false
  showAnswer.value = false
  userAnswer.value = ''
  correctAnswers.value = 0
  totalAnswered.value = 0
}

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const nextCard = () => {
  if (currentCardIndex.value < totalCards.value - 1) {
    currentCardIndex.value++
    isFlipped.value = false
    showAnswer.value = false
    userAnswer.value = ''
  } else {
    // End of session
    studySession.value = false
  }
}

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
    isFlipped.value = false
    showAnswer.value = false
    userAnswer.value = ''
  }
}

const checkAnswer = () => {
  if (userAnswer.value.trim().toLowerCase() === currentCard.value.back.toLowerCase()) {
    correctAnswers.value++
  }
  totalAnswered.value++
  showAnswer.value = true
}

const markAsCorrect = () => {
  correctAnswers.value++
  totalAnswered.value++
  nextCard()
}

const markAsIncorrect = () => {
  totalAnswered.value++
  nextCard()
}

const restartSession = () => {
  studySession.value = false
  currentCardIndex.value = 0
  isFlipped.value = false
  showAnswer.value = false
  userAnswer.value = ''
  correctAnswers.value = 0
  totalAnswered.value = 0
}

onMounted(() => {
  flashcards.value = parseFlashcards(props.content)
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Study Mode Selection -->
    <div v-if="!studySession" class="text-center py-12">
      <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-4">Flashcard Study</h2>
      <p class="text-slate-600 mb-8">Choose your study mode for {{ totalCards }} flashcards</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <button
          @click="startStudySession('learn')"
          class="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
        >
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-2">Learn</h3>
          <p class="text-sm text-slate-600">Flip cards to learn new concepts</p>
        </button>

        <button
          @click="startStudySession('review')"
          class="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
        >
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-2">Review</h3>
          <p class="text-sm text-slate-600">Practice with self-assessment</p>
        </button>

        <button
          @click="startStudySession('test')"
          class="p-6 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
        >
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-2">Test</h3>
          <p class="text-sm text-slate-600">Test your knowledge</p>
        </button>
      </div>
    </div>

    <!-- Study Session -->
    <div v-else class="space-y-6">
      <!-- Progress Bar -->
      <div class="bg-slate-200 rounded-full h-2">
        <div
          class="bg-purple-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="text-sm text-slate-500 text-center">
        Card {{ currentCardIndex + 1 }} of {{ totalCards }}
        <span v-if="studyMode === 'test'" class="ml-4">
          Score: {{ correctAnswers }}/{{ totalAnswered }} ({{ score }}%)
        </span>
      </div>

      <!-- Flashcard -->
      <div class="flex justify-center">
        <div
          @click="flipCard"
          class="w-full max-w-md h-64 cursor-pointer perspective-1000"
        >
          <div
            class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
            :class="{ 'rotate-y-180': isFlipped }"
          >
            <!-- Front of card -->
            <div class="absolute inset-0 w-full h-full backface-hidden">
              <div class="w-full h-full bg-white border-2 border-slate-300 rounded-lg p-6 flex items-center justify-center shadow-lg">
                <div class="text-center">
                  <div class="text-sm text-slate-500 mb-2">Question</div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ currentCard.front }}</h3>
                  <div class="mt-4 text-xs text-slate-400">Click to flip</div>
                </div>
              </div>
            </div>

            <!-- Back of card -->
            <div class="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div class="w-full h-full bg-purple-50 border-2 border-purple-300 rounded-lg p-6 flex items-center justify-center shadow-lg">
                <div class="text-center">
                  <div class="text-sm text-purple-600 mb-2">Answer</div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ currentCard.back }}</h3>
                  <div class="mt-4 text-xs text-slate-400">Click to flip back</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Mode Input -->
      <div v-if="studyMode === 'test' && !isFlipped" class="max-w-md mx-auto">
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-700 mb-2">Your Answer:</label>
          <input
            v-model="userAnswer"
            type="text"
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type your answer..."
            @keyup.enter="checkAnswer"
          />
        </div>
        <button
          @click="checkAnswer"
          :disabled="!userAnswer.trim()"
          class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      </div>

      <!-- Answer Result -->
      <div v-if="showAnswer && studyMode === 'test'" class="max-w-md mx-auto text-center">
        <div
          :class="
            userAnswer.trim().toLowerCase() === currentCard.back.toLowerCase()
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-red-100 border-red-300 text-red-800'
          "
          class="p-4 border-2 rounded-lg mb-4"
        >
          <div class="font-semibold mb-2">
            {{ userAnswer.trim().toLowerCase() === currentCard.back.toLowerCase() ? 'Correct!' : 'Incorrect' }}
          </div>
          <div class="text-sm">
            <div>Your answer: {{ userAnswer }}</div>
            <div>Correct answer: {{ currentCard.back }}</div>
          </div>
        </div>
      </div>

      <!-- Review Mode Buttons -->
      <div v-if="studyMode === 'review' && isFlipped" class="flex justify-center gap-4">
        <button
          @click="markAsIncorrect"
          class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Incorrect
        </button>
        <button
          @click="markAsCorrect"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Correct
        </button>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between max-w-md mx-auto">
        <button
          @click="previousCard"
          :disabled="currentCardIndex === 0"
          class="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          v-if="studyMode === 'learn'"
          @click="nextCard"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {{ isLastCard ? 'Finish' : 'Next' }}
        </button>
        <button
          v-else-if="studyMode === 'test' && showAnswer"
          @click="nextCard"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {{ isLastCard ? 'Finish' : 'Next' }}
        </button>
      </div>
    </div>

    <!-- Session Complete -->
    <div v-if="studySession && currentCardIndex >= totalCards" class="text-center py-12">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 mb-4">Study Session Complete!</h2>

      <div v-if="studyMode === 'test'" class="mb-6">
        <div class="text-4xl font-bold text-purple-600 mb-2">{{ score }}%</div>
        <p class="text-slate-600">
          You got {{ correctAnswers }} out of {{ totalAnswered }} correct
        </p>
      </div>

      <button
        @click="restartSession"
        class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Start New Session
      </button>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
