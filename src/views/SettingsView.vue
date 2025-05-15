<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: 'Kai Nakamura',
  email: 'kai@example.com',
  profileImage: null,
})

const settings = ref({
  notifications: {
    email: true,
    browser: true,
    mobile: false,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
  },
  privacy: {
    profileVisibility: 'public',
    showActivity: true,
  },
})

const saveSettings = () => {
  // Logic to save settings
  console.log('Saving settings...', settings.value)
  alert('Settings saved successfully!')
}
</script>

<template>
  <main class="p-6 bg-gray-100 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Settings</h1>
      <p class="text-gray-600 mt-2">Customize your Kayaan experience</p>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Settings Tabs -->
      <div class="flex border-b border-gray-200">
        <button class="px-6 py-3 border-b-2 border-purple-600 text-purple-600 font-medium">
          Account
        </button>
        <button class="px-6 py-3 text-gray-500 hover:text-gray-700">Notifications</button>
        <button class="px-6 py-3 text-gray-500 hover:text-gray-700">Appearance</button>
        <button class="px-6 py-3 text-gray-500 hover:text-gray-700">Privacy</button>
      </div>

      <!-- Account Settings -->
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6">Account Settings</h2>

        <div class="flex flex-col md:flex-row md:items-start mb-8">
          <div
            class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-4 md:mb-0 md:mr-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>

          <div class="flex-1">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="user.name"
                type="text"
                id="name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="user.email"
                type="email"
                id="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <div class="flex items-center mt-1">
                <button
                  class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
                >
                  Change Photo
                </button>
                <button class="px-4 py-2 text-red-600 hover:text-red-800 ml-4">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium mb-4">Password</h3>

          <div class="mb-4">
            <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1"
              >Current Password</label
            >
            <input
              type="password"
              id="current-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div class="mb-4">
            <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1"
              >New Password</label
            >
            <input
              type="password"
              id="new-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div class="mb-4">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1"
              >Confirm New Password</label
            >
            <input
              type="password"
              id="confirm-password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button class="px-6 py-2 bg-gray-200 text-gray-700 rounded-md mr-3 hover:bg-gray-300">
            Cancel
          </button>
          <button
            @click="saveSettings"
            class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
