<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import type { GroupPost, UpdatePostRequest } from '@/types/group'

interface Props {
  post: GroupPost
  onClose: () => void
  onUpdate: (updatedPost: GroupPost) => void
}

const props = defineProps<Props>()
const groupStore = useGroupStore()
const auth = useAuthStore()

// State
const loading = ref(false)
const editMode = ref(false)
const editedContent = ref(props.post.content)
const editedTags = ref<string[]>(props.post.tags || [])
const tagInput = ref('')

// Computed
const currentUserId = computed(() => auth.currentUserId)
const canEdit = computed(() =>
  String(props.post.authorId) === String(currentUserId.value) ||
  groupStore.currentUserRole === 'admin'
)

const canDelete = computed(() =>
  String(props.post.authorId) === String(currentUserId.value) ||
  groupStore.currentUserRole === 'admin'
)

// Methods
const handleEdit = () => {
  editMode.value = true
  editedContent.value = props.post.content
  editedTags.value = [...(props.post.tags || [])]
}

const handleSave = async () => {
  if (!editedContent.value.trim()) return

  loading.value = true
  try {
    const updateData: UpdatePostRequest = {
      content: editedContent.value,
      tags: editedTags.value
    }

    await groupStore.updatePost(props.post.id, updateData)

    // Update local post
    const updatedPost = {
      ...props.post,
      content: editedContent.value,
      tags: editedTags.value,
      updatedAt: new Date().toISOString(),
      isEdited: true
    }

    props.onUpdate(updatedPost)
    editMode.value = false
  } catch (error) {
    console.error('Failed to update post:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  editMode.value = false
  editedContent.value = props.post.content
  editedTags.value = [...(props.post.tags || [])]
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }

  loading.value = true
  try {
    await groupStore.deletePost(props.post.id)
    props.onClose()
  } catch (error) {
    console.error('Failed to delete post:', error)
  } finally {
    loading.value = false
  }
}

const handleTagInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const tags = target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  editedTags.value = tags
}

const addTag = (tag: string) => {
  if (tag && !editedTags.value.includes(tag)) {
    editedTags.value.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (tagToRemove: string) => {
  editedTags.value = editedTags.value.filter(tag => tag !== tagToRemove)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <!-- Post Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span class="text-blue-600 font-semibold">{{ props.post.authorName.charAt(0) }}</span>
      </div>
      <div class="flex-1">
        <div class="font-medium text-gray-900">{{ props.post.authorName }}</div>
        <div class="text-sm text-gray-500">
          {{ formatDate(props.post.createdAt) }}
          <span v-if="props.post.isEdited" class="text-gray-400 ml-2">(edited)</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="props.post.isPinned" class="text-yellow-500">
          📌
        </span>
      </div>
    </div>

    <!-- Post Content -->
    <div class="mb-4">
      <div v-if="!editMode">
        <p class="text-gray-800 whitespace-pre-wrap">{{ props.post.content }}</p>
      </div>
      <div v-else>
        <textarea
          v-model="editedContent"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
    </div>

    <!-- Post Tags -->
    <div class="mb-4">
      <div v-if="!editMode && props.post.tags && props.post.tags.length > 0">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in props.post.tags"
            :key="tag"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
      <div v-else-if="editMode">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div class="flex gap-2 mb-2">
          <input
            v-model="tagInput"
            type="text"
            placeholder="Add tag..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="addTag(tagInput)"
          />
          <button
            @click="addTag(tagInput)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Add
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in editedTags"
            :key="tag"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
          >
            #{{ tag }}
            <button
              @click="removeTag(tag)"
              class="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Post Actions -->
    <div class="flex items-center gap-4 pt-4 border-t border-gray-200">
      <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        {{ props.post.likes }}
      </button>
      <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {{ props.post.comments.length }}
      </button>

      <!-- Edit/Delete Actions -->
      <div class="ml-auto flex gap-2">
        <button
          v-if="canEdit && !editMode"
          @click="handleEdit"
          class="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Edit
        </button>

        <div v-if="editMode" class="flex gap-2">
          <button
            @click="handleSave"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
          <button
            @click="handleCancel"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

        <button
          v-if="canDelete"
          @click="handleDelete"
          :disabled="loading"
          class="text-red-600 hover:text-red-800 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
