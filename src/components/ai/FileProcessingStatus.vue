<script setup lang="ts">
interface Props {
  progress: number
  isGenerating: boolean
}

defineProps<Props>()

const getProgressMessage = (progress: number) => {
  if (progress < 20) return 'Analyzing files...'
  if (progress < 40) return 'Processing content...'
  if (progress < 60) return 'Generating content...'
  if (progress < 80) return 'Refining results...'
  return 'Almost done...'
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return 'from-blue-500 to-indigo-600'
  if (progress < 60) return 'from-yellow-500 to-orange-600'
  if (progress < 90) return 'from-purple-500 to-pink-600'
  return 'from-green-500 to-emerald-600'
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[400px]">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Generating Content</h2>
        <p class="text-gray-500">Please wait while AI is processing...</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm font-medium text-gray-900">{{ Math.round(progress) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="h-3 rounded-full transition-all duration-500 ease-out"
            :class="`bg-gradient-to-r ${getProgressColor(progress)}`"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Status Message -->
      <div class="text-center mb-6">
        <p class="text-gray-600 font-medium">{{ getProgressMessage(progress) }}</p>
      </div>

      <!-- Processing Steps -->
      <div class="space-y-3">
        <div
          class="flex items-center gap-3 p-3 rounded-lg transition-colors"
          :class="progress >= 10 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
            :class="progress >= 10 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="progress >= 10" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>1</span>
          </div>
          <span
            class="text-sm"
            :class="progress >= 10 ? 'text-green-700 font-medium' : 'text-gray-600'"
          >
            Upload Files
          </span>
        </div>

        <div
          class="flex items-center gap-3 p-3 rounded-lg transition-colors"
          :class="progress >= 30 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
            :class="progress >= 30 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="progress >= 30" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>2</span>
          </div>
          <span
            class="text-sm"
            :class="progress >= 30 ? 'text-green-700 font-medium' : 'text-gray-600'"
          >
            Analyze Content
          </span>
        </div>

        <div
          class="flex items-center gap-3 p-3 rounded-lg transition-colors"
          :class="progress >= 60 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
            :class="progress >= 60 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="progress >= 60" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>3</span>
          </div>
          <span
            class="text-sm"
            :class="progress >= 60 ? 'text-green-700 font-medium' : 'text-gray-600'"
          >
            Generate Content
          </span>
        </div>

        <div
          class="flex items-center gap-3 p-3 rounded-lg transition-colors"
          :class="progress >= 90 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
            :class="progress >= 90 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
          >
            <svg v-if="progress >= 90" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>4</span>
          </div>
          <span
            class="text-sm"
            :class="progress >= 90 ? 'text-green-700 font-medium' : 'text-gray-600'"
          >
            Refine Results
          </span>
        </div>
      </div>

      <!-- Tips -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <div class="flex items-start gap-3">
          <div
            class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          >
            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-medium text-blue-900">Tips</h4>
            <p class="text-xs text-blue-700 mt-1">
              While AI is working, you can prepare additional prompts or adjust settings
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animation for progress bar */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
