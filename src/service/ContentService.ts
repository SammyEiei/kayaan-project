import ManualContentService, { type ManualContentResponse } from './ManualContentService'
import { useAuthStore } from '../stores/auth'

export interface ContentItem {
  id: string
  type: 'quiz' | 'note' | 'flashcard'
  title: string
  subject: string
  tags: string[]
  difficulty: string
  createdAt: string
  category?: string
}

export async function getAllContent(): Promise<ContentItem[]> {
  try {
    // Use ManualContentService for unified content
    const response = await ManualContentService.getAllContent()
    // ManualContentService.getAllContent() ตอนนี้ส่ง array โดยตรง ไม่มี .content
    return response.map((content): ContentItem => ({
      id: content.id.toString(),
      type: content.contentType.toLowerCase() as 'quiz' | 'note' | 'flashcard',
      title: content.contentTitle,
      subject: content.subject,
      tags: content.tags,
      difficulty: content.difficulty.toLowerCase(),
      createdAt: content.createdAt,
      category: content.subject,
    }))
  } catch (error) {
    console.error('Error fetching content:', error)
    return []
  }
}
