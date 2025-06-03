<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-4xl mx-auto p-8 space-y-8">
      <!-- Simple Header -->
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center"
        >
          <svg
            class="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            <path d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Personalization</h1>
          <p class="text-gray-600 mt-2">Customize your profile and preferences</p>
        </div>
      </div>

      <!-- Current Settings Card -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div
                class="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-0.5 shadow-lg"
              >
                <div
                  class="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="currentAvatar"
                    :src="currentAvatar"
                    class="w-full h-full rounded-xl object-cover"
                    alt="Profile photo"
                  />
                  <span v-else class="text-xl font-semibold text-white">{{
                    displayName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  }}</span>
                </div>
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
              ></div>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ displayName }}</h3>
              <p class="text-gray-600">
                {{ currentAvatar ? 'Custom avatar' : 'Default avatar' }}
              </p>
            </div>
          </div>

          <div class="hidden md:block h-12 w-px bg-gray-200"></div>

          <div class="text-center md:text-left">
            <h4 class="text-lg font-semibold text-gray-900">Current Theme</h4>
            <p class="text-gray-600">{{ currentTheme?.name || 'Default Light' }}</p>
          </div>
        </div>
      </div>

      <!-- Simple Tabs -->
      <div class="space-y-6">
        <div class="flex justify-center">
          <div
            class="inline-flex bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200"
          >
            <button
              @click="tab = 'avatar'"
              :class="
                tab === 'avatar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              "
              class="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
              </svg>
              Avatar
            </button>
            <button
              @click="tab = 'theme'"
              :class="
                tab === 'theme'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              "
              class="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              Theme
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="relative">
          <transition name="fade" mode="out-in">
            <div v-if="tab === 'avatar'" key="avatar">
              <AvatarEditor
                :current-avatar="currentAvatar"
                :display-name="displayName"
                @avatar-change="handleAvatarChange"
              />
            </div>
            <div v-else key="theme">
              <ThemeSelector :current-theme="currentTheme" @theme-change="handleThemeChange" />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AvatarEditor from '@/components/AvatarEditor.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

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

const tab = ref<'avatar' | 'theme'>('avatar')
const displayName = ref('Kay Anderson')
const currentAvatar = ref<string>('')
const currentTheme = ref<Theme | null>(null)

function handleAvatarChange(avatar: string) {
  currentAvatar.value = avatar
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

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-timing-function: ease;
  transition-duration: 200ms;
}
</style>
