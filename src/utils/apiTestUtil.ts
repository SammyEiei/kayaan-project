/**
 * API Connection Test Utility
 * ใช้สำหรับทดสอบการเชื่อมต่อ API และ Authentication
 */

import { aiContentService } from '@/service/AIContentService'
import { useAuthStore } from '@/stores/auth'

export interface ApiTestResult {
  success: boolean
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

export class ApiTestUtil {
  static async testApiConnection(): Promise<ApiTestResult> {
    const timestamp = new Date().toISOString()

    try {
      console.log('🧪 Testing API connection...')

      // ทดสอบ authentication state
      const authStore = useAuthStore()
      const hasToken = !!authStore.token
      const isAuthenticated = authStore.isAuthenticated

      console.log('🔍 Auth State:', {
        hasToken,
        isAuthenticated,
        userId: authStore.userId
      })

      if (!isAuthenticated) {
        return {
          success: false,
          message: 'User is not authenticated. Please login first.',
          details: {
            hasToken,
            isAuthenticated,
            userId: authStore.userId
          },
          timestamp
        }
      }

      // ทดสอบการสร้าง generation request
      const testRequest = {
        request: {
          promptText: 'Test API connection',
          outputFormat: 'note' as const,
          maxRetries: 1
        }
      }

      console.log('🧪 Sending test generation request...')
      console.log('🧪 Test request data:', testRequest)

      try {
        const requestId = await aiContentService.createGenerationRequest(testRequest)
        console.log('✅ Generation request successful! ID:', requestId)
        return {
          success: true,
          message: 'API connection test successful',
          details: {
            requestId,
            hasToken,
            isAuthenticated,
            userId: authStore.userId
          },
          timestamp
        }
      } catch (requestError) {
        console.error('❌ Generation request failed:', requestError)

        // ถ้า generation request ล้มเหลว ให้ทดสอบ endpoint อื่น
        console.log('🧪 Trying alternative endpoints...')

        // ทดสอบการเรียก endpoint อื่นๆ เพื่อดูว่า API ทำงานไหม
        try {
          // ลองเรียก endpoint ที่ไม่ต้องใช้ data ซับซ้อน
          console.log('🧪 Testing basic auth endpoint...')

          // ถ้า error มาจาก path แสดงว่า backend config ต่างจากที่คิด
          throw requestError
        } catch (altError) {
          throw requestError // ส่ง error ดั้งเดิมกลับไป
        }
      }

    } catch (error) {
      console.error('❌ API test failed:', error)

      let errorMessage = 'Unknown error occurred'
      const errorDetails: Record<string, unknown> = {}

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails.errorName = error.name
        errorDetails.errorStack = error.stack
      }

      // Check specific error types
      const axiosError = error as { response?: { status: number; statusText: string; data?: unknown } }
      if (axiosError.response) {
        errorDetails.httpStatus = axiosError.response.status
        errorDetails.httpStatusText = axiosError.response.statusText
        errorDetails.responseData = axiosError.response.data
      }

      return {
        success: false,
        message: `API connection test failed: ${errorMessage}`,
        details: errorDetails,
        timestamp
      }
    }
  }

  static async testAuth(): Promise<ApiTestResult> {
    const timestamp = new Date().toISOString()

    try {
      const authStore = useAuthStore()

      const details = {
        hasToken: !!authStore.token,
        isAuthenticated: authStore.isAuthenticated,
        userId: authStore.userId,
        tokenPreview: authStore.token ? authStore.token.substring(0, 30) + '...' : null,
        userInfo: authStore.user
      }

      console.log('🔍 Auth test details:', details)

      return {
        success: details.isAuthenticated,
        message: details.isAuthenticated ? 'Authentication test passed' : 'User is not authenticated',
        details,
        timestamp
      }

    } catch (error) {
      console.error('❌ Auth test failed:', error)

      return {
        success: false,
        message: `Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: String(error) },
        timestamp
      }
    }
  }

  static async runFullTest(): Promise<{
    authTest: ApiTestResult
    connectionTest: ApiTestResult
    overall: ApiTestResult
  }> {
    console.log('🧪 Running full API test suite...')

    const authTest = await this.testAuth()
    let connectionTest: ApiTestResult

    if (authTest.success) {
      connectionTest = await this.testApiConnection()
    } else {
      connectionTest = {
        success: false,
        message: 'Skipped connection test due to auth failure',
        timestamp: new Date().toISOString()
      }
    }

    const overall: ApiTestResult = {
      success: authTest.success && connectionTest.success,
      message: authTest.success && connectionTest.success
        ? 'All tests passed successfully'
        : 'Some tests failed',
      details: {
        authPassed: authTest.success,
        connectionPassed: connectionTest.success
      },
      timestamp: new Date().toISOString()
    }

    console.log('🧪 Full test results:', {
      authTest,
      connectionTest,
      overall
    })

    return {
      authTest,
      connectionTest,
      overall
    }
  }
}

// Export for easy testing in console
export const testApi = ApiTestUtil.testApiConnection
export const testAuth = ApiTestUtil.testAuth
export const runFullTest = ApiTestUtil.runFullTest
