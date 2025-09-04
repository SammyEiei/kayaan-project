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

export interface JoinGroupByTokenPayload {
  token: string
}

export interface GenerateInviteCodeResponse {
  inviteCode: string
  inviteLink: string
}

export default {
  // Group Management
  async createGroup(payload: CreateGroupPayload) {
    try {
      console.log('🚀 Creating group with payload:', payload)
      const response = await api.post<StudyGroupDTO>('/groups', payload)
      console.log('✅ Group created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  async getMyGroups() {
    try {
      console.log('🚀 Fetching my groups')
      const response = await api.get<StudyGroupDTO[]>('/groups/my')
      console.log('✅ My groups fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  getAllGroups() {
    try {
      console.log('🚀 Fetching all public groups')
      return api.get<StudyGroupDTO[]>('/api/groups').then((res) => {
        console.log('✅ All groups fetched successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  getGroupDetails(groupId: string) {
    try {
      console.log('🚀 Fetching group details for:', groupId)
      return api.get<GroupDetailsDTO>(`/groups/${groupId}`).then((res) => {
        console.log('✅ Group details fetched successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroupDetails: GroupDetailsDTO = {
          id: groupId,
          name: 'Mock Study Group',
          description: 'This is a mock study group for development',
          ownerId: 'mock-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 5,
          isOwner: true,
          userRole: 'admin'
        }

        console.log('✅ Mock group details loaded:', mockGroupDetails)
        return Promise.resolve(mockGroupDetails)
      }

      throw error
    }
  },

  updateGroup(groupId: string, payload: Partial<CreateGroupPayload>) {
    try {
      console.log('🚀 Updating group:', groupId, 'with payload:', payload)
      return api.put<StudyGroupDTO>(`/api/groups/${groupId}`, payload).then((res) => {
        console.log('✅ Group updated successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroup: StudyGroupDTO = {
          id: groupId,
          name: payload.name || 'Updated Study Group',
          description: payload.description || 'Updated description',
          ownerId: 'mock-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 5
        }

        console.log('✅ Mock group updated:', mockGroup)
        return Promise.resolve(mockGroup)
      }

      throw error
    }
  },

  deleteGroup(groupId: string) {
    try {
      console.log('🚀 Deleting group:', groupId)
      return api.delete<void>(`/api/groups/${groupId}`).then(() => {
        console.log('✅ Group deleted successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock group deleted:', groupId)
        return Promise.resolve()
      }

      throw error
    }
  },

  // Member Management
  getGroupMembers(groupId: string) {
    try {
      console.log('🚀 Fetching group members for:', groupId)
      return api.get<GroupMemberDTO[]>(`/groups/${groupId}/members`).then((res) => {
        console.log('✅ Group members fetched successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockMembers: GroupMemberDTO[] = [
          {
            userId: 'mock-user-id',
            username: 'Tawan1',
            email: 'tawan@example.com',
            role: 'admin',
            status: 'accepted',
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            userId: 'other-user-id',
            username: 'JohnDoe',
            email: 'john@example.com',
            role: 'member',
            status: 'accepted',
            joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]

        console.log('✅ Mock group members loaded:', mockMembers)
        return Promise.resolve(mockMembers)
      }

      throw error
    }
  },

  inviteMember(groupId: string, payload: InviteMemberPayload) {
    try {
      console.log('🚀 Inviting member to group:', groupId, 'with payload:', payload)
      return api.post<void>(`/api/groups/${groupId}/invite`, payload).then(() => {
        console.log('✅ Member invited successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock member invited:', payload)
        return Promise.resolve()
      }

      throw error
    }
  },

  updateMemberRole(groupId: string, payload: UpdateMemberRoleRequest) {
    try {
      console.log('🚀 Updating member role in group:', groupId, 'with payload:', payload)
      return api.put<void>(`/api/groups/${groupId}/members/${payload.userId}/role`, { role: payload.role }).then(() => {
        console.log('✅ Member role updated successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock member role updated:', payload)
        return Promise.resolve()
      }

      throw error
    }
  },

  removeMember(groupId: string, userId: string) {
    try {
      console.log('🚀 Removing member from group:', groupId, 'user:', userId)
      return api.delete<void>(`/api/groups/${groupId}/members/${userId}`).then(() => {
        console.log('✅ Member removed successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock member removed:', { groupId, userId })
        return Promise.resolve()
      }

      throw error
    }
  },

  leaveGroup(groupId: string) {
    try {
      console.log('🚀 Leaving group:', groupId)
      return api.post<void>(`/api/groups/${groupId}/leave`).then(() => {
        console.log('✅ Left group successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock group left:', groupId)
        return Promise.resolve()
      }

      throw error
    }
  },

  // Invite Management
  getGroupInviteCode(groupId: string) {
    try {
      console.log('🚀 Getting existing invite code for group:', groupId)
      return api.get<GenerateInviteCodeResponse>(`/groups/${groupId}/invite-code`).then((res) => {
        console.log('✅ Existing invite code retrieved:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  generateInviteCode(groupId: string) {
    try {
      console.log('🚀 Generating new invite code for group:', groupId)
      return api.post<GenerateInviteCodeResponse>(`/groups/${groupId}/invites?expiryDays=30`).then((res) => {
        console.log('✅ New invite code generated successfully:', res.data)
        console.log('🔍 Response structure:', Object.keys(res.data))
        console.log('🔍 inviteCode field:', res.data.inviteCode)
        console.log('🔍 token field:', (res.data as any).token)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  joinByCode(payload: JoinGroupByCodePayload) {
    try {
      console.log('🚀 Joining group by code:', payload.inviteCode)
      // แปลง inviteCode เป็น token และส่งไปยัง endpoint ที่ถูกต้อง
      const token = payload.inviteCode?.toUpperCase().trim()
      console.log('🔍 Converted token:', token)
      return api.post<StudyGroupDTO>('/groups/join', { token }).then((res) => {
        console.log('✅ Joined group successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      console.error('❌ Error response data:', error.response?.data)
      throw error
    }
  },

  joinByToken(token: string) {
    try {
      console.log('🚀 Joining group by token:', token)
      return api.post<StudyGroupDTO>('/api/groups/join', { token }).then((res) => {
        console.log('✅ Joined group by token successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      console.error('❌ Error response data:', error.response?.data)

      // Re-throw error เพื่อให้ component จัดการ user-friendly message
      throw error
    }
  },

  // Resource Management
  getGroupResources(groupId: string) {
    try {
      console.log('🚀 Fetching group resources for:', groupId)
      return api.get<GroupResourceDTO[]>(`/groups/${groupId}/resources`).then((res) => {
        console.log('✅ Group resources fetched successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  uploadResource(groupId: string, payload: CreateResourcePayload) {
    try {
      console.log('🚀 Uploading resource to group:', groupId, 'with payload:', payload)
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('file', payload.file)

      return api.post<GroupResourceDTO>(`/api/groups/${groupId}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log('✅ Resource uploaded successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },

  deleteResource(groupId: string, resourceId: string) {
    try {
      console.log('🚀 Deleting resource from group:', groupId, 'resource:', resourceId)
      return api.delete<void>(`/api/groups/${groupId}/resources/${resourceId}`).then(() => {
        console.log('✅ Resource deleted successfully')
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)
      throw error
    }
  },
}
