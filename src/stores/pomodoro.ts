import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGamificationStore } from './gamification'

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const mode = ref<PomodoroMode>('pomodoro')
  const timeLeft = ref(25 * 60)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const timerId = ref<number | null>(null)
  const completedPomodoros = ref(0)
  const currentSession = ref(1)
  const completedToday = ref(0)
  const durations = ref({
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  })
  const longBreakInterval = ref(4)
  const autoStartBreaks = ref(true)
  const autoStartPomodoros = ref(false)
  const lastCompletionDate = ref<string | null>(null)

  const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, '0')
    const s = (timeLeft.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  function save() {
    const data = {
      mode: mode.value,
      timeLeft: timeLeft.value,
      isRunning: isRunning.value,
      isPaused: isPaused.value,
      completedPomodoros: completedPomodoros.value,
      currentSession: currentSession.value,
      completedToday: completedToday.value,
      durations: durations.value,
      lastCompletionDate: lastCompletionDate.value,
    }
    localStorage.setItem('pomodoroState', JSON.stringify(data))
  }

  function load() {
    const raw = localStorage.getItem('pomodoroState')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      mode.value = data.mode || 'pomodoro'
      timeLeft.value = data.timeLeft ?? 25 * 60
      isRunning.value = data.isRunning || false
      isPaused.value = data.isPaused || false
      completedPomodoros.value = data.completedPomodoros || 0
      currentSession.value = data.currentSession || 1
      completedToday.value = data.completedToday || 0
      durations.value = data.durations || durations.value
      lastCompletionDate.value = data.lastCompletionDate || null
      if (isRunning.value) startTimer()
    } catch (err) {
      console.error('Failed to load pomodoro state', err)
    }
  }

  function startTimer() {
    if (timerId.value) clearInterval(timerId.value)
    isRunning.value = true
    isPaused.value = false
    timerId.value = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        completeSession()
      }
      save()
    }, 1000)
    save()
  }

  function pauseTimer() {
    if (timerId.value) clearInterval(timerId.value)
    isRunning.value = false
    isPaused.value = true
    save()
  }

  function resetTimer() {
    if (timerId.value) clearInterval(timerId.value)
    isRunning.value = false
    isPaused.value = false
    timeLeft.value = durations.value[mode.value]
    save()
  }

  function toggleTimer() {
    if (isRunning.value) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  function switchMode(newMode: PomodoroMode) {
    mode.value = newMode
    timeLeft.value = durations.value[newMode]
    save()
  }

  function skipSession() {
    completeSession(true)
  }

  function completeSession(skipped = false) {
    if (timerId.value) clearInterval(timerId.value)
    isRunning.value = false
    isPaused.value = false

    if (mode.value === 'pomodoro' && !skipped) {
      completedPomodoros.value++
      currentSession.value++
      const g = useGamificationStore()
      g.incrementPomodoroCount()
      g.addXp(10)

      const today = new Date().toISOString().slice(0, 10)
      if (lastCompletionDate.value !== today) {
        completedToday.value = 1
      } else {
        completedToday.value++
      }
      lastCompletionDate.value = today

      if (completedPomodoros.value % longBreakInterval.value === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
      if (autoStartBreaks.value) setTimeout(startTimer, 1000)
    } else {
      switchMode('pomodoro')
      if (autoStartPomodoros.value) setTimeout(startTimer, 1000)
    }
    save()
  }

  return {
    mode,
    timeLeft,
    isRunning,
    isPaused,
    completedPomodoros,
    currentSession,
    completedToday,
    durations,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
    switchMode,
    skipSession,
    completeSession,
    load,
    save,
  }
})
