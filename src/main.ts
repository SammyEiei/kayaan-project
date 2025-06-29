import './assets/style.css'
import '@/service/AxiosInterceptorSetup.ts'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/service/AxiosInterceptorSetup' // ⭐ ดึง interceptor เข้า context

import App from './App.vue'
import router from './router'
import 'nprogress/nprogress.css'
import './assets/theme.css' // <-- นี่นะ

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
