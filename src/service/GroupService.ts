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
  id: string | number
  groupId: string
  title: string
  description: string
  fileUrl: string | null
  mimeType?: string | null
  fileType?: string | null
  fileSize: number | null
  uploaderId: string | number
  uploaderName?: string
  createdAt: string
  updatedAt?: string
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
  tags?: string[]
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
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        const mockGroup: StudyGroupDTO = {
          id: 'mock-group-id',
          name: payload.name,
          description: payload.description,
          ownerId: 'mock-user-id',
          createdAt: new Date().toISOString(),
          membersCount: 1
        }
        console.log('✅ Mock group created:', mockGroup)
        return mockGroup
      }

      throw axiosError
    }
  },

  async getMyGroups() {
    try {
      console.log('🚀 Fetching my groups')
      const response = await api.get<StudyGroupDTO[]>('/groups/my')
      console.log('✅ My groups fetched successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        const mockGroups: StudyGroupDTO[] = [
          {
            id: 'mock-group-1',
            name: 'Mock Study Group 1',
            description: 'This is a mock study group for development',
            ownerId: 'mock-user-id',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 5
          },
          {
            id: 'mock-group-2',
            name: 'Mock Study Group 2',
            description: 'Another mock study group for development',
            ownerId: 'mock-user-id',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 3
          }
        ]
        console.log('✅ Mock groups loaded:', mockGroups)
        return mockGroups
      }

      throw axiosError
    }
  },

  getAllGroups() {
    try {
      console.log('🚀 Fetching all public groups')
      return api.get<StudyGroupDTO[]>('/groups').then((res) => {
        console.log('✅ All groups fetched successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        const mockGroups: StudyGroupDTO[] = [
          {
            id: 'public-group-1',
            name: 'Public Study Group 1',
            description: 'A public study group for everyone',
            ownerId: 'other-user-id',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            membersCount: 8
          }
        ]
        console.log('✅ Mock public groups loaded:', mockGroups)
        return Promise.resolve(mockGroups)
      }

      throw axiosError
    }
  },

  getGroupDetails(groupId: string) {
    try {
      console.log('🚀 Fetching group details for:', groupId)
      return api.get<GroupDetailsDTO>(`/groups/${groupId}`).then((res) => {
        console.log('✅ Group details fetched successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
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

      throw axiosError
    }
  },

  updateGroup(groupId: string, payload: Partial<CreateGroupPayload>) {
    try {
      console.log('🚀 Updating group:', groupId, 'with payload:', payload)
      return api.put<StudyGroupDTO>(`/groups/${groupId}`, payload).then((res) => {
        console.log('✅ Group updated successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
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

      throw axiosError
    }
  },

  deleteGroup(groupId: string) {
    try {
      console.log('🚀 Deleting group:', groupId)

      // เรียก API จริงก่อนเสมอ
      return api.delete<void>(`/groups/${groupId}?confirm=true`).then(() => {
        console.log('✅ Group deleted successfully')
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        console.log('✅ Mock group deleted (fallback):', groupId)
        return Promise.resolve()
      }

      throw axiosError
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
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
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

      throw axiosError
    }
  },

  inviteMember(groupId: string, payload: InviteMemberPayload) {
    try {
      console.log('🚀 Inviting member to group:', groupId, 'with payload:', payload)
      return api.post<void>(`/groups/${groupId}/invite`, payload).then(() => {
        console.log('✅ Member invited successfully')
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        console.log('✅ Mock member invited:', payload)
        return Promise.resolve()
      }

      throw axiosError
    }
  },

  updateMemberRole(groupId: string, payload: UpdateMemberRoleRequest) {
    try {
      console.log('🚀 Updating member role in group:', groupId, 'with payload:', payload)
      return api.put<void>(`/groups/${groupId}/members/${payload.userId}/role`, { role: payload.role }).then(() => {
        console.log('✅ Member role updated successfully')
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        console.log('✅ Mock member role updated:', payload)
        return Promise.resolve()
      }

      throw axiosError
    }
  },

  removeMember(groupId: string, userId: string) {
    try {
      console.log('🚀 Removing member from group:', groupId, 'user:', userId)
      return api.delete<void>(`/groups/${groupId}/members/${userId}`).then(() => {
        console.log('✅ Member removed successfully')
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        console.log('✅ Mock member removed:', { groupId, userId })
        return Promise.resolve()
      }

      throw axiosError
    }
  },

  async leaveGroup(groupId: string, confirm: boolean = false) {
    try {
      console.log('🚀 Leaving group:', groupId, 'confirm:', confirm)

      // First attempt without confirmation to trigger 428 response
      if (!confirm) {
        try {
          await api.post<void>(`/groups/${groupId}/leave`)
          console.log('✅ Left group successfully')
          return
        } catch (error: unknown) {
          const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
          if (axiosError.response?.status === 428) {
            // Confirmation required - this is expected behavior
            throw new Error('CONFIRMATION_REQUIRED')
          }
          throw axiosError
        }
      }

      // Second attempt with confirmation
      await api.post<void>(`/groups/${groupId}/leave?confirm=true`)
      console.log('✅ Left group successfully with confirmation')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Handle specific error cases according to API documentation
      if (axiosError.response?.status === 404) {
        throw new Error('USER_NOT_MEMBER')
      } else if (axiosError.response?.status === 400) {
        throw new Error('OWNER_CANNOT_LEAVE_ALONE')
      } else if (axiosError.response?.status === 401) {
        throw new Error('AUTHENTICATION_REQUIRED')
      }

      // Mock response เฉพาะเมื่อ API ล้มเหลวใน development mode
      if (import.meta.env.DEV) {
        console.log('✅ Mock group left:', groupId)
        return Promise.resolve()
      }

      throw axiosError
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
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  generateInviteCode(groupId: string) {
    try {
      console.log('🚀 Generating new invite code for group:', groupId)
      return api.post<GenerateInviteCodeResponse>(`/groups/${groupId}/invites?expiryDays=30`).then((res) => {
        console.log('✅ New invite code generated successfully:', res.data)
        console.log('🔍 Response structure:', Object.keys(res.data))
        console.log('🔍 inviteCode field:', res.data.inviteCode)
        console.log('🔍 token field:', (res.data as { token?: string }).token)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
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
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      console.error('❌ Error response data:', axiosError.response?.data)
      throw axiosError
    }
  },

  joinByToken(token: string) {
    try {
      console.log('🚀 Joining group by token:', token)
      return api.post<StudyGroupDTO>('/groups/join', { token }).then((res) => {
        console.log('✅ Joined group by token successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      console.error('❌ Error response data:', axiosError.response?.data)

      // Re-throw error เพื่อให้ component จัดการ user-friendly message
      throw axiosError
    }
  },

  // Resource Management
  getGroupResources(groupId: string, params?: { search?: string; type?: string; page?: number; size?: number }) {
    try {
      console.log('🚀 Fetching group resources for:', groupId, 'with params:', params)

      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.type) queryParams.append('type', params.type)
      if (params?.page !== undefined) queryParams.append('page', params.page.toString())
      if (params?.size !== undefined) queryParams.append('size', params.size.toString())

      const url = `/groups/${groupId}/resources${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      return api.get<GroupResourceDTO[]>(url).then((res) => {
        console.log('✅ Group resources fetched successfully:', res.data)
        console.log('🔍 First resource sample:', res.data[0])
        if (res.data[0]) {
          console.log('🔍 Resource fields check:', {
            contentType: res.data[0].contentType,
            contentData: res.data[0].contentData,
            contentSource: res.data[0].contentSource
          })
        }
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  uploadResource(groupId: string, payload: CreateResourcePayload) {
    try {
      console.log('🚀 Uploading resource to group:', groupId, 'with payload:', payload)
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('file', payload.file)

      return api.post<GroupResourceDTO>(`/groups/${groupId}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log('✅ Resource uploaded successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Share Study Content
  shareStudyContent(groupId: string, payload: { contentId: string; title: string; description?: string; tags?: string[] }) {
    try {
      console.log('🚀 Sharing study content to group:', groupId, 'with payload:', payload)

      return api.post<GroupResourceDTO>(`/groups/${groupId}/resources/share-content`, payload).then((res) => {
        console.log('✅ Study content shared successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Handle specific error cases
      if (axiosError.response?.status === 400) {
        throw new Error('INVALID_CONTENT_ID_FORMAT')
      } else if (axiosError.response?.status === 403) {
        throw new Error('ACCESS_DENIED')
      } else if (axiosError.response?.status === 404) {
        throw new Error('CONTENT_NOT_FOUND')
      }

      throw axiosError
    }
  },

  // New method for sharing interactive content with contentType and contentData
  shareInteractiveContent(groupId: string, payload: {
    contentId: string;
    title: string;
    description?: string;
    tags?: string[];
    contentType: 'flashcard' | 'quiz' | 'note';
    contentData: string;
  }) {
    try {
      console.log('🚀 Sharing interactive content to group:', groupId, 'with payload:', payload)

      return api.post<GroupResourceDTO>(`/groups/${groupId}/resources/share-content`, payload).then((res) => {
        console.log('✅ Interactive content shared successfully:', res.data)
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)

      // Handle specific error cases
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response?.data as { message?: string }
        if (errorData?.message?.includes('contentType')) {
          throw new Error('INVALID_CONTENT_TYPE')
        } else if (errorData?.message?.includes('contentData')) {
          throw new Error('INVALID_CONTENT_DATA')
        }
        throw new Error('INVALID_CONTENT_ID_FORMAT')
      } else if (axiosError.response?.status === 403) {
        throw new Error('ACCESS_DENIED')
      } else if (axiosError.response?.status === 404) {
        throw new Error('CONTENT_NOT_FOUND')
      }

      throw axiosError
    }
  },

  // Get individual resource
  getGroupResource(groupId: string, resourceId: string) {
    try {
      console.log('🚀 Fetching group resource:', groupId, 'resource:', resourceId)
      return api.get<GroupResourceDTO>(`/groups/${groupId}/resources/${resourceId}`).then((res) => {
        console.log('✅ Group resource fetched successfully:', res.data)
        console.log('🔍 Resource details:', {
          contentType: res.data.contentType,
          contentData: res.data.contentData,
          contentSource: res.data.contentSource
        })
        return res.data
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Get specific resource (alias for getGroupResource)
  getResource(groupId: string, resourceId: string) {
    return this.getGroupResource(groupId, resourceId)
  },

  deleteResource(groupId: string, resourceId: string) {
    try {
      console.log('🚀 Deleting resource from group:', groupId, 'resource:', resourceId)
      return api.delete<void>(`/groups/${groupId}/resources/${resourceId}`).then(() => {
        console.log('✅ Resource deleted successfully')
      })
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Group Posts Management
  async createPost(groupId: string, payload: {
    title: string;
    description: string;
    content: string;
    contentType: 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED';
    attachments?: File[];
    tags?: string[];
  }) {
    try {
      console.log('🚀 Creating post in group:', groupId, 'with payload:', payload)

      // Validate required fields
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required')
      }
      if (!payload.title || payload.title.trim() === '') {
        throw new Error('Post title is required')
      }
      if (!payload.description || payload.description.trim() === '') {
        throw new Error('Post description is required')
      }
      if (!payload.content || payload.content.trim() === '') {
        throw new Error('Post content is required')
      }
      if (!payload.contentType) {
        throw new Error('Content type is required')
      }

      // Send JSON payload instead of FormData
      const jsonPayload = {
        title: payload.title.trim(),
        description: payload.description.trim(),
        content: payload.content.trim(),
        contentType: payload.contentType,
        tags: payload.tags || []
      }

      console.log('📤 Sending JSON payload to backend:', jsonPayload)
      console.log('🌐 API endpoint:', `/groups/${groupId}/posts`)

      const response = await api.post(`/groups/${groupId}/posts`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('✅ Post created successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async getGroupPosts(groupId: string, params?: {
    page?: number;
    size?: number;
    sortBy?: 'createdAt' | 'likesCount';
    sortDirection?: 'ASC' | 'DESC';
  }) {
    try {
      console.log('🚀 Fetching posts for group:', groupId, 'with params:', params)

      const queryParams = new URLSearchParams()
      if (params?.page !== undefined) queryParams.append('page', params.page.toString())
      if (params?.size !== undefined) queryParams.append('size', params.size.toString())
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)

      const url = `/groups/${groupId}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await api.get(url)
      console.log('✅ Group posts fetched successfully:', response.data)

      // ตั้งค่า comments เป็น empty array สำหรับ posts list และ debug likes data
      if (response.data.content) {
        response.data.content.forEach((post: unknown, index: number) => {
          if (post && typeof post === 'object') {
            const postObj = post as { comments?: unknown[]; likes?: number; likesCount?: number }
            console.log(`🔍 Post ${index}:`, {
              id: (post as { id?: string }).id,
              likes: postObj.likes,
              likesCount: postObj.likesCount,
              title: (post as { title?: string }).title,
              contentType: (post as { contentType?: string }).contentType,
              content: (post as { content?: string }).content?.substring(0, 100) + '...'
            })
            postObj.comments = []
          }
        })
      } else if (Array.isArray(response.data)) {
        response.data.forEach((post: unknown, index: number) => {
          if (post && typeof post === 'object') {
            const postObj = post as { comments?: unknown[]; likes?: number; likesCount?: number }
            console.log(`🔍 Post ${index}:`, {
              id: (post as { id?: string }).id,
              likes: postObj.likes,
              likesCount: postObj.likesCount,
              title: (post as { title?: string }).title,
              contentType: (post as { contentType?: string }).contentType,
              content: (post as { content?: string }).content?.substring(0, 100) + '...'
            })
            postObj.comments = []
          }
        })
      }

      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async getPost(groupId: string, postId: string, includeComments: boolean = false) {
    try {
      console.log('🚀 Fetching post:', groupId, 'post:', postId, 'includeComments:', includeComments)

      const url = `/groups/${groupId}/posts/${postId}${includeComments ? '?includeComments=true' : ''}`
      const response = await api.get(url)
      console.log('✅ Post fetched successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Method สำหรับ fetch comments ของ post
  async getPostComments(groupId: string, postId: string) {
    try {
      console.log('🚀 Fetching comments for post:', groupId, 'post:', postId)

      const response = await api.get(`/groups/${groupId}/posts/${postId}/comments`)
      console.log('✅ Post comments fetched successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async updatePost(groupId: string, postId: string, payload: {
    title?: string;
    description?: string;
    content: string;
    tags?: string[];
  }) {
    try {
      console.log('🚀 Updating post:', groupId, 'post:', postId, 'with payload:', payload)

      // Ensure JSON format
      const jsonPayload = {
        title: payload.title,
        description: payload.description,
        content: payload.content,
        tags: payload.tags || []
      }

      const response = await api.put(`/groups/${groupId}/posts/${postId}`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ Post updated successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async deletePost(groupId: string, postId: string) {
    try {
      console.log('🚀 Deleting post:', groupId, 'post:', postId)
      await api.delete(`/groups/${groupId}/posts/${postId}`)
      console.log('✅ Post deleted successfully')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async likePost(groupId: string, postId: string) {
    try {
      // Validate parameters
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required')
      }
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required')
      }

      console.log('🚀 GroupService: Liking post:', groupId, 'post:', postId)
      console.log('🚀 GroupService: API URL:', `/groups/${groupId}/posts/${postId}/like`)

      const response = await api.post(`/groups/${groupId}/posts/${postId}/like`)
      console.log('✅ GroupService: Post liked successfully:', response.data)
      console.log('✅ GroupService: Response status:', response.status)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ GroupService: Backend API failed:', axiosError.response?.status, axiosError.message)
      console.error('❌ GroupService: Full error:', axiosError)
      throw axiosError
    }
  },

  async unlikePost(groupId: string, postId: string) {
    try {
      console.log('🚀 Unliking post:', groupId, 'post:', postId)
      await api.delete(`/groups/${groupId}/posts/${postId}/like`)
      console.log('✅ Post unliked successfully')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async isPostLiked(groupId: string, postId: string) {
    try {
      console.log('🚀 Checking if post is liked:', groupId, 'post:', postId)
      const response = await api.get(`/groups/${groupId}/posts/${postId}/liked`)
      console.log('✅ Post like status checked:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Post Comments Management
  async createComment(groupId: string, postId: string, payload: {
    content: string;
    parentCommentId?: string;
  }) {
    try {
      // Validate parameters
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required')
      }
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required')
      }
      if (!payload.content || payload.content.trim() === '') {
        throw new Error('Comment content is required')
      }

      console.log('🚀 Creating comment for post:', groupId, 'post:', postId, 'with payload:', payload)

      const jsonPayload = {
        content: payload.content,
        parentCommentId: payload.parentCommentId || null
      }

      const response = await api.post(`/groups/${groupId}/posts/${postId}/comments`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ Comment created successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },


  async updateComment(groupId: string, postId: string, commentId: string, payload: {
    content: string;
  }) {
    try {
      console.log('🚀 Updating comment:', groupId, 'post:', postId, 'comment:', commentId, 'with payload:', payload)

      const jsonPayload = {
        content: payload.content
      }

      const response = await api.put(`/groups/${groupId}/posts/${postId}/comments/${commentId}`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ Comment updated successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async deleteComment(groupId: string, postId: string, commentId: string) {
    try {
      console.log('🚀 Deleting comment:', groupId, 'post:', postId, 'comment:', commentId)
      await api.delete(`/groups/${groupId}/posts/${postId}/comments/${commentId}`)
      console.log('✅ Comment deleted successfully')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async likeComment(groupId: string, postId: string, commentId: string) {
    try {
      console.log('🚀 Liking comment:', groupId, 'post:', postId, 'comment:', commentId)
      const response = await api.post(`/groups/${groupId}/posts/${postId}/comments/${commentId}/like`)
      console.log('✅ Comment liked successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async unlikeComment(groupId: string, postId: string, commentId: string) {
    try {
      console.log('🚀 Unliking comment:', groupId, 'post:', postId, 'comment:', commentId)
      await api.delete(`/groups/${groupId}/posts/${postId}/comments/${commentId}/like`)
      console.log('✅ Comment unliked successfully')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Search and Filter Posts
  async searchPosts(groupId: string, params: {
    q: string;
    page?: number;
    size?: number;
  }) {
    try {
      console.log('🚀 Searching posts in group:', groupId, 'with params:', params)

      const queryParams = new URLSearchParams()
      queryParams.append('q', params.q)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())

      const url = `/groups/${groupId}/posts/search?${queryParams.toString()}`

      const response = await api.get(url)
      console.log('✅ Posts search completed:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async filterPosts(groupId: string, params: {
    contentType?: 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED';
    page?: number;
    size?: number;
  }) {
    try {
      console.log('🚀 Filtering posts in group:', groupId, 'with params:', params)

      const queryParams = new URLSearchParams()
      if (params.contentType) queryParams.append('contentType', params.contentType)
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())

      const url = `/groups/${groupId}/posts/filter?${queryParams.toString()}`

      const response = await api.get(url)
      console.log('✅ Posts filtered successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async getPinnedPosts(groupId: string) {
    try {
      console.log('🚀 Fetching pinned posts for group:', groupId)
      const response = await api.get(`/groups/${groupId}/posts/pinned`)
      console.log('✅ Pinned posts fetched successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async getPostsCount(groupId: string) {
    try {
      console.log('🚀 Getting posts count for group:', groupId)
      const response = await api.get(`/groups/${groupId}/posts/count`)
      console.log('✅ Posts count fetched successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // File Attachments Management
  async uploadAttachment(groupId: string, postId: string, file: File) {
    try {
      console.log('🚀 Uploading attachment for post:', groupId, 'post:', postId, 'file:', file.name)

      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post(`/groups/${groupId}/posts/${postId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('✅ Attachment uploaded successfully:', response.data)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  // Create post with attachments (two-step process)
  async createPostWithAttachments(groupId: string, payload: {
    title: string;
    description: string;
    content: string;
    contentType: 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED';
    attachments?: File[];
    tags?: string[];
  }) {
    try {
      console.log('🚀 Creating post with attachments:', groupId, 'with payload:', payload)

      // Validate required fields
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required')
      }
      if (!payload.title || payload.title.trim() === '') {
        throw new Error('Post title is required')
      }
      if (!payload.description || payload.description.trim() === '') {
        throw new Error('Post description is required')
      }
      if (!payload.content || payload.content.trim() === '') {
        throw new Error('Post content is required')
      }
      if (!payload.contentType) {
        throw new Error('Content type is required')
      }

      // Step 1: Create the post first
      const postPayload = {
        title: payload.title.trim(),
        description: payload.description.trim(),
        content: payload.content.trim(),
        contentType: payload.contentType,
        tags: payload.tags || []
      }

      const postResponse = await api.post(`/groups/${groupId}/posts`, postPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('✅ Post created successfully:', postResponse.data)

      // Step 2: Upload attachments if any
      if (payload.attachments && payload.attachments.length > 0) {
        const postId = postResponse.data.id
        const attachmentPromises = payload.attachments.map(file =>
          this.uploadAttachment(groupId, postId, file)
        )

        const attachmentResponses = await Promise.all(attachmentPromises)
        console.log('✅ All attachments uploaded successfully:', attachmentResponses)

        // Update the post response with attachment info
        postResponse.data.attachments = attachmentResponses
      }

      return postResponse.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },

  async deleteAttachment(groupId: string, postId: string, attachmentId: string) {
    try {
      console.log('🚀 Deleting attachment:', groupId, 'post:', postId, 'attachment:', attachmentId)
      await api.delete(`/groups/${groupId}/posts/${postId}/attachments/${attachmentId}`)
      console.log('✅ Attachment deleted successfully')
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
      console.error('❌ Backend API failed:', axiosError.response?.status, axiosError.message)
      throw axiosError
    }
  },
}
