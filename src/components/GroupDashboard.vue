<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()

onMounted(() => {
  groupStore.fetchGroups()
})
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold mb-4">My Study Groups</h2>
    <div v-if="groupStore.loading">Loading...</div>
    <ul v-else class="space-y-2">
      <li
        v-for="g in groupStore.groups"
        :key="g.id"
        class="p-3 rounded shadow bg-white"
      >
        {{ g.name }}
      </li>
    </ul>
  </section>
</template>
