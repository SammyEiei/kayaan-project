<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import GroupHeader from '@/components/group/GroupHeader.vue'
import GroupMemberList from '@/components/group/GroupMemberList.vue'
import GroupLibrary from '@/components/group/GroupLibrary.vue'
import InviteMembers from '@/components/group/InviteMembers.vue'
import LeaveGroupModal from '@/components/group/LeaveGroupModal.vue'
import DeleteGroupModal from '@/components/group/DeleteGroupModal.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()

const activeTab = ref<'overview' | 'members' | 'library' | 'invite'>('overview')
const showLeaveModal = ref(false)
const showDeleteModal = ref(false)

const groupId = computed(() => route.params.id as string)
const currentGroup = computed(() => groupStore.currentGroup)
const canManageGroup = computed(() => groupStore.canManageGroup)

onMounted(async () => {
  if (groupId.value) {
    await groupStore.fetchGroupDetails(groupId.value)
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

const handleTabChange = (tab: string) => {
  activeTab.value = tab as any
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
        <!-- Loading State -->
        <div v-if="groupStore.loading" class="flex items-center justify-center py-20">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-gray-600 font-medium">Loading group details...</span>
          </div>
        </div>

        <!-- Group Content -->
        <div v-else-if="currentGroup">
          <!-- Group Header -->
          <GroupHeader
            :group="currentGroup"
            @leave="showLeaveModal = true"
            @delete="showDeleteModal = true"
          />

          <!-- Navigation Tabs -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl">
            <div class="border-b border-gray-200">
              <nav class="flex space-x-8 px-6">
                <button
                  v-for="tab in [
                    { id: 'overview', label: 'Overview', icon: 'grid' },
                    { id: 'members', label: 'Members', icon: 'users' },
                    { id: 'library', label: 'Library', icon: 'book' },
                    { id: 'invite', label: 'Invite', icon: 'user-plus' },
                  ]"
                  :key="tab.id"
                  @click="handleTabChange(tab.id)"
                  class="flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                  :class="
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  "
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      v-if="tab.icon === 'grid'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
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
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Group Stats -->
                  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-white"
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
                      <h3 class="font-semibold text-gray-800">Members</h3>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">{{ currentGroup.memberCount }}</p>
                    <p class="text-sm text-gray-500">Active members</p>
                  </div>

                  <!-- Resources Stats -->
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 class="font-semibold text-gray-800">Resources</h3>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">
                      {{ groupStore.currentGroupResources.length }}
                    </p>
                    <p class="text-sm text-gray-500">Shared resources</p>
                  </div>

                  <!-- Recent Activity -->
                  <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <div
                        class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <h3 class="font-semibold text-gray-800">Activity</h3>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">12</p>
                    <p class="text-sm text-gray-500">This week</p>
                  </div>
                </div>

                <!-- Recent Resources -->
                <div class="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  <h3 class="font-semibold text-gray-800 mb-4">Recent Resources</h3>
                  <div
                    v-if="groupStore.currentGroupResources.length === 0"
                    class="text-center py-8"
                  >
                    <div
                      class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg
                        class="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p class="text-gray-500">No resources shared yet</p>
                    <button
                      @click="activeTab = 'library'"
                      class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Share First Resource
                    </button>
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="resource in groupStore.currentGroupResources.slice(0, 3)"
                      :key="resource.id"
                      class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
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

              <!-- Members Tab -->
              <div v-if="activeTab === 'members'">
                <GroupMemberList :groupId="groupId" />
              </div>

              <!-- Library Tab -->
              <div v-if="activeTab === 'library'">
                <GroupLibrary :groupId="groupId" />
              </div>

              <!-- Invite Tab -->
              <div v-if="activeTab === 'invite'">
                <InviteMembers :groupId="groupId" :group-name="currentGroup.name" />
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-20">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Group not found</h3>
          <p class="text-gray-500 mb-4">
            The group you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            @click="router.push('/study-groups')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <LeaveGroupModal
      v-if="showLeaveModal"
      :group="currentGroup"
      @confirm="handleLeaveGroup"
      @cancel="showLeaveModal = false"
    />

    <DeleteGroupModal
      v-if="showDeleteModal"
      :group="currentGroup"
      @confirm="handleDeleteGroup"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>
