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
  // Get auth store instance
  const authStore = useAuthStore()


  // Helper function to get uploader name from uploaderId (fallback only)
  const getUploaderName = (uploaderId: string | number): string => {
    const currentUserId = authStore.userId
    const uploaderIdStr = String(uploaderId)

    // If the uploader is the current user, use current user's name
    if (currentUserId && String(currentUserId) === uploaderIdStr) {
      return authStore.user?.username || authStore.user?.firstname || 'You'
    }

    // Try to find the user in group members
    if (currentGroup.value?.members && Array.isArray(currentGroup.value.members)) {
      const member = currentGroup.value.members.find((m: GroupMember) => String(m.userId) === uploaderIdStr)
      if (member) {
        return member.username || member.displayName || `User ${uploaderIdStr}`
      }
    }

    // Fallback: return generic name
    return `User ${uploaderIdStr}`
  }



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
  const currentGroupId = ref<string | null>(null)
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

  // Function to update member count in groups list
  const updateGroupMemberCount = (groupId: string, newCount: number) => {
    const groupIndex = groups.value.findIndex(g => g.id === groupId)
    if (groupIndex !== -1) {
      groups.value[groupIndex].memberCount = newCount
    }
    // Also update current group if it matches
    if (currentGroup.value?.id === groupId) {
      currentGroup.value.memberCount = newCount
    }
  }

  // Actions
  const setCurrentGroup = (group: StudyGroup | null) => {
    currentGroup.value = group;
    currentGroupId.value = group?.id || null;
    console.log('🔍 Set current group:', group);
    console.log('🔍 Current group ID:', currentGroupId.value);
  };

  const fetchGroups = async () => {
    loading.value = true
    error.value = null
    try {
      const auth = useAuthStore()
      const response = await GroupService.getMyGroups()

      // Transform DTO to StudyGroup interface using mapGroupDto
      const transformedGroups = await Promise.all(response.map(async (groupDto) => {
        const userId = auth.currentUserId ?? auth.user?.id ?? ''
        const mapped = mapGroupDto(groupDto as unknown as Record<string, unknown>, userId)

        // Fetch actual member count for each group
        let actualMemberCount = (groupDto as unknown as Record<string, unknown>).membersCount as number || 1
        try {
          const membersResponse = await GroupService.getGroupMembers(groupDto.id)
          actualMemberCount = membersResponse.length
        } catch (memberError) {
          console.warn(`Failed to fetch members for group ${groupDto.id}:`, memberError)
          // Keep the fallback value if member fetch fails
        }

        return {
          ...mapped,
          inviteLinkToken: Math.random().toString(36).substring(7),
          inviteCode: generateInviteCode(),
          memberCount: actualMemberCount,
          userRole: (mapped.isOwner ? 'admin' : 'member') as 'admin' | 'member',
          isPrivate: false, // Default value
          maxMembers: undefined,
          tags: []
        }
      }))

      groups.value = transformedGroups
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
        memberCount: membersResponse.length, // Use actual member count from members array
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

      // Transform resources - อัปเดตเพื่อรองรับ contentType และ contentData
      console.log('🔍 Raw resources from Backend:', resourcesResponse)
      groupResources.value = resourcesResponse.map((resource) => {
        console.log('🔍 Processing resource:', {
          id: resource.id,
          title: resource.title,
          contentType: resource.contentType,
          contentData: resource.contentData,
          contentSource: resource.contentSource
        })
        return {
        id: String(resource.id),
        groupId: resource.groupId,
        title: resource.title,
        description: resource.description,
        fileUrl: resource.fileUrl,
        fileType: resource.fileType || resource.mimeType || null,
        fileSize: resource.fileSize,
        uploaderId: String(resource.uploaderId),
        uploaderName: resource.uploaderName || getUploaderName(resource.uploaderId),
        createdAt: resource.createdAt,
        comments: [],
        reactions: [],
        type: resource.contentSource === 'study_content' ? 'imported_content' as const : 'file' as const,
        isPublic: true, // Default value
        tags: resource.tags || [],

        // เพิ่มฟิลด์ใหม่สำหรับ interactive content
        contentType: resource.contentType || null,  // 'flashcard', 'quiz', 'note', หรือ null
        contentData: resource.contentData || null,  // JSON string ของ interactive content

        // Existing fields
        contentSource: resource.contentSource,
        contentId: resource.contentId,
        originalContentType: resource.originalContentType,
        updatedAt: resource.updatedAt
      }
      })


      return group
    } catch (err) {
      error.value = 'Failed to fetch group details'
      console.error('fetchGroupDetails error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const leaveGroup = async (groupId: string, confirm: boolean = false) => {
    loading.value = true
    error.value = null
    try {
      await GroupService.leaveGroup(groupId, confirm)

      // Remove from local state - SRS-163: Remove member's access to group posts and files
      groups.value = groups.value.filter((g) => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
        groupMembers.value = []
        groupResources.value = []
        groupPosts.value = []
        resourceComments.value = []
        resourceReactions.value = []
      }

      // Clear any cached group data to ensure no access remains
      console.log('✅ Group access revoked - all local data cleared')
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'CONFIRMATION_REQUIRED') {
        // This is expected - user needs to confirm
        throw new Error('CONFIRMATION_REQUIRED')
      } else if (err instanceof Error && err.message === 'USER_NOT_MEMBER') {
        error.value = 'You are not a member of this group'
        throw new Error('USER_NOT_MEMBER')
      } else if (err instanceof Error && err.message === 'OWNER_CANNOT_LEAVE_ALONE') {
        error.value = 'Owner cannot leave the group if they are the only member. Please delete the group instead.'
        throw new Error('OWNER_CANNOT_LEAVE_ALONE')
      } else if (err instanceof Error && err.message === 'AUTHENTICATION_REQUIRED') {
        error.value = 'Authentication required. Please log in again.'
        throw new Error('AUTHENTICATION_REQUIRED')
      }
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

      // Update member count in both current group and groups list
      if (currentGroup.value) {
        updateGroupMemberCount(currentGroup.value.id, groupMembers.value.length)
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
        email: inviteData.email || '',
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

    const getGroupInviteCode = async (groupId: string) => {
    loading.value = true
    error.value = null
    try {
      console.log('🚀 Getting invite code for group:', groupId)
      const response = await GroupService.getGroupInviteCode(groupId)
      console.log('✅ Got invite code from service:', response)
      return response
    } catch (err) {
      error.value = 'Failed to get invite code'
      console.error('getGroupInviteCode error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

      const getExistingInviteCode = async () => {
    try {
      if (!currentGroupId.value) {
        throw new Error('No current group selected')
      }

      console.log('🔍 Getting existing invite code for group:', currentGroupId.value)

      const response = await GroupService.getGroupInviteCode(currentGroupId.value)
      return response

    } catch (error) {
      console.error('❌ getExistingInviteCode error:', error)
      throw error
    }
  }

  const generateNewInviteCode = async (request: GenerateInviteCodeRequest) => {
    if (!currentGroupId.value) {
      throw new Error('No current group selected. Please select a group first.')
    }

    loading.value = true
    error.value = null
    try {
      console.log('🔍 Generating invite code for group:', currentGroupId.value)

      const response = await GroupService.generateInviteCode(currentGroupId.value)

      console.log('🔍 Group store received response:', response)

      // Handle both inviteCode and token fields from backend
      const inviteCode = response.inviteCode || (response as { token?: string }).token

      if (!inviteCode) {
        throw new Error('No invite code received from backend')
      }

      // Update current group with new invite code
      if (currentGroup.value) {
        currentGroup.value.inviteCode = inviteCode
        console.log('✅ Updated current group invite code:', inviteCode)
      }

      // Return response with normalized inviteCode
      return {
        ...response,
        inviteCode: inviteCode
      }
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

      // Fetch actual member count for the joined group
      let actualMemberCount = response.membersCount || 0
      try {
        const membersResponse = await GroupService.getGroupMembers(response.id)
        actualMemberCount = membersResponse.length
      } catch (memberError) {
        console.warn(`Failed to fetch members for joined group ${response.id}:`, memberError)
        // Keep the fallback value if member fetch fails
      }

      // Transform and add to groups list
      const newGroup: StudyGroup = {
        id: response.id,
        name: response.name,
        description: response.description,
        ownerId: response.ownerId,
        inviteLinkToken: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        createdAt: response.createdAt,
        memberCount: actualMemberCount,
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
      if (!resourceData.file) {
        throw new Error('File is required')
      }

      const response = await GroupService.uploadResource(currentGroup.value.id, {
        title: resourceData.title,
        description: resourceData.description,
        file: resourceData.file,
      })

      // Transform and add to resources list
      const newResource: GroupResource = {
        id: String(response.id),
        groupId: response.groupId,
        title: response.title,
        description: response.description,
        fileUrl: response.fileUrl,
        fileType: response.fileType || response.mimeType || null,
        fileSize: response.fileSize,
        uploaderId: String(response.uploaderId),
        uploaderName: response.uploaderName || getUploaderName(response.uploaderId),
        createdAt: response.createdAt,
        comments: [],
        reactions: [],
        type: response.contentSource === 'study_content' ? 'imported_content' as const : 'file' as const,
        isPublic: true, // Default value
        tags: response.tags || [],
        // เพิ่มฟิลด์สำหรับ Share Study Content
        contentSource: response.contentSource,
        contentId: response.contentId,
        originalContentType: response.originalContentType,
        contentData: response.contentData,
        updatedAt: response.updatedAt
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

  // Share Study Content
  const shareStudyContent = async (payload: { contentId: string; title: string; description?: string; tags?: string[] }) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      const response = await GroupService.shareStudyContent(currentGroup.value.id, payload)

      // Transform and add to resources list
      const newResource: GroupResource = {
        id: String(response.id),
        groupId: response.groupId,
        title: response.title,
        description: response.description,
        fileUrl: response.fileUrl,
        fileType: response.fileType || response.mimeType || null,
        fileSize: response.fileSize,
        uploaderId: String(response.uploaderId),
        uploaderName: response.uploaderName || getUploaderName(response.uploaderId),
        createdAt: response.createdAt,
        comments: [],
        reactions: [],
        type: 'imported_content' as const,
        isPublic: true,
        tags: response.tags || [],
        updatedAt: response.updatedAt,
        // เพิ่มฟิลด์สำหรับ Share Study Content
        contentSource: response.contentSource,
        contentId: response.contentId,
        originalContentType: response.originalContentType,
        contentData: response.contentData
      }

      groupResources.value.push(newResource)

      // Send notification to group members about new shared content
      const notificationStore = useNotificationStore()

      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'Study Content Shared',
          message: `"${payload.title}" has been shared in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: newResource.id
        })
      }

      return newResource
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage === 'INVALID_CONTENT_ID_FORMAT') {
        error.value = 'Invalid content ID format'
      } else if (errorMessage === 'ACCESS_DENIED') {
        error.value = 'Access denied: You are not a member of this group or content does not belong to you'
      } else if (errorMessage === 'CONTENT_NOT_FOUND') {
        error.value = 'Content not found'
      } else {
        error.value = 'Failed to share study content'
      }
      console.error('shareStudyContent error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const shareInteractiveContent = async (payload: {
    contentId: string;
    title: string;
    description?: string;
    tags?: string[];
    contentType: 'flashcard' | 'quiz' | 'note';
    contentData: string;
  }) => {
    if (!currentGroup.value) {
      throw new Error('No current group selected')
    }

    loading.value = true
    error.value = null
    try {
      const response = await GroupService.shareInteractiveContent(currentGroup.value.id, payload)

      // Transform and add to resources list
      const newResource: GroupResource = {
        id: String(response.id),
        groupId: response.groupId,
        title: response.title,
        description: response.description,
        fileUrl: response.fileUrl,
        fileType: response.fileType || response.mimeType || null,
        fileSize: response.fileSize,
        uploaderId: String(response.uploaderId),
        uploaderName: response.uploaderName || getUploaderName(response.uploaderId),
        createdAt: response.createdAt,
        comments: [],
        reactions: [],
        type: 'imported_content' as const,
        isPublic: true,
        tags: response.tags || [],
        updatedAt: response.updatedAt,

        // Interactive content fields
        contentType: response.contentType,
        contentData: response.contentData,

        // Existing fields
        contentSource: response.contentSource,
        contentId: response.contentId,
        originalContentType: response.originalContentType
      }

      groupResources.value.push(newResource)

      // Send notification to group members about new shared content
      const notificationStore = useNotificationStore()

      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'Interactive Content Shared',
          message: `"${payload.title}" has been shared in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: newResource.id
        })
      }

      return newResource
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage === 'INVALID_CONTENT_TYPE') {
        error.value = 'Invalid content type. Please select a valid content type.'
      } else if (errorMessage === 'INVALID_CONTENT_DATA') {
        error.value = 'Invalid content data. Please check your content format.'
      } else if (errorMessage === 'INVALID_CONTENT_ID_FORMAT') {
        error.value = 'Invalid content ID format'
      } else if (errorMessage === 'ACCESS_DENIED') {
        error.value = 'Access denied: You are not a member of this group or content does not belong to you'
      } else if (errorMessage === 'CONTENT_NOT_FOUND') {
        error.value = 'Content not found'
      } else {
        error.value = 'Failed to share interactive content'
      }
      console.error('shareInteractiveContent error:', err)
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
        resourceId: commentData.resourceId || '',
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
        resourceId: reactionData.resourceId || '',
        userId: 'current-user',
        reactionType: (reactionData.reactionType as 'like' | 'dislike' | 'heart' | 'star') || 'like',
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
      console.log('🚀 GroupStore: Creating post with data:', postData)

      // Validate groupId
      if (!postData.groupId || postData.groupId.trim() === '') {
        throw new Error('Group ID is required to create a post.')
      }

      console.log('🔍 Creating post in group:', postData.groupId)

      // Use real API call - choose method based on attachments
      let response
      if (postData.attachments && postData.attachments.length > 0) {
        // Use two-step process for posts with attachments
        response = await GroupService.createPostWithAttachments(postData.groupId, {
          title: postData.title,
          description: postData.description,
          content: postData.content,
          contentType: postData.contentType.toUpperCase() as 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED',
          attachments: postData.attachments,
          tags: postData.tags
        })
      } else {
        // Use simple JSON method for posts without attachments
        response = await GroupService.createPost(postData.groupId, {
          title: postData.title,
          description: postData.description,
          content: postData.content,
          contentType: postData.contentType.toUpperCase() as 'TEXT' | 'IMAGE' | 'FILE' | 'MIXED',
          attachments: postData.attachments,
          tags: postData.tags
        })
      }

      console.log('✅ GroupStore: Post created successfully:', response)

      // Add to posts array
      if (!groupPosts.value) {
        groupPosts.value = []
      }
      groupPosts.value.unshift(response)

      // Send notification to group members about new post
      const notificationStore = useNotificationStore()
      if (currentGroup.value) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Post',
          message: `New post in ${currentGroup.value.name}`,
          groupId: currentGroup.value.id,
          resourceId: response.id
        })
      }

      return response
    } catch (err) {
      error.value = 'Failed to create post'
      console.error('❌ GroupStore createPost error:', err)

      // Log detailed error information
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }

      // Check if it's an axios error
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: unknown }; message?: string }
        console.error('Axios error status:', axiosError.response?.status)
        console.error('Axios error data:', axiosError.response?.data)
        console.error('Axios error message:', axiosError.message)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGroupPosts = async (groupId: string, filters?: GroupSearchFilters) => {
    loading.value = true
    error.value = null
    try {
      // Validate groupId
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required to fetch posts.')
      }

      console.log('🔍 Fetching posts for group:', groupId)

      // Use getGroupPosts ที่ไม่ fetch comments
      const response = await GroupService.getGroupPosts(groupId, {
        page: filters?.page || 0,
        size: filters?.limit || 20,
        sortBy: filters?.sortBy === 'recent' ? 'createdAt' : 'likesCount',
        sortDirection: 'DESC'
      })

      // Handle different response formats
      if (Array.isArray(response)) {
        groupPosts.value = response
      } else if (response && typeof response === 'object' && 'content' in response) {
        groupPosts.value = response.content
      } else {
        groupPosts.value = []
      }

      return groupPosts.value
    } catch (err) {
      error.value = 'Failed to fetch group posts'
      console.error('fetchGroupPosts error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Method สำหรับ fetch comments ของ post
  const fetchPostComments = async (groupId: string, postId: string) => {
    loading.value = true
    error.value = null
    try {
      // Validate parameters
      if (!groupId || groupId.trim() === '') {
        throw new Error('Group ID is required to fetch post comments.')
      }
      if (!postId || postId.trim() === '') {
        throw new Error('Post ID is required to fetch post comments.')
      }

      console.log('🔍 Fetching comments for post:', groupId, 'post:', postId)

      const response = await GroupService.getPostComments(groupId, postId)
      console.log('✅ Post comments fetched:', response)

      return response
    } catch (err) {
      error.value = 'Failed to fetch post comments'
      console.error('fetchPostComments error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (postId: string, updateData: UpdatePostRequest) => {
    loading.value = true
    error.value = null
    try {
      // Validate currentGroupId
      if (!currentGroupId.value || currentGroupId.value.trim() === '') {
        throw new Error('No current group selected. Please select a group first.')
      }

      console.log('🔍 Updating post:', postId, 'in group:', currentGroupId.value)

      // Use real API call
      const response = await GroupService.updatePost(currentGroupId.value, postId, {
        title: updateData.title,
        description: updateData.description,
        content: updateData.content,
        tags: updateData.tags
      })

      // Update local state
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          groupPosts.value[postIndex] = response
        }
      }

      return response
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
      // Validate currentGroupId
      if (!currentGroupId.value || currentGroupId.value.trim() === '') {
        throw new Error('No current group selected. Please select a group first.')
      }

      console.log('🔍 Deleting post:', postId, 'in group:', currentGroupId.value)

      // Use real API call
      await GroupService.deletePost(currentGroupId.value, postId)

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
      // Validate currentGroupId
      if (!currentGroupId.value || currentGroupId.value.trim() === '') {
        throw new Error('No current group selected. Please select a group first.')
      }

      console.log('🔍 Adding comment to post:', commentData.postId, 'in group:', currentGroupId.value)

      // Use real API call
      const response = await GroupService.createComment(currentGroupId.value, commentData.postId || '', {
        content: commentData.content,
        parentCommentId: commentData.parentCommentId
      })

      // Add to post comments
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === commentData.postId)
        if (postIndex !== -1) {
          if (!groupPosts.value[postIndex].comments) {
            groupPosts.value[postIndex].comments = []
          }
          groupPosts.value[postIndex].comments.push(response)
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

      return response
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
      // Validate currentGroupId
      if (!currentGroupId.value || currentGroupId.value.trim() === '') {
        throw new Error('No current group selected. Please select a group first.')
      }

      console.log('🔍 GroupStore: Liking post:', postId, 'in group:', currentGroupId.value)
      console.log('🔍 GroupStore: Current group ID type:', typeof currentGroupId.value)
      console.log('🔍 GroupStore: Current group ID value:', currentGroupId.value)

      // Use real API call
      const response = await GroupService.likePost(currentGroupId.value, postId)
      console.log('✅ GroupStore: Like response received:', response)

      // Update local state
      if (groupPosts.value) {
        const postIndex = groupPosts.value.findIndex(p => p.id === postId)
        console.log('🔍 GroupStore: Post index found:', postIndex)
        if (postIndex !== -1) {
          const oldLikes = groupPosts.value[postIndex].likes
          groupPosts.value[postIndex].likes = response.likesCount || groupPosts.value[postIndex].likes + 1
          console.log('✅ GroupStore: Updated likes from', oldLikes, 'to', groupPosts.value[postIndex].likes)
        }
      }

      return response
    } catch (err) {
      console.error('❌ GroupStore: likePost error:', err)
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
      if (request.filters?.query) {
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

      if (request.filters?.type && request.filters.type !== 'all') {
        results = results.filter(item => {
          if ('contentType' in item) {
            // GroupPost
            return item.contentType === request.filters?.type
          } else {
            // GroupResource
            return item.type === request.filters?.type
          }
        })
      }

      // Sort results
      if (request.filters?.sortBy === 'recent') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (request.filters?.sortBy === 'popular') {
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
          isPrivate: settings.isPrivate ?? currentGroup.value.isPrivate,
          maxMembers: settings.maxMembers ?? currentGroup.value.maxMembers
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

  // Get specific resource
  const getResource = async (groupId: string, resourceId: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await GroupService.getResource(groupId, resourceId)

      // Transform resource to match our interface
      const resource: GroupResource = {
        id: String(response.id),
        groupId: response.groupId,
        title: response.title,
        description: response.description,
        fileUrl: response.fileUrl,
        fileType: response.fileType || response.mimeType || null,
        fileSize: response.fileSize,
        uploaderId: String(response.uploaderId),
        uploaderName: response.uploaderName || getUploaderName(response.uploaderId),
        createdAt: response.createdAt,
        comments: [],
        reactions: [],
        type: response.contentSource === 'study_content' ? 'imported_content' as const : 'file' as const,
        isPublic: true,
        tags: response.tags || [],

        // Interactive content fields
        contentType: response.contentType,
        contentData: response.contentData,

        // Existing fields
        contentSource: response.contentSource,
        contentId: response.contentId,
        originalContentType: response.originalContentType,
        updatedAt: response.updatedAt
      }

      return resource
    } catch (err) {
      error.value = 'Failed to fetch resource'
      console.error('getResource error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties for interactive content
  const interactiveResources = computed(() =>
    groupResources.value.filter(resource =>
      resource.contentType && resource.contentData
    )
  )

  const flashcardResources = computed(() =>
    groupResources.value.filter(resource => resource.contentType === 'flashcard')
  )

  const quizResources = computed(() =>
    groupResources.value.filter(resource => resource.contentType === 'quiz')
  )

  const noteResources = computed(() =>
    groupResources.value.filter(resource => resource.contentType === 'note')
  )

  const fileResources = computed(() =>
    groupResources.value.filter(resource => !resource.contentType)
  )

  return {
    // State
    groups,
    currentGroup,
    currentGroupId,
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

    // Interactive content getters
    interactiveResources,
    flashcardResources,
    quizResources,
    noteResources,
    fileResources,

    // Actions
    setCurrentGroup,
    fetchGroups,
    createGroup,
    fetchGroupDetails,
    leaveGroup,
    deleteGroup,
    updateMemberRole,
    removeMember,
    updateGroupMemberCount,
    inviteMember,
    getGroupInviteCode,
    getExistingInviteCode,
    generateNewInviteCode,
    joinGroupByCode,
    uploadResource,
    shareStudyContent,
    shareInteractiveContent,
    getResource,
    deleteResource,
    addComment,
    addReaction,
    createPost,
    fetchGroupPosts,
    fetchPostComments,
    updatePost,
    deletePost,
    addPostComment,
    likePost,
    searchGroupContent,
    updateGroupSettings,
    approveJoinRequest,
    revokeInvite,

    // Helper functions
    getUploaderName,
  }
})
