<template>
  <div class="space-y-8">
    <!-- Preview Mode Notice -->
    <div
      v-if="isPreviewMode"
      class="backdrop-blur-lg bg-gradient-to-r from-purple-100/80 to-indigo-100/80 rounded-2xl border-2 border-purple-300 p-6 shadow-xl animate-bounce-gentle"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <span class="font-semibold text-purple-800">Preview Mode</span>
          <div class="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
            {{ previewTheme?.name }}
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="confirmTheme"
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Apply
          </button>
          <button
            @click="cancelPreview"
            class="px-4 py-2 bg-white/80 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="themeStore.isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <!-- Error State -->
    <div v-if="themeStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
      <p class="text-red-700">{{ themeStore.error }}</p>
    </div>

    <!-- Predefined Themes -->
    <div
      v-if="!themeStore.isLoading"
      class="backdrop-blur-lg bg-white/60 rounded-2xl border border-white/50 p-8 shadow-xl"
    >
      <div class="flex items-center gap-3 mb-6">
        <svg
          class="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800">Predefined Themes</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in themeStore.systemThemes"
          :key="theme.id"
          @click="selectTheme(theme)"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              themeStore.currentTheme?.id === theme.id && !isPreviewMode,
            'ring-2 ring-purple-200': previewTheme?.id === theme.id && isPreviewMode,
          }"
          class="bg-white/80 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-105 group border border-white/50"
        >
          <div class="space-y-4">
            <!-- Theme header -->
            <div class="flex items-center justify-between">
              <h3
                class="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors"
              >
                {{ theme.name }}
              </h3>
              <div class="flex items-center gap-2">
                <svg
                  v-if="theme.isDark"
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
                <svg
                  v-if="theme.isHighContrast"
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Color palette preview -->
            <div class="flex gap-2">
              <div
                :style="{ backgroundColor: theme.primaryColor }"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50 group-hover:scale-110 transition-transform duration-200"
                title="Primary"
              ></div>
              <div
                :style="{ backgroundColor: theme.secondaryColor }"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50 group-hover:scale-110 transition-transform duration-200"
                title="Secondary"
              ></div>
              <div
                :style="{ backgroundColor: theme.backgroundColor }"
                class="w-8 h-8 rounded-lg shadow-md border border-gray-300 group-hover:scale-110 transition-transform duration-200"
                title="Background"
              ></div>
              <div
                :style="{ backgroundColor: theme.surfaceColor }"
                class="w-8 h-8 rounded-lg shadow-md border border-gray-300 group-hover:scale-110 transition-transform duration-200"
                title="Surface"
              ></div>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2 pt-2">
              <button
                @click.stop="handlePreviewTheme(theme)"
                class="flex-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Preview
              </button>
              <button
                @click.stop="applyTheme(theme)"
                class="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Presets -->
    <div
      v-if="themeStore.presets.length > 0 && !themeStore.isLoading"
      class="backdrop-blur-lg bg-white/60 rounded-2xl border border-white/50 p-8 shadow-xl"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <svg
            class="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-800">My Presets</h2>
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <div v-for="preset in themeStore.presets" :key="preset.id" class="relative group">
          <div
            @click="applyTheme(preset)"
            class="w-20 h-20 rounded-xl cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:scale-110"
            :class="
              themeStore.currentTheme?.id === preset.id ? 'border-purple-500' : 'border-gray-300'
            "
            :style="{
              background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
            }"
          >
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
            >
              <span
                class="text-white font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {{ preset.name }}
              </span>
            </div>
          </div>
          <button
            @click="removePreset(preset.id)"
            class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Reset to Defaults -->
    <div class="backdrop-blur-lg bg-red-50/60 rounded-2xl border border-red-200/50 p-8 shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <svg
          class="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <h2 class="text-xl font-bold text-red-800">Reset Settings</h2>
      </div>

      <p class="text-red-700 mb-6">
        This will reset all theme customizations and saved presets to default values.
      </p>

      <button
        @click="showResetDialog = true"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Reset All Settings
      </button>
    </div>

    <!-- Reset Confirmation Dialog -->
    <div
      v-if="showResetDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showResetDialog = false"
    >
      <div
        @click.stop
        class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scale-in"
      >
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              class="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.28 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800">Confirm Reset</h3>
          <p class="text-gray-600">
            Are you sure you want to reset all personalization settings to defaults?
          </p>
          <p class="text-sm text-red-600 font-medium">This action cannot be undone.</p>

          <div class="flex gap-3 pt-4">
            <button
              @click="showResetDialog = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              @click="resetToDefaults"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore, type Theme } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

const userId = computed(() => authStore.currentUserId || authStore.user?.id || 0)
const previewTheme = ref<Theme | null>(null)
const isPreviewMode = ref(false)
const showResetDialog = ref(false)

function selectTheme(theme: Theme) {
  if (isPreviewMode.value) {
    cancelPreview()
  }
  applyTheme(theme)
}

function handlePreviewTheme(theme: Theme) {
  previewTheme.value = theme
  isPreviewMode.value = true
  themeStore.applyTheme(theme)
}

function confirmTheme() {
  if (previewTheme.value) {
    applyTheme(previewTheme.value)
  }
}

function cancelPreview() {
  if (themeStore.currentTheme) {
    themeStore.applyTheme(themeStore.currentTheme)
  }
  previewTheme.value = null
  isPreviewMode.value = false
}

async function applyTheme(theme: Theme) {
  previewTheme.value = null
  isPreviewMode.value = false
  themeStore.applyTheme(theme)

  if (userId.value) {
    try {
      await themeStore.saveCurrent(userId.value)
      showSuccessMessage(`${theme.name} theme applied successfully!`)
    } catch (error) {
      showErrorMessage('Failed to save theme')
    }
  }
}

async function removePreset(presetId: number | string) {
  if (userId.value && typeof presetId === 'number') {
    try {
      await themeStore.removePreset(userId.value, presetId)
      showSuccessMessage('Preset removed')
    } catch (error) {
      showErrorMessage('Failed to remove preset')
    }
  }
}

async function resetToDefaults() {
  if (userId.value) {
    try {
      await themeStore.resetAll(userId.value)
      showResetDialog.value = false
      showSuccessMessage('Settings reset to default successfully!')
    } catch (error) {
      showErrorMessage('Failed to reset settings')
    }
  }
}

function showSuccessMessage(message: string) {
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

function showErrorMessage(message: string) {
  const toast = document.createElement('div')
  toast.className =
    'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

onMounted(async () => {
  // Initialize theme store if not already done
  if (themeStore.systemThemes.length === 0) {
    await themeStore.initialize()
  }
})
</script>

<style scoped>
@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
