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
  <div class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-6 py-4">
      <!-- Main Header Content -->
      <div class="flex items-center justify-between">

        <!-- Left Section: Group Identity -->
        <div class="flex items-center gap-4">
          <!-- Group Icon -->
          <div class="relative">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 1200 1200">
                <path d="M596.847 188.488c-103.344 0-187.12 97.81-187.12 218.465c0 83.678 40.296 156.352 99.468 193.047l-68.617 31.801l-182.599 84.688c-17.64 8.821-26.444 23.778-26.444 44.947v201.102c1.451 25.143 16.537 48.577 40.996 48.974h649.62c27.924-2.428 42.05-24.92 42.325-48.974V761.436c0-21.169-8.804-36.126-26.443-44.947l-175.988-84.688l-73.138-34.65c56.744-37.521 95.061-108.624 95.061-190.197c-.001-120.656-83.778-218.466-187.121-218.466zm-301.824 76.824c-44.473 1.689-79.719 20.933-106.497 51.596c-29.62 36.918-44.06 80.75-44.339 124.354c1.819 64.478 30.669 125.518 82.029 157.446L21.163 693.997C7.05 699.289 0 711.636 0 731.041v161.398c1.102 21.405 12.216 39.395 33.055 39.703h136.284V761.436c2.255-45.639 23.687-82.529 62.196-100.531l136.247-64.817c10.584-6.175 20.731-14.568 30.433-25.152c-56.176-86.676-63.977-190.491-27.773-281.801c-23.547-14.411-50.01-23.672-75.419-23.823zm608.586 0c-29.083.609-55.96 11.319-78.039 26.444c35.217 92.137 25.503 196.016-26.482 276.52c11.467 13.23 23.404 23.377 35.753 30.434l130.965 62.195c39.897 21.881 60.47 59.098 60.866 100.532v170.707h140.235c23.063-1.991 32.893-20.387 33.093-39.704V731.042c0-17.641-7.05-29.987-21.163-37.045l-202.431-96.618c52.498-38.708 78.859-96.72 79.369-156.117c-1.396-47.012-15.757-90.664-44.339-124.354c-29.866-32.399-66.91-51.253-107.827-51.596z"/>
              </svg>
            </div>
            <!-- Status Indicator -->
            <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
          </div>

          <!-- Group Information -->
          <div class="flex-1">
            <!-- Title Row with Badges -->
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h1 class="text-xl font-bold text-gray-900">
                {{ group.name }}
              </h1>

              <!-- Role Badge -->
              <span
                v-if="group.isOwner"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded border border-yellow-200"
              >
                Owner
              </span>
              <span
                v-else-if="viewerRole === 'admin'"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200"
              >
                Admin
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200"
              >
                Member
              </span>

              <!-- Privacy Indicator -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                Private
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm mb-2 max-w-2xl">
              {{ group.description || 'Welcome to our community group' }}
            </p>

            <!-- Statistics Row -->
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 13C18.67 13 24 14.33 24 17V20H8V17C8 14.33 13.33 13 16 13M8 12C10.2 12 12 10.2 12 8S10.2 4 8 4 4 5.8 4 8 5.8 12 8 12M8 13C5.33 13 0 14.33 0 17V20H6V17C6 15.9 6.9 15 8 15S10 15.9 10 17V20H16V17C16 14.33 10.67 13 8 13Z"/>
                </svg>
                <span>{{ memberCount }} members</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V8H19V19M19 6H5V5H19V6M7 10H9V12H7V10M11 10H13V12H11V10M15 10H17V12H15V10M7 14H9V16H7V14M11 14H13V16H11V14M15 14H17V16H15V14Z"/>
                </svg>
                <span>{{ formatDate(group.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
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
              class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-600 rounded text-sm font-medium transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
              <span>Invite</span>
            </button>

            <!-- <button
              @click="emit('edit-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              <span>Edit</span>
            </button> -->

            <button
              @click="emit('delete-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors duration-200 border border-red-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
              </svg>
              <span>Delete</span>
            </button>
          </template>

          <!-- Member Actions -->
          <template v-else>
            <button
              @click="emit('leave-group')"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
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
