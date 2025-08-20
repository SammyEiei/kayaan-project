// Notification Types for Back-end Integration
export interface Notification {
  id: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  title: string
  message: string
  groupId?: string
  resourceId?: string
  isRead: boolean
  createdAt: string
  expiresAt?: string
  metadata?: Record<string, any>
}

export interface CreateNotificationRequest {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  title: string
  message: string
  groupId?: string
  resourceId?: string
  expiresAt?: string
  metadata?: Record<string, any>
}

export interface UpdateNotificationRequest {
  isRead?: boolean
  metadata?: Record<string, any>
}

export interface NotificationFilters {
  isRead?: boolean
  type?: string
  groupId?: string
  resourceId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
}

export interface NotificationResponse {
  content: Notification[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export interface UnreadCountResponse {
  count: number
  lastUpdated: string
}

// WebSocket Notification Events
export interface NotificationEvent {
  type: 'NOTIFICATION_CREATED' | 'NOTIFICATION_UPDATED' | 'NOTIFICATION_DELETED'
  notification: Notification
  timestamp: string
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  groupNotifications: boolean
  resourceNotifications: boolean
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}



