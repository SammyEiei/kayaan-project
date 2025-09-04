<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Join Study Group</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Invite Code Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Enter Invite Code</label>
        <input
          v-model="inviteCode"
          type="text"
          placeholder="e.g., OQEI4T"
          maxlength="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg tracking-widest"
          :class="{ 'border-red-500': showError }"
        />
        <p class="text-sm text-gray-600 mt-1">
          Enter the 6-character invite code shared by a group member.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="joinGroup"
          :disabled="!inviteCode || isJoining"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isJoining">Joining...</span>
          <span v-else>Join Group</span>
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-4 p-3 rounded-md" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ message }}
      </div>

      <!-- Loading State -->
      <div v-if="isJoining" class="mt-4 text-center">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p class="text-sm text-gray-600 mt-2">Joining group...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StudyGroupService from '@/services/StudyGroupService'

interface Props {
  groupId?: number // Optional, for direct join
}

interface Emits {
  (e: 'close'): void
  (e: 'joined', group: unknown): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const studyGroupService = new StudyGroupService()

const inviteCode = ref<string>('')
const isJoining = ref<boolean>(false)
const message = ref<string>('')
const messageType = ref<'success' | 'error'>('success')
const showError = ref<boolean>(false)

// ตรวจสอบว่า invite code ถูกต้องหรือไม่
const isValidInviteCode = computed(() => {
  return inviteCode.value.length === 6 && /^[A-Z0-9]{6}$/.test(inviteCode.value.toUpperCase())
})

// เข้าร่วมกลุ่ม
const joinGroup = async () => {
  if (!isValidInviteCode.value) {
    message.value = 'Please enter a valid 6-character invite code'
    messageType.value = 'error'
    showError.value = true
    return
  }

  try {
    isJoining.value = true
    message.value = ''
    showError.value = false

    const group = await studyGroupService.joinGroup(inviteCode.value.toUpperCase())

    message.value = `Successfully joined "${group.name}"!`
    messageType.value = 'success'

    // Emit event to parent
    emit('joined', group)

    // Close modal after 2 seconds
    setTimeout(() => {
      emit('close')
    }, 2000)

  } catch (error: unknown) {
    console.error('Failed to join group:', error)
    console.error('Error type:', typeof error)
    console.error('Error keys:', error && typeof error === 'object' ? Object.keys(error) : 'N/A')
    console.error('Error userMessage:', (error as { userMessage?: string })?.userMessage)
    console.error('Error response:', (error as { response?: unknown })?.response)
    console.error('Error response data:', (error as { response?: { data?: unknown } })?.response?.data)

    // ใช้ user-friendly error message จาก axios interceptor
    if (error && typeof error === 'object' && 'userMessage' in error) {
      const axiosError = error as { userMessage?: string }
      message.value = axiosError.userMessage || 'Failed to join group. Please try again.'
      console.log('✅ Using userMessage from axios interceptor:', axiosError.userMessage)
    } else if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }

      // ใช้ error message จาก backend response
      if (axiosError.response?.data?.message) {
        message.value = axiosError.response.data.message
        console.log('✅ Using message from backend response:', axiosError.response.data.message)
      } else if (axiosError.response?.status === 400) {
        message.value = 'Invalid invite code or request'
        console.log('⚠️ Using generic 400 error message')
      } else if (axiosError.response?.status === 404) {
        message.value = 'Invalid invite code or group not found'
        console.log('⚠️ Using generic 404 error message')
      } else if (axiosError.response?.status === 403) {
        message.value = 'Access denied. Please check your permissions.'
        console.log('⚠️ Using generic 403 error message')
      } else {
        message.value = 'Failed to join group. Please try again.'
        console.log('⚠️ Using generic error message')
      }
    } else {
      message.value = 'Failed to join group. Please try again.'
      console.log('⚠️ Using fallback error message')
    }

    messageType.value = 'error'
    showError.value = true
  } finally {
    isJoining.value = false
  }
}

// Clear error when user types
const clearError = () => {
  showError.value = false
  message.value = ''
}

// Watch for changes in invite code
watch(inviteCode, clearError)
</script>
