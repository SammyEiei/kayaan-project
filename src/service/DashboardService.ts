import apiClient from './AxiosClient'

export interface DashboardStats {
  studyStreak: number
  focusTime: {
    hours: number
    minutes: number
  }
  flashcardsReviewed: number
  lastReviewTime: string
  pomodorosToday: number
}

export interface StudyHourData {
  day: string
  hours: number
}

export interface StudyGroup {
  id: string
  name: string
  memberCount: number
  letter: string
}

export interface LearningProgress {
  id: number
  subject: string
  progress: number
  daysLeft: number
}

export interface AIContent {
  id: number
  title: string
  daysAgo: number
  type: 'summary' | 'flashcards' | 'quiz'
}

export interface DashboardData {
  stats: DashboardStats
  studyHours: StudyHourData[]
  studyGroups: StudyGroup[]
  learningProgress: LearningProgress[]
  aiContent: AIContent[]
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient.get('/api/dashboard')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      throw error
    }
  },

  async getStudyStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get('/api/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch study stats:', error)
      throw error
    }
  },

  async getStudyHours(): Promise<StudyHourData[]> {
    try {
      const response = await apiClient.get('/api/dashboard/study-hours')
      return response.data
    } catch (error) {
      console.error('Failed to fetch study hours:', error)
      throw error
    }
  },

  async getUserGroups(): Promise<StudyGroup[]> {
    try {
      const response = await apiClient.get('/api/dashboard/groups')
      return response.data
    } catch (error) {
      console.error('Failed to fetch user groups:', error)
      throw error
    }
  },

  async getLearningProgress(): Promise<LearningProgress[]> {
    try {
      const response = await apiClient.get('/api/dashboard/progress')
      return response.data
    } catch (error) {
      console.error('Failed to fetch learning progress:', error)
      throw error
    }
  },

  async getAIContent(): Promise<AIContent[]> {
    try {
      const response = await apiClient.get('/api/dashboard/ai-content')
      return response.data
    } catch (error) {
      console.error('Failed to fetch AI content:', error)
      throw error
    }
  },
}
