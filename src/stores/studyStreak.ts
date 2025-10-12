import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import studyStreakService, {
  type StreakStatus,
  type TaskCompletionRequest,
  type TaskCompletionResponse
} from '@/services/StudyStreakService';
import { useAuthStore } from './auth';
import { useStreakNotifications } from '@/composables/useStreakNotifications';

export interface StudyStreakState {
  streakData: StreakStatus | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useStudyStreakStore = defineStore('studyStreak', () => {
  // State
  const streakData = ref<StreakStatus | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdate = ref<Date | null>(null);

  // Notification system
  const { showStreakUpdate, showFreezingWarning, showStreakMilestone } = useStreakNotifications();

  // Getters
  const currentStreak = computed(() => streakData.value?.streakCount || 0);
  const freezingCount = computed(() => streakData.value?.freezingCount || 0);
  const hasCompletedToday = computed(() => streakData.value?.hasCompletedToday || false);
  const isStreakActive = computed(() => currentStreak.value > 0);
  const isInDanger = computed(() => freezingCount.value >= 2);
  const statusMessage = computed(() => streakData.value?.statusMessage || '');
  const motivationalQuote = computed(() => streakData.value?.motivationalQuote || null);

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const setError = (value: string | null) => {
    error.value = value;
  };

  const setStreakData = (data: StreakStatus | null) => {
    streakData.value = data;
    lastUpdate.value = data ? new Date() : null;
  };

  /**
   * โหลดข้อมูล streak สำหรับ user ปัจจุบัน
   */
  const loadStreakData = async (userId?: number) => {
    try {
      setLoading(true);
      setError(null);

      const authStore = useAuthStore();
      const targetUserId = userId || authStore.user?.id;

      if (!targetUserId) {
        throw new Error('User ID not available');
      }

      console.log('🔥 StudyStreakStore: Loading streak data for user', targetUserId);

      const data = await studyStreakService.getStreakStatus(targetUserId);
      setStreakData(data);

      console.log('✅ StudyStreakStore: Streak data loaded successfully', data);

      // Show notifications if needed
      if (data.freezingCount > 0) {
        showFreezingWarning(data.freezingCount);
      }

      if (data.motivationalQuote) {
        // You can add motivational quote notification here if needed
      }

      return data;
    } catch (err: unknown) {
      console.error('❌ StudyStreakStore: Failed to load streak data', err);
      const errorMessage = (err as { message?: string }).message || 'Failed to load streak data';

      // จัดการ error message ตามประเภท error
      if (errorMessage.includes('Authentication required')) {
        setError('Please log in to access study streak features');
      } else if (errorMessage.includes('Authentication failed')) {
        setError('Session expired. Please log in again');
      } else if (errorMessage.includes('Access denied')) {
        setError('You do not have permission to access streak data');
      } else if (errorMessage.includes('Study Streak service is temporarily unavailable')) {
        setError('Study Streak feature is under development. Please check back later.');
      } else {
        setError(errorMessage);
      }

      setStreakData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * บันทึกการทำ daily task
   */
  const completeDailyTask = async (request: TaskCompletionRequest, userId?: number) => {
    try {
      setLoading(true);
      setError(null);

      const authStore = useAuthStore();
      const targetUserId = userId || authStore.user?.id;

      if (!targetUserId) {
        throw new Error('User ID not available');
      }

      console.log('🔥 StudyStreakStore: Completing daily task', { targetUserId, request });

      const response = await studyStreakService.completeDailyTask(
        targetUserId,
        request.taskType,
        request.contentId,
        request.metadata
      );
      console.log('🔥 StudyStreakStore: Task completion response', response);

      // อัปเดต local state ด้วยข้อมูลใหม่
      await loadStreakData(targetUserId);
      console.log('🔥 StudyStreakStore: Streak data reloaded', streakData.value);

      // แสดง notifications
      showStreakUpdate(response);
      showStreakMilestone(response.streakCount);

      console.log('✅ StudyStreakStore: Daily task completed successfully', response);
      return response;
    } catch (err: unknown) {
      console.error('❌ StudyStreakStore: Failed to complete daily task', err);
      const errorMessage = (err as { message?: string }).message || 'Failed to complete daily task';

      // จัดการ error message ตามประเภท error
      if (errorMessage.includes('Authentication required')) {
        setError('Please log in to complete daily tasks');
      } else if (errorMessage.includes('Authentication failed')) {
        setError('Session expired. Please log in again');
      } else if (errorMessage.includes('Access denied')) {
        setError('You do not have permission to complete daily tasks');
      } else if (errorMessage.includes('Study Streak service is temporarily unavailable')) {
        setError('Study Streak feature is under development. Please check back later.');
      } else {
        setError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper method สำหรับสร้าง content
   */
  const completeContentCreation = async (contentId: number, metadata?: string, userId?: number) => {
    const request: TaskCompletionRequest = {
      taskType: 'CREATED_CONTENT',
      contentId,
      metadata
    };
    return completeDailyTask(request, userId);
  };

  /**
   * Helper method สำหรับทำ interactive content
   */
  const completeInteractiveMode = async (contentId: number, metadata?: string, userId?: number) => {
    const request: TaskCompletionRequest = {
      taskType: 'INTERACTIVE_MODE',
      contentId,
      metadata
    };
    return completeDailyTask(request, userId);
  };

  /**
   * รีเฟรชข้อมูล streak
   */
  const refreshStreak = async (userId?: number) => {
    return loadStreakData(userId);
  };

  /**
   * รีเซ็ต store state
   */
  const reset = () => {
    setStreakData(null);
    setError(null);
    setLoading(false);
    lastUpdate.value = null;
  };

  /**
   * ตรวจสอบว่า streak data ยังใหม่หรือไม่ (ไม่เกิน 5 นาที)
   */
  const isDataFresh = computed(() => {
    if (!lastUpdate.value) return false;
    const now = new Date();
    const diffInMinutes = (now.getTime() - lastUpdate.value.getTime()) / (1000 * 60);
    return diffInMinutes < 5;
  });

  /**
   * โหลดข้อมูล streak ถ้าข้อมูลยังไม่ใหม่
   */
  const loadIfNeeded = async (userId?: number) => {
    if (!isDataFresh.value || !streakData.value) {
      return loadStreakData(userId);
    }
    return streakData.value;
  };

  return {
    // State
    streakData: readonly(streakData),
    loading: readonly(loading),
    error: readonly(error),
    lastUpdate: readonly(lastUpdate),

    // Getters
    currentStreak,
    freezingCount,
    hasCompletedToday,
    isStreakActive,
    isInDanger,
    statusMessage,
    motivationalQuote,
    isDataFresh,

    // Actions
    loadStreakData,
    completeDailyTask,
    completeContentCreation,
    completeInteractiveMode,
    refreshStreak,
    reset,
    loadIfNeeded,
    setLoading,
    setError,
    setStreakData
  };
});

// Export types
export type StudyStreakStore = ReturnType<typeof useStudyStreakStore>;
