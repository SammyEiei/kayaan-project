import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/group';

export interface PermissionCheckResponse {
  hasPermission: boolean;
  permission: string;
  groupId: string;
  userId: string;
  message?: string;
  timestamp: string;
}

export interface GroupPermission {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'member' | 'security' | 'admin';
}

export interface GroupRole {
  id: string;
  name: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  permissions: GroupPermission[];
}

export interface ContentAuditLog {
  id: string;
  userId: string;
  groupId: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  success: boolean;
}

export interface GroupAnalytics {
  groupId: string;
  totalMembers: number;
  activeMembers: number;
  totalPosts: number;
  totalResources: number;
  lastActivity: string;
  memberGrowth: {
    date: string;
    count: number;
  }[];
  contentActivity: {
    date: string;
    posts: number;
    resources: number;
  }[];
}

export interface ConfirmationRequest {
  action: string;
  targetId: string;
  reason?: string;
  additionalData?: string;
}

export interface ConfirmationTokenResponse {
  confirmationToken: string;
  expiresAt: string;
  action: string;
  targetId: string;
}

export interface ConfirmationValidationResponse {
  isValid: boolean;
  token: string;
  action: string;
  targetId: string;
  expiresAt: string;
}

export interface ActionExecutionResponse {
  success: boolean;
  result?: unknown;
  message: string;
  timestamp: string;
}

export class StudyGroupSecurityService {
  private baseUrl = '/study-group';

  // ===== PERMISSION MANAGEMENT =====

  /**
   * ตรวจสอบสิทธิ์เฉพาะของผู้ใช้ในกลุ่ม
   */
  async checkPermission(groupId: string, permission: string): Promise<ApiResponse<PermissionCheckResponse>> {
    const response = await apiClient.get(`${this.baseUrl}/security/permissions/${groupId}/${permission}`);
    return response.data;
  }

  /**
   * ดึงสิทธิ์ทั้งหมดของผู้ใช้ในกลุ่ม
   */
  async getUserPermissions(groupId: string): Promise<ApiResponse<GroupPermission[]>> {
    const response = await apiClient.get(`${this.baseUrl}/permissions/user/${groupId}`);
    return response.data;
  }

  /**
   * ดึงบทบาทของผู้ใช้ในกลุ่ม
   */
  async getUserRole(groupId: string): Promise<ApiResponse<GroupRole>> {
    const response = await apiClient.get(`${this.baseUrl}/permissions/role/${groupId}`);
    return response.data;
  }

  /**
   * ตรวจสอบสิทธิ์แบบทั่วไป
   */
  async checkPermissionGeneral(groupId: string, permission: string): Promise<ApiResponse<PermissionCheckResponse>> {
    const response = await apiClient.get(`${this.baseUrl}/permissions/check/${groupId}/${permission}`);
    return response.data;
  }

  // ===== SECURITY AUDIT & ANALYTICS =====

  /**
   * ดึง audit log ของกลุ่ม
   */
  async getGroupAuditLog(groupId: string, options?: {
    action?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
  }): Promise<ApiResponse<ContentAuditLog[]>> {
    const params = new URLSearchParams();
    if (options?.action) params.append('action', options.action);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.userId) params.append('userId', options.userId);

    const response = await apiClient.get(`${this.baseUrl}/security/audit/${groupId}?${params}`);
    return response.data;
  }

  /**
   * ดึง analytics ของกลุ่ม
   */
  async getGroupAnalytics(groupId: string): Promise<ApiResponse<GroupAnalytics>> {
    const response = await apiClient.get(`${this.baseUrl}/security/analytics/${groupId}`);
    return response.data;
  }

  // ===== INVITE MANAGEMENT =====

  /**
   * สร้างรหัสเชิญใหม่
   */
  async createInvite(inviteData: {
    groupId: string;
    maxUses?: number;
    expiresInDays?: number;
    message?: string;
    customInviteCode?: string;
  }): Promise<ApiResponse<unknown>> {
    const response = await apiClient.post(`${this.baseUrl}/invites/create`, inviteData);
    return response.data;
  }

  /**
   * ดึงรายการรหัสเชิญของกลุ่ม
   */
  async getGroupInvites(groupId: string): Promise<ApiResponse<unknown[]>> {
    const response = await apiClient.get(`${this.baseUrl}/invites/group/${groupId}`);
    return response.data;
  }

  /**
   * ดึงรายการรหัสเชิญที่ยังใช้งานได้
   */
  async getActiveInvites(groupId: string): Promise<ApiResponse<unknown[]>> {
    const response = await apiClient.get(`${this.baseUrl}/invites/group/${groupId}/active`);
    return response.data;
  }

  /**
   * เพิกถอนรหัสเชิญ
   */
  async revokeInvite(inviteCode: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/invites/revoke/${inviteCode}`);
    return response.data;
  }

  // ===== INVITE VALIDATION =====

  /**
   * ตรวจสอบความถูกต้องของรหัสเชิญ (POST)
   */
  async validateInvite(inviteCode: string, userAgent?: string, ipAddress?: string): Promise<ApiResponse<unknown>> {
    const response = await apiClient.post(`${this.baseUrl}/invite-validation/validate`, {
      inviteCode,
      userAgent,
      ipAddress
    });
    return response.data;
  }

  /**
   * ตรวจสอบความถูกต้องของรหัสเชิญ (GET)
   */
  async validateInviteGet(inviteCode: string): Promise<ApiResponse<unknown>> {
    const response = await apiClient.get(`${this.baseUrl}/invite-validation/validate/${inviteCode}`);
    return response.data;
  }

  /**
   * ตรวจสอบสถานะของรหัสเชิญ
   */
  async getInviteStatus(inviteCode: string): Promise<ApiResponse<unknown>> {
    const response = await apiClient.get(`${this.baseUrl}/invite-validation/status/${inviteCode}`);
    return response.data;
  }

  /**
   * ตรวจสอบรหัสเชิญหลายตัวพร้อมกัน
   */
  async validateMultipleInvites(inviteCodes: string[]): Promise<ApiResponse<unknown>> {
    const response = await apiClient.post(`${this.baseUrl}/invite-validation/validate-batch`, inviteCodes);
    return response.data;
  }

  // ===== ACTION CONFIRMATION =====

  /**
   * สร้างการยืนยันการกระทำ
   */
  async requestConfirmation(confirmationData: ConfirmationRequest): Promise<ApiResponse<ConfirmationTokenResponse>> {
    const response = await apiClient.post(`${this.baseUrl}/confirmations/request`, confirmationData);
    return response.data;
  }

  /**
   * ตรวจสอบความถูกต้องของ confirmation token
   */
  async validateConfirmation(token: string, action: string): Promise<ApiResponse<ConfirmationValidationResponse>> {
    const response = await apiClient.post(`${this.baseUrl}/confirmations/validate`, {
      confirmationToken: token,
      action
    });
    return response.data;
  }

  /**
   * ดำเนินการตาม confirmation token
   */
  async executeAction(token: string, action: string, data?: unknown, reason?: string): Promise<ApiResponse<ActionExecutionResponse>> {
    const response = await apiClient.post(`${this.baseUrl}/confirmations/execute`, {
      confirmationToken: token,
      action,
      data,
      reason
    });
    return response.data;
  }

  // ===== SECURITY UTILITIES =====

  /**
   * ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการกระทำหรือไม่
   */
  async hasPermission(groupId: string, permission: string): Promise<boolean> {
    try {
      const response = await this.checkPermission(groupId, permission);
      return response.data.hasPermission;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * ตรวจสอบสิทธิ์หลายตัวพร้อมกัน
   */
  async checkMultiplePermissions(groupId: string, permissions: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    try {
      await Promise.all(
        permissions.map(async (permission) => {
          const hasPermission = await this.hasPermission(groupId, permission);
          results[permission] = hasPermission;
        })
      );
    } catch (error) {
      console.error('Multiple permission check failed:', error);
    }

    return results;
  }

  /**
   * ดึงข้อมูลสิทธิ์และบทบาทของผู้ใช้ในกลุ่ม
   */
  async getUserSecurityInfo(groupId: string): Promise<{
    permissions: GroupPermission[];
    role: GroupRole;
    canManageMembers: boolean;
    canInviteMembers: boolean;
    canDeleteGroup: boolean;
    canModerateContent: boolean;
  }> {
    try {
      const [permissionsResponse, roleResponse] = await Promise.all([
        this.getUserPermissions(groupId),
        this.getUserRole(groupId)
      ]);

      const permissions = permissionsResponse.data;
      const role = roleResponse.data;

      // ตรวจสอบสิทธิ์เฉพาะ
      const canManageMembers = permissions.some(p =>
        p.name === 'MANAGE_MEMBERS' || p.name === 'ADMIN' || role.name === 'OWNER'
      );

      const canInviteMembers = permissions.some(p =>
        p.name === 'INVITE_MEMBERS' || p.name === 'ADMIN' || role.name === 'OWNER'
      );

      const canDeleteGroup = role.name === 'OWNER';

      const canModerateContent = permissions.some(p =>
        p.name === 'MODERATE_CONTENT' || p.name === 'ADMIN' || role.name === 'OWNER'
      );

      return {
        permissions,
        role,
        canManageMembers,
        canInviteMembers,
        canDeleteGroup,
        canModerateContent
      };
    } catch (error) {
      console.error('Failed to get user security info:', error);
      throw error;
    }
  }

  /**
   * สร้าง confirmation สำหรับการกระทำที่สำคัญ
   */
  async createSecurityConfirmation(
    action: 'DELETE_GROUP' | 'REMOVE_MEMBER' | 'LEAVE_GROUP' | 'DELETE_CONTENT' | 'REVOKE_INVITE',
    targetId: string,
    reason?: string,
    additionalData?: unknown
  ): Promise<ConfirmationTokenResponse> {
    try {
      const response = await this.requestConfirmation({
        action,
        targetId,
        reason,
        additionalData: JSON.stringify(additionalData)
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create security confirmation:', error);
      throw error;
    }
  }

  /**
   * ดำเนินการลบกลุ่มหลังจากยืนยันแล้ว
   */
  async deleteGroupWithConfirmation(groupId: string, reason: string): Promise<boolean> {
    try {
      // ขอ confirmation
      const confirmation = await this.createSecurityConfirmation(
        'DELETE_GROUP',
        groupId,
        reason
      );

      // ดำเนินการลบ
      const result = await this.executeAction(
        confirmation.confirmationToken,
        'DELETE_GROUP',
        { groupId },
        reason
      );

      return result.data.success;
    } catch (error) {
      console.error('Failed to delete group with confirmation:', error);
      throw error;
    }
  }

  /**
   * ดำเนินการลบสมาชิกหลังจากยืนยันแล้ว
   */
  async removeMemberWithConfirmation(groupId: string, memberId: string, reason: string): Promise<boolean> {
    try {
      // ขอ confirmation
      const confirmation = await this.createSecurityConfirmation(
        'REMOVE_MEMBER',
        memberId,
        reason,
        { groupId }
      );

      // ดำเนินการลบสมาชิก
      const result = await this.executeAction(
        confirmation.confirmationToken,
        'REMOVE_MEMBER',
        { groupId, memberId },
        reason
      );

      return result.data.success;
    } catch (error) {
      console.error('Failed to remove member with confirmation:', error);
      throw error;
    }
  }
}

export const studyGroupSecurityService = new StudyGroupSecurityService();
