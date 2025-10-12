/* Custom border width */ .border-3 { border-width: 3px; }
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Header Section -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-center gap-4 mb-4">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold">Settings</h1>
          </div>
          <p class="text-blue-100 text-center text-lg">Manage your profile and preferences</p>
        </div>
      </div>

      <!-- Current Settings Card -->
      <div class="bg-white rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="flex items-center gap-6">
            <div class="relative group">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div class="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                  <img
                    v-if="userAvatarUrl"
                    :src="userAvatarUrl"
                    :key="avatarKey"
                    :alt="authStore.user?.username || 'User avatar'"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-2xl font-bold text-gray-700">{{
                    displayName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  }}</span>
                </div>
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-1">
                {{ authStore.user?.username || 'User' }}
              </h3>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">
                  {{ currentAvatar ? 'Custom avatar' : 'Default avatar' }}
                </p>
              </div>
            </div>
          </div>

          <div class="hidden lg:block h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

          <div class="text-center lg:text-left">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
              <div class="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-1.5v-17a8.5 8.5 0 0 1 0 17Z"/>
                </svg>
                <p class="text-sm font-semibold text-blue-700">Current Theme</p>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ currentTheme?.name || 'Default Light' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex border-b-2 border-gray-200">
            <button
              @click="tab = 'avatar'"
              :class="
                tab === 'avatar'
                  ? 'border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              "
              class="flex-1 px-8 py-5 text-lg font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <div :class="
                tab === 'avatar'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white'
              " class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                </svg>
              </div>
              <span>Avatar Settings</span>
            </button>
             <button
              @click="tab = 'theme'"
              :class="
                tab === 'theme'
                  ? 'border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              "
              class="flex-1 px-8 py-5 text-lg font-bold border-b-2 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <div :class="
                tab === 'theme'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white'
              " class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300">
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-1.5v-17a8.5 8.5 0 0 1 0 17Z"/>
                </svg>
              </div>
              <span>Theme Settings</span>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="p-8">
            <transition name="fade" mode="out-in">
              <div v-if="tab === 'avatar'" key="avatar" class="w-full">
                <AvatarEditor
                  :current-avatar="currentAvatar"
                  :display-name="displayName"
                  @avatar-change="handleAvatarChange"
                />
              </div>
              <div v-else key="theme" class="w-full">
                <ThemeSelector :current-theme="currentTheme" @theme-change="handleThemeChange" />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue' // 🆕 Add computed, watch
import AvatarEditor from '@/components/AvatarEditor.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { useAuthStore } from '@/stores/auth' // 🆕 Add import

interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
  }
  isDark: boolean
}
const userAvatarUrl = computed(() => authStore.user?.avatarUrl || '')

// 🆕 Add authStore
const authStore = useAuthStore()

// 🆕 Add reactive key for forcing image reload
const avatarKey = ref(0)

const tab = ref<'avatar' | 'theme'>('avatar')
const displayName = computed(() => authStore.user?.username || 'User')
// Use avatar from auth store
const currentAvatar = computed(() => authStore.currentUserAvatar)

// 🆕 Watch for avatar changes and increment key
watch(currentAvatar, () => {
  avatarKey.value++
})

const currentTheme = ref<Theme | null>(null)
function handleAvatarChange(avatar: string) {
  // 🆕 Update authStore when avatar changes
  authStore.setAvatar(avatar)
  console.log('Avatar changed:', avatar)
}

function handleThemeChange(theme: Theme) {
  currentTheme.value = theme
  console.log('Theme changed:', theme)
}

onMounted(() => {
  // Initialize with default theme
  currentTheme.value = {
    id: 'default',
    name: 'Default Light',
    colors: {
      primary: '#2563eb',
      secondary: '#6366f1',
      background: '#ffffff',
      foreground: '#111827',
      accent: '#f8fafc',
    },
    isDark: false,
  }
})
</script>

<style scoped>
/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Custom border width */
.border-3 {
  border-width: 3px;
}
</style>
