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

export interface MemberResponse {
  userId: string
  role: 'member' | 'admin'
  joinedAt: string
}

export interface InviteResponse {
  token: string
  expiresAt: string
}

export interface ResourceResponse {
  id: string
  title: string
  description: string
  fileUrl: string
  mimeType: string
  fileSize: number
  tags: string[]
  uploaderId: string
  createdAt: string
}

export interface UploadResourceInitRequest {
  fileName: string
  mimeType: string
  size: number
}

export interface UploadResourceInitResponse {
  uploadUrl: string
  fileUrl: string
}

export interface UploadResourceCompleteRequest {
  fileName: string
  fileUrl: string
  title: string
  description: string
  tags: string[]
}

export interface UpdateMemberRoleRequest {
  userId: string
  role: 'member' | 'admin'
}

export default {
  createGroup(payload: CreateGroupPayload) {
    return api.post<StudyGroupDTO>('/api/groups', payload).then((res) => res.data)
  },
  getMyGroups() {
    return api.get<StudyGroupDTO[]>('/api/groups').then((res) => res.data)
  },
  getGroupDetails(groupId: string) {
    console.log('🔍 Calling getGroupDetails for groupId:', groupId)
    return api.get<GroupDetailsDTO>(`/api/groups/${groupId}`).then((res) => {
      console.log('🔍 getGroupDetails response:', res.data)
      return res.data
    })
  },
  joinByToken(token: string) {
    return api.post<StudyGroupDTO>('/api/groups/join', { token }).then((res) => res.data)
  },
  leaveGroup(groupId: string) {
    return api.post<void>(`/api/groups/${groupId}/leave`).then((res) => res.data)
  },
  deleteGroup(groupId: string) {
    return api.delete<void>(`/api/groups/${groupId}`)
  },
  createInvite(groupId: string) {
    return api.post<InviteResponse>(`/api/groups/${groupId}/invites`).then((res) => res.data)
  },
  getGroupMembers(groupId: string) {
    console.log('🔍 Calling getGroupMembers for groupId:', groupId)
    return api.get<MemberResponse[]>(`/api/groups/${groupId}/members`).then((res) => {
      console.log('🔍 getGroupMembers response:', res.data)
      return res.data
    })
  },
  updateMemberRole(groupId: string, userId: string, role: 'member' | 'admin') {
    return api.patch<MemberResponse>(`/api/groups/${groupId}/members/${userId}`, { userId, role }).then((res) => res.data)
  },
  removeMember(groupId: string, userId: string) {
    return api.delete<void>(`/api/groups/${groupId}/members/${userId}`)
  },
  inviteByEmail(groupId: string, email: string) {
    return api.post<void>(`/api/groups/${groupId}/invite-by-email`, { email })
  },
  getGroupResources(groupId: string) {
    return api.get<ResourceResponse[]>(`/api/groups/${groupId}/resources`).then((res) => res.data)
  },
  getUploadUrl(groupId: string, request: UploadResourceInitRequest) {
    return api.post<UploadResourceInitResponse>(`/api/groups/${groupId}/resources/upload-url`, request).then((res) => res.data)
  },
  completeResourceUpload(groupId: string, request: UploadResourceCompleteRequest) {
    return api.post<ResourceResponse>(`/api/groups/${groupId}/resources`, request).then((res) => res.data)
  },
  deleteResource(groupId: string, resourceId: string) {
    return api.delete<void>(`/api/groups/${groupId}/resources/${resourceId}`)
  },
}
