<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()

onMounted(() => {
  groupStore.fetchGroups()
})
</script>

<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl">
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900">My Study Groups</h2>
    </div>

    <!-- Loading State -->
    <div v-if="groupStore.loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <div
          class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-gray-600 font-medium">Loading groups...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!groupStore.groups || groupStore.groups.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No study groups yet</h3>
      <p class="text-gray-500 mb-4">
        Create your first study group to start collaborating with others
      </p>
    </div>

    <!-- Groups List -->
    <div v-else class="space-y-4">
      <div
        v-for="group in groupStore.groups"
        :key="group.id"
        class="group bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100 hover:border-blue-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-200"
            >
              {{ group.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                {{ group.name }}
              </h4>
              <p class="text-sm text-gray-500">{{ group.members || 0 }} members</p>
            </div>
          </div>
          <button
            class="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
          >
            <span>View</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
