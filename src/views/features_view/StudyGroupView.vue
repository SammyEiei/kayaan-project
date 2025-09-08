<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import CreateGroupForm from '@/components/CreateGroupForm.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import JoinGroupByCode from '@/components/group/JoinGroupByCode.vue'

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

const handleDeleteGroup = async (groupId: string) => {
  if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
    try {
      await groupStore.deleteGroup(groupId)
    } catch (error) {
      console.error('Failed to delete group:', error)
    }
  }
}

const showJoinByCodeModal = ref(false)

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
      <!-- Development Warning Banner -->



      <!-- Header Section -->
      <div class="mb-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-3">Study Groups</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Collaborate, share resources, and learn together with your study groups
          </p>
        </div>
      </div>

      <!-- Dashboard Overview Section -->
      <div class="mb-12">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <!-- Section Header -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
            <p class="text-sm text-gray-500 mt-1">Your groups activity at a glance</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">

              <!-- Total Groups Card -->
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ groupStats.totalGroups }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Groups</p>
              </div>

              <!-- Owned Groups Card -->
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 bg-emerald-100 rounded-lg">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ groupStats.ownedGroups }}</p>
                <p class="text-xs text-gray-500 mt-1">Owned Groups</p>
              </div>

              <!-- Member Groups Card -->
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ groupStats.memberGroups }}</p>
                <p class="text-xs text-gray-500 mt-1">Member Groups</p>
              </div>

              <!-- Total Members Card -->
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ groupStats.totalMembers }}</p>
                <p class="text-xs text-gray-500 mt-1">Total Members</p>
              </div>

              <!-- Recent Activity Card -->
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">New</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ groupStats.recentGroups }}</p>
                <p class="text-xs text-gray-500 mt-1">Recent (30d)</p>
              </div>
            </div>
        </div>
      </div>

      <!-- Create Group Form Section -->
      <div class="mb-12">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Create New Study Group</h2>
            <p class="text-sm text-gray-500 mt-1">Start collaborating with others and build your learning community</p>
          </div>
          <CreateGroupForm />
        </div>
      </div>

      <!-- Groups List Section -->
      <div class="mb-12">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">My Groups</h2>
              <p class="text-sm text-gray-500 mt-1">Manage and access your study groups</p>
            </div>
            <button
              @click="handleJoinByCode"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <!-- Loading State -->
        <div v-if="groupStore.loading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-gray-600 font-medium">Loading groups...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="groupStore.userGroups.length === 0" class="text-center py-12">
          <div
            class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No study groups yet</h3>
          <p class="text-gray-500 mb-6">
            Create your first study group to start collaborating with others
          </p>
        </div>

          <!-- Groups Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <GroupCard
              v-for="group in groupStore.userGroups"
              :key="group.id"
              :group="group"
              @view="handleViewGroup"
              @edit="handleEditGroup"
              @delete="handleDeleteGroup"
            />
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
  </div>
</template>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Animation Styles */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
