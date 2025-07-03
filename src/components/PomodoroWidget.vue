<template>
  <div class="fixed bottom-4 right-4 bg-white/90 text-gray-800 shadow-lg rounded-xl p-4 flex flex-col items-center space-y-2 z-50">
    <div class="text-sm font-medium text-gray-600">{{ modeLabel }}</div>

    <div class="text-lg font-semibold">{{ formattedTime }}</div>
    <div class="flex gap-2">
      <button @click="toggleTimer" class="px-3 py-1 bg-blue-500 text-white rounded">
        {{ buttonText }}
      </button>
      <button @click="resetTimer" class="px-3 py-1 bg-gray-200 rounded">Reset</button>
    </div>
    <button v-if="isRunning || isPaused" @click="skip" class="text-xs text-gray-500 hover:underline">
      Skip
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'

const pomodoro = usePomodoroStore()

const formattedTime = computed(() => pomodoro.formattedTime)
const isRunning = computed(() => pomodoro.isRunning)
const isPaused = computed(() => pomodoro.isPaused)
const mode = computed(() => pomodoro.mode)

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
