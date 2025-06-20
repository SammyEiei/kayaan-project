09:51
Wasan
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

    <!-- Predefined Themes -->
    <div class="backdrop-blur-lg bg-white/60 rounded-2xl border border-white/50 p-8 shadow-xl">
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
          v-for="theme in predefinedThemes"
          :key="theme.id"
          @click="selectTheme(theme)"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              currentTheme?.id === theme.id && !isPreviewMode,
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
              </div>
            </div>

            <!-- Color palette preview -->
            <div class="flex gap-2">
              <div
                v-for="(color, colorKey) in theme.colors"
                :key="colorKey"
                :style="{ backgroundColor: color }"
                class="w-8 h-8 rounded-lg shadow-md border border-white/50 group-hover:scale-110 transition-transform duration-200"
                :title="colorKey"
              ></div>
            </div>

            <!-- Theme description -->
            <p class="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
              {{ theme.description }}
            </p>

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

    <!-- Custom Theme Creator -->
    <div class="backdrop-blur-lg bg-white/60 rounded-2xl border border-white/50 p-8 shadow-xl">
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
          <circle cx="12" cy="12" r="1" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800">Create Custom Theme</h2>
      </div>

      <div class="space-y-6">
        <!-- Color customization grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(color, colorKey) in customTheme.colors"
            :key="colorKey"
            class="bg-white/50 rounded-xl p-4 border border-white/30"
          >
            <label class="block text-sm font-semibold text-gray-700 mb-3 capitalize">
              {{ colorKey.replace(/([A-Z])/g, ' $1').trim() }}
            </label>
            <div class="flex gap-3">
              <div class="relative">
                <input
                  type="color"
                  :value="color"
                  @input="
                    updateCustomColor(
                      colorKey as keyof Theme['colors'],
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  class="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
                />
                <div
                  class="absolute inset-0 rounded-lg border-2 border-gray-200 pointer-events-none"
                ></div>
              </div>
              <input
                type="text"
                :value="color"
                @input="
                  updateCustomColor(
                    colorKey as keyof Theme['colors'],
                    ($event.target as HTMLInputElement).value,
                  )
                "
                class="flex-1 px-3 py-2 bg-white/80 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <!-- Dark mode toggle -->
        <div
          class="flex items-center justify-between bg-white/50 rounded-xl p-4 border border-white/30"
        >
          <div class="flex items-center gap-3">
            <svg
              :class="customTheme.isDark ? 'text-blue-500' : 'text-yellow-500'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path v-if="customTheme.isDark" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              <g v-else>
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </g>
            </svg>
            <div>
              <h3 class="font-medium text-gray-800">Dark Mode</h3>
              <p class="text-sm text-gray-600">Toggle dark theme variant</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="customTheme.isDark"
              @change="customTheme.isDark = !customTheme.isDark"
              class="sr-only peer"
            />
            <div
              class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"
            ></div>
          </label>
        </div>

        <!-- Save custom theme -->
        <div class="bg-white/50 rounded-xl p-4 border border-white/30">
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              v-model="customThemeName"
              type="text"
              placeholder="Enter theme name..."
              class="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
            />
            <button
              @click="saveCustomTheme"
              :disabled="!customThemeName.trim()"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              Save Theme
            </button>
          </div>
        </div>

        <!-- Apply custom theme -->
        <div class="flex justify-center">
          <button
            @click="applyCustomTheme"
            class="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Apply Custom Theme
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Custom Themes -->
    <div
      v-if="savedThemes.length > 0"
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
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800">Saved Custom Themes</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="theme in savedThemes"
          :key="theme.id"
          class="bg-white/50 rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800">{{ theme.name }}</h3>
            <button
              @click="deleteCustomTheme(theme.id)"
              class="p-1 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>

          <div class="flex gap-1 mb-3">
            <div
              v-for="(color, index) in Object.values(theme.colors).slice(0, 5)"
              :key="index"
              :style="{ backgroundColor: color }"
              class="w-6 h-6 rounded-lg border border-white shadow-sm"
            ></div>
          </div>

          <button
            @click="applyTheme(theme)"
            class="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200"
          >
            Apply Theme
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
import { ref, reactive, onMounted, watch } from 'vue'

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
  description?: string
}

interface Props {
  currentTheme?: Theme | null
}

const props = withDefaults(defineProps<Props>(), {
  currentTheme: null,
})

const emit = defineEmits<{
  themeChange: [theme: Theme]
}>()

const currentTheme = ref<Theme | null>(props.currentTheme)
const previewTheme = ref<Theme | null>(null)
const isPreviewMode = ref(false)
const savedThemes = ref<Theme[]>([])
const customThemeName = ref('')
const showResetDialog = ref(false)

// Custom theme state
const customTheme = reactive<Theme>({
  id: 'custom',
  name: 'Custom Theme',
  colors: {
    primary: '#7e69ab',
    secondary: '#1eaedb',
    background: '#ffffff',
    foreground: '#0a0a0a',
    accent: '#f4f4f5',
  },
  isDark: false,
})

// Predefined themes
const predefinedThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright design perfect for daytime use',
    colors: {
      primary: '#7E69AB',
      secondary: '#1EAEDB',
      background: '#ffffff',
      foreground: '#0a0a0a',
      accent: '#f4f4f5',
    },
    isDark: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes for low-light environments',
    colors: {
      primary: '#9b87f5',
      secondary: '#33C3F0',
      background: '#0a0a0a',
      foreground: '#fafafa',
      accent: '#27272a',
    },
    isDark: true,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calming blue tones inspired by the sea',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      accent: '#e0f2fe',
    },
    isDark: false,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges and purples like a beautiful sunset',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      background: '#fff7ed',
      foreground: '#9a3412',
      accent: '#fed7aa',
    },
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens bringing the outdoors inside',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      background: '#f0fdf4',
      foreground: '#064e3b',
      accent: '#bbf7d0',
    },
    isDark: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blues and purples for the night owls',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#0f172a',
      foreground: '#f1f5f9',
      accent: '#1e293b',
    },
    isDark: true,
  },
]

function selectTheme(theme: Theme) {
  if (isPreviewMode.value) {
    cancelPreview()
  }
  applyTheme(theme)
}

function handlePreviewTheme(theme: Theme) {
  previewTheme.value = theme
  isPreviewMode.value = true
  applyThemeToDOM(theme)
}

function confirmTheme() {
  if (previewTheme.value) {
    applyTheme(previewTheme.value)
  }
}

function cancelPreview() {
  if (currentTheme.value) {
    applyThemeToDOM(currentTheme.value)
  }
  previewTheme.value = null
  isPreviewMode.value = false
}

function applyTheme(theme: Theme) {
  currentTheme.value = theme
  previewTheme.value = null
  isPreviewMode.value = false
  applyThemeToDOM(theme)
  emit('themeChange', theme)
  showSuccessMessage(`${theme.name} theme applied successfully!`)
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement

  // Apply CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  // Toggle dark class
  if (theme.isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function updateCustomColor(colorKey: keyof Theme['colors'], value: string) {
  customTheme.colors[colorKey] = value
  // Apply custom theme in real-time
  applyThemeToDOM(customTheme)
}

function applyCustomTheme() {
  const theme = { ...customTheme, id: `custom-${Date.now()}` }
  applyTheme(theme)
}

function saveCustomTheme() {
  if (!customThemeName.value.trim()) {
    showErrorMessage('Please enter a theme name')
    return
  }

  const newTheme: Theme = {
    id: `custom-${Date.now()}`,
    name: customThemeName.value,
    colors: { ...customTheme.colors },
    isDark: customTheme.isDark,
    description: 'Custom theme created by user',
  }

  savedThemes.value.push(newTheme)
  customThemeName.value = ''
  showSuccessMessage(`Theme "${newTheme.name}" saved successfully!`)
}

function deleteCustomTheme(themeId: string) {
  savedThemes.value = savedThemes.value.filter((theme) => theme.id !== themeId)
  showSuccessMessage('Custom theme deleted')
}

function resetToDefaults() {
  const defaultTheme = predefinedThemes[0]
  savedThemes.value = []
  customTheme.colors = { ...defaultTheme.colors }
  customTheme.isDark = defaultTheme.isDark
  applyTheme(defaultTheme)
  showResetDialog.value = false
  showSuccessMessage('Settings reset to default successfully!')
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

// Watch for prop changes
watch(
  () => props.currentTheme,
  (newTheme) => {
    if (newTheme) {
      currentTheme.value = newTheme
    }
  },
)

onMounted(() => {
  // Set default theme if none provided
  if (!currentTheme.value) {
    currentTheme.value = predefinedThemes[0]
    applyThemeToDOM(currentTheme.value)
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

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

/* Custom toggle switch styling */
input[type='checkbox']:checked + div {
  background-color: #9333ea;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>