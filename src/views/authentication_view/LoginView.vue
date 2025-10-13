<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
    ></div>

    <div class="flex min-h-screen relative z-10">
      <!-- Left Side - Login Form -->
      <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
          <!-- Login Card -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <!-- Enhanced Logo and Title -->
            <div class="text-center mb-8">
              <div class="flex justify-center mb-6">
                <router-link to="/" class="group">
                  <div class="relative">
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <div
                      class="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                    >
                      <!-- Kayaan Minimal Face Logo -->
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center kayaan-face relative kayaan-logo">
                        <!-- Sparkles -->
                        <div class="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full opacity-70 kayaan-sparkle"></div>
                        <div class="absolute bottom-1 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full opacity-60 kayaan-sparkle-small"></div>

                        <!-- Cheeks -->
                        <div class="absolute left-1 bottom-3 w-1 h-1 bg-pink-300 rounded-full opacity-60 kayaan-blush"></div>
                        <div class="absolute right-1 bottom-3 w-1 h-1 bg-pink-300 rounded-full opacity-60 kayaan-blush"></div>

                        <!-- Minimal Face -->
                        <div class="relative kayaan-eye-container">
                          <!-- Eyes -->
                          <div class="flex gap-1.5 mb-1">
                            <div class="w-2 h-2 bg-slate-600 rounded-full kayaan-eye"></div>
                            <div class="w-2 h-2 bg-slate-600 rounded-full kayaan-eye"></div>
                          </div>
                          <!-- Smile -->
                          <div class="w-4 h-2 border-b-2 border-slate-600 rounded-full kayaan-smile"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>

              <div class="space-y-2">
                <h2
                  class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent"
                >
                  Welcome Back
                </h2>
                <div class="flex items-center justify-center gap-2">
                  <span
                    class="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Kayaan
                  </span>
                  <span class="text-gray-400">|</span>
                  <span class="text-sm text-gray-500 font-medium">Learning Hub</span>
                </div>
                <p class="text-gray-600">Sign in to your account</p>
              </div>
            </div>

            <!-- Server Error Message -->
            <div v-if="serverError" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ serverError }}</p>
                </div>
              </div>
            </div>

            <!-- Login Error -->
            <div v-if="loginError" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{{ loginError }}</p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center"
            >
              <svg class="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-green-700 text-sm">{{ successMessage }}</span>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="onSubmit" class="space-y-6" novalidate>
              <!-- Username Field -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2"
                  >Username</label
                >
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    v-model="username"
                    :disabled="isLoading"
                    :class="[
                      'block w-full pl-10 pr-3 py-3 bg-white/50 border rounded-xl shadow-sm transition-all duration-200',
                      errors.username
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50',
                    ]"
                    placeholder="Enter your username"
                  />
                </div>
                <p v-if="errors.username" class="mt-2 text-sm text-red-600">
                  {{ errors.username }}
                </p>
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    v-model="password"
                    :disabled="isLoading"
                    :class="[
                      'block w-full pl-10 pr-3 py-3 bg-white/50 border rounded-xl shadow-sm transition-all duration-200',
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50',
                    ]"
                    placeholder="Enter your password"
                  />
                </div>
                <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    :disabled="isLoading"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <router-link
                    to="/forgot-password"
                    class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </router-link>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    class="h-5 w-5 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </button>
            </form>

            <!-- Sign Up Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Create one now
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Enhanced Feature Showcase -->
      <div class="hidden lg:block lg:w-1/2 relative">
        <div
          class="h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
            <div class="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
            <div
              class="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"
            ></div>
          </div>

          <div class="relative h-full flex flex-col justify-center px-12 py-12">
            <div class="max-w-lg mx-auto">
              <!-- Enhanced Logo in Right Panel -->
              <div class="text-center mb-8">
                <div class="inline-flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center kayaan-logo"
                  >
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center kayaan-face relative kayaan-logo">
                      <!-- Sparkles -->
                      <div class="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full opacity-70 kayaan-sparkle"></div>
                      <div class="absolute bottom-1 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full opacity-60 kayaan-sparkle-small"></div>

                      <!-- Cheeks -->
                      <div class="absolute left-1 bottom-3 w-1 h-1 bg-pink-300 rounded-full opacity-60 kayaan-blush"></div>
                      <div class="absolute right-1 bottom-3 w-1 h-1 bg-pink-300 rounded-full opacity-60 kayaan-blush"></div>

                      <!-- Minimal Face -->
                      <div class="relative kayaan-eye-container">
                        <!-- Eyes -->
                        <div class="flex gap-1.5 mb-1">
                          <div class="w-2 h-2 bg-slate-600 rounded-full kayaan-eye"></div>
                          <div class="w-2 h-2 bg-slate-600 rounded-full kayaan-eye"></div>
                        </div>
                        <!-- Smile -->
                        <div class="w-4 h-2 border-b-2 border-slate-600 rounded-full kayaan-smile"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-white">Kayaan</div>
                    <div class="text-sm text-blue-200">Learning Hub</div>
                  </div>
                </div>
              </div>

              <h2 class="text-4xl font-bold text-white mb-4">Boost Your Productivity</h2>
              <p class="text-xl text-blue-100 mb-12">
                Join thousands of users who've transformed their workflow with Kayaan
              </p>

              <!-- Enhanced Feature List -->
              <div class="space-y-8">
                <div class="flex items-start group">
                  <div class="flex-shrink-0 mr-4">
                    <div
                      class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                    >
                      <svg
                        class="h-6 w-6 text-blue-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white mb-2">Smart Task Management</h3>
                    <p class="text-blue-100">
                      Organize your tasks efficiently with our intuitive interface and smart
                      categorization
                    </p>
                  </div>
                </div>

                <div class="flex items-start group">
                  <div class="flex-shrink-0 mr-4">
                    <div
                      class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                    >
                      <svg
                        class="h-6 w-6 text-blue-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white mb-2">Pomodoro Timer</h3>
                    <p class="text-blue-100">
                      Stay focused with our built-in Pomodoro technique timer and break reminders
                    </p>
                  </div>
                </div>

                <div class="flex items-start group">
                  <div class="flex-shrink-0 mr-4">
                    <div
                      class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                    >
                      <svg
                        class="h-6 w-6 text-blue-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white mb-2">Study Groups</h3>
                    <p class="text-blue-100">
                      Collaborate with others in study groups for better learning and accountability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const serverError = ref('')
const loginError = ref('')
const successMessage = ref('')

// สร้าง schema สำหรับ validation
const schema = yup.object({
  username: yup.string().required('The username is required'),
  password: yup.string().required('Password is required'),
})

// ใช้ useForm จาก vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: username } = useField('username')
const { value: password } = useField('password')

// ฟังก์ชันสำหรับการ login
const onSubmit = handleSubmit(async (values) => {
  loginError.value = ''
  isLoading.value = true
  successMessage.value = ''
  try {
    await authStore.login(values.username, values.password)
    successMessage.value = 'Sign in successfully'
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push({ name: 'dashboard' })
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.data?.message?.toLowerCase().includes('not found')
    ) {
      loginError.value = 'No user found in the database. Please try again.'
    } else {
      loginError.value =
        error.response?.data?.message || 'Incorrect username or password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Kayaan Logo Animations */
.kayaan-logo {
  transition: all 0.2s ease;
  position: relative;
}

.kayaan-logo:hover {
  transform: scale(1.02);
  border-color: #f472b6;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
}

.kayaan-face {
  /* No default animation for minimal look */
}

.kayaan-eye-container {
  animation: eye-movement 8s ease-in-out infinite;
}

.kayaan-eye {
  animation: blink 3s infinite;
}

@keyframes blink {
  0%, 90%, 100% { opacity: 1; }
  95% { opacity: 0.3; }
}

@keyframes eye-movement {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(0.5px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(-0.5px); }
}

.kayaan-smile {
  /* No animation for minimal look */
}

/* Sparkle Animations */
.kayaan-sparkle {
  animation: sparkle-pulse 2s ease-in-out infinite;
}

.kayaan-sparkle-small {
  animation: sparkle-pulse 2s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes sparkle-pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Blush Animation */
.kayaan-blush {
  animation: blush-glow 4s ease-in-out infinite;
}

@keyframes blush-glow {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-timing-function: ease;
  transition-duration: 200ms;
}

/* Enhanced focus states */
input:focus {
  transform: translateY(-1px);
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
