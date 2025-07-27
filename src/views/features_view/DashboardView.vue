<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div
      class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"
    ></div>

    <main class="relative z-10 p-6">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Enhanced Header -->
        <div class="mb-8">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-8 shadow-xl"
          >
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div
                    class="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
                  >
                    <img
                      v-if="userAvatarUrl"
                      :src="userAvatarUrl"
                      :key="avatarKey"
                      :alt="authStore.user?.username || 'User avatar'"
                      class="w-full h-full object-cover rounded-2xl"
                    />
                    <span v-else class="text-2xl font-bold text-white">
                      {{ username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div
                    class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div>
                  <h1
                    class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent"
                  >
                    Welcome back, {{ username }}!
                  </h1>
                  <p class="text-gray-600 mt-1">Ready to continue your learning journey?</p>
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  class="px-6 py-3 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:shadow-md"
                >
                  View Profile
                </button>
                <button
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Start Study Session
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Study Streak -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-600 mb-2">Study Streak</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">{{ studyStreak }}</span>
              <span class="text-sm text-gray-500">days</span>
            </div>
            <p class="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Keep going strong!
            </p>
          </div>

          <!-- Focus Time -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <svg
                class="w-6 h-6 text-blue-600"
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
            <h3 class="text-sm font-medium text-gray-600 mb-2">Focus Time</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">{{ focusTime.hours }}h</span>
              <span class="text-xl font-semibold text-gray-700">{{ focusTime.minutes }}m</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">This week</p>
          </div>

          <!-- Flashcards Reviewed -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-600 mb-2">Flashcards Reviewed</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">{{ flashcardsReviewed }}</span>
              <span class="text-sm text-gray-500">cards</span>
            </div>
            <p class="text-sm text-gray-500 mt-2">{{ lastReviewTime }}</p>
          </div>

          <!-- Today's Pomodoro Streak -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <svg
                class="w-6 h-6 text-red-600"
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
            <h3 class="text-sm font-medium text-gray-600 mb-2">Today's Pomodoros</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">{{ pomodorosToday }}</span>
              <span class="text-sm text-gray-500">sessions</span>
            </div>
          </div>
        </div>

        <!-- Study Progress & Groups Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Study & Learning Progress -->
          <div
            class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Study & Learning Progress</h2>
            </div>

            <!-- Enhanced Bar Chart -->
            <div class="mb-8">
              <h3 class="text-sm font-medium text-gray-600 mb-4">
                Daily Study Hours (Last 14 days)
              </h3>
              <div class="h-40 flex items-end justify-between gap-1">
                <div
                  v-for="(day, index) in studyHoursData.slice(0, 14)"
                  :key="index"
                  class="flex flex-col items-center group cursor-pointer"
                  style="width: 20px"
                >
                  <div
                    class="bg-gradient-to-t from-purple-600 to-indigo-500 w-5 rounded-t-md transition-all duration-300 group-hover:from-purple-500 group-hover:to-indigo-400"
                    :style="{ height: Math.max(day.hours * 8, 4) + 'px' }"
                  ></div>
                  <span
                    class="text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-colors"
                    >{{ day.day }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Learning Progress List -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-600 mb-4">Current Learning Progress</h3>
              <div v-for="subject in learningProgress" :key="subject.id" class="group">
                <div class="flex justify-between items-center mb-2">
                  <span
                    class="font-medium text-gray-800 group-hover:text-gray-900 transition-colors"
                    >{{ subject.subject }}</span
                  >
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-gray-700">{{ subject.progress }}%</span>
                    <span class="text-xs text-gray-500">{{ subject.daysLeft }} days left</span>
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 group-hover:from-blue-400 group-hover:to-indigo-500"
                    :style="{ width: subject.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Study Groups -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Study Groups</h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="group in studyGroups"
                :key="group.id"
                class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-200"
                  >
                    {{ group.letter }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800 group-hover:text-gray-900">
                      {{ group.name }}
                    </h4>
                    <p class="text-sm text-gray-500">{{ group.members }} members</p>
                  </div>
                </div>
                <button
                  class="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  View
                </button>
              </div>
            </div>

            <button
              class="w-full mt-6 py-3 text-center text-blue-600 hover:text-blue-700 font-medium border-2 border-dashed border-blue-200 hover:border-blue-300 rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              + Join New Group
            </button>
          </div>
        </div>

        <!-- AI-Generated Content -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center"
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">AI-Generated Content</h2>
            </div>
            <button
              class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Generate New
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="item in aiContent"
              :key="item.id"
              class="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer border border-blue-100 hover:border-blue-200"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200"
                >
                  <span v-if="item.type === 'summary'">📝</span>
                  <span v-else-if="item.type === 'flashcards'">🃏</span>
                  <span v-else-if="item.type === 'quiz'">❓</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-800 group-hover:text-gray-900 mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-sm text-gray-500 mb-3">Generated {{ item.daysAgo }} days ago</p>
                  <button
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    View Content →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Action Button -->
        <div class="fixed bottom-8 right-8 z-50">
          <button
            class="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110"
          >
            <div class="flex items-center gap-3">
              <svg
                class="w-6 h-6 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-semibold hidden group-hover:block animate-fade-in">Create</span>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useGamificationStore } from '@/stores/gamification'

const authStore = useAuthStore()
const router = useRouter()
const gamification = useGamificationStore()

// ถ้า user ไม่ได้ login ให้ redirect ไปหน้า login
onMounted(() => {
  if (!authStore.token) {
    router.push('/login')
  }
  console.log('user from store:', authStore.user)
})

// ดึง username จาก store
const username = computed(() => {
  return authStore.user?.username || authStore.user?.name || authStore.user?.email || 'Student'
})

// Avatar
const userAvatarUrl = computed(() => authStore.currentUserAvatar)
const avatarKey = computed(() => authStore.user?.avatarRotation || 0)

// Study stats
type FocusTime = { hours: number; minutes: number }
const studyStreak = ref<number | null>(null) // TODO: Fetch from API
const focusTime = ref<FocusTime>({ hours: 0, minutes: 0 }) // TODO: Fetch from API
const flashcardsReviewed = ref<number | null>(null) // TODO: Fetch from API
const lastReviewTime = ref<string>('') // TODO: Fetch from API
const pomodorosToday = computed(() => gamification.pomodorosToday)

// Study progress data (for chart)
type StudyHour = { day: string; hours: number }
const studyHoursData = ref<StudyHour[]>([]) // TODO: Fetch from API

// Study groups
type StudyGroup = { id: number; name: string; members: number; letter: string }
const studyGroups = ref<StudyGroup[]>([]) // TODO: Fetch from API

// Learning progress
type LearningProgress = { id: number; subject: string; progress: number; daysLeft: number }
const learningProgress = ref<LearningProgress[]>([]) // TODO: Fetch from API

// AI-generated content
type AIContent = { id: number; title: string; daysAgo: number; type: string }
const aiContent = ref<AIContent[]>([]) // TODO: Fetch from API

onMounted(() => {
  console.log('Dashboard loaded')
})
</script>

<style scoped>
/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Custom hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}
</style>
