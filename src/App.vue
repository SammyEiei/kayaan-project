<script setup lang="ts">
import { RouterView } from 'vue-router'
import Employee from './components/Employee.vue'



</script>



<template>
  <div class="flex min-h-screen w-full bg-gray-50">
    <!-- Sidebar -->
    <aside class="bg-white shadow-md w-64 min-w-64 flex flex-col">
      <!-- Logo -->
      <div class="flex items-center p-5">
        <div
          class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg mr-3 text-lg font-bold"
        >
          K
        </div>
        <h1 class="text-xl font-bold">Kayaan</h1>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-4 flex-1">
        <router-link
          to="/dashboard"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          Dashboard
        </router-link>
        <router-link
          to="/flashcards"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          Flashcards & Quizzes
        </router-link>
        <router-link
          to="/study-groups"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          Study Groups
        </router-link>
        <router-link
          to="/pomodoro"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          Pomodoro Timer
        </router-link>
        <router-link
          to="/settings"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          Settings
        </router-link>
      </nav>

      <nav class="px-4 pb-4">
        <router-link
          to="/login"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Logout
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 h-screen overflow-y-auto">
      <!-- Topbar -->
      <header class="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <!-- Search Icon SVG -->
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button class="text-gray-700 hover:text-gray-900">
            <!-- Notification Icon SVG -->
          </button>
          <div
            class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm"
          >
            KN
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-grow p-4 bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
  <div id="app">
    <Employee />
  </div>
</template>
