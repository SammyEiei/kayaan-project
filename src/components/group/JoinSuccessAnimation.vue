<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full mx-4">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <!-- Success Message -->
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
        <p class="text-gray-600 text-sm mb-6">{{ message }}</p>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div class="bg-blue-600 h-1.5 rounded-full animate-progress-bar"></div>
        </div>

        <!-- Loading Text -->
        <p class="text-gray-500 text-xs">Redirecting to group...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  message?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  message: 'You have successfully joined the study group!',
  duration: 3000
})

const emit = defineEmits<{
  complete: []
}>()

onMounted(() => {
  // Auto close after duration
  setTimeout(() => {
    emit('complete')
  }, props.duration)
})

// Prevent body scroll when animation is active
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
@keyframes progress-bar {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

.animate-progress-bar {
  animation: progress-bar 2.5s ease-out 0.5s;
}
</style>

