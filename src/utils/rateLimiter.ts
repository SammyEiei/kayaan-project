/**
 * Rate Limiter utility for managing API request limits
 * Implements client-side rate limiting to prevent exceeding backend limits
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  // Development mode - ปิด rate limiting
  private isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV

  private limits = {
    generationRequests: { max: this.isDevelopment ? 999 : 5, window: 3600000 }, // Dev: unlimited, Prod: 5 per hour
    previews: { max: this.isDevelopment ? 999 : 3, window: 60000 }, // Dev: unlimited, Prod: 3 per minute
    contentSaves: { max: this.isDevelopment ? 999 : 10, window: 300000 }, // Dev: unlimited, Prod: 10 per 5 minutes
    templateCreation: { max: this.isDevelopment ? 999 : 2, window: 1800000 }, // Dev: unlimited, Prod: 2 per 30 minutes
  }

  /**
   * Check if a request can be made for the given type and user
   */
  canMakeRequest(type: keyof typeof this.limits, userId: string): boolean {
    // Development mode - always allow requests
    if (this.isDevelopment) {
      console.log('🔓 Development mode: Rate limiting disabled')
      return true
    }

    const limit = this.limits[type]
    const now = Date.now()
    const userRequests = this.requests.get(`${userId}-${type}`) || []

    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < limit.window)

    if (validRequests.length >= limit.max) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(`${userId}-${type}`, validRequests)

    return true
  }

  /**
   * Get remaining requests for the given type and user
   */
  getRemainingRequests(type: keyof typeof this.limits, userId: string): number {
    const limit = this.limits[type]
    const now = Date.now()
    const userRequests = this.requests.get(`${userId}-${type}`) || []
    const validRequests = userRequests.filter(time => now - time < limit.window)

    return Math.max(0, limit.max - validRequests.length)
  }

  /**
   * Get time until next request can be made
   */
  getTimeUntilReset(type: keyof typeof this.limits, userId: string): number {
    const limit = this.limits[type]
    const now = Date.now()
    const userRequests = this.requests.get(`${userId}-${type}`) || []

    if (userRequests.length === 0) {
      return 0
    }

    const oldestRequest = Math.min(...userRequests)
    const resetTime = oldestRequest + limit.window

    return Math.max(0, resetTime - now)
  }

  /**
   * Clear all requests for a user (useful for logout)
   */
  clearUserRequests(userId: string): void {
    for (const key of this.requests.keys()) {
      if (key.startsWith(`${userId}-`)) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Get all rate limit info for a user
   */
  getRateLimitInfo(userId: string): Record<string, {
    remaining: number
    resetTime: number
    limit: number
  }> {
    const info: Record<string, { remaining: number; resetTime: number; limit: number }> = {}

    for (const type of Object.keys(this.limits) as Array<keyof typeof this.limits>) {
      info[type] = {
        remaining: this.getRemainingRequests(type, userId),
        resetTime: this.getTimeUntilReset(type, userId),
        limit: this.limits[type].max
      }
    }

    return info
  }

  /**
   * Format time remaining in human readable format
   */
  formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) {
      return 'พร้อมใช้งาน'
    }

    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)

    if (minutes > 0) {
      return `${minutes} นาที ${seconds} วินาที`
    } else {
      return `${seconds} วินาที`
    }
  }

  /**
   * Clear all rate limits (Development only)
   */
  clearAllLimits(): void {
    if (this.isDevelopment) {
      this.requests.clear()
      console.log('🧹 Development mode: All rate limits cleared')
    } else {
      console.warn('⚠️ Clear rate limits is only available in development mode')
    }
  }

  /**
   * Get development mode status
   */
  isDevelopmentMode(): boolean {
    return this.isDevelopment
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()
