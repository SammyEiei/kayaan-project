<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import GroupHeader from '@/components/group/GroupHeader.vue'
import GroupMemberList from '@/components/group/GroupMemberList.vue'
import GroupLibrary from '@/components/group/GroupLibrary.vue'
import GroupContent from '@/components/group/GroupContent.vue'
import GroupSecurity from '@/components/group/GroupSecurity.vue'
import InviteMembers from '@/components/group/InviteMembers.vue'
import LeaveGroupModal from '@/components/group/LeaveGroupModal.vue'
import DeleteGroupModal from '@/components/group/DeleteGroupModal.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const auth = useAuthStore()

const activeTab = ref<'overview' | 'content' | 'security' | 'members' | 'library' | 'invite'>('overview')
const showLeaveModal = ref(false)
const showDeleteModal = ref(false)

const groupId = computed(() => route.params.id as string)
const currentGroup = computed(() => groupStore.currentGroup)

// คำนวณบทบาทผู้ชมจากลิสต์สมาชิก
const viewerRoleLocal = computed<'member' | 'admin'>(() => {
  const uid = String(auth.currentUserId ?? auth.user?.id)
  const me = groupStore.currentGroupMembers.find(m => String(m.userId) === uid)
  if (me?.role) return me.role
  // fallback: ถ้าเราเป็น owner ให้ถือเป็น admin
  if (groupStore.currentGroup && String(groupStore.currentGroup.ownerId) === uid) return 'admin'
  return 'member'
})

// คำนวณจำนวนสมาชิกจากลิสต์
const memberCountLocal = computed(
  () => groupStore.memberCount ?? groupStore.currentGroupMembers.length ?? 0
)

// const canManageGroup = computed(() => groupStore.canManageGroup)

onMounted(async () => {
  console.log('🔍 GroupDetailView mounted, groupId:', groupId.value)
  console.log('🔍 Auth store state:', {
    token: !!useAuthStore().token,
    user: useAuthStore().user,
    currentUserId: useAuthStore().currentUserId
  })
  if (groupId.value) {
    console.log('🔍 Calling fetchGroupDetails...')
    try {
      await groupStore.fetchGroupDetails(groupId.value)
      console.log('🔍 fetchGroupDetails completed successfully')
      console.log('🔍 Current group:', groupStore.currentGroup)
      console.log('🔍 Group members:', groupStore.currentGroupMembers)
    } catch (error) {
      console.error('🔍 fetchGroupDetails failed:', error)
    }
  }
})

const handleLeaveGroup = async () => {
  try {
    await groupStore.leaveGroup(groupId.value)
    router.push('/study-groups')
  } catch (error) {
    console.error('Failed to leave group:', error)
  }
}

const handleDeleteGroup = async () => {
  try {
    await groupStore.deleteGroup(groupId.value)
    router.push('/study-groups')
  } catch (error) {
    console.error('Failed to delete group:', error)
  }
}

const handleBackToGroups = () => {
  router.push('/study-groups')
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
      <div class="max-w-7xl mx-auto space-y-6">
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
          <button
            @click="handleBackToGroups"
            class="hover:text-blue-600 transition-colors duration-200"
          >
            Study Groups
          </button>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-gray-900 font-medium">
            {{ currentGroup?.name || 'Loading...' }}
          </span>
        </nav>

        <!-- Loading State -->
        <div v-if="groupStore.loading" class="flex items-center justify-center py-20">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-gray-600 font-medium">Loading group details...</span>
          </div>
        </div>

        <!-- Group Not Found -->
        <div v-else-if="!currentGroup" class="text-center py-20">
          <div
            class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              class="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Group not found</h2>
          <p class="text-gray-600 mb-8">
            The group you're looking for doesn't exist or you don't have access to it.
          </p>
          <div class="flex items-center justify-center gap-4">
            <button
              @click="handleBackToGroups"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Back to Groups
            </button>
            <button
              @click="handleBackToDashboard"
              class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <!-- Group Content -->
        <div v-else class="space-y-6">
          <!-- Group Header -->
          <GroupHeader
            :group="currentGroup"
            :viewer-role="viewerRoleLocal"
            :member-count="memberCountLocal"
            @leave="showLeaveModal = true"
            @delete="showDeleteModal = true"
          />

          <!-- Tabs -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl">
            <!-- Tab Navigation -->
            <div class="flex border-b border-gray-200">
              <button
                v-for="tab in [
                  { id: 'overview', label: 'Overview', icon: 'grid' },
                  { id: 'content', label: 'Content', icon: 'chat' },
                  { id: 'security', label: 'Security', icon: 'shield' },
                  { id: 'members', label: 'Members', icon: 'users' },
                  { id: 'library', label: 'Library', icon: 'book' },
                  { id: 'invite', label: 'Invite', icon: 'user-plus' },
                ]"
                :key="tab.id"
                @click="activeTab = tab.id as any"
                class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-200"
                :class="
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                "
              >
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      v-if="tab.icon === 'grid'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                    <path
                      v-else-if="tab.icon === 'chat'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                    <path
                      v-else-if="tab.icon === 'shield'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                    <path
                      v-else-if="tab.icon === 'users'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                      v-else-if="tab.icon === 'book'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                    <path
                      v-else-if="tab.icon === 'user-plus'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  {{ tab.label }}
                </div>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Group Overview</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 rounded-xl p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Members</p>
                          <p class="text-xl font-bold text-gray-900">{{ memberCountLocal || 0 }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-green-50 rounded-xl p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Resources</p>
                          <p class="text-xl font-bold text-gray-900">{{ groupStore.currentGroupResources.length }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-purple-50 rounded-xl p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Created</p>
                          <p class="text-xl font-bold text-gray-900">{{ new Date(currentGroup.createdAt).toLocaleDateString() }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h3>
                  <div v-if="groupStore.currentGroupResources.length === 0" class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p class="text-gray-500">No resources shared yet</p>
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="resource in groupStore.currentGroupResources.slice(0, 3)"
                      :key="resource.id"
                      class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-800">{{ resource.title }}</p>
                        <p class="text-sm text-gray-500">by {{ resource.uploaderName }}</p>
                      </div>
                      <span class="text-xs text-gray-400">{{
                        new Date(resource.createdAt).toLocaleDateString()
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Tab -->
              <div v-if="activeTab === 'content'">
                <GroupContent :groupId="groupId" />
              </div>

              <!-- Security Tab -->
              <div v-if="activeTab === 'security'">
                <GroupSecurity :groupId="groupId" />
              </div>

              <!-- Members Tab -->
              <div v-if="activeTab === 'members'" class="p-6">
                <GroupMemberList :groupId="groupId" />
              </div>

              <!-- Library Tab -->
              <div v-if="activeTab === 'library'" class="p-6">
                <GroupLibrary :groupId="groupId" />
              </div>

                             <!-- Invite Tab -->
               <div v-if="activeTab === 'invite'" class="p-6">
                 <InviteMembers :groupId="groupId" :group-name="currentGroup.name" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <LeaveGroupModal
      v-if="showLeaveModal"
      :group="currentGroup"
      @close="showLeaveModal = false"
      @leave="handleLeaveGroup"
    />

    <DeleteGroupModal
      v-if="showDeleteModal"
      :group="currentGroup"
      @close="showDeleteModal = false"
      @delete="handleDeleteGroup"
    />
  </div>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
