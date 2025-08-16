<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"
    ></div>

    <main class="relative z-10 p-6">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Back Navigation -->
        <nav class="flex items-center space-x-2 text-sm text-gray-600">
          <button
            @click="handleBackToDashboard"
            class="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">Study Groups</span>
        </nav>

        <!-- Header -->
        <div class="text-center">
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4"
          >
            Study Groups
          </h1>
          <p class="text-gray-600 text-lg">Collaborate, share resources, and learn together</p>
        </div>

        <!-- Create Group Form -->
        <CreateGroupForm />

        <!-- Groups List -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">My Groups</h2>
            <div class="flex gap-2">
              <button
                @click="handleJoinByCode"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
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
