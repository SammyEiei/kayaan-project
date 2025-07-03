import './assets/style.css'
import '@/service/AxiosInterceptorSetup.ts'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useGamificationStore } from '@/stores/gamification'
import '@/service/AxiosInterceptorSetup' // ⭐ ดึง interceptor เข้า context

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

app.mount('#app')
