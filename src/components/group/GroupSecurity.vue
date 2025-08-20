<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import type { GroupMember, JoinRequest, GroupInvite, UpdateGroupSettingsRequest } from '@/types/group'

interface Props {
  groupId: string
}

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
    await groupStore.removeMember(props.groupId, selectedMember.value.userId, removeReason.value)
    showRemoveMemberModal.value = false
    selectedMember.value = null
    removeReason.value = ''
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
    // Refresh invites
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

onMounted(() => {
  // Load current group settings
  if (groupStore.currentGroup) {
    groupSettings.value.isPrivate = groupStore.currentGroup.isPrivate || false
    groupSettings.value.maxMembers = groupStore.currentGroup.maxMembers || 50
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Security & Management</h2>
      <div class="flex gap-3">
        <button
          v-if="isAdmin"
          @click="showSettings = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Group Settings
        </button>
        <button
          v-if="isAdmin"
          @click="showInviteModal = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Manage Invites
        </button>
        <button
          v-if="isAdmin"
          @click="showJoinRequests = true"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Join Requests
        </button>
      </div>
    </div>

    <!-- Security Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Privacy Status -->
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Privacy</h3>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Group Type:</span>
            <span :class="groupSettings.isPrivate ? 'text-red-600' : 'text-green-600'">
              {{ groupSettings.isPrivate ? 'Private' : 'Public' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Approval Required:</span>
            <span :class="groupSettings.requireApproval ? 'text-yellow-600' : 'text-green-600'">
              {{ groupSettings.requireApproval ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Member Management -->
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Members</h3>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Current:</span>
            <span class="font-medium">{{ groupStore.memberCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Max:</span>
            <span class="font-medium">{{ groupSettings.maxMembers }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Pending:</span>
            <span class="font-medium text-yellow-600">{{ pendingRequests.length }}</span>
          </div>
        </div>
      </div>

      <!-- Invite Management -->
      <div class="bg-white rounded-lg p-6 border border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Invites</h3>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Active:</span>
            <span class="font-medium">{{ activeInvites.length }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Member Invites:</span>
            <span :class="groupSettings.allowMemberInvites ? 'text-green-600' : 'text-red-600'">
              {{ groupSettings.allowMemberInvites ? 'Allowed' : 'Disabled' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Group Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Group Settings</h3>

        <div class="space-y-4">
          <div>
            <label class="flex items-center">
              <input
                v-model="groupSettings.isPrivate"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm font-medium text-gray-700">Private Group</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">Only invited members can join</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Members</label>
            <input
              v-model.number="groupSettings.maxMembers"
              type="number"
              min="2"
              max="1000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="flex items-center">
              <input
                v-model="groupSettings.allowMemberInvites"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm font-medium text-gray-700">Allow Members to Invite</span>
            </label>
          </div>

          <div>
            <label class="flex items-center">
              <input
                v-model="groupSettings.requireApproval"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm font-medium text-gray-700">Require Approval to Join</span>
            </label>
          </div>

          <div>
            <label class="flex items-center">
              <input
                v-model="groupSettings.autoApproveMembers"
                type="checkbox"
                class="mr-2"
              />
              <span class="text-sm font-medium text-gray-700">Auto-approve Members</span>
            </label>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="handleUpdateSettings"
            :disabled="loading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <button
            @click="showSettings = false"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Member Modal -->
    <div v-if="showRemoveMemberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Remove Member</h3>

        <div class="mb-4">
          <p class="text-gray-600">
            Are you sure you want to remove <strong>{{ selectedMember?.username }}</strong> from the group?
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
          <textarea
            v-model="removeReason"
            rows="3"
            placeholder="Enter reason for removal..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="handleRemoveMember"
            :disabled="loading"
            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {{ loading ? 'Removing...' : 'Remove Member' }}
          </button>
          <button
            @click="showRemoveMemberModal = false"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Member List with Actions -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Member Management</h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="member in groupStore.currentGroupMembers"
          :key="member.userId"
          class="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold">{{ member.username.charAt(0) }}</span>
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
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              "
              class="px-2 py-1 text-xs rounded-full font-medium"
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
              class="px-2 py-1 text-xs rounded-full font-medium"
            >
              {{ member.status }}
            </span>

            <button
              v-if="isAdmin && member.userId !== currentUserId"
              @click="openRemoveMemberModal(member)"
              class="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
