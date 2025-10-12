import { ref, type Ref } from 'vue'
import type { TaskCompletionResponse } from '@/services/StudyStreakService'

export interface StreakNotification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'streak'
  title: string
  message: string
  streakCount?: number | null
  duration?: number
}

/**
 * Composable สำหรับจัดการ Study Streak Notifications
 */
export function useStreakNotifications() {
  const notifications: Ref<StreakNotification[]> = ref([])

  /**
   * เพิ่ม notification ใหม่
   */
  const addNotification = (notification: Omit<StreakNotification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification: StreakNotification = {
      id,
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }

  /**
   * ลบ notification
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * ลบ notifications ทั้งหมด
   */
  const clearNotifications = () => {
    notifications.value = []
  }

  /**
   * แสดง notification สำหรับ streak update
   */
  const showStreakUpdate = (result: TaskCompletionResponse) => {
    const { streakCount } = result

    // กำหนด notification ตาม streak count
    if (streakCount === 1) {
      addNotification({
        type: 'streak',
        title: '🎉 First Streak!',
        message: 'Congratulations! You\'ve started your study streak. Keep it up!',
        streakCount,
        duration: 6000
      })
    } else if (streakCount % 7 === 0 && streakCount > 0) {
      addNotification({
        type: 'streak',
        title: '🔥 Amazing Milestone!',
        message: `${streakCount} day streak! You're on fire!`,
        streakCount,
        duration: 7000
      })
    } else if (streakCount % 30 === 0 && streakCount > 0) {
      addNotification({
        type: 'streak',
        title: '🏆 Incredible Achievement!',
        message: `${streakCount} days! You're a study champion!`,
        streakCount,
        duration: 8000
      })
    } else if (streakCount >= 10) {
      addNotification({
        type: 'streak',
        title: '🔥 Streak Updated!',
        message: `Great job! You've reached ${streakCount} days!`,
        streakCount,
        duration: 5000
      })
    } else {
      addNotification({
        type: 'streak',
        title: '🔥 Streak Updated!',
        message: `Keep going! ${streakCount} day${streakCount !== 1 ? 's' : ''} streak!`,
        streakCount,
        duration: 4000
      })
    }
  }

  /**
   * แสดง notification สำหรับ freezing warning
   */
  const showFreezingWarning = (freezingCount: number) => {
    if (freezingCount >= 2) {
      addNotification({
        type: 'warning',
        title: '⚠️ Streak in Danger!',
        message: `You've missed ${freezingCount} days. Complete a task to maintain your streak!`,
        duration: 8000
      })
    } else if (freezingCount === 1) {
      addNotification({
        type: 'info',
        title: '💡 Don\'t Break the Streak!',
        message: 'You missed one day. Complete a task today to keep your streak alive!',
        duration: 6000
      })
    }
  }

  /**
   * แสดง notification สำหรับ streak reset
   */
  const showStreakReset = () => {
    addNotification({
      type: 'warning',
      title: '❌ Streak Reset',
      message: 'Your streak has been reset. Start a new one by completing a task today!',
      duration: 7000
    })
  }

  /**
   * แสดง notification สำหรับ daily task completion
   */
  const showDailyTaskCompleted = (taskType: 'CREATED_CONTENT' | 'INTERACTIVE_MODE', streakCount: number) => {
    const taskName = taskType === 'CREATED_CONTENT' ? 'content creation' : 'interactive learning'

    addNotification({
      type: 'success',
      title: '✅ Task Completed!',
      message: `Great job completing ${taskName}! Your streak is now ${streakCount} days.`,
      streakCount,
      duration: 5000
    })
  }

  /**
   * แสดง notification สำหรับ streak milestone
   */
  const showStreakMilestone = (streakCount: number) => {
    if (streakCount === 5) {
      addNotification({
        type: 'streak',
        title: '🌟 5 Day Streak!',
        message: 'Excellent! You\'re building a great study habit.',
        streakCount,
        duration: 6000
      })
    } else if (streakCount === 10) {
      addNotification({
        type: 'streak',
        title: '🎯 10 Day Streak!',
        message: 'Outstanding! You\'re really committed to learning.',
        streakCount,
        duration: 7000
      })
    } else if (streakCount === 30) {
      addNotification({
        type: 'streak',
        title: '🏆 30 Day Streak!',
        message: 'Incredible! You\'re a true learning champion!',
        streakCount,
        duration: 8000
      })
    } else if (streakCount === 100) {
      addNotification({
        type: 'streak',
        title: '👑 100 Day Streak!',
        message: 'Legendary! You\'ve achieved something truly remarkable!',
        streakCount,
        duration: 10000
      })
    }
  }

  /**
   * แสดง notification สำหรับ motivational message
   */
  const showMotivationalMessage = (message: string) => {
    addNotification({
      type: 'info',
      title: '💡 Motivation',
      message,
      duration: 6000
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showStreakUpdate,
    showFreezingWarning,
    showStreakReset,
    showDailyTaskCompleted,
    showStreakMilestone,
    showMotivationalMessage
  }
}
