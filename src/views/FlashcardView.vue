<script setup lang="ts">
import { ref } from 'vue'

const flashcards = ref([
  {
    id: 1,
    question: 'What is Photosynthesis?',
    answer:
      'The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.',
    subject: 'Biology',
  },
  {
    id: 2,
    question: 'What is the formula for the area of a circle?',
    answer: 'A = πr²',
    subject: 'Mathematics',
  },
  { id: 3, question: 'What year did World War II end?', answer: '1945', subject: 'History' },
])
</script>

<template>
  <main class="p-6 bg-gray-100 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Flashcards & Quizzes</h1>
      <p class="text-gray-600 mt-2">Create and study flashcards to improve your learning.</p>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">My Flashcards</h2>
        <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Create New Deck
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="card in flashcards"
          :key="card.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-medium text-lg">{{ card.question }}</h3>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{{
              card.subject
            }}</span>
          </div>
          <p class="text-gray-600">{{ card.answer }}</p>
          <div class="flex justify-end mt-4">
            <button class="text-purple-600 hover:text-purple-800 mr-3">Edit</button>
            <button class="text-red-600 hover:text-red-800">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Study Sessions</h2>
        <button
          class="border border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
        >
          Start New Session
        </button>
      </div>

      <p class="text-gray-500">No recent study sessions. Start a new session to begin studying!</p>
    </div>
  </main>
</template>
