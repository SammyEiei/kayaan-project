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
  members?: number // เพิ่มฟิลด์ members ที่ขาดหายไป
}

export interface GroupMember {
  userId: string | number
  username: string
  email: string
  avatarUrl?: string
  role: 'member' | 'admin' | 'moderator'
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
  fileUrl: string | null
  fileType: string | null
  fileSize: number | null
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
  // เพิ่มฟิลด์ที่ขาดหายไป
  contentUrl?: string
  contentText?: string
  commentCount?: number
  reactionCount?: number
  // เพิ่มฟิลด์สำหรับ Share Study Content
  contentSource?: 'file' | 'study_content'
  contentId?: string | null
  originalContentType?: string | null
  contentData?: string | null  // JSON string ของ interactive content
  contentTitle?: string
  contentType?: 'flashcard' | 'quiz' | 'note' | null  // lowercase เพื่อความสอดคล้อง
  contentVersion?: number
  subject?: string | null
  difficulty?: string | null
  isSaved?: boolean
  deletedAt?: string | null
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
  maxUses: number
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

// เพิ่ม type ใหม่สำหรับ Permission System
export interface PermissionCheckResponse {
  hasPermission: boolean
  permission: string
  groupId: string
  userId: string
  message?: string
  timestamp: string
}

export interface GroupPermission {
  id: string
  name: string
  description: string
  category: 'content' | 'member' | 'security' | 'admin'
}

export interface GroupRole {
  id: string
  name: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER'
  permissions: GroupPermission[]
}

// เพิ่ม type ใหม่สำหรับ API Response
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
  errorCode?: string
}

// เพิ่ม type ใหม่สำหรับ Create Group Request
export interface CreateGroupRequest {
  name: string
  description: string
  isPrivate: boolean
  maxMembers?: number
  tags?: string[]
}

// เพิ่ม type ใหม่สำหรับ Update Group Request
export interface UpdateGroupRequest {
  name?: string
  description?: string
  isPrivate?: boolean
  maxMembers?: number
  tags?: string[]
}

// เพิ่ม type ใหม่สำหรับ Invite Member Request
export interface InviteMemberRequest {
  email?: string
  role?: 'member' | 'admin'
  message?: string
}

// เพิ่ม type ใหม่สำหรับ Generate Invite Code Request
export interface GenerateInviteCodeRequest {
  groupId?: string
  maxUses?: number
  expiresInDays?: number
  expiresInHours?: number
  message?: string
}

// เพิ่ม type ใหม่สำหรับ Join Group By Code Request
export interface JoinGroupByCodeRequest {
  inviteCode: string
  message?: string
}

// เพิ่ม type ใหม่สำหรับ Update Member Role Request
export interface UpdateMemberRoleRequest {
  userId: string
  role: 'member' | 'admin'
}

// เพิ่ม type ใหม่สำหรับ Upload Resource Request
export interface UploadResourceRequest {
  groupId?: string
  title: string
  description: string
  file?: File
  tags?: string[]
  isPublic?: boolean
}

// เพิ่ม type ใหม่สำหรับ Add Comment Request
export interface AddCommentRequest {
  resourceId?: string
  content: string
  parentCommentId?: string
}

// เพิ่ม type ใหม่สำหรับ Add Reaction Request
export interface AddReactionRequest {
  resourceId?: string
  reactionType?: string
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
}

// เพิ่ม type ใหม่สำหรับ Create Post Request
export interface CreatePostRequest {
  groupId: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'mixed'
  attachments?: File[]
  tags?: string[]
}

// เพิ่ม type ใหม่สำหรับ Update Post Request
export interface UpdatePostRequest {
  content: string
  tags?: string[]
}

// เพิ่ม type ใหม่สำหรับ Add Post Comment Request
export interface AddPostCommentRequest {
  postId?: string
  content: string
  parentCommentId?: string
}

// เพิ่ม type ใหม่สำหรับ Search Group Content Request
export interface SearchGroupContentRequest {
  query: string
  contentType?: 'all' | 'text' | 'image' | 'file' | 'mixed'
  tags?: string[]
  authorId?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'recent' | 'popular' | 'relevance'
  page?: number
  limit?: number
  filters?: {
    query?: string
    type?: string
    sortBy?: string
  }
}

// เพิ่ม type ใหม่สำหรับ Group Search Filters
export interface GroupSearchFilters {
  query?: string
  tags?: string[]
  isPrivate?: boolean
  hasAvailableSpots?: boolean
  sortBy?: 'recent' | 'popular' | 'name'
  page?: number
  limit?: number
}

// เพิ่ม type ใหม่สำหรับ Group Notifications
export interface GroupNotification {
  id: string
  groupId: string
  userId: string
  type: 'member_joined' | 'new_post' | 'new_resource' | 'comment' | 'reaction'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

// เพิ่ม type ใหม่สำหรับ Update Group Settings
export interface UpdateGroupSettingsRequest {
  name?: string
  description?: string
  isPrivate?: boolean
  maxMembers?: number
  tags?: string[]
  settings?: {
    allowMemberInvites?: boolean
    requireApproval?: boolean
    allowFileUploads?: boolean
  }
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

// เพิ่ม type ใหม่สำหรับ Share Study Content
export interface ShareStudyContentRequest {
  contentId: string
  title: string
  description?: string
  tags?: string[]
}

export interface ShareStudyContentResponse {
  id: number
  title: string
  description: string
  fileUrl: null
  mimeType: null
  fileSize: null
  tags: string[]
  uploaderId: number
  createdAt: string
  contentSource: 'study_content'
  contentId: string
  originalContentType: string
  contentData: any
}

export interface ListGroupResourcesParams {
  search?: string
  type?: string
  page?: number
  size?: number
}
