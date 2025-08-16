import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import GroupService from '@/service/GroupService'
import UserService from '@/service/UserService'
import { useAuthStore } from '@/stores/auth'
import { mapGroupDto } from '@/utils/mapGroupDto'
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
  const canManageGroup = computed(() => currentUserRole.value === 'admin')
  const memberCount = computed(() => groupMembers.value.length)
  const viewerRole = computed(() => currentGroup.value?.userRole || 'member')

  // Actions
  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const auth = useAuthStore()
      const response = await GroupService.getMyGroups()

      // Transform DTO to StudyGroup interface using mapGroupDto
      groups.value = response.map((groupDto) => {
        const mapped = mapGroupDto(groupDto as unknown as Record<string, unknown>, auth.currentUserId ?? auth.user?.id ?? '')
        return {
          ...mapped,
          inviteLinkToken: Math.random().toString(36).substring(7),
          inviteCode: generateInviteCode(),
          memberCount: (groupDto as unknown as Record<string, unknown>).membersCount as number || 0,
          userRole: mapped.isOwner ? 'admin' : 'member',
        }
      })
    } catch (err) {
      error.value = 'Failed to fetch groups'
      console.error('fetchGroups error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData: CreateGroupRequest) => {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
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
      const [groupResponse, membersResponse, resourcesResponse] = await Promise.all([
        GroupService.getGroupDetails(groupId),
        GroupService.getGroupMembers(groupId),
        GroupService.getGroupResources(groupId),
      ])

      // Transform group details
      const group: StudyGroup = {
        id: groupResponse.id,
        name: groupResponse.name,
        description: groupResponse.description,
        ownerId: groupResponse.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: groupResponse.createdAt,
        memberCount: groupResponse.membersCount || 0,
        isOwner: groupResponse.isOwner || false,
        userRole: groupResponse.userRole || 'member',
      }

      currentGroup.value = group

      // Transform members
      groupMembers.value = membersResponse.map((member) => ({
        userId: member.userId,
        username: member.username || `User #${member.userId}`,
        email: member.email || 'No email',
        avatarUrl: member.avatarUrl,
        role: member.role,
        status: member.status,
        joinedAt: member.joinedAt,
      }))

      // Transform resources
      groupResources.value = resourcesResponse.map((resource) => ({
        id: resource.id,
        groupId: resource.groupId,
        title: resource.title,
        description: resource.description,
        fileUrl: resource.fileUrl,
        fileType: resource.fileType,
        fileSize: resource.fileSize,
        uploaderId: resource.uploaderId,
        uploaderName: resource.uploaderName,
        createdAt: resource.createdAt,
        comments: [],
        reactions: [],
      }))

      return group
    } catch (err) {
      error.value = 'Failed to fetch group details'
      console.error('fetchGroupDetails error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const leaveGroup = async (groupId: string) => {
    loading.value = true
    error.value = null
    try {
      await GroupService.leaveGroup(groupId)

      // Remove from local state
      groups.value = groups.value.filter((g) => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
        groupMembers.value = []
        groupResources.value = []
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
      await GroupService.deleteGroup(groupId)

      // Remove from local state
      groups.value = groups.value.filter((g) => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
        groupMembers.value = []
        groupResources.value = []
      }
    } catch (err) {
      error.value = 'Failed to delete group'
      console.error('deleteGroup error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMemberRole = async (roleData: UpdateMemberRoleRequest) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      await GroupService.updateMemberRole(currentGroup.value.id, roleData)

      // Update local state
      const memberIndex = groupMembers.value.findIndex(m => m.userId === roleData.userId)
      if (memberIndex !== -1) {
        groupMembers.value[memberIndex].role = roleData.role
      }
    } catch (err) {
      error.value = 'Failed to update member role'
      console.error('updateMemberRole error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeMember = async (userId: string) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      await GroupService.removeMember(currentGroup.value.id, userId)

      // Remove from local state
      groupMembers.value = groupMembers.value.filter(m => m.userId !== userId)

      // Update member count
      if (currentGroup.value) {
        currentGroup.value.memberCount = groupMembers.value.length
      }
    } catch (err) {
      error.value = 'Failed to remove member'
      console.error('removeMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const inviteMember = async (inviteData: InviteMemberRequest) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      await GroupService.inviteMember(currentGroup.value.id, {
        email: inviteData.email,
        role: inviteData.role || 'member',
      })
    } catch (err) {
      error.value = 'Failed to invite member'
      console.error('inviteMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateNewInviteCode = async (request: GenerateInviteCodeRequest) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      const response = await GroupService.generateInviteCode(currentGroup.value.id)

      // Update current group with new invite code
      if (currentGroup.value) {
        currentGroup.value.inviteCode = response.inviteCode
      }

      return response
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
      const response = await GroupService.joinByCode(request)

      // Transform and add to groups list
      const newGroup: StudyGroup = {
        id: response.id,
        name: response.name,
        description: response.description,
        ownerId: response.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: response.createdAt,
        memberCount: response.membersCount || 0,
        isOwner: false,
        userRole: 'member',
      }

      groups.value.push(newGroup)
      return newGroup
    } catch (err) {
      error.value = 'Failed to join group'
      console.error('joinGroupByCode error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadResource = async (resourceData: UploadResourceRequest) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      const response = await GroupService.uploadResource(currentGroup.value.id, {
        title: resourceData.title,
        description: resourceData.description,
        file: resourceData.file,
      })

      // Transform and add to resources list
      const newResource: GroupResource = {
        id: response.id,
        groupId: response.groupId,
        title: response.title,
        description: response.description,
        fileUrl: response.fileUrl,
        fileType: response.fileType,
        fileSize: response.fileSize,
        uploaderId: response.uploaderId,
        uploaderName: response.uploaderName,
        createdAt: response.createdAt,
        comments: [],
        reactions: [],
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

  const deleteResource = async (resourceId: string) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      await GroupService.deleteResource(currentGroup.value.id, resourceId)

      // Remove from local state
      groupResources.value = groupResources.value.filter(r => r.id !== resourceId)
    } catch (err) {
      error.value = 'Failed to delete resource'
      console.error('deleteResource error:', err)
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
        content: commentData.content,
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
        reactionType: reactionData.reactionType,
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
    memberCount,
    viewerRole,

    // Actions
    fetchGroups,
    createGroup,
    fetchGroupDetails,
    leaveGroup,
    deleteGroup,
    updateMemberRole,
    removeMember,
    inviteMember,
    generateNewInviteCode,
    joinGroupByCode,
    uploadResource,
    deleteResource,
    addComment,
    addReaction,
  }
})
