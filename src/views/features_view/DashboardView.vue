<template>
  <div class="min-h-screen bg-theme-surface">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-theme-text-secondary">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Error Message -->
    <!-- <div v-if="hasError" class="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 sm:mx-6 mt-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800">Some data couldn't be loaded. Showing available information.</p>
      </div>
    </div> -->

    <main class="px-4 sm:px-6 lg:px-8 py-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Welcome Banner -->
        <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-sm">
                  <img
                    v-if="userAvatarUrl"
                    :src="userAvatarUrl"
                    :key="avatarKey"
                    :alt="authStore.user?.username || 'User avatar'"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  <span v-else class="text-lg font-bold text-white">
                    {{ username.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-theme-success rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-theme-text">
                  Welcome back, {{ username }}!
                </h1>
                <p class="text-theme-text-secondary">Ready to continue your learning journey?</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <router-link to="/settings" class="px-4 py-2 bg-white border border-theme-border text-theme-text rounded-lg font-medium transition-colors duration-150 hover:bg-theme-surface">
                View Profile
              </router-link>
              <router-link to="/pomodoro" class="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg font-medium transition-all duration-150 shadow-sm hover:shadow-md">
                Start Study Session
              </router-link>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Study Streak -->
          <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm hover:shadow-md transition-shadow duration-150">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-theme-text-secondary mb-2">Study Streak</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-theme-text">{{ studyStreak }}</span>
              <span class="text-sm text-theme-text-secondary">days</span>
            </div>
            <p class="text-sm text-theme-success font-medium mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Keep going strong!
            </p>
          </div>

          <!-- Focus Time -->
          <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm hover:shadow-md transition-shadow duration-150">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-theme-text-secondary mb-2">Focus Time</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-theme-text">{{ focusTime.hours }}h</span>
              <span class="text-xl font-semibold text-theme-text">{{ focusTime.minutes }}m</span>
            </div>
            <p class="text-sm text-theme-text-secondary mt-2">This week</p>
          </div>

          <!-- Flashcards Reviewed -->
          <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm hover:shadow-md transition-shadow duration-150">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-theme-success to-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-theme-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-theme-text-secondary mb-2">Flashcards Reviewed</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-theme-text">{{ flashcardsReviewed }}</span>
              <span class="text-sm text-theme-text-secondary">cards</span>
            </div>
            <p class="text-sm text-theme-text-secondary mt-2">{{ lastReviewTime }}</p>
          </div>

          <!-- Today's Pomodoros -->
          <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm hover:shadow-md transition-shadow duration-150">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-theme-warning to-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg class="w-5 h-5 text-theme-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-sm font-medium text-theme-text-secondary mb-2">Today's Pomodoros</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-theme-text">{{ pomodorosToday }}</span>
              <span class="text-sm text-theme-text-secondary">sessions</span>
            </div>
          </div>
        </div>

        <!-- Study Progress & Groups Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Study & Learning Progress -->
          <div class="lg:col-span-2 bg-white rounded-lg border border-theme-border p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-r from-secondary to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-theme-text">Study & Learning Progress</h2>
            </div>

            <!-- Enhanced Bar Chart -->
            <div class="mb-8">
              <h3 class="text-sm font-medium text-theme-text-secondary mb-4">
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
                    class="bg-gradient-to-t from-primary to-secondary w-5 rounded-t-md transition-all duration-300 group-hover:from-primary-600 group-hover:to-secondary-600"
                    :style="{ height: Math.max(day.hours * 8, 4) + 'px' }"
                  ></div>
                  <span class="text-xs text-theme-text-secondary mt-2 group-hover:text-theme-text transition-colors">
                    {{ day.day }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Learning Progress List -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-theme-text-secondary mb-4">Current Learning Progress</h3>
              <div v-for="subject in learningProgress" :key="subject.id" class="group">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-theme-text group-hover:text-theme-text transition-colors">
                    {{ subject.subject }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-theme-text">{{ subject.progress }}%</span>
                    <span class="text-xs text-theme-text-secondary">{{ subject.daysLeft }} days left</span>
                  </div>
                </div>
                <div class="w-full bg-theme-border rounded-full h-3 overflow-hidden">
                  <div
                    class="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:from-primary-600 group-hover:to-secondary-600"
                    :style="{ width: subject.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Study Groups -->
          <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-theme-text">Study Groups</h2>
            </div>

            <div class="space-y-4">
              <div v-if="studyGroups.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-theme-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-theme-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-theme-text-secondary mb-2">No study groups yet</p>
                <p class="text-sm text-theme-text-secondary">Join or create a group to start collaborating</p>
              </div>

              <div
                v-for="group in studyGroups"
                :key="group.id"
                class="flex items-center justify-between p-4 bg-theme-surface rounded-lg hover:bg-theme-border transition-colors duration-150 group cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform duration-150">
                    {{ group.letter }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-theme-text group-hover:text-theme-text">
                      {{ group.name }}
                    </h4>
                    <p class="text-sm text-theme-text-secondary">{{ group.members }} members</p>
                  </div>
                </div>
                <router-link :to="`/study-groups/${group.id}`" class="text-primary hover:text-primary-600 font-medium text-sm px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors duration-150">
                  View
                </router-link>
              </div>
            </div>

            <router-link to="/study-groups" class="w-full mt-6 py-3 text-center text-primary hover:text-primary-600 font-medium border-2 border-dashed border-theme-border hover:border-primary-300 rounded-lg hover:bg-primary-50 transition-colors duration-150 block">
              + Join New Group
            </router-link>
          </div>
        </div>

        <!-- AI-Generated Content -->
        <div class="bg-white rounded-lg border border-theme-border p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-r from-theme-success to-teal-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-theme-text">AI-Powered Learning Tools</h2>
                <p class="text-sm text-theme-text-secondary">
                  Create personalized study materials with AI in seconds
                </p>
              </div>
            </div>
            <router-link
              to="/ai-content-generator"
              class="px-6 py-3 bg-gradient-to-r from-theme-success to-teal-600 hover:from-theme-success hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-150 hover:shadow-md flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Try AI Generator
            </router-link>
          </div>

          <div v-if="aiContentLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-success mx-auto mb-4"></div>
            <p class="text-theme-text-secondary">Loading AI content...</p>
              </div>

          <div v-else-if="aiContent.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-r from-theme-success-50 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-theme-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-theme-text mb-2">Discover AI-Powered Learning</h3>
            <p class="text-theme-text-secondary mb-6">Transform any topic into interactive study materials with our advanced AI. Create notes, flashcards, quizzes, and summaries in seconds!</p>
            <router-link
              to="/ai-content-generator"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-theme-success to-teal-600 hover:from-theme-success hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-150 hover:shadow-md"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Creating with AI
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- AI Content Preview Cards -->
            <router-link
              to="/ai-content-generator"
              class="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 transition-all duration-150 hover:shadow-lg cursor-pointer border border-blue-200 hover:border-blue-300 block"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-150">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-gray-800">Interactive Study Notes</h4>
                    <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">Note</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">AI-generated comprehensive notes with key concepts, examples, and visual aids</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-xs text-blue-600">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Auto-generated • Smart formatting</span>
                    </div>
                    <span class="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                      Try Now →
                    </span>
                  </div>
                </div>
              </div>
            </router-link>

            <router-link
              to="/ai-content-generator"
              class="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 transition-all duration-150 hover:shadow-lg cursor-pointer border border-green-200 hover:border-green-300 block"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-150">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-gray-800">Smart Flashcards</h4>
                    <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">Flashcard</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">Personalized flashcards with spaced repetition and difficulty adaptation</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-xs text-green-600">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Adaptive learning • Memory optimization</span>
                    </div>
                    <span class="text-xs font-medium text-green-600 group-hover:text-green-700 transition-colors">
                      Try Now →
                    </span>
                  </div>
                </div>
              </div>
            </router-link>

            <router-link
              to="/ai-content-generator"
              class="group bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 transition-all duration-150 hover:shadow-lg cursor-pointer border border-purple-200 hover:border-purple-300 block"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg shadow-sm flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-150">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-gray-800">Dynamic Quizzes</h4>
                    <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">Quiz</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">AI-generated quizzes with multiple question types and instant feedback</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-xs text-purple-600">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Multiple formats • Instant feedback</span>
                    </div>
                    <span class="text-xs font-medium text-purple-600 group-hover:text-purple-700 transition-colors">
                      Try Now →
                    </span>
                  </div>
                </div>
              </div>
            </router-link>

            <router-link
              to="/ai-content-generator"
              class="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 transition-all duration-150 hover:shadow-lg cursor-pointer border border-orange-200 hover:border-orange-300 block"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-sm flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-150">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-gray-800">Study Summaries</h4>
                    <span class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">Summary</span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">Quick summaries with key points, timelines, and concept maps</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-xs text-orange-600">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Quick review • Visual learning</span>
                    </div>
                    <span class="text-xs font-medium text-orange-600 group-hover:text-orange-700 transition-colors">
                      Try Now →
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Floating Action Button -->
        <div class="fixed bottom-6 right-6 z-50">
          <button class="group bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-105">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-semibold hidden group-hover:block">Create</span>
            </div>
          </button>
        </div>
      </div>
    </main>
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
import { aiContentService } from '@/service/AIContentService'

const authStore = useAuthStore()
const router = useRouter()
const gamification = useGamificationStore()
const dashboardStore = useDashboardStore()
const groupStore = useGroupStore()
const unifiedContentStore = useUnifiedContentStore()

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
onMounted(() => {
  if (!authStore.token) {
    router.push('/login')
  }
  console.log('user from store:', authStore.user)
})

// ดึง username จาก store
const username = computed(() => {
  return authStore.user?.username || authStore.user?.email || 'Student'
})

// Avatar
const userAvatarUrl = computed(() => authStore.currentUserAvatar)
const avatarKey = computed(() => authStore.user?.avatarRotation || 0)

// Study stats - ใช้ข้อมูลจาก dashboard store พร้อม fallback
const studyStreak = computed(() => dashboardStore.stats.studyStreak || 0)
const focusTime = computed(() => dashboardStore.stats.focusTime || { hours: 0, minutes: 0 })
const flashcardsReviewed = computed(() => dashboardStore.stats.flashcardsReviewed || 0)
const lastReviewTime = computed(() => dashboardStore.stats.lastReviewTime || 'No recent activity')
const pomodorosToday = computed(() => gamification.pomodorosToday)

// Study progress data (for chart) - ใช้ข้อมูลจาก dashboard store พร้อม fallback
const studyHoursData = computed(() => {
  if (dashboardStore.studyHours.length > 0) {
    return dashboardStore.studyHours
  }

  // Fallback mock data สำหรับ chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    hours: Math.floor(Math.random() * 4) + 1
  }))
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

// Learning progress - ใช้ข้อมูลจาก dashboard store พร้อม fallback
const learningProgress = computed(() => {
  if (dashboardStore.learningProgress.length > 0) {
    return dashboardStore.learningProgress
  }

  // Fallback mock data
  return [
    { id: 1, subject: 'Mathematics', progress: 75, daysLeft: 15 },
    { id: 2, subject: 'Science', progress: 60, daysLeft: 20 },
    { id: 3, subject: 'English', progress: 90, daysLeft: 5 }
  ]
})

// AI-generated content - ใช้ข้อมูลจริงจาก AI Content Service
const aiContent = computed(() => {
  // ใช้ข้อมูลจาก aiContentList ก่อน ถ้าไม่มีค่อยใช้จาก unifiedContentStore
  const sourceList = aiContentList.value.length > 0 ? aiContentList.value : unifiedContentStore.contentBySource('ai')

  if (sourceList.length > 0) {
    return sourceList.slice(0, 4).map(content => {
      const daysAgo = Math.floor((Date.now() - new Date(content.createdAt).getTime()) / (1000 * 60 * 60 * 24))

      // Handle different content types
      const isAIContent = 'contentTitle' in content
      const isUnifiedContent = 'title' in content

      return {
        id: typeof content.id === 'number' ? content.id : parseInt(content.id?.toString().split('-').pop() || '0'),
        title: isAIContent ? content.contentTitle : (isUnifiedContent ? content.title : 'Untitled'),
        daysAgo: daysAgo,
        type: isAIContent ? content.contentType : (isUnifiedContent ? content.contentType : 'note'),
        subject: isUnifiedContent ? (content.subject || 'General') : 'General',
        difficulty: isUnifiedContent ? (content.difficulty || 'Medium') : 'Medium'
      }
    })
  }

  // ถ้าไม่มี AI content จริง ให้แสดง empty state
  return []
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

const hasError = computed(() =>
  dashboardStore.error || groupStore.error || unifiedContentStore.error
)

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
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
