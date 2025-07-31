<script setup lang="ts">
interface GenerationSettings {
  model: string
  temperature: number
  maxTokens: number
  language: string
}

interface AIModel {
  id: string
  name: string
  description: string
}

interface Props {
  settings: GenerationSettings
  availableModels: AIModel[]
}

interface Emits {
  (e: 'update:settings', value: GenerationSettings): void
  (e: 'next'): void
  (e: 'prev'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateSettings = (newSettings: Partial<GenerationSettings>) => {
  emit('update:settings', { ...props.settings, ...newSettings })
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Model Selection -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Select AI Model</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="model in availableModels"
          :key="model.id"
          @click="updateSettings({ model: model.id })"
          class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="
            settings.model === model.id
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          "
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ model.name }}</h3>
              <p class="text-sm text-gray-500">{{ model.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Temperature -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Creativity (Temperature)
          </label>
          <div class="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="settings.temperature"
              @input="
                (e) =>
                  updateSettings({ temperature: parseFloat((e.target as HTMLInputElement).value) })
              "
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span class="text-sm font-medium text-gray-600 w-12 text-center">
              {{ settings.temperature }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{
              settings.temperature < 0.3
                ? 'High Accuracy'
                : settings.temperature < 0.7
                  ? 'Balanced'
                  : 'High Creativity'
            }}
          </p>
        </div>

        <!-- Max Tokens -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Max Length (Max Tokens)
          </label>
          <input
            type="number"
            min="100"
            max="4000"
            step="100"
            :value="settings.maxTokens"
            @input="
              (e) => updateSettings({ maxTokens: parseInt((e.target as HTMLInputElement).value) })
            "
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">Maximum number of tokens the AI will generate</p>
        </div>

        <!-- Language -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> Language </label>
          <select
            :value="settings.language"
            @change="(e) => updateSettings({ language: (e.target as HTMLSelectElement).value })"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <!-- Quality Preset -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> Quality </label>
          <div class="flex gap-2">
            <button
              @click="updateSettings({ temperature: 0.3, maxTokens: 1000 })"
              class="px-3 py-2 text-sm border rounded-lg transition-colors"
              :class="
                settings.temperature <= 0.3
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-purple-300'
              "
            >
              Fast
            </button>
            <button
              @click="updateSettings({ temperature: 0.7, maxTokens: 2000 })"
              class="px-3 py-2 text-sm border rounded-lg transition-colors"
              :class="
                settings.temperature > 0.3 && settings.temperature <= 0.7
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-purple-300'
              "
            >
              Balanced
            </button>
            <button
              @click="updateSettings({ temperature: 0.9, maxTokens: 3000 })"
              class="px-3 py-2 text-sm border rounded-lg transition-colors"
              :class="
                settings.temperature > 0.7
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-purple-300'
              "
            >
              High Quality
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Model Info -->
    <div class="bg-blue-50 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <div
          class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-blue-900">Tips</h3>
          <p class="text-sm text-blue-700 mt-1">
            Use low Temperature for tasks requiring high accuracy, and use high Temperature for
            tasks requiring creativity
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <button
        @click="emit('prev')"
        class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <button
        @click="emit('next')"
        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
      >
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

.slider::-moz-range-thumb {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
