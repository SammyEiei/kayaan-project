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
import InviteCodeGenerator from '@/components/group/InviteCodeGenerator.vue'
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
const showInviteCodeModal = ref(false)

const groupId = computed(() => route.params.id as string)
const currentGroup = computed(() => groupStore.currentGroup)

// คำนวณบทบาทผู้ชมจากลิสต์สมาชิก
const viewerRoleLocal = computed<'member' | 'admin'>(() => {
  const uid = String(auth.currentUserId ?? auth.user?.id)
  const me = groupStore.currentGroupMembers.find(m => String(m.userId) === uid)
  if (me?.role === 'moderator') return 'admin'
  if (me?.role === 'admin') return 'admin'
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

const handleEditGroup = () => {
  // TODO: Implement edit group functionality
  console.log('Edit group:', groupId.value)
}

const handleGenerateInviteCode = () => {
  showInviteCodeModal.value = true
}

const handleInviteCodeGenerated = (code: string) => {
  console.log('Invite code generated:', code)
  showInviteCodeModal.value = false
  // TODO: Show success message or update UI
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
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"
    ></div>

    <!-- Main Content -->
    <div class="relative z-10">
      <!-- Group Header -->
      <GroupHeader
        v-if="currentGroup"
        :group="currentGroup"
        :member-count="memberCountLocal"
        :viewer-role="viewerRoleLocal"
        @leave-group="showLeaveModal = true"
        @delete-group="showDeleteModal = true"
        @edit-group="handleEditGroup"
        @generate-invite-code="handleGenerateInviteCode"
        @back-to-groups="handleBackToGroups"
        @back-to-dashboard="handleBackToDashboard"
      />

      <!-- Tab Navigation -->
      <div class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8">
            <button
              v-for="tab in [
                { id: 'overview', label: 'Overview', icon: 'Home' },
                { id: 'content', label: 'Content', icon: 'Document' },
                { id: 'library', label: 'Library', icon: 'BookOpen' },
                { id: 'members', label: 'Members', icon: 'Users' },
                { id: 'security', label: 'Security', icon: 'ShieldCheck' },
                { id: 'invite', label: 'Invite', icon: 'UserPlus' }
              ]"
              :key="tab.id"
              @click="activeTab = tab.id as any"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-8">
          <!-- Welcome Section -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-bold">{{ currentGroup?.name }}</h1>
                <p class="text-blue-100 text-lg">{{ currentGroup?.description || 'Welcome to our study group!' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 text-blue-100">
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {{ memberCountLocal }} members
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Created {{ new Date(currentGroup?.createdAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </span>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Members</p>
                  <p class="text-2xl font-bold text-gray-900">{{ memberCountLocal }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Resources</p>
                  <p class="text-2xl font-bold text-gray-900">{{ groupStore.currentGroupResources?.length || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Discussions</p>
                  <p class="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Active Today</p>
                  <p class="text-2xl font-bold text-gray-900">{{ Math.floor(Math.random() * 5) + 1 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Group Information -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Group Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                      <p class="text-gray-900 font-medium">{{ currentGroup?.name }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p class="text-gray-600">{{ currentGroup?.description || 'No description provided' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                      <p class="text-gray-600">{{ new Date(currentGroup?.createdAt || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Total Members</label>
                      <p class="text-gray-900 font-medium">{{ memberCountLocal }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ currentGroup?.isPrivate ? 'Private' : 'Public' }}
                      </span>
              </div>
              <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Recent Activity
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900"><span class="font-medium">New member</span> joined the group</p>
                      <p class="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900"><span class="font-medium">New resource</span> was uploaded</p>
                      <p class="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900"><span class="font-medium">New discussion</span> was started</p>
                      <p class="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all activity →
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-6">
              <!-- Your Role Card -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Role
                </h3>
                <div class="text-center">
                  <span
                    :class="
                      viewerRoleLocal === 'admin'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    "
                    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full"
                  >
                    <svg v-if="viewerRoleLocal === 'admin'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ viewerRoleLocal === 'admin' ? 'Administrator' : 'Member' }}
                  </span>
                  <p class="text-sm text-gray-600 mt-2">
                    {{ viewerRoleLocal === 'admin' ? 'You have full control over this group' : 'You can participate and contribute to the group' }}
                  </p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div class="space-y-3">
                  <button
                    @click="handleGenerateInviteCode"
                    class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Invite Members
                  </button>
                  <button
                    @click="handleEditGroup"
                    class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Group
                  </button>
                  <button
                    v-if="viewerRoleLocal === 'admin'"
                    @click="showDeleteModal = true"
                    class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Group
                  </button>
                </div>
              </div>

              <!-- Group Stats -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Group Stats
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Weekly Activity</span>
                    <span class="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: 85%"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Member Engagement</span>
                    <span class="text-sm font-medium text-gray-900">72%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: 72%"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Resource Quality</span>
                    <span class="text-sm font-medium text-gray-900">94%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full" style="width: 94%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Tab -->
        <div v-else-if="activeTab === 'content'">
          <GroupContent :groupId="groupId" />
        </div>

        <!-- Library Tab -->
        <div v-else-if="activeTab === 'library'">
          <GroupLibrary :groupId="groupId" />
        </div>

        <!-- Members Tab -->
        <div v-else-if="activeTab === 'members'">
          <GroupMemberList :groupId="groupId" />
        </div>

        <!-- Security Tab -->
        <div v-else-if="activeTab === 'security'">
          <GroupSecurity :groupId="groupId" />
        </div>

        <!-- Invite Tab -->
        <div v-else-if="activeTab === 'invite'">
          <InviteMembers :groupId="groupId" :group-name="currentGroup?.name || ''" />
        </div>
      </div>
    </div>

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
    <InviteCodeGenerator
      v-if="showInviteCodeModal"
      :group-id="Number(groupId)"
      :group-name="currentGroup?.name || ''"
      @close="showInviteCodeModal = false"
      @code-generated="handleInviteCodeGenerated"
    />
  </div>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
