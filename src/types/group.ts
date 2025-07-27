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
  userRole: 'owner' | 'moderator' | 'member'
}

export interface GroupMember {
  userId: string
  username: string
  email: string
  avatarUrl?: string
  role: 'owner' | 'moderator' | 'member'
  status: 'pending' | 'accepted' | 'rejected'
  joinedAt: string
}

export interface GroupResource {
  id: string
  groupId: string
  uploadedBy: string
  uploaderName: string
  type: 'note' | 'file' | 'link' | 'imported_content'
  title: string
  contentUrl?: string
  contentText?: string
  createdAt: string
  commentCount: number
  reactionCount: number
}

export interface ResourceComment {
  id: string
  resourceId: string
  userId: string
  username: string
  avatarUrl?: string
  text: string
  createdAt: string
}

export interface ResourceReaction {
  id: string
  resourceId: string
  userId: string
  emoji: string
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
  groupId: string
  username?: string
  email?: string
}

export interface GenerateInviteCodeRequest {
  groupId: string
  codeLength?: number
  expiresIn?: number // hours
}

export interface JoinGroupByCodeRequest {
  inviteCode: string
}

export interface UpdateMemberRoleRequest {
  groupId: string
  userId: string
  role: 'member' | 'moderator'
}

export interface UploadResourceRequest {
  groupId: string
  type: 'note' | 'file' | 'link' | 'imported_content'
  title: string
  contentText?: string
  contentUrl?: string
  file?: File
}

export interface AddCommentRequest {
  resourceId: string
  text: string
}

export interface AddReactionRequest {
  resourceId: string
  emoji: string
}
