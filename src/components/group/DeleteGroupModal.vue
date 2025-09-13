<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import type { StudyGroup } from '@/types/group'

interface Props {
  group: StudyGroup | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  delete: []
}>()

const router = useRouter()
const groupStore = useGroupStore()
const isLoading = ref(false)

const handleDelete = async () => {
  if (!props.group?.id) {
    console.error('No group ID provided')
    return
  }

  isLoading.value = true
  try {
    await groupStore.deleteGroup(props.group.id)
    console.log('✅ Group deleted successfully, closing modal and redirecting...')
    emit('delete')
    router.push('/study-groups')
  } catch (error) {
    console.error('Failed to delete group:', error)
    // Show error message to user
    alert('Failed to delete group. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Delete Group</h3>
      </div>

      <!-- Content -->
      <div class="mb-6">
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete
          <span class="font-semibold text-gray-800">{{ group?.name }}</span
          >? This action cannot be undone.
        </p>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">This will permanently delete:</p>
              <ul class="text-sm text-red-700 mt-2 space-y-1">
                <li>• All group resources and files</li>
                <li>• All member data and permissions</li>
                <li>• All group settings and configurations</li>
                <li>• All group history and activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="handleClose"
          :disabled="isLoading"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          :disabled="isLoading"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isLoading ? 'Deleting...' : 'Delete Group' }}
        </button>
      </div>
    </div>
  </div>
</template>
