<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"
    ></div>

    <main class="relative z-10 p-6">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Enhanced Header -->
        <div class="text-center mb-12">
          <div class="flex justify-center mb-6">
            <div
              class="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent"
          >
            Pomodoro Timer
          </h1>
          <p class="text-gray-600 text-lg mt-3">
            Use the Pomodoro Technique to boost your productivity and focus
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Timer Card -->
          <div class="lg:col-span-2">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-12 shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              <div class="text-center space-y-8">
                <!-- Timer Type Header -->
                <div class="space-y-2">
                  <div class="flex items-center justify-center gap-3">
                    <div
                      :class="
                        timerType === 'focus'
                          ? 'w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse'
                          : 'w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse'
                      "
                    ></div>
                    <h2 class="text-2xl font-bold text-gray-800">
                      {{
                        timerType === 'focus'
                          ? 'Focus Time'
                          : completedPomodoros % longBreakInterval === 0
                            ? 'Long Break'
                            : 'Short Break'
                      }}
                    </h2>
                  </div>
                  <p class="text-gray-600">
                    {{
                      timerType === 'focus'
                        ? 'Time to concentrate and get things done'
                        : 'Take a well-deserved break'
                    }}
                  </p>
                </div>

                <!-- Circular Progress -->
                <div class="relative w-80 h-80 mx-auto">
                  <!-- Background Circle -->
                  <svg class="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      class="text-gray-200"
                    />
                    <!-- Progress Circle -->
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      stroke-width="3"
                      fill="none"
                      stroke-linecap="round"
                      :class="timerType === 'focus' ? 'text-purple-500' : 'text-green-500'"
                      :stroke-dasharray="282.6"
                      :stroke-dashoffset="282.6 - (282.6 * progressPercentage) / 100"
                      class="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <!-- Timer Display -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      class="text-6xl font-bold mb-2"
                      :class="timerType === 'focus' ? 'text-purple-600' : 'text-green-600'"
                    >
                      {{ formattedTime }}
                    </div>
                    <div class="text-gray-500 text-lg">
                      {{ isRunning ? 'Running' : 'Paused' }}
                    </div>
                  </div>
                </div>

                <!-- Enhanced Controls -->
                <div class="flex justify-center gap-4">
                  <button
                    @click="toggleTimer"
                    :class="
                      isRunning
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : timerType === 'focus'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    "
                    class="px-8 py-4 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-3"
                  >
                    <svg
                      v-if="isRunning"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 9v6m4-6v6"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M12 19v.01M5 12h.01M19 12h.01M7.05 7.05v.01M16.95 7.05v.01M7.05 16.95v.01M16.95 16.95v.01"
                      />
                    </svg>
                    {{ isRunning ? 'Pause' : 'Start' }}
                  </button>

                  <button
                    @click="resetTimer"
                    class="px-8 py-4 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-xl text-gray-700 font-semibold transition-all duration-200 hover:shadow-md flex items-center gap-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats & Settings Sidebar -->
          <div class="space-y-6">
            <!-- Stats Card -->
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Session Stats</h2>
              </div>

              <div class="space-y-4">
                <div
                  class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Completed Pomodoros</p>
                      <p class="text-2xl font-bold text-purple-600">{{ completedPomodoros }}</p>
                    </div>
                    <div
                      class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Total Focus Time</p>
                      <p class="text-2xl font-bold text-blue-600">
                        {{ completedPomodoros * focusTime }}m
                      </p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        class="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Until Long Break</p>
                      <p class="text-2xl font-bold text-green-600">
                        {{ longBreakInterval - (completedPomodoros % longBreakInterval) }}
                      </p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        class="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H4m16 0l-4 4m4-4l-4-4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Card -->
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Settings</h2>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Focus Time (minutes)</label
                  >
                  <div class="relative">
                    <input
                      v-model="focusTime"
                      type="number"
                      min="1"
                      max="60"
                      class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Short Break (minutes)</label
                  >
                  <div class="relative">
                    <input
                      v-model="breakTime"
                      type="number"
                      min="1"
                      max="30"
                      class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Long Break (minutes)</label
                  >
                  <div class="relative">
                    <input
                      v-model="longBreakTime"
                      type="number"
                      min="1"
                      max="60"
                      class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Long Break After (pomodoros)</label
                  >
                  <div class="relative">
                    <input
                      v-model="longBreakInterval"
                      type="number"
                      min="1"
                      max="10"
                      class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        class="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

// ตัวแปรสำหรับนาฬิกาจับเวลา
const totalSeconds = ref(25 * 60) // 25 นาทีเริ่มต้น
const isRunning = ref(false)
const timerType = ref('focus') // 'focus' หรือ 'break'
const intervalId = ref<number | undefined>(undefined)

// จำนวนรอบ Pomodoro
const completedPomodoros = ref(0)

// ตั้งค่าเวลา
const focusTime = ref(25) // นาที
const breakTime = ref(5) // นาที
const longBreakTime = ref(15) // นาที
const longBreakInterval = ref(4) // หลังจากกี่รอบจะได้พัก

// แปลงวินาทีเป็นรูปแบบ mm:ss
const formattedTime = computed(() => {
  const minutes = Math.floor(totalSeconds.value / 60)
  const seconds = totalSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// คำนวณเปอร์เซ็นต์ของเวลาที่เหลือ
const progressPercentage = computed(() => {
  const totalTime =
    timerType.value === 'focus'
      ? focusTime.value * 60
      : completedPomodoros.value % longBreakInterval.value === 0
        ? longBreakTime.value * 60
        : breakTime.value * 60
  return (totalSeconds.value / totalTime) * 100
})

// เริ่มหรือหยุดนาฬิกา
const toggleTimer = () => {
  if (isRunning.value) {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    isRunning.value = false
  } else {
    isRunning.value = true
    intervalId.value = window.setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        if (intervalId.value) {
          clearInterval(intervalId.value)
        }
        isRunning.value = false

        // สลับระหว่าง focus และ break
        if (timerType.value === 'focus') {
          completedPomodoros.value++
          timerType.value = 'break'
          // ตรวจสอบว่าควรเป็น long break หรือไม่
          if (completedPomodoros.value % longBreakInterval.value === 0) {
            totalSeconds.value = longBreakTime.value * 60
          } else {
            totalSeconds.value = breakTime.value * 60
          }
        } else {
          timerType.value = 'focus'
          totalSeconds.value = focusTime.value * 60
        }
      }
    }, 1000)
  }
}

// รีเซ็ตนาฬิกา
const resetTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  isRunning.value = false
  timerType.value = 'focus'
  totalSeconds.value = focusTime.value * 60
}

// ล้างค่า interval เมื่อออกจากหน้านี้
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style scoped>
/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced focus states */
input:focus {
  transform: translateY(-1px);
}

/* Circle animation */
circle {
  transition: stroke-dashoffset 1s ease-out;
}

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
