<template>
  <div class="animate-fade-in space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <svg
        class="h-8 w-8 text-primary"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.343 6.343l-1.414-1.414m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414"
        />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <div>
        <h1 class="text-3xl font-bold">Personalization</h1>
        <p class="text-gray-400">Customize your avatar and theme preferences</p>
      </div>
    </div>

    <!-- Current Settings Overview -->
    <div class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <div
            class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold"
          >
            <img
              v-if="currentAvatar"
              :src="currentAvatar"
              class="w-16 h-16 rounded-full object-cover"
            />
            <span v-else>{{
              displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
            }}</span>
          </div>
          <div>
            <h3 class="font-medium">{{ displayName }}</h3>
            <p class="text-sm text-gray-400">
              {{ currentAvatar ? 'Custom avatar' : 'Default avatar' }}
            </p>
          </div>
        </div>
        <div class="h-8 border-r"></div>
        <div>
          <h4 class="font-medium">Theme</h4>
          <p class="text-sm text-gray-400">{{ currentTheme?.name || 'Default Light' }}</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div>
      <div class="grid w-full md:w-auto md:inline-flex grid-cols-2 gap-1 border-b mb-4">
        <button
          :class="tab === 'avatar' ? activeTabClass : inactiveTabClass"
          @click="tab = 'avatar'"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
          </svg>
          <span class="hidden md:inline">Avatar</span>
        </button>
        <button :class="tab === 'theme' ? activeTabClass : inactiveTabClass" @click="tab = 'theme'">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M8 3v18M16 3v18" />
          </svg>
          <span class="hidden md:inline">Theme</span>
        </button>
      </div>
      <div class="space-y-6">
        <div v-if="tab === 'avatar'">
          <AvatarEditor :current-avatar="currentAvatar" @avatar-change="handleAvatarChange" />
        </div>
        <div v-else>
          <ThemeSelector :current-theme="currentTheme" @theme-change="handleThemeChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AvatarEditor from '@/components/AvatarEditor.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

const tab = ref<'avatar' | 'theme'>('avatar')
const displayName = 'Kay Anderson'
const currentAvatar = ref<string>('')
const currentTheme = ref<{ name: string } | null>(null)

const activeTabClass =
  'px-4 py-2 font-medium flex items-center gap-2 border-b-2 border-primary text-primary bg-white'
const inactiveTabClass =
  'px-4 py-2 font-medium flex items-center gap-2 border-b-2 border-transparent text-gray-400 bg-transparent'

function handleAvatarChange(avatar: string) {
  currentAvatar.value = avatar
  localStorage.setItem('userAvatar', avatar)
}
function handleThemeChange(theme: { name: string }) {
  currentTheme.value = theme
}

onMounted(() => {
  const savedAvatar = localStorage.getItem('userAvatar')
  if (savedAvatar) {
    currentAvatar.value = savedAvatar
  }
})
</script>

<style scoped>
:root {
  --primary: #7e69ab;
}
.bg-primary {
  background: var(--primary);
}
.text-primary {
  color: var(--primary);
}
.border-primary {
  border-color: var(--primary);
}
.ring-primary\/20 {
  --tw-ring-color: rgb(126 105 171 / 0.2);
}
</style>
