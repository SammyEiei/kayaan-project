<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import type { GroupMember, UpdateMemberRoleRequest } from '@/types/group'

// const props = defineProps<{ groupId: string }>()
const groupStore = useGroupStore()
const auth = useAuthStore()

const showRoleMenu = ref<string | null>(null)
const isUpdatingRole = ref(false)

const members = computed(() => groupStore.currentGroupMembers)
const canManageMembers = computed(() => groupStore.canManageGroup)

// แยกสมาชิกตาม role
const adminMembers = computed(() => members.value.filter(member => member.role === 'admin'))
const regularMembers = computed(() => members.value.filter(member => member.role === 'member'))

// Helper ใช้ข้อมูลจาก authStore
const meId = computed(() => String(auth.currentUserId ?? auth.user?.id))

const displayName = (member: GroupMember) => {
  // ถ้าเป็นเราเอง → ใช้ชื่อจาก authStore
  if (String(member.userId) === meId.value) {
    return (
      auth.user?.username ||
      (auth.user?.firstname && auth.user?.lastname
        ? `${auth.user.firstname} ${auth.user.lastname}`
        : auth.user?.firstname || auth.user?.lastname) ||
      auth.user?.email ||
      `User #${member.userId}`
    )
  }
  // ถ้า backend enrich มาแล้ว ให้ใช้
  return ('username' in member && member.username) || `User #${member.userId}`
}

const displayEmail = (member: GroupMember) => {
  if (String(member.userId) === meId.value) {
    return auth.user?.email || 'No email'
  }
  return ('email' in member && member.email) || 'No email'
}

const displayAvatar = (member: GroupMember) => {
  if ('avatarUrl' in member && member.avatarUrl) return member.avatarUrl
  if (String(member.userId) === meId.value) return auth.user?.avatarUrl || null
  return null
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'from-yellow-400 to-orange-500'
    default:
      return 'from-blue-400 to-indigo-500'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    default:
      return 'Member'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getInitial = (name: unknown) => {
  const s = (typeof name === 'string' && name) || ''
  return s ? s.charAt(0).toUpperCase() : '?'
}

const updateMemberRole = async (member: GroupMember, newRole: 'member' | 'admin') => {
  if (member.role === newRole) return

  isUpdatingRole.value = true
  try {
    const roleData: UpdateMemberRoleRequest = {
      userId: String(member.userId),
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

const removeMember = async (memberId: string | number) => {
  if (!confirm(`Are you sure you want to remove this member from the group?`)) {
    return
  }

  try {
    await groupStore.removeMember(String(memberId))
    // Member will be automatically removed from the list via store update
  } catch (error) {
    console.error('Failed to remove member:', error)
    // You might want to show an error message to the user here
  }
}

const toggleRoleMenu = (memberId: string | number) => {
  const memberIdStr = String(memberId)
  showRoleMenu.value = showRoleMenu.value === memberIdStr ? null : memberIdStr
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
    <div v-if="members.length === 0" class="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
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

    <div v-else class="space-y-6">
      <!-- Administrators Section -->
      <div v-if="adminMembers.length > 0" class="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden">
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-yellow-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">Administrators</h4>
              <p class="text-sm text-gray-600">{{ adminMembers.length }} administrator{{ adminMembers.length > 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="member in adminMembers"
            :key="member.userId"
            class="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden"
              >
                                  <img
                    v-if="displayAvatar(member)"
                    :src="displayAvatar(member)!"
                    :alt="displayName(member)"
                    class="w-full h-full object-cover"
                  />
                <span v-else>{{ getInitial(displayName(member)) }}</span>
              </div>
              <div
                v-if="member.status === 'pending'"
                class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
                title="Pending approval"
              ></div>
            </div>

            <!-- Member Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="font-semibold text-gray-800">{{ displayName(member) }}</h4>
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
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ displayEmail(member) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6" />
                  </svg>
                  <span>Joined {{ formatDate(member.joinedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Role Management -->
              <div v-if="canManageMembers" class="relative">
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
                      @click="updateMemberRole(member, 'admin')"
                      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      :class="
                        member.role === 'admin' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      "
                    >
                      Set as Admin
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

      <!-- Members Section -->
      <div v-if="regularMembers.length > 0" class="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">Members</h4>
              <p class="text-sm text-gray-600">{{ regularMembers.length }} member{{ regularMembers.length > 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="member in regularMembers"
            :key="member.userId"
            class="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div class="relative">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden"
                >
                  <img
                    v-if="displayAvatar(member)"
                    :src="displayAvatar(member)!"
                    :alt="displayName(member)"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ getInitial(displayName(member)) }}</span>
                </div>
                <div
                  v-if="member.status === 'pending'"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"
                  title="Pending approval"
                ></div>
              </div>

              <!-- Member Info -->
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-semibold text-gray-800">{{ displayName(member) }}</h4>
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
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ displayEmail(member) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-6 6m6-6l6 6" />
                    </svg>
                    <span>Joined {{ formatDate(member.joinedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <!-- Role Management -->
              <div v-if="canManageMembers" class="relative">
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
                      @click="updateMemberRole(member, 'admin')"
                      class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      :class="
                        member.role === 'admin' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      "
                    >
                      Set as Admin
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
  </div>
</template>
