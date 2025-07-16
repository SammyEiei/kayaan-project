// Helper functions for Pomodoro tests
export interface TimerRequest {
  duration?: number
  action: 'start' | 'pause' | 'resume' | 'stop' | 'reset'
}

export interface TimerResponse {
  status: 'running' | 'paused' | 'stopped'
  remaining: number
}

export interface TimerConfig {
  duration: number
  valid: boolean
}

export interface SessionRecord {
  tag: string
  startTime: Date
  duration: number
}

export interface SessionHistory {
  start: Date
  end: Date
  duration: number
  tag: string
}

export interface AlertResponse {
  audible: boolean
  visual: boolean
  timestamp: Date
}

export interface SessionEndLog {
  sessionId: number
  endTime: Date
  logged: boolean
}

export class ValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationException'
  }
}

export function getPresetDurations(): number[] {
  return [25, 50, 75]
}

export function setCustomDuration(duration: number): TimerConfig {
  const maxDuration = 120
  if (duration > maxDuration) {
    throw new ValidationException('Max duration 120 minutes')
  }
  return {
    duration,
    valid: true,
  }
}

export function generateAlert(): AlertResponse {
  return {
    audible: true,
    visual: true,
    timestamp: new Date(),
  }
}

export function logSessionEnd(sessionId: number): SessionEndLog {
  return {
    sessionId,
    endTime: new Date(),
    logged: true,
  }
}

export function tagSession(tag: string): SessionRecord {
  return {
    tag,
    startTime: new Date(),
    duration: 25 * 60,
  }
}

export function recordSession(tag: string): SessionHistory {
  const start = new Date()
  const end = new Date(start.getTime() + 25 * 60 * 1000) // 25 minutes later
  return {
    start,
    end,
    duration: 25 * 60,
    tag,
  }
}
