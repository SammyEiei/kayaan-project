import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/service/DashboardService'
import type {
  DashboardStats,
  StudyHourData,
  StudyGroup,
  LearningProgress,
  AIContent,
} from '@/service/DashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats>({
    studyStreak: 0,
    focusTime: { hours: 0, minutes: 0 },
    flashcardsReviewed: 0,
    lastReviewTime: '',
    pomodorosToday: 0,
  })

  const studyHours = ref<StudyHourData[]>([])
  const studyGroups = ref<StudyGroup[]>([])
  const learningProgress = ref<LearningProgress[]>([])
  const aiContent = ref<AIContent[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await dashboardService.getDashboardData()

      stats.value = data.stats
      studyHours.value = data.studyHours
      studyGroups.value = data.studyGroups
      learningProgress.value = data.learningProgress
      aiContent.value = data.aiContent
    } catch (err) {
      error.value = 'Failed to load dashboard data'
      console.error('Dashboard fetch error:', err)

      // Fallback to individual API calls if main endpoint fails
      await Promise.all([
        fetchStats(),
        fetchStudyHours(),
        fetchGroups(),
        fetchProgress(),
        fetchAIContent(),
      ])
    } finally {
      isLoading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      stats.value = await dashboardService.getStudyStats()
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchStudyHours = async () => {
    try {
      studyHours.value = await dashboardService.getStudyHours()
    } catch (err) {
      console.error('Failed to fetch study hours:', err)
    }
  }

  const fetchGroups = async () => {
    try {
      studyGroups.value = await dashboardService.getUserGroups()
    } catch (err) {
      console.error('Failed to fetch groups:', err)
    }
  }

  const fetchProgress = async () => {
    try {
      learningProgress.value = await dashboardService.getLearningProgress()
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    }
  }

  const fetchAIContent = async () => {
    try {
      aiContent.value = await dashboardService.getAIContent()
    } catch (err) {
      console.error('Failed to fetch AI content:', err)
    }
  }

  return {
    // State
    stats,
    studyHours,
    studyGroups,
    learningProgress,
    aiContent,
    isLoading,
    error,

    // Actions
    fetchDashboardData,
    fetchStats,
    fetchStudyHours,
    fetchGroups,
    fetchProgress,
    fetchAIContent,
  }
})
