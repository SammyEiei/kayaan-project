<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Tab Navigation -->
    <div class="bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Grid Layout for Tabs -->
        <nav class="grid grid-cols-2 gap-4 py-4 md:flex md:justify-center md:space-x-8 md:py-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as 'create' | 'content'"
            :class="
              activeTab === tab.id
                ? 'border-green-500 text-green-600 bg-green-50 md:bg-transparent'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 md:hover:bg-transparent'
            "
            class="group flex flex-col items-center gap-2 py-3 px-4 md:py-4 md:px-2 border-2 md:border-b-2 md:border-l-0 md:border-r-0 md:border-t-0 rounded-lg md:rounded-none font-medium text-sm transition-all duration-200 whitespace-nowrap"
          >
            <!-- Icon Container -->
            <div class="p-2 rounded-lg transition-colors duration-200"
                 :class="activeTab === tab.id ? 'bg-green-100' : 'bg-slate-100 group-hover:bg-slate-200'"
            >
              <svg class="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="tab.icon === 'Edit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                <path v-else-if="tab.icon === 'Collection'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
    <div v-show="activeTab === 'create'" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-center">
        <div class="flex items-center">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-green-600">Manual Creation</span>
            <div class="ml-4 w-12 h-0.5 bg-green-500"></div>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="ml-2 text-sm font-medium text-blue-600">Choose Type</span>
            <div class="ml-4 w-12 h-0.5 bg-slate-200"></div>
          </div>
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-300 text-slate-600">
              <span class="text-xs font-medium">3</span>
            </div>
            <span class="ml-2 text-sm font-medium text-slate-500">Create</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Backend Integration Status -->
    <div v-if="showBackendWarning" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-green-800">Backend Integration Complete!</h4>
            <button
              @click="hideBackendWarning"
              class="text-green-600 hover:text-green-800 transition-colors duration-200"
              title="Dismiss"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-green-700 mt-1">
            Manual Generation features are now fully integrated with Backend! All API endpoints are synchronized and ready for production.
          </p>
          <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div class="flex items-center gap-2 text-xs text-green-600">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>API endpoints: /api/* ready</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-green-600">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Unified Content API: Active</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-green-600">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Authentication: Integrated</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Content Creation -->
    <div class="space-y-6">
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">Manual Content Creation</h2>

        <!-- Content Type Selection -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-slate-700 mb-4">Choose Content Type</label>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Create Quiz -->
        <button
          @click="() => navigateToCreate('quiz')"
              class="group p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-slate-200 hover:border-blue-300 bg-white"
            >
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 rounded-lg bg-slate-100 group-hover:bg-blue-50">
                  <svg class="w-8 h-8 text-slate-600 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
                <div>
                  <h3 class="font-semibold text-slate-900 mb-1">Quiz</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Build interactive quizzes with multiple choice, true/false, and short answer questions</p>
                </div>
              </div>
        </button>

            <!-- Create Flashcards -->
        <button
          @click="() => navigateToCreate('flashcard')"
              class="group p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-slate-200 hover:border-blue-300 bg-white"
            >
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 rounded-lg bg-slate-100 group-hover:bg-blue-50">
                  <svg class="w-8 h-8 text-slate-600 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
                <div>
                  <h3 class="font-semibold text-slate-900 mb-1">Flashcards</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Design study cards with questions and answers for effective memorization</p>
                </div>
              </div>
        </button>

            <!-- Create Notes -->
        <button
          @click="() => navigateToCreate('note')"
              class="group p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-slate-200 hover:border-blue-300 bg-white"
            >
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 rounded-lg bg-slate-100 group-hover:bg-blue-50">
                  <svg class="w-8 h-8 text-slate-600 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 mb-1">Notes</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Write comprehensive study notes with rich formatting and organization</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Manual Creation Advantages -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mt-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-green-900 mb-2">Why Choose Manual Creation?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-green-800 mb-1">Full Control</h4>
                  <p class="text-sm text-green-700">Create exactly what you need with complete customization over every detail</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-green-800 mb-1">Instant Results</h4>
                  <p class="text-sm text-green-700">No waiting for AI processing - create and edit your content immediately</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-green-800 mb-1">Perfect Fit</h4>
                  <p class="text-sm text-green-700">Design content that matches your exact learning style and requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- My Content Tab -->
    <div v-show="activeTab === 'content'">
      <MyContentView :embedded="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MyContentView from './MyContentView.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref<'create' | 'content'>('create')

// UI state
const showBackendWarning = ref(true)

// ตรวจสอบ query parameter เมื่อ component โหลด
onMounted(() => {
  const tabFromQuery = route.query.tab as string
  if (tabFromQuery && ['create', 'content'].includes(tabFromQuery)) {
    activeTab.value = tabFromQuery as 'create' | 'content'
    console.log('🎯 Initial tab set to:', activeTab.value)
  }
})

// Watch route changes เพื่อเปลี่ยน tab เมื่อ query parameter เปลี่ยน
watch(() => route.query.tab, (newTab, oldTab) => {
  console.log('🔍 Route query.tab changed:', { from: oldTab, to: newTab })
  if (newTab && ['create', 'content'].includes(newTab as string)) {
    const previousTab = activeTab.value
    activeTab.value = newTab as 'create' | 'content'
    console.log('🔄 Tab changed:', { from: previousTab, to: activeTab.value })

    // Force reactive update
    if (newTab === 'content') {
      console.log('📁 Switching to MyContentView tab')
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
  { id: 'create', label: 'Create', icon: 'Edit', description: 'Manual content creation' },
  { id: 'content', label: 'My Content', icon: 'Collection', description: 'Manage manual content' },
]

// Methods
const navigateToCreate = (type: string) => {
  switch (type) {
    case 'quiz':
      router.push('/QuizView')
      break
    case 'flashcard':
      router.push('/FlashcardView')
      break
    case 'note':
      router.push('/NoteView')
      break
  }
}

const hideBackendWarning = () => {
  showBackendWarning.value = false
}
</script>
