<script setup lang="ts">
import { ref } from 'vue'
import AIGenerationPage from '@/components/AIGenerationPage.vue'
import GenerationHistory from '@/components/GenerationHistory.vue'
import SavedContentPage from '@/components/SavedContentPage.vue'

const activeTab = ref<'chat' | 'history' | 'saved'>('chat')

const tabs = [
  { id: 'chat', label: 'Generate', icon: 'Sparkles', description: 'Create AI content' },
  { id: 'history', label: 'History', icon: 'Clock', description: 'View generation history' },
  { id: 'saved', label: 'My Content', icon: 'Folder', description: 'Saved content library' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Tab Navigation -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as 'chat' | 'history' | 'saved'"
            :class="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            "
            class="flex flex-col items-center gap-1 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="tab.icon === 'Sparkles'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              <path v-else-if="tab.icon === 'Clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else-if="tab.icon === 'Folder'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ tab.label }}</span>
            <span class="text-xs opacity-75">{{ tab.description }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1">
      <AIGenerationPage v-if="activeTab === 'chat'" />
      <GenerationHistory v-else-if="activeTab === 'history'" />
      <SavedContentPage v-else-if="activeTab === 'saved'" />
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
