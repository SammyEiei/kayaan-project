/**
 * Path Testing Utility
 * ทดสอบ path ต่างๆ เพื่อหา correct API endpoint
 */

import AxiosClient from '@/service/AxiosClient'

export interface PathTestResult {
  path: string
  success: boolean
  status?: number
  error?: string
  fullUrl: string
}

export class PathTestUtil {
  private static client = AxiosClient

  static async testPaths(): Promise<PathTestResult[]> {
        const testPaths = [
      // Current correct paths (after fixing double /api issue)
      '/api/ai/generation/request',
      '/api/ai/generation/requests',
      '/api/ai/generation/status',
      '/api/users/me',  // Should work if auth is OK

      // Alternative paths to test
      '/api/v1/ai/generation/request',
      '/api/v1/users/me',

      // Test without /api (in case backend doesn't need it)
      '/ai/generation/request',
      '/users/me',

      // Test basic connectivity
      '/api/health',
      '/health',
      '/actuator/health',
    ]

    const results: PathTestResult[] = []

    for (const path of testPaths) {
      const result = await this.testSinglePath(path)
      results.push(result)
      console.log(`🧪 Path test: ${path} => ${result.success ? '✅' : '❌'} (${result.status || result.error})`)
    }

    return results
  }

  private static async testSinglePath(path: string): Promise<PathTestResult> {
    const baseURL = this.client.defaults.baseURL || ''
    const fullUrl = path.startsWith('http') ? path : `${baseURL}${path.startsWith('/') ? path : '/' + path}`

    try {
      // ใช้ HEAD request เพื่อดู endpoint availability โดยไม่ส่ง data
      const response = await this.client.head(path)

      return {
        path,
        success: true,
        status: response.status,
        fullUrl
      }
    } catch (error: any) {
      const status = error.response?.status
      const errorMsg = error.response?.statusText || error.message

      return {
        path,
        success: false,
        status,
        error: errorMsg,
        fullUrl
      }
    }
  }

  static async testGenerationEndpoint(): Promise<PathTestResult> {
    const path = '/ai/generation/request'  // ไม่ใส่ /api เพราะ AxiosClient จะเพิ่มให้
    const baseURL = this.client.defaults.baseURL || ''
    const fullUrl = `${baseURL}${path}`

    try {
      // สร้าง minimal FormData สำหรับทดสอบ
      const formData = new FormData()
      formData.append('request', JSON.stringify({
        promptText: 'test',
        outputFormat: 'note',
        maxRetries: 1
      }))

      console.log('🧪 Testing generation endpoint with minimal data...')
      console.log('🧪 Full URL:', fullUrl)
      console.log('🧪 Headers:', this.client.defaults.headers)

      const response = await this.client.post(path, formData)

      return {
        path,
        success: true,
        status: response.status,
        fullUrl
      }

    } catch (error: any) {
      const status = error.response?.status
      const errorMsg = error.response?.statusText || error.message || error.response?.data?.message

      console.error('🧪 Generation endpoint test failed:', {
        status,
        error: errorMsg,
        fullResponse: error.response?.data
      })

      return {
        path,
        success: false,
        status,
        error: errorMsg,
        fullUrl
      }
    }
  }

  static async detectBackendStructure(): Promise<{
    availablePaths: string[]
    workingPaths: PathTestResult[]
    failedPaths: PathTestResult[]
    recommendation: string
  }> {
    console.log('🔍 Detecting backend API structure...')

    const results = await this.testPaths()
    const workingPaths = results.filter(r => r.success || (r.status && r.status < 500))
    const failedPaths = results.filter(r => !r.success && (!r.status || r.status >= 500))

    // ทดสอบ generation endpoint แยกต่างหาก
    const genResult = await this.testGenerationEndpoint()

    let recommendation = ''

    if (workingPaths.length > 0) {
      recommendation = `Found ${workingPaths.length} accessible paths. API server is responding.`

      if (genResult.success) {
        recommendation += ' Generation endpoint is working correctly.'
      } else if (genResult.status === 401) {
        recommendation += ' Generation endpoint requires authentication.'
      } else if (genResult.status === 403) {
        recommendation += ' Generation endpoint access is forbidden.'
      } else if (genResult.status === 404) {
        recommendation += ' Generation endpoint not found - check backend routing.'
      } else {
        recommendation += ` Generation endpoint error: ${genResult.error}`
      }
    } else {
      recommendation = 'No accessible paths found. Check if backend is running and CORS is configured.'
    }

    return {
      availablePaths: workingPaths.map(p => p.path),
      workingPaths,
      failedPaths,
      recommendation
    }
  }
}

// Export for console testing
export const testPaths = PathTestUtil.testPaths
export const detectBackend = PathTestUtil.detectBackendStructure
export const testGeneration = PathTestUtil.testGenerationEndpoint
