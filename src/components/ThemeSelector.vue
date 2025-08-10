<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="themeStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span class="ml-3 text-gray-600">กำลังโหลดธีม...</span>
    </div>

    <!-- Error State -->
    <div v-if="themeStore.error && !themeStore.error.includes('Authentication')" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex items-center">
        <span class="text-yellow-600 mr-2">⚠️</span>
        <div>
          <span class="text-yellow-800 font-medium">{{ themeStore.error }}</span>
          <p class="text-yellow-700 text-sm mt-1">
            You can still use all predefined themes and create custom themes. Your changes will be saved locally.
          </p>
        </div>
      </div>
    </div>

    <!-- Authentication Notice -->
    <div v-if="themeStore.error && themeStore.error.includes('Authentication')" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center">
        <span class="text-blue-600 mr-2">ℹ️</span>
        <div>
          <span class="text-blue-800 font-medium">Using Default Theme</span>
          <p class="text-blue-700 text-sm mt-1">
            You're using the default theme. All predefined themes and custom themes are available. Sign in to save your theme preferences.
          </p>
        </div>
      </div>
    </div>

    <!-- Preview Notice -->
    <div
      v-if="isPreviewMode"
      class="backdrop-blur-lg bg-gradient-to-r from-purple-100/80 to-indigo-100/80 rounded-2xl border-2 border-purple-300 p-6 shadow-xl animate-pulse"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <span class="font-semibold text-purple-800">Preview Mode</span>
          <span class="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-medium">{{
            previewTheme?.name
          }}</span>
        </div>
        <div class="flex gap-3">
          <button
            @click="confirmTheme"
            class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium"
          >
            Apply
          </button>
          <button
            @click="cancelPreview"
            class="bg-white/80 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Popular Themes -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Popular Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in themeStore.popularThemes"
          :key="theme.id || theme.name"
          class="bg-white/80 rounded-xl p-6 cursor-pointer border border-white/50 transition-all duration-500 group hover:shadow-xl hover:scale-105"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              themeStore.currentTheme?.id === theme.id && !isPreviewMode,
            'ring-2 ring-purple-200': previewTheme?.id === theme.id && isPreviewMode,
          }"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3
                class="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors"
              >
                {{ theme.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span v-if="theme.isDark">🌙</span>
                <span v-else>☀️</span>
              </div>
            </div>
            <div class="flex gap-2">
              <div
                v-for="(color, key) in theme.colors"
                :key="key"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50"
                :style="{ backgroundColor: color as string }"
                :title="key"
              ></div>
            </div>
            <p class="text-sm text-gray-600">{{ theme.description }}</p>
            <div class="flex gap-2 pt-2">
              <button
                @click.stop="handlePreview(theme)"
                class="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Preview
              </button>
              <button
                @click.stop="applyTheme(theme)"
                class="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Light Themes -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Light Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in themeStore.lightThemes"
          :key="theme.id || theme.name"
          class="bg-white/80 rounded-xl p-6 cursor-pointer border border-white/50 transition-all duration-500 group hover:shadow-xl hover:scale-105"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              themeStore.currentTheme?.id === theme.id && !isPreviewMode,
            'ring-2 ring-purple-200': previewTheme?.id === theme.id && isPreviewMode,
          }"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3
                class="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors"
              >
                {{ theme.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span>☀️</span>
              </div>
            </div>
            <div class="flex gap-2">
              <div
                v-for="(color, key) in theme.colors"
                :key="key"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50"
                :style="{ backgroundColor: color as string }"
                :title="key"
              ></div>
            </div>
            <p class="text-sm text-gray-600">{{ theme.description }}</p>
            <div class="flex gap-2 pt-2">
              <button
                @click.stop="handlePreview(theme)"
                class="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Preview
              </button>
              <button
                @click.stop="applyTheme(theme)"
                class="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dark Themes -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Dark Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in themeStore.darkThemes"
          :key="theme.id || theme.name"
          class="bg-white/80 rounded-xl p-6 cursor-pointer border border-white/50 transition-all duration-500 group hover:shadow-xl hover:scale-105"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              themeStore.currentTheme?.id === theme.id && !isPreviewMode,
            'ring-2 ring-purple-200': previewTheme?.id === theme.id && isPreviewMode,
          }"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3
                class="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors"
              >
                {{ theme.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span>🌙</span>
              </div>
            </div>
            <div class="flex gap-2">
              <div
                v-for="(color, key) in theme.colors"
                :key="key"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50"
                :style="{ backgroundColor: color as string }"
                :title="key"
              ></div>
            </div>
            <p class="text-sm text-gray-600">{{ theme.description }}</p>
            <div class="flex gap-2 pt-2">
              <button
                @click.stop="handlePreview(theme)"
                class="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Preview
              </button>
              <button
                @click.stop="applyTheme(theme)"
                class="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Random Theme Button -->
    <div class="backdrop-blur-lg bg-gradient-to-r from-purple-100/60 to-pink-100/60 border border-purple-200/50 shadow-xl rounded-2xl p-8">
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Feeling Lucky?</h3>
        <p class="text-gray-600 mb-6">Let us surprise you with a random theme!</p>
        <button
          @click="applyRandomTheme"
          :disabled="themeStore.isLoading"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          🎲 Try Random Theme
        </button>
      </div>
    </div>

    <!-- Custom Theme Editor -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Create Custom Theme</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(value, key) in customTheme.colors"
          :key="String(key)"
          class="bg-white/50 rounded-xl p-4 border border-white/30"
        >
          <label class="block text-sm font-semibold text-gray-700 mb-3 capitalize">{{ key }}</label>
          <div class="flex gap-3">
            <input
              type="color"
              v-model="customTheme.colors[key]"
              @input="updateCustomColor(key, customTheme.colors[key])"
              class="w-12 h-12 p-1 cursor-pointer border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
            />
            <input
              type="text"
              v-model="customTheme.colors[key]"
              @input="updateCustomColor(key, customTheme.colors[key])"
              class="flex-1 bg-white/80 border border-gray-200 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-between bg-white/50 rounded-xl p-4 border border-white/30 mt-6"
      >
        <div class="flex items-center gap-3">
          <span v-if="customTheme.isDark">🌙</span>
          <span v-else>☀️</span>
          <div>
            <h3 class="font-medium text-gray-800">Dark Mode</h3>
            <p class="text-sm text-gray-600">Toggle dark theme variant</p>
          </div>
        </div>
        <input type="checkbox" v-model="customTheme.isDark" @change="updateCustomColorMode" />
      </div>
      <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <input
          v-model="customThemeName"
          placeholder="Enter theme name..."
          class="flex-1 bg-white/80 border border-gray-200 rounded-lg px-3 py-2"
        />
        <button
          @click="saveCustomTheme"
          :disabled="!customThemeName.trim() || themeStore.isLoading"
          class="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-6 py-2 disabled:opacity-50"
        >
          Save Theme
        </button>
      </div>
      <div class="flex justify-center mt-6">
        <button
          @click="applyCustomTheme"
          :disabled="themeStore.isLoading"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          Apply Custom Theme
        </button>
      </div>
    </div>

    <!-- Saved Custom Themes -->
    <div
      v-if="themeStore.presets.length > 0"
      class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span class="text-2xl font-bold text-gray-800">Saved Custom Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="theme in themeStore.presets"
          :key="theme.id || theme.name"
          class="bg-white/50 rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-gray-800">{{ theme.name }}</span>
            <button
              @click="deleteCustomTheme(theme.id!)"
              :disabled="themeStore.isLoading"
              class="p-1 text-red-500 hover:bg-red-100 rounded-full disabled:opacity-50"
            >
              🗑️
            </button>
          </div>
          <div class="flex gap-1 mb-3">
            <div
              v-for="(color, index) in Object.values(theme.colors).slice(0, 5)"
              :key="index"
              class="w-6 h-6 rounded-lg border border-white shadow-sm"
              :style="{ backgroundColor: color as string }"
            />
          </div>
          <button
            @click="applyTheme(theme)"
            :disabled="themeStore.isLoading"
            class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg px-4 py-2 mt-2 disabled:opacity-50"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>

    <!-- Reset to Defaults -->
    <div
      class="backdrop-blur-lg bg-red-50/60 border border-red-200/50 shadow-xl rounded-2xl p-8 mt-6"
    >
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <h2 class="text-xl font-bold text-red-800">Reset Settings</h2>
      </div>
      <p class="text-red-700 mb-6">
        This will reset all theme customizations and saved presets to default values.
      </p>
      <button
        @click="resetToDefaults"
        :disabled="themeStore.isLoading"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
      >
        Reset All Settings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import type { Theme } from '../service/ThemeService'

// ----------------- Stores ---------------------
const themeStore = useThemeStore()
const authStore = useAuthStore()

// ----------------- States ---------------------
const previewTheme = ref<Theme | null>(null)
const isPreviewMode = ref(false)
const customThemeName = ref('')
const customTheme = ref<Theme>({
  id: undefined,
  name: 'Custom Theme',
  colors: {
    primary: '#7e69ab',
    secondary: '#1eaedb',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  isDark: false,
})

// ----------------- Utility Functions ---------------------
function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--primary', theme.colors.primary)
  root.style.setProperty('--secondary', theme.colors.secondary)
  root.style.setProperty('--background', theme.colors.background)
  root.style.setProperty('--surface', theme.colors.surface)
  root.style.setProperty('--text', theme.colors.text)
  root.style.setProperty('--text-secondary', theme.colors.textSecondary)
  root.style.setProperty('--border', theme.colors.border)
  root.style.setProperty('--success', theme.colors.success)
  root.style.setProperty('--warning', theme.colors.warning)
  root.style.setProperty('--error', theme.colors.error)
  if (theme.isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

async function applyTheme(theme: Theme) {
  if (!authStore.currentUserId) {
    // For non-logged in users, just apply locally
    themeStore.applyTheme(theme)
    return
  }

  try {
    themeStore.applyTheme(theme)
    await themeStore.saveCurrent(authStore.currentUserId)
  } catch (error: unknown) {
    // Check if it's an authentication error
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
      console.warn('Authentication required. Theme applied locally only.')
      // Don't revert theme for auth errors, just continue with local application
      return
    }

    console.error('Failed to save theme:', error)
    // Revert to previous theme on error (only for non-auth errors)
    if (themeStore.currentTheme) {
      themeStore.applyTheme(themeStore.currentTheme)
    }
  }
}

function handlePreview(theme: Theme) {
  previewTheme.value = theme
  isPreviewMode.value = true
  applyThemeToDOM(theme)
  setTimeout(() => {
    if (isPreviewMode.value) cancelPreview()
  }, 10000)
}

async function confirmTheme() {
  if (previewTheme.value) {
    await applyTheme(previewTheme.value)
    isPreviewMode.value = false
    previewTheme.value = null
  }
}

function cancelPreview() {
  if (themeStore.currentTheme) {
    applyThemeToDOM(themeStore.currentTheme)
  }
  isPreviewMode.value = false
  previewTheme.value = null
}

function updateCustomColor(key: string, value: string) {
  customTheme.value.colors[key] = value
  applyThemeToDOM(customTheme.value)
}

function updateCustomColorMode() {
  applyThemeToDOM(customTheme.value)
}

async function applyCustomTheme() {
  if (!authStore.currentUserId) {
    // For non-logged in users, just apply locally
    themeStore.applyTheme(customTheme.value)
    return
  }

  try {
    await applyTheme(customTheme.value)
  } catch (error) {
    console.error('Failed to apply custom theme:', error)
  }
}

async function saveCustomTheme() {
  if (!customThemeName.value.trim() || !authStore.currentUserId) return

  try {
    const newTheme: Theme = {
      id: undefined,
      name: customThemeName.value,
      colors: { ...customTheme.value.colors },
      isDark: customTheme.value.isDark,
      description: 'Custom theme created by user',
    }
    await themeStore.savePreset(authStore.currentUserId, newTheme)
    customThemeName.value = ''
  } catch (error) {
    console.error('Failed to save custom theme:', error)
  }
}

async function deleteCustomTheme(themeId: number) {
  if (!authStore.currentUserId) return

  try {
    await themeStore.removePreset(authStore.currentUserId, themeId)
  } catch (error) {
    console.error('Failed to delete custom theme:', error)
  }
}

async function resetToDefaults() {
  if (!authStore.currentUserId) {
    // For non-logged in users, just reset locally
    if (themeStore.systemThemes.length > 0) {
      themeStore.applyTheme(themeStore.systemThemes[0])
    }
    return
  }

  try {
    await themeStore.resetAll(authStore.currentUserId)
  } catch (error) {
    console.error('Failed to reset settings:', error)
  }
}

async function applyRandomTheme() {
  const randomTheme = themeStore.getRandomTheme()
  if (randomTheme) {
    await applyTheme(randomTheme)
  }
}

onMounted(() => {
  // Initialize theme store if not already done
  if (themeStore.systemThemes.length === 0) {
    console.log('No themes available, initializing...')
    themeStore.initialize()
  } else {
    console.log('Themes already available:', themeStore.systemThemes.length)
  }

  // Debug logging
  console.log('ThemeSelector mounted - Popular themes:', themeStore.popularThemes.length)
  console.log('ThemeSelector mounted - Light themes:', themeStore.lightThemes.length)
  console.log('ThemeSelector mounted - Dark themes:', themeStore.darkThemes.length)
})
</script>
