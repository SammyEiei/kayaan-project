<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import type { GroupPost, CreatePostRequest, GroupSearchFilters } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()
const auth = useAuthStore()

// State
const posts = ref<GroupPost[]>([])
const loading = ref(false)
const showCreatePost = ref(false)
const newPostContent = ref('')
const selectedFiles = ref<File[]>([])
const selectedTags = ref<string[]>([])
const contentType = ref<'text' | 'image' | 'file' | 'mixed'>('text')
const searchQuery = ref('')
const selectedType = ref<'all' | 'text' | 'image' | 'file' | 'mixed'>('all')
const sortBy = ref<'recent' | 'popular'>('recent')

// Computed
const currentUserId = computed(() => auth.currentUserId)
const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter((post: GroupPost) => post.contentType === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((post: GroupPost) =>
      post.content.toLowerCase().includes(query) ||
      post.authorName.toLowerCase().includes(query) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    )
  }

  // Sort posts
  if (sortBy.value === 'recent') {
    filtered = filtered.sort((a: GroupPost, b: GroupPost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else {
    filtered = filtered.sort((a: GroupPost, b: GroupPost) => b.likes - a.likes)
  }

  return filtered
})

// Methods
const handleCreatePost = async () => {
  if (!newPostContent.value.trim() && selectedFiles.value.length === 0) return

  loading.value = true
  try {
    const postData: CreatePostRequest = {
      groupId: props.groupId,
      content: newPostContent.value,
      contentType: contentType.value,
      attachments: selectedFiles.value,
      tags: selectedTags.value
    }

    await groupStore.createPost(postData)

    // Reset form
    newPostContent.value = ''
    selectedFiles.value = []
    selectedTags.value = []
    contentType.value = 'text'
    showCreatePost.value = false

    // Refresh posts
    await fetchPosts()
  } catch (error) {
    console.error('Failed to create post:', error)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
    contentType.value = selectedFiles.value.length > 0 ? 'file' : 'text'
  }
}

const handleTagInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const tags = target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  selectedTags.value = tags
}

const fetchPosts = async () => {
  loading.value = true
  try {
    // TODO: Implement fetchPosts in groupStore
    // posts.value = await groupStore.fetchGroupPosts(props.groupId)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Group Content</h2>
      <button
        @click="showCreatePost = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg p-4 border border-gray-200">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts, authors, or tags..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Type Filter -->
        <select
          v-model="selectedType"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="file">File</option>
          <option value="mixed">Mixed</option>
        </select>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>

    <!-- Create Post Form -->
    <div v-if="showCreatePost" class="bg-white rounded-lg p-6 border border-gray-200">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                v-model="contentType"
                type="radio"
                value="text"
                class="mr-2"
              />
              Text
            </label>
            <label class="flex items-center">
              <input
                v-model="contentType"
                type="radio"
                value="image"
                class="mr-2"
              />
              Image
            </label>
            <label class="flex items-center">
              <input
                v-model="contentType"
                type="radio"
                value="file"
                class="mr-2"
              />
              File
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            v-model="newPostContent"
            rows="4"
            placeholder="What's on your mind?"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <input
            type="file"
            multiple
            @change="handleFileSelect"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div v-if="selectedFiles.length > 0" class="mt-2 space-y-1">
            <div v-for="file in selectedFiles" :key="file.name" class="text-sm text-gray-600">
              📎 {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            @input="handleTagInput"
            placeholder="study, homework, exam"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex gap-3">
          <button
            @click="handleCreatePost"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {{ loading ? 'Creating...' : 'Create Post' }}
          </button>
          <button
            @click="showCreatePost = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span class="text-gray-600 font-medium">Loading posts...</span>
      </div>
    </div>

    <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
      <p class="text-gray-500">Be the first to share something with your study group!</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="post in filteredPosts"
        :key="post.id"
        class="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <!-- Post Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-semibold">{{ post.authorName.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-900">{{ post.authorName }}</div>
            <div class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="post.isPinned" class="text-yellow-500">
              📌
            </span>
            <span v-if="post.isEdited" class="text-xs text-gray-500">(edited)</span>
          </div>
        </div>

        <!-- Post Content -->
        <div class="mb-4">
          <p class="text-gray-800 whitespace-pre-wrap">{{ post.content }}</p>
        </div>

        <!-- Post Attachments -->
        <div v-if="post.attachments && post.attachments.length > 0" class="mb-4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="attachment in post.attachments"
              :key="attachment.id"
              class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  📎
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ attachment.fileName }}</p>
                  <p class="text-xs text-gray-500">{{ (attachment.fileSize / 1024).toFixed(1) }} KB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Post Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="mb-4">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Post Actions -->
        <div class="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {{ post.likes }}
          </button>
          <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {{ post.comments.length }}
          </button>
          <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
