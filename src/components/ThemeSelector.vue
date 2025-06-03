<template>
  <div class="space-y-6">
    <!-- Preview Notice -->
    <div v-if="isPreviewMode" class="bg-primary/10 border border-primary rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          <span class="font-medium">Preview Mode</span>
          <span class="border rounded px-2 py-0.5 text-xs">{{ previewTheme?.name }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="confirmTheme" class="px-3 py-1 bg-primary text-white rounded">
            Apply
          </button>
          <button @click="cancelPreview" class="px-3 py-1 border rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Predefined Themes -->
    <div class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="mb-4">
        <label class="block text-lg font-bold mb-2">Predefined Themes</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="theme in predefinedThemes"
            :key="theme.id"
            :class="[
              'p-4 border rounded-lg transition-all',
              currentTheme.id === theme.id && !isPreviewMode
                ? 'ring-2 ring-primary'
                : 'hover:border-gray-300',
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium">{{ theme.name }}</h4>
              <span>
                <svg
                  v-if="theme.isDark"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
                  />
                </svg>
              </span>
            </div>
            <div class="flex gap-1 mb-3">
              <div
                v-for="color in Object.values(theme.colors)"
                :key="color"
                class="w-6 h-6 rounded-full border"
                :style="{ backgroundColor: color }"
              />
            </div>
            <div class="flex gap-2">
              <button @click="handlePreview(theme)" class="px-3 py-1 border rounded">
                Preview
              </button>
              <button
                @click="() => applyTheme(theme, false)"
                class="px-3 py-1 bg-primary text-white rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Theme Editor -->
    <div class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="mb-4 font-bold text-lg">Customize Theme</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(value, key) in currentTheme.colors" :key="key" class="space-y-2">
          <label class="capitalize">{{ key }} Color</label>
          <div class="flex gap-2">
            <input
              type="color"
              v-model="currentTheme.colors[key]"
              @input="updateCurrentThemeColor(key, $event.target.value)"
              class="w-12 h-10 p-1 cursor-pointer"
            />
            <input
              type="text"
              v-model="currentTheme.colors[key]"
              @input="updateCurrentThemeColor(key, $event.target.value)"
              class="flex-1 border rounded px-2 py-1"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          v-model="currentTheme.isDark"
          @change="toggleDarkMode"
          class="accent-primary"
        />
        <label>Dark Mode</label>
      </div>
      <div class="flex gap-2 mt-4">
        <input
          v-model="customThemeName"
          placeholder="Enter theme name..."
          class="flex-1 border rounded px-2 py-1"
        />
        <button @click="saveCustomTheme" class="px-3 py-1 bg-primary text-white rounded">
          Save Preset
        </button>
      </div>
    </div>

    <!-- Saved Themes -->
    <div v-if="savedThemes.length > 0" class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="mb-4 font-bold text-lg">Saved Theme Presets</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="theme in savedThemes"
          :key="theme.id"
          class="flex items-center justify-between p-3 border rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div class="flex gap-1">
              <div
                v-for="(color, idx) in Object.values(theme.colors).slice(0, 3)"
                :key="idx"
                class="w-4 h-4 rounded-full border"
                :style="{ backgroundColor: color }"
              />
            </div>
            <span class="font-medium">{{ theme.name }}</span>
          </div>
          <button @click="() => applyTheme(theme, false)" class="px-3 py-1 border rounded">
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Reset to Defaults -->
    <div class="bg-white rounded-lg border p-6 shadow-sm">
      <div class="mb-2 font-bold text-destructive">Reset Settings</div>
      <p class="text-sm text-gray-400 mb-4">
        This will reset all theme customizations and saved presets to default values.
      </p>
      <button @click="resetToDefaults" class="px-4 py-2 bg-red-500 text-white rounded">
        Reset All
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits, onMounted } from 'vue'
const props = defineProps<{ currentTheme: { name: string } | null }>()
const emit = defineEmits(['theme-change'])

const predefinedThemes = [
  {
    id: 'light',
    name: 'Light',
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
    id: 'high-contrast',
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      background: '#ffffff',
      foreground: '#000000',
      accent: '#f0f0f0',
    },
    isDark: false,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      accent: '#e0f2fe',
    },
    isDark: false,
  },
]

const currentTheme = reactive(JSON.parse(JSON.stringify(predefinedThemes[0])))
const previewTheme = ref(null)
const isPreviewMode = ref(false)
const savedThemes = ref([])
const customThemeName = ref('')

onMounted(() => {
  // Load saved themes
  const saved = localStorage.getItem('savedThemes')
  if (saved) savedThemes.value = JSON.parse(saved)
  // Load current theme
  const currentSaved = localStorage.getItem('currentTheme')
  if (currentSaved) Object.assign(currentTheme, JSON.parse(currentSaved))
})

function applyTheme(theme, isPreview = false) {
  const root = document.documentElement
  root.style.setProperty('--primary', theme.colors.primary)
  root.style.setProperty('--secondary', theme.colors.secondary)
  root.style.setProperty('--background', theme.colors.background)
  root.style.setProperty('--foreground', theme.colors.foreground)
  root.style.setProperty('--accent', theme.colors.accent)
  if (theme.isDark) root.classList.add('dark')
  else root.classList.remove('dark')
  if (isPreview) {
    previewTheme.value = theme
    isPreviewMode.value = true
  } else {
    Object.assign(currentTheme, JSON.parse(JSON.stringify(theme)))
    previewTheme.value = null
    isPreviewMode.value = false
    localStorage.setItem('currentTheme', JSON.stringify(theme))
    emit('theme-change', { name: theme.name })
  }
}
function handlePreview(theme) {
  applyTheme(theme, true)
}
function confirmTheme() {
  if (previewTheme.value) applyTheme(previewTheme.value, false)
}
function cancelPreview() {
  if (isPreviewMode.value) {
    applyTheme(currentTheme, false)
    isPreviewMode.value = false
    previewTheme.value = null
  }
}
function updateCurrentThemeColor(key, value) {
  currentTheme.colors[key] = value
  applyTheme(currentTheme, false)
}
function toggleDarkMode() {
  applyTheme(currentTheme, false)
}
function saveCustomTheme() {
  if (!customThemeName.value.trim()) return alert('Please enter a theme name')
  const newTheme = {
    id: `custom-${Date.now()}`,
    name: customThemeName.value,
    colors: { ...currentTheme.colors },
    isDark: currentTheme.isDark,
  }
  savedThemes.value.push(newTheme)
  localStorage.setItem('savedThemes', JSON.stringify(savedThemes.value))
  customThemeName.value = ''
  alert(`Theme "${newTheme.name}" saved`)
}
function resetToDefaults() {
  const defaultTheme = predefinedThemes[0]
  applyTheme(defaultTheme, false)
  savedThemes.value = []
  localStorage.removeItem('savedThemes')
  localStorage.removeItem('currentTheme')
  alert('Settings reverted to default')
}
</script>
