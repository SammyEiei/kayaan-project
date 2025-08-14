import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import GroupService from '@/service/GroupService'
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
    () => currentUserRole.value === 'owner' || currentUserRole.value === 'moderator',
  )

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
        ownerId: authStore.currentUserId?.toString() || 'unknown',
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: new Date().toISOString(),
        memberCount: group.membersCount,
        isOwner: true, // This should be determined by comparing ownerId with current user
        userRole: 'owner', // This should be determined by the API response
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
        ownerId: authStore.currentUserId?.toString() || 'unknown',
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: new Date().toISOString(),
        memberCount: response.membersCount,
        isOwner: true,
        userRole: 'owner',
      }

      groups.value.push(newGroup)
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
      // TODO: Replace with actual API calls
      // const [groupResponse, membersResponse, resourcesResponse] = await Promise.all([
      //   groupService.getGroup(groupId),
      //   groupService.getGroupMembers(groupId),
      //   groupService.getGroupResources(groupId)
      // ])

      // Mock data
      currentGroup.value = groups.value.find((g) => g.id === groupId) || null
      groupMembers.value = [
        {
          userId: 'user1',
          username: 'john_doe',
          email: 'john@example.com',
          role: 'owner',
          status: 'accepted',
          joinedAt: '2024-01-15T10:00:00Z',
        },
        {
          userId: 'user2',
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'member',
          status: 'accepted',
          joinedAt: '2024-01-16T09:00:00Z',
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
