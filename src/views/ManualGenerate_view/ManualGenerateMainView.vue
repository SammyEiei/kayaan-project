<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Tab Navigation -->
    <div class="bg-white/80 backdrop-blur-sm border-b-2 border-blue-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Grid Layout for Tabs -->
        <nav class="grid grid-cols-2 gap-4 py-4 md:flex md:justify-center md:space-x-8 md:py-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id as 'create' | 'content'"
            :class="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-transparent shadow-md md:shadow-none'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 md:hover:bg-transparent'
            "
            class="group flex flex-col items-center gap-2 py-3 px-4 md:py-4 md:px-2 border-2 md:border-b-2 md:border-l-0 md:border-r-0 md:border-t-0 rounded-xl md:rounded-none font-medium text-sm transition-all duration-200 whitespace-nowrap transform hover:scale-105 md:hover:scale-100"
          >
            <!-- Icon Container -->
            <div
              class="p-2 rounded-xl transition-all duration-200 shadow-sm"
              :class="
                activeTab === tab.id ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600'
              "
            >
              <svg
                class="w-6 h-6 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="tab.icon === 'Edit'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
                <path
                  v-else-if="tab.icon === 'Collection'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
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
      <div class="mb-8 bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-6">
        <div class="flex items-center justify-center">
          <div class="flex items-center">
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span class="ml-3 text-sm font-semibold text-green-600">Manual Creation</span>
              <div class="ml-4 w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </div>
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span class="ml-3 text-sm font-semibold text-blue-600">Choose Type</span>
              <div class="ml-4 w-16 h-1 bg-gradient-to-r from-blue-300 to-slate-300 rounded-full"></div>
            </div>
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md border-2 border-white"
              >
                <span class="text-sm font-bold">3</span>
              </div>
              <span class="ml-3 text-sm font-semibold text-slate-500">Create</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Backend Integration Status -->
      <!-- <div v-if="showBackendWarning" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
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
    </div> -->

      <!-- Manual Content Creation -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border-2 border-blue-100 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <!-- Header with gradient icon -->
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manual Content Creation</h2>
          </div>

          <!-- Content Type Selection -->
          <div class="mb-8">
            <label class="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6">
              <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              Choose Content Type
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Create Notes -->
              <button
                @click="() => navigateToCreate('note')"
                class="group p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50 hover:to-indigo-50 transform"
              >
                <div class="flex flex-col items-center text-center space-y-4">
                  <div class="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <!-- Note Icon -->
                    <svg
                      class="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      >
                        <path
                          d="M16.5 4H8a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h6.843a4 4 0 0 0 2.829-1.172l1.656-1.656a4 4 0 0 0 1.172-2.829V8a4 4 0 0 0-4-4"
                        />
                        <path d="M20.5 14H17a3 3 0 0 0-3 3v3.5M8 8h7.5M8 12h5" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 mb-2 text-lg">Notes</h3>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      Write comprehensive study notes with rich formatting and organization
                    </p>
                  </div>
                </div>
              </button>
              <!-- Create Quiz -->
              <button
                @click="() => navigateToCreate('quiz')"
                class="group p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-orange-200 hover:border-orange-400 bg-gradient-to-br from-white to-orange-50/30 hover:from-orange-50 hover:to-amber-50 transform"
              >
                <div class="flex flex-col items-center text-center space-y-4">
                  <div class="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 group-hover:from-orange-600 group-hover:to-amber-700 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <!-- Quiz Icon -->
                    <svg
                      class="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      >
                        <path
                          d="M7.5 3.5c-1.556.047-2.483.22-3.125.862c-.879.88-.879 2.295-.879 5.126v6.506c0 2.832 0 4.247.879 5.127C5.253 22 6.668 22 9.496 22h5c2.829 0 4.243 0 5.121-.88c.88-.879.88-2.294.88-5.126V9.488c0-2.83 0-4.246-.88-5.126c-.641-.642-1.569-.815-3.125-.862"
                        />
                        <path
                          d="M7.496 3.75c0-.966.784-1.75 1.75-1.75h5.5a1.75 1.75 0 1 1 0 3.5h-5.5a1.75 1.75 0 0 1-1.75-1.75M6.5 10h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3m-11 7h4m3 1s.5 0 1 1c0 0 1.588-2.5 3-3"
                        />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 mb-2 text-lg">Quiz</h3>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      Build interactive quizzes with multiple choice, true/false, and short answer
                      questions
                    </p>
                  </div>
                </div>
              </button>

              <!-- Create Flashcards -->
              <button
                @click="() => navigateToCreate('flashcard')"
                class="group p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-white to-purple-50/30 hover:from-purple-50 hover:to-pink-50 transform"
              >
                <div class="flex flex-col items-center text-center space-y-4">
                  <div class="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 group-hover:from-purple-600 group-hover:to-pink-700 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <!-- Flashcard Icon -->
                    <svg
                      class="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2 16c0 2.21 0 3.316.702 4.054q.169.178.37.327C3.908 21 5.16 21 7.667 21h.666c2.506 0 3.759 0 4.595-.62q.201-.147.37-.326C14 19.316 14 18.211 14 16c0-2.21 0-3.316-.702-4.054a3 3 0 0 0-.37-.327C12.092 11 10.84 11 8.333 11h-.666c-2.506 0-3.759 0-4.595.62a3 3 0 0 0-.37.326C2 12.684 2 13.789 2 16m8-8c0-2.21 0-3.316.702-4.054q.168-.178.37-.327C11.908 3 13.16 3 15.667 3h.666c2.506 0 3.759 0 4.595.62q.201.148.37.326C22 4.684 22 5.789 22 8c0 2.21 0 3.316-.702 4.054a3 3 0 0 1-.37.327c-.758.562-1.86.614-3.928.618M2 15h12m-4-8h12M2 9c0-3.317 2.683-6 6-6l-.857 1.714M22 15c0 3.317-2.683 6-6 6l.857-1.714"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 mb-2 text-lg">Flashcards</h3>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      Design study cards with questions and answers for effective memorization
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Manual Creation Advantages -->
        <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 mt-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-green-900 mb-4">Why Choose Manual Creation?</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-green-200 hover:bg-white transition-colors duration-200">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 1025 1024"
                    >
                      <path fill="currentColor" d="M896.428 1024h-768q-53 0-90.5-37.5T.428 896V128q0-53 37.5-90.5t90.5-37.5h768q53 0 90.5 37.5t37.5 90.5v768q0 53-37.5 90.5t-90.5 37.5zm-384-160q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5v-64q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v64zm-384 0q0 13 9.5 22.5t22.5 9.5h192q13 0 22.5-9.5t9.5-22.5v-64q0-13-9.5-22.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 22.5v64zm736-672h-352q0-27-18.5-45.5t-45.5-18.5h-128q-26 0-45 18.5t-19 45.5h-96q-13 0-22.5 9.5t-9.5 22.5t9.5 22.5t22.5 9.5h96q0 26 19 45t45 19h128q27 0 45.5-18.5t18.5-45.5h352q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5zm0 320h-96q0-27-19-45.5t-45-18.5h-128q-26 0-45 18.5t-19 45.5h-352q-13 0-22.5 9.5t-9.5 22.5t9.5 22.5t22.5 9.5h352q0 27 19 45.5t45 18.5h128q26 0 45-18.5t19-45.5h96q13 0 22.5-9.5t9.5-22.5t-9.5-22.5t-22.5-9.5zm32 288q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v64q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5v-64zm-224-224h-64q-13 0-22.5-9.5t-9.5-22.5t9.5-22.5t22.5-9.5h64q13 0 22.5 9.5t9.5 22.5t-9.5 22.5t-22.5 9.5zm-256-320h-64q-13 0-22.5-9.5t-9.5-22.5t9.5-22.5t22.5-9.5h64q13 0 22.5 9.5t9.5 22.5t-9.5 22.5t-22.5 9.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-900 mb-1">Full Control</h4>
                    <p class="text-sm text-green-700 leading-relaxed">
                      Create exactly what you need with complete customization over every detail
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-green-200 hover:bg-white transition-colors duration-200">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-900 mb-1">Instant Results</h4>
                    <p class="text-sm text-green-700 leading-relaxed">
                      No waiting for AI processing - create and edit your content immediately
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-green-200 hover:bg-white transition-colors duration-200">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-green-900 mb-1">Perfect Fit</h4>
                    <p class="text-sm text-green-700 leading-relaxed">
                      Design content that matches your exact learning style and requirements
                    </p>
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
// const showBackendWarning = ref(true)

// ตรวจสอบ query parameter เมื่อ component โหลด
onMounted(() => {
  const tabFromQuery = route.query.tab as string
  if (tabFromQuery && ['create', 'content'].includes(tabFromQuery)) {
    activeTab.value = tabFromQuery as 'create' | 'content'
    console.log('🎯 Initial tab set to:', activeTab.value)
  }
})

// Watch route changes เพื่อเปลี่ยน tab เมื่อ query parameter เปลี่ยน
watch(
  () => route.query.tab,
  (newTab, oldTab) => {
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
  },
  { immediate: true },
)

// Also watch the entire route for debugging
watch(
  () => route.fullPath,
  (newPath) => {
    console.log('🛣️ Full route changed to:', newPath)
  },
  { immediate: true },
)

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

// const hideBackendWarning = () => {
//   showBackendWarning.value = false
// }
</script>
