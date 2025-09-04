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

const handleBackToDashboard = () => {
  router.push('/dashboard')
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

const isDevelopmentMode = computed(() => import.meta.env.DEV)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Development Warning Banner -->
      <div v-if="isDevelopmentMode" class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-yellow-800">Development Mode</h4>
            <p class="text-sm text-yellow-700 mt-1">
              Backend is not available. Using mock data for Study Group features. All actions are simulated.
            </p>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Study Groups</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Collaborate, share resources, and learn together with your study groups
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total Groups</p>
              <p class="text-lg font-semibold text-gray-900">{{ groupStats.totalGroups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Owned Groups</p>
              <p class="text-lg font-semibold text-gray-900">{{ groupStats.ownedGroups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Member Groups</p>
              <p class="text-lg font-semibold text-gray-900">{{ groupStats.memberGroups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total Members</p>
              <p class="text-lg font-semibold text-gray-900">{{ groupStats.totalMembers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="p-2 bg-indigo-100 rounded-lg">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Recent (30d)</p>
              <p class="text-lg font-semibold text-gray-900">{{ groupStats.recentGroups }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Group Form -->
      <div class="mb-8">
        <CreateGroupForm />
      </div>

      <!-- Groups List -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900">My Groups</h3>
          <div class="flex gap-2">
            <button
              @click="handleJoinByCode"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
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
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </main>

    <!-- Join by Code Modal -->
    <JoinGroupByCode
      v-if="showJoinByCodeModal"
      @close="showJoinByCodeModal = false"
      @joined="showJoinByCodeModal = false"
    />
  </div>
</template>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
