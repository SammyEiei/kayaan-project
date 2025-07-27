<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'

const groupStore = useGroupStore()
const name = ref('')
const description = ref('')

const submit = async () => {
  if (!name.value) return
  await groupStore.createGroup({ name: name.value, description: description.value })
  name.value = ''
  description.value = ''
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-2 mb-6">
    <input
      v-model="name"
      placeholder="Group name"
      class="border p-2 rounded w-full"
    />
    <textarea
      v-model="description"
      placeholder="Description"
      class="border p-2 rounded w-full"
    />
    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
      Create Group
    </button>
  </form>
</template>
