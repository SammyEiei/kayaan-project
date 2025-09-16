<template>
  <!-- Collapsed Icon State -->
  <div v-if="!isExpanded" class="fixed bottom-4 right-4 z-40">
    <button
      @click="toggleExpanded"
      class="bg-white hover:bg-slate-50 shadow-lg border border-slate-200 rounded-lg p-3 transition-all duration-200 hover:scale-105"
      :class="{ 'ring-2 ring-blue-500 bg-blue-50': isRunning || isPaused }"
    >
      <!-- Timer Icon with Status -->
      <div class="relative">
        <svg class="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <!-- Running Indicator -->
        <div v-if="isRunning" class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <!-- Paused Indicator -->
        <div v-else-if="isPaused" class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
      </div>
    </button>

    <!-- Time Display on Hover -->
    <div class="absolute bottom-full right-0 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {{ formattedTime }} - {{ modeLabel }}
    </div>
  </div>

  <!-- Expanded Widget State -->
  <div v-else class="fixed bottom-4 right-4 bg-white border border-slate-200 text-slate-800 shadow-xl rounded-lg p-6 flex flex-col items-center space-y-4 z-40 min-w-[240px]">
    <!-- Header with Close Button -->
    <div class="flex items-center justify-between w-full mb-2">
      <div class="text-sm font-medium text-slate-600">{{ modeLabel }}</div>
      <button
        @click="toggleExpanded"
        class="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Timer Display -->
    <div class="text-3xl font-bold text-slate-900 mb-2">{{ formattedTime }}</div>

    <!-- Control Buttons -->
    <div class="flex gap-3 w-full">
      <button
        @click="toggleTimer"
        class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
      >
        {{ buttonText }}
      </button>
      <button
        @click="resetTimer"
        class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Skip Button -->
    <button
      v-if="isRunning || isPaused"
      @click="skip"
      class="text-xs text-slate-500 hover:text-slate-700 hover:underline transition-colors"
    >
      Skip Session
    </button>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-200 rounded-full h-2">
      <div
        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'

const pomodoro = usePomodoroStore()

// Collapsible state
const isExpanded = ref(false)

const formattedTime = computed(() => pomodoro.formattedTime)
const isRunning = computed(() => pomodoro.isRunning)
const isPaused = computed(() => pomodoro.isPaused)
const mode = computed(() => pomodoro.mode)
const timeLeft = computed(() => pomodoro.timeLeft)
const durations = computed(() => pomodoro.durations)

const buttonText = computed(() => {
  if (isRunning.value) return 'Pause'
  if (isPaused.value) return 'Resume'
  return 'Start'
})

const modeLabel = computed(() => {
  switch (mode.value) {
    case 'shortBreak':
      return 'Short Break'
    case 'longBreak':
      return 'Long Break'
    default:
      return 'Focus'
  }
})

const progressPercentage = computed(() => {
  const totalTime = durations.value[mode.value]
  if (totalTime === 0) return 0
  return ((totalTime - timeLeft.value) / totalTime) * 100
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function toggleTimer() {
  pomodoro.toggleTimer()
}

function resetTimer() {
  pomodoro.resetTimer()
}

function skip() {
  pomodoro.skipSession()
}

</script>

<style scoped>
</style>
