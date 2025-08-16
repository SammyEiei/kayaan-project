import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useGamificationStore } from '@/stores/gamification'
import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'
import 'nprogress/nprogress.css'
import './assets/theme.css' // <-- นี่นะ

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// initialize global stores
const pomodoroStore = usePomodoroStore()
pomodoroStore.load()
const gamificationStore = useGamificationStore()
gamificationStore.load()

// initialize auth store
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')
