<script setup lang="ts">
import { computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { StudyGroup } from '@/types/group'

const props = defineProps<{
  group: StudyGroup
  viewerRole?: 'member' | 'admin'        // <- รับค่าจากภายนอก
  memberCount?: number                   // <- รับค่าจากภายนอก
}>()

const emit = defineEmits<{
  'leave-group': []
  'delete-group': []
  'edit-group': []
  'generate-invite-code': []
  'back-to-groups': []
  'back-to-dashboard': []
}>()

const groupStore = useGroupStore()

// ใช้ค่าจาก props ก่อน ถ้าไม่มีค่อย fallback ไปที่ store
const viewerRole = computed(() => props.viewerRole ?? groupStore.viewerRole ?? 'member')
const memberCount = computed(() =>
  props.memberCount ?? groupStore.memberCount ?? groupStore.currentGroupMembers.length ?? 0
)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <!-- Group Header Content -->
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-xl font-semibold text-gray-900">
              {{ group.name }}
            </h1>
            <span
              v-if="group.isOwner"
              class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded"
            >
              Owner
            </span>
            <span
              v-else-if="viewerRole === 'admin'"
              class="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded"
            >
              Admin
            </span>
            <span
              v-else
              class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded"
            >
              Member
            </span>
          </div>
          <p class="text-gray-600 text-sm mb-2">{{ group.description }}</p>
          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span>{{ memberCount }} members</span>
            <span>•</span>
            <span>Created {{ formatDate(group.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          v-if="group.isOwner || viewerRole === 'admin'"
          @click="emit('generate-invite-code')"
          class="px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-150"
        >
          Generate Code
        </button>
        <button
          v-if="group.isOwner || viewerRole === 'admin'"
          @click="emit('edit-group')"
          class="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors duration-150"
        >
          Edit
        </button>
        <button
          v-if="group.isOwner || viewerRole === 'admin'"
          @click="emit('delete-group')"
          class="px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-150"
        >
          Delete
        </button>
        <button
          v-if="!group.isOwner && viewerRole !== 'admin'"
          @click="emit('leave-group')"
          class="px-2 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-medium transition-colors duration-150"
        >
          Leave
        </button>
      </div>
    </div>
  </div>
</template>
