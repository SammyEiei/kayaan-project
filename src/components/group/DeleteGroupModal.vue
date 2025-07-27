<script setup lang="ts">
import type { StudyGroup } from '@/types/group'

interface Props {
  group: StudyGroup | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
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
          Are you sure you want to permanently delete
          <span class="font-semibold text-gray-800">{{ group?.name }}</span
          >?
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
              <p class="text-sm font-medium text-red-800">This action cannot be undone:</p>
              <ul class="text-sm text-red-700 mt-2 space-y-1">
                <li>• All group resources will be permanently deleted</li>
                <li>• All members will be removed from the group</li>
                <li>• Group history and discussions will be lost</li>
                <li>• This action is irreversible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="emit('cancel')"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="emit('confirm')"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
        >
          Delete Group
        </button>
      </div>
    </div>
  </div>
</template>
