<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          @click="onBack"
          class="group flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <!-- Header Section -->
      <div class="mb-8">
        <div class="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 text-white shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>

          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white ring-opacity-30 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-1">
                  {{ isEditing ? 'Edit Flashcard Deck' : 'Create New Flashcard Deck' }}
                </h1>
                <p class="text-purple-100">
                  {{ isEditing ? 'Update your flashcard deck' : 'Build your personalized study deck' }}
                </p>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="flex items-center justify-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Manual Creation</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-green-600 shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-white hidden sm:inline">Flashcards Selected</span>
                </div>
                <div class="mx-2 w-8 sm:w-12 h-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white text-purple-600 shadow-md">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span class="text-sm font-semibold text-white hidden sm:inline">Create Deck</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button
            class="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            @click="onBack"
          >
            Cancel
          </button>
          <button
            :class="[
              'px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-md flex items-center gap-2',
              isSaveDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white hover:shadow-lg transform hover:scale-105'
            ]"
            @click="handleSave"
            :disabled="isSaveDisabled"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Error/Success Messages -->
        <div v-if="warningMessage" class="bg-amber-50 border-2 border-amber-200 text-amber-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ warningMessage }}</span>
        </div>
        <div v-if="errorMessage" class="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-xl shadow-md flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Deck Details -->
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Flashcard Configuration</h2>
          </div>

          <!-- Deck Information -->
          <div class="space-y-6">
            <div>
              <label class="block text-base font-semibold text-gray-800 mb-4">Deck Information</label>

              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Deck Title</label>
                  <input
                    v-model="title"
                    placeholder="Enter an engaging title for your deck..."
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      v-model="subject"
                      placeholder="e.g., Mathematics, Biology, History"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      v-model="tags"
                      placeholder="algebra, equations, formulas"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
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
                        'px-5 py-3 rounded-xl font-medium border-2 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md',
                        difficulty === diff.value
                          ? diff.activeClass + ' transform scale-105 shadow-md'
                          : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
                      ]"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="diff.value === 'easy'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path v-else-if="diff.value === 'medium'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="capitalize">{{ diff.value }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Flashcards Section -->
        <div class="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-200">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Flashcards</h3>
              </div>
              <span class="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                {{ cards.length }} cards
              </span>
            </div>
            <button
              class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
              @click="addCard"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div v-for="(card, index) in cards" :key="card.id" class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-md hover:shadow-xl transition-all duration-200">
              <!-- Card Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                    Card {{ index + 1 }}
                  </span>
                </div>
                <button
                  v-if="cards.length > 1"
                  @click="removeCard(card.id)"
                  class="px-3 py-1.5 text-red-600 hover:bg-red-50 border-2 border-red-300 rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium hover:shadow-md"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div class="space-y-4">
                <div class="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <label class="flex items-center gap-2 text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Front Side
                  </label>
                  <textarea
                    v-model="card.front"
                    placeholder="Enter the question or prompt..."
                    class="w-full px-0 py-0 border-0 resize-none focus:ring-0 placeholder-gray-400 text-gray-900 bg-transparent"
                    rows="3"
                  ></textarea>
                </div>
                <div class="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                  <label class="flex items-center gap-2 text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Back Side
                  </label>
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
          <div v-if="cards.length === 0" class="text-center py-16">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No cards yet</h3>
            <p class="text-gray-600 mb-6 text-lg">
              Start building your flashcard deck by adding your first card.
            </p>
            <button
              class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto transform hover:scale-105"
              @click="addCard"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ManualContentService from '@/service/ManualContentService'




import { ensureAuthenticated, handleAuthError, logAuthStatus } from '@/utils/authHelper'

interface Flashcard {
  id: string
  front: string
  back: string
}

const router = useRouter()
// const authStore = useAuthStore() // Replaced by authHelper
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// ตรวจสอบว่าข้อมูล deck information ไม่ครบถ้วน
const isDeckInfoIncomplete = computed(() => {
  return !title.value.trim() || !subject.value.trim() || !tags.value.trim()
})

// ตรวจสอบว่าไม่มีการ์ดเลยหรือการ์ดทั้งหมดว่างเปล่า
const hasNoOrEmptyCards = computed(() => {
  return cards.value.length === 0 || cards.value.every(card => !card.front.trim() && !card.back.trim())
})

// ตรวจสอบว่ามี flashcard ที่กรอกข้อมูลไม่สมบูรณ์หรือไม่ (กรอกแค่ front หรือ back)
const hasIncompleteCards = computed(() => {
  return cards.value.some(card => {
    const hasFront = card.front.trim().length > 0
    const hasBack = card.back.trim().length > 0
    // ถ้ากรอกแค่ front side หรือแค่ back side (ไม่ครบทั้งสองฝั่ง) ถือว่าไม่สมบูรณ์
    return (hasFront && !hasBack) || (!hasFront && hasBack)
  })
})

// ตรวจสอบว่าควร disable ปุ่ม Save หรือไม่
const isSaveDisabled = computed(() => {
  return isLoading.value || isDeckInfoIncomplete.value || hasNoOrEmptyCards.value || hasIncompleteCards.value
})

// ข้อความเตือนที่เหมาะสมตามลำดับความสำคัญ
const warningMessage = computed(() => {
  if (isDeckInfoIncomplete.value) {
    return 'Please fill in all deck information fields (Title, Subject, Tags).'
  }
  if (hasNoOrEmptyCards.value) {
    return 'Please add at least one complete flashcard or fill in existing ones.'
  }
  if (hasIncompleteCards.value) {
    return 'Please complete all fields: Some cards have only Front Side or Back Side. Please fill both sides or delete unwanted cards.'
  }
  return ''
})

interface EditingContent {
  title?: string;
  subject?: string;
  tags?: string[];
  difficulty?: string;
  cards?: Flashcard[];
}

const props = defineProps<{ onBack?: () => void; editingContent?: EditingContent }>()

const isEditing = computed(() => !!props.editingContent)
const title = ref(props.editingContent?.title || '')
const subject = ref(props.editingContent?.subject || '')
const tags = ref(props.editingContent?.tags?.join(', ') || '')
const difficulty = ref(props.editingContent?.difficulty || 'easy')
const cards = ref<Flashcard[]>(
  props.editingContent?.cards || [{ id: Date.now().toString(), front: '', back: '' }],
)
// const flippedCards = ref<Set<string>>(new Set())

const difficultyOptions = [
  {
    value: 'easy',
    activeClass: 'border-green-500 bg-green-50 text-green-700',
  },
  {
    value: 'medium',
    activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700',
  },
  {
    value: 'hard',
    activeClass: 'border-red-500 bg-red-50 text-red-700',
  },
]

const addCard = () => {
  cards.value.push({ id: Date.now().toString(), front: '', back: '' })
}

const removeCard = (id: string) => {
  cards.value = cards.value.filter((card) => card.id !== id)
  // flippedCards.value.delete(id)
}

// const flipCard = (id: string) => {
//   if (flippedCards.value.has(id)) flippedCards.value.delete(id)
//   else flippedCards.value.add(id)
// }

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

  // Debug information
  console.log('🔍 Flashcard Creation Debug:')
  console.log('📡 Backend URL:', import.meta.env.VITE_BACKEND_URL)
  console.log('📦 Flashcard Deck:', { title: title.value, cardCount: validCards.length })
  logAuthStatus()

  try {
    // Enhanced authentication check
    if (!(await ensureAuthenticated())) {
      errorMessage.value = 'Please log in to create flashcard deck'
      return
    }

    console.log('📝 Creating flashcard deck with JSON API...')

    // Convert to JSON format
    const flashcardData = {
      type: "flashcard",
      topic: title.value,
      flashcards: validCards.map(card => ({
        question: card.front,
        answer: card.back
      }))
    }

    const requestData = {
      contentTitle: title.value,
      contentType: "flashcard" as const,
      contentData: JSON.stringify(flashcardData),
      subject: subject.value || "General",
      difficulty: difficulty.value,
      tags: tags.value
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag)
    }

    await ManualContentService.createContent(requestData)
    console.log('✅ Flashcard deck created successfully via JSON API')

    successMessage.value = 'Flashcard deck saved successfully!'

    setTimeout(() => {
      router.push('/create-content')
    }, 1000)
  } catch (error: unknown) {
    console.error('❌ Flashcard Creation Error Details:', error)

    // Use enhanced error handling
    handleAuthError(error, 'Flashcard deck creation')

    // Set user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes('Authentication')) {
        errorMessage.value = error.message
      } else if (error.message.includes('Server error')) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = error.message
      }
    } else {
      errorMessage.value = 'Failed to save flashcard deck. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const onBack = () => {
  if (props.onBack) {
    props.onBack()
  } else {
    router.push('/create-content')
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
