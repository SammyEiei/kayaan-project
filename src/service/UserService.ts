import api from './api'

export interface UserDTO {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  avatarUrl?: string
}

export default {
  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser() {
    console.log('🔍 Calling getCurrentUser...')
    return api.get<UserDTO>('/api/users/me').then((res) => {
      console.log('🔍 getCurrentUser response:', res.data)
      return res.data
    })
  },

  // ดึงข้อมูลผู้ใช้ตาม ID (ถ้ามี endpoint นี้)
  getUserById(userId: string) {
    console.log('🔍 Calling getUserById for userId:', userId)
    return api.get<UserDTO>(`/api/users/${userId}`).then((res) => {
      console.log('🔍 getUserById response:', res.data)
      return res.data
    })
  },

  // ดึงข้อมูลผู้ใช้หลายคน (ถ้ามี endpoint นี้)
  getUsersByIds(userIds: string[]) {
    console.log('🔍 Calling getUsersByIds for userIds:', userIds)
    return api.post<UserDTO[]>('/api/users/batch', { userIds }).then((res) => {
      console.log('🔍 getUsersByIds response:', res.data)
      return res.data
    })
  }
}
