<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import type { JoinGroupByCodeRequest } from '@/types/group'

const router = useRouter()
const groupStore = useGroupStore()

const emit = defineEmits<{
  close: []
  joined: [groupId: string]
}>()

const inviteCode = ref('')
const isJoining = ref(false)
const error = ref<string | null>(null)

const joinGroup = async () => {
  if (!inviteCode.value.trim()) {
    error.value = 'Please enter an invite code'
    return
  }

  isJoining.value = true
  error.value = null

  try {
    const request: JoinGroupByCodeRequest = {
      inviteCode: inviteCode.value.trim().toUpperCase(),
    }

    const group = await groupStore.joinGroupByCode(request)
    emit('joined', group.id)

    // Redirect to the group
    router.push(`/study-groups/${group.id}`)
  } catch (err: unknown) {
    // แสดง user-friendly message จาก Backend หรือ fallback message
    const errorObj = err as { userMessage?: string; response?: { data?: { message?: string } }; message?: string }
    error.value = errorObj.userMessage || errorObj.response?.data?.message || errorObj.message || 'Failed to join group. Please check your invite code.'
    console.error('Join group error:', err)
  } finally {
    isJoining.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    joinGroup()
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Join Study Group</h3>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Invite Code Input -->
        <div>
          <label for="inviteCode" class="block text-sm font-medium text-gray-700 mb-3">
            Enter Invite Code
          </label>
          <div class="relative">
            <input
              id="inviteCode"
              v-model="inviteCode"
              type="text"
              placeholder="Enter the invite code..."
              @keypress="handleKeyPress"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-center text-lg font-mono tracking-widest"
              :disabled="isJoining"
            />
          </div>
          <p class="text-xs text-gray-500 mt-2 text-center">
            Enter the invite code provided by your group administrator
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            @click="joinGroup"
            :disabled="isJoining || !inviteCode.trim()"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              v-if="!isJoining"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <div
              v-else
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
            <span v-if="!isJoining">Join Group</span>
            <span v-else>Joining...</span>
          </button>
          <button
            @click="closeModal"
            :disabled="isJoining"
            class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
