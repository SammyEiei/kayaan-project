<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="themeStore.isLoading" class="space-y-6 transition-opacity duration-300">
      <!-- Skeleton for Quick Themes -->
      <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
          <div class="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-white/80 rounded-lg p-4 border border-white/50">
            <div class="flex items-center justify-between mb-3">
              <div class="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div class="flex gap-1 mb-2">
              <div v-for="j in 4" :key="j" class="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div class="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Skeleton for Custom Theme Editor -->
      <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
          <div class="h-5 bg-gray-300 rounded w-40 animate-pulse"></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div v-for="i in 4" :key="i" class="bg-white/50 rounded-lg p-3 border border-white/30">
            <div class="h-3 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
            <div class="flex gap-2">
              <div class="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              <div class="flex-1 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between bg-white/50 rounded-lg p-3 border border-white/30 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>
          <div class="w-11 h-6 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          <div class="h-10 bg-gray-300 rounded-lg w-24 animate-pulse"></div>
          <div class="h-10 bg-gray-300 rounded-lg w-20 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="themeStore.error && !themeStore.error.includes('Authentication') && !isRandomLoading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 transition-all duration-300">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <span class="text-yellow-800 font-medium">{{ themeStore.error }}</span>
          <p class="text-yellow-700 text-sm mt-1">
            You can still use all predefined themes and create custom themes. Your changes will be saved locally.
          </p>
          <button
            @click="retryThemeLoad"
            class="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Authentication Notice -->
    <div v-if="themeStore.error && themeStore.error.includes('Authentication') && !isRandomLoading" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 transition-all duration-300">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span class="text-blue-800 font-medium">Using Default Theme</span>
          <p class="text-blue-700 text-sm mt-1">
            You're using the default theme. All predefined themes and custom themes are available. Sign in to save your theme preferences.
          </p>
        </div>
      </div>
    </div>

    <!-- No Themes Available Fallback -->
    <div v-if="!themeStore.isLoading && themeStore.systemThemes.length === 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span class="text-red-800 font-medium">No Themes Available</span>
          <p class="text-red-700 text-sm mt-1">
            Unable to load themes. Please refresh the page or contact support if the issue persists.
          </p>
          <button
            @click="retryThemeLoad"
            class="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
          >
            Retry Loading
          </button>
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

    <!-- Quick Theme Selection -->
    <div v-if="!themeStore.isLoading && quickThemes.length > 0" class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-6 transition-all duration-300 ease-in-out">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <span class="text-lg font-semibold text-gray-800">Choose Your Style</span>
      </div>

      <!-- Simple Theme Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="theme in quickThemes"
          :key="theme.id || theme.name"
          class="bg-white/80 rounded-lg p-4 cursor-pointer border border-white/50 transition-all duration-300 group hover:shadow-lg hover:scale-105"
          :class="{
            'ring-2 ring-purple-400 shadow-lg':
              themeStore.currentTheme?.id === theme.id && !isPreviewMode,
            'ring-1 ring-purple-200': previewTheme?.id === theme.id && isPreviewMode,
          }"
          @click="applyTheme(theme, true)"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800 text-sm">{{ theme.name }}</h3>
            <div v-if="theme.isDark" class="w-4 h-4 text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div v-else class="w-4 h-4 text-yellow-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div class="flex gap-1 mb-2">
            <div
              v-for="(color, key) in Object.values(theme.colors).slice(0, 4)"
              :key="key"
              class="w-6 h-6 rounded border border-white/50 shadow-sm"
              :style="{ backgroundColor: color as string }"
            />
          </div>
          <p class="text-xs text-gray-600">{{ theme.description }}</p>
        </div>
      </div>
    </div>

    <!-- Random Theme Button -->
    <div class="backdrop-blur-lg bg-gradient-to-r from-purple-100/60 to-pink-100/60 border border-purple-200/50 shadow-xl rounded-2xl p-4 transition-all duration-300 ease-in-out">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold text-gray-800">Feeling Lucky?</h3>
          <p class="text-xs text-gray-600">Try a random theme</p>
        </div>
        <button
          @click="applyRandomTheme"
          :disabled="themeStore.isLoading || isRandomLoading"
          class="min-w-[100px] px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
        >
          <svg v-if="!isRandomLoading" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <svg v-else class="w-4 h-4 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="inline-block min-w-[60px] text-center">{{ isRandomLoading ? 'Applying...' : 'Random' }}</span>
        </button>
      </div>
    </div>

    <!-- Custom Theme Editor -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-6 transition-all duration-300 ease-in-out">
      <div class="flex items-center gap-3 mb-4">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        <span class="text-lg font-semibold text-gray-800">Create Custom Theme</span>
      </div>

      <!-- Essential Colors Only -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div
          v-for="(value, key) in essentialColors"
          :key="String(key)"
          class="bg-white/50 rounded-lg p-3 border border-white/30"
        >
          <label class="block text-xs font-medium text-gray-600 mb-2 capitalize">{{ key }}</label>
          <div class="flex gap-2">
            <input
              type="color"
              v-model="customTheme.colors[key]"
              @input="updateCustomColor(key, customTheme.colors[key])"
              class="w-8 h-8 cursor-pointer border border-white/50 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <input
              type="text"
              v-model="customTheme.colors[key]"
              @input="updateCustomColor(key, customTheme.colors[key])"
              class="flex-1 bg-white/80 border border-gray-200 rounded text-xs font-mono px-2 py-1"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <!-- Dark Mode Toggle -->
      <div class="flex items-center justify-between bg-white/50 rounded-lg p-3 border border-white/30 mb-4">
        <div class="flex items-center gap-2">
          <div v-if="customTheme.isDark" class="w-4 h-4 text-gray-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div v-else class="w-4 h-4 text-yellow-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700">Dark Mode</span>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="customTheme.isDark" @change="updateCustomColorMode" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      <!-- Save and Apply -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="customThemeName"
          placeholder="Enter theme name..."
          class="flex-1 bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <button
          @click="saveCustomTheme"
          :disabled="!customThemeName.trim() || themeStore.isLoading"
          class="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all duration-200"
        >
          Save Theme
        </button>
        <button
          @click="applyCustomTheme"
          :disabled="themeStore.isLoading"
          class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 hover:shadow-md transition-all duration-200"
        >
          Apply Now
        </button>
      </div>
    </div>

    <!-- Saved Custom Themes -->
    <div
      v-if="safePresets.length > 0"
      class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-6 transition-all duration-300 ease-in-out"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span class="text-lg font-semibold text-gray-800">Your Themes</span>
          <span class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{{ safePresets.length }}</span>
        </div>
      </div>

      <!-- Simple List Layout -->
      <div class="space-y-2">
        <div
          v-for="theme in safePresets"
          :key="theme.id || theme.name"
          class="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-white/40 hover:shadow-md transition-all duration-200 group"
        >
          <!-- Theme Info -->
          <div class="flex items-center gap-3">
            <!-- Color Preview -->
            <div class="flex gap-1">
              <div
                v-for="(color, index) in Object.values(theme.colors).slice(0, 3)"
                :key="index"
                class="w-4 h-4 rounded border border-white/50 shadow-sm"
                :style="{ backgroundColor: color as string }"
              />
            </div>
            <!-- Theme Name -->
            <span class="font-medium text-gray-800 text-sm">{{ theme.name }}</span>
            <!-- Dark Mode Indicator -->
            <div v-if="theme.isDark" class="w-3 h-3 text-gray-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div v-else class="w-3 h-3 text-yellow-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="applyTheme(theme, true)"
              :disabled="themeStore.isLoading"
              class="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs rounded-md hover:shadow-sm disabled:opacity-50 transition-all duration-200"
            >
              Apply
            </button>
            <button
              @click="deleteCustomTheme(theme.id!)"
              :disabled="themeStore.isLoading"
              class="p-1.5 text-red-500 hover:bg-red-100 rounded-md text-xs disabled:opacity-50 transition-colors"
              title="Delete theme"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset to Defaults -->
    <div
      v-if="safePresets.length > 0"
      class="backdrop-blur-lg bg-red-50/60 border border-red-200/50 shadow-xl rounded-2xl p-4 mt-4 transition-all duration-300 ease-in-out"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div>
            <h3 class="text-sm font-semibold text-red-800">Reset Settings</h3>
            <p class="text-xs text-red-600">Clear all custom themes</p>
          </div>
        </div>
        <button
          @click="resetToDefaults"
          :disabled="themeStore.isLoading"
          class="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import type { Theme } from '../service/ThemeService'
import { predefinedThemes } from '../service/ThemeService'

// ----------------- Stores ---------------------
const themeStore = useThemeStore()
const authStore = useAuthStore()

// ----------------- States ---------------------
const previewTheme = ref<Theme | null>(null)
const isPreviewMode = ref(false)
const isRandomLoading = ref(false)
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

// ----------------- Computed Properties ---------------------
const safePresets = computed(() => {
  try {
    return themeStore.presets || []
  } catch (error) {
    console.error('Error getting presets:', error)
    return []
  }
})

// Essential colors for simplified theme creation
const essentialColors = computed(() => {
  return {
    primary: customTheme.value.colors.primary,
    secondary: customTheme.value.colors.secondary,
    background: customTheme.value.colors.background,
    text: customTheme.value.colors.text,
  }
})

// Quick themes - only the most popular ones
const quickThemes = computed(() => {
  try {
    const popular = themeStore.popularThemes || []
    // Show only 4 most popular themes
    return popular.slice(0, 4)
  } catch (error) {
    console.error('Error getting quick themes:', error)
    return []
  }
})

// ----------------- Utility Functions ---------------------
function applyThemeToDOM(theme: Theme) {
  try {
    const root = document.documentElement

    // Validate theme object
    if (!theme || !theme.colors) {
      console.warn('Invalid theme object provided:', theme)
      return
    }

    // Apply colors with fallback values
    const defaultColors = {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    }

    // Apply each color with fallback
    Object.entries(theme.colors).forEach(([key, value]) => {
      const colorValue = value || defaultColors[key as keyof typeof defaultColors] || '#000000'
      root.style.setProperty(`--${key}`, colorValue)
    })

    // Apply dark mode class safely
    if (theme.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  } catch (error) {
    console.error('Error applying theme to DOM:', error)
    // Apply fallback theme
    const fallbackTheme = themeStore.systemThemes[0] || {
      colors: {
        primary: '#8b5cf6',
        secondary: '#6366f1',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      isDark: false
    }
    applyThemeToDOM(fallbackTheme)
  }
}

async function applyTheme(theme: Theme, silent: boolean = false) {
  try {
    // Validate theme before applying
    if (!theme || !theme.colors) {
      console.error('Invalid theme provided:', theme)
      return
    }

    // Apply theme locally first for immediate feedback
    themeStore.applyTheme(theme)

    // If user is authenticated, try to save to server (silent mode for smooth UX)
    if (authStore.currentUserId && authStore.isAuthenticated) {
      const userId = authStore.currentUserId
      // Use setTimeout to make server save non-blocking
      setTimeout(async () => {
        try {
          await themeStore.saveCurrent(userId, silent)
        } catch (error: unknown) {
          // Check if it's an authentication error
          const axiosError = error as { response?: { status?: number } }
          if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
            console.warn('Authentication required. Theme applied locally only.')
            return
          }
          console.error('Failed to save theme to server:', error)
          // Don't revert theme for server errors, keep local changes
        }
      }, 0)
    }
  } catch (error) {
    console.error('Error applying theme:', error)
    // Apply fallback theme if everything fails
    const fallbackTheme = themeStore.systemThemes[0]
    if (fallbackTheme) {
      themeStore.applyTheme(fallbackTheme)
    }
  }
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
  if (isRandomLoading.value) return // Prevent multiple clicks

  try {
    isRandomLoading.value = true
    const randomTheme = themeStore.getRandomTheme()
    if (randomTheme) {
      // Apply theme locally first for immediate feedback
      themeStore.applyTheme(randomTheme)

      // Short delay to show loading state briefly
      await new Promise(resolve => setTimeout(resolve, 200))

      // Try to save to server if authenticated (silent mode to prevent UI jump)
      if (authStore.currentUserId && authStore.isAuthenticated) {
        // Run save in background without blocking UI
        themeStore.saveCurrent(authStore.currentUserId, true).catch(error => {
          console.warn('Failed to save random theme to server, but applied locally:', error)
        })
      }
    } else {
      console.warn('No themes available for random selection')
    }
  } catch (error) {
    console.error('Error applying random theme:', error)
  } finally {
    isRandomLoading.value = false
  }
}

// Retry function for theme loading
async function retryThemeLoad() {
  try {
    await themeStore.initialize()
  } catch (error) {
    console.error('Failed to retry theme loading:', error)
  }
}

onMounted(async () => {
  try {
    // Always initialize theme store to ensure it's properly set up
    console.log('ThemeSelector mounting, initializing theme store...')
    await themeStore.initialize()

    // Debug logging with error handling
    try {
      console.log('ThemeSelector mounted - Popular themes:', themeStore.popularThemes?.length || 0)
      console.log('ThemeSelector mounted - Light themes:', themeStore.lightThemes?.length || 0)
      console.log('ThemeSelector mounted - Dark themes:', themeStore.darkThemes?.length || 0)
    } catch (debugError) {
      console.warn('Error in debug logging:', debugError)
    }
  } catch (error) {
    console.error('Error during ThemeSelector initialization:', error)
    // Force apply fallback theme
    try {
      const fallbackTheme = predefinedThemes[0]
      if (fallbackTheme) {
        themeStore.applyTheme(fallbackTheme)
      }
    } catch (fallbackError) {
      console.error('Failed to apply fallback theme:', fallbackError)
    }
  }
})
</script>
