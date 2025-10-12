<template>
  <div class="study-streak-widget bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
        </svg>
        Study Streak
      </h3>
      <button
        @click="refreshStreak"
        :disabled="streakStore.loading"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        :class="{ 'animate-spin': streakStore.loading }"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="streakStore.loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="streakStore.error" class="text-center py-4">
      <div class="text-red-500 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-red-600 text-sm">{{ streakStore.error }}</p>
      <button
        @click="loadStreakData"
        class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Try Again
      </button>
    </div>

    <!-- Streak Data -->
    <div v-else-if="streakStore.streakData" class="space-y-3">
      <!-- Streak Count -->
      <div class="text-center">
        <div class="text-3xl font-bold text-orange-600 mb-1">
          {{ streakStore.streakData.streakCount }}
        </div>
        <div class="text-sm text-gray-600">day streak</div>
      </div>

      <!-- Today's Status -->
      <div class="flex items-center justify-center">
        <div
          v-if="streakStore.streakData.hasCompletedToday"
          class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-full text-sm"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Completed today!
        </div>
        <div
          v-else
          class="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-full text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Complete a task to maintain your streak
        </div>
      </div>

      <!-- Freezing Count Warning -->
      <div v-if="streakStore.streakData.freezingCount > 0" class="text-center">
        <div class="flex items-center justify-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-full text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ streakStore.streakData.freezingCount }} missed day{{ streakStore.streakData.freezingCount > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Status Message -->
      <div v-if="streakStore.streakData.statusMessage" class="text-center">
        <p class="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          {{ streakStore.streakData.statusMessage }}
        </p>
      </div>

      <!-- Motivational Quote -->
      <div v-if="streakStore.streakData.motivationalQuote" class="text-center">
        <div class="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          {{ streakStore.streakData.motivationalQuote }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-4">
        <div class="flex justify-between text-xs text-gray-600 mb-1">
          <span>Weekly Progress</span>
          <span>{{ Math.min(streakStore.streakData.streakCount % 7, 7) }}/7</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-orange-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((streakStore.streakData.streakCount % 7) * 14.28, 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- Last Activity -->
      <div class="text-center text-xs text-gray-500">
        Last activity: {{ formatLastActivity(streakStore.streakData.lastActivityTime) }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-4">
      <div class="text-gray-400 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p class="text-gray-600 text-sm">No streak data available</p>
      <button
        @click="loadStreakData"
        class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Load Streak Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useStudyStreakStore } from '@/stores/studyStreak';

// Props
interface Props {
  userId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
  autoRefresh: true,
  refreshInterval: 30000
});

// Use the store
const streakStore = useStudyStreakStore();

// Auto-refresh setup
let refreshIntervalId: number | null = null;

const setupAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshIntervalId = window.setInterval(() => {
      if (!streakStore.loading) {
        streakStore.refreshStreak(props.userId);
      }
    }, props.refreshInterval);
  }
};

const clearAutoRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
};

const refreshStreak = async () => {
  await streakStore.refreshStreak(props.userId);
};

const loadStreakData = async () => {
  await streakStore.loadStreakData(props.userId);
};

// Lifecycle
onMounted(() => {
  console.log('🔥 StudyStreakWidget: Component mounted, loading streak data');
  loadStreakData();
  setupAutoRefresh();
});

onUnmounted(() => {
  clearAutoRefresh();
});

// Utility function
const formatLastActivity = (lastActivityTime: string | null): string => {
  if (!lastActivityTime) return 'Never';

  try {
    const date = new Date(lastActivityTime);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  } catch {
    return 'Unknown';
  }
};

// Expose methods for parent components
defineExpose({
  refreshStreak,
  loadStreakData
});
</script>

<style scoped>
.study-streak-widget {
  min-height: 200px;
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
