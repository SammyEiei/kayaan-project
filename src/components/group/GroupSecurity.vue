<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import type { GroupMember, JoinRequest, GroupInvite, UpdateGroupSettingsRequest } from '@/types/group'

interface Props {
  groupId: string
}

const emit = defineEmits<{
  'leave-group': []
}>()

const props = defineProps<Props>()
const groupStore = useGroupStore()
const auth = useAuthStore()

// State
const loading = ref(false)
const showSettings = ref(false)
const showInviteModal = ref(false)
const showJoinRequests = ref(false)
const selectedMember = ref<GroupMember | null>(null)
const showRemoveMemberModal = ref(false)
const removeReason = ref('')

// Invite code validation
const inviteCodeToValidate = ref('')
const inviteCodeValidation = ref<{ isValid: boolean; message: string } | null>(null)
const newInviteCode = ref('')
const inviteExpiry = ref('')

// Pending invites and join requests
const pendingInvites = ref<GroupInvite[]>([])
const joinRequests = ref<JoinRequest[]>([])

// Settings state
const groupSettings = ref({
  isPrivate: false,
  maxMembers: 50,
  allowMemberInvites: true,
  requireApproval: true,
  autoApproveMembers: false
})

// Computed
const currentUserId = computed(() => auth.currentUserId)
const isAdmin = computed(() => {
  const member = groupStore.currentGroupMembers.find(m => String(m.userId) === String(currentUserId.value))
  return member?.role === 'admin'
})

const isOwner = computed(() => {
  return String(groupStore.currentGroup?.ownerId) === String(currentUserId.value)
})

const canLeaveGroup = computed(() => {
  // Members can leave, but owners cannot leave if they are the only member
  return !isOwner.value || groupStore.memberCount > 1
})

const pendingRequests = computed(() => {
  // TODO: Implement in groupStore
  return []
})

const activeInvites = computed(() => {
  // TODO: Implement in groupStore
  return []
})

// Methods
const handleUpdateSettings = async () => {
  if (!isAdmin.value) return

  loading.value = true
  try {
    const settings: UpdateGroupSettingsRequest = {
      ...groupSettings.value
    }

    await groupStore.updateGroupSettings(props.groupId, settings)
    showSettings.value = false
  } catch (error) {
    console.error('Failed to update group settings:', error)
  } finally {
    loading.value = false
  }
}

const handleRemoveMember = async () => {
  if (!selectedMember.value || !isAdmin.value) return

  loading.value = true
  try {
    await groupStore.removeMember(String(selectedMember.value.userId))
    showRemoveMemberModal.value = false
    selectedMember.value = null
    removeReason.value = ''

    // Refresh members list
    await fetchMembers()
  } catch (error) {
    console.error('Failed to remove member:', error)
  } finally {
    loading.value = false
  }
}

const handleApproveRequest = async (requestId: string, approved: boolean) => {
  loading.value = true
  try {
    await groupStore.approveJoinRequest(requestId, approved)
    // Refresh requests
  } catch (error) {
    console.error('Failed to approve request:', error)
  } finally {
    loading.value = false
  }
}

const handleRevokeInvite = async (inviteId: string) => {
  loading.value = true
  try {
    await groupStore.revokeInvite(inviteId)

    // Refresh invites list
    await fetchInvites()

    console.log('Invite revoked successfully')
  } catch (error) {
    console.error('Failed to revoke invite:', error)
  } finally {
    loading.value = false
  }
}

const openRemoveMemberModal = (member: GroupMember) => {
  selectedMember.value = member
  showRemoveMemberModal.value = true
}

// Helper functions
const validateInviteCode = (code: string): boolean => {
  // Basic validation: 6-8 characters, alphanumeric
  const regex = /^[A-Z0-9]{6,8}$/
  return regex.test(code)
}

const checkInviteCodeValidity = (code: string): { isValid: boolean; message: string } => {
  if (!code.trim()) {
    return { isValid: false, message: 'Invite code is required' }
  }

  if (!validateInviteCode(code)) {
    return { isValid: false, message: 'Invalid invite code format (6-8 alphanumeric characters)' }
  }

  return { isValid: true, message: 'Invite code is valid' }
}

const handleInviteCodeValidation = () => {
  const validation = checkInviteCodeValidity(inviteCodeToValidate.value)
  inviteCodeValidation.value = validation

  if (validation.isValid) {
    // TODO: Check against backend for actual validity
    console.log('Invite code validation passed')
  }
}

const generateSecureInviteCode = async () => {
  try {
    const response = await groupStore.generateNewInviteCode({
      expiresInHours: 24 // 24 hours
    })

    // Update local state
    if (response.inviteCode) {
      newInviteCode.value = response.inviteCode
      inviteExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    console.log('New invite code generated successfully')
  } catch (error) {
    console.error('Failed to generate invite code:', error)
  }
}

const fetchMembers = async () => {
  try {
    // This will be handled by the parent component or store
    // For now, we'll use the existing members from props
  } catch (error) {
    console.error('Failed to fetch members:', error)
  }
}

const fetchInvites = async () => {
  try {
    // TODO: Implement fetch invites from store
    // For now, we'll use mock data
    pendingInvites.value = [
      {
        id: '1',
        groupId: props.groupId,
        inviteCode: 'ABC123',
        inviterId: 'admin',
        inviterName: 'Admin User',
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        maxUses: 5,
        currentUses: 0,
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Failed to fetch invites:', error)
  }
}

const fetchJoinRequests = async () => {
  try {
    // TODO: Implement fetch join requests from store
    // For now, we'll use mock data
    joinRequests.value = [
      {
        id: '1',
        groupId: props.groupId,
        userId: 'user1',
        username: 'John Doe',
        email: 'john@example.com',
        message: 'I would like to join this study group',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Failed to fetch join requests:', error)
  }
}

onMounted(() => {
  // Load current group settings
  if (groupStore.currentGroup) {
    groupSettings.value.isPrivate = groupStore.currentGroup.isPrivate || false
    groupSettings.value.maxMembers = groupStore.currentGroup.maxMembers || 50
  }

  // Fetch initial data
  fetchInvites()
  fetchJoinRequests()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Security & Management</h2>
        <p class="text-gray-600 mt-1">Manage group settings, members, and permissions</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Admin Actions
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-if="isAdmin"
          @click="showSettings = true"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
        <button
          v-if="isAdmin"
          @click="showInviteModal = true"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Invites
        </button>
        <button
          v-if="isAdmin"
          @click="showJoinRequests = true"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Requests
        </button>
        <!-- SRS-161: Leave Group option in settings menu -->
        <button
          v-if="canLeaveGroup"
          @click="emit('leave-group')"
          class="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Leave Group
        </button>
      </div>
    </div>

    <!-- Security Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Privacy Status -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Privacy</h3>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Group Type:</span>
            <span
              :class="groupSettings.isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
              class="px-2 py-1 text-xs rounded-full font-medium"
            >
              {{ groupSettings.isPrivate ? 'Private' : 'Public' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Approval Required:</span>
            <span
              :class="groupSettings.requireApproval ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
              class="px-2 py-1 text-xs rounded-full font-medium"
            >
              {{ groupSettings.requireApproval ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Member Management -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Members</h3>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Current:</span>
            <span class="font-medium text-gray-900">{{ groupStore.memberCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Max:</span>
            <span class="font-medium text-gray-900">{{ groupSettings.maxMembers }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Pending:</span>
            <span class="font-medium text-yellow-600">{{ pendingRequests.length }}</span>
          </div>
        </div>
      </div>

      <!-- Invite Management -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Invites</h3>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Active:</span>
            <span class="font-medium text-gray-900">{{ activeInvites.length }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Member Invites:</span>
            <span
              :class="groupSettings.allowMemberInvites ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-2 py-1 text-xs rounded-full font-medium"
            >
              {{ groupSettings.allowMemberInvites ? 'Allowed' : 'Disabled' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Group Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Group Settings</h3>
        </div>

        <div class="space-y-6">
          <div>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                v-model="groupSettings.isPrivate"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span class="text-sm font-medium text-gray-700">Private Group</span>
                <p class="text-xs text-gray-500">Only invited members can join</p>
              </div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Members</label>
            <input
              v-model.number="groupSettings.maxMembers"
              type="number"
              min="2"
              max="1000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                v-model="groupSettings.allowMemberInvites"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Allow Members to Invite</span>
            </label>
          </div>

          <div>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                v-model="groupSettings.requireApproval"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Require Approval to Join</span>
            </label>
          </div>

          <div>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                v-model="groupSettings.autoApproveMembers"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Auto-approve Members</span>
            </label>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            @click="showSettings = false"
            class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="handleUpdateSettings"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Member Modal -->
    <div v-if="showRemoveMemberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Remove Member</h3>
        </div>

        <div class="mb-6">
          <p class="text-gray-600">
            Are you sure you want to remove <strong>{{ selectedMember?.username }}</strong> from the group?
          </p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
          <textarea
            v-model="removeReason"
            rows="3"
            placeholder="Enter reason for removal..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="showRemoveMemberModal = false"
            class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            @click="handleRemoveMember"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? 'Removing...' : 'Remove Member' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Member List with Actions -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Member Management
        </h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="member in groupStore.currentGroupMembers"
          :key="member.userId"
          class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-semibold text-lg">{{ member.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ member.username }}</div>
              <div class="text-sm text-gray-500">{{ member.email }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              :class="
                member.role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
              "
              class="px-3 py-1 text-xs rounded-full font-medium"
            >
              {{ member.role }}
            </span>

            <span
              :class="
                member.status === 'accepted'
                  ? 'bg-green-100 text-green-800'
                  : member.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              "
              class="px-3 py-1 text-xs rounded-full font-medium"
            >
              {{ member.status }}
            </span>

            <button
              v-if="isAdmin && member.userId !== currentUserId"
              @click="openRemoveMemberModal(member)"
              class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove member"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Code Validation Section -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Invite Code Management
        </h3>
        <p class="text-sm text-gray-600 mt-1">Validate and generate invite codes</p>
      </div>

      <div class="p-6 space-y-6">
        <div class="flex gap-3">
          <input
            v-model="inviteCodeToValidate"
            type="text"
            placeholder="Enter invite code to validate..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <button
            @click="handleInviteCodeValidation"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium"
          >
            Validate
          </button>
        </div>

        <div v-if="inviteCodeValidation" class="p-4 rounded-xl" :class="inviteCodeValidation.isValid ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
          <div class="flex items-center gap-2">
            <svg v-if="inviteCodeValidation.isValid" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ inviteCodeValidation.message }}
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="generateSecureInviteCode"
            class="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200 font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Generate New Code
          </button>
        </div>

        <div v-if="newInviteCode" class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h4 class="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            New Invite Code Generated
          </h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-blue-700">Code:</span>
              <code class="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-mono text-sm font-semibold">{{ newInviteCode }}</code>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-blue-700">Expires:</span>
              <span class="text-sm text-blue-600">{{ new Date(inviteExpiry).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Invites Section -->
    <div v-if="pendingInvites.length > 0" class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Pending Invites
        </h3>
        <p class="text-sm text-gray-600 mt-1">Manage active invite codes</p>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="invite in pendingInvites"
          :key="invite.id"
          class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="font-medium text-gray-900">Code: {{ invite.inviteCode }}</div>
              <div class="text-sm text-gray-500">Invited by {{ invite.inviterName }}</div>
              <div class="text-xs text-gray-400">Expires: {{ new Date(invite.expiresAt).toLocaleString() }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {{ invite.currentUses }}/{{ invite.maxUses }} uses
            </span>
            <button
              @click="handleRevokeInvite(invite.id)"
              class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Revoke invite"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Requests Section -->
    <!-- <div v-if="joinRequests.length > 0" class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Join Requests
        </h3>
        <p class="text-sm text-gray-600 mt-1">Review and approve pending join requests</p>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="request in joinRequests"
          :key="request.id"
          class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-semibold text-lg">{{ request.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ request.username }}</div>
              <div class="text-sm text-gray-500">{{ request.email }}</div>
              <div v-if="request.message" class="text-sm text-gray-600 mt-1">{{ request.message }}</div>
              <div class="text-xs text-gray-400">Requested: {{ new Date(request.createdAt).toLocaleString() }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span
              :class="
                request.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
              class="px-3 py-1 text-xs rounded-full font-medium"
            >
              {{ request.status }}
            </span>

            <div v-if="request.status === 'pending'" class="flex gap-2">
              <button
                @click="handleApproveRequest(request.id, true)"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors duration-200 font-medium"
              >
                Approve
              </button>
              <button
                @click="handleApproveRequest(request.id, false)"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200 font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
