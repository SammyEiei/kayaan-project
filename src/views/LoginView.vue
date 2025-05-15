<script setup lang="ts">
// Import necessary components or methods for login
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  // Logic for login
  console.log('Logging in...', { email: email.value, password: password.value })

  // Simulating successful login
  // ในโปรเจคจริง คุณควรตรวจสอบข้อมูลล็อกอินกับ API แล้วนำทางไปที่ dashboard หลังจากล็อกอินสำเร็จ
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <main class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-8">Login</h1>
      <form @submit.prevent="login" class="space-y-6">
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
        <button
          type="submit"
          class="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-green-600 hover:text-green-700"
            >Sign up</router-link
          >
        </p>
        <p class="text-sm text-gray-600 mt-2">
          <a href="#" class="text-green-600 hover:text-green-700">Forgot password?</a>
        </p>
      </div>
    </div>
  </main>
</template>
