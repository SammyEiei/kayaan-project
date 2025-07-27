<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { InviteMemberRequest } from '@/types/group'
import InviteCodeGenerator from './InviteCodeGenerator.vue'

interface Props {
  groupId: string
  groupName: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const currentCode = computed(() => {
  const g = groupStore.userGroups.find((g) => g.id === props.groupId)
  return g?.inviteCode || ''
})

const inviteType = ref<'username' | 'email' | 'link' | 'code'>('username')
const inviteValue = ref('')
const isInviting = ref(false)
const showInviteModal = ref(false)
const showInviteCodeModal = ref(false)
const linkCopied = ref(false)

const inviteLink = computed(() => {
  return `${window.location.origin}/join-group/${props.groupId}`
})

const inviteMember = async () => {
  if (!inviteValue.value.trim()) return

  isInviting.value = true
  try {
    const inviteData: InviteMemberRequest = {
      groupId: props.groupId,
      username: inviteType.value === 'username' ? inviteValue.value : undefined,
      email: inviteType.value === 'email' ? inviteValue.value : undefined,
    }

    await groupStore.inviteMember(inviteData)
    inviteValue.value = ''
    showInviteModal.value = false
  } catch (error) {
    console.error('Failed to invite member:', error)
  } finally {
    isInviting.value = false
  }
}

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}
</script>

<template>
  <div
    class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
  >
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:rotate-3"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900">Invite Members</h2>
    </div>

    <div class="space-y-4">
      <!-- Invite by Username/Email -->
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] transform"
      >
        <h3 class="font-medium text-gray-800 mb-3">Invite by Username or Email</h3>
        <div class="flex gap-3">
          <select
            v-model="inviteType"
            class="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm hover:border-gray-300 cursor-pointer"
          >
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="code">Invite Code</option>
          </select>
          <input
            v-model="inviteValue"
            :placeholder="
              inviteType === 'username'
                ? 'Enter username...'
                : inviteType === 'email'
                  ? 'Enter email...'
                  : 'Enter invite code...'
            "
            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm hover:border-gray-300"
            @keyup.enter="inviteMember"
          />
          <button
            @click="inviteMember"
            :disabled="!inviteValue.trim() || isInviting"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            <svg v-if="isInviting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-else>Invite</span>
          </button>
        </div>
      </div>

      <!-- Invite Link -->
      <div
        class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] transform"
      >
        <h3 class="font-medium text-gray-800 mb-3">Share Invite Link</h3>
        <div class="flex gap-3">
          <input
            :value="inviteLink"
            readonly
            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm text-gray-600 transition-all duration-200 hover:border-gray-300 cursor-text"
          />
          <button
            @click="copyInviteLink"
            class="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95 hover:shadow-lg overflow-hidden"
          >
            <transition name="icon-switch" mode="out-in">
              <svg
                v-if="!linkCopied"
                key="copy"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <svg
                v-else
                key="check"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </transition>
            <span>{{ linkCopied ? 'Copied!' : 'Copy' }}</span>

            <!-- Success ripple effect -->
            <transition name="ripple">
              <div v-if="linkCopied" class="absolute inset-0 bg-white/30 animate-ripple"></div>
            </transition>
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-2 transition-all duration-200">
          Anyone with this link can request to join your group
        </p>
      </div>

      <!-- Invite Code Section -->
      <div
        class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] transform"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-800">Invite Code</h3>
          <button
            @click="showInviteCodeModal = true"
            class="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-md"
          >
            Generate Code
          </button>
        </div>
        <p class="text-sm text-gray-600 transition-all duration-200">
          Create a unique invite code that people can use to join your group directly
        </p>
      </div>
    </div>

    <!-- Invite Code Generator Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <InviteCodeGenerator
          v-if="showInviteCodeModal"
          :group-id="groupId"
          :group-name="groupName"
          :current-invite-code="currentCode"
          @close="showInviteCodeModal = false"
          @code-generated="showInviteCodeModal = false"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Icon switch animation */
.icon-switch-enter-active,
.icon-switch-leave-active {
  transition: all 0.2s ease;
}

.icon-switch-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

.icon-switch-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}

/* Ripple animation */
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

.ripple-enter-active {
  transition: all 0.6s ease-out;
}

.ripple-enter-from {
  transform: scale(0);
  opacity: 1;
}

.ripple-enter-to {
  transform: scale(2);
  opacity: 0;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Hover lift effect for cards */
@keyframes cardLift {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.01);
  }
  100% {
    transform: translateY(0) scale(1.01);
  }
}

/* Smooth focus transitions */
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button press effect */
button:active:not(:disabled) {
  transition-duration: 0.1s;
}

/* Gradient animation on hover */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
}

.bg-gradient-to-r:hover {
  background-position: 100% 50%;
}
</style>
