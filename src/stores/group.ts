import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import GroupService from '@/service/GroupService'
import UserService from '@/service/UserService'
import { useAuthStore } from '@/stores/auth'
import type {
  StudyGroup,
  GroupMember,
  GroupResource,
  ResourceComment,
  ResourceReaction,
  CreateGroupRequest,
  UpdateGroupRequest,
  InviteMemberRequest,
  GenerateInviteCodeRequest,
  JoinGroupByCodeRequest,
  UpdateMemberRoleRequest,
  UploadResourceRequest,
  AddCommentRequest,
  AddReactionRequest,
} from '@/types/group'

export const useGroupStore = defineStore('group', () => {
  // Helper function to generate invite code
  const generateInviteCode = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // State
  const groups = ref<StudyGroup[]>([])
  const currentGroup = ref<StudyGroup | null>(null)
  const groupMembers = ref<GroupMember[]>([])
  const groupResources = ref<GroupResource[]>([])
  const resourceComments = ref<ResourceComment[]>([])
  const resourceReactions = ref<ResourceReaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const userGroups = computed(() => groups.value)
  const ownedGroups = computed(() => groups.value.filter((g) => g.isOwner))
  const memberGroups = computed(() => groups.value.filter((g) => !g.isOwner))
  const currentGroupMembers = computed(() => groupMembers.value)
  const currentGroupResources = computed(() => groupResources.value)
  const currentUserRole = computed(() => currentGroup.value?.userRole || 'member')
  const canManageGroup = computed(
    () => currentUserRole.value === 'admin',
  )

  // Add computed properties for viewer role and member count
  const viewerRole = computed<'member' | 'admin' | null>(() => {
    const authStore = useAuthStore()
    const uid = authStore.currentUserId?.toString()
    return currentGroupMembers.value.find(m => m.userId === uid)?.role ?? null
  })

  const memberCount = computed(() => currentGroupMembers.value.length)

  // Actions
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()

      // Use real API call instead of mock
      const response = await GroupService.getMyGroups()

      // Transform the response to match StudyGroup interface
      groups.value = response.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        ownerId: group.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: group.createdAt,
        memberCount: group.membersCount ?? 0,
        isOwner: group.ownerId === authStore.currentUserId?.toString(),
        userRole: group.ownerId === authStore.currentUserId?.toString() ? 'admin' : 'member',
      }))
    } catch (err) {
      error.value = 'Failed to fetch groups'
      console.error('fetchGroups error:', err)
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData: CreateGroupRequest) => {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()

      // Use real API call instead of mock
      const response = await GroupService.createGroup(groupData)

      // Transform the response to match StudyGroup interface
      const newGroup: StudyGroup = {
        id: response.id,
        name: response.name,
        description: response.description,
        ownerId: response.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: response.createdAt,
        memberCount: 1, // Creator is the first member
        isOwner: true,
        userRole: 'admin', // Creator should be admin
      }

      groups.value.push(newGroup)

      // Add creator as member with admin role
      const creatorMember: GroupMember = {
        userId: authStore.currentUserId?.toString() || 'unknown',
        username: authStore.currentUserName || 'unknown',
        email: authStore.user?.email || 'unknown',
        role: 'admin',
        status: 'accepted',
        joinedAt: new Date().toISOString(),
      }

      // Add to current group members if this is the current group
      if (currentGroup.value?.id === newGroup.id) {
        groupMembers.value = [creatorMember]
      }

      return newGroup
    } catch (err) {
      error.value = 'Failed to create group'
      console.error('createGroup error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGroupDetails = async (groupId: string) => {
    loading.value = true
    error.value = null
    try {
      console.log('🔍 fetchGroupDetails started for groupId:', groupId)
      const authStore = useAuthStore()
      console.log('🔍 Auth store state in fetchGroupDetails:', {
        token: !!authStore.token,
        userId: authStore.currentUserId,
        user: authStore.user
      })

      // Try to use real API call to get group details
      try {
        console.log('🔍 Calling GroupService.getGroupDetails and getGroupMembers...')
        const [groupResponse, membersResponse] = await Promise.all([
          GroupService.getGroupDetails(groupId),
          GroupService.getGroupMembers(groupId)
        ])

        console.log('🔍 API responses received:', {
          groupResponse,
          membersResponse
        })

        // Transform the response to match StudyGroup interface
        currentGroup.value = {
          id: groupResponse.id,
          name: groupResponse.name,
          description: groupResponse.description,
          ownerId: groupResponse.ownerId,
          inviteLinkToken: Math.random().toString(36).substring(7),
          inviteCode: generateInviteCode(),
          createdAt: groupResponse.createdAt,
          memberCount: groupResponse.membersCount ?? 0,
          isOwner: groupResponse.isOwner || false,
          userRole: groupResponse.userRole || 'member',
        }

        console.log('🔍 Current group set:', currentGroup.value)

        // Transform members response
        try {
          const authStore = useAuthStore()
          console.log('🔍 Fetching group details for groupId:', groupId)
          console.log('🔍 Current user ID:', authStore.currentUserId)
          console.log('🔍 Auth store token debug:', authStore.debugToken)
          console.log('🔍 Members response:', membersResponse)

          // Get user details for each member individually
          const memberPromises = membersResponse.map(async (member) => {
            console.log('🔍 Processing member:', member)
            try {
              // ถ้าเป็น current user ให้ใช้ข้อมูลจาก auth store หรือ /api/users/me
              if (member.userId === authStore.currentUserId?.toString()) {
                console.log('🔍 Current user detected, calling /api/users/me')
                // ลองดึงข้อมูลล่าสุดจาก API
                try {
                  const currentUser = await UserService.getCurrentUser()
                  console.log('🔍 API response for current user:', currentUser)
                  return {
                    userId: member.userId,
                    username: currentUser.username,
                    email: currentUser.email,
                    avatarUrl: currentUser.avatarUrl,
                    role: member.role,
                    status: 'accepted' as const,
                    joinedAt: member.joinedAt,
                  }
                } catch (apiError) {
                  console.warn('🔍 API call failed, using auth store fallback:', apiError)
                  // Fallback ไปใช้ข้อมูลจาก auth store
                  return {
                    userId: member.userId,
                    username: authStore.user?.username || 'Unknown User',
                    email: authStore.user?.email || '',
                    avatarUrl: authStore.user?.avatarUrl,
                    role: member.role,
                    status: 'accepted' as const,
                    joinedAt: member.joinedAt,
                  }
                }
              }

              // สำหรับ user อื่นๆ ให้ใช้ข้อมูลพื้นฐาน (เพราะไม่มี endpoint สำหรับดึงข้อมูล user อื่น)
              console.log('🔍 Other user, using basic info')
              return {
                userId: member.userId,
                username: `User ${member.userId}`,
                email: '',
                avatarUrl: undefined,
                role: member.role,
                status: 'accepted' as const,
                joinedAt: member.joinedAt,
              }
            } catch (userError) {
              console.warn(`🔍 Failed to fetch user details for ${member.userId}:`, userError)
              // Fallback: ใช้ข้อมูลพื้นฐาน
              return {
                userId: member.userId,
                username: `User ${member.userId}`,
                email: '',
                avatarUrl: undefined,
                role: member.role,
                status: 'accepted' as const,
                joinedAt: member.joinedAt,
              }
            }
          })

          groupMembers.value = await Promise.all(memberPromises)
          console.log('🔍 Final group members:', groupMembers.value)

          // ถ้าไม่มี members แต่เป็น owner ให้เพิ่ม creator เป็น admin
          if (groupMembers.value.length === 0 && currentGroup.value?.isOwner) {
            console.log('🔍 No members found, adding creator as admin')
            try {
              const currentUser = await UserService.getCurrentUser()
              const creatorMember = {
                userId: currentUser.id.toString(),
                username: currentUser.username,
                email: currentUser.email,
                avatarUrl: currentUser.avatarUrl,
                role: 'admin' as const,
                status: 'accepted' as const,
                joinedAt: new Date().toISOString(),
              }
              groupMembers.value = [creatorMember]
              console.log('🔍 Added creator as admin:', creatorMember)
            } catch (apiError) {
              console.warn('🔍 Failed to get current user, using auth store fallback:', apiError)
              const creatorMember = {
                userId: authStore.currentUserId?.toString() || '1',
                username: authStore.user?.username || 'Sam1',
                email: authStore.user?.email || 'fxred727@gmail.com',
                avatarUrl: authStore.user?.avatarUrl,
                role: 'admin' as const,
                status: 'accepted' as const,
                joinedAt: new Date().toISOString(),
              }
              groupMembers.value = [creatorMember]
              console.log('🔍 Added creator as admin (fallback):', creatorMember)
            }
          }
        } catch (userError) {
          console.warn('🔍 Failed to fetch user details, using fallback:', userError)
          // Fallback: ใช้ข้อมูลจาก auth store สำหรับ current user
          const authStore = useAuthStore()
          groupMembers.value = membersResponse.map(member => {
            if (member.userId === authStore.currentUserId?.toString()) {
              return {
                userId: member.userId,
                username: authStore.user?.username || 'Unknown User',
                email: authStore.user?.email || '',
                avatarUrl: authStore.user?.avatarUrl,
                role: member.role,
                status: 'accepted' as const,
                joinedAt: member.joinedAt,
              }
            }
            return {
              userId: member.userId,
              username: `User ${member.userId}`,
              email: '',
              avatarUrl: undefined,
              role: member.role,
              status: 'accepted' as const,
              joinedAt: member.joinedAt,
            }
          })

          // ถ้าไม่มี members แต่เป็น owner ให้เพิ่ม creator เป็น admin
          if (groupMembers.value.length === 0 && currentGroup.value?.isOwner) {
            const creatorMember = {
              userId: authStore.currentUserId?.toString() || '1',
              username: authStore.user?.username || 'Sam1',
              email: authStore.user?.email || 'fxred727@gmail.com',
              avatarUrl: authStore.user?.avatarUrl,
              role: 'admin' as const,
              status: 'accepted' as const,
              joinedAt: new Date().toISOString(),
            }
            groupMembers.value = [creatorMember]
            console.log('🔍 Added creator as admin (fallback):', creatorMember)
          }
        }

        // TODO: Add real API call for resources
        groupResources.value = [
          {
            id: '1',
            groupId,
            uploadedBy: 'user1',
            uploaderName: 'john_doe',
            type: 'note',
            title: 'Introduction to Algorithms',
            contentText: 'This is a comprehensive guide...',
            createdAt: '2024-01-17T11:00:00Z',
            commentCount: 3,
            reactionCount: 5,
          },
        ]
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError)
        // Fallback to mock data if API fails
        currentGroup.value = groups.value.find((g) => g.id === groupId) || null

        if (!currentGroup.value) {
          throw new Error('Group not found')
        }

        // Mock members data
        groupMembers.value = [
          {
            userId: '1',
            username: 'sam1',
            email: 'sam1@example.com',
            avatarUrl: undefined,
            role: 'admin',
            status: 'accepted',
            joinedAt: new Date().toISOString(),
          },
        ]
        groupResources.value = [
          {
            id: '1',
            groupId,
            uploadedBy: 'user1',
            uploaderName: 'john_doe',
            type: 'note',
            title: 'Introduction to Algorithms',
            contentText: 'This is a comprehensive guide...',
            createdAt: '2024-01-17T11:00:00Z',
            commentCount: 3,
            reactionCount: 5,
          },
        ]
      }
    } catch (err) {
      error.value = 'Failed to fetch group details'
      console.error('fetchGroupDetails error:', err)
    } finally {
      loading.value = false
    }
  }

  const inviteMember = async (inviteData: InviteMemberRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await groupService.inviteMember(inviteData)
      console.log('Inviting member:', inviteData)
    } catch (err) {
      error.value = 'Failed to invite member'
      console.error('inviteMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMemberRole = async (roleData: UpdateMemberRoleRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await groupService.updateMemberRole(roleData)
      const member = groupMembers.value.find((m) => m.userId === roleData.userId)
      if (member) {
        member.role = roleData.role
      }
    } catch (err) {
      error.value = 'Failed to update member role'
      console.error('updateMemberRole error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadResource = async (resourceData: UploadResourceRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.uploadResource(resourceData)
      // groupResources.value.push(response.data)

      // Mock upload
      const newResource: GroupResource = {
        id: Date.now().toString(),
        groupId: resourceData.groupId,
        uploadedBy: 'current-user',
        uploaderName: 'Current User',
        type: resourceData.type,
        title: resourceData.title,
        contentText: resourceData.contentText,
        contentUrl: resourceData.contentUrl,
        createdAt: new Date().toISOString(),
        commentCount: 0,
        reactionCount: 0,
      }
      groupResources.value.push(newResource)
      return newResource
    } catch (err) {
      error.value = 'Failed to upload resource'
      console.error('uploadResource error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addComment = async (commentData: AddCommentRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.addComment(commentData)
      // resourceComments.value.push(response.data)

      // Mock comment
      const newComment: ResourceComment = {
        id: Date.now().toString(),
        resourceId: commentData.resourceId,
        userId: 'current-user',
        username: 'Current User',
        text: commentData.text,
        createdAt: new Date().toISOString(),
      }
      resourceComments.value.push(newComment)
      return newComment
    } catch (err) {
      error.value = 'Failed to add comment'
      console.error('addComment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addReaction = async (reactionData: AddReactionRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.addReaction(reactionData)
      // resourceReactions.value.push(response.data)

      // Mock reaction
      const newReaction: ResourceReaction = {
        id: Date.now().toString(),
        resourceId: reactionData.resourceId,
        userId: 'current-user',
        emoji: reactionData.emoji,
        createdAt: new Date().toISOString(),
      }
      resourceReactions.value.push(newReaction)
      return newReaction
    } catch (err) {
      error.value = 'Failed to add reaction'
      console.error('addReaction error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const leaveGroup = async (groupId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await groupService.leaveGroup(groupId)
      groups.value = groups.value.filter((g) => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
      }
    } catch (err) {
      error.value = 'Failed to leave group'
      console.error('leaveGroup error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (groupId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await groupService.deleteGroup(groupId)
      groups.value = groups.value.filter((g) => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete group'
      console.error('deleteGroup error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateNewInviteCode = async (request: GenerateInviteCodeRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.generateInviteCode(request)
      // return response.data

      // Mock generation
      const newCode = generateInviteCode(request.codeLength || 6)
      const group = groups.value.find((g) => g.id === request.groupId)
      if (group) {
        group.inviteCode = newCode
      }
      return { inviteCode: newCode }
    } catch (err) {
      error.value = 'Failed to generate invite code'
      console.error('generateNewInviteCode error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const joinGroupByCode = async (request: JoinGroupByCodeRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.joinGroupByCode(request)
      // return response.data

      // Mock join
      const group = groups.value.find((g) => g.inviteCode === request.inviteCode)
      if (!group) {
        throw new Error('Invalid invite code')
      }

      // Add user to group
      const newMember: GroupMember = {
        userId: 'current-user',
        username: 'Current User',
        email: 'current@example.com',
        role: 'member',
        status: 'accepted',
        joinedAt: new Date().toISOString(),
      }
      groupMembers.value.push(newMember)
      group.memberCount++

      return group
    } catch (err) {
      error.value = 'Failed to join group'
      console.error('joinGroupByCode error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resetCurrentGroup = () => {
    currentGroup.value = null
    groupMembers.value = []
    groupResources.value = []
    resourceComments.value = []
    resourceReactions.value = []
  }

  return {
    // State
    groups,
    currentGroup,
    groupMembers,
    groupResources,
    resourceComments,
    resourceReactions,
    loading,
    error,

    // Getters
    userGroups,
    ownedGroups,
    memberGroups,
    currentGroupMembers,
    currentGroupResources,
    currentUserRole,
    canManageGroup,
    viewerRole,
    memberCount,

    // Actions
    fetchGroups,
    createGroup,
    fetchGroupDetails,
    inviteMember,
    updateMemberRole,
    uploadResource,
    addComment,
    addReaction,
    leaveGroup,
    deleteGroup,
    generateNewInviteCode,
    joinGroupByCode,
    clearError,
    resetCurrentGroup,
  }
})
