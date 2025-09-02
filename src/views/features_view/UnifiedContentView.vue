<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AIGenerationPage from '@/components/AIGenerationPage.vue'
import GenerationHistory from '@/components/GenerationHistory.vue'
import SavedContentPage from '@/components/SavedContentPage.vue'
import ManualGenerateMainView from '@/views/ManualGenerate_view/ManualGenerateMainView.vue'
import MyContentView from '@/views/ManualGenerate_view/MyContentView.vue'

const route = useRoute()
const activeTab = ref<'ai-generate' | 'ai-history' | 'ai-saved' | 'manual-create' | 'manual-content'>('ai-generate')

// ตรวจสอบ query parameter เมื่อ component โหลด
onMounted(() => {
  const tabFromQuery = route.query.tab as string
  if (tabFromQuery && ['ai-generate', 'ai-history', 'ai-saved', 'manual-create', 'manual-content'].includes(tabFromQuery)) {
    activeTab.value = tabFromQuery as typeof activeTab.value
    console.log('🎯 Initial tab set to:', activeTab.value)
  }
})

// Watch route changes เพื่อเปลี่ยน tab เมื่อ query parameter เปลี่ยน
watch(() => route.query.tab, (newTab, oldTab) => {
  console.log('🔍 Route query.tab changed:', { from: oldTab, to: newTab })
  if (newTab && ['ai-generate', 'ai-history', 'ai-saved', 'manual-create', 'manual-content'].includes(newTab as string)) {
    const previousTab = activeTab.value
    activeTab.value = newTab as typeof activeTab.value
    console.log('🔄 Tab changed:', { from: previousTab, to: activeTab.value })
  } else {
    console.log('⚠️ Invalid tab or no tab specified, staying on current tab:', activeTab.value)
  }
}, { immediate: true })

// Also watch the entire route for debugging
watch(() => route.fullPath, (newPath) => {
  console.log('🛣️ Full route changed to:', newPath)
}, { immediate: true })

const tabs = [
  { id: 'ai-generate', label: 'AI Generate', icon: 'Star', description: 'Create with AI', group: 'AI' },
  { id: 'ai-history', label: 'AI History', icon: 'Clock', description: 'Generation history', group: 'AI' },
  { id: 'ai-saved', label: 'AI Content', icon: 'Folder', description: 'AI generated content', group: 'AI' },
  { id: 'manual-create', label: 'Manual Create', icon: 'Edit', description: 'Create manually', group: 'Manual' },
  { id: 'manual-content', label: 'Manual Content', icon: 'FileText', description: 'Manual content library', group: 'Manual' },
]

const aiTabs = tabs.filter(tab => tab.group === 'AI')
const manualTabs = tabs.filter(tab => tab.group === 'Manual')
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Content Hub</h1>
          <p class="text-slate-600">Generate, create, and manage all your study content in one place</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category Headers -->
        <div class="flex items-center justify-center space-x-16 py-4">
          <!-- AI Content Section -->
          <div class="text-center">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0.5L9.5 5.5L14.5 7L9.5 8.5L8 13.5L6.5 8.5L1.5 7L6.5 5.5L8 0.5Z"/>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-slate-800">AI Content</h2>
            </div>

            <nav class="flex space-x-4">
              <button
                v-for="tab in aiTabs"
                :key="tab.id"
                @click="activeTab = tab.id as typeof activeTab"
                :class="
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                "
                class="group flex flex-col items-center gap-2 py-3 px-4 border-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
              >
                <!-- Icon Container -->
                <div class="p-2 rounded-lg transition-colors duration-200"
                     :class="activeTab === tab.id ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'"
                >
                  <svg class="w-5 h-5" :fill="tab.icon === 'Star' ? 'currentColor' : 'none'" :stroke="tab.icon === 'Star' ? 'none' : 'currentColor'" :viewBox="tab.icon === 'Star' ? '0 0 16 16' : '0 0 24 24'">
                    <path v-if="tab.icon === 'Star'" d="M8 0.5L9.5 5.5L14.5 7L9.5 8.5L8 13.5L6.5 8.5L1.5 7L6.5 5.5L8 0.5Z" />
                    <path v-else-if="tab.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else-if="tab.icon === 'Folder'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>

                <!-- Text Content -->
                <div class="text-center">
                  <div class="font-semibold">{{ tab.label.replace('AI ', '') }}</div>
                  <div class="text-xs opacity-75 mt-0.5">{{ tab.description }}</div>
                </div>
              </button>
            </nav>
          </div>

          <!-- Manual Content Section -->
          <div class="text-center">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.5 1.5A1.5 1.5 0 0 0 7 3v3.5a.5.5 0 0 1-1 0V1.5a1.5 1.5 0 0 0-3 0V12a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h1V3a1.5 1.5 0 0 0-3 0v8a5 5 0 0 0 10 0V3a1.5 1.5 0 0 0-1.5-1.5z"/>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-slate-800">Manual Content</h2>
            </div>

            <nav class="flex space-x-4">
              <button
                v-for="tab in manualTabs"
                :key="tab.id"
                @click="activeTab = tab.id as typeof activeTab"
                :class="
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                "
                class="group flex flex-col items-center gap-2 py-3 px-4 border-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
              >
                <!-- Icon Container -->
                <div class="p-2 rounded-lg transition-colors duration-200"
                     :class="activeTab === tab.id ? 'bg-green-100' : 'bg-slate-100 group-hover:bg-slate-200'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="tab.icon === 'Edit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    <path v-else-if="tab.icon === 'FileText'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <!-- Text Content -->
                <div class="text-center">
                  <div class="font-semibold">{{ tab.label.replace('Manual ', '') }}</div>
                  <div class="text-xs opacity-75 mt-0.5">{{ tab.description }}</div>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1">
      <!-- AI Content Components -->
      <AIGenerationPage v-if="activeTab === 'ai-generate'" />
      <GenerationHistory v-else-if="activeTab === 'ai-history'" />
      <SavedContentPage v-else-if="activeTab === 'ai-saved'" :key="'saved-' + route.query._t" />

      <!-- Manual Content Components -->
      <ManualGenerateMainView v-else-if="activeTab === 'manual-create'" />
      <MyContentView v-else-if="activeTab === 'manual-content'" />
    </div>
  </div>
</template>

<style scoped>
/* Custom styles */
.transition-colors {
  transition: all 0.2s ease-in-out;
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}
</style>
