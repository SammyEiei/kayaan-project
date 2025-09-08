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
  <!-- Compact Group Header Layout -->
  <div class="bg-gradient-to-r from-blue-600 to-blue-700 shadow-md">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <!-- Main Header Content -->
      <div class="flex items-center justify-between">

        <!-- Left Section: Group Identity -->
        <div class="flex items-center gap-4">
          <!-- Group Icon -->
          <div class="relative">
            <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <!-- Status Indicator -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>

          <!-- Group Information -->
          <div class="flex-1">
            <!-- Title Row with Badges -->
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h1 class="text-xl font-bold text-white">
                {{ group.name }}
              </h1>

              <!-- Role Badge -->
              <span
                v-if="group.isOwner"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400/20 backdrop-blur-sm text-yellow-100 text-xs font-medium rounded-full border border-yellow-300/30"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Owner
              </span>
              <span
                v-else-if="viewerRole === 'admin'"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-400/20 backdrop-blur-sm text-purple-100 text-xs font-medium rounded-full border border-purple-300/30"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
                Admin
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                Member
              </span>

              <!-- Privacy Indicator -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium rounded-lg border border-white/20">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
                Private
              </span>
            </div>

            <!-- Description -->
            <p class="text-white/90 text-sm mb-2 max-w-2xl">
              {{ group.description || 'Welcome to our community group' }}
            </p>

            <!-- Statistics Row -->
            <div class="flex items-center gap-4 text-xs text-white/70">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>{{ memberCount }} members</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(group.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section: Actions -->
        <div class="flex items-center gap-2">
          <!-- Admin/Owner Actions -->
          <template v-if="group.isOwner || viewerRole === 'admin'">
            <button
              @click="emit('generate-invite-code')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 hover:bg-white/90 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <span>Invite</span>
            </button>

            <button
              @click="emit('edit-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 border border-white/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Edit</span>
            </button>

            <button
              @click="emit('delete-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur-sm text-red-100 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all duration-200 border border-red-400/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span>Delete</span>
            </button>
          </template>

          <!-- Member Actions -->
          <template v-else>
            <button
              @click="emit('leave-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/30 hover:border-red-400/50 rounded-lg text-sm font-medium transition-all duration-200 border border-white/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Leave Group</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Optional: Animation styles -->
<style>
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
