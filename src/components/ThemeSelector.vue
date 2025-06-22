09:51 Wasan
<template>
  <div class="space-y-8">
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

    <!-- Predefined Themes -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600"><!-- Star Icon --></svg>
        <span class="text-2xl font-bold text-gray-800">Predefined Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="theme in predefinedThemes"
          v-for="theme in predefinedThemes"
          :key="theme.id"
          class="bg-white/80 rounded-xl p-6 cursor-pointer border border-white/50 transition-all duration-500 group hover:shadow-xl hover:scale-105"
          :class="{
            'ring-4 ring-purple-400 ring-offset-2 shadow-2xl':
              currentTheme.id === theme.id && !isPreviewMode,
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
                :style="{ backgroundColor: color }"
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

    <!-- Custom Theme Editor -->
    <div class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8">
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600"><!-- Palette Icon --></svg>
        <span class="text-2xl font-bold text-gray-800">Create Custom Theme</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(value, key) in customTheme.colors"
          :key="key"
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
          :disabled="!customThemeName.trim()"
          class="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-6 py-2 disabled:opacity-50"
        >
          Save Theme
        </button>
      </div>
      <div class="flex justify-center mt-6">
        <button
          @click="applyCustomTheme"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Apply Custom Theme
        </button>
      </div>
    </div>

    <!-- Saved Custom Themes -->
    <div
      v-if="savedThemes.length > 0"
      class="backdrop-blur-lg bg-white/60 border border-white/50 shadow-xl rounded-2xl p-8"
    >
      <div class="flex items-center gap-3 mb-6">
        <svg class="w-6 h-6 text-purple-600"><!-- Save Icon --></svg>
        <span class="text-2xl font-bold text-gray-800">Saved Custom Themes</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="theme in savedThemes"
          :key="theme.id"
          class="bg-white/50 rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-gray-800">{{ theme.name }}</span>
            <button
              @click="deleteCustomTheme(theme.id)"
              class="p-1 text-red-500 hover:bg-red-100 rounded-full"
            >
              🗑️
            </button>
          </div>
          <div class="flex gap-1 mb-3">
            <div
              v-for="(color, index) in Object.values(theme.colors).slice(0, 5)"
              :key="index"
              class="w-6 h-6 rounded-lg border border-white shadow-sm"
              :style="{ backgroundColor: color }"
            />
          </div>
        </div>

        <!-- Apply custom theme -->
        <div class="flex justify-center">
          <button
            @click="applyTheme(theme)"
            class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg px-4 py-2 mt-2"
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
        <svg class="w-6 h-6 text-red-600"><!-- RotateCcw Icon --></svg>
        <h2 class="text-xl font-bold text-red-800">Reset Settings</h2>
      </div>
      <p class="text-red-700 mb-6">
        This will reset all theme customizations and saved presets to default values.
      </p>
      <button
        @click="resetToDefaults"
        class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        Reset All Settings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ----------------- Theme Types & Data ---------------------
interface Theme {
  id: string
  name: string
  colors: Record<string, string>
  isDark: boolean
  description?: string
}

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

// ----------------- States ---------------------
const currentTheme = ref<Theme>(predefinedThemes[0])
const previewTheme = ref<Theme | null>(null)
const isPreviewMode = ref(false)
const customThemeName = ref('')
const savedThemes = ref<Theme[]>([])
const customTheme = ref<Theme>({
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
// ----------------- Utility Functions ---------------------
function applyThemeToDOM(theme: Theme) {
  if (!theme || !theme.colors) return
  const root = document.documentElement
  root.style.setProperty('--primary', theme.colors.primary)
  root.style.setProperty('--secondary', theme.colors.secondary)
  root.style.setProperty('--background', theme.colors.background)
  root.style.setProperty('--foreground', theme.colors.foreground)
  root.style.setProperty('--accent', theme.colors.accent)
  if (theme.isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
function applyTheme(theme: Theme) {
  applyThemeToDOM(theme)
  currentTheme.value = theme
  previewTheme.value = null
  isPreviewMode.value = false
  localStorage.setItem('enhancedCurrentTheme', JSON.stringify(theme))
}
function handlePreview(theme: Theme) {
  previewTheme.value = theme
  isPreviewMode.value = true
  applyThemeToDOM(theme)
  setTimeout(() => {
    if (isPreviewMode.value) cancelPreview()
  }, 10000)
}
function confirmTheme() {
  if (previewTheme.value) applyTheme(previewTheme.value)
}
function cancelPreview() {
  applyThemeToDOM(currentTheme.value)
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
function applyCustomTheme() {
  const theme = { ...customTheme.value, id: `custom-${Date.now()}` }
  applyTheme(theme)
}
function saveCustomTheme() {
  if (!customThemeName.value.trim()) return
  const newTheme: Theme = {
    id: `custom-${Date.now()}`,
    name: customThemeName.value,
    colors: { ...customTheme.value.colors },
    isDark: customTheme.value.isDark,
    description: 'Custom theme created by user',
  }
  savedThemes.value.push(newTheme)
  localStorage.setItem('enhancedSavedThemes', JSON.stringify(savedThemes.value))
  customThemeName.value = ''
}
function deleteCustomTheme(themeId: string) {
  savedThemes.value = savedThemes.value.filter((t) => t.id !== themeId)
  localStorage.setItem('enhancedSavedThemes', JSON.stringify(savedThemes.value))
}
function resetToDefaults() {
  savedThemes.value = []
  customTheme.value = {
    ...customTheme.value,
    colors: { ...predefinedThemes[0].colors },
    isDark: predefinedThemes[0].isDark,
  }
  applyTheme(predefinedThemes[0])
  localStorage.removeItem('enhancedSavedThemes')
  localStorage.removeItem('enhancedCurrentTheme')
}

onMounted(() => {
  const saved = localStorage.getItem('enhancedSavedThemes')
  if (saved) savedThemes.value = JSON.parse(saved)
  const currentSaved = localStorage.getItem('enhancedCurrentTheme')
  if (currentSaved) {
    const parsedTheme = JSON.parse(currentSaved)
    currentTheme.value = parsedTheme
    applyThemeToDOM(parsedTheme)
  }
})
</script>
