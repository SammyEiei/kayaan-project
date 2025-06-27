<template>
  <div
    :class="themeClass"
    class="min-h-screen flex flex-col items-center justify-center px-4 py-10 transition-all duration-500"
  >
    <!-- Header -->
    <div class="mb-8 text-center">
      <div class="flex items-center justify-center gap-2 text-3xl font-bold text-white">
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-red-500 text-lg font-semibold shadow"
          >✓</span
        >
        Pomofocus
      </div>
    </div>

    <!-- Mode Tabs -->
    <div class="flex justify-center gap-3 mb-10">
      <button
        v-for="m in modes"
        :key="m.value"
        class="px-6 py-2 rounded-lg font-medium text-lg transition-all duration-150"
        :class="
          mode === m.value
            ? 'bg-white/15 text-white shadow-inner border border-white/30'
            : 'text-white/60 hover:bg-white/10'
        "
        @click="switchMode(m.value)"
      >
        {{ m.label }}
      </button>
    </div>

    <!-- Timer Card -->
    <div
      class="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-3xl px-0 sm:px-10 py-14 shadow-xl flex flex-col items-center"
    >
      <div class="text-[5.5rem] font-light tracking-wide text-white tabular-nums mb-8 select-none">
        {{ formattedTime }}
      </div>
      <button
        class="px-16 py-4 bg-white text-red-500 font-bold text-lg rounded-full shadow-lg uppercase tracking-widest hover:bg-red-50 active:scale-95 transition"
        @click="toggleTimer"
      >
        {{ buttonText }}
      </button>
      <div v-if="isRunning || isPaused" class="flex gap-4 mt-8">
        <button
          class="px-6 py-2 rounded-full text-sm font-medium text-white/80 bg-white/20 hover:bg-white/30"
          @click="resetTimer"
        >
          Reset
        </button>
        <button
          class="px-6 py-2 rounded-full text-sm font-medium text-white/80 bg-white/20 hover:bg-white/30"
          @click="skipSession"
        >
          Skip
        </button>
      </div>
    </div>

    <div class="mt-8 text-center">
      <div class="text-white/70 text-lg font-medium mb-2">#{{ currentSession }}</div>
      <div class="text-white text-xl font-semibold">{{ motivationalText }}</div>
    </div>

    <!-- TASK LIST -->
    <div class="w-full max-w-xl mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md">
      <div class="flex items-center mb-4">
        <h2 class="text-lg font-bold text-white flex-1">My Tasks</h2>
        <button
          class="ml-2 px-3 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30 transition"
          @click="clearCompleted"
          v-if="tasks.some((t) => t.completed)"
        >
          Clear Completed
        </button>
      </div>
      <form @submit.prevent="addTask" class="flex gap-2 mb-4">
        <input
          v-model="newTask"
          class="flex-1 rounded px-3 py-2 border border-white/20 bg-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          placeholder="What are you working on?"
          autocomplete="off"
          required
        />
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          type="submit"
        >
          Add
        </button>
      </form>
      <ul>
        <li
          v-for="(task, idx) in tasks"
          :key="task.id"
          class="flex items-center gap-3 py-2 border-b border-white/10 last:border-b-0 group"
        >
          <button
            class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-150"
            :class="task.completed ? 'bg-green-500 border-green-500' : 'hover:border-blue-400'"
            @click="toggleTask(task.id)"
            :aria-label="task.completed ? 'Mark as not done' : 'Mark as done'"
          >
            <svg
              v-if="task.completed"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <span
            :class="['flex-1 text-white text-base', task.completed && 'line-through opacity-60']"
            @dblclick="editTask(idx)"
            >{{ task.text }}</span
          >
          <input
            v-if="editingIdx === idx"
            v-model="editText"
            @keyup.enter="saveTaskEdit(idx)"
            @blur="saveTaskEdit(idx)"
            class="flex-1 rounded px-2 py-1 border border-blue-400 bg-white text-gray-800"
            ref="editInput"
          />
          <button
            v-if="!task.completed"
            class="text-white/50 hover:text-red-400 px-2"
            @click="removeTask(task.id)"
            aria-label="Delete"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
      <div v-if="tasks.length === 0" class="text-white/50 text-sm text-center py-6">
        No tasks yet. Add one!
      </div>
    </div>

    <div class="fixed bottom-6 right-6 text-xs text-white/50 select-none">
      Press SPACE to start/pause • S to skip • R to reset
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const mode = ref('pomodoro')
const timeLeft = ref(25 * 60)
const isRunning = ref(false)
const isPaused = ref(false)
const timer = ref(null)
const completedPomodoros = ref(0)
const currentSession = ref(1)

const durations = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const longBreakInterval = 4
const autoStartBreaks = true
const autoStartPomodoros = false

const modes = [
  { label: 'Pomodoro', value: 'pomodoro' },
  { label: 'Short Break', value: 'shortBreak' },
  { label: 'Long Break', value: 'longBreak' },
]

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const buttonText = computed(() => {
  if (isRunning.value) return 'Pause'
  if (isPaused.value) return 'Resume'
  return 'Start'
})

const themeClass = computed(() => {
  switch (mode.value) {
    case 'pomodoro':
      return 'bg-gradient-to-br from-[#BA4949] to-[#D65454]'
    case 'shortBreak':
      return 'bg-gradient-to-br from-[#4C9196] to-[#5BA3A8]'
    case 'longBreak':
      return 'bg-gradient-to-br from-[#457CA3] to-[#5A95C0]'
    default:
      return ''
  }
})

const motivationalText = computed(() => {
  if (mode.value === 'pomodoro') {
    return isRunning.value ? 'Stay focused!' : 'Time to focus!'
  }
  return 'Time for a break!'
})

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  isRunning.value = true
  isPaused.value = false
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      completeSession()
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  isPaused.value = true
  clearInterval(timer.value)
}

function resetTimer() {
  isRunning.value = false
  isPaused.value = false
  clearInterval(timer.value)
  timeLeft.value = durations[mode.value]
}

function skipSession() {
  completeSession()
}

function completeSession() {
  clearInterval(timer.value)
  isRunning.value = false
  isPaused.value = false
  playNotification()
  if (mode.value === 'pomodoro') {
    completedPomodoros.value++
    currentSession.value++
    if (completedPomodoros.value % longBreakInterval === 0) {
      switchMode('longBreak')
    } else {
      switchMode('shortBreak')
    }
    if (autoStartBreaks) setTimeout(startTimer, 1000)
  } else {
    switchMode('pomodoro')
    if (autoStartPomodoros) setTimeout(startTimer, 1000)
  }
}

function switchMode(newMode) {
  mode.value = newMode
  resetTimer()
  document.title = `${formattedTime.value} - ${getModeName(newMode)}`
}

function getModeName(mode) {
  return modes.find((m) => m.value === mode)?.label || ''
}

function playNotification() {
  // Simple beep
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 820
    gain.gain.value = 0.1
    osc.start()
    osc.stop(ctx.currentTime + 0.18)
  } catch {}
  // Web Notification
  if (window.Notification && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: mode.value === 'pomodoro' ? 'Focus session complete!' : 'Break time is over!',
    })
  }
}

function handleKeyboard(e) {
  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault()
      toggleTimer()
      break
    case 's':
      if (isRunning.value || isPaused.value) skipSession()
      break
    case 'r':
      resetTimer()
      break
  }
}

onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  document.addEventListener('keydown', handleKeyboard)
  // Update page title periodically
  setInterval(() => {
    if (isRunning.value) {
      document.title = `${formattedTime.value} - ${getModeName(mode.value)}`
    }
  }, 1000)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboard)
  if (timer.value) clearInterval(timer.value)
})

watch(mode, () => {
  document.title = `${formattedTime.value} - ${getModeName(mode.value)}`
})

// ------------------- Task List --------------------

const tasks = ref([
  // { id: 1, text: 'Finish Pomodoro component', completed: false }
])
const newTask = ref('')
const editingIdx = ref(null)
const editText = ref('')
const editInput = ref(null)

function addTask() {
  if (!newTask.value.trim()) return
  tasks.value.push({
    id: Date.now(),
    text: newTask.value.trim(),
    completed: false,
  })
  newTask.value = ''
}

function toggleTask(id) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) task.completed = !task.completed
}

function removeTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

function editTask(idx) {
  editingIdx.value = idx
  editText.value = tasks.value[idx].text
  nextTick(() => {
    if (editInput.value) editInput.value.focus()
  })
}

function saveTaskEdit(idx) {
  if (editText.value.trim()) {
    tasks.value[idx].text = editText.value.trim()
  }
  editingIdx.value = null
  editText.value = ''
}

function clearCompleted() {
  tasks.value = tasks.value.filter((t) => !t.completed)
}
</script>
