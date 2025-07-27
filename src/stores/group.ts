import { defineStore } from 'pinia'
import GroupService, { type StudyGroupDTO, type CreateGroupPayload } from '@/service/GroupService'

export const useGroupStore = defineStore('groups', {
  state: () => ({
    groups: [] as StudyGroupDTO[],
    loading: false,
  }),
  actions: {
    async fetchGroups() {
      this.loading = true
      try {
        this.groups = await GroupService.getMyGroups()
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async createGroup(payload: CreateGroupPayload) {
      const group = await GroupService.createGroup(payload)
      this.groups.push(group)
      return group
    },
  },
})
