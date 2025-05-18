<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen w-full bg-gray-50">
    <!-- Sidebar -->
    <aside class="bg-white shadow-md w-64 min-w-64 flex flex-col border-r border-gray-200">
      <!-- Logo -->
      <div class="flex items-center p-5 border-b border-gray-200">
        <div
          class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl mr-3 text-lg font-bold shadow-sm"
        >
          K
        </div>
        <h1
          class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
        >
          Kayaan
        </h1>
      </div>

      <!-- Navigation -->
      <!-- <nav class="mt-6 px-4 flex-1">
        <router-link
          to="/dashboard"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Dashboard
        </router-link>
        <router-link
          to="/flashcards"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Flashcards & Quizzes
        </router-link>
        <router-link
          to="/study-groups"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Study Groups
        </router-link>
        <router-link
          to="/pomodoro"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Pomodoro Timer
        </router-link>
        <router-link
          to="/settings"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mb-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </router-link>
      </nav> -->

      <!-- Log out Function -->
      <!-- <nav class="px-4 pb-4 border-t border-gray-200">
        <router-link
          to="/login"
          class="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </router-link>
      </nav> -->
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 h-screen overflow-y-auto">
      <!-- Topbar -->
      <header
        class="bg-white shadow-sm py-3 px-6 flex justify-between items-center border-b border-gray-200"
      >
        <!-- <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <div class="absolute left-3 top-2.5 text-gray-400"> -->
        <!-- Search Icon SVG -->
        <!-- </div>
        </div> -->

        <!-- <div class="flex items-center space-x-3">
          <button class="text-gray-700 hover:text-gray-900"> -->
        <!-- Notification Icon SVG -->
        <!-- </button>
          <div
            class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm"
          >
            KN
          </div>
        </div> -->
      </header>

      <!-- Page Content -->
      <main class="flex-grow p-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style>
* {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}
</style>
