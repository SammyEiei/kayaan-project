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
      <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <!-- Logo and Title -->
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
                  Set New Password
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
                <p class="text-gray-600">
                  {{ success ? 'Password reset successful!' : 'Enter your new password below' }}
                </p>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    Your password has been reset successfully. Redirecting to login...
                  </p>
                </div>
              </div>
            </div>

            <!-- Error Messages -->
            <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Invalid Token Message -->
            <div v-if="invalidToken" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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
                  <p class="text-sm text-red-700">
                    This password reset link is invalid or has expired. Please request a new one.
                  </p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form
              v-if="!success && !invalidToken"
              @submit.prevent="onSubmit"
              class="space-y-6"
              novalidate
            >
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
                  >New Password</label
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
                    placeholder="Enter new password"
                  />
                </div>
                <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2"
                  >Confirm Password</label
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    v-model="confirmPassword"
                    :disabled="isLoading"
                    :class="[
                      'block w-full pl-10 pr-3 py-3 bg-white/50 border rounded-xl shadow-sm transition-all duration-200',
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      'placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50',
                    ]"
                    placeholder="Confirm new password"
                  />
                </div>
                <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                  {{ errors.confirmPassword }}
                </p>
              </div>

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
                {{ isLoading ? 'Resetting...' : 'Reset Password' }}
              </button>
            </form>

            <!-- Back to Login -->
            <div class="mt-6 text-center">
              <router-link
                to="/login"
                class="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import apiClient from '@/service/AxiosClient'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const errorMessage = ref('')
const success = ref(false)
const invalidToken = ref(false)
const token = ref('')

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
})

// Use vee-validate form
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')

// Check token on mount
onMounted(() => {
  token.value = route.query.token as string
  if (!token.value) {
    invalidToken.value = true
  }
})

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await apiClient.post('/api/v1/auth/reset-password', {
      token: token.value,
      newPassword: values.password,
    })

    success.value = true

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error: any) {
    if (error.response?.status === 400) {
      invalidToken.value = true
    } else {
      errorMessage.value =
        error.response?.data?.message || 'Failed to reset password. Please try again.'
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

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
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
