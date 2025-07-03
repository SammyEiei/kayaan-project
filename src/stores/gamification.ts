import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGamificationStore = defineStore('gamification', () => {
  const xp = ref(0)
  const pomodorosToday = ref(0)
  const lastUpdate = ref<string | null>(null)

  function save() {
    const data = {
      xp: xp.value,
      pomodorosToday: pomodorosToday.value,
      lastUpdate: lastUpdate.value,
    }
    localStorage.setItem('gamification', JSON.stringify(data))
  }

  function load() {
    const raw = localStorage.getItem('gamification')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      xp.value = data.xp || 0
      pomodorosToday.value = data.pomodorosToday || 0
      lastUpdate.value = data.lastUpdate || null
    } catch (err) {
      console.error('Failed to load gamification state', err)
    }
  }

  function addXp(amount: number) {
    xp.value += amount
    save()
  }

  function incrementPomodoroCount() {
    const today = new Date().toISOString().slice(0, 10)
    if (lastUpdate.value !== today) {
      pomodorosToday.value = 1
    } else {
      pomodorosToday.value++
    }
    lastUpdate.value = today
    save()
  }

  return { xp, pomodorosToday, addXp, incrementPomodoroCount, load }
})
