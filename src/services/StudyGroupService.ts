import api from './api';
import type {
  StudyGroup,
  GroupMember,
  GroupInvite,
  CreateGroupRequest,
  UpdateGroupRequest,
  InviteMemberRequest,
  UploadResourceRequest
} from '@/types/group';

export interface JoinGroupRequest {
  token: string;
}

export interface GroupContent {
  id: number;
  title: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  tags?: string;
  uploaderId: number;
  uploaderName: string;
  createdAt: string;
}

export interface GroupMessage {
  id: number;
  groupId: number;
  senderId: number;
  message: string;
  messageType: 'text' | 'file' | 'image';
  createdAt: string;
}

class StudyGroupService {
  private baseURL = '/groups';

  // 🔐 Authentication & Basic Group Operations

  /**
   * ดึงกลุ่มที่ user เป็นสมาชิก
   */
  async getMyGroups(): Promise<StudyGroup[]> {
    try {
      const response = await api.get('/api/groups/my');
      console.log('✅ My groups loaded:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Get my groups failed:', error);
      throw error;
    }
  }

  /**
   * สร้างกลุ่มใหม่
   */
  async createGroup(groupData: CreateGroupRequest): Promise<StudyGroup> {
    try {
      const response = await api.post('/api/groups', groupData);
      console.log('✅ Group created:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Create group failed:', error);
      throw error;
    }
  }

  /**
   * ดึงข้อมูลกลุ่ม
   */
  async getGroup(groupId: number): Promise<StudyGroup> {
    try {
      const response = await api.get(`/api/groups/${groupId}`);
      console.log('✅ Group details loaded:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Get group details failed:', error);
      throw error;
    }
  }

  // 🎯 INVITE MEMBER FEATURES - Focus Area

  /**
   * เข้าร่วมกลุ่มด้วย invite code
   */
  async joinGroup(inviteCode: string): Promise<StudyGroup> {
    try {
      const request: JoinGroupRequest = { token: inviteCode };
      const response = await api.post('/api/groups/join', request);
      console.log('✅ Successfully joined group:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Join group failed:', error);
      console.error('❌ Error response data:', (error as { response?: { data?: unknown } })?.response?.data);

      // Re-throw error เพื่อให้ component จัดการ user-friendly message
      throw error;
    }
  }

  /**
   * ดึง invite code ของกลุ่ม
   */
  async getGroupInviteCode(groupId: number): Promise<GroupInvite> {
    try {
      const response = await api.get(`/api/groups/${groupId}/invite-code`);
      console.log('✅ Invite code retrieved:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Get invite code failed:', error);
      throw error;
    }
  }

  /**
   * สร้าง invite ใหม่
   */
  async generateInvite(groupId: number, expiryDays: number = 30): Promise<GroupInvite> {
    try {
      const request = { expiryDays };
      const response = await api.post(`/api/groups/${groupId}/invites`, request);
      console.log('✅ New invite code generated:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Generate invite code failed:', error);
      throw error;
    }
  }

  /**
   * อัปเดตข้อมูลกลุ่ม
   */
  async updateGroup(groupId: number, groupData: UpdateGroupRequest): Promise<StudyGroup> {
    try {
      const response = await api.patch(`/api/groups/${groupId}`, groupData);
      console.log('✅ Group updated:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Update group failed:', error);
      throw error;
    }
  }

  // 👥 Member Management

  /**
   * ดึงรายชื่อสมาชิกในกลุ่ม
   */
  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    try {
      const response = await api.get(`/api/groups/${groupId}/members`);
      console.log('✅ Group members loaded:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Get group members failed:', error);
      throw error;
    }
  }

  /**
   * เชิญสมาชิกเข้ากลุ่ม
   */
  async inviteMember(groupId: number, inviteData: InviteMemberRequest): Promise<GroupMember> {
    try {
      const response = await api.post(`/api/groups/${groupId}/members/invite`, inviteData);
      console.log('✅ Member invited:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Invite member failed:', error);
      throw error;
    }
  }

  /**
   * เปลี่ยนสิทธิ์สมาชิก
   */
  async updateMemberRole(groupId: number, memberId: number, role: 'admin' | 'member'): Promise<void> {
    try {
      await api.patch(`/api/groups/${groupId}/members/${memberId}/role`, { role });
      console.log('✅ Member role updated');
    } catch (error: unknown) {
      console.error('❌ Update member role failed:', error);
      throw error;
    }
  }

  /**
   * ลบสมาชิกออกจากกลุ่ม
   */
  async removeMember(groupId: number, memberId: number): Promise<void> {
    try {
      await api.delete(`/api/groups/${groupId}/members/${memberId}?confirm=true`);
      console.log('✅ Member removed');
    } catch (error: unknown) {
      console.error('❌ Remove member failed:', error);
      throw error;
    }
  }

  // 📁 Content Management

  /**
   * ดึงเนื้อหาในกลุ่ม
   */
  async getGroupContent(groupId: number, page: number = 0, size: number = 20): Promise<{
    content: GroupContent[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    try {
      const response = await api.get(`/api/groups/${groupId}/content?page=${page}&size=${size}&sort=createdAt,desc`);
      console.log('✅ Group content loaded:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Get group content failed:', error);
      throw error;
    }
  }

  /**
   * อัปเดตเนื้อหา
   */
  async uploadContent(groupId: number, contentData: UploadResourceRequest): Promise<GroupContent> {
    try {
      const formData = new FormData();
      formData.append('title', contentData.title);
      if (contentData.description) {
        formData.append('description', contentData.description);
      }
      if (contentData.tags && contentData.tags.length > 0) {
        formData.append('tags', contentData.tags.join(','));
      }
      if (contentData.file) {
        formData.append('file', contentData.file);
      }

      const response = await api.post(`/api/groups/${groupId}/content`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('✅ Content uploaded:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Upload content failed:', error);
      throw error;
    }
  }

  // 🚪 Group Exit & Deletion

  /**
   * ออกจากกลุ่ม
   */
  async leaveGroup(groupId: number): Promise<void> {
    try {
      await api.post(`/api/groups/${groupId}/leave?confirm=true`);
      console.log('✅ Successfully left group');
    } catch (error: unknown) {
      console.error('❌ Leave group failed:', error);
      throw error;
    }
  }

  /**
   * ลบกลุ่ม (owner only)
   */
  async deleteGroup(groupId: number): Promise<void> {
    try {
      await api.delete(`/api/groups/${groupId}?confirm=true`);
      console.log('✅ Group deleted');
    } catch (error: unknown) {
      console.error('❌ Delete group failed:', error);
      throw error;
    }
  }

  // 🔍 Utility Methods

  /**
   * ตรวจสอบว่า user เป็นสมาชิกของกลุ่มหรือไม่
   */
  async isUserMember(groupId: number): Promise<boolean> {
    try {
      await this.getGroup(groupId);
      return true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      throw error;
    }
  }

  /**
   * ตรวจสอบว่า user เป็น admin ของกลุ่มหรือไม่
   */
  async isUserAdmin(groupId: number): Promise<boolean> {
    try {
      const group = await this.getGroup(groupId);
      return group.userRole === 'admin';
    } catch (error: unknown) {
      console.error('❌ Check admin status failed:', error);
      return false;
    }
  }
}

export default StudyGroupService;
