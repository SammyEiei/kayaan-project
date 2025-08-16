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
}

export interface GroupMember {
  userId: string
  username: string
  email: string
  avatarUrl?: string
  role: 'member' | 'admin'
  status: 'pending' | 'accepted' | 'rejected'
  joinedAt: string
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
}

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

export interface JoinRequest {
  groupId: string
  message?: string
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
