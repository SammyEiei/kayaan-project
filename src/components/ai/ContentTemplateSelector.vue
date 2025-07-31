<script setup lang="ts">
interface Template {
  id: string
  name: string
  description: string
  icon: string
  prompt: string
  category: string
}

interface Props {
  templates: Template[]
  selectedTemplate: string
}

interface Emits {
  (e: 'select', templateId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const selectTemplate = (templateId: string) => {
  emit('select', templateId)
}

const categories = [
  { id: 'study', name: 'Education', icon: '📚' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'technical', name: 'Technical', icon: '⚙️' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Category Tabs -->
    <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        v-for="category in categories"
        :key="category.id"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="'bg-white text-gray-900 shadow-sm'"
      >
        <span class="mr-2">{{ category.icon }}</span>
        {{ category.name }}
      </button>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="template in templates"
        :key="template.id"
        @click="selectTemplate(template.id)"
        class="p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
        :class="
          selectedTemplate === template.id
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-200 hover:border-purple-300'
        "
      >
        <div class="flex items-center gap-3">
          <div class="text-2xl">{{ template.icon }}</div>
          <div>
            <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
            <p class="text-sm text-gray-500">{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Template -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">Custom Template</h3>
          <p class="text-sm text-gray-600">Create your own prompt</p>
        </div>
      </div>
    </div>
  </div>
</template>
