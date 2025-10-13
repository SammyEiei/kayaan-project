<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- Top Navigation Skeleton -->
      <header class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div class="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
          <div class="flex items-center gap-3">
            <div class="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
      </div>
      </header>

    <main class="px-4 sm:px-6 lg:px-8 py-6">
      <div class="max-w-7xl mx-auto space-y-6">
          <!-- Welcome Banner & Study Streak Row Skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Welcome Banner Skeleton -->
            <div class="lg:col-span-2 bg-gray-200 rounded-lg p-6 animate-pulse">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                <div>
                  <div class="h-8 w-48 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Study Streak Widget Skeleton -->
            <div class="bg-gray-200 rounded-lg p-6 animate-pulse">
              <div class="flex items-start justify-between mb-4">
                <div class="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div class="h-6 w-24 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div class="h-4 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div class="h-12 w-16 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div class="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- AI-Powered Learning Tools & Study Groups Row Skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- AI-Powered Learning Tools Skeleton -->
            <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <div class="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div class="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
                <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- AI Tool Cards Skeleton -->
                <div v-for="i in 4" :key="i" class="bg-gray-50 rounded-lg p-6 animate-pulse">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div class="flex-1">
                      <div class="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div class="h-4 w-8 bg-gray-200 rounded-full animate-pulse mb-3"></div>
                      <div class="h-12 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div class="flex items-center justify-between">
                        <div class="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
            </div>
            </div>
          </div>
              </div>
          </div>

            <!-- Study Groups Widget Skeleton -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div class="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div class="space-y-4">
                <!-- Study Group Cards Skeleton -->
                <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div>
                        <div class="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
            </div>
                    <div class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
              </div>

              <div class="w-full mt-6 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Main Content -->
    <div v-else>


      <main class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
          <!-- Welcome Banner -->
        <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>

          <div class="relative z-10 flex items-center gap-4">
            <div class="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden ring-4 ring-white ring-opacity-30 shadow-lg transform transition-transform hover:scale-105">
                <img
                  v-if="authStore.currentUserAvatar"
                  :src="authStore.currentUserAvatar"
                  :alt="username"
                class="w-full h-full object-cover rounded-2xl"
                />
              <span v-else class="text-3xl font-bold text-white">
                  {{ username.charAt(0).toUpperCase() }}
                  </span>
              </div>
              <div>
              <h1 class="text-3xl font-bold mb-2 animate-fade-in flex items-center gap-2">
                Welcome back, {{ username }}!
                <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" class="inline-block">
                  <g fill="none">
                    <path fill="#d7e0ff" d="M7 13.25c4 0 6.25-2.25 6.25-6.25S11 .75 7 .75S.75 3 .75 7S3 13.25 7 13.25"/>
                    <path stroke="#4147d5" stroke-linecap="round" stroke-linejoin="round" d="M3.827 7.961c.48 1.731 2.404 2.789 4.135 2.308c1.057-.385 1.923-1.25 2.211-2.308M4.452 5.1v.7m5.096-.7v.7"/>
                    <path stroke="#4147d5" stroke-linecap="round" stroke-linejoin="round" d="M7 13.25c4 0 6.25-2.25 6.25-6.25S11 .75 7 .75S.75 3 .75 7S3 13.25 7 13.25"/>
                  </g>
                </svg>
                </h1>
              <p class="text-blue-100 text-lg">Ready to continue your learning journey?</p>
            </div>
            </div>
          </div>

        <!-- Study Streak & Quick Actions Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Study Streak Widget -->
          <StudyStreakWidget :user-id="authStore.user?.id" />

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p class="text-xs text-gray-600">Access frequently used features</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Pomodoro Timer -->
              <router-link
                to="/pomodoro"
                class="group relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200 hover:border-red-400 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors">Pomodoro</span>
                </div>
              </router-link>

              <!-- My Content -->
              <router-link
                to="/my-content"
                class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">My Content</span>
                </div>
              </router-link>

              <!-- Calendar -->
              <router-link
                to="/calendar"
                class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">Calendar</span>
                </div>
              </router-link>

              <!-- Settings -->
              <router-link
                to="/settings"
                class="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col items-center text-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">Settings</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- AI-Powered Learning Tools & Study Groups Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- AI-Powered Learning Tools -->
          <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0.5L9.5 5.5L14.5 7L9.5 8.5L8 13.5L6.5 8.5L1.5 7L6.5 5.5L8 0.5Z" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900">AI Learning Tools</h2>
                </div>
                <p class="text-sm text-gray-600">Create personalized study materials with AI in seconds</p>
            </div>
              <router-link
                to="/ai-content-generator"
                class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0.5L9.5 5.5L14.5 7L9.5 8.5L8 13.5L6.5 8.5L1.5 7L6.5 5.5L8 0.5Z" />
                </svg>
                Try Now
              </router-link>
          </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Interactive Study Notes -->
              <router-link
                to="/ai-content-generator"
                class="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer border-2 border-blue-200 hover:border-blue-400 block"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full opacity-20 -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-700 transition-colors">Study Notes</h4>
                      <p class="text-xs text-gray-600 mb-2">AI-generated notes</p>
                      <div class="flex items-center gap-2">
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">AI-Powered</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <span class="text-xs text-gray-600">Create smart notes</span>
                    <svg class="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  </div>
                </div>
              </router-link>

              <!-- Smart Flashcards -->
              <router-link
                to="/ai-content-generator"
                class="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer border-2 border-purple-200 hover:border-purple-400 block"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full opacity-20 -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-bold text-gray-900 text-base mb-1 group-hover:text-purple-700 transition-colors">Flashcards</h4>
                      <p class="text-xs text-gray-600 mb-2">Adaptive learning</p>
                      <div class="flex items-center gap-2">
                        <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Smart</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
                    <span class="text-xs text-gray-600">Memorize efficiently</span>
                    <svg class="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  </div>
                </div>
              </router-link>

              <!-- Dynamic Quizzes -->
              <router-link
                to="/ai-content-generator"
                class="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer border-2 border-orange-200 hover:border-orange-400 block"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full opacity-20 -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-bold text-gray-900 text-base mb-1 group-hover:text-orange-700 transition-colors">Quizzes</h4>
                      <p class="text-xs text-gray-600 mb-2">Multiple formats</p>
                      <div class="flex items-center gap-2">
                        <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Dynamic</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-orange-200">
                    <span class="text-xs text-gray-600">Test your knowledge</span>
                    <svg class="w-5 h-5 text-orange-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  </div>
                </div>
              </router-link>

              <!-- Study Summaries -->
              <router-link
                to="/ai-content-generator"
                class="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer border-2 border-green-200 hover:border-green-400 block"
              >
                <div class="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full opacity-20 -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                      <h4 class="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">Summaries</h4>
                      <p class="text-xs text-gray-600 mb-2">Quick review</p>
                      <div class="flex items-center gap-2">
                        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Quick</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-green-200">
                    <span class="text-xs text-gray-600">Essential insights</span>
                    <svg class="w-5 h-5 text-green-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  </div>
                </div>
              </router-link>
            </div>
        </div>

          <!-- Study Groups Widget -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
              <h2 class="text-xl font-bold text-gray-900">Study Groups</h2>
                <p class="text-xs text-gray-600">Learn together</p>
              </div>
            </div>

            <div class="space-y-3 mb-6">
              <div v-if="studyGroups.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-gray-600 text-sm font-medium mb-2">No study groups yet</p>
                <p class="text-gray-500 text-xs">Create or join a study group to get started</p>
              </div>

              <div
                v-for="(group, index) in studyGroups.slice(0, 3)"
                :key="group.id"
                class="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-md"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-200">
                    {{ group.letter }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                      {{ group.name }}
                    </h4>
                    <div class="flex items-center gap-1 text-xs text-gray-600">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>{{ group.members }} members</span>
                    </div>
                  </div>
                </div>
                <router-link :to="`/study-groups/${group.id}`" class="text-blue-600 hover:text-white hover:bg-blue-600 font-medium text-xs px-3 py-1.5 rounded-lg border border-blue-600 transition-all duration-200 hover:shadow-md">
                  View
                </router-link>
              </div>

              <div v-if="studyGroups.length > 3" class="text-center pt-2">
                <router-link to="/study-groups" class="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  View all {{ studyGroups.length }} groups
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>

            <router-link to="/study-groups" class="w-full py-3 text-center text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium border-2 border-transparent rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Join New Group
            </router-link>
            </div>
        </div>
      </div>
    </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useGamificationStore } from '@/stores/gamification'
import { useDashboardStore } from '@/stores/dashboard'
import { useGroupStore } from '@/stores/group'
import { useUnifiedContentStore } from '@/stores/unifiedContent'
import { useStudyStreakStore } from '@/stores/studyStreak'
import { aiContentService } from '@/service/AIContentService'
import StudyStreakWidget from '@/components/StudyStreakWidget.vue'

const authStore = useAuthStore()
const router = useRouter()
const gamification = useGamificationStore()
const dashboardStore = useDashboardStore()
const groupStore = useGroupStore()
const unifiedContentStore = useUnifiedContentStore()
const streakStore = useStudyStreakStore()

// AI Content state
interface AIContentItem {
  id: number
  contentTitle: string
  contentType: string
  contentData?: string
  contentVersion: number
  supabaseFilePath?: string
  fileSize?: number
  isSaved: boolean
  createdAt: string
}

const aiContentList = ref<AIContentItem[]>([])
const aiContentLoading = ref(false)

// ถ้า user ไม่ได้ login ให้ redirect ไปหน้า login
onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }
  console.log('user from store:', authStore.user)

  // Load streak data when dashboard mounts
  if (authStore.user?.id) {
    try {
      await streakStore.loadStreakData(authStore.user.id)
      console.log('✅ Dashboard: Streak data loaded successfully')
    } catch (error) {
      console.error('❌ Dashboard: Failed to load streak data', error)
    }
  }
})

// ดึง username จาก store
const username = computed(() => {
  return authStore.user?.username || authStore.user?.email || 'Student'
})

// Study groups - ใช้ข้อมูลจาก group store
const studyGroups = computed(() => {
  return groupStore.userGroups.map(group => ({
    id: parseInt(group.id),
    name: group.name,
    members: group.memberCount,
    letter: group.name.charAt(0).toUpperCase()
  }))
})

// Fetch AI content directly from service
const fetchAIContent = async () => {
  aiContentLoading.value = true
  try {
    console.log('🔄 Fetching AI content for dashboard...')
    const response = await aiContentService.getSavedContent(0, 10, 'createdAt', 'desc')
    aiContentList.value = response.content || []
    console.log('✅ AI content fetched:', aiContentList.value.length, 'items')
  } catch (error) {
    console.warn('⚠️ Failed to fetch AI content:', error)
    // Fallback to unified content store
    aiContentList.value = []
  } finally {
    aiContentLoading.value = false
  }
}

// Loading states และ error handling
const isLoading = computed(() =>
  dashboardStore.isLoading || groupStore.loading || unifiedContentStore.loading || aiContentLoading.value
)

// const hasError = computed(() =>
//   dashboardStore.error || groupStore.error || unifiedContentStore.error
// )

// Fetch ข้อมูลเมื่อ component mount
onMounted(async () => {
  if (!authStore.token) {
    router.push('/login')
    return
  }

  console.log('Dashboard loaded - fetching data...')

  try {
    // Load gamification data จาก localStorage
    gamification.load()

    // Fetch ข้อมูลจาก stores ต่างๆ
    await Promise.allSettled([
      dashboardStore.fetchDashboardData(),
      groupStore.fetchGroups(),
      unifiedContentStore.fetchContent(),
      streakStore.loadStreakData(),
      fetchAIContent()
    ])

    console.log('Dashboard data loaded successfully')
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>

<style scoped>
/* Custom animations for smooth interactions */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

/* Gradient text animation */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-text {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .animate-fade-in {
    animation-duration: 0.3s;
  }
}
</style>
