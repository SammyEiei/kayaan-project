<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'

const router = useRouter()
const groupStore = useGroupStore()

const name = ref('')
const description = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)


const emit = defineEmits<{
  close: []
}>()

const submit = async () => {
  if (!name.value.trim() || !description.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const newGroup = await groupStore.createGroup({ name: name.value, description: description.value })
    success.value = 'Study group created successfully!'
    name.value = ''
    description.value = ''

    // Refresh groups to make sure the new group is in the list
    await groupStore.fetchGroups()

    // Clear success message after 2 seconds and redirect to group detail
    setTimeout(() => {
      success.value = ''
      emit('close')
      // Redirect to the newly created group
      router.push(`/study-groups/${newGroup.id}`)
    }, 2000)
  } catch (err: unknown) {
    error.value = (err as Error)?.message || 'Failed to create study group. Please try again.'
    console.error('Create group error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center relative"
        >
          <svg class="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 512 512">
            <path d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0"/>
            <path d="M386.34 193.66L264.45 315.79A41.1 41.1 0 0 1 247.58 326l-25.9 8.67a35.92 35.92 0 0 1-44.33-44.33l8.67-25.9a41.1 41.1 0 0 1 10.19-16.87l122.13-121.91a8 8 0 0 0-5.65-13.66H104a56 56 0 0 0-56 56v240a56 56 0 0 0 56 56h240a56 56 0 0 0 56-56V199.31a8 8 0 0 0-13.66-5.65"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900">Create New Study Group</h3>
          <p class="text-sm text-gray-600">Start collaborating with others</p>
        </div>
      </div>
      <!-- <button
        @click="handleClose"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> -->
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center gap-2 text-red-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-sm font-medium">{{ error }}</span>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center gap-2 text-green-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium">{{ success }}</span>
      </div>
    </div>

    <!-- Development Warning -->
    <!-- <div v-if="isDevelopmentMode" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2 text-blue-700">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm font-medium">Development Mode: Using mock data</span>
      </div>
    </div> -->

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          id="description"
          v-model="description"
          required
          rows="3"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
          placeholder="Describe your study group"
        ></textarea>
      </div>

      <div class="flex items-center gap-3 pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            v-if="isLoading"
            class="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span v-else>Create Group</span>
        </button>
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
