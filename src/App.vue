<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      v-if="!isAuthPage"
      class="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-200"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center">
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

      <!-- Navigation/Auth Buttons -->
      <nav class="flex items-center space-x-4">
        <router-link to="/login" class="text-gray-700 hover:text-blue-600">Sign in</router-link>
        <router-link
          to="/register"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >Sign up</router-link
        >
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
      </nav>
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
