// Study Group Types
export interface StudyGroup {
  id: string
  name: string
  description: string
  ownerId: string
  inviteLinkToken: string
  inviteCode?: string
  createdAt: string
  memberCount: number
  isOwner: boolean
  userRole: 'member' | 'admin'
  // เพิ่มฟิลด์ใหม่
  isPrivate: boolean
  maxMembers?: number
  tags?: string[]
}

export interface GroupMember {
  userId: string
  username: string
  email: string
  avatarUrl?: string
  role: 'member' | 'admin'
  status: 'pending' | 'accepted' | 'rejected'
  joinedAt: string
  // เพิ่มฟิลด์ใหม่
  lastActiveAt?: string
  contributionScore?: number
}

export interface GroupResource {
  id: string
  groupId: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploaderId: string
  uploaderName: string
  createdAt: string
  comments: ResourceComment[]
  reactions: ResourceReaction[]
  // เพิ่มฟิลด์ใหม่
  type: 'note' | 'file' | 'link' | 'imported_content'
  tags?: string[]
  isPublic: boolean
  updatedAt?: string
}

// เพิ่ม type ใหม่สำหรับ Group Post
export interface GroupPost {
  id: string
  groupId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'mixed'
  attachments?: PostAttachment[]
  tags?: string[]
  createdAt: string
  updatedAt?: string
  likes: number
  comments: PostComment[]
  isEdited: boolean
  isPinned: boolean
}

export interface PostAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  thumbnailUrl?: string
}

export interface PostComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  isEdited: boolean
  replies?: PostComment[]
}

// เพิ่ม type ใหม่สำหรับ Group Invite
export interface GroupInvite {
  id: string
  groupId: string
  inviteCode: string
  inviterId: string
  inviterName: string
  expiresAt: string
  maxUses?: number
  currentUses: number
  isActive: boolean
  createdAt: string
}

// เพิ่ม type ใหม่สำหรับ Join Request
export interface JoinRequest {
  id: string
  groupId: string
  userId: string
  username: string
  email: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// เพิ่ม type ใหม่สำหรับ Group Notification
export interface GroupNotification {
  id: string
  groupId: string
  userId: string
  type: 'post' | 'comment' | 'member_joined' | 'member_left' | 'resource_uploaded' | 'invite_accepted'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
}

// เพิ่ม type ใหม่สำหรับ Group Search
export interface GroupSearchFilters {
  query?: string
  type?: 'all' | 'note' | 'file' | 'link' | 'imported_content'
  author?: string
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  sortBy?: 'recent' | 'popular' | 'name' | 'date'
  sortOrder?: 'asc' | 'desc'
}

// เพิ่ม type ใหม่สำหรับ Group Statistics
export interface GroupStats {
  totalPosts: number
  totalResources: number
  totalMembers: number
  activeMembers: number
  totalComments: number
  totalReactions: number
  lastActivity: string
  weeklyActivity: {
    posts: number
    comments: number
    uploads: number
  }
}

// เพิ่ม types ที่เหลือ
export interface ResourceComment {
  id: string
  resourceId: string
  userId: string
  username: string
  content: string
  createdAt: string
}

export interface ResourceReaction {
  id: string
  resourceId: string
  userId: string
  reactionType: 'like' | 'dislike' | 'heart' | 'star'
  createdAt: string
}

export interface InviteRequest {
  groupId: string
  inviteType: 'username' | 'email' | 'link'
  value: string
}

// API Response Types
export interface CreateGroupRequest {
  name: string
  description: string
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
}

export interface InviteMemberRequest {
  email: string
  role?: 'member' | 'admin'
}

export interface GenerateInviteCodeRequest {
  expiresInHours?: number
}

export interface JoinGroupByCodeRequest {
  inviteCode: string
}

export interface UpdateMemberRoleRequest {
  userId: string
  role: 'member' | 'admin'
}

export interface UploadResourceRequest {
  title: string
  description: string
  file: File
}

export interface AddCommentRequest {
  resourceId: string
  content: string
}

export interface AddReactionRequest {
  resourceId: string
  reactionType: 'like' | 'dislike' | 'heart' | 'star'
}

// เพิ่ม API Request Types ใหม่
export interface CreatePostRequest {
  groupId: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'mixed'
  attachments?: File[]
  tags?: string[]
}

export interface UpdatePostRequest {
  content: string
  tags?: string[]
}

export interface AddPostCommentRequest {
  postId: string
  content: string
  parentCommentId?: string
}

export interface SearchGroupContentRequest {
  groupId: string
  filters: GroupSearchFilters
  page?: number
  limit?: number
}

export interface ApproveJoinRequestRequest {
  requestId: string
  approved: boolean
  message?: string
}

export interface RemoveMemberRequest {
  userId: string
  reason?: string
}

export interface UpdateGroupSettingsRequest {
  isPrivate: boolean
  maxMembers?: number
  allowMemberInvites: boolean
  requireApproval: boolean
  autoApproveMembers: boolean
}
