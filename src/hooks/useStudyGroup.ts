import { ref, computed } from 'vue'
import { studyGroupService } from '../services/StudyGroupService'
import type {
  StudyGroup,
  GroupMember,
  GroupInvite,
  ApiResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  InviteMemberRequest,
  GenerateInviteCodeRequest,
  JoinGroupByCodeRequest,
  UpdateMemberRoleRequest,
  CreatePostRequest,
  UpdatePostRequest,
  AddPostCommentRequest,
  SearchGroupContentRequest
} from '../types/group'

export function useStudyGroup() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const groups = ref<StudyGroup[]>([])
  const currentGroup = ref<StudyGroup | null>(null)
  const groupMembers = ref<GroupMember[]>([])
  const groupInvites = ref<GroupInvite[]>([])

  // ===== GROUP MANAGEMENT =====

  const getMyGroups = async (): Promise<StudyGroup[]> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getMyGroups()
      groups.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (groupData: CreateGroupRequest): Promise<StudyGroup> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.createGroup(groupData)
      groups.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการสร้างกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getGroupById = async (groupId: string): Promise<StudyGroup> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getGroupById(groupId)
      currentGroup.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateGroup = async (groupId: string, groupData: UpdateGroupRequest): Promise<StudyGroup> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.updateGroup(groupId, groupData)

      // Update local state
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = { ...currentGroup.value, ...response.data }
      }

      const groupIndex = groups.value.findIndex(g => g.id === groupId)
      if (groupIndex !== -1) {
        groups.value[groupIndex] = { ...groups.value[groupIndex], ...response.data }
      }

      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการอัปเดตกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteGroup = async (groupId: string): Promise<void> => {
    try {
      setLoading(true)
      clearError()
      await studyGroupService.deleteGroup(groupId)

      // Remove from local state
      groups.value = groups.value.filter(g => g.id !== groupId)
      if (currentGroup.value?.id === groupId) {
        currentGroup.value = null
      }
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการลบกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== MEMBER MANAGEMENT =====

  const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getGroupMembers(groupId)
      groupMembers.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงรายชื่อสมาชิก'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (groupId: string, memberData: InviteMemberRequest): Promise<GroupMember> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.addMember(groupId, memberData)
      groupMembers.value.push(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (groupId: string, memberId: string, role: string): Promise<GroupMember> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.updateMemberRole(groupId, memberId, role)

      // Update local state
      const memberIndex = groupMembers.value.findIndex(m => m.userId === memberId)
      if (memberIndex !== -1) {
        groupMembers.value[memberIndex] = { ...groupMembers.value[memberIndex], ...response.data }
      }

      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการอัปเดตบทบาทสมาชิก'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (groupId: string, memberId: string): Promise<void> => {
    try {
      setLoading(true)
      clearError()
      await studyGroupService.removeMember(groupId, memberId)

      // Remove from local state
      groupMembers.value = groupMembers.value.filter(m => m.userId !== memberId)
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการลบสมาชิก'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== INVITE MANAGEMENT =====

  const createInvite = async (groupId: string, inviteData: GenerateInviteCodeRequest): Promise<GroupInvite> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.createInvite(groupId, inviteData)
      groupInvites.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการสร้างรหัสเชิญ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getGroupInvites = async (groupId: string): Promise<GroupInvite[]> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getGroupInvites(groupId)
      groupInvites.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงรายการรหัสเชิญ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const revokeInvite = async (inviteCode: string): Promise<void> => {
    try {
      setLoading(true)
      clearError()
      await studyGroupService.revokeInvite(inviteCode)

      // Remove from local state
      groupInvites.value = groupInvites.value.filter(i => i.inviteCode !== inviteCode)
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการเพิกถอนรหัสเชิญ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== INVITE VALIDATION =====

  const validateInvite = async (inviteCode: string): Promise<any> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.validateInvite(inviteCode)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการตรวจสอบรหัสเชิญ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const useInvite = async (inviteCode: string, message?: string): Promise<any> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.useInvite(inviteCode, message)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการใช้รหัสเชิญ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== PERMISSION MANAGEMENT =====

  const checkPermission = async (groupId: string, permission: string): Promise<boolean> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.checkPermission(groupId, permission)
      return response.data.hasPermission
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserPermissions = async (groupId: string): Promise<string[]> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getUserPermissions(groupId)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงสิทธิ์'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserRole = async (groupId: string): Promise<string> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.getUserRole(groupId)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดึงบทบาท'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== ACTION CONFIRMATION =====

  const requestConfirmation = async (action: string, groupId: string, description?: string): Promise<any> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.requestConfirmation(action, groupId, description)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการขอการยืนยัน'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const validateConfirmation = async (token: string, action: string): Promise<any> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.validateConfirmation(token, action)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการตรวจสอบการยืนยัน'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (token: string, action: string, data?: any, reason?: string): Promise<any> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.executeAction(token, action, data, reason)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการดำเนินการ'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== JOIN GROUP =====

  const joinGroupByCode = async (joinData: JoinGroupByCodeRequest): Promise<StudyGroup> => {
    try {
      setLoading(true)
      clearError()
      const response = await studyGroupService.joinGroupByCode(joinData)
      groups.value.push(response.data)
      return response.data
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการเข้าร่วมกลุ่ม'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ===== UTILITY FUNCTIONS =====

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    groups.value = []
    currentGroup.value = null
    groupMembers.value = []
    groupInvites.value = []
    error.value = null
  }

  // ===== COMPUTED PROPERTIES =====

  const hasGroups = computed(() => groups.value.length > 0)
  const currentGroupId = computed(() => currentGroup.value?.id || null)
  const isGroupOwner = computed(() => currentGroup.value?.isOwner || false)
  const isGroupAdmin = computed(() => currentGroup.value?.userRole === 'admin')

  return {
    // State
    loading,
    error,
    groups,
    currentGroup,
    groupMembers,
    groupInvites,

    // Computed
    hasGroups,
    currentGroupId,
    isGroupOwner,
    isGroupAdmin,

    // Group Management
    getMyGroups,
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup,

    // Member Management
    getGroupMembers,
    addMember,
    updateMemberRole,
    removeMember,

    // Invite Management
    createInvite,
    getGroupInvites,
    revokeInvite,

    // Invite Validation
    validateInvite,
    useInvite,

    // Permission Management
    checkPermission,
    getUserPermissions,
    getUserRole,

    // Action Confirmation
    requestConfirmation,
    validateConfirmation,
    executeAction,

    // Join Group
    joinGroupByCode,

    // Utility
    setLoading,
    setError,
    clearError,
    reset
  }
}
