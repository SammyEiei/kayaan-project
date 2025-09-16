<script setup lang="ts">
import type { StudyGroup } from '@/types/group'

interface Props {
  group: StudyGroup
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<{
  view: [groupId: string]
  edit: [groupId: string]
  delete: [groupId: string]
}>()

const getGroupIcon = (groupName: string) => {
  return groupName.charAt(0).toUpperCase()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getRoleBadgeColor = (isOwner: boolean, userRole: string) => {
  if (isOwner) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
  if (userRole === 'moderator') return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
  return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
}

const getRoleLabel = (isOwner: boolean, userRole: string) => {
  if (isOwner) return 'Owner'
  if (userRole === 'moderator') return 'Moderator'
  return 'Member'
}
</script>

<template>
  <div
    class="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
    @click="emit('view', group.id)"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-200"
        >
          {{ getGroupIcon(group.name) }}
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors text-lg mb-1">
            {{ group.name }}
          </h3>
          <span
            :class="getRoleBadgeColor(group.isOwner, group.userRole)"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ getRoleLabel(group.isOwner, group.userRole) }}
          </span>
        </div>
      </div>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{{ group.description }}</p>

    <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-blue-100 rounded-lg">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <span class="font-medium">{{ group.memberCount || 0 }} members</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-green-100 rounded-lg">
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <span class="font-medium">{{ formatDate(group.createdAt) }}</span>
      </div>
    </div>

    <div
      v-if="showActions"
      class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <!-- <button
        v-if="group.isOwner"
        @click.stop="emit('edit', group.id)"
        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        title="Edit group"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button> -->
      <button
        v-if="group.isOwner"
        @click.stop="emit('delete', group.id)"
        class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        title="Delete group"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
