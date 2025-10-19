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
const showAllActivities = ref(false)

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

// Recent Activity computed property - รวมข้อมูลจริงจาก members, resources, และ posts
interface Activity {
  type: 'member' | 'resource' | 'post'
  title: string
  description: string
  time: Date
  icon: string
  colorClass: string
}

const recentActivities = computed<Activity[]>(() => {
  const activities: Activity[] = []

  // เพิ่มสมาชิกใหม่
  const recentMembers = groupStore.currentGroupMembers
    .filter(m => m.joinedAt)
    .sort((a, b) => new Date(b.joinedAt!).getTime() - new Date(a.joinedAt!).getTime())
    .slice(0, 3)

  recentMembers.forEach(member => {
    activities.push({
      type: 'member',
      title: `${member.username} joined`,
      description: 'New member has joined the group',
      time: new Date(member.joinedAt!),
      icon: 'user',
      colorClass: 'blue'
    })
  })

  // เพิ่ม resources ใหม่
  const recentResources = groupStore.currentGroupResources
    .filter(r => r.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  recentResources.forEach(resource => {
    const uploaderName = resource.uploaderName || groupStore.getUploaderName(resource.uploaderId)
    activities.push({
      type: 'resource',
      title: resource.title || 'New resource uploaded',
      description: `${uploaderName} shared a new resource`,
      time: new Date(resource.createdAt),
      icon: 'file',
      colorClass: 'green'
    })
  })

  // เพิ่ม posts ใหม่
  const recentPosts = groupStore.groupPosts
    .filter(p => p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  recentPosts.forEach(post => {
    const authorName = post.authorName || 'Someone'
    activities.push({
      type: 'post',
      title: post.title || 'New discussion started',
      description: `${authorName} created a new discussion`,
      time: new Date(post.createdAt),
      icon: 'chat',
      colorClass: 'purple'
    })
  })

  // เรียงตามเวลาและเอาแค่ 10 รายการล่าสุด
  return activities
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 10)
})

// Helper function สำหรับแสดงเวลาที่ผ่านมา
const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`
}

// Computed property สำหรับแสดง activities ตามสถานะการแสดงผล
const displayedActivities = computed(() => {
  if (showAllActivities.value || recentActivities.value.length <= 4) {
    return recentActivities.value
  }
  return recentActivities.value.slice(0, 4)
})

// นับจำนวน activities ที่ซ่อนอยู่
const hiddenActivitiesCount = computed(() => {
  return Math.max(0, recentActivities.value.length - 4)
})

onMounted(async () => {
  console.log('🔍 GroupDetailView mounted, groupId:', groupId.value)
  console.log('🔍 Auth store state:', {
    token: !!useAuthStore().token,
    user: useAuthStore().user,
    currentUserId: useAuthStore().currentUserId
  })

  // ตรวจสอบ query parameter สำหรับ tab
  if (route.query.tab && typeof route.query.tab === 'string') {
    const validTabs = ['overview', 'content', 'security', 'members', 'library', 'invite']
    if (validTabs.includes(route.query.tab)) {
      activeTab.value = route.query.tab as 'overview' | 'content' | 'security' | 'members' | 'library' | 'invite'
      console.log('🔍 Set active tab from query:', route.query.tab)
    }
  }

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

// const handleLeaveGroup = async () => {
//   try {
//     // First attempt without confirmation
//     await groupStore.leaveGroup(groupId.value, false)
//     router.push('/study-groups')
//   } catch (error: any) {
//     if (error.message === 'CONFIRMATION_REQUIRED') {
//       // Show confirmation modal - this is handled by the modal component
//       console.log('Confirmation required for leaving group')
//       return
//     } else if (error.message === 'OWNER_CANNOT_LEAVE_ALONE') {
//       // Show error message and suggest delete group instead
//       alert('Owner cannot leave the group if they are the only member. Please delete the group instead.')
//       return
//     } else if (error.message === 'USER_NOT_MEMBER') {
//       alert('You are not a member of this group.')
//       router.push('/study-groups')
//       return
//     } else if (error.message === 'AUTHENTICATION_REQUIRED') {
//       alert('Authentication required. Please log in again.')
//       // TODO: Redirect to login page
//       return
//     }
//     console.error('Failed to leave group:', error)
//     alert('Failed to leave group. Please try again.')
//   }
// }

const handleConfirmLeaveGroup = async () => {
  try {
    // Second attempt with confirmation
    await groupStore.leaveGroup(groupId.value, true)
    showLeaveModal.value = false
    router.push('/study-groups')
  } catch (error: unknown) {
    const errorObj = error as { message?: string }
    if (errorObj.message === 'OWNER_CANNOT_LEAVE_ALONE') {
      alert('Owner cannot leave the group if they are the only member. Please delete the group instead.')
      showLeaveModal.value = false
      return
    } else if (errorObj.message === 'USER_NOT_MEMBER') {
      alert('You are not a member of this group.')
      showLeaveModal.value = false
      router.push('/study-groups')
      return
    } else if (errorObj.message === 'AUTHENTICATION_REQUIRED') {
      alert('Authentication required. Please log in again.')
      showLeaveModal.value = false
      // TODO: Redirect to login page
      return
    }
    console.error('Failed to leave group with confirmation:', error)
    alert('Failed to leave group. Please try again.')
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

const handleTabChange = (tabId: 'overview' | 'content' | 'security' | 'members' | 'library' | 'invite') => {
  activeTab.value = tabId
  // อัปเดต URL เพื่อให้สอดคล้องกับ tab ที่เปิดอยู่
  router.replace({
    name: 'group-detail',
    params: { id: groupId.value },
    query: { tab: tabId }
  })
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
                { id: 'content', label: 'Community', icon: 'Document' },
                { id: 'library', label: 'Library', icon: 'BookOpen' },
                { id: 'members', label: 'Members', icon: 'Users' },
                // { id: 'security', label: 'Security', icon: 'ShieldCheck' },
                { id: 'invite', label: 'Invite', icon: 'UserPlus' }
              ]"
              :key="tab.id"
              @click="handleTabChange(tab.id as any)"
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
          <!-- <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
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
          </div> -->

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.5 7a5 5 0 1 1 10 0a5 5 0 0 1-10 0M5 14a5 5 0 0 0-5 5v2h17v-2a5 5 0 0 0-5-5zm19 7h-5v-2c0-1.959-.804-3.73-2.1-5H19a5 5 0 0 1 5 5zm-8.5-9a5 5 0 0 1-1.786-.329A6.97 6.97 0 0 0 15.5 7a6.97 6.97 0 0 0-1.787-4.671A5 5 0 1 1 15.5 12"/>
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
          <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <!-- Group Information - Main Content -->
            <div class="xl:col-span-3 space-y-8">
              <!-- Group Overview Card -->
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900">Group Information</h3>
                </div>

                <!-- Improved Grid Layout with Better Organization -->
                <div class="max-w-7xl mx-auto">
                  <!-- Primary Information Section -->
                  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <!-- Group Identity -->
                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Group Name</label>
                          <h2 class="text-2xl font-bold text-gray-900">{{ currentGroup?.name }}</h2>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</label>
                          <p class="text-gray-600 leading-relaxed">{{ currentGroup?.description || 'No description provided' }}</p>
                        </div>
                      </div>

                      <!-- Quick Stats -->
                      <div class="grid grid-cols-2 gap-4 lg:pl-6">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                          <label class="block text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Members</label>
                          <p class="text-3xl font-bold text-blue-900">{{ memberCountLocal }}</p>
                        </div>
                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                          <label class="block text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Status</label>
                          <div class="flex items-center mt-2">
                            <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span class="text-lg font-semibold text-green-800">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Secondary Information Section -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Group Type Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div class="flex items-start justify-between">
                        <div>
                          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Privacy</label>
                          <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700">
                            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                            </svg>
                            Private Group
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Created Date Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Established</label>
                      <div class="space-y-1">
                        <p class="text-sm font-semibold text-gray-900">
                          {{ new Date(currentGroup?.createdAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ new Date(currentGroup?.createdAt || '').toLocaleDateString('en-US', { weekday: 'long' }) }}
                        </p>
                      </div>
                    </div>

                    <!-- Activity Indicator Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Activity</label>
                      <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-medium text-gray-700">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900">Recent Activity</h3>
                </div>

                <div v-if="recentActivities.length > 0" class="space-y-4">
                  <div
                    v-for="(activity, index) in displayedActivities"
                    :key="index"
                    class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200"
                    :class="{
                      'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200': activity.colorClass === 'blue',
                      'bg-gradient-to-r from-green-50 to-green-100 border-green-200': activity.colorClass === 'green',
                      'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200': activity.colorClass === 'purple'
                    }"
                  >
                    <div
                      class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                      :class="{
                        'bg-blue-500': activity.colorClass === 'blue',
                        'bg-green-500': activity.colorClass === 'green',
                        'bg-purple-500': activity.colorClass === 'purple'
                      }"
                    >
                      <!-- User Icon -->
                      <svg v-if="activity.icon === 'user'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.5 7a5 5 0 1 1 10 0a5 5 0 0 1-10 0M5 14a5 5 0 0 0-5 5v2h17v-2a5 5 0 0 0-5-5zm19 7h-5v-2c0-1.959-.804-3.73-2.1-5H19a5 5 0 0 1 5 5zm-8.5-9a5 5 0 0 1-1.786-.329A6.97 6.97 0 0 0 15.5 7a6.97 6.97 0 0 0-1.787-4.671A5 5 0 1 1 15.5 12"/>
                      </svg>
                      <!-- File Icon -->
                      <svg v-else-if="activity.icon === 'file'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <!-- Chat Icon -->
                      <svg v-else-if="activity.icon === 'chat'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-base font-semibold text-gray-900">{{ activity.title }}</p>
                      <p class="text-sm text-gray-600">{{ activity.description }}</p>
                      <p
                        class="text-xs font-medium mt-1"
                        :class="{
                          'text-blue-600': activity.colorClass === 'blue',
                          'text-green-600': activity.colorClass === 'green',
                          'text-purple-600': activity.colorClass === 'purple'
                        }"
                      >
                        {{ getTimeAgo(activity.time) }}
                      </p>
                    </div>
                  </div>

                  <!-- Show More/Less Button -->
                  <button
                    v-if="recentActivities.length > 4"
                    @click="showAllActivities = !showAllActivities"
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 group"
                  >
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {{ showAllActivities ? 'Show less' : `Show ${hiddenActivitiesCount} more ${hiddenActivitiesCount === 1 ? 'activity' : 'activities'}` }}
                    </span>
                    <svg
                      class="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-transform duration-200"
                      :class="{ 'rotate-180': showAllActivities }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p class="text-gray-600 font-medium mb-1">No recent activity</p>
                  <p class="text-gray-500 text-sm">Activity will appear here when members interact with the group</p>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-8">
              <!-- Your Role Card -->
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Your Role</h3>
                </div>

                <div class="text-center">
                  <div
                    :class="
                      viewerRoleLocal === 'admin'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    "
                    class="inline-flex items-center px-6 py-3 text-base font-semibold rounded-xl shadow-sm"
                  >
                    <svg v-if="viewerRoleLocal === 'admin'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ viewerRoleLocal === 'admin' ? 'Administrator' : 'Member' }}
                  </div>
                  <p class="text-sm text-gray-600 mt-4 leading-relaxed">
                    {{ viewerRoleLocal === 'admin' ? 'You have full control over this group and can manage all settings and members.' : 'You can participate in discussions, share resources, and contribute to the group activities.' }}
                  </p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
                </div>

                <div class="space-y-4">
                  <button
                    @click="handleGenerateInviteCode"
                    class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-sm"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Invite Members</span>
                  </button>

                  <!-- <button
                    @click="handleEditGroup"
                    class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-sm"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Group</span>
                  </button> -->

                  <button
                    v-if="viewerRoleLocal === 'admin'"
                    @click="showDeleteModal = true"
                    class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-sm"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Group</span>
                  </button>
                </div>
              </div>

              <!-- Group Stats -->
              <div class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900">Group Stats</h3>
                </div>

                <div class="space-y-6">
                  <!-- Weekly Activity -->
                  <div class="bg-blue-50 rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-semibold text-blue-700">Weekly Activity</span>
                      <span class="text-lg font-bold text-blue-900">85%</span>
                    </div>
                    <div class="w-full bg-blue-200 rounded-full h-3">
                      <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style="width: 85%"></div>
                    </div>
                  </div>

                  <!-- Member Engagement -->
                  <div class="bg-green-50 rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-semibold text-green-700">Member Engagement</span>
                      <span class="text-lg font-bold text-green-900">72%</span>
                    </div>
                    <div class="w-full bg-green-200 rounded-full h-3">
                      <div class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style="width: 72%"></div>
                    </div>
                  </div>

                  <!-- Resource Quality -->
                  <div class="bg-purple-50 rounded-xl p-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-semibold text-purple-700">Resource Quality</span>
                      <span class="text-lg font-bold text-purple-900">94%</span>
                    </div>
                    <div class="w-full bg-purple-200 rounded-full h-3">
                      <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" style="width: 94%"></div>
                    </div>
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
          <GroupSecurity
            :groupId="groupId"
            @leave-group="showLeaveModal = true"
          />
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
      @leave="handleConfirmLeaveGroup"
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
