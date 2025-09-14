<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import GroupService from '@/service/GroupService'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import type { GroupPost, CreatePostRequest } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()
const auth = useAuthStore()
const notificationStore = useNotificationStore()

// State
const posts = ref<GroupPost[]>([])
const loading = ref(false)
const showCreatePost = ref(false)
const newPostTitle = ref('')
const newPostDescription = ref('')
const newPostContent = ref('')
const selectedFiles = ref<File[]>([])
const selectedTags = ref<string[]>([])
const contentType = ref<'text' | 'markdown' | 'image' | 'file' | 'mixed'>('text')
const searchQuery = ref('')
const selectedType = ref<'all' | 'text' | 'markdown' | 'image' | 'file' | 'mixed'>('all')
const sortBy = ref<'recent' | 'popular'>('recent')
const expandedPosts = ref<{ [postId: string]: boolean }>({})

// Computed
const currentUserId = computed(() => auth.currentUserId)
const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter((post: GroupPost) => post.contentType.toLowerCase() === selectedType.value)
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
  if (!newPostTitle.value.trim() || !newPostDescription.value.trim() || (!newPostContent.value.trim() && selectedFiles.value.length === 0)) {
    notificationStore.addNotification({
      type: 'warning',
      title: 'Missing Information',
      message: 'Please fill in all required fields (title, description, and content)',
      groupId: props.groupId
    })
    return
  }

  // Check authentication
  const authStore = useAuthStore()
  console.log('🔍 Auth check:', {
    hasToken: !!authStore.token,
    tokenPreview: authStore.token ? authStore.token.substring(0, 20) + '...' : 'No token',
    userId: authStore.currentUserId,
    isAuthenticated: authStore.isAuthenticated
  })

  if (!authStore.token) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Authentication Required',
      message: 'Please log in to create a post',
      groupId: props.groupId
    })
    return
  }

  loading.value = true
  try {
    console.log('🚀 Creating post with data:', {
      groupId: props.groupId,
      title: newPostTitle.value,
      description: newPostDescription.value,
      content: newPostContent.value,
      contentType: contentType.value,
      attachments: selectedFiles.value.length,
      tags: selectedTags.value
    })

    const postData: CreatePostRequest = {
      groupId: props.groupId,
      title: newPostTitle.value,
      description: newPostDescription.value,
      content: newPostContent.value,
      contentType: contentType.value.toUpperCase() as 'TEXT' | 'MARKDOWN' | 'IMAGE' | 'FILE' | 'MIXED',
      attachments: selectedFiles.value,
      tags: selectedTags.value
    }

    const result = await groupStore.createPost(postData)
    console.log('✅ Post created successfully:', result)

    // Reset form
    newPostTitle.value = ''
    newPostDescription.value = ''
    newPostContent.value = ''
    selectedFiles.value = []
    selectedTags.value = []
    contentType.value = 'text'
    showCreatePost.value = false

    // Refresh posts
    await fetchPosts()

    notificationStore.addNotification({
      type: 'success',
      title: 'Post Created Successfully',
      message: 'Your post has been shared with the study group',
      groupId: props.groupId
    })
  } catch (error) {
    console.error('❌ Failed to create post:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the post'
    notificationStore.addNotification({
      type: 'error',
      title: 'Failed to Create Post',
      message: `Unable to create post: ${errorMessage}`,
      groupId: props.groupId
    })
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
    // Determine content type based on file types
    if (selectedFiles.value.length > 0) {
      const hasImages = selectedFiles.value.some(file => file.type.startsWith('image/'))
      const hasOtherFiles = selectedFiles.value.some(file => !file.type.startsWith('image/'))

      if (hasImages && hasOtherFiles) {
        contentType.value = 'mixed'
      } else if (hasImages) {
        contentType.value = 'image'
      } else {
        contentType.value = 'file'
      }
    } else {
      contentType.value = 'text'
    }
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
    posts.value = await groupStore.fetchGroupPosts(props.groupId)

    // Load comments count for all posts
    await loadCommentsCountForAllPosts()
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
}

const loadCommentsCountForAllPosts = async () => {
  try {
    console.log('🔍 Loading comments count and likes count for all posts')
    console.log('🔍 Posts data:', posts.value)

    // Load comments count and likes count for each post
    const promises = posts.value.map(async (post) => {
      try {
        console.log(`🔍 Processing post ${post.id}:`, {
          title: post.title,
          likes: post.likes,
          likesCount: (post as { likesCount?: number }).likesCount,
          authorName: post.authorName,
          contentType: post.contentType,
          isMarkdown: isMarkdownContent(post.content),
          contentPreview: post.content.substring(0, 100) + '...'
        })

        // Load comments count
        const comments = await GroupService.getPostComments(props.groupId, post.id)
        commentsCount.value[post.id] = comments?.length || 0

        // Set likes count from post data - try both likes and likesCount
        const likesValue = post.likes || (post as { likesCount?: number }).likesCount || 0
        likesCount.value[post.id] = likesValue

        // Only check like state if not already set (preserve existing like state)
        if (isLiked.value[post.id] === undefined) {
          await checkIfUserLikedPost(post.id)
        }

        console.log(`✅ Post ${post.id}: comments=${commentsCount.value[post.id]}, likes=${likesCount.value[post.id]}, isLiked=${isLiked.value[post.id]}`)
      } catch (error) {
        console.error(`Failed to load data for post ${post.id}:`, error)
        commentsCount.value[post.id] = 0
        const likesValue = post.likes || (post as { likesCount?: number }).likesCount || 0
        likesCount.value[post.id] = likesValue
        if (isLiked.value[post.id] === undefined) {
          await checkIfUserLikedPost(post.id)
        }
      }
    })

    await Promise.all(promises)
    console.log('✅ Comments count loaded for all posts:', commentsCount.value)
    console.log('✅ Likes count loaded for all posts:', likesCount.value)
    console.log('✅ Like states:', isLiked.value)
  } catch (error) {
    console.error('❌ Failed to load posts data:', error)
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

const handleEditPost = async (post: GroupPost) => {
  // TODO: Implement edit post functionality
  console.log('Edit post:', post.id)
}

const handleDeletePost = async (post: GroupPost) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await groupStore.deletePost(post.id)
      await fetchPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }
}

const canEditPost = (post: GroupPost) => {
  return post.authorId === String(currentUserId.value)
}

const canDeletePost = (post: GroupPost) => {
  return post.authorId === String(currentUserId.value)
}

// Check if content contains Markdown syntax
const isMarkdownContent = (content: string): boolean => {
  if (!content) return false

  // Check for common Markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s+/m,           // Headers (# ## ###)
    /\*\*.*?\*\*/,           // Bold **text**
    /\*.*?\*/,               // Italic *text*
    /`.*?`/,                 // Inline code `code`
    /```[\s\S]*?```/,        // Code blocks ```
    /^\s*[-*+]\s+/m,         // Unordered lists
    /^\s*\d+\.\s+/m,         // Ordered lists
    /\[.*?\]\(.*?\)/,        // Links [text](url)
    /!\[.*?\]\(.*?\)/,       // Images ![alt](url)
    /^>\s+/m,                // Blockquotes >
    /^\s*\|.*\|.*\|/m,       // Tables |
    /^---+$/m,               // Horizontal rules ---
  ]

  return markdownPatterns.some(pattern => pattern.test(content))
}

// Read More functionality
const shouldTruncateContent = (content: string): boolean => {
  return content.length > 300 // Show read more if content is longer than 300 characters
}

const getTruncatedContent = (content: string): string => {
  return content.substring(0, 300) + '...'
}

const togglePostExpansion = (postId: string) => {
  expandedPosts.value[postId] = !expandedPosts.value[postId]
}

const isPostExpanded = (postId: string): boolean => {
  return expandedPosts.value[postId] || false
}

// Check if current user has liked a post
const checkIfUserLikedPost = async (postId: string) => {
  try {
    console.log('🔍 Checking if user liked post:', postId)
    const isLikedResult = await GroupService.isPostLiked(props.groupId, postId)
    isLiked.value[postId] = isLikedResult || false
    console.log('✅ User like status for post', postId, ':', isLiked.value[postId])
  } catch (error) {
    console.error('❌ Failed to check like status for post', postId, ':', error)
    // Default to not liked if check fails
    isLiked.value[postId] = false
  }
}

// Like functionality
const handleLikePost = async (post: GroupPost) => {
  try {
    console.log('🔍 handleLikePost called with post:', post.id)
    console.log('🔍 Current group ID from store:', groupStore.currentGroupId)
    console.log('🔍 Props group ID:', props.groupId)

    // Toggle like state immediately for better UX
    const wasLiked = isLiked.value[post.id] || false
    isLiked.value[post.id] = !wasLiked

    // Optimistic update for likes count
    const currentLikes = likesCount.value[post.id] || 0
    if (wasLiked) {
      likesCount.value[post.id] = Math.max(0, currentLikes - 1)
    } else {
      likesCount.value[post.id] = currentLikes + 1
    }

    const result = await groupStore.likePost(post.id)
    console.log('✅ Like result:', result)

    // Update likes count from API response
    if (result && result.likesCount !== undefined) {
      likesCount.value[post.id] = result.likesCount
      console.log('✅ Updated likes count from API response:', result.likesCount)
    }

    // Don't refresh posts to preserve like state
    // await fetchPosts()
    console.log('✅ Like state preserved')
  } catch (error) {
    console.error('❌ Failed to like post:', error)

    // Revert optimistic update on error
    const wasLiked = isLiked.value[post.id] || false
    isLiked.value[post.id] = !wasLiked
    const currentLikes = likesCount.value[post.id] || 0
    if (wasLiked) {
      likesCount.value[post.id] = Math.max(0, currentLikes - 1)
    } else {
      likesCount.value[post.id] = currentLikes + 1
    }

    notificationStore.addNotification({
      type: 'error',
      title: 'Like Failed',
      message: 'Unable to like this post. Please try again.',
      groupId: props.groupId
    })
  }
}

// Comment functionality
const showComments = ref<{ [postId: string]: boolean }>({})
const newComment = ref<{ [postId: string]: string }>({})
const commentsCount = ref<{ [postId: string]: number }>({})
const likesCount = ref<{ [postId: string]: number }>({})
const isLiked = ref<{ [postId: string]: boolean }>({})
const isAddingComment = ref<{ [postId: string]: boolean }>({})

const toggleComments = async (postId: string) => {
  showComments.value[postId] = !showComments.value[postId]
  if (showComments.value[postId]) {
    // Load comments when showing
    await loadPostComments(postId)
  }
}

const loadPostComments = async (postId: string) => {
  try {
    console.log('🔍 Loading comments for post:', postId)

    // ใช้ GroupService โดยตรง
    const comments = await GroupService.getPostComments(props.groupId, postId)
    console.log('✅ Post comments loaded:', comments)

    // Update the post in the posts array with comments
    const postIndex = posts.value.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      // Only update if comments array is empty or if we need to refresh
      if (!posts.value[postIndex].comments || posts.value[postIndex].comments.length === 0) {
        posts.value[postIndex].comments = comments || []
        console.log('✅ Updated post comments in local state')
      } else {
        // Merge new comments with existing ones, avoiding duplicates
        const existingComments = posts.value[postIndex].comments || []
        const newComments = comments || []

        // Create a map of existing comment IDs for quick lookup
        const existingIds = new Set(existingComments.map(c => c.id))

        // Add only new comments that don't already exist
        const uniqueNewComments = newComments.filter((c: { id: string }) => !existingIds.has(c.id))

        if (uniqueNewComments.length > 0) {
          posts.value[postIndex].comments = [...uniqueNewComments, ...existingComments]
          console.log('✅ Merged new comments with existing ones')
        }
      }
    }

    // Update comments count
    commentsCount.value[postId] = comments?.length || 0
    console.log('✅ Updated comments count:', commentsCount.value[postId])
  } catch (error) {
    console.error('❌ Failed to load comments:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Failed to Load Comments',
      message: 'Unable to load comments. Please try again.',
      groupId: props.groupId
    })
  }
}

const handleAddComment = async (postId: string) => {
  const commentText = newComment.value[postId]
  if (!commentText?.trim() || isAddingComment.value[postId]) return

  // Set loading state
  isAddingComment.value[postId] = true

  try {
    const newCommentData = await groupStore.addPostComment({
      postId: postId,
      content: commentText.trim()
    })

    // Clear comment input
    newComment.value[postId] = ''

    // Update comments count
    commentsCount.value[postId] = (commentsCount.value[postId] || 0) + 1

    // Add new comment to the post's comments array in realtime
    const postIndex = posts.value.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      if (!posts.value[postIndex].comments) {
        posts.value[postIndex].comments = []
      }

      // Check if comment already exists to prevent duplicates
      const commentExists = posts.value[postIndex].comments.some(
        comment => comment.id === newCommentData?.id
      )

      // Add the new comment to the beginning of the comments array only if it doesn't exist
      if (newCommentData && !commentExists) {
        posts.value[postIndex].comments.unshift(newCommentData)
      }
    }

    // Show success notification
    notificationStore.addNotification({
      type: 'success',
      title: 'Comment Added',
      message: 'Your comment has been posted successfully',
      groupId: props.groupId
    })
  } catch (error) {
    console.error('Failed to add comment:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Failed to Add Comment',
      message: 'Unable to add comment. Please try again.',
      groupId: props.groupId
    })
  } finally {
    // Clear loading state
    isAddingComment.value[postId] = false
  }
}

onMounted(() => {
  // Set current group ID in store
  groupStore.setCurrentGroup({
    id: props.groupId,
    name: '',
    description: '',
    ownerId: '',
    inviteLinkToken: '',
    createdAt: '',
    memberCount: 0,
    isOwner: false,
    userRole: 'member',
    isPrivate: false
  })
  fetchPosts()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div v-if="loading" class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div v-else>
        <h2 class="text-2xl font-bold text-gray-900">Community Posts</h2>
        <p class="text-gray-600 mt-1">Share and discuss with your study group</p>
      </div>
      <div v-if="loading" class="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-theme-surface rounded-2xl p-6 border border-theme-border shadow-lg">
      <div v-if="loading" class="flex flex-col lg:flex-row gap-4 animate-pulse">
        <!-- Search Skeleton -->
        <div class="flex-1">
          <div class="h-12 bg-gray-200 rounded-2xl"></div>
        </div>
        <!-- Filter Skeleton -->
        <div class="flex gap-3">
          <div class="h-12 bg-gray-200 rounded-2xl w-36"></div>
          <div class="h-12 bg-gray-200 rounded-2xl w-36"></div>
        </div>
      </div>
      <div v-else class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts, authors, or tags..."
              class="w-full pl-12 pr-4 py-4 border-2 border-theme-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-theme-bg text-theme-text"
            />
          </div>
        </div>

        <!-- Type Filter -->
        <div class="flex gap-3">
          <select
            v-model="selectedType"
            class="px-4 py-4 border-2 border-theme-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-theme-bg text-theme-text font-medium"
          >
            <option value="all">All Types</option>
            <option value="text">Text</option>
            <option value="markdown">Markdown</option>
            <option value="image">Image</option>
            <option value="file">File</option>
            <option value="mixed">Mixed</option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            class="px-4 py-4 border-2 border-theme-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-theme-bg text-theme-text font-medium"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Kayaan Style Post Composer -->
    <div v-if="loading" class="bg-theme-surface rounded-2xl p-6 border border-theme-border shadow-lg animate-pulse">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div class="flex-1 h-14 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
    <div v-else class="bg-theme-surface rounded-2xl p-6 border border-theme-border shadow-lg">
      <div class="flex items-center gap-4">
        <!-- User Avatar -->
        <div class="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
          <img
            v-if="auth.currentUser?.avatar"
            :src="auth.currentUser.avatar"
            :alt="auth.currentUser.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ auth.currentUser?.name?.charAt(0) || 'U' }}</span>
          </div>
        </div>

        <!-- Post Input -->
        <div class="flex-1">
          <button
            @click="showCreatePost = true"
            class="w-full text-left px-6 py-4 bg-theme-bg hover:bg-theme-surface border-2 border-dashed border-theme-border hover:border-primary rounded-2xl transition-all duration-300 text-theme-text-secondary hover:text-theme-text group"
          >
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-lg font-medium">Share your study insights...</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Study-focused Actions -->
      <!-- <div class="flex items-center justify-center mt-6 pt-6 border-t border-theme-border">
        <button
          @click="showCreatePost = true"
          class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Study Post</span>
        </button>
      </div> -->
    </div>

    <!-- Create Post Form -->
    <div v-if="showCreatePost" class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Create New Post</h3>
        <p class="text-gray-600 text-sm mt-1">Share something with your study group</p>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            v-model="newPostTitle"
            type="text"
            placeholder="Enter post title"
            class="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            v-model="newPostDescription"
            rows="3"
            placeholder="Brief description of your post"
            class="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none bg-white text-gray-900"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
          <div class="flex gap-6 flex-wrap">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="contentType"
                type="radio"
                value="text"
                class="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">Text</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="contentType"
                type="radio"
                value="markdown"
                class="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">Markdown</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="contentType"
                type="radio"
                value="image"
                class="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">Image</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="contentType"
                type="radio"
                value="file"
                class="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">File</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>

          <!-- Text/Markdown Input -->
          <div v-if="contentType === 'text' || contentType === 'markdown'" class="space-y-3">
            <textarea
              v-model="newPostContent"
              rows="5"
              :placeholder="contentType === 'markdown' ? 'Write your content in Markdown format...\n\n# Heading\n**Bold text**\n*Italic text*\n- List item\n[Link](https://example.com)' : 'What\'s on your mind? Share your thoughts, questions, or study materials...'"
              class="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none font-mono bg-white text-gray-900"
            ></textarea>

            <!-- Markdown Preview -->
            <div v-if="contentType === 'markdown' && newPostContent.trim()" class="border border-gray-300 rounded-xl p-4 bg-gray-50">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">Preview</span>
              </div>
              <MarkdownRenderer :content="newPostContent" />
            </div>
          </div>

          <!-- Other content types -->
          <div v-else>
            <textarea
              v-model="newPostContent"
              rows="5"
              placeholder="What's on your mind? Share your thoughts, questions, or study materials..."
              class="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none bg-white text-gray-900"
            ></textarea>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
            <input
              type="file"
              multiple
              @change="handleFileSelect"
              class="hidden"
              id="file-upload"
            />
            <label for="file-upload" class="cursor-pointer">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-gray-600 text-sm">Click to upload files or drag and drop</p>
              <p class="text-gray-400 text-xs mt-1">Images, documents, and other files</p>
            </label>
          </div>
          <div v-if="selectedFiles.length > 0" class="mt-4 space-y-3">
            <div v-for="file in selectedFiles" :key="file.name" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg v-if="file.type.startsWith('image/')" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500">{{ (file.size / 1024).toFixed(1) }} KB</p>
              </div>
              <button
                @click="selectedFiles = selectedFiles.filter(f => f !== file)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Remove file"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            @input="handleTagInput"
            placeholder="study, homework, exam (comma-separated)"
            class="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="handleCreatePost"
            :disabled="loading"
            class="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {{ loading ? 'Creating...' : 'Create Post' }}
          </button>
          <button
            @click="showCreatePost = false"
            class="px-6 py-3 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-if="loading" class="space-y-6">
      <!-- Skeleton Loading -->
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <!-- Post Header Skeleton -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
            <div class="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <!-- Post Title and Description Skeleton -->
        <div class="mb-4">
          <div class="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>

        <!-- Post Content Skeleton -->
        <div class="mb-4">
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>

        <!-- Post Tags Skeleton -->
        <div class="mb-4">
          <div class="flex gap-2">
            <div class="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
            <div class="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
            <div class="h-6 bg-gray-200 rounded-full animate-pulse w-14"></div>
          </div>
        </div>

        <!-- Post Actions Skeleton -->
        <div class="flex items-center gap-6 pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredPosts.length === 0" class="text-center py-16">
      <div class="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-gray-900 mb-3">No posts yet</h3>
      <p class="text-gray-600 text-lg mb-6">Be the first to share something with your study group!</p>
      <button
        @click="showCreatePost = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
      >
        Create First Post
      </button>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="post in filteredPosts"
        :key="post.id"
        class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
      >
        <!-- Post Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img
              v-if="post.authorAvatar"
              :src="post.authorAvatar"
              :alt="post.authorName"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-blue-100 flex items-center justify-center">
              <span class="text-blue-600 font-semibold">{{ post.authorName.charAt(0) }}</span>
            </div>
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-900">{{ post.authorName }}</div>
            <div class="text-sm text-gray-500">
              <span>Created {{ formatDate(post.createdAt) }}</span>
              <span v-if="post.updatedAt && post.updatedAt !== post.createdAt" class="ml-2 text-gray-400">
                • Updated {{ formatDate(post.updatedAt) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="post.isPinned" class="text-yellow-500">
              📌
            </span>
            <span v-if="post.isEdited" class="text-xs text-gray-500">(edited)</span>
            <div v-if="canEditPost(post) || canDeletePost(post)" class="flex items-center gap-1">
              <button
                v-if="canEditPost(post)"
                @click="handleEditPost(post)"
                class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit post"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                v-if="canDeletePost(post)"
                @click="handleDeletePost(post)"
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete post"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Post Title and Description -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
          <p class="text-gray-600 mb-3">{{ post.description }}</p>

          <!-- Content Display -->
          <div v-if="post.contentType === 'MARKDOWN' || isMarkdownContent(post.content)" class="text-gray-800">
            <div v-if="shouldTruncateContent(post.content) && !isPostExpanded(post.id)">
              <MarkdownRenderer :content="getTruncatedContent(post.content)" />
              <button
                @click="togglePostExpansion(post.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors duration-200"
              >
                Read more
              </button>
            </div>
            <div v-else>
              <MarkdownRenderer :content="post.content" />
              <button
                v-if="shouldTruncateContent(post.content)"
                @click="togglePostExpansion(post.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors duration-200"
              >
                Show less
              </button>
            </div>
          </div>
          <div v-else class="text-gray-800 whitespace-pre-wrap">
            <div v-if="shouldTruncateContent(post.content) && !isPostExpanded(post.id)">
              {{ getTruncatedContent(post.content) }}
              <button
                @click="togglePostExpansion(post.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors duration-200"
              >
                Read more
              </button>
            </div>
            <div v-else>
              {{ post.content }}
              <button
                v-if="shouldTruncateContent(post.content)"
                @click="togglePostExpansion(post.id)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 transition-colors duration-200"
              >
                Show less
              </button>
            </div>
          </div>
        </div>

        <!-- Post Attachments -->
        <div v-if="post.attachments && post.attachments.length > 0" class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="attachment in post.attachments"
              :key="attachment.id"
              class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg v-if="attachment.fileType.startsWith('image/')" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
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
        <div class="flex items-center gap-6 pt-4 border-t border-gray-100">
          <button
            @click="handleLikePost(post)"
            :class="[
              'like-button flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium',
              isLiked[post.id]
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            ]"
            title="Like this post"
          >
            <svg
              class="like-icon w-5 h-5 transition-all duration-200"
              :class="isLiked[post.id] ? 'liked scale-110' : 'scale-100'"
              :fill="isLiked[post.id] ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span class="font-medium">{{ likesCount[post.id] || post.likes || 0 }}</span>
          </button>
          <button
            @click="toggleComments(post.id)"
            class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
            title="View comments"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span class="font-medium">{{ commentsCount[post.id] || post.comments?.length || 0 }}</span>
          </button>
          <!-- <button class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span class="font-medium">Share</span>
          </button> -->
        </div>

        <!-- Comments Section -->
        <div v-if="showComments[post.id]" class="mt-6 pt-6 border-t border-gray-100">
          <!-- Add Comment Form -->
          <div class="mb-6">
            <div class="flex gap-3">
              <input
                v-model="newComment[post.id]"
                type="text"
                placeholder="Write a comment..."
                :disabled="isAddingComment[post.id]"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                @keyup.enter="!isAddingComment[post.id] && handleAddComment(post.id)"
              />
              <button
                @click="handleAddComment(post.id)"
                :disabled="!newComment[post.id]?.trim() || isAddingComment[post.id]"
                class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:shadow-none flex items-center gap-2"
              >
                <svg v-if="isAddingComment[post.id]" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ isAddingComment[post.id] ? 'Posting...' : 'Comment' }}
              </button>
            </div>
          </div>

          <!-- Comments List -->
          <div v-if="post.comments && post.comments.length > 0" class="space-y-4">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  v-if="comment.authorAvatar"
                  :src="comment.authorAvatar"
                  :alt="comment.authorName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-600 text-sm font-semibold">{{ comment.authorName.charAt(0) }}</span>
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-gray-900 text-sm">{{ comment.authorName }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                  <span v-if="comment.isEdited" class="text-xs text-gray-400">(edited)</span>
                </div>
                <p class="text-gray-800 text-sm">{{ comment.content }}</p>
                <div class="flex items-center gap-4 mt-3">
                  <button class="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span class="font-medium">{{ comment.likes || 0 }}</span>
                  </button>
                  <button class="text-sm text-gray-500 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Comments Message -->
          <div v-else class="text-center py-8 text-gray-500">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-700 mb-2">No comments yet</h4>
            <p class="text-sm text-gray-500">Be the first to share your thoughts on this post!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

/* Like button animation */
.like-button {
  position: relative;
  overflow: hidden;
}

.like-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

.like-button:active::before {
  width: 100px;
  height: 100px;
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* Like icon animation */
.like-icon {
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.like-icon.liked {
  animation: likeBounce 0.4s ease;
}

@keyframes likeBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
