import api from './api'
import ManualContentService, { type ManualContentResponse } from './ManualContentService'

// Unified content query parameters
export interface UnifiedContentParams {
  page?: number
  size?: number
  contentType?: 'quiz' | 'flashcard' | 'note' | 'all'
  source?: 'ai' | 'manual' | 'all'
  sortBy?: 'createdAt' | 'title' | 'contentType'
  sortDir?: 'asc' | 'desc'
}

// Unified content DTO for both AI and Manual content
export interface UnifiedContentDTO {
  id: string                    // "manual-quiz-1" or "ai-content-123"
  title: string
  content: string               // JSON string (AI-compatible format)
  contentType: 'quiz' | 'flashcard' | 'note'
  source: 'ai' | 'manual'
  createdAt: string
  updatedAt: string
  createdByUsername: string
  difficulty?: string
  subject?: string
  tags: string[]
  aiRequestId?: string          // เฉพาะ AI content
}

// Unified content response with pagination and stats
export interface UnifiedContentResponse {
  content: UnifiedContentDTO[]
  totalElements: number
  currentPage: number
  totalPages: number
  size: number
  summary: {
    totalAiContent: number
    totalManualContent: number
    contentTypeCounts: {
      quiz: number
      flashcard: number
      note: number
    }
  }
  success: boolean
  message: string
}

// Content stats response
export interface ContentStatsResponse {
  totalContent: number
  totalAiContent: number
  totalManualContent: number
  contentTypeCounts: {
    quiz: number
    flashcard: number
    note: number
  }
  recentActivity: {
    last7Days: number
    last30Days: number
  }
  success: boolean
  message: string
}

export class UnifiedContentService {
  private static readonly BASE_URL = '/content'

  /**
   * Get user's unified content (AI + Manual)
   */
  static async getUserContent(params: UnifiedContentParams = {}): Promise<UnifiedContentResponse> {
    try {
      // ✅ ตรวจสอบ source parameter ก่อน
      const shouldLoadManual = !params.source || params.source === 'manual' || params.source === 'all'
      const shouldLoadAI = !params.source || params.source === 'ai' || params.source === 'all'

      // Try to get content from ManualContentService first
      let manualContent: ManualContentResponse[] = []

      if (shouldLoadManual && (params.contentType === 'all' || !params.contentType ||
          ['quiz', 'flashcard', 'note'].includes(params.contentType))) {
        try {
          if (params.contentType && params.contentType !== 'all') {
            manualContent = await ManualContentService.getContentByType(params.contentType)
          } else {
            // ManualContentService.getAllContent() ตอนนี้ส่ง array โดยตรง ไม่มี .content
            manualContent = await ManualContentService.getAllContent()
          }
        } catch (manualError) {
          console.warn('Manual content fetch failed, continuing with AI content:', manualError)
          console.error('❌ Manual content error details:', {
            message: manualError instanceof Error ? manualError.message : 'Unknown error',
            error: manualError
          })
        }
      }

      // Transform manual content to unified format
      const unifiedManualContent: UnifiedContentDTO[] = manualContent.map(content => {
        console.log('🔧 Transforming manual content:', {
          id: content.id,
          contentType: content.contentType,
          contentTitle: content.contentTitle,
          contentDataLength: content.contentData?.length || 0,
          contentDataPreview: content.contentData?.substring(0, 100) + '...'
        })

        // ✅ ตรวจสอบ contentData ก่อน transform
        if (!content.contentData || content.contentData.trim() === '') {
          console.warn('⚠️ Empty contentData for manual content:', content.id)
        }

        return {
          id: `manual-${content.contentType}-${content.id}`,
          title: content.contentTitle,
          content: content.contentData,
          contentType: content.contentType,
          source: 'manual' as const,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
          createdByUsername: content.createdByUsername,
          difficulty: content.difficulty,
          subject: content.subject,
          tags: content.tags
        }
      })

      // ✅ Try to get AI content only if shouldLoadAI is true
      let aiContent: UnifiedContentDTO[] = []
      if (shouldLoadAI) {
        try {
          // Import AIContentService dynamically to avoid circular dependency
          const { aiContentService } = await import('./AIContentService')

          if (params.contentType === 'all' || !params.contentType ||
              ['quiz', 'flashcard', 'note'].includes(params.contentType)) {
            try {
              const aiContentResponse = await aiContentService.getSavedContent()

              // Transform AI content to unified format
              aiContent = aiContentResponse.content.map((content: {
                id: number
                contentTitle: string
                contentType: string
                contentData?: string
                contentVersion: number
                supabaseFilePath?: string
                fileSize?: number
                isSaved: boolean
                createdAt: string
              }) => ({
                id: `ai-${content.id}`,
                title: content.contentTitle,
                content: content.contentData || '',
                contentType: content.contentType as 'quiz' | 'flashcard' | 'note',
                source: 'ai' as const,
                createdAt: content.createdAt,
                updatedAt: content.createdAt, // Use createdAt as fallback
                createdByUsername: 'AI Assistant',
                difficulty: undefined,
                subject: undefined,
                tags: [],
                aiRequestId: undefined
              }))
            } catch (aiContentError) {
              console.warn('AI content fetch failed:', aiContentError)
            }
          }
        } catch (aiError) {
          console.warn('AI content service import failed:', aiError)
          console.error('❌ AI content error details:', {
            message: aiError instanceof Error ? aiError.message : 'Unknown error',
            error: aiError
          })
        }
      }

      // ✅ Debug logging
      console.log('🔍 Content loading summary:', {
        shouldLoadManual,
        shouldLoadAI,
        manualContentCount: unifiedManualContent.length,
        aiContentCount: aiContent.length,
        params: params
      })

      // Combine and sort content
      const allContent = [...unifiedManualContent, ...aiContent]

      // Apply sorting
      if (params.sortBy) {
        allContent.sort((a, b) => {
          let aValue: string | number, bValue: string | number

          switch (params.sortBy) {
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'contentType':
              aValue = a.contentType
              bValue = b.contentType
              break
            default:
              return 0
          }

          if (params.sortDir === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      // Apply pagination
      const page = params.page || 0
      const size = params.size || 20
      const startIndex = page * size
      const endIndex = startIndex + size
      const paginatedContent = allContent.slice(startIndex, endIndex)

      // Calculate summary
      const summary = {
        totalAiContent: aiContent.length,
        totalManualContent: manualContent.length,
        contentTypeCounts: {
          quiz: allContent.filter(c => c.contentType === 'quiz').length,
          flashcard: allContent.filter(c => c.contentType === 'flashcard').length,
          note: allContent.filter(c => c.contentType === 'note').length
        }
      }

      return {
        content: paginatedContent,
        totalElements: allContent.length,
        currentPage: page,
        totalPages: Math.ceil(allContent.length / size),
        size,
        summary,
        success: true,
        message: `Retrieved ${paginatedContent.length} content items`
      }

    } catch (error) {
      console.error('❌ getUserContent failed:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })

      // Return empty response on error
      return {
        content: [],
        totalElements: 0,
        currentPage: 0,
        totalPages: 0,
        size: params.size || 20,
        summary: {
          totalAiContent: 0,
          totalManualContent: 0,
          contentTypeCounts: { quiz: 0, flashcard: 0, note: 0 }
        },
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch content'
      }
    }
  }

  /**
   * Get user's content statistics
   */
  static async getUserContentStats(): Promise<ContentStatsResponse> {
    try {
      // Get manual content stats from ManualContentService
      let manualContent: ManualContentResponse[] = []
      try {
        const response = await ManualContentService.getAllContent()
        // ManualContentService.getAllContent() ตอนนี้ส่ง array โดยตรง ไม่มี .content
        manualContent = response
      } catch (manualError) {
        console.warn('Manual content stats fetch failed:', manualError)
        console.error('❌ Manual content stats error details:', {
          message: manualError instanceof Error ? manualError.message : 'Unknown error',
          error: manualError
        })
      }

      // Try to get AI content stats from unified API
      let aiContent: UnifiedContentDTO[] = []
      try {
        const response = await api.get(`${this.BASE_URL}/user/stats`)
        if (response.data && response.data.content) {
          aiContent = response.data.content.filter((item: UnifiedContentDTO) => item.source === 'ai')
        }
      } catch (aiError) {
        console.warn('AI content stats fetch failed:', aiError)
        console.error('❌ AI content stats error details:', {
          message: aiError instanceof Error ? aiError.message : 'Unknown error',
          error: aiError
        })
      }

      // Calculate stats
      const totalManualContent = manualContent.length
      const totalAiContent = aiContent.length
      const totalContent = totalManualContent + totalAiContent

      const contentTypeCounts = {
        quiz: manualContent.filter(c => c.contentType === 'quiz').length +
              aiContent.filter(c => c.contentType === 'quiz').length,
        flashcard: manualContent.filter(c => c.contentType === 'flashcard').length +
                   aiContent.filter(c => c.contentType === 'flashcard').length,
        note: manualContent.filter(c => c.contentType === 'note').length +
              aiContent.filter(c => c.contentType === 'note').length
      }

      // Calculate recent activity (last 7 and 30 days)
      const now = new Date()
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const allContent = [...manualContent, ...aiContent]
      const recentActivity = {
        last7Days: allContent.filter(c => new Date(c.createdAt) >= last7Days).length,
        last30Days: allContent.filter(c => new Date(c.createdAt) >= last30Days).length
      }

      return {
        totalContent,
        totalAiContent,
        totalManualContent,
        contentTypeCounts,
        recentActivity,
        success: true,
        message: 'Content statistics retrieved successfully'
      }

    } catch (error) {
      console.error('❌ Content Stats service error:', error)
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })

      // Return empty stats on error
      return {
        totalContent: 0,
        totalAiContent: 0,
        totalManualContent: 0,
        contentTypeCounts: { quiz: 0, flashcard: 0, note: 0 },
        recentActivity: { last7Days: 0, last30Days: 0 },
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch content statistics'
      }
    }
  }

  /**
   * Debug endpoint to get notes specifically
   */
  static async getDebugNotes(): Promise<{
    username: string
    totalNotes: number
    notes: Array<{
      id: number
      contentTitle: string
      contentType: string
      contentData: string
      subject: string
      difficulty: string
      tags: string[]
      createdAt: string
      updatedAt: string
    }>
  }> {
    try {
      console.log('🔍 Debug: Getting notes specifically...')

      // Get manual content
      const manualContent = await ManualContentService.getAllContent()
      const notes = manualContent.filter(content => content.contentType === 'note')

      console.log('🔍 Debug: Found notes:', notes.length)
      notes.forEach((note, index) => {
        console.log(`🔍 Debug: Note ${index + 1}:`, {
          id: note.id,
          title: note.contentTitle,
          contentDataLength: note.contentData?.length || 0,
          contentDataPreview: note.contentData?.substring(0, 200) + '...'
        })
      })

      return {
        username: 'debug_user',
        totalNotes: notes.length,
        notes: notes.map(note => ({
          id: note.id,
          contentTitle: note.contentTitle,
          contentType: note.contentType,
          contentData: note.contentData,
          subject: note.subject,
          difficulty: note.difficulty,
          tags: note.tags,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        }))
      }
    } catch (error) {
      console.error('❌ Debug notes failed:', error)
      return {
        username: 'debug_user',
        totalNotes: 0,
        notes: []
      }
    }
  }

  /**
   * Search content across AI and Manual
   */
  static async searchContent(query: string, params: UnifiedContentParams = {}): Promise<UnifiedContentResponse> {
    try {
      const queryParams = new URLSearchParams({ query })
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })

      const response = await api.get(`${this.BASE_URL}/search?${queryParams}`)

      if (!response.data || !response.data.content) {
        console.warn('❌ Content Search API not ready - no content found')
        return {
          content: [],
          totalElements: 0,
          currentPage: 0,
          totalPages: 0,
          size: params.size || 20,
          summary: {
            totalAiContent: 0,
            totalManualContent: 0,
            contentTypeCounts: { quiz: 0, flashcard: 0, note: 0 }
          },
          success: false,
          message: 'Search API not ready'
        }
      }

      return response.data
    } catch (error) {
      console.error('❌ Content search failed:', error)
      console.error('❌ Search error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      })

      // Return empty response on error
      return {
        content: [],
        totalElements: 0,
        currentPage: 0,
        totalPages: 0,
        size: params.size || 20,
        summary: {
          totalAiContent: 0,
          totalManualContent: 0,
          contentTypeCounts: { quiz: 0, flashcard: 0, note: 0 }
        },
        success: false,
        message: error instanceof Error ? error.message : 'Search failed'
      }
    }
  }
}

export default UnifiedContentService
