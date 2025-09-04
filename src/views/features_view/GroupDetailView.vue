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

    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <button
              @click="handleBackToGroups"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 class="text-lg font-bold text-gray-900">Study Group</h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleBackToDashboard"
              class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

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
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Group Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-3">Group Information</h3>
                <div class="space-y-2 text-sm text-gray-600">
                  <p><span class="font-medium">Name:</span> {{ currentGroup?.name }}</p>
                  <p><span class="font-medium">Description:</span> {{ currentGroup?.description }}</p>
                  <p><span class="font-medium">Created:</span> {{ new Date(currentGroup?.createdAt || '').toLocaleDateString() }}</p>
                  <p><span class="font-medium">Members:</span> {{ memberCountLocal }}</p>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-3">Your Role</h3>
                <div class="space-y-2">
                  <span
                    :class="
                      viewerRoleLocal === 'admin'
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                    "
                    class="px-3 py-1 text-sm font-medium rounded-full"
                  >
                    {{ viewerRoleLocal === 'admin' ? 'Administrator' : 'Member' }}
                  </span>
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
      :group-id="groupId"
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
