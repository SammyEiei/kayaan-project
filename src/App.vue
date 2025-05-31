<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
const isLoggedIn = computed(() => !!authStore.token)

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  authStore.reload()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Side Bar -->
    <aside
      v-if="isLoggedIn && !isAuthPage"
      class="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40 shadow-sm"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center px-6 py-5 border-b border-gray-100">
        <div
          class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md mr-3 text-lg font-bold shadow-sm"
        >
          K
        </div>
        <span
          class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >Kayaan</span
        >
      </router-link>
      <!-- Menu -->
      <nav class="flex-1 py-6 px-2 space-y-1">
        <router-link
          v-for="item in [
            { to: '/dashboard', icon: 'grid', label: 'Dashboard' },
            { to: '/flashcards', icon: 'book', label: 'Flashcards & Quizzes' },
            { to: '/create-content', icon: 'sparkles', label: 'Create Content' },
            { to: '/study-groups', icon: 'users', label: 'Study Groups' },
            { to: '/pomodoro', icon: 'clock', label: 'Pomodoro Timer' },
            { to: '/settings', icon: 'settings', label: 'Settings' },
          ]"
          :key="item.to"
          :to="item.to"
          class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition font-medium group"
          :class="{ 'bg-blue-100 text-blue-700 font-bold': route.path.startsWith(item.to) }"
        >
          <span class="mr-3">
            <svg
              v-if="item.icon === 'grid'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <svg
              v-else-if="item.icon === 'book'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M20 19.5A2.5 2.5 0 0 0 17.5 17H4" />
              <path d="M6.5 17V5.5A2.5 2.5 0 0 1 9 3h10.5A2.5 2.5 0 0 1 22 5.5v11.5" />
            </svg>
            <svg
              v-else-if="item.icon === 'sparkles'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.343 6.343l-1.414-1.414m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414"
              />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <svg
              v-else-if="item.icon === 'users'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <svg
              v-else-if="item.icon === 'clock'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <svg
              v-else-if="item.icon === 'settings'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
          </span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <!-- Logout -->
      <button
        @click="logout"
        class="m-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
      >
        Logout
      </button>
    </aside>

    <!-- Main Content (with sidebar space) -->
    <div :class="[isLoggedIn && !isAuthPage ? 'ml-64' : '', 'flex-1 flex flex-col']">
      <!-- Header -->
      <header
        v-if="!isAuthPage"
        class="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-200"
      >
        <!-- Logo (hidden on desktop if sidebar) -->
        <router-link to="/" class="flex items-center md:hidden">
          <div
            class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md mr-2 text-sm font-bold shadow-sm"
          >
            K
          </div>
          <h1
            class="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            Kayaan
          </h1>
        </router-link>
        <!-- Navigation/Auth Buttons (Sign in/Sign up only if not logged in) -->
        <nav class="flex items-center space-x-4">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="text-gray-700 hover:text-blue-600">Sign in</router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >Sign up</router-link
            >
          </template>
        </nav>
        <!-- Theme Toggle Button Placeholder -->
        <button class="p-2 rounded-md hover:bg-gray-100">
          <svg
            class="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <RouterView />

      <!-- Footer -->
      <footer v-if="!isAuthPage" class="py-8 px-6 bg-white text-gray-600 text-sm">
        <div
          class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md mr-2 text-xs font-bold"
            >
              K
            </div>
            <span
              class="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
              >Kayaan</span
            >
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-blue-600">Terms of Service</a>
            <a href="#" class="hover:text-blue-600">Privacy</a>
            <a href="#" class="hover:text-blue-600">Contact</a>
          </div>
          <div>© 2023 Kayaan Learning. All rights reserved.</div>
        </div>
      </footer>
    </div>
  </div>
  <!-- <div id="app">
    <Employee />
  </div> -->
</template>

<style>
* {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}
</style>
