import { ref, computed, onMounted, onUnmounted, readonly } from 'vue';
import { useAuthStore } from '@/stores/auth';
import studyStreakService, { type StreakStatus } from '@/services/StudyStreakService';

export interface UseStudyStreakOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  userId?: number;
}

export function useStudyStreak(options: UseStudyStreakOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    userId: propUserId
  } = options;

  // Reactive state
  const loading = ref(false);
  const error = ref<string | null>(null);
  const streakData = ref<StreakStatus | null>(null);

  // Auth store
  const authStore = useAuthStore();

  // Computed
  const currentUserId = computed(() => {
    return propUserId || authStore.user?.id;
  });

  // Auto-refresh setup
  let refreshIntervalId: number | null = null;

  // Methods
  const loadStreakData = async () => {
    if (!currentUserId.value) {
      error.value = 'User ID not available';
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      console.log('🔥 Loading streak data for user:', currentUserId.value);
      const data = await studyStreakService.getStreakStatus(currentUserId.value);
      streakData.value = data;

      console.log('✅ Streak data loaded:', data);
    } catch (err: unknown) {
      console.error('❌ Failed to load streak data:', err);
      const errorMessage = (err as { message?: string }).message || 'Failed to load streak data';

      // Handle specific error cases
      if (errorMessage.includes('Access denied')) {
        error.value = 'You do not have permission to view streak data';
      } else if (errorMessage.includes('Study Streak service is temporarily unavailable')) {
        error.value = 'Study Streak feature is under development. Please check back later.';
      } else if (errorMessage.includes('Network error')) {
        error.value = 'Connection error. Please check your internet connection.';
      } else {
        error.value = errorMessage;
      }

      streakData.value = null;
    } finally {
      loading.value = false;
    }
  };

  const completeTask = async (
    taskType: 'CREATED_CONTENT' | 'INTERACTIVE_MODE',
    contentId: number,
    metadata?: string
  ) => {
    if (!currentUserId.value) {
      throw new Error('User ID not available');
    }

    try {
      error.value = null;
      const result = await studyStreakService.completeDailyTask(
        currentUserId.value,
        taskType,
        contentId,
        metadata
      );

      // Update local state
      if (streakData.value) {
        streakData.value = {
          ...streakData.value,
          streakCount: result.streakCount,
          freezingCount: result.freezingCount,
          hasCompletedToday: true,
          lastActivityTime: result.lastActivityTime
        };
      }

      return result;
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Failed to complete task';
      error.value = errorMessage;
      throw err;
    }
  };

  const refreshStreak = async () => {
    await loadStreakData();
  };

  const setupAutoRefresh = () => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalId = window.setInterval(() => {
        if (!loading.value) {
          loadStreakData();
        }
      }, refreshInterval);
    }
  };

  const clearAutoRefresh = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  };

  // Lifecycle
  onMounted(() => {
    loadStreakData();
    setupAutoRefresh();
  });

  onUnmounted(() => {
    clearAutoRefresh();
  });

  return {
    // State
    loading: readonly(loading),
    error: readonly(error),
    streakData: readonly(streakData),

    // Computed
    currentUserId,

    // Methods
    loadStreakData,
    completeTask,
    refreshStreak
  };
}
