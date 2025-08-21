import { apiClient } from './apiClient';
import type {
  StudyGroup,
  GroupMember,
  GroupInvite,
  PermissionCheckResponse,
  ApiResponse,
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
  PostComment
} from '../types/group';

export class StudyGroupService {
  private baseUrl = '/study-group';

  // ===== GROUP MANAGEMENT =====

  /**
   * ดึงรายการกลุ่มทั้งหมดของผู้ใช้
   */
  async getMyGroups(): Promise<ApiResponse<StudyGroup[]>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/my`);
    return response.data;
  }

  /**
   * สร้างกลุ่มใหม่
   */
  async createGroup(groupData: CreateGroupRequest): Promise<ApiResponse<StudyGroup>> {
    const response = await apiClient.post(`${this.baseUrl}/groups`, groupData);
    return response.data;
  }

  /**
   * ดึงข้อมูลกลุ่มตาม ID
   */
  async getGroupById(groupId: string): Promise<ApiResponse<StudyGroup>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/${groupId}`);
    return response.data;
  }

  /**
   * อัปเดตข้อมูลกลุ่ม
   */
  async updateGroup(groupId: string, groupData: UpdateGroupRequest): Promise<ApiResponse<StudyGroup>> {
    const response = await apiClient.put(`${this.baseUrl}/groups/${groupId}`, groupData);
    return response.data;
  }

  /**
   * ลบกลุ่ม
   */
  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/groups/${groupId}`);
    return response.data;
  }

  // ===== MEMBER MANAGEMENT =====

  /**
   * ดึงรายการสมาชิกในกลุ่ม
   */
  async getGroupMembers(groupId: string): Promise<ApiResponse<GroupMember[]>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/${groupId}/members`);
    return response.data;
  }

  /**
   * เพิ่มสมาชิกใหม่
   */
  async addMember(groupId: string, memberData: InviteMemberRequest): Promise<ApiResponse<GroupMember>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${groupId}/members`, memberData);
    return response.data;
  }

  /**
   * อัปเดตบทบาทของสมาชิก
   */
  async updateMemberRole(groupId: string, memberId: string, role: string): Promise<ApiResponse<GroupMember>> {
    const response = await apiClient.put(`${this.baseUrl}/groups/${groupId}/members/${memberId}/role`, { role });
    return response.data;
  }

  /**
   * ลบสมาชิกออกจากกลุ่ม
   */
  async removeMember(groupId: string, memberId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/groups/${groupId}/members/${memberId}`);
    return response.data;
  }

  // ===== INVITE MANAGEMENT =====

  /**
   * สร้างรหัสเชิญใหม่
   */
  async createInvite(groupId: string, inviteData: GenerateInviteCodeRequest): Promise<ApiResponse<GroupInvite>> {
    const response = await apiClient.post(`${this.baseUrl}/invites/create`, {
      groupId,
      ...inviteData
    });
    return response.data;
  }

  /**
   * ดึงรายการรหัสเชิญของกลุ่ม
   */
  async getGroupInvites(groupId: string): Promise<ApiResponse<GroupInvite[]>> {
    const response = await apiClient.get(`${this.baseUrl}/invites/group/${groupId}`);
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
   * ตรวจสอบความถูกต้องของรหัสเชิญ
   */
  async validateInvite(inviteCode: string, userAgent?: string, ipAddress?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${this.baseUrl}/invite-validation/validate`, {
      inviteCode,
      userAgent,
      ipAddress
    });
    return response.data;
  }

  /**
   * ใช้รหัสเชิญเพื่อเข้าร่วมกลุ่ม
   */
  async useInvite(inviteCode: string, message?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${this.baseUrl}/invite-validation/validate`, {
      inviteCode,
      message,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // จะถูกเติมจาก Backend
    });
    return response.data;
  }

  // ===== PERMISSION MANAGEMENT =====

  /**
   * ตรวจสอบสิทธิ์เฉพาะ
   */
  async checkPermission(groupId: string, permission: string): Promise<ApiResponse<PermissionCheckResponse>> {
    const response = await apiClient.get(`${this.baseUrl}/security/permissions/${groupId}/${permission}`);
    return response.data;
  }

  /**
   * ดึงสิทธิ์ทั้งหมดของผู้ใช้ในกลุ่ม
   */
  async getUserPermissions(groupId: string): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get(`${this.baseUrl}/permissions/user/${groupId}`);
    return response.data;
  }

  /**
   * ดึงบทบาทของผู้ใช้ในกลุ่ม
   */
  async getUserRole(groupId: string): Promise<ApiResponse<string>> {
    const response = await apiClient.get(`${this.baseUrl}/permissions/role/${groupId}`);
    return response.data;
  }

  /**
   * ดึง permission summary ของกลุ่ม
   */
  async getPermissionSummary(groupId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/${groupId}/permissions/summary`);
    return response.data;
  }

  // ===== ACTION CONFIRMATION =====

  /**
   * สร้างการยืนยันการกระทำ
   */
  async requestConfirmation(action: string, groupId: string, description?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/confirmations', {
      action,
      groupId,
      description
    });
    return response.data;
  }

  /**
   * ตรวจสอบความถูกต้องของ confirmation token
   */
  async validateConfirmation(token: string, action: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/confirmations/${token}/validate`, {
      action
    });
    return response.data;
  }

  /**
   * ดำเนินการตาม confirmation token
   */
  async executeAction(token: string, action: string, data?: any, reason?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/confirmations/${token}/execute`, {
      action,
      data,
      reason
    });
    return response.data;
  }

  // ===== CONTENT MANAGEMENT =====

  /**
   * ดึงเนื้อหาของกลุ่ม
   */
  async getGroupContent(groupId: string, contentType?: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/${groupId}/content`, {
      params: { contentType }
    });
    return response.data;
  }

  /**
   * อัปโหลดเนื้อหาใหม่
   */
  async uploadContent(groupId: string, contentData: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${groupId}/content`, contentData);
    return response.data;
  }

  /**
   * อัปเดตเนื้อหา
   */
  async updateContent(groupId: string, contentId: string, contentData: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${this.baseUrl}/groups/${groupId}/content/${contentId}`, contentData);
    return response.data;
  }

  /**
   * ลบเนื้อหา
   */
  async deleteContent(groupId: string, contentId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/groups/${groupId}/content/${contentId}`);
    return response.data;
  }

  // ===== POST MANAGEMENT =====

  /**
   * สร้างโพสต์ใหม่
   */
  async createPost(postData: CreatePostRequest): Promise<ApiResponse<GroupPost>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${postData.groupId}/posts`, postData);
    return response.data;
  }

  /**
   * ดึงโพสต์ของกลุ่ม
   */
  async getGroupPosts(groupId: string): Promise<ApiResponse<GroupPost[]>> {
    const response = await apiClient.get(`${this.baseUrl}/groups/${groupId}/posts`);
    return response.data;
  }

  /**
   * อัปเดตโพสต์
   */
  async updatePost(groupId: string, postId: string, postData: UpdatePostRequest): Promise<ApiResponse<GroupPost>> {
    const response = await apiClient.put(`${this.baseUrl}/groups/${groupId}/posts/${postId}`, postData);
    return response.data;
  }

  /**
   * ลบโพสต์
   */
  async deletePost(groupId: string, postId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`${this.baseUrl}/groups/${groupId}/posts/${postId}`);
    return response.data;
  }

  /**
   * เพิ่มความคิดเห็นในโพสต์
   */
  async addPostComment(groupId: string, postId: string, commentData: AddPostCommentRequest): Promise<ApiResponse<PostComment>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${groupId}/posts/${postId}/comments`, commentData);
    return response.data;
  }

  /**
   * กดไลค์โพสต์
   */
  async likePost(groupId: string, postId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${groupId}/posts/${postId}/like`);
    return response.data;
  }

  // ===== SEARCH & FILTER =====

  /**
   * ค้นหาเนื้อหาในกลุ่ม
   */
  async searchGroupContent(groupId: string, searchData: SearchGroupContentRequest): Promise<ApiResponse<GroupPost[]>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/${groupId}/search`, searchData);
    return response.data;
  }

  // ===== GROUP SETTINGS =====

  /**
   * อัปเดตการตั้งค่ากลุ่ม
   */
  async updateGroupSettings(groupId: string, settings: UpdateGroupRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.put(`${this.baseUrl}/groups/${groupId}/settings`, settings);
    return response.data;
  }

  // ===== JOIN GROUP =====

  /**
   * เข้าร่วมกลุ่มด้วยรหัสเชิญ
   */
  async joinGroupByCode(joinData: JoinGroupByCodeRequest): Promise<ApiResponse<StudyGroup>> {
    const response = await apiClient.post(`${this.baseUrl}/groups/join`, joinData);
    return response.data;
  }

  // ===== AUDIT & ANALYTICS =====

  /**
   * ดึง audit log ของกลุ่ม
   */
  async getGroupAuditLog(groupId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`${this.baseUrl}/security/audit/${groupId}`);
    return response.data;
  }

  /**
   * ดึง analytics ของกลุ่ม
   */
  async getGroupAnalytics(groupId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`${this.baseUrl}/security/analytics/${groupId}`);
    return response.data;
  }
}

export const studyGroupService = new StudyGroupService();
