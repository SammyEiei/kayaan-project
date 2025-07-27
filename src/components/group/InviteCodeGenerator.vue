<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import type { GenerateInviteCodeRequest } from '@/types/group'

interface Props {
  groupId: string
  groupName: string
  currentInviteCode?: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()

const emit = defineEmits<{
  close: []
  codeGenerated: [code: string]
}>()

const codeLength = ref(6)
const expiresIn = ref(24) // hours
const isGenerating = ref(false)
const showAdvancedOptions = ref(false)
const generatedCode = ref(props.currentInviteCode || '')
const codeCopied = ref(false)
const linkCopied = ref(false)

const codeLengthOptions = [
  { value: 4, label: '4 characters' },
  { value: 6, label: '6 characters' },
  { value: 8, label: '8 characters' },
]

const expiresInOptions = [
  { value: 1, label: '1 hour' },
  { value: 24, label: '24 hours' },
  { value: 72, label: '3 days' },
  { value: 168, label: '1 week' },
]

const inviteLink = computed(() => {
  if (generatedCode.value) {
    return `${window.location.origin}/join-group/${generatedCode.value}`
  }
  return ''
})

const generateCode = async () => {
  isGenerating.value = true
  try {
    const request: GenerateInviteCodeRequest = {
      groupId: props.groupId,
      codeLength: codeLength.value,
      expiresIn: expiresIn.value,
    }

    const result = await groupStore.generateNewInviteCode(request)
    generatedCode.value = result.inviteCode
    emit('codeGenerated', result.inviteCode)
  } catch (error) {
    console.error('Failed to generate invite code:', error)
  } finally {
    isGenerating.value = false
  }
}

const copyInviteLink = async () => {
  if (inviteLink.value) {
    try {
      await navigator.clipboard.writeText(inviteLink.value)
      linkCopied.value = true
      setTimeout(() => {
        linkCopied.value = false
      }, 2000)
    } catch (error) {
      console.error('Failed to copy invite link:', error)
    }
  }
}

const copyInviteCode = async () => {
  if (generatedCode.value) {
    try {
      await navigator.clipboard.writeText(generatedCode.value)
      codeCopied.value = true
      setTimeout(() => {
        codeCopied.value = false
      }, 2000)
    } catch (error) {
      console.error('Failed to copy invite code:', error)
    }
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Invite Code</h3>
        </div>
        <button
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Current Invite Code -->
        <div v-if="generatedCode" class="animate-fadeIn">
          <label class="block text-sm font-medium text-gray-700 mb-3">Current Invite Code</label>
          <div class="flex items-center gap-3">
            <div
              class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 transition-all duration-200 hover:border-gray-300"
            >
              <code class="text-lg font-mono font-bold text-gray-900">{{ generatedCode }}</code>
            </div>
            <button
              @click="copyInviteCode"
              class="relative px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              title="Copy invite code"
            >
              <transition name="fade" mode="out-in">
                <svg
                  v-if="!codeCopied"
                  class="w-5 h-5"
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
                  class="w-5 h-5 text-green-600"
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
            </button>
          </div>

          <!-- Invite Link -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Invite Link</label>
            <div class="flex items-center gap-3">
              <input
                :value="inviteLink"
                type="text"
                readonly
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm transition-all duration-200 hover:border-gray-300"
              />
              <button
                @click="copyInviteLink"
                class="relative px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
                title="Copy invite link"
              >
                <transition name="fade" mode="out-in">
                  <svg
                    v-if="!linkCopied"
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
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </transition>
              </button>
            </div>
          </div>
        </div>

        <!-- Generate New Code -->
        <div>
          <h4 class="font-medium text-gray-900 mb-4">Generate New Invite Code</h4>

          <!-- Advanced Options Toggle -->
          <button
            @click="showAdvancedOptions = !showAdvancedOptions"
            class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4 transition-all duration-200 transform hover:translate-x-1"
          >
            <svg
              class="w-4 h-4 transition-transform duration-300"
              :class="showAdvancedOptions ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Advanced Options
          </button>

          <!-- Advanced Options -->
          <transition
            name="slide-fade"
            @enter="$el.style.maxHeight = '0px'"
            @enter-to="$el.style.maxHeight = $el.scrollHeight + 'px'"
            @leave="$el.style.maxHeight = $el.scrollHeight + 'px'"
            @leave-to="$el.style.maxHeight = '0px'"
          >
            <div v-if="showAdvancedOptions" class="overflow-hidden transition-all duration-300">
              <div class="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <!-- Code Length -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Code Length</label>
                  <select
                    v-model="codeLength"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option
                      v-for="option in codeLengthOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <!-- Expiration Time -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Expires In</label>
                  <select
                    v-model="expiresIn"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option
                      v-for="option in expiresInOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </transition>

          <!-- Generate Button -->
          <button
            @click="generateCode"
            :disabled="isGenerating"
            class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            <svg v-if="isGenerating" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
            <span v-else>Generate New Code</span>
          </button>
        </div>

        <!-- Instructions -->
        <div
          class="bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
        >
          <h5 class="font-medium text-blue-900 mb-2">How to use invite codes:</h5>
          <ul class="text-sm text-blue-800 space-y-1">
            <li class="flex items-start gap-1">
              <span>•</span>
              <span>Share the invite code with people you want to invite</span>
            </li>
            <li class="flex items-start gap-1">
              <span>•</span>
              <span>They can enter the code to join your group</span>
            </li>
            <li class="flex items-start gap-1">
              <span>•</span>
              <span>Codes can be regenerated anytime</span>
            </li>
            <li class="flex items-start gap-1">
              <span>•</span>
              <span>Old codes become invalid when a new one is generated</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-gray-200">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide fade animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Slide up animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out;
}
</style>
