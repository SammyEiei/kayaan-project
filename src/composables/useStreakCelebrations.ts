import { ref, type Ref } from 'vue'
import type { TaskCompletionResponse } from '@/services/StudyStreakService'

export interface StreakCelebration {
  id: string
  streakCount: number
  title: string
  message: string
  showProgress: boolean
  autoClose: boolean
  autoCloseDelay: number
}

// Global state สำหรับ celebrations
const celebrations: Ref<StreakCelebration[]> = ref([])

/**
 * ตรวจสอบว่าได้แสดง celebration ไปแล้วในวันนี้หรือยัง
 */
const hasShownCelebrationToday = (streakCount: number): boolean => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const lastShownDate = localStorage.getItem('kayaan_last_celebration_date')
  const lastShownStreak = parseInt(localStorage.getItem('kayaan_last_celebration_streak') || '0')

  // ถ้าเป็นวันเดียวกันและ streak count เท่าเดิม = แสดงไปแล้ว
  return lastShownDate === today && lastShownStreak === streakCount
}

/**
 * บันทึกว่าได้แสดง celebration แล้วในวันนี้
 */
const markCelebrationShown = (streakCount: number): void => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  localStorage.setItem('kayaan_last_celebration_date', today)
  localStorage.setItem('kayaan_last_celebration_streak', streakCount.toString())
}

/**
 * Composable สำหรับจัดการ Streak Celebration Popups แบบ Duolingo
 */
export function useStreakCelebrations() {
  /**
   * เพิ่ม celebration ใหม่
   */
  const addCelebration = (celebration: Omit<StreakCelebration, 'id'>) => {
    // Debug: track when a celebration is queued
    try {
      console.log('[StreakCelebrations] addCelebration()', celebration)
    } catch {}
    const id = `celebration-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newCelebration: StreakCelebration = {
      id,
      ...celebration
    }

    // ลบ celebration เก่าที่ยังแสดงอยู่ (แสดงทีละ 1 popup)
    celebrations.value = []

    // เพิ่ม celebration ใหม่
    celebrations.value.push(newCelebration)

    return id
  }

  /**
   * ลบ celebration
   */
  const removeCelebration = (id: string) => {
    const index = celebrations.value.findIndex(c => c.id === id)
    if (index > -1) {
      celebrations.value.splice(index, 1)
    }
  }

  /**
   * ลบ celebrations ทั้งหมด
   */
  const clearCelebrations = () => {
    celebrations.value = []
  }

  /**
   * แสดง celebration popup สำหรับ streak update
   * จะแสดงแค่ครั้งเดียวต่อวันเมื่อ streak count เพิ่มขึ้น
   */
  const showStreakCelebration = (result: TaskCompletionResponse) => {
    const { streakCount } = result

    // Debug current state
    try {
      const lastShownDate = localStorage.getItem('kayaan_last_celebration_date')
      const lastShownStreak = localStorage.getItem('kayaan_last_celebration_streak')
      console.log('[StreakCelebrations] showStreakCelebration()', {
        streakCount,
        lastShownDate,
        lastShownStreak
      })
    } catch {}

    // ตรวจสอบว่าแสดงไปแล้วในวันนี้หรือยัง
    if (hasShownCelebrationToday(streakCount)) {
      try {
        console.log('[StreakCelebrations] Skipped: already shown today', { streakCount })
      } catch {}
      return
    }

    // บันทึกว่าได้แสดง celebration แล้ว
    markCelebrationShown(streakCount)

    // กำหนด celebration ตาม streak count (ภาษาอังกฤษ)
    if (streakCount === 1) {
      addCelebration({
        streakCount,
        title: 'First Streak!',
        message: 'Congratulations! You\'ve started your learning journey. Keep it up!',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 6000
      })
    } else if (streakCount === 5) {
      addCelebration({
        streakCount,
        title: '5 Day Streak!',
        message: 'Excellent! You\'re building a great learning habit.',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 7000
      })
    } else if (streakCount === 10) {
      addCelebration({
        streakCount,
        title: '10 Day Streak!',
        message: 'Outstanding! You\'re really committed to learning.',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 7000
      })
    } else if (streakCount === 30) {
      addCelebration({
        streakCount,
        title: '30 Day Streak!',
        message: 'Incredible! You\'re a true learning champion!',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 8000
      })
    } else if (streakCount === 100) {
      addCelebration({
        streakCount,
        title: '100 Day Streak!',
        message: 'Legendary! You\'ve achieved something truly remarkable!',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 10000
      })
    } else if (streakCount % 30 === 0 && streakCount > 0) {
      addCelebration({
        streakCount,
        title: 'Amazing Milestone!',
        message: `${streakCount} days! You're a learning champion!`,
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 8000
      })
    } else if (streakCount % 7 === 0 && streakCount > 0) {
      addCelebration({
        streakCount,
        title: 'Weekly Streak!',
        message: `${streakCount} days! You're on fire!`,
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 7000
      })
    } else if (streakCount >= 3) {
      addCelebration({
        streakCount,
        title: 'Streak Updated!',
        message: `Great job! You've reached ${streakCount} days!`,
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 5000
      })
    } else {
      addCelebration({
        streakCount,
        title: 'Keep Going!',
        message: `Nice! ${streakCount} day streak!`,
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 4000
      })
    }
  }

  /**
   * แสดง celebration สำหรับ daily task completion
   */
  const showDailyTaskCelebration = (taskType: 'CREATED_CONTENT' | 'INTERACTIVE_MODE', streakCount: number) => {
    const taskName = taskType === 'CREATED_CONTENT' ? 'content creation' : 'interactive learning'

    // ตรวจสอบว่าแสดงไปแล้วในวันนี้หรือยัง
    if (hasShownCelebrationToday(streakCount)) {
      return
    }

    markCelebrationShown(streakCount)

    addCelebration({
      streakCount,
      title: 'Task Completed!',
      message: `Great job completing ${taskName}! Your streak is now ${streakCount} days.`,
      showProgress: true,
      autoClose: true,
      autoCloseDelay: 5000
    })
  }

  /**
   * แสดง celebration สำหรับ streak milestone
   */
  const showStreakMilestone = (streakCount: number) => {
    // ตรวจสอบว่าแสดงไปแล้วในวันนี้หรือยัง
    if (hasShownCelebrationToday(streakCount)) {
      return
    }

    if (streakCount === 5) {
      markCelebrationShown(streakCount)
      addCelebration({
        streakCount,
        title: '5 Day Streak!',
        message: 'Excellent! You\'re building a great learning habit.',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 6000
      })
    } else if (streakCount === 10) {
      markCelebrationShown(streakCount)
      addCelebration({
        streakCount,
        title: '10 Day Streak!',
        message: 'Outstanding! You\'re really committed to learning.',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 7000
      })
    } else if (streakCount === 30) {
      markCelebrationShown(streakCount)
      addCelebration({
        streakCount,
        title: '30 Day Streak!',
        message: 'Incredible! You\'re a true learning champion!',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 8000
      })
    } else if (streakCount === 100) {
      markCelebrationShown(streakCount)
      addCelebration({
        streakCount,
        title: '100 Day Streak!',
        message: 'Legendary! You\'ve achieved something truly remarkable!',
        showProgress: true,
        autoClose: true,
        autoCloseDelay: 10000
      })
    }
  }

  return {
    celebrations,
    addCelebration,
    removeCelebration,
    clearCelebrations,
    showStreakCelebration,
    showDailyTaskCelebration,
    showStreakMilestone
  }
}

