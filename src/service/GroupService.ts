import api from './api'

export interface StudyGroupDTO {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  membersCount?: number
}

export interface GroupDetailsDTO {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  membersCount?: number
  isOwner?: boolean
  userRole?: 'member' | 'admin'
}

export interface CreateGroupPayload {
  name: string
  description: string
}

export interface GroupMemberDTO {
  userId: string
  username?: string
  email?: string
  avatarUrl?: string
  role: 'member' | 'admin'
  status: 'pending' | 'accepted' | 'rejected'
  joinedAt: string
}

export interface MemberResponse {
  userId: string
  role: 'member' | 'admin'
}

export interface GroupResourceDTO {
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
}

export interface CreateResourcePayload {
  title: string
  description: string
  file: File
}

export interface UpdateMemberRoleRequest {
  userId: string
  role: 'member' | 'admin'
}

export interface InviteMemberPayload {
  email: string
  role?: 'member' | 'admin'
}

export interface JoinGroupByCodePayload {
  inviteCode: string
}

export interface GenerateInviteCodeResponse {
  inviteCode: string
  inviteLink: string
}

export default {
  // Group Management
  createGroup(payload: CreateGroupPayload) {
    return api.post<StudyGroupDTO>('/api/groups', payload).then((res) => res.data)
  },

  getMyGroups() {
    return api.get<StudyGroupDTO[]>('/api/groups/my').then((res) => res.data)
  },

  getAllGroups() {
    return api.get<StudyGroupDTO[]>('/api/groups').then((res) => res.data)
  },

  getGroupDetails(groupId: string) {
    return api.get<GroupDetailsDTO>(`/api/groups/${groupId}`).then((res) => res.data)
  },

  updateGroup(groupId: string, payload: Partial<CreateGroupPayload>) {
    return api.put<StudyGroupDTO>(`/api/groups/${groupId}`, payload).then((res) => res.data)
  },

  deleteGroup(groupId: string) {
    return api.delete<void>(`/api/groups/${groupId}`)
  },

  // Member Management
  getGroupMembers(groupId: string) {
    return api.get<GroupMemberDTO[]>(`/api/groups/${groupId}/members`).then((res) => res.data)
  },

  inviteMember(groupId: string, payload: InviteMemberPayload) {
    return api.post<void>(`/api/groups/${groupId}/invite`, payload)
  },

  updateMemberRole(groupId: string, payload: UpdateMemberRoleRequest) {
    return api.put<void>(`/api/groups/${groupId}/members/${payload.userId}/role`, { role: payload.role })
  },

  removeMember(groupId: string, userId: string) {
    return api.delete<void>(`/api/groups/${groupId}/members/${userId}`)
  },

  leaveGroup(groupId: string) {
    return api.post<void>(`/api/groups/${groupId}/leave`)
  },

  // Invite Management
  generateInviteCode(groupId: string) {
    return api.post<GenerateInviteCodeResponse>(`/api/groups/${groupId}/invite-code`).then((res) => res.data)
  },

  joinByCode(payload: JoinGroupByCodePayload) {
    return api.post<StudyGroupDTO>('/api/groups/join', payload).then((res) => res.data)
  },

  joinByToken(token: string) {
    return api.post<StudyGroupDTO>('/api/groups/join', { token }).then((res) => res.data)
  },

  // Resource Management
  getGroupResources(groupId: string) {
    return api.get<GroupResourceDTO[]>(`/api/groups/${groupId}/resources`).then((res) => res.data)
  },

  uploadResource(groupId: string, payload: CreateResourcePayload) {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('file', payload.file)

    return api.post<GroupResourceDTO>(`/api/groups/${groupId}/resources`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data)
  },

  deleteResource(groupId: string, resourceId: string) {
    return api.delete<void>(`/api/groups/${groupId}/resources/${resourceId}`)
  },
}
