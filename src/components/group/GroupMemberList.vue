<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { GroupMember, UpdateMemberRoleRequest } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const showRoleMenu = ref<string | null>(null)
const isUpdatingRole = ref(false)

const members = computed(() => groupStore.currentGroupMembers)
const canManageMembers = computed(() => groupStore.canManageGroup)

const getRoleColor = (role: string) => {
  switch (role) {
    case 'owner':
      return 'from-yellow-400 to-orange-500'
    case 'moderator':
      return 'from-purple-400 to-pink-500'
    default:
      return 'from-blue-400 to-indigo-500'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'owner':
      return 'Owner'
    case 'moderator':
      return 'Moderator'
    default:
      return 'Member'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const updateMemberRole = async (member: GroupMember, newRole: 'member' | 'moderator') => {
  if (member.role === newRole) return

  isUpdatingRole.value = true
  try {
    const roleData: UpdateMemberRoleRequest = {
      groupId: props.groupId,
      userId: member.userId,
      role: newRole,
    }
    await groupStore.updateMemberRole(roleData)
    showRoleMenu.value = null
  } catch (error) {
    console.error('Failed to update member role:', error)
  } finally {
    isUpdatingRole.value = false
  }
}

const removeMember = async (memberId: string) => {
  // TODO: Implement remove member functionality
  console.log('Remove member:', memberId)
}

const toggleRoleMenu = (memberId: string) => {
  showRoleMenu.value = showRoleMenu.value === memberId ? null : memberId
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-gray-900">Group Members</h3>
        <p class="text-gray-500">{{ members.length }} members</p>
      </div>
    </div>

    <!-- Members List -->
    <div class="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden">
      <div v-if="members.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p class="text-gray-500">No members found</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="member in members"
          :key="member.userId"
          class="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md"
              >
                <img
                  v-if="member.avatarUrl"
                  :src="member.avatarUrl"
                  :alt="member.username"
                  class="w-full h-full object-cover rounded-xl"
                />
                <span v-else>{{ member.username.charAt(0).toUpperCase() }}</span>
              </div>
              <div
                v-if="member.status === 'pending'"
                class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
                title="Pending approval"
              ></div>
            </div>

            <!-- Member Info -->
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-gray-800">{{ member.username }}</h4>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full text-white"
                  :class="`bg-gradient-to-r ${getRoleColor(member.role)}`"
                >
                  {{ getRoleLabel(member.role) }}
                </span>
                <span
                  v-if="member.status === 'pending'"
                  class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"
                >
                  Pending
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ member.email }}</p>
              <p class="text-xs text-gray-400">Joined {{ formatDate(member.joinedAt) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Role Management -->
            <div v-if="canManageMembers && member.role !== 'owner'" class="relative">
              <button
                @click="toggleRoleMenu(member.userId)"
                class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                :disabled="isUpdatingRole"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              <!-- Role Menu -->
              <div
                v-if="showRoleMenu === member.userId"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
              >
                <div class="py-2">
                  <button
                    @click="updateMemberRole(member, 'member')"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    :class="member.role === 'member' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'"
                  >
                    Set as Member
                  </button>
                  <button
                    @click="updateMemberRole(member, 'moderator')"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    :class="
                      member.role === 'moderator' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                    "
                  >
                    Set as Moderator
                  </button>
                  <hr class="my-1" />
                  <button
                    @click="removeMember(member.userId)"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Remove from Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
