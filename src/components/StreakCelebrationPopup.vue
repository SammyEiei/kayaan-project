<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        @click="handleClose"
      >
        <!-- Confetti Container -->
        <div class="confetti-container">
          <div v-for="i in confettiCount" :key="i" class="confetti" :style="getConfettiStyle(i)" />
        </div>

        <!-- Popup Card - Duolingo Style -->
        <Transition
          enter-active-class="transition-all duration-700 ease-out-expo"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-400 ease-in-quad"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="show"
            class="celebration-card relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[2rem] shadow-2xl overflow-hidden max-w-md w-full p-8 animate-duolingo-popup"
            @click.stop
          >
            <!-- Decorative elements - More playful -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16 animate-float" />
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full translate-y-12 -translate-x-12 animate-float-delay" />
            <div class="absolute top-1/2 right-8 w-16 h-16 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full animate-float-delay-2" />

            <!-- Cute stars decoration -->
            <div class="absolute top-12 left-8 w-6 h-6 animate-spin-slow">
              <svg viewBox="0 0 24 24" fill="none" class="text-yellow-400/60">
                <path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <div class="absolute bottom-16 right-12 w-4 h-4 animate-spin-slow-delay">
              <svg viewBox="0 0 24 24" fill="none" class="text-blue-400/60">
                <path d="M12 2L14.09 8.26L20 10L14.09 11.74L12 18L9.91 11.74L4 10L9.91 8.26L12 2Z" fill="currentColor" />
              </svg>
            </div>

            <!-- Close Button - Cuter design -->
            <button
              @click="handleClose"
              class="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
            >
              <svg class="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Content -->
            <div class="relative z-10 text-center">
              <!-- Kayaan Logo with Animation - Duolingo Style -->
              <div class="kayaan-icon-container mb-6">
                <div class="kayaan-icon-wrapper animate-emblem-pop">
                  <!-- Kayaan Logo with Squash & Stretch -->
                  <div class="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg animate-logo-squash" style="background: linear-gradient(135deg, #3b82f6, #6366f1)">
                    <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center relative">
                      <!-- Sparkles with staggered timing -->
                      <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-sparkle-burst"></div>
                      <div class="absolute bottom-2 left-2 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-sparkle-burst-delay"></div>
                      <div class="absolute top-3 left-3 w-1 h-1 bg-blue-300 rounded-full opacity-50 animate-sparkle-burst-delay-2"></div>

                      <!-- Cheeks with smooth pulse -->
                      <div class="absolute left-2 bottom-8 w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-blush-smooth"></div>
                      <div class="absolute right-2 bottom-8 w-2 h-2 bg-pink-300 rounded-full opacity-60 animate-blush-smooth"></div>

                      <!-- Minimal Face -->
                      <div class="relative">
                        <!-- Eyes with natural blink -->
                        <div class="flex gap-2 mb-1.5">
                          <div class="w-2.5 h-2.5 bg-slate-600 rounded-full animate-blink-smooth"></div>
                          <div class="w-2.5 h-2.5 bg-slate-600 rounded-full animate-blink-smooth"></div>
                        </div>
                        <!-- Smile -->
                        <div class="w-6 h-3 border-b-2 border-slate-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Multi-layer Glow effect -->
                  <div class="kayaan-glow-outer" />
                  <div class="kayaan-glow-inner" />
                  <!-- Shine sweep effect -->
                  <div class="kayaan-shine" />
                </div>
              </div>

              <!-- Streak Count with Ticker Animation -->
              <div class="mb-4 relative">
                <!-- Cute number circle background -->
                <div class="absolute inset-0 flex items-center justify-center -z-1">
                  <div class="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50 animate-pulse-gentle" />
                </div>

                <div class="relative">
                  <div class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 animate-number-ticker">
                    {{ streakCount }}
                  </div>
                  <div class="flex items-center justify-center gap-2 mt-3 animate-fade-in-up">
                    <svg class="w-6 h-6 text-orange-500 animate-bounce-gentle" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span class="text-2xl font-bold text-gray-700">Day Streak</span>
                    <svg class="w-6 h-6 text-orange-500 animate-bounce-gentle" viewBox="0 0 24 24" fill="currentColor" style="animation-delay: 0.1s;">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Title with bounce - Cuter style -->
              <h2 class="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 animate-title-bounce">
                {{ title }}
              </h2>

              <!-- Message with delayed fade - Softer -->
              <p class="text-lg text-gray-600/90 mb-6 leading-relaxed animate-message-fade">
                {{ message }}
              </p>

              <!-- Milestone Badge (if special milestone) with slide-in -->
              <div v-if="isMilestone" class="mb-6 animate-badge-slide">
                <div class="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-6 py-3.5 rounded-full font-bold text-lg shadow-xl animate-badge-wiggle relative overflow-hidden">
                  <!-- Shimmer effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

                  <!-- Custom icon based on milestone -->
                  <svg v-if="streakCount >= 100" class="w-7 h-7 animate-icon-pop" viewBox="0 0 24 24" fill="currentColor">
                    <!-- Crown -->
                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                  </svg>
                  <svg v-else-if="streakCount >= 30" class="w-7 h-7 animate-icon-pop" viewBox="0 0 24 24" fill="currentColor">
                    <!-- Trophy -->
                    <path d="M6 3H18C18.6 3 19 3.4 19 4V8C19 9.7 17.7 11 16 11H15.4C15.8 11.6 16 12.3 16 13V16H18V18H14V20H10V18H6V16H8V13C8 12.3 8.2 11.6 8.6 11H8C6.3 11 5 9.7 5 8V4C5 3.4 5.4 3 6 3ZM7 5V8C7 8.6 7.4 9 8 9H10V5H7ZM14 5V9H16C16.6 9 17 8.6 17 8V5H14Z" />
                  </svg>
                  <svg v-else-if="streakCount >= 10" class="w-7 h-7 animate-icon-pop" viewBox="0 0 24 24" fill="currentColor">
                    <!-- Target -->
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20ZM12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" />
                  </svg>
                  <svg v-else class="w-7 h-7 animate-icon-pop" viewBox="0 0 24 24" fill="currentColor">
                    <!-- Star -->
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>

                  <span class="relative">{{ milestoneText }}</span>
                </div>
              </div>

              <!-- Continue Button with smooth hover - Cuter design -->
              <button
                @click="handleClose"
                class="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-bold text-lg py-4 px-8 rounded-[1.25rem] shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 ease-out-back animate-button-appear group"
              >
                <!-- Button shine effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <span class="relative flex items-center justify-center gap-2">
                  <span>Awesome</span>
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 5L16 12L9 19V5Z" />
                  </svg>
                </span>
              </button>

              <!-- Progress Indicator - Cuter design -->
              <div v-if="showProgress" class="mt-6 bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div class="flex justify-between text-sm font-semibold text-gray-700 mb-3">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 1V7H15V1H17V7H20C20.6 7 21 7.4 21 8V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V8C3 7.4 3.4 7 4 7H7V1H9ZM19 12H5V19H19V12Z" />
                    </svg>
                    Weekly Progress
                  </span>
                  <span class="font-bold text-blue-600">{{ Math.min(streakCount % 7, 7) }}/7 days</span>
                </div>
                <div class="relative w-full bg-gray-200/80 rounded-full h-3.5 overflow-hidden shadow-inner">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 h-3.5 rounded-full transition-all duration-1000 animate-progress shadow-md"
                    :style="{ width: `${Math.min((streakCount % 7) * 14.28, 100)}%` }"
                  >
                    <!-- Progress shimmer -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>

                  <!-- Cute dots for each day -->
                  <div class="absolute inset-0 flex items-center justify-around px-1">
                    <div v-for="day in 7" :key="day"
                         class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                         :class="day <= (streakCount % 7) ? 'bg-white shadow-sm scale-125' : 'bg-gray-300/50'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  streakCount: number
  title?: string
  message?: string
  showProgress?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Amazing!',
  message: 'You\'re building an excellent learning habit! 🎓',
  showProgress: true,
  autoClose: true,
  autoCloseDelay: 5000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)
const confettiCount = 50

// Computed
const isMilestone = computed(() => {
  return props.streakCount === 1 ||
         props.streakCount === 5 ||
         props.streakCount === 10 ||
         props.streakCount === 30 ||
         props.streakCount === 100 ||
         props.streakCount % 7 === 0
})

const milestoneText = computed(() => {
  if (props.streakCount >= 100) return 'Legendary! 100 Days!'
  if (props.streakCount >= 30) return 'Champion! 30 Days!'
  if (props.streakCount === 10) return 'Outstanding! 10 Days!'
  if (props.streakCount === 5) return 'Great Start! 5 Days!'
  if (props.streakCount === 1) return 'Journey Begins!'
  if (props.streakCount % 7 === 0) return `${props.streakCount} Days Complete!`
  return 'Milestone Achieved!'
})

// Methods
const handleClose = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

const getConfettiStyle = (index: number) => {
  // Duolingo-inspired colors (brighter, more saturated)
  const colors = [
    '#58CC02', // green
    '#FFD43B', // yellow
    '#1CB0F6', // blue
    '#FF4B4B', // red
    '#CE82FF', // purple
    '#00CD9C', // teal
    '#FF9600', // orange
    '#FF66C4'  // pink
  ]

  const randomColor = colors[index % colors.length]
  const randomX = Math.random() * 100
  const randomDelay = Math.random() * 0.3 // Start faster (300-650ms)
  const randomDuration = 2 + Math.random() * 1 // Shorter duration (2-3s)
  const randomRotation = Math.random() * 360
  const randomSize = 6 + Math.random() * 6 // Smaller particles (6-12px)

  // Physics: drift left/right
  const drift = (Math.random() - 0.5) * 200 // -100px to 100px

  return {
    left: `${randomX}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`,
    transform: `rotate(${randomRotation}deg)`,
    width: `${randomSize}px`,
    height: `${randomSize}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px', // Mix circles and squares
    '--drift': `${drift}px`,
    boxShadow: `0 2px 4px rgba(0,0,0,0.1)` // Subtle shadow for depth
  }
}

// Lifecycle
onMounted(() => {
  // Show with slight delay for smooth animation
  setTimeout(() => {
    show.value = true
  }, 100)

  // Auto close
  if (props.autoClose) {
    setTimeout(() => {
      handleClose()
    }, props.autoCloseDelay)
  }
})
</script>

<style scoped>
/* ============================================
   DUOLINGO-STYLE SMOOTH ANIMATIONS
   Duration: 1.2-1.4s | Easing: Custom Curves
   ============================================ */

/* Confetti Animation with Physics */
.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10%;
  animation: confetti-physics 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  will-change: transform, opacity;
}

@keyframes confetti-physics {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(120vh) translateX(var(--drift, 0px)) rotate(720deg) scale(0.4);
    opacity: 0;
  }
}

/* ============================================
   KAYAAN LOGO - EMBLEM POP (150-450ms)
   Squash & Stretch with EaseOutBack
   ============================================ */
.kayaan-icon-wrapper {
  position: relative;
  display: inline-block;
}

/* Emblem Pop Animation - Main */
@keyframes emblem-pop {
  0% {
    transform: scale(0.85) rotate(0deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.08) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-emblem-pop {
  animation: emblem-pop 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both;
}

/* Logo Squash & Stretch (12% max) */
@keyframes logo-squash {
  0% {
    transform: scale(0.88, 0.92);
  }
  50% {
    transform: scale(1.06, 1.04) rotate(1deg);
  }
  100% {
    transform: scale(1, 1) rotate(0deg);
  }
}

.animate-logo-squash {
  animation: logo-squash 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 200ms both;
}

/* Multi-layer Glow (400-900ms) */
.kayaan-glow-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse-outer 1200ms cubic-bezier(0.37, 0, 0.63, 1) 400ms both;
  pointer-events: none;
}

.kayaan-glow-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse-inner 1000ms cubic-bezier(0.37, 0, 0.63, 1) 500ms both;
  pointer-events: none;
}

@keyframes glow-pulse-outer {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
}

@keyframes glow-pulse-inner {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
}

/* Shine Sweep Effect (400-900ms, 2 passes) */
.kayaan-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 45%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.3) 55%,
    transparent 100%
  );
  transform: skewX(-20deg);
  animation: shine-sweep 900ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 400ms;
  pointer-events: none;
}

@keyframes shine-sweep {
  0%, 100% {
    left: -100%;
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  50% {
    left: 120%;
    opacity: 0.8;
  }
  55% {
    left: -100%;
    opacity: 0;
  }
  85% {
    opacity: 1;
  }
  100% {
    left: 120%;
    opacity: 0;
  }
}

/* ============================================
   PARTICLE BURST (300-650ms)
   Sparkles with staggered timing
   ============================================ */
@keyframes sparkle-burst {
  0% {
    transform: scale(0) translate(0, 0);
    opacity: 0;
  }
  30% {
    transform: scale(1.3) translate(4px, -4px);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) translate(8px, -8px);
    opacity: 0.7;
  }
}

.animate-sparkle-burst {
  animation: sparkle-burst 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms both,
             sparkle-twinkle 2s ease-in-out 700ms infinite;
}

.animate-sparkle-burst-delay {
  animation: sparkle-burst 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 380ms both,
             sparkle-twinkle 2s ease-in-out 780ms infinite;
}

.animate-sparkle-burst-delay-2 {
  animation: sparkle-burst 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 460ms both,
             sparkle-twinkle 2s ease-in-out 860ms infinite;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0.7;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Natural Blink Animation */
@keyframes blink-smooth {
  0%, 90%, 100% {
    transform: scaleY(1);
    opacity: 1;
  }
  93% {
    transform: scaleY(0.1);
    opacity: 0.3;
  }
  96% {
    transform: scaleY(1);
    opacity: 1;
  }
}

.animate-blink-smooth {
  animation: blink-smooth 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
}

/* Smooth Blush Pulse */
@keyframes blush-smooth {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.animate-blush-smooth {
  animation: blush-smooth 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* ============================================
   MAIN POPUP - DUOLINGO ENTRANCE (0-700ms)
   Setup with cubic-bezier(0.16, 1, 0.3, 1)
   ============================================ */
@keyframes duolingo-popup {
  0% {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-duolingo-popup {
  animation: duolingo-popup 700ms cubic-bezier(0.16, 1, 0.3, 1) both,
             settle-micro-bounce 400ms cubic-bezier(0.4, 0, 0.2, 1) 900ms both;
}

/* Settle & Micro-bounce (900-1200ms) */
@keyframes settle-micro-bounce {
  0% {
    transform: scale(1) translateY(0);
  }
  40% {
    transform: scale(0.995) translateY(-2px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

/* ============================================
   NUMBER TICKER (350-750ms)
   Odometer roll with blur
   ============================================ */
@keyframes number-ticker {
  0% {
    transform: translateY(16px);
    opacity: 0;
    filter: blur(1.5px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0px);
  }
}

.animate-number-ticker {
  animation: number-ticker 400ms cubic-bezier(0.2, 0.8, 0.2, 1) 350ms both;
}

/* Fade In Up - Subtitle */
@keyframes fade-in-up {
  0% {
    transform: translateY(8px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 400ms cubic-bezier(0.16, 1, 0.3, 1) 450ms both;
}

/* Title Bounce */
@keyframes title-bounce {
  0% {
    transform: scale(0.95) translateY(4px);
    opacity: 0;
  }
  60% {
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-title-bounce {
  animation: title-bounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 550ms both;
}

/* Message Fade */
@keyframes message-fade {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-message-fade {
  animation: message-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) 650ms both;
}

/* Badge Slide-in from Top (250ms) */
@keyframes badge-slide {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-badge-slide {
  animation: badge-slide 350ms cubic-bezier(0.34, 1.56, 0.64, 1) 250ms both;
}

/* Badge Wiggle (subtle) */
@keyframes badge-wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.animate-badge-wiggle {
  animation: badge-wiggle 800ms cubic-bezier(0.4, 0, 0.2, 1) 600ms;
}

/* Icon Pop inside badge */
@keyframes icon-pop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.animate-icon-pop {
  display: inline-block;
  animation: icon-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) 400ms both;
}

/* Button Appear */
@keyframes button-appear {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-button-appear {
  animation: button-appear 400ms cubic-bezier(0.16, 1, 0.3, 1) 750ms both;
}

/* Progress Animation */
@keyframes progress {
  from {
    width: 0;
  }
}

.animate-progress {
  animation: progress 1s ease-out;
}

/* ============================================
   CUSTOM EASING CURVES (Duolingo Style)
   ============================================ */
.ease-out-expo {
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.ease-out-back {
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ease-in-quad {
  animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

/* ============================================
   ACCESSIBILITY - REDUCE MOTION
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .confetti,
  .animate-emblem-pop,
  .animate-logo-squash,
  .kayaan-glow-outer,
  .kayaan-glow-inner,
  .kayaan-shine,
  .animate-sparkle-burst,
  .animate-sparkle-burst-delay,
  .animate-sparkle-burst-delay-2,
  .animate-badge-wiggle,
  .animate-icon-pop {
    animation: none !important;
  }

  .animate-duolingo-popup,
  .animate-number-ticker,
  .animate-fade-in-up,
  .animate-title-bounce,
  .animate-message-fade,
  .animate-badge-slide,
  .animate-button-appear {
    animation-duration: 0.3s !important;
    animation-timing-function: ease-out !important;
  }

  .celebration-card {
    animation: simple-fade 0.4s ease-out both !important;
  }

  @keyframes simple-fade {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */
.celebration-card,
.kayaan-icon-wrapper,
.confetti {
  will-change: transform, opacity;
}

.celebration-card {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Card subtle hover effect */
.celebration-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================
   CUSTOM SCROLLBAR (for overflow)
   ============================================ */
.celebration-card::-webkit-scrollbar {
  width: 4px;
}

.celebration-card::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.celebration-card::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.celebration-card::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* ============================================
   CUTE ANIMATIONS - Additional
   ============================================ */

/* Gentle Float Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-12px) scale(1.05);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delay {
  animation: float 4s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-delay-2 {
  animation: float 4s ease-in-out infinite;
  animation-delay: 2s;
}

/* Gentle Spin */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-spin-slow-delay {
  animation: spin-slow 8s linear infinite;
  animation-delay: 2s;
}

/* Gentle Pulse */
@keyframes pulse-gentle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 3s ease-in-out infinite;
}

/* Gentle Bounce */
@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 1.5s ease-in-out infinite;
}

/* Shimmer Effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

/* Playful Hearts (optional) */
@keyframes heart-beat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.15);
  }
}

.animate-heart-beat {
  animation: heart-beat 1.5s ease-in-out infinite;
}

/* Cute Wiggle (softer version) */
@keyframes wiggle-cute {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-3deg) scale(1.02);
  }
  75% {
    transform: rotate(3deg) scale(1.02);
  }
}

.animate-wiggle-cute {
  animation: wiggle-cute 2s ease-in-out infinite;
}

/* Hover bounce for interactive elements */
@keyframes hover-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

button:hover .animate-on-hover {
  animation: hover-bounce 0.5s ease-in-out;
}
</style>

