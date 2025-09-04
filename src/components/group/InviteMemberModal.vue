<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Invite Member</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Invite Code Display -->
      <div v-if="inviteCode" class="mb-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
          <div class="flex items-center gap-2">
            <input
              :value="inviteCode"
              readonly
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white font-mono text-lg text-center tracking-widest"
            />
            <button
              @click="copyInviteCode"
              class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            Share this code with people you want to invite to the group.
          </p>
        </div>
      </div>

      <!-- Generate New Invite -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Days</label>
        <select
          v-model="expiryDays"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="30" selected>30 days</option>
          <option value="90">90 days</option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="generateNewInvite"
          :disabled="isGenerating"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isGenerating">Generating...</span>
          <span v-else>Generate New Code</span>
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-4 p-3 rounded-md" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StudyGroupService from '@/services/StudyGroupService'

interface Props {
  groupId: number
  groupName: string
}

interface Emits {
  (e: 'close'): void
  (e: 'invite-generated', code: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const studyGroupService = new StudyGroupService()

const inviteCode = ref<string>('')
const expiryDays = ref<number>(30)
const isGenerating = ref<boolean>(false)
const message = ref<string>('')
const messageType = ref<'success' | 'error'>('success')

// ดึง invite code ปัจจุบันเมื่อ component mount
onMounted(async () => {
  try {
    const invite = await studyGroupService.getGroupInviteCode(props.groupId)
    inviteCode.value = invite.token
  } catch (error) {
    console.error('Failed to get current invite code:', error)
    message.value = 'Failed to load current invite code'
    messageType.value = 'error'
  }
})

// สร้าง invite code ใหม่
const generateNewInvite = async () => {
  try {
    isGenerating.value = true
    message.value = ''

    const newInvite = await studyGroupService.generateInvite(props.groupId, expiryDays.value)
    inviteCode.value = newInvite.token

    message.value = 'New invite code generated successfully!'
    messageType.value = 'success'

    // Emit event to parent
    emit('invite-generated', newInvite.token)

    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: unknown) {
    console.error('Failed to generate new invite:', error)
    message.value = 'Failed to generate new invite code'
    messageType.value = 'error'
  } finally {
    isGenerating.value = false
  }
}

// คัดลอก invite code
const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(inviteCode.value)
    message.value = 'Invite code copied to clipboard!'
    messageType.value = 'success'

    // Clear message after 2 seconds
    setTimeout(() => {
      message.value = ''
    }, 2000)
  } catch (error) {
    console.error('Failed to copy invite code:', error)
    message.value = 'Failed to copy invite code'
    messageType.value = 'error'
  }
}
</script>
