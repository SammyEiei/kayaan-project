<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AIGenerationPage from '@/components/AIGenerationPage.vue'
import GenerationHistory from '@/components/GenerationHistory.vue'
import SavedContentPage from '@/components/SavedContentPage.vue'

const route = useRoute()
const activeTab = ref<'chat' | 'history' | 'saved'>('chat')

// ตรวจสอบ query parameter เมื่อ component โหลด
onMounted(() => {
  const tabFromQuery = route.query.tab as string
  if (tabFromQuery && ['chat', 'history', 'saved'].includes(tabFromQuery)) {
    activeTab.value = tabFromQuery as 'chat' | 'history' | 'saved'
    console.log('🎯 Initial tab set to:', activeTab.value)
  }
})

// Watch route changes เพื่อเปลี่ยน tab เมื่อ query parameter เปลี่ยน
watch(() => route.query.tab, (newTab, oldTab) => {
  console.log('🔍 Route query.tab changed:', { from: oldTab, to: newTab })
  if (newTab && ['chat', 'history', 'saved'].includes(newTab as string)) {
    const previousTab = activeTab.value
    activeTab.value = newTab as 'chat' | 'history' | 'saved'
    console.log('🔄 Tab changed:', { from: previousTab, to: activeTab.value })

    // Force reactive update
    if (newTab === 'saved') {
      console.log('📁 Switching to SavedContentPage tab')
    }
  } else {
    console.log('⚠️ Invalid tab or no tab specified, staying on current tab:', activeTab.value)
  }
}, { immediate: true })

// Also watch the entire route for debugging
watch(() => route.fullPath, (newPath) => {
  console.log('🛣️ Full route changed to:', newPath)
}, { immediate: true })

const tabs = [
  { id: 'chat', label: 'Generate', icon: 'Star', description: 'Create AI content' },
  { id: 'history', label: 'History', icon: 'Clock', description: 'View generation history' },
  { id: 'saved', label: 'My Content', icon: 'Folder', description: 'Saved content library' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Grid Layout for Tabs -->
        <nav class="grid grid-cols-3 gap-4 py-4 md:flex md:justify-center md:space-x-8 md:py-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as 'chat' | 'history' | 'saved'"
            :class="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50 md:bg-transparent'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 md:hover:bg-transparent'
            "
            class="group flex flex-col items-center gap-2 py-3 px-4 md:py-4 md:px-2 border-2 md:border-b-2 md:border-l-0 md:border-r-0 md:border-t-0 rounded-lg md:rounded-none font-medium text-sm transition-all duration-200 whitespace-nowrap"
          >
            <!-- Icon Container -->
            <div class="p-2 rounded-lg transition-colors duration-200"
                 :class="activeTab === tab.id ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-slate-200'"
            >
              <svg class="w-6 h-6 md:w-5 md:h-5" :fill="tab.icon === 'Star' ? 'currentColor' : 'none'" :stroke="tab.icon === 'Star' ? 'none' : 'currentColor'" :viewBox="tab.icon === 'Star' ? '0 0 16 16' : '0 0 24 24'">
                <path v-if="tab.icon === 'Star'" d="M8 0.5L9.5 5.5L14.5 7L9.5 8.5L8 13.5L6.5 8.5L1.5 7L6.5 5.5L8 0.5Z" />
                <path v-else-if="tab.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="tab.icon === 'Folder'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 712-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <!-- Text Content -->
            <div class="text-center">
              <div class="font-semibold">{{ tab.label }}</div>
              <div class="text-xs opacity-75 mt-0.5">{{ tab.description }}</div>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1">
      <AIGenerationPage v-if="activeTab === 'chat'" />
      <GenerationHistory v-else-if="activeTab === 'history'" />
      <SavedContentPage v-else-if="activeTab === 'saved'" :key="'saved-' + route.query._t" />
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
