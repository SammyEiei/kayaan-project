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
  leave: []
  delete: []
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
  <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-4">
        <div
          class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent"
            >
              {{ group.name }}
            </h1>
            <span
              v-if="group.isOwner"
              class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium rounded-full"
            >
              Owner
            </span>
            <span
              v-else-if="viewerRole === 'admin'"
              class="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-sm font-medium rounded-full"
            >
              Admin
            </span>
            <span
              v-else
              class="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-medium rounded-full"
            >
              Member
            </span>
          </div>
          <p class="text-gray-600 text-lg mb-2">{{ group.description }}</p>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{{ memberCount }} members</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Created {{ formatDate(group.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          v-if="!group.isOwner"
          @click="emit('leave')"
          class="px-6 py-3 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:shadow-md flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Leave Group
        </button>
        <button
          v-if="group.isOwner"
          @click="emit('delete')"
          class="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete Group
        </button>
      </div>
    </div>
  </div>
</template>
