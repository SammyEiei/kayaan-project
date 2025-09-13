<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
      <h2 class="text-xl font-semibold text-slate-900 mb-6">Joining Study Group</h2>

      <!-- Pink Kayaan Cute Loading Animation -->
      <div class="relative mb-8">
        <!-- Main Pink Kayaan Character -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <!-- Pink Kayaan Avatar with Pulse -->
            <div class="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center shadow-lg animate-pink-pulse">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <!-- Pink Kayaan Face -->
                <div class="relative">
                  <!-- Eyes -->
                  <div class="flex gap-2 mb-1">
                    <div class="w-2 h-2 bg-pink-600 rounded-full animate-pink-blink"></div>
                    <div class="w-2 h-2 bg-pink-600 rounded-full animate-pink-blink"></div>
                  </div>
                  <!-- Smile -->
                  <div class="w-4 h-2 border-b-2 border-pink-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <!-- Floating Pink Particles Around Kayaan -->
            <div class="absolute inset-0">
              <div class="absolute top-2 right-2 w-2 h-2 bg-pink-200 rounded-full animate-pink-float-1"></div>
              <div class="absolute top-8 left-1 w-1.5 h-1.5 bg-rose-300 rounded-full animate-pink-float-2"></div>
              <div class="absolute bottom-4 right-6 w-1 h-1 bg-pink-400 rounded-full animate-pink-float-3"></div>
              <div class="absolute bottom-2 left-4 w-1.5 h-1.5 bg-rose-200 rounded-full animate-pink-float-1"></div>
            </div>
          </div>
        </div>

        <!-- Dynamic Joining Messages -->
        <div class="text-center space-y-3">
          <h3 class="text-lg font-semibold text-slate-800 animate-pink-fade-in" v-html="currentJoiningMessage">
          </h3>

          <!-- Progress Dots -->
          <div class="flex justify-center gap-1">
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-pink-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-pink-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-pink-400 rounded-full animate-pink-bounce" style="animation-delay: 0.2s"></div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full max-w-md mx-auto">
            <div class="bg-pink-100 rounded-full h-2 overflow-hidden">
              <div
                class="bg-gradient-to-r from-pink-400 to-rose-400 h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: joiningProgress + '%' }"
              ></div>
            </div>
            <p class="text-xs text-pink-600 mt-1">{{ Math.round(joiningProgress) }}% Complete</p>
          </div>

          <!-- Fun Joining Facts -->
          <div class="mt-4 p-3 bg-pink-50 rounded-lg max-w-md mx-auto">
            <p class="text-xs text-pink-700">
              <svg class="w-4 h-4 inline text-pink-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span class="font-medium">{{ currentFunFact }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Cancel Button -->
      <button
        @click="$emit('cancel')"
        class="px-6 py-3 text-pink-600 bg-white border border-pink-300 rounded-lg hover:bg-pink-50 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits<{
  cancel: []
}>()

// Joining Messages
const joiningMessages = [
  '<svg class="w-5 h-5 inline text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path></svg> Kayaan is connecting you...',
  '<svg class="w-5 h-5 inline text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg> Verifying invite code...',
  '<svg class="w-5 h-5 inline text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg> Setting up your membership...',
  '<svg class="w-5 h-5 inline text-rose-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg> Preparing your group access...',
  '<svg class="w-5 h-5 inline text-pink-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg> Finalizing your membership...',
  '<svg class="w-5 h-5 inline text-rose-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg> Almost there!'
]

// Fun Facts for Joining
const funFacts = [
  'Study groups can improve learning retention by up to 90%!',
  'Collaborative learning helps you understand concepts 2x faster.',
  'Group discussions activate different parts of your brain.',
  'You\'re about to join an amazing learning community!',
  'Sharing knowledge makes everyone smarter together.',
  'Group study sessions are more fun and effective!'
]

const currentJoiningMessage = ref(joiningMessages[0])
const currentFunFact = ref(funFacts[0])
const joiningProgress = ref(0)

let messageInterval: NodeJS.Timeout | null = null
let factInterval: NodeJS.Timeout | null = null
let progressInterval: NodeJS.Timeout | null = null

onMounted(() => {
  let messageIndex = 0
  let factIndex = 0

  // Cycle through joining messages
  messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % joiningMessages.length
    currentJoiningMessage.value = joiningMessages[messageIndex]
  }, 2000)

  // Cycle through fun facts
  factInterval = setInterval(() => {
    factIndex = (factIndex + 1) % funFacts.length
    currentFunFact.value = funFacts[factIndex]
  }, 3000)

  // Simulate progress over 3 seconds
  progressInterval = setInterval(() => {
    if (joiningProgress.value < 95) {
      joiningProgress.value += Math.random() * 8 + 2 // Slower, more realistic progress
    }
  }, 200)
})

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval)
  if (factInterval) clearInterval(factInterval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
/* Pink Kayaan Custom Animations */
@keyframes pink-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes pink-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  25% { transform: translate(10px, -15px) scale(1.1); opacity: 1; }
  50% { transform: translate(-5px, -25px) scale(0.9); opacity: 0.8; }
  75% { transform: translate(-10px, -10px) scale(1.05); opacity: 0.9; }
}

@keyframes pink-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  33% { transform: translate(-15px, -10px) scale(1.2); opacity: 1; }
  66% { transform: translate(5px, -20px) scale(0.8); opacity: 0.7; }
}

@keyframes pink-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  40% { transform: translate(8px, -18px) scale(1.15); opacity: 0.9; }
  80% { transform: translate(-12px, -8px) scale(0.85); opacity: 0.6; }
}

@keyframes pink-fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pink-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes pink-bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-pink-blink {
  animation: pink-blink 2s infinite;
}

.animate-pink-float-1 {
  animation: pink-float-1 4s ease-in-out infinite;
}

.animate-pink-float-2 {
  animation: pink-float-2 5s ease-in-out infinite;
}

.animate-pink-float-3 {
  animation: pink-float-3 3.5s ease-in-out infinite;
}

.animate-pink-fade-in {
  animation: pink-fade-in 0.8s ease-out;
}

.animate-pink-pulse {
  animation: pink-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pink-bounce {
  animation: pink-bounce 1s infinite;
}
</style>
