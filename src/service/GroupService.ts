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
  async createGroup(payload: CreateGroupPayload) {
    try {
      console.log('🚀 Creating group with payload:', payload)
      const response = await api.post<StudyGroupDTO>('/api/groups', payload)
      console.log('✅ Group created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroup: StudyGroupDTO = {
          id: `mock-${Date.now()}`,
          name: payload.name,
          description: payload.description,
          ownerId: 'mock-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 1
        }

        console.log('✅ Mock group created:', mockGroup)
        return mockGroup
      }

      throw error
    }
  },

  async getMyGroups() {
    try {
      console.log('🚀 Fetching my groups')
      const response = await api.get<StudyGroupDTO[]>('/api/groups/my')
      console.log('✅ My groups fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroups: StudyGroupDTO[] = [
          {
            id: 'mock-1',
            name: 'Computer Science Study Group',
            description: 'A group for studying computer science topics',
            ownerId: 'mock-user-id',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 5
          },
          {
            id: 'mock-2',
            name: 'Mathematics Study Group',
            description: 'Advanced mathematics and problem solving',
            ownerId: 'other-user-id',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 12
          }
        ]

        console.log('✅ Mock groups loaded:', mockGroups)
        return mockGroups
      }

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

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroups: StudyGroupDTO[] = [
          {
            id: 'public-1',
            name: 'Public Study Group 1',
            description: 'A public study group for everyone',
            ownerId: 'public-user-id',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 15
          },
          {
            id: 'public-2',
            name: 'Public Study Group 2',
            description: 'Another public study group',
            ownerId: 'another-user-id',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 8
          }
        ]

        console.log('✅ Mock public groups loaded:', mockGroups)
        return Promise.resolve(mockGroups)
      }

      throw error
    }
  },

  getGroupDetails(groupId: string) {
    try {
      console.log('🚀 Fetching group details for:', groupId)
      return api.get<GroupDetailsDTO>(`/api/groups/${groupId}`).then((res) => {
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
      return api.get<GroupMemberDTO[]>(`/api/groups/${groupId}/members`).then((res) => {
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
  generateInviteCode(groupId: string) {
    try {
      console.log('🚀 Generating invite code for group:', groupId)
      return api.post<GenerateInviteCodeResponse>(`/api/groups/${groupId}/invite-code`).then((res) => {
        console.log('✅ Invite code generated successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockInviteCode: GenerateInviteCodeResponse = {
          inviteCode: 'MOCK' + Math.random().toString(36).substr(2, 4).toUpperCase(),
          inviteLink: `${window.location.origin}/join-group/${groupId}`
        }

        console.log('✅ Mock invite code generated:', mockInviteCode)
        return Promise.resolve(mockInviteCode)
      }

      throw error
    }
  },

  joinByCode(payload: JoinGroupByCodePayload) {
    try {
      console.log('🚀 Joining group by code:', payload.inviteCode)
      return api.post<StudyGroupDTO>('/api/groups/join', payload).then((res) => {
        console.log('✅ Joined group successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroup: StudyGroupDTO = {
          id: `mock-joined-${Date.now()}`,
          name: 'Joined Study Group',
          description: 'You have successfully joined this study group',
          ownerId: 'other-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 8
        }

        console.log('✅ Mock group joined:', mockGroup)
        return Promise.resolve(mockGroup)
      }

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

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockGroup: StudyGroupDTO = {
          id: `mock-joined-token-${Date.now()}`,
          name: 'Token Joined Study Group',
          description: 'You have successfully joined this study group via token',
          ownerId: 'other-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 6
        }

        console.log('✅ Mock group joined via token:', mockGroup)
        return Promise.resolve(mockGroup)
      }

      throw error
    }
  },

  // Resource Management
  getGroupResources(groupId: string) {
    try {
      console.log('🚀 Fetching group resources for:', groupId)
      return api.get<GroupResourceDTO[]>(`/api/groups/${groupId}/resources`).then((res) => {
        console.log('✅ Group resources fetched successfully:', res.data)
        return res.data
      })
    } catch (error: any) {
      console.error('❌ Backend API failed:', error.response?.status, error.message)

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockResources: GroupResourceDTO[] = [
          {
            id: 'resource-1',
            groupId: groupId,
            title: 'Introduction to Computer Science',
            description: 'Basic concepts and fundamentals',
            fileUrl: '/mock/file1.pdf',
            fileType: 'pdf',
            fileSize: 2048576,
            uploaderId: 'mock-user-id',
            uploaderName: 'Tawan1',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'resource-2',
            groupId: groupId,
            title: 'Mathematics Problem Set',
            description: 'Practice problems and solutions',
            fileUrl: '/mock/file2.pdf',
            fileType: 'pdf',
            fileSize: 1536000,
            uploaderId: 'other-user-id',
            uploaderName: 'JohnDoe',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]

        console.log('✅ Mock group resources loaded:', mockResources)
        return Promise.resolve(mockResources)
      }

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

      // Mock response for development
      if (import.meta.env.DEV) {
        const mockResource: GroupResourceDTO = {
          id: `resource-${Date.now()}`,
          groupId: groupId,
          title: payload.title,
          description: payload.description,
          fileUrl: '/mock/uploaded-file.pdf',
          fileType: payload.file.type || 'application/octet-stream',
          fileSize: payload.file.size,
          uploaderId: 'mock-user-id',
          uploaderName: 'Tawan1',
          createdAt: new Date().toISOString()
        }

        console.log('✅ Mock resource uploaded:', mockResource)
        return Promise.resolve(mockResource)
      }

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

      // Mock response for development
      if (import.meta.env.DEV) {
        console.log('✅ Mock resource deleted:', { groupId, resourceId })
        return Promise.resolve()
      }

      throw error
    }
  },
}
