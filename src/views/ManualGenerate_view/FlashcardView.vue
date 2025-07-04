<template>
  <div class="max-w-5xl mx-auto space-y-6 p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Flashcard Deck' : 'Create New Flashcard Deck' }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ isEditing ? 'Update your flashcard deck' : 'Build your personalized study deck' }}
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
          :disabled="isLoading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span v-if="!isLoading">Save Deck</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
    >
      {{ successMessage }}
    </div>

    <!-- Deck Details -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <div
          class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Deck Information</h3>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Deck Title</label>
        <input
          v-model="title"
          placeholder="Enter an engaging title for your deck..."
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            v-model="subject"
            placeholder="e.g., Mathematics, Biology, History"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            v-model="tags"
            placeholder="algebra, equations, formulas"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
        <div class="flex gap-3">
          <button
            v-for="diff in difficultyOptions"
            :key="diff.value"
            @click="difficulty = diff.value"
            :class="[
              'px-4 py-2.5 rounded-lg font-medium border transition-all duration-150 flex items-center gap-2',
              difficulty === diff.value
                ? diff.activeClass + ' transform scale-105'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700',
            ]"
          >
            <span>{{ diff.emoji }}</span>
            <span class="capitalize">{{ diff.value }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Flashcards Section -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Flashcards</h3>
          <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {{ cards.length }} cards
          </span>
        </div>
        <button
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-150 font-medium shadow-sm flex items-center gap-2"
          @click="addCard"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Card
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="(card, index) in cards" :key="card.id" class="space-y-3">
          <!-- Card Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-900">Card {{ index + 1 }}</span>
              <button
                @click="flipCard(card.id)"
                :class="[
                  'text-xs px-2 py-1 rounded-md border transition-all duration-150 flex items-center gap-1',
                  flippedCards.has(card.id)
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
                ]"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Flip
              </button>
            </div>
            <button
              v-if="cards.length > 1"
              @click="removeCard(card.id)"
              class="text-xs px-2 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors duration-150 flex items-center gap-1"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>

          <!-- Card Content -->
          <div class="space-y-3">
            <div class="border border-gray-200 rounded-lg p-4 bg-white">
              <label class="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide"
                >Front Side</label
              >
              <textarea
                v-model="card.front"
                placeholder="Enter the question or prompt..."
                class="w-full px-0 py-0 border-0 resize-none focus:ring-0 placeholder-gray-400 text-gray-900"
                rows="3"
              ></textarea>
            </div>
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label class="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide"
                >Back Side</label
              >
              <textarea
                v-model="card.back"
                placeholder="Enter the answer or explanation..."
                class="w-full px-0 py-0 border-0 resize-none focus:ring-0 placeholder-gray-400 text-gray-900 bg-transparent"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Card Button (if no cards or bottom) -->
      <div v-if="cards.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
        <p class="text-gray-600 mb-4">
          Start building your flashcard deck by adding your first card.
        </p>
        <button
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-150 font-medium shadow-sm flex items-center gap-2 mx-auto"
          @click="addCard"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create First Card
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createFlashcardDeck } from '@/service/FlashcardService'

interface Flashcard {
  id: string
  front: string
  back: string
}

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const props = defineProps<{ onBack?: () => void; editingContent?: any }>()

const isEditing = computed(() => !!props.editingContent)
const title = ref(props.editingContent?.title || '')
const subject = ref(props.editingContent?.subject || '')
const tags = ref(props.editingContent?.tags?.join(', ') || '')
const difficulty = ref(props.editingContent?.difficulty || 'easy')
const cards = ref<Flashcard[]>(
  props.editingContent?.cards || [{ id: Date.now().toString(), front: '', back: '' }],
)
const flippedCards = ref<Set<string>>(new Set())

const difficultyOptions = [
  {
    value: 'easy',
    emoji: '🟢',
    activeClass: 'border-green-500 bg-green-50 text-green-700',
  },
  {
    value: 'medium',
    emoji: '🟡',
    activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700',
  },
  {
    value: 'hard',
    emoji: '🔴',
    activeClass: 'border-red-500 bg-red-50 text-red-700',
  },
]

const addCard = () => {
  cards.value.push({ id: Date.now().toString(), front: '', back: '' })
}

const removeCard = (id: string) => {
  cards.value = cards.value.filter((card) => card.id !== id)
  flippedCards.value.delete(id)
}

const flipCard = (id: string) => {
  if (flippedCards.value.has(id)) flippedCards.value.delete(id)
  else flippedCards.value.add(id)
}

const handleSave = async () => {
  if (!title.value.trim()) {
    errorMessage.value = 'Please enter a deck title'
    return
  }

  const validCards = cards.value.filter((card) => card.front.trim() && card.back.trim())
  if (validCards.length === 0) {
    errorMessage.value = 'Please add at least one complete flashcard'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const flashcardDeck = {
      title: title.value,
      subject: subject.value,
      tags: tags.value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      difficulty: difficulty.value,
      cards: validCards,
    }

    await createFlashcardDeck(flashcardDeck)
    successMessage.value = 'Flashcard deck saved successfully!'

    setTimeout(() => {
      router.push('/MyContentView')
    }, 1000)
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Failed to save flashcard deck'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const onBack = () => {
  if (props.onBack) {
    props.onBack()
  } else {
    router.push('/MyContentView')
  }
}
</script>

<style scoped>
/* Focus states */
input:focus,
textarea:focus {
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
