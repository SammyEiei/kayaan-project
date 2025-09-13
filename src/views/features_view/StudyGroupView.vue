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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <!-- Total Groups Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200">
              <div class="flex items-center mb-2">
                <div class="p-1.5 bg-blue-500 rounded-md">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 640 512">
                    <path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6c40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32S208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/>
                  </svg>
                </div>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-1">{{ groupStats.totalGroups }}</p>
              <p class="text-xs font-medium text-gray-700 mb-1">Total Groups</p>
              <p class="text-xs text-gray-500">All study groups you're part of</p>
            </div>

            <!-- Owned Groups Card -->
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 border border-emerald-200">
              <div class="flex items-center mb-2">
                <div class="p-1.5 bg-emerald-500 rounded-md">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-1">{{ groupStats.ownedGroups }}</p>
              <p class="text-xs font-medium text-gray-700 mb-1">Groups You Own</p>
              <p class="text-xs text-gray-500">Groups you created and manage</p>
            </div>

            <!-- Member Groups Card -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200">
              <div class="flex items-center mb-2">
                <div class="p-1.5 bg-purple-500 rounded-md">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M9 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm8 0a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07ZM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5Z"/>
                  </svg>
                </div>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-1">{{ groupStats.memberGroups }}</p>
              <p class="text-xs font-medium text-gray-700 mb-1">Groups You Joined</p>
              <p class="text-xs text-gray-500">Groups you're a member of</p>
            </div>

            <!-- Total Members Card -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
              <div class="flex items-center mb-2">
                <div class="p-1.5 bg-orange-500 rounded-md">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 100 100">
                    <path id="gisGlobeUsers0" fill="currentColor" stroke-dashoffset="188.976" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.644" d="M49.947 0C22.354.03 0 22.406 0 50a50 50 0 0 0 20.404 40.21c-.265-2.031-.213-4.128.117-6.202a45.22 45.22 0 0 1-8.511-9.877h12.445c1.182-1.845 2.4-3.67 4.525-5c-1.245-5.1-2.006-10.716-2.146-16.631h1.346a18.653 18.653 0 0 1 1.93-5h-3.243c.212-5.935 1.043-11.554 2.363-16.63H47.5v8.888a13.75 13.75 0 0 1 5 1.804V30.87h19.195c.26.997.495 2.02.715 3.057a19.769 19.769 0 0 1 5.084-.117a76.416 76.416 0 0 0-.639-2.94h13.89a44.747 44.747 0 0 1 3.965 14.028c.58 5.049.591 10.975-1.246 16.771a45.007 45.007 0 0 1-2.286 6.478c1.128 1.187 2.494 2.309 3.867 3.454A50 50 0 0 0 100 50c0-27.614-22.386-50-50-50ZM52.5 5.682c5.268.896 10.302 5.236 14.268 12.437c1.278 2.321 2.42 4.927 3.408 7.75H52.5Zm-5 .197v19.99H30.75c.988-2.823 2.13-5.429 3.408-7.75C37.89 11.341 42.571 7.102 47.5 5.88ZM35.98 7.232c-2.324 2.352-4.41 5.22-6.203 8.475c-1.68 3.05-3.125 6.467-4.312 10.162H12.01c5.535-8.706 13.975-15.37 23.97-18.637Zm29.41.463c9.398 3.413 17.32 9.868 22.6 18.174H75.455c-1.184-3.695-2.627-7.112-4.307-10.162c-1.676-3.045-3.613-5.749-5.757-8.012ZM9.257 30.87h14.808c-1.245 5.162-2.008 10.76-2.203 16.631H5.072a44.79 44.79 0 0 1 4.184-16.63ZM5.072 52.5h16.762c.129 5.856.82 11.454 1.994 16.63H9.256A44.79 44.79 0 0 1 5.072 52.5Z" color="currentColor"/>
                    <path id="gisGlobeUsers1" fill="currentColor" fill-opacity="1" stroke="none" stroke-dasharray="none" stroke-dashoffset="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-opacity="1" stroke-width="3.621" d="M76 37.769c-8.285 0-15 6.716-15 15c0 8.284 6.715 15 15 15c8.283 0 15-6.716 15-15c0-8.284-6.717-15-15-15zm0 32.223c-16.57 0-24 7.431-24 24v2c.075 3.94 1.817 4.056 5.5 4h37c4.695-.004 5.532.005 5.5-4v-2c0-16.569-7.432-24-24-24z" opacity="1" vector-effect="none"/>
                    <path id="gisGlobeUsers2" fill="currentColor" fill-opacity="1" stroke="none" stroke-dasharray="none" stroke-dashoffset="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke-opacity="1" stroke-width="2.966" d="M44 43.39c-6.787 0-12.291 5.504-12.291 12.292c0 6.787 5.504 12.289 12.291 12.289c6.787 0 12.29-5.502 12.29-12.29c0-6.787-5.503-12.29-12.29-12.29zm0 26.401c-13.575 0-19.664 6.09-19.664 19.664v1.639c.062 3.228 1.489 3.323 4.506 3.277h19.123c-.488-8.088 1.901-16.678 7.851-22.139c-3.012-1.646-6.925-2.441-11.816-2.441z" opacity="1" vector-effect="none"/>
                  </svg>
                </div>
              </div>
              <p class="text-xl font-bold text-gray-900 mb-1">{{ groupStats.totalMembers }}</p>
              <p class="text-xs font-medium text-gray-700 mb-1">Total Members</p>
              <p class="text-xs text-gray-500">All members across your groups</p>
            </div>
            </div>

          <!-- Recent Activity Section -->
          <div class="mt-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-1.5 bg-indigo-500 rounded-md mr-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xl font-bold text-gray-900 mb-1">{{ groupStats.recentGroups }}</p>
                  <p class="text-xs font-medium text-gray-700 mb-1">Recent Groups</p>
                  <p class="text-xs text-gray-500">Groups created in the last 30 days</p>
                </div>
              </div>
              <span class="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-200 rounded-full">New</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Group Form Section -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
