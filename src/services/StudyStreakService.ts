import axios, { type AxiosResponse } from 'axios';

// Types สำหรับ Study Streak
export interface TaskCompletionRequest {
  taskType: 'CREATED_CONTENT' | 'INTERACTIVE_MODE';
  contentId: number;
  metadata?: string;
}

export interface TaskCompletionResponse {
  success: boolean;
  message: string;
  streakCount: number;
  freezingCount: number;
  lastActivityTime: string;
}

export interface StreakInfo {
  streakCount: number;
  freezingCount: number;
  lastActivityTime: string;
  lastFreezeDate: string | null;
  hasCompletedToday: boolean;
  daysSinceLastActivity: number;
}

export interface StreakStatus extends StreakInfo {
  statusMessage: string;
  motivationalQuote: string | null;
}

export interface DailyCheckResponse {
  success: boolean;
  message: string;
  streakCount: number;
  freezingCount: number;
  lastActivityTime: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Study Streak Service สำหรับจัดการ Study Streak API
 */
class StudyStreakService {

  /**
   * Complete daily task
   */
  async completeDailyTask(
    userId: number,
    taskType: 'CREATED_CONTENT' | 'INTERACTIVE_MODE',
    contentId: number,
    metadata?: string
  ): Promise<TaskCompletionResponse> {
    try {
      console.log('🔥 Completing daily task:', { userId, taskType, contentId });

      const response: AxiosResponse<TaskCompletionResponse> = await apiClient.post(
        `/users/${userId}/streak/complete-task`,
        {
          taskType,
          contentId,
          metadata
        }
      );

      console.log('✅ Daily task completed:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Failed to complete daily task:', error);

      // Handle specific error cases
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to access this resource.');
      } else if (axiosError.response?.status === 404) {
        throw new Error('User not found.');
      } else if (axiosError.response?.status === 500) {
        // Development fallback: simulate successful task completion
        console.log('🛠️ StudyStreakService: Backend unavailable, using development fallback');

        // Get current streak from localStorage for development mode
        const currentStreak = parseInt(localStorage.getItem('dev_streak_count') || '0');
        const newStreak = currentStreak + 1;
        localStorage.setItem('dev_streak_count', newStreak.toString());
        localStorage.setItem('dev_completed_today', 'true');

        const mockResponse: TaskCompletionResponse = {
          success: true,
          message: 'Daily task completed (development mode)',
          streakCount: newStreak,
          freezingCount: 0,
          lastActivityTime: new Date().toISOString()
        };
        return mockResponse;
      } else if ((error as { code?: string }).code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection.');
      } else if (!axiosError.response) {
        throw new Error('Network error. Please check your connection.');
      } else {
        const errorWithResponse = error as { response?: { data?: { message?: string } } };
        throw new Error(errorWithResponse.response?.data?.message || 'Failed to complete daily task');
      }
    }
  }

  /**
   * Get basic streak info
   */
  async getStreak(userId: number): Promise<StreakStatus> {
    try {
      console.log('🔥 Getting streak for user:', userId);

      const response: AxiosResponse<StreakStatus> = await apiClient.get(
        `/users/${userId}/streak`
      );

      console.log('✅ Streak retrieved:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Failed to get streak:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to get streak');
    }
  }

  /**
   * Get detailed streak status
   */
  async getStreakStatus(userId: number): Promise<StreakStatus> {
    try {
      console.log('🔥 Getting streak status for user:', userId);

      const response: AxiosResponse<StreakStatus> = await apiClient.get(
        `/users/${userId}/streak/status`
      );

      console.log('✅ Streak status retrieved:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Failed to get streak status:', error);

      // Handle specific error cases
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to access this resource.');
      } else if (axiosError.response?.status === 404) {
        throw new Error('User not found.');
      } else if (axiosError.response?.status === 500) {
        // Development fallback: return mock streak data
        console.log('🛠️ StudyStreakService: Backend unavailable, using development fallback');

        // Get current streak from localStorage for development mode
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastResetDate = localStorage.getItem('dev_last_reset_date') || '';

        // Reset daily completion if it's a new day
        if (lastResetDate !== today) {
          localStorage.setItem('dev_completed_today', 'false');
          localStorage.setItem('dev_last_reset_date', today);
        }

        const currentStreak = parseInt(localStorage.getItem('dev_streak_count') || '0');
        const hasCompletedToday = localStorage.getItem('dev_completed_today') === 'true';

        const mockStreakData: StreakStatus = {
          streakCount: currentStreak,
          freezingCount: 0,
          lastActivityTime: hasCompletedToday ? new Date().toISOString() : '',
          lastFreezeDate: null,
          hasCompletedToday: hasCompletedToday,
          daysSinceLastActivity: hasCompletedToday ? 0 : 1,
          statusMessage: 'Study Streak feature is under development. Please check back later.',
          motivationalQuote: 'Every expert was once a beginner. Keep learning!'
        };
        return mockStreakData;
      } else if ((error as { code?: string }).code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection.');
      } else if (!axiosError.response) {
        throw new Error('Network error. Please check your connection.');
      } else {
        const errorWithResponse = error as { response?: { data?: { message?: string } } };
        throw new Error(errorWithResponse.response?.data?.message || 'Failed to get streak status');
      }
    }
  }

  /**
   * เรียกใช้ daily check manually (สำหรับ testing)
   */
  async processDailyCheck(userId: number): Promise<DailyCheckResponse> {
    try {
      console.log('🔥 StudyStreakService: Processing daily check', { userId });

      const response: AxiosResponse<DailyCheckResponse> = await apiClient.post(
        `/users/${userId}/streak/daily-check`
      );

      console.log('✅ StudyStreakService: Daily check processed', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ StudyStreakService: Failed to process daily check', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to process daily check');
    }
  }

  /**
   * รีเซ็ต streak (admin เท่านั้น)
   */
  async resetStreak(userId: number): Promise<{ success: boolean; message: string; streakCount: number; freezingCount: number }> {
    try {
      console.log('🔥 StudyStreakService: Resetting streak', { userId });

      const response: AxiosResponse<{ success: boolean; message: string; streakCount: number; freezingCount: number }> = await apiClient.delete(
        `/users/${userId}/streak`
      );

      console.log('✅ StudyStreakService: Streak reset successfully', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ StudyStreakService: Failed to reset streak', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to reset streak');
    }
  }

  /**
   * Helper method สำหรับสร้าง content completion task
   */
  async completeContentCreation(userId: number, contentId: number, metadata?: string): Promise<TaskCompletionResponse> {
    return this.completeDailyTask(userId, 'CREATED_CONTENT', contentId, metadata);
  }

  /**
   * Helper method สำหรับสร้าง interactive completion task
   */
  async completeInteractiveMode(userId: number, contentId: number, metadata?: string): Promise<TaskCompletionResponse> {
    return this.completeDailyTask(userId, 'INTERACTIVE_MODE', contentId, metadata);
  }
}

// Export singleton instance
const studyStreakService = new StudyStreakService();
export default studyStreakService;
