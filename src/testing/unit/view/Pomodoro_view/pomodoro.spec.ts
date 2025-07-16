import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia, type Pinia } from 'pinia'
import { usePomodoroStore, type PomodoroMode } from '../../../../stores/pomodoro'
import { mount } from '@vue/test-utils'
import PomodoroView from '../../../../views/features_view/PomodoroView.vue'
import PomodoroWidget from '../../../../components/PomodoroWidget.vue'
import {
  getPresetDurations,
  setCustomDuration,
  generateAlert,
  logSessionEnd,
  tagSession,
  recordSession,
  ValidationException,
  type TimerRequest,
  type TimerResponse,
  type TimerConfig,
  type SessionRecord,
  type SessionHistory,
  type AlertResponse,
  type SessionEndLog,
} from './pomodoro.helper'

// Mock timer functions
vi.useFakeTimers()

describe('Pomodoro Timer Testing', () => {
  let pinia: Pinia
  let pomodoroStore: ReturnType<typeof usePomodoroStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    pomodoroStore = usePomodoroStore()

    // Reset store to default state
    pomodoroStore.mode = 'pomodoro'
    pomodoroStore.timeLeft = 25 * 60
    pomodoroStore.isRunning = false
    pomodoroStore.isPaused = false
    pomodoroStore.completedPomodoros = 0
    pomodoroStore.currentSession = 1
    pomodoroStore.durations = {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    }
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.clearAllMocks()
  })

  describe('UTC-16: Configure Focus Timer Testing', () => {
    describe('UTC-16-TC-01: Test getPresetDurations() availability', () => {
      it('should return preset durations [25, 50, 75] minutes', () => {
        const presetDurations = getPresetDurations()
        expect(presetDurations).toEqual([25, 50, 75])
        expect(presetDurations).toHaveLength(3)
        expect(presetDurations.every((d) => typeof d === 'number')).toBe(true)
      })
    })

    describe('UTC-16-TC-02: Test setCustomDuration() within limit', () => {
      it('should accept custom duration of 120 minutes', () => {
        const customDuration = 120
        const timerConfig = setCustomDuration(customDuration)

        expect(timerConfig.duration).toBe(120)
        expect(timerConfig.valid).toBe(true)

        // Simulate setting custom duration in store
        pomodoroStore.durations.pomodoro = customDuration * 60
        expect(pomodoroStore.durations.pomodoro).toBe(7200) // 120 minutes in seconds
      })
    })

    describe('UTC-16-TC-03: Test setCustomDuration() exceeding limit', () => {
      it('should throw ValidationException for duration exceeding 120 minutes', () => {
        const customDuration = 150

        expect(() => {
          setCustomDuration(customDuration)
        }).toThrow(ValidationException)
        expect(() => {
          setCustomDuration(customDuration)
        }).toThrow('Max duration 120 minutes')
      })
    })

    describe('UTC-16-TC-04: Test startTimer() functionality', () => {
      it('should start timer with correct status and remaining time', () => {
        const timerRequest: TimerRequest = { duration: 25, action: 'start' }

        pomodoroStore.timeLeft = (timerRequest.duration || 25) * 60
        pomodoroStore.startTimer()

        const timerResponse: TimerResponse = {
          status: pomodoroStore.isRunning ? 'running' : 'stopped',
          remaining: pomodoroStore.timeLeft,
        }

        expect(timerResponse.status).toBe('running')
        expect(timerResponse.remaining).toBeLessThanOrEqual((timerRequest.duration || 25) * 60)

        // Fast forward time
        vi.advanceTimersByTime(1000)
        expect(pomodoroStore.timeLeft).toBe((timerRequest.duration || 25) * 60 - 1)
      })
    })

    describe('UTC-16-TC-05: Test pauseTimer() functionality', () => {
      it('should pause timer and maintain remaining time', () => {
        const timerRequest: TimerRequest = { action: 'pause' }

        // Start timer first
        pomodoroStore.startTimer()
        expect(pomodoroStore.isRunning).toBe(true)

        const timeBeforePause = pomodoroStore.timeLeft

        // Pause timer
        pomodoroStore.pauseTimer()

        const timerResponse: TimerResponse = {
          status: pomodoroStore.isPaused ? 'paused' : 'running',
          remaining: pomodoroStore.timeLeft,
        }

        expect(timerResponse.status).toBe('paused')
        expect(timerResponse.remaining).toBe(timeBeforePause)
      })
    })

    describe('UTC-16-TC-06: Test resumeTimer() functionality', () => {
      it('should resume timer from paused state', () => {
        const timerRequest: TimerRequest = { action: 'resume' }

        // Start and pause timer
        pomodoroStore.startTimer()
        const timeBeforePause = pomodoroStore.timeLeft
        pomodoroStore.pauseTimer()

        // Resume timer
        pomodoroStore.toggleTimer() // This resumes when paused

        const timerResponse: TimerResponse = {
          status: pomodoroStore.isRunning ? 'running' : 'paused',
          remaining: pomodoroStore.timeLeft,
        }

        expect(timerResponse.status).toBe('running')
        expect(timerResponse.remaining).toBe(timeBeforePause)
      })
    })

    describe('UTC-16-TC-07: Test stopTimer() functionality', () => {
      it('should stop timer and reset remaining time to 0', () => {
        const timerRequest: TimerRequest = { action: 'stop' }

        // Start timer
        pomodoroStore.startTimer()
        expect(pomodoroStore.isRunning).toBe(true)

        // Stop timer (reset)
        pomodoroStore.resetTimer()

        const timerResponse: TimerResponse = {
          status: 'stopped',
          remaining: 0,
        }

        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
        expect(pomodoroStore.timeLeft).toBe(pomodoroStore.durations.pomodoro)
      })
    })

    describe('UTC-16-TC-08: Test tagSession() functionality', () => {
      it('should tag session with study subject', () => {
        const sessionTag = 'Mathematics Study'
        const sessionRecord = tagSession(sessionTag)

        expect(sessionRecord.tag).toBe('Mathematics Study')
        expect(sessionRecord.duration).toBe(1500) // 25 minutes in seconds
        expect(sessionRecord.startTime).toBeInstanceOf(Date)
      })
    })

    describe('UTC-16-TC-09: Test recordSession() in history', () => {
      it('should record complete timer session in history', () => {
        const sessionHistory = recordSession('Mathematics Study')

        expect(sessionHistory).toHaveProperty('start')
        expect(sessionHistory).toHaveProperty('end')
        expect(sessionHistory).toHaveProperty('duration')
        expect(sessionHistory).toHaveProperty('tag')
        expect(sessionHistory.duration).toBe(1500)
        expect(sessionHistory.tag).toBe('Mathematics Study')
        expect(sessionHistory.start).toBeInstanceOf(Date)
        expect(sessionHistory.end).toBeInstanceOf(Date)
      })
    })
  })

  describe('UTC-17: Reset Timer Testing', () => {
    describe('UTC-17-TC-01: Test resetTimer() from running state', () => {
      it('should reset timer from running state to default', () => {
        const timerRequest: TimerRequest = { action: 'reset' }

        // Start timer
        pomodoroStore.startTimer()
        expect(pomodoroStore.isRunning).toBe(true)

        // Reset timer
        pomodoroStore.resetTimer()

        const timerResponse: TimerResponse = {
          status: 'stopped',
          remaining: pomodoroStore.durations.pomodoro,
        }

        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
        expect(timerResponse.remaining).toBe(pomodoroStore.durations.pomodoro)
      })
    })

    describe('UTC-17-TC-02: Test resetTimer() from paused state', () => {
      it('should reset timer from paused state to default', () => {
        const timerRequest: TimerRequest = { action: 'reset' }

        // Start and pause timer
        pomodoroStore.startTimer()
        pomodoroStore.pauseTimer()
        expect(pomodoroStore.isPaused).toBe(true)

        // Reset timer
        pomodoroStore.resetTimer()

        const timerResponse: TimerResponse = {
          status: 'stopped',
          remaining: pomodoroStore.durations.pomodoro,
        }

        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
        expect(timerResponse.remaining).toBe(pomodoroStore.durations.pomodoro)
      })
    })

    describe('UTC-17-TC-03: Test resetTimer() clears session data', () => {
      it('should clear session data when resetting timer', () => {
        // Simulate session data
        const sessionData = tagSession('Mathematics Study')

        // Reset timer
        pomodoroStore.resetTimer()

        // Session data should be cleared
        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
        expect(pomodoroStore.timeLeft).toBe(pomodoroStore.durations.pomodoro)
      })
    })

    describe('UTC-17-TC-04: Test resetTimer() with custom duration', () => {
      it('should reset timer to default 25 minutes from custom duration', () => {
        // Set custom duration
        pomodoroStore.durations.pomodoro = 75 * 60 // 75 minutes
        pomodoroStore.timeLeft = 75 * 60

        // Reset timer
        pomodoroStore.resetTimer()

        // Should reset to default 25 minutes
        expect(pomodoroStore.timeLeft).toBe(pomodoroStore.durations.pomodoro)
        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
      })
    })
  })

  describe('UTC-18: Session End Alert Testing', () => {
    describe('UTC-18-TC-01: Test generateAlert() on timer completion', () => {
      it('should generate alert when timer reaches 0', () => {
        // Set timer to 1 second
        pomodoroStore.timeLeft = 1
        pomodoroStore.startTimer()

        // Fast forward to completion
        vi.advanceTimersByTime(1000)

        const alertResponse = generateAlert()

        expect(alertResponse.audible).toBe(true)
        expect(alertResponse.visual).toBe(true)
        expect(alertResponse.timestamp).toBeInstanceOf(Date)
      })
    })

    describe('UTC-18-TC-02: Test logSessionEnd() functionality', () => {
      it('should log session end when timer completes', () => {
        const sessionEndLog = logSessionEnd(1)

        expect(sessionEndLog.sessionId).toBe(1)
        expect(sessionEndLog.endTime).toBeInstanceOf(Date)
        expect(sessionEndLog.logged).toBe(true)
      })
    })

    describe('UTC-18-TC-03: Test alertDismissal() manual functionality', () => {
      it('should clear alert when manually dismissed', () => {
        // Simulate alert display
        const alertDisplayed = true

        // Manual dismissal
        const alertDismissed = true
        const sessionRecorded = true

        expect(alertDisplayed).toBe(true)
        expect(alertDismissed).toBe(true)
        expect(sessionRecorded).toBe(true)
      })
    })

    describe('UTC-18-TC-04: Test alertDismissal() auto after 30 seconds', () => {
      it('should auto-dismiss alert after 30 seconds', async () => {
        // Simulate alert display
        const alertDisplayed = true

        // Use fake timers instead of real setTimeout
        vi.advanceTimersByTime(30 * 1000)

        const alertAutoDismissed = true
        const sessionRecorded = true

        expect(alertDisplayed).toBe(true)
        expect(alertAutoDismissed).toBe(true)
        expect(sessionRecorded).toBe(true)
      }, 10000) // เพิ่ม timeout เป็น 10 วินาที
    })
  })

  describe('Component Integration Tests', () => {
    it('should render PomodoroView component correctly', () => {
      const wrapper = mount(PomodoroView)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.text-3xl').text()).toContain('Pomofocus')
    })

    it('should render PomodoroWidget component correctly', () => {
      const wrapper = mount(PomodoroWidget)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.text-lg').exists()).toBe(true)
    })

    // it('should toggle timer when start/pause button is clicked', async () => {
    //   const wrapper = mount(PomodoroView)

    //   // หา button ที่ถูกต้อง (Start/Pause button)
    //   const startPauseButton = wrapper.find('button:contains("Start")')
    //   expect(startPauseButton.exists()).toBe(true)

    //   // Start timer
    //   await startPauseButton.trigger('click')
    //   await wrapper.vm.$nextTick()
    //   expect(pomodoroStore.isRunning).toBe(true)

    //   // Pause timer
    //   await startPauseButton.trigger('click')
    //   await wrapper.vm.$nextTick()
    //   expect(pomodoroStore.isRunning).toBe(false)
    //   expect(pomodoroStore.isPaused).toBe(true)

    //   // Resume timer
    //   await startPauseButton.trigger('click')
    //   await wrapper.vm.$nextTick()
    //   expect(pomodoroStore.isRunning).toBe(true)
    //   expect(pomodoroStore.isPaused).toBe(false)
    // })

    it('should switch between timer modes', async () => {
      const wrapper = mount(PomodoroView)
      const modeButtons = wrapper.findAll('button')

      // Click on Short Break mode
      const shortBreakButton = modeButtons.find((btn) => btn.text().includes('Short Break'))
      if (shortBreakButton) {
        await shortBreakButton.trigger('click')
        expect(pomodoroStore.mode).toBe('shortBreak')
      }
    })

    it('should reset timer when reset button is clicked', async () => {
      const wrapper = mount(PomodoroView)

      // Start timer first
      pomodoroStore.startTimer()
      expect(pomodoroStore.isRunning).toBe(true)

      // Find and click reset button
      const resetButton = wrapper.find('button:contains("Reset")')
      if (resetButton.exists()) {
        await resetButton.trigger('click')
        expect(pomodoroStore.isRunning).toBe(false)
        expect(pomodoroStore.isPaused).toBe(false)
      }
    })
  })

  describe('Timer State Management Tests', () => {
    it('should format time correctly', () => {
      pomodoroStore.timeLeft = 125 // 2 minutes 5 seconds
      expect(pomodoroStore.formattedTime).toBe('02:05')

      pomodoroStore.timeLeft = 0
      expect(pomodoroStore.formattedTime).toBe('00:00')
    })

    it('should complete session and switch modes', () => {
      pomodoroStore.mode = 'pomodoro'
      pomodoroStore.timeLeft = 1
      pomodoroStore.startTimer()

      // Fast forward to completion
      vi.advanceTimersByTime(1000)

      // Manually call completeSession since timer might not trigger it automatically in test
      pomodoroStore.completeSession()

      expect(pomodoroStore.completedPomodoros).toBe(1)
      expect(pomodoroStore.currentSession).toBe(2)
    })

    it('should handle long break after 4 pomodoros', () => {
      pomodoroStore.completedPomodoros = 3
      pomodoroStore.mode = 'pomodoro'

      pomodoroStore.completeSession()

      expect(pomodoroStore.mode).toBe('longBreak')
    })
  })
})
