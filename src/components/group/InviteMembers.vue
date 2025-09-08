<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
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

const showInviteCodeModal = ref(false)
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
          :group-id="Number(groupId)"
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
