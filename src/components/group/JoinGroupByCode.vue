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
  } catch (err: any) {
    error.value = err.message || 'Failed to join group. Please check your invite code.'
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
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
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
              @keypress="handleKeyPress"
              type="text"
              placeholder="e.g., CS2024"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-wider uppercase"
              :class="error ? 'border-red-300 focus:ring-red-500' : ''"
              maxlength="8"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                class="w-5 h-5 text-gray-400"
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
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-2 flex items-center gap-2 text-sm text-red-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            {{ error }}
          </div>
        </div>

        <!-- Join Button -->
        <button
          @click="joinGroup"
          :disabled="!inviteCode.trim() || isJoining"
          class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg v-if="isJoining" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
          <span v-else>Join Group</span>
        </button>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 class="font-medium text-blue-900 mb-2">How to get an invite code:</h5>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Ask the group owner or moderator for an invite code</li>
            <li>• Invite codes are usually 4-8 characters long</li>
            <li>• Codes are case-insensitive</li>
            <li>• Codes may expire after a certain time</li>
          </ul>
        </div>

        <!-- Example Codes -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 class="font-medium text-gray-900 mb-2">Example invite codes:</h5>
          <div class="flex gap-2 flex-wrap">
            <span class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono"
              >CS2024</span
            >
            <span class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono"
              >MATH2024</span
            >
            <span class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono"
              >STUDY123</span
            >
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
