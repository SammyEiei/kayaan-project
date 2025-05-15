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

<template>
  <main class="p-6 bg-gray-100 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Pomodoro Timer</h1>
      <p class="text-gray-600 mt-2">Use the Pomodoro Technique to improve your productivity.</p>
    </div>

    <!-- Timer Card -->
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mb-8">
      <div class="text-center">
        <h2 class="text-xl font-bold mb-1">
          {{
            timerType === 'focus'
              ? 'Focus Time'
              : completedPomodoros % longBreakInterval === 0
                ? 'Long Break'
                : 'Short Break'
          }}
        </h2>
        <div
          class="text-6xl font-bold my-6"
          :class="timerType === 'focus' ? 'text-purple-600' : 'text-green-600'"
        >
          {{ formattedTime }}
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            class="h-2.5 rounded-full"
            :class="timerType === 'focus' ? 'bg-purple-600' : 'bg-green-600'"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center space-x-4">
          <button
            @click="toggleTimer"
            class="px-6 py-2 rounded-md focus:outline-none"
            :class="
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            "
          >
            {{ isRunning ? 'Pause' : 'Start' }}
          </button>
          <button
            @click="resetTimer"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 focus:outline-none"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Card -->
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold mb-4 text-center">Session Stats</h2>

      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-2xl font-bold text-purple-600">{{ completedPomodoros }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Focus Time</p>
          <p class="text-2xl font-bold text-purple-600">{{ completedPomodoros * focusTime }} min</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Next Break</p>
          <p class="text-2xl font-bold text-green-600">
            {{ longBreakInterval - (completedPomodoros % longBreakInterval) }}
          </p>
        </div>
      </div>

      <!-- Settings -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-medium mb-4">Settings</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Focus Time (min)</label>
            <input
              v-model="focusTime"
              type="number"
              min="1"
              max="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Break Time (min)</label>
            <input
              v-model="breakTime"
              type="number"
              min="1"
              max="30"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Long Break (min)</label>
            <input
              v-model="longBreakTime"
              type="number"
              min="1"
              max="60"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">After Pomodoros</label>
            <input
              v-model="longBreakInterval"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
