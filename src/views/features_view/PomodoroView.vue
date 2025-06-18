<style scoped>
/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
  animation-delay: 4s;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Transitions */
.history-list-enter-active,
.history-list-leave-active {
  transition: all 0.3s ease;
}

.history-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.history-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

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

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Enhanced focus states */
input:focus,
button:focus {
  outline: none;
}

/* Circle animation */
circle {
  transition: stroke-dashoffset 1s ease-out;
}

/* Pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Toggle switch styles */
input[type='checkbox']:checked + div {
  background-color: #8b5cf6;
}
</style>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-delayed"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-green-200/10 to-emerald-200/10 rounded-full blur-3xl animate-float-slow"
      ></div>
    </div>

    <!-- Sync Status Bar -->
    <div
      class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-white/50 z-40"
    >
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div
              :class="
                syncStatus === 'synced'
                  ? 'w-2 h-2 bg-green-500 rounded-full'
                  : syncStatus === 'syncing'
                    ? 'w-2 h-2 bg-yellow-500 rounded-full animate-pulse'
                    : 'w-2 h-2 bg-red-500 rounded-full'
              "
            ></div>
            <span class="text-sm text-gray-600">
              {{
                syncStatus === 'synced'
                  ? 'All changes saved'
                  : syncStatus === 'syncing'
                    ? 'Saving...'
                    : 'Offline mode'
              }}
            </span>
          </div>
          <span class="text-xs text-gray-500">Last saved: {{ lastSaveTime }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="exportData"
            class="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Export
          </button>
          <button
            @click="showImportDialog = true"
            class="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import
          </button>
        </div>
      </div>
    </div>

    <main class="relative z-10 p-6 pt-20">
      <div class="max-w-6xl mx-auto space-y-8">
        <!-- Enhanced Header with Daily Goal -->
        <div class="text-center mb-12">
          <div class="flex justify-center mb-6">
            <div
              class="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-10 h-10 text-white"
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
          </div>
          <h1
            class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 bg-clip-text text-transparent mb-3"
          >
            Pomodoro Timer
          </h1>
          <p class="text-gray-600 text-lg">Stay focused, take breaks, achieve more</p>

          <!-- Daily Goal Progress -->
          <div class="mt-8 max-w-md mx-auto">
            <div
              class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-700">Today's Goal</h3>
                <button
                  @click="showGoalSettings = true"
                  class="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Edit Goal
                </button>
              </div>
              <div class="relative">
                <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                    :style="`width: ${dailyProgress}%`"
                  ></div>
                </div>
                <div class="mt-2 flex justify-between text-xs text-gray-600">
                  <span>{{ todayCompletedPomodoros }} completed</span>
                  <span>{{ dailyGoal }} goal</span>
                </div>
              </div>
              <div v-if="dailyProgress >= 100" class="mt-3 text-center">
                <span class="text-sm font-semibold text-green-600">🎉 Goal achieved!</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Timer Card -->
          <div class="lg:col-span-2">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
            >
              <!-- Background Pattern -->
              <div class="absolute inset-0" :style="backgroundPatternStyle"></div>

              <div class="text-center space-y-8 relative">
                <!-- Timer Type Header with Animation -->
                <div class="space-y-2">
                  <div class="flex items-center justify-center gap-3">
                    <div
                      :class="
                        timerType === 'focus'
                          ? 'w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse'
                          : 'w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse'
                      "
                    ></div>
                    <h2 class="text-2xl font-bold text-gray-800">
                      {{
                        timerType === 'focus'
                          ? 'Focus Time'
                          : completedPomodoros % longBreakInterval === 0
                            ? 'Long Break'
                            : 'Short Break'
                      }}
                    </h2>
                  </div>
                  <p class="text-gray-600">
                    {{
                      timerType === 'focus'
                        ? 'Time to concentrate and get things done'
                        : 'Take a well-deserved break'
                    }}
                  </p>
                </div>

                <!-- Session Tag Input with Suggestions -->
                <div v-if="!isRunning && !isPaused" class="max-w-md mx-auto">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Session Tag</label>
                  <div class="relative">
                    <input
                      v-model="currentTag"
                      @focus="showTagSuggestions = true"
                      @blur="hideSuggestions"
                      type="text"
                      placeholder="Enter task name or subject..."
                      class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />

                    <!-- Tag Suggestions Dropdown -->
                    <div
                      v-if="showTagSuggestions && recentTags.length > 0"
                      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                    >
                      <div class="p-2">
                        <p class="text-xs text-gray-500 px-3 py-1">Recent tags</p>
                        <button
                          v-for="tag in recentTags"
                          :key="tag"
                          @mousedown="selectTag(tag)"
                          class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                        >
                          {{ tag }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Duration Selection -->
                <div
                  v-if="!isRunning && !isPaused && timerType === 'focus'"
                  class="max-w-md mx-auto"
                >
                  <label class="block text-sm font-medium text-gray-700 mb-3"
                    >Select Duration</label
                  >
                  <div class="grid grid-cols-4 gap-2 mb-3">
                    <button
                      v-for="preset in presetDurations"
                      :key="preset"
                      @click="setDuration(preset)"
                      :class="
                        selectedDuration === preset
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                          : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-md'
                      "
                      class="px-4 py-3 rounded-xl font-medium transition-all duration-200"
                    >
                      {{ preset }}m
                    </button>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <input
                        v-model.number="customDuration"
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Custom minutes"
                        class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-gray-400 text-sm">min</span>
                      </div>
                    </div>
                    <button
                      @click="setCustomDuration"
                      :disabled="!customDuration || customDuration < 1 || customDuration > 120"
                      class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Set
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">1-120 minutes allowed</p>
                </div>

                <!-- Enhanced Circular Progress -->
                <div class="relative w-80 h-80 mx-auto">
                  <!-- Decorative Rings -->
                  <div
                    class="absolute inset-0 rounded-full border-2 border-gray-100 opacity-20"
                  ></div>
                  <div
                    class="absolute inset-4 rounded-full border-2 border-gray-100 opacity-15"
                  ></div>
                  <div
                    class="absolute inset-8 rounded-full border-2 border-gray-100 opacity-10"
                  ></div>

                  <!-- Main Progress Circle -->
                  <svg class="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      class="text-gray-200"
                    />
                    <!-- Progress Circle with Gradient -->
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          :style="`stop-color: ${timerType === 'focus' ? '#8B5CF6' : '#10B981'}`"
                        />
                        <stop
                          offset="100%"
                          :style="`stop-color: ${timerType === 'focus' ? '#6366F1' : '#059669'}`"
                        />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#progressGradient)"
                      stroke-width="4"
                      fill="none"
                      stroke-linecap="round"
                      :stroke-dasharray="282.6"
                      :stroke-dashoffset="282.6 - (282.6 * progressPercentage) / 100"
                      class="transition-all duration-1000 ease-out filter drop-shadow-lg"
                    />
                  </svg>

                  <!-- Timer Display -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      class="text-7xl font-bold mb-2 transition-all duration-300"
                      :class="timerType === 'focus' ? 'text-purple-600' : 'text-green-600'"
                    >
                      {{ formattedTime }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div :class="isRunning ? 'animate-pulse' : ''" class="text-gray-500 text-lg">
                        {{ statusText }}
                      </div>
                      <div v-if="isRunning" class="flex gap-1">
                        <div
                          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style="animation-delay: 0ms"
                        ></div>
                        <div
                          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style="animation-delay: 150ms"
                        ></div>
                        <div
                          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style="animation-delay: 300ms"
                        ></div>
                      </div>
                    </div>
                    <div
                      v-if="currentTag && (isRunning || isPaused)"
                      class="text-gray-600 text-sm mt-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {{ currentTag }}
                    </div>
                  </div>
                </div>

                <!-- Enhanced Controls with Tooltips -->
                <div class="flex justify-center gap-4">
                  <button
                    v-if="!isRunning && !isPaused"
                    @click="startTimer"
                    class="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Start Timer
                    <span
                      class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                      Space key
                    </span>
                  </button>

                  <button
                    v-if="isRunning"
                    @click="pauseTimer"
                    class="group relative px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 9v6m4-6v6"
                      />
                    </svg>
                    Pause
                    <span
                      class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                      Space key
                    </span>
                  </button>

                  <button
                    v-if="isPaused"
                    @click="resumeTimer"
                    class="group relative px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                    Resume
                    <span
                      class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                      Space key
                    </span>
                  </button>

                  <button
                    v-if="isRunning || isPaused"
                    @click="stopTimer"
                    class="group relative px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 10h6v4H9z"
                      />
                    </svg>
                    Stop
                    <span
                      class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                      S key
                    </span>
                  </button>

                  <button
                    @click="resetTimer"
                    class="group relative px-10 py-4 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-2xl text-gray-700 font-semibold transition-all duration-300 hover:shadow-xl flex items-center gap-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reset
                    <span
                      class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                      R key
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Enhanced History Log Section -->
            <div
              class="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
            >
              <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Session History</h2>
                      <p class="text-indigo-100 text-sm">Your productivity journey</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="showHistoryFilter = !showHistoryFilter"
                      class="text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      Filter
                    </button>
                    <button
                      v-if="historyLog.length > 0"
                      @click="clearHistory"
                      class="text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <!-- Filter Options -->
              <div v-if="showHistoryFilter" class="p-4 bg-gray-50 border-b border-gray-200">
                <div class="flex items-center gap-4">
                  <select
                    v-model="historyFilter"
                    class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Sessions</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <input
                    v-model="historySearch"
                    type="text"
                    placeholder="Search tags..."
                    class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div class="p-6">
                <div v-if="filteredHistory.length === 0" class="text-center py-12">
                  <div
                    class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      class="w-12 h-12 text-gray-400"
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
                  <p class="text-gray-500 text-lg font-medium mb-2">No sessions found</p>
                  <p class="text-gray-400 text-sm">
                    Start your first Pomodoro to see your history here
                  </p>
                </div>

                <div v-else class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  <TransitionGroup name="history-list">
                    <div
                      v-for="(session, index) in filteredHistory"
                      :key="`${session.startTimestamp}-${index}`"
                      class="group bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-indigo-50 rounded-xl p-4 border border-gray-200 hover:border-purple-200 transition-all duration-300 cursor-pointer"
                      @click="showSessionDetails(session)"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div
                            :class="
                              session.type === 'focus'
                                ? 'w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center'
                                : 'w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center'
                            "
                          >
                            <svg
                              v-if="session.type === 'focus'"
                              class="w-5 h-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <svg
                              v-else
                              class="w-5 h-5 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p
                              class="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors"
                            >
                              {{ session.tag || 'Untitled Session' }}
                            </p>
                            <p class="text-sm text-gray-600">
                              {{ formatDate(session.startTimestamp) }} •
                              {{ session.duration }} minutes
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-gray-700">
                            {{ formatTime(session.startTimestamp) }} -
                            {{ formatTime(session.endTimestamp) }}
                          </p>
                          <p class="text-xs text-gray-500 capitalize">{{ session.type }}</p>
                        </div>
                      </div>
                    </div>
                  </TransitionGroup>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats & Settings Sidebar -->
          <div class="space-y-6">
            <!-- Enhanced Stats Card -->
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
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
                <h2 class="text-xl font-bold text-gray-900">Session Stats</h2>
              </div>

              <div class="space-y-4">
                <div
                  class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Completed Pomodoros</p>
                      <p class="text-3xl font-bold text-purple-600">
                        {{ calculatedStats.completedPomodoros }}
                      </p>
                      <p class="text-xs text-purple-500 mt-1">
                        {{ todayCompletedPomodoros }} today
                      </p>
                    </div>
                    <div
                      class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform"
                    >
                      <svg
                        class="w-7 h-7 text-purple-600"
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
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Total Focus Time</p>
                      <p class="text-3xl font-bold text-blue-600">
                        {{ Math.floor(calculatedStats.totalFocusTime / 60) }}h
                        {{ calculatedStats.totalFocusTime % 60 }}m
                      </p>
                      <p class="text-xs text-blue-500 mt-1">{{ todayFocusTime }}m today</p>
                    </div>
                    <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        class="w-7 h-7 text-blue-600"
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
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:shadow-md transition-all duration-300"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-600">Current Streak</p>
                      <p class="text-3xl font-bold text-green-600">{{ currentStreak }} days</p>
                      <p class="text-xs text-green-500 mt-1">Best: {{ bestStreak }} days</p>
                    </div>
                    <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        class="w-7 h-7 text-green-600"
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
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Settings Card -->
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg"
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Settings</h2>
              </div>

              <div class="space-y-4">
                <!-- Notification Settings -->
                <div class="pb-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3">Notifications</h3>
                  <div class="space-y-3">
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-sm text-gray-600">Sound notifications</span>
                      <input v-model="soundEnabled" type="checkbox" class="sr-only peer" />
                      <div
                        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                      ></div>
                    </label>
                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-sm text-gray-600">Visual alerts</span>
                      <input v-model="alertEnabled" type="checkbox" class="sr-only peer" />
                      <div
                        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                      ></div>
                    </label>
                  </div>
                </div>

                <!-- Timer Settings -->
                <div class="space-y-3">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3">Timer Settings</h3>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2"
                      >Focus Time (minutes)</label
                    >
                    <div class="relative">
                      <input
                        v-model="focusTime"
                        type="number"
                        min="1"
                        max="60"
                        class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          class="w-5 h-5 text-gray-400"
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
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2"
                      >Short Break (minutes)</label
                    >
                    <div class="relative">
                      <input
                        v-model="breakTime"
                        type="number"
                        min="1"
                        max="30"
                        class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2"
                      >Long Break (minutes)</label
                    >
                    <div class="relative">
                      <input
                        v-model="longBreakTime"
                        type="number"
                        min="1"
                        max="60"
                        class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          class="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2"
                      >Long Break After</label
                    >
                    <div class="relative">
                      <input
                        v-model="longBreakInterval"
                        type="number"
                        min="1"
                        max="10"
                        class="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-sm text-gray-400">pomodoros</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Alert Modal with Enhanced Design -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAlert"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300"
          >
            <div class="text-center">
              <div
                class="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow"
              >
                <svg
                  class="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">{{ alertTitle }}</h3>
              <p class="text-gray-600 text-lg mb-8">{{ alertMessage }}</p>
              <div class="flex gap-4 justify-center">
                <button
                  @click="dismissAlert"
                  class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Continue
                </button>
                <button
                  v-if="timerType === 'break'"
                  @click="skipBreak"
                  class="px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold transition-all duration-200 hover:shadow-md"
                >
                  Skip Break
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Goal Settings Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showGoalSettings"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Daily Goal Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Daily Pomodoro Goal</label
                >
                <input
                  v-model.number="dailyGoal"
                  type="number"
                  min="1"
                  max="20"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div class="flex gap-4 pt-4">
                <button
                  @click="saveGoalSettings"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Save
                </button>
                <button
                  @click="showGoalSettings = false"
                  class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Session Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedSession"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="selectedSession = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" @click.stop>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Session Details</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600">Task</p>
                <p class="text-lg font-semibold text-gray-800">
                  {{ selectedSession.tag || 'Untitled Session' }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Date</p>
                  <p class="text-lg font-semibold text-gray-800">
                    {{ formatFullDate(selectedSession.startTimestamp) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Duration</p>
                  <p class="text-lg font-semibold text-gray-800">
                    {{ selectedSession.duration }} minutes
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Start Time</p>
                  <p class="text-lg font-semibold text-gray-800">
                    {{ formatTime(selectedSession.startTimestamp) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">End Time</p>
                  <p class="text-lg font-semibold text-gray-800">
                    {{ formatTime(selectedSession.endTimestamp) }}
                  </p>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600">Type</p>
                <p
                  class="text-lg font-semibold capitalize"
                  :class="selectedSession.type === 'focus' ? 'text-purple-600' : 'text-green-600'"
                >
                  {{ selectedSession.type }}
                </p>
              </div>
              <button
                @click="selectedSession = null"
                class="w-full mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Import Dialog -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showImportDialog"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Import Data</h3>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Select a JSON file to import your Pomodoro history and settings.
              </p>
              <input
                type="file"
                accept=".json"
                @change="handleImport"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <button
                @click="showImportDialog = false"
                class="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'

// === Type Definitions ===
interface SessionLog {
  tag: string
  startTimestamp: number
  endTimestamp: number
  duration: number
  type: 'focus' | 'break'
}

// === Timer State ===
const totalSeconds = ref(25 * 60)
const isRunning = ref(false)
const isPaused = ref(false)
const isStopped = ref(true)
const timerType = ref<'focus' | 'break'>('focus')
const intervalId = ref<number>()

// === Session Data ===
const currentTag = ref('')
const sessionStartTime = ref<number | null>(null)
const completedPomodoros = ref(0)

// === Duration Settings ===
const presetDurations = [25, 50, 75]
const selectedDuration = ref(25)
const customDuration = ref<number | null>(null)
const focusTime = ref(25)
const breakTime = ref(5)
const longBreakTime = ref(15)
const longBreakInterval = ref(4)

// === UI & Persistence State ===
const showTagSuggestions = ref(false)
const showAlert = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const alertTimeoutId = ref<number>()
const showHistoryFilter = ref(false)
const historyFilter = ref<'all' | 'today' | 'week' | 'month'>('all')
const historySearch = ref('')
const showGoalSettings = ref(false)
const showImportDialog = ref(false)
const selectedSession = ref<SessionLog | null>(null)

const syncStatus = ref<'synced' | 'syncing' | 'offline'>('synced')
const lastSaveTime = ref('Just now')
const autoSaveInterval = ref<number>()

const dailyGoal = ref(8)
const currentStreak = ref(0)
const bestStreak = ref(0)

const soundEnabled = ref(true)
const alertEnabled = ref(true)

// === History Log ===
const historyLog = ref<SessionLog[]>([])

// === Computed Properties ===
const formattedTime = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
    .toString()
    .padStart(2, '0')
  const s = (totalSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const progressPercentage = computed(() => {
  const totalTime =
    timerType.value === 'focus'
      ? selectedDuration.value * 60
      : completedPomodoros.value % longBreakInterval.value === 0
        ? longBreakTime.value * 60
        : breakTime.value * 60
  return (totalSeconds.value / totalTime) * 100
})

const statusText = computed(() => {
  if (isRunning.value) return 'Running'
  if (isPaused.value) return 'Paused'
  return 'Ready'
})

const calculatedStats = computed(() => {
  const focusSessions = historyLog.value.filter((s) => s.type === 'focus')
  return {
    completedPomodoros: focusSessions.length,
    totalFocusTime: focusSessions.reduce((sum, s) => sum + s.duration, 0),
  }
})

const todayCompletedPomodoros = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return historyLog.value.filter((s) => s.type === 'focus' && s.startTimestamp >= today.getTime())
    .length
})

const todayFocusTime = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return historyLog.value
    .filter((s) => s.type === 'focus' && s.startTimestamp >= today.getTime())
    .reduce((sum, s) => sum + s.duration, 0)
})

const dailyProgress = computed(() =>
  Math.min((todayCompletedPomodoros.value / dailyGoal.value) * 100, 100),
)

const recentTags = computed(() => {
  const tags = historyLog.value.map((s) => s.tag).filter(Boolean)
  return Array.from(new Set(tags)).slice(0, 5)
})

const filteredHistory = computed(() => {
  let filtered = [...historyLog.value]
  const now = new Date()

  if (historyFilter.value === 'today') {
    const dayStart = new Date(now)
    dayStart.setHours(0, 0, 0, 0)
    filtered = filtered.filter((s) => s.startTimestamp >= dayStart.getTime())
  } else if (historyFilter.value === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filtered = filtered.filter((s) => s.startTimestamp >= weekAgo.getTime())
  } else if (historyFilter.value === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    filtered = filtered.filter((s) => s.startTimestamp >= monthAgo.getTime())
  }

  if (historySearch.value) {
    filtered = filtered.filter((s) =>
      s.tag.toLowerCase().includes(historySearch.value.toLowerCase()),
    )
  }

  return filtered
})

// === Lifecycle Hooks ===
onMounted(() => {
  loadData()
  calculateStreaks()

  document.addEventListener('keydown', handleKeyboard)

  autoSaveInterval.value = window.setInterval(() => saveData(), 30_000)

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadData()
  })
})

onBeforeUnmount(() => {
  if (intervalId.value) clearInterval(intervalId.value)
  if (alertTimeoutId.value) clearTimeout(alertTimeoutId.value)
  if (autoSaveInterval.value) clearInterval(autoSaveInterval.value)
  document.removeEventListener('keydown', handleKeyboard)
})

// === Static background pattern style ===
const backgroundPatternStyle = {
  backgroundImage:
    'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
}

// Persistence & sync
function loadData() {
  /* TODO: implement */
}
function saveData() {
  /* TODO: implement */
}
function calculateStreaks() {
  /* TODO: implement */
}

// Timer controls
function startTimer() {
  isRunning.value = true
  isPaused.value = false
  isStopped.value = false
  sessionStartTime.value = Date.now()
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  intervalId.value = window.setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--
    } else {
      onTimerEnd()
    }
  }, 1000)
}
function pauseTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  if (isRunning.value) {
    isRunning.value = false
    isPaused.value = true
  }
}
function resumeTimer() {
  isRunning.value = true
  isPaused.value = false
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  intervalId.value = window.setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--
    } else {
      onTimerEnd()
    }
  }, 1000)
}
function stopTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  isRunning.value = false
  isPaused.value = false
  isStopped.value = true
}
function resetTimer() {
  stopTimer()
  totalSeconds.value = selectedDuration.value * 60
}

// Tag helpers
function hideSuggestions() {
  showTagSuggestions.value = false
}
function selectTag(tag: string) {
  currentTag.value = tag
  showTagSuggestions.value = false
}

// Duration helpers
function setDuration(min: number) {
  selectedDuration.value = min
  totalSeconds.value = min * 60
}
function setCustomDuration() {
  if (customDuration.value && customDuration.value > 0) {
    selectedDuration.value = customDuration.value
    totalSeconds.value = customDuration.value * 60
    customDuration.value = null
  }
}

// Export / Import
function exportData() {
  const data = {
    historyLog: historyLog.value,
    focusTime: focusTime.value,
    breakTime: breakTime.value,
    longBreakTime: longBreakTime.value,
    longBreakInterval: longBreakInterval.value,
    dailyGoal: dailyGoal.value,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string)
      if (parsed.historyLog) historyLog.value = parsed.historyLog
      if (typeof parsed.focusTime === 'number') focusTime.value = parsed.focusTime
      if (typeof parsed.breakTime === 'number') breakTime.value = parsed.breakTime
      if (typeof parsed.longBreakTime === 'number') longBreakTime.value = parsed.longBreakTime
      if (typeof parsed.longBreakInterval === 'number')
        longBreakInterval.value = parsed.longBreakInterval
      if (typeof parsed.dailyGoal === 'number') dailyGoal.value = parsed.dailyGoal
      alert('Import successful')
    } catch (err) {
      console.error(err)
      alert('Invalid file')
    }
  }
  reader.readAsText(file)
}

// Alerts & Modals
function dismissAlert() {
  showAlert.value = false
}
function skipBreak() {
  stopTimer()
}

function onTimerEnd() {
  // stop interval
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  isRunning.value = false
  isPaused.value = false
  isStopped.value = true

  // play sound
  if (soundEnabled.value) {
    playNotificationSound()
  }

  // show visual alert
  alertTitle.value = timerType.value === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!'
  alertMessage.value =
    timerType.value === 'focus'
      ? 'Great job! Time for a well-deserved break.'
      : 'Ready to focus again?'
  showAlert.value = true
  if (alertTimeoutId.value) {
    clearTimeout(alertTimeoutId.value)
  }
  alertTimeoutId.value = window.setTimeout(() => dismissAlert(), 30000)

  // record history event
  if (sessionStartTime.value) {
    historyLog.value.unshift({
      tag: currentTag.value || 'Untitled Session',
      startTimestamp: sessionStartTime.value,
      endTimestamp: Date.now(),
      duration: Math.ceil((Date.now() - sessionStartTime.value) / 1000 / 60),
      type: timerType.value,
    })
  }
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.frequency.value = 800
    gainNode.gain.value = 0.3

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)

    setTimeout(() => {
      const osc2 = audioCtx.createOscillator()
      const gain2 = audioCtx.createGain()
      osc2.connect(gain2)
      gain2.connect(audioCtx.destination)
      osc2.frequency.value = 1000
      gain2.gain.value = 0.3
      osc2.start()
      osc2.stop(audioCtx.currentTime + 0.2)
    }, 300)
  } catch (error) {
    console.error('Error playing notification sound:', error)
  }
}
function clearHistory() {
  historyLog.value = []
}
function showSessionDetails(session: SessionLog) {
  selectedSession.value = session
}
function saveGoalSettings() {
  showGoalSettings.value = false
  saveData()
}

// Keyboard shortcuts
function handleKeyboard(e: KeyboardEvent) {
  if (e.code === 'Space') {
    if (!isRunning.value && !isPaused.value) startTimer()
    else if (isRunning.value) pauseTimer()
    else if (isPaused.value) resumeTimer()
    e.preventDefault()
  } else if (e.key.toLowerCase() === 's') {
    stopTimer()
  } else if (e.key.toLowerCase() === 'r') {
    resetTimer()
  }
}

// Formatting helpers
function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString()
}
function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function formatFullDate(ts: number) {
  return new Date(ts).toLocaleString()
}

// Save when history changes
watch(historyLog, () => saveData(), { deep: true })
</script>
