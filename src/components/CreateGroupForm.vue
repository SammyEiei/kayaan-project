<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()
const name = ref('')
const description = ref('')

const submit = async () => {
  if (!name.value) return
  await groupStore.createGroup({ name: name.value, description: description.value })
  name.value = ''
  description.value = ''
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
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Study Group
      </button>
    </form>
  </div>
</template>
