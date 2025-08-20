// Content Moderation Types for Back-end Integration
export interface ContentReport {
  id: string
  reporterId: string
  contentId: string
  contentType: string
  groupId: string
  reason: 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'HARASSMENT' | 'COPYRIGHT_VIOLATION' | 'MISLEADING_INFORMATION' | 'OTHER'
  details: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED_APPROVED' | 'RESOLVED_REJECTED' | 'RESOLVED_MODIFIED'
  moderatorId?: string
  moderatorNotes?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface CreateReportRequest {
  contentId: string
  contentType: string
  groupId: string
  reason: 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'HARASSMENT' | 'COPYRIGHT_VIOLATION' | 'MISLEADING_INFORMATION' | 'OTHER'
  details: string
  metadata?: Record<string, any>
}

export interface UpdateReportRequest {
  status?: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED_APPROVED' | 'RESOLVED_REJECTED' | 'RESOLVED_MODIFIED'
  moderatorNotes?: string
  metadata?: Record<string, any>
}

export interface ReportFilters {
  status?: string
  reason?: string
  contentType?: string
  groupId?: string
  reporterId?: string
  moderatorId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
}

export interface ReportResponse {
  content: ContentReport[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export interface ReportStatistics {
  totalReports: number
  pendingReports: number
  resolvedReports: number
  reportsByStatus: {
    status: string
    count: number
  }[]
  reportsByReason: {
    reason: string
    count: number
  }[]
  reportsByType: {
    contentType: string
    count: number
  }[]
  averageResolutionTime: number
}

export interface ModerationAction {
  id: string
  reportId: string
  moderatorId: string
  action: 'APPROVE' | 'REJECT' | 'MODIFY' | 'ESCALATE' | 'DISMISS'
  notes: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface ContentModerationSettings {
  groupId: string
  autoModeration: boolean
  requireApproval: boolean
  allowedContentTypes: string[]
  blockedKeywords: string[]
  moderationLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  autoDeleteThreshold: number
  moderatorRoles: string[]
}

export interface ModerationWorkflow {
  id: string
  name: string
  steps: ModerationStep[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ModerationStep {
  id: string
  name: string
  order: number
  action: 'REVIEW' | 'APPROVE' | 'REJECT' | 'MODIFY' | 'ESCALATE'
  requiredRole: string
  timeLimit?: number
  autoAction?: 'APPROVE' | 'REJECT' | 'ESCALATE'
  conditions?: Record<string, any>
}



