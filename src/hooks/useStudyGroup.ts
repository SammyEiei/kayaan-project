import { ref, computed } from 'vue'
import StudyGroupService from '../services/StudyGroupService'
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
  const studyGroupService = new StudyGroupService()
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
      groups.value = response
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่ม'
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
      groups.value.unshift(response)
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างกลุ่ม'
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
      const response = await studyGroupService.getGroup(Number(groupId))
      currentGroup.value = response
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่ม'
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
      const response = await studyGroupService.updateGroup(Number(groupId), groupData)

      // Update local state
      if (currentGroup.value && String(currentGroup.value.id) === groupId) {
        currentGroup.value = { ...currentGroup.value, ...response }
      }

      const groupIndex = groups.value.findIndex(g => String(g.id) === groupId)
      if (groupIndex !== -1) {
        groups.value[groupIndex] = { ...groups.value[groupIndex], ...response }
      }

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตกลุ่ม'
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
      await studyGroupService.deleteGroup(Number(groupId))

      // Remove from local state
      groups.value = groups.value.filter(g => String(g.id) !== groupId)
      if (currentGroup.value && String(currentGroup.value.id) === groupId) {
        currentGroup.value = null
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบกลุ่ม'
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
      const response = await studyGroupService.getGroupMembers(Number(groupId))
      groupMembers.value = response
      return response
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
      const response = await studyGroupService.inviteMember(Number(groupId), memberData)
      groupMembers.value.push(response)
      return response
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
      await studyGroupService.updateMemberRole(Number(groupId), Number(memberId), role as 'admin' | 'member')

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
      await studyGroupService.removeMember(Number(groupId), Number(memberId))

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
      const response = await studyGroupService.generateInvite(Number(groupId), inviteData.expiryDays || 30)
      groupInvites.value.unshift(response)
      return response
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
      const response = await studyGroupService.getGroupInviteCode(Number(groupId))
      groupInvites.value = [response]
      return [response]
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
      // Note: revokeInvite method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('revokeInvite method not implemented')

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
      // Note: validateInvite method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('validateInvite method not implemented')
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
      // Note: useInvite method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('useInvite method not implemented')
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
      // Note: checkPermission method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('checkPermission method not implemented')
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
      // Note: getUserPermissions method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('getUserPermissions method not implemented')
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
      // Note: getUserRole method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('getUserRole method not implemented')
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
      // Note: requestConfirmation method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('requestConfirmation method not implemented')
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
      // Note: validateConfirmation method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('validateConfirmation method not implemented')
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
      // Note: executeAction method doesn't exist in StudyGroupService
      // You may need to implement this or use a different approach
      throw new Error('executeAction method not implemented')
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
      const response = await studyGroupService.joinGroup(joinData.token)
      groups.value.push(response)
      return response
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
