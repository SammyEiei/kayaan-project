<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Simplified Side Bar -->
    <aside
      v-if="isLoggedIn && !isAuthPage"
      class="fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 flex flex-col z-40 shadow-sm"
    >
      <!-- Cleaner Logo -->
      <router-link to="/" class="flex items-center px-6 py-5 border-b border-gray-100">
        <div class="relative">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm"
          >
            <!-- Modern K Logo -->
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h4v18H3V3zm6 0h2l6 8-6 8h-2l6-8-6-8zm8 0h4v18h-4V3z" />
              <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
            </svg>
          </div>
        </div>
        <div class="ml-3">
          <span
            class="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Kayaan
          </span>
          <div class="text-xs text-gray-500 font-medium">Learning Hub</div>
        </div>
      </router-link>

      <!-- Simplified Menu -->
      <nav class="flex-1 py-4 px-3 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium group"
          :class="{
            'bg-blue-50 text-blue-700 border-l-3 border-blue-600 ml-0 pl-3': route.path.startsWith(
              item.to,
            ),
          }"
        >
          <div
            :class="
              route.path.startsWith(item.to)
                ? 'text-blue-600'
                : 'text-gray-500 group-hover:text-gray-700'
            "
            class="w-5 h-5 mr-3 transition-colors duration-150"
          >
            <component :is="getIconComponent(item.icon)" />
          </div>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Simplified User Section -->
      <div class="p-4 border-t border-gray-100">
        <div class="bg-gray-50 rounded-lg p-3 mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium"
            >
              {{ (authStore.user?.username || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="font-medium text-gray-800 text-sm">
                {{ authStore.user?.username || 'User' }}
              </div>
              <div class="text-xs text-gray-500">Premium Member</div>
            </div>
          </div>
        </div>

        <button
          @click="logout"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150 text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content (with sidebar space) -->
    <div :class="[isLoggedIn && !isAuthPage ? 'ml-64' : '', 'flex-1 flex flex-col']">
      <!-- Simplified Header -->
      <header
        v-if="!isAuthPage"
        class="bg-white/90 backdrop-blur-sm shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-200 sticky top-0 z-30"
      >
        <!-- Mobile Logo -->
        <router-link to="/" class="flex items-center md:hidden">
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h4v18H3V3zm6 0h2l6 8-6 8h-2l6-8-6-8zm8 0h4v18h-4V3z" />
              <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
            </svg>
          </div>
          <div class="ml-2">
            <span
              class="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Kayaan
            </span>
          </div>
        </router-link>

        <!-- Page Title for Logged In Users -->
        <div v-if="isLoggedIn" class="hidden md:block">
          <h1 class="text-lg font-semibold text-gray-800">{{ getPageTitle() }}</h1>
        </div>

        <!-- Navigation/Auth Buttons -->
        <nav class="flex items-center space-x-3">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-150 px-3 py-2"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-150 font-medium text-sm"
            >
              Sign up
            </router-link>
          </template>

          <!-- Quick Actions for Logged In Users -->
          <template v-if="isLoggedIn">
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5-5-5h5v-7h5v7z"
                />
              </svg>
            </button>
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <svg
                class="w-5 h-5 text-gray-600"
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
            </button>
          </template>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="flex-1">
        <RouterView />
      </main>

      <!-- Simplified Footer -->
      <footer
        v-if="!isAuthPage"
        class="bg-white/90 backdrop-blur-sm border-t border-gray-200 py-8 px-6"
      >
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Logo & Description -->
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h4v18H3V3zm6 0h2l6 8-6 8h-2l6-8-6-8zm8 0h4v18h-4V3z" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
                  </svg>
                </div>
                <div class="ml-2">
                  <span
                    class="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Kayaan
                  </span>
                  <div class="text-xs text-gray-500">Learning Hub</div>
                </div>
              </div>
              <p class="text-gray-600 text-sm max-w-md">
                Empowering learners with AI-driven tools and collaborative features to achieve their
                educational goals efficiently.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="font-medium text-gray-800 mb-3 text-sm">Features</h3>
              <ul class="space-y-2 text-gray-600 text-sm">
                <li><a href="#" class="hover:text-blue-600 transition-colors">Flashcards</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Study Groups</a></li>
                <li>
                  <a href="#" class="hover:text-blue-600 transition-colors">Pomodoro Timer</a>
                </li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">AI Content</a></li>
              </ul>
            </div>

            <!-- Support -->
            <div>
              <h3 class="font-medium text-gray-800 mb-3 text-sm">Support</h3>
              <ul class="space-y-2 text-gray-600 text-sm">
                <li><a href="#" class="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li>
                  <a href="#" class="hover:text-blue-600 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" class="hover:text-blue-600 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div
            class="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center"
          >
            <div class="text-gray-500 text-xs">
              © 2024 Kayaan Learning Hub. All rights reserved.
            </div>
            <div class="flex space-x-4 mt-3 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted, h } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

const isLoggedIn = computed(() => !!authStore.token)

const menuItems = [
  { to: '/dashboard', icon: 'grid', label: 'Dashboard' },
  { to: '/flashcards', icon: 'book', label: 'Flashcards & Quizzes' },
  { to: '/create-content', icon: 'sparkles', label: 'Create Content' },
  { to: '/study-groups', icon: 'users', label: 'Study Groups' },
  { to: '/pomodoro', icon: 'clock', label: 'Pomodoro Timer' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

function getIconComponent(iconName: string) {
  const icons = {
    grid: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1.5' }),
          h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1.5' }),
        ],
      ),
    book: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
          h('path', { d: 'M6.5 17V5.5A2.5 2.5 0 0 1 9 3h10.5A2.5 2.5 0 0 1 22 5.5v11.5' }),
        ],
      ),
    sparkles: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', {
            d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
          }),
        ],
      ),
    users: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' }),
          h('circle', { cx: '9', cy: '7', r: '4' }),
          h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
          h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
        ],
      ),
    clock: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [h('circle', { cx: '12', cy: '12', r: '10' }), h('path', { d: 'M12 6v6l4 2' })],
      ),
    settings: () =>
      h(
        'svg',
        {
          class: 'w-5 h-5',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          viewBox: '0 0 24 24',
        },
        [
          h('circle', { cx: '12', cy: '12', r: '3' }),
          h('path', {
            d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
          }),
        ],
      ),
  }
  return icons[iconName as keyof typeof icons] || icons.grid
}

function getPageTitle() {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/flashcards': 'Flashcards & Quizzes',
    '/create-content': 'Create Content',
    '/study-groups': 'Study Groups',
    '/pomodoro': 'Pomodoro Timer',
    '/settings': 'Settings',
  }
  return titles[route.path] || 'Kayaan'
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.reload()
})
</script>

<style scoped>
/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, transform;
  transition-timing-function: ease-out;
  transition-duration: 150ms;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Focus states */
button:focus,
a:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
</style>
