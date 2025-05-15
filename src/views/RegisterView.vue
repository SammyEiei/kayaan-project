<script setup lang="ts">
// Import necessary components or methods for registration
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {
  // Logic for registration
  console.log('Registering...', {
    name: name.value,
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <main class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-8">Create Account</h1>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Enter your name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            id="confirm-password"
            placeholder="Enter your password again"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 mt-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Sign Up
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-green-600 hover:text-green-700">Log in</router-link>
        </p>
      </div>
    </div>
  </main>
</template>
