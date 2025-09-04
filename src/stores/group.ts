import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import GroupService from '@/service/GroupService'
import UserService from '@/service/UserService'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
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
  CreatePostRequest,
  UpdatePostRequest,
  AddPostCommentRequest,
  SearchGroupContentRequest,
  GroupSearchFilters,
  GroupPost,
  PostComment,
  UpdateGroupSettingsRequest,
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
  const groupPosts = ref<GroupPost[]>([])

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
          isPrivate: false, // Default value
          maxMembers: undefined,
          tags: []
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

  const createGroup = async (groupData: CreateGroupRequest | { name: string; description: string }) => {
    loading.value = true
    error.value = null
    try {
      console.log('🚀 Creating group with data:', groupData)

      // Get auth store
      const auth = useAuthStore()

      // Convert to CreateGroupPayload format for backend
      const payload = {
        name: groupData.name,
        description: groupData.description
      }

      const response = await GroupService.createGroup(payload)
      console.log('✅ Group created successfully:', response)

      // Transform the response to match StudyGroup interface
      const newGroup: StudyGroup = {
        id: response.id,
        name: response.name,
        description: response.description,
        ownerId: response.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: response.createdAt,
        memberCount: response.membersCount || 1,
        isOwner: true, // Creator is always owner
        userRole: 'admin', // Creator is always admin
        isPrivate: false, // Default value
        maxMembers: undefined,
        tags: []
      }

      // Add to groups list
      groups.value.push(newGroup)

      // Add creator as member with admin role
      const creatorMember: GroupMember = {
        userId: auth.currentUserId?.toString() || 'unknown',
        username: auth.currentUserName || 'unknown',
        email: auth.user?.email || 'unknown',
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
        isPrivate: false, // Default value
        maxMembers: undefined,
        tags: []
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
        type: 'file' as const, // Default type
        isPublic: true, // Default value
        tags: []
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
        isPrivate: false, // Default value
        maxMembers: undefined,
        tags: []
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
        type: 'file' as const, // Default type
        isPublic: true, // Default value
        tags: []
      }

      groupResources.value.push(newResource)

      // Send notification to group members about new resource
      const notificationStore = useNotificationStore()

      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Resource Shared',
          message: `"${resourceData.title}" has been shared in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: newResource.id
        })
      }

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

      // Send notification about new comment
      const notificationStore = useNotificationStore()
      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Comment',
          message: `Someone commented on a resource in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: commentData.resourceId
        })
      }

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

  // New methods for content management
  const createPost = async (postData: CreatePostRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.createPost(postData)
      // return response.data

      // Mock post creation
      const newPost: GroupPost = {
        id: Date.now().toString(),
        groupId: postData.groupId,
        authorId: 'current-user',
        authorName: 'Current User',
        authorAvatar: undefined,
        content: postData.content,
        contentType: postData.contentType,
        attachments: [],
        tags: postData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        isEdited: false,
        isPinned: false
      }

      // Add to posts array
      if (!groupPosts.value) {
        groupPosts.value = []
      }
      groupPosts.value.unshift(newPost)

      // Send notification to group members about new post
      const notificationStore = useNotificationStore()
      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Post',
          message: `New post in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: newPost.id
        })
      }

      return newPost
    } catch (err) {
      error.value = 'Failed to create post'
      console.error('createPost error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGroupPosts = async (groupId: string, filters?: GroupSearchFilters) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.fetchGroupPosts(groupId, filters)
      // groupPosts.value = response.data

      // Mock posts for now
      if (!groupPosts.value) {
        groupPosts.value = []
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return groupPosts.value
    } catch (err) {
      error.value = 'Failed to fetch group posts'
      console.error('fetchGroupPosts error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (postId: string, updateData: UpdatePostRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.updatePost(postId, updateData)
      // return response.data

      // Update local state
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          groupPosts.value[postIndex] = {
            ...groupPosts.value[postIndex],
            content: updateData.content,
            tags: updateData.tags || groupPosts.value[postIndex].tags,
            updatedAt: new Date().toISOString(),
            isEdited: true
          }
        }
      }

      return { success: true }
    } catch (err) {
      error.value = 'Failed to update post'
      console.error('updatePost error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (postId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await groupService.deletePost(postId)

      // Remove from local state
      if (groupPosts.value) {
        groupPosts.value = groupPosts.value.filter(p => p.id !== postId)
      }

      return { success: true }
    } catch (err) {
      error.value = 'Failed to delete post'
      console.error('deletePost error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addPostComment = async (commentData: AddPostCommentRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.addPostComment(commentData)
      // return response.data

      // Create new comment
      const newComment: PostComment = {
        id: Date.now().toString(),
        postId: commentData.postId,
        authorId: 'current-user',
        authorName: 'Current User',
        authorAvatar: undefined,
        content: commentData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        isEdited: false,
        replies: []
      }

      // Add to post comments
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === commentData.postId)
        if (postIndex !== -1) {
          if (!groupPosts.value[postIndex].comments) {
            groupPosts.value[postIndex].comments = []
          }
          groupPosts.value[postIndex].comments.push(newComment)
        }
      }

      // Send notification about new comment
      const notificationStore = useNotificationStore()
      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Comment',
          message: `New comment on a post in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: commentData.postId
        })
      }

      return newComment
    } catch (err) {
      error.value = 'Failed to add comment'
      console.error('addPostComment error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const likePost = async (postId: string) => {
    try {
      // TODO: Replace with actual API call
      // await groupService.likePost(postId)

      // Update local state
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          groupPosts.value[postIndex].likes += 1
        }
      }

      return { success: true }
    } catch (err) {
      console.error('likePost error:', err)
      throw err
    }
  }

  const searchGroupContent = async (request: SearchGroupContentRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.searchGroupContent(request)
      // return response.data

      // Mock search results
      let results: (GroupPost | GroupResource)[] = []

      if (groupPosts.value) {
        results = [...groupPosts.value]
      }

      if (groupResources.value) {
        results = [...results, ...groupResources.value]
      }

      // Apply filters
      if (request.filters.query) {
        const query = request.filters.query.toLowerCase()
        results = results.filter(item => {
          if ('content' in item) {
            // GroupPost
            return item.content.toLowerCase().includes(query) ||
                   item.tags?.some(tag => tag.toLowerCase().includes(query))
          } else {
            // GroupResource
            return item.title.toLowerCase().includes(query) ||
                   item.description.toLowerCase().includes(query) ||
                   item.tags?.some(tag => tag.toLowerCase().includes(query))
          }
        })
      }

      if (request.filters.type && request.filters.type !== 'all') {
        results = results.filter(item => {
          if ('contentType' in item) {
            // GroupPost
            return item.contentType === request.filters.type
          } else {
            // GroupResource
            return item.type === request.filters.type
          }
        })
      }

      // Sort results
      if (request.filters.sortBy === 'recent') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (request.filters.sortBy === 'popular') {
        results.sort((a, b) => {
          const aLikes = 'likes' in a ? a.likes : 0
          const bLikes = 'likes' in b ? b.likes : 0
          return bLikes - aLikes
        })
      }

      return {
        results,
        total: results.length,
        page: request.page || 1,
        limit: request.limit || 20
      }
    } catch (err) {
      error.value = 'Failed to search group content'
      console.error('searchGroupContent error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroupSettings = async (groupId: string, settings: UpdateGroupSettingsRequest) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.updateGroupSettings(groupId, settings)
      // return response.data

      // Mock update
      if (currentGroup.value && currentGroup.value.id === groupId) {
        currentGroup.value = {
          ...currentGroup.value,
          isPrivate: settings.isPrivate,
          maxMembers: settings.maxMembers
        }
      }

      return { success: true }
    } catch (err) {
      error.value = 'Failed to update group settings'
      console.error('updateGroupSettings error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveJoinRequest = async (requestId: string, approved: boolean) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.approveJoinRequest(requestId, approved)
      // return response.data

      // Mock approval
      return { success: true, approved }
    } catch (err) {
      error.value = 'Failed to approve join request'
      console.error('approveJoinRequest error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const revokeInvite = async (inviteId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await groupService.revokeInvite(inviteId)
      // return response.data

      // Mock revocation
      return { success: true }
    } catch (err) {
      error.value = 'Failed to revoke invite'
      console.error('revokeInvite error:', err)
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
    groupPosts,

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
    createPost,
    fetchGroupPosts,
    updatePost,
    deletePost,
    addPostComment,
    likePost,
    searchGroupContent,
    updateGroupSettings,
    approveJoinRequest,
    revokeInvite,
  }
})
