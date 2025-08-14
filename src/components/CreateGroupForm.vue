<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()
const name = ref('')
const description = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const submit = async () => {
  if (!name.value) return

  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    await groupStore.createGroup({ name: name.value, description: description.value })
    success.value = 'Study group created successfully!'
    name.value = ''
    description.value = ''

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Failed to create study group. Please try again.'
    console.error('Create group error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl">
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900">Create New Study Group</h2>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
      <div class="flex items-center gap-2 text-red-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
      <div class="flex items-center gap-2 text-green-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ success }}</span>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label for="groupName" class="block text-sm font-medium text-gray-700 mb-2">
          Group Name
        </label>
        <input
          id="groupName"
          v-model="name"
          type="text"
          placeholder="Enter group name..."
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm"
          required
          :disabled="isLoading"
        />
      </div>

      <div>
        <label for="groupDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="groupDescription"
          v-model="description"
          placeholder="Describe your study group..."
          rows="3"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm resize-none"
          :disabled="isLoading"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
      >
        <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ isLoading ? 'Creating...' : 'Create Study Group' }}
      </button>
    </form>
  </div>
</template>
