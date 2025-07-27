import api from './api'

export interface StudyGroupDTO {
  id: string
  name: string
  description: string
  membersCount: number
}

export interface CreateGroupPayload {
  name: string
  description: string
}

export default {
  createGroup(payload: CreateGroupPayload) {
    return api.post<StudyGroupDTO>('/api/groups', payload).then((res) => res.data)
  },
  getMyGroups() {
    return api.get<StudyGroupDTO[]>('/api/groups/my').then((res) => res.data)
  },
  joinByToken(token: string) {
    return api.get<StudyGroupDTO>(`/api/groups/join/${token}`).then((res) => res.data)
  },
  leaveGroup(id: string) {
    return api.delete<void>(`/api/groups/${id}/members/me`)
  },
}
