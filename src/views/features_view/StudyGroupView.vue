<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import CreateGroupForm from '@/components/CreateGroupForm.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import JoinGroupByCode from '@/components/group/JoinGroupByCode.vue'
import DeleteGroupModal from '@/components/group/DeleteGroupModal.vue'
import type { StudyGroup } from '@/types/group'

const router = useRouter()
const groupStore = useGroupStore()

onMounted(() => {
  groupStore.fetchGroups()
})

const handleViewGroup = (groupId: string) => {
  router.push(`/study-groups/${groupId}`)
}

const handleEditGroup = (groupId: string) => {
  // TODO: Implement edit group functionality
  console.log('Edit group:', groupId)
}

const showDeleteModal = ref(false)
const selectedGroupForDelete = ref<StudyGroup | null>(null)

const handleDeleteGroup = (groupId: string) => {
  const group = groupStore.userGroups.find(g => g.id === groupId)
  selectedGroupForDelete.value = group || null
  showDeleteModal.value = true
}

const handleDeleteConfirmed = () => {
  showDeleteModal.value = false
  selectedGroupForDelete.value = null
}

const showJoinByCodeModal = ref(false)
const showAllGroups = ref(false)

const handleJoinByCode = () => {
  showJoinByCodeModal.value = true
}


const handleGroupJoined = () => {
  // Don't close modal immediately, let animation complete first
  // The animation will handle the redirect and modal closing
}

// Computed properties for stats
const groupStats = computed(() => {
  const groups = groupStore.userGroups
  const totalGroups = groups.length
  const ownedGroups = groups.filter(g => g.isOwner).length
  const memberGroups = groups.filter(g => !g.isOwner).length
  const totalMembers = groups.reduce((sum, g) => sum + g.memberCount, 0)
  const recentGroups = groups.filter(g => {
    const createdDate = new Date(g.createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return createdDate > thirtyDaysAgo
  }).length

  return {
    totalGroups,
    ownedGroups,
    memberGroups,
    totalMembers,
    recentGroups
  }
})

</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>

          <div class="relative z-10 text-center">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-4 ring-white ring-opacity-30 shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h1 class="text-3xl font-bold mb-2">Study Groups</h1>
            <p class="text-blue-100 max-w-2xl mx-auto">
              Collaborate and learn together with your study groups
            </p>
          </div>
        </div>
      </div>

      <!-- Dashboard Overview Section -->
      <div class="mb-6">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <!-- Section Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Overview</h2>
              <p class="text-xs text-gray-600">Your groups at a glance</p>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <!-- Total Groups Card -->
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md group">
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full opacity-20 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
              <div class="relative z-10 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-1">{{ groupStats.totalGroups }}</div>
                <div class="text-xs text-gray-700 font-medium">Total Groups</div>
              </div>
            </div>

            <!-- Owned Groups Card -->
            <div class="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-md group">
              <div class="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full opacity-20 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
              <div class="relative z-10 text-center">
                <div class="text-3xl font-bold text-green-600 mb-1">{{ groupStats.ownedGroups }}</div>
                <div class="text-xs text-gray-700 font-medium">You Own</div>
              </div>
            </div>

            <!-- Member Groups Card -->
            <div class="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-md group">
              <div class="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full opacity-20 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
              <div class="relative z-10 text-center">
                <div class="text-3xl font-bold text-purple-600 mb-1">{{ groupStats.memberGroups }}</div>
                <div class="text-xs text-gray-700 font-medium">You Joined</div>
              </div>
            </div>

            <!-- Total Members Card -->
            <div class="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 hover:shadow-md group">
              <div class="absolute top-0 right-0 w-16 h-16 bg-orange-200 rounded-full opacity-20 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
              <div class="relative z-10 text-center">
                <div class="text-3xl font-bold text-orange-600 mb-1">{{ groupStats.totalMembers }}</div>
                <div class="text-xs text-gray-700 font-medium">Total Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Group Form Section -->
      <div class="mb-6">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <CreateGroupForm />
        </div>
      </div>

      <!-- Groups List Section -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>My Groups</span>
                <span v-if="groupStore.userGroups.length > 0" class="text-sm font-normal text-gray-500">({{ groupStore.userGroups.length }})</span>
              </h2>
              <p class="text-sm text-gray-600 mt-1">Manage and access your study groups</p>
            </div>
            <button
              @click="handleJoinByCode"
              class="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Join by Code
            </button>
          </div>

        <!-- Skeleton Loading State -->
        <div v-if="groupStore.loading" class="space-y-4">
          <!-- Skeleton Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <!-- Skeleton Group Avatar -->
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>

              <!-- Skeleton Group Info -->
              <div class="space-y-2 mb-3">
                <div class="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                <div class="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>

              <!-- Skeleton Actions -->
              <div class="flex gap-2">
                <div class="h-7 bg-gray-200 rounded animate-pulse w-12"></div>
                <div class="h-7 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="groupStore.userGroups.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No study groups yet</h3>
          <p class="text-gray-600 text-sm">
            Create your first study group to start collaborating
          </p>
        </div>

          <!-- Groups Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <GroupCard
              v-for="group in (showAllGroups ? groupStore.userGroups : groupStore.userGroups.slice(0, 6))"
              :key="group.id"
              :group="group"
              @view="handleViewGroup"
              @edit="handleEditGroup"
              @delete="handleDeleteGroup"
            />
          </div>

          <!-- Show More Button -->
          <div v-if="groupStore.userGroups.length > 6" class="text-center mt-6">
            <button
              @click="showAllGroups = !showAllGroups"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{{ showAllGroups ? 'Show Less' : `View All ${groupStore.userGroups.length} Groups` }}</span>
              <svg
                class="w-5 h-5 transition-transform duration-200"
                :class="{ 'rotate-180': showAllGroups }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Join by Code Modal -->
    <JoinGroupByCode
      v-if="showJoinByCodeModal"
      @close="showJoinByCodeModal = false"
      @joined="handleGroupJoined"
    />

    <!-- Delete Group Modal -->
    <DeleteGroupModal
      v-if="showDeleteModal"
      :group="selectedGroupForDelete"
      @close="showDeleteModal = false"
      @delete="handleDeleteConfirmed"
    />
  </div>
</template>

<style scoped>
/* Custom animations for smooth interactions */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation Styles */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .animate-fade-in {
    animation-duration: 0.3s;
  }
}
</style>
