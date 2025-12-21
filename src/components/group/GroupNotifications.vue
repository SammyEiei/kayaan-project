<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import type { GroupNotification, GroupPost, GroupResource } from '@/types/group'

interface Props {
  groupId: string
}

const props = defineProps<Props>()
const groupStore = useGroupStore()
const auth = useAuthStore()
const notificationStore = useNotificationStore()

// State
const notifications = ref<GroupNotification[]>([])
const loading = ref(false)
const showNotifications = ref(false)
const unreadCount = ref(0)
const lastActivity = ref<string>('')

// WebSocket connection for real-time updates
let wsConnection: WebSocket | null = null

// Computed
const currentUserId = computed(() => auth.currentUserId)
const hasUnreadNotifications = computed(() => unreadCount.value > 0)
const recentNotifications = computed(() =>
  notifications.value
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)

// Methods
const fetchNotifications = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await groupService.fetchGroupNotifications(props.groupId)
    // notifications.value = response.data

    // Mock notifications for now
    notifications.value = [
      {
        id: '1',
        groupId: props.groupId,
        userId: 'user1',
        type: 'post',
        title: 'New Post',
        message: 'John Doe posted a new message in the group',
        data: { postId: 'post1', authorName: 'John Doe' },
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        groupId: props.groupId,
        userId: 'user2',
        type: 'comment',
        title: 'New Comment',
        message: 'Jane Smith commented on a post',
        data: { postId: 'post1', commentId: 'comment1', authorName: 'Jane Smith' },
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        groupId: props.groupId,
        userId: 'user3',
        type: 'new_resource',
        title: 'New Resource',
        message: 'Mike Johnson uploaded a new file',
        data: {
          resourceId: 'resource1',
          resourceName: 'Study Notes.pdf',
          authorName: 'Mike Johnson',
        },
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ]

    updateUnreadCount()
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (notificationId: string) => {
  try {
    // TODO: Replace with actual API call
    // await groupService.markNotificationAsRead(notificationId)

    // Update local state
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.isRead = true
      updateUnreadCount()
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    // TODO: Replace with actual API call
    // await groupService.markAllNotificationsAsRead(props.groupId)

    // Update local state
    notifications.value.forEach((n) => (n.isRead = true))
    updateUnreadCount()
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

const deleteNotification = async (notificationId: string) => {
  try {
    // TODO: Replace with actual API call
    // await groupService.deleteNotification(notificationId)

    // Remove from local state
    notifications.value = notifications.value.filter((n) => n.id !== notificationId)
    updateUnreadCount()
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

const updateUnreadCount = () => {
  unreadCount.value = notifications.value.filter((n) => !n.isRead).length
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'post':
      return '📝'
    case 'comment':
      return '💬'
    case 'member_joined':
      return '👋'
    case 'member_left':
      return '👋'
    case 'resource_uploaded':
      return '📎'
    case 'invite_accepted':
      return '✅'
    default:
      return '🔔'
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'post':
      return 'bg-blue-100 text-blue-800'
    case 'comment':
      return 'bg-green-100 text-green-800'
    case 'member_joined':
      return 'bg-purple-100 text-purple-800'
    case 'member_left':
      return 'bg-gray-100 text-gray-800'
    case 'resource_uploaded':
      return 'bg-orange-100 text-orange-800'
    case 'invite_accepted':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

const handleNotificationClick = (notification: GroupNotification) => {
  // Mark as read
  if (!notification.isRead) {
    markAsRead(notification.id)
  }

  // Handle navigation based on notification type
  switch (notification.type) {
    case 'post':
      // Navigate to post
      console.log('Navigate to post:', notification.data?.postId)
      break
    case 'comment':
      // Navigate to comment
      console.log('Navigate to comment:', notification.data?.commentId)
      break
    case 'resource_uploaded':
      // Navigate to resource
      console.log('Navigate to resource:', notification.data?.resourceId)
      break
    case 'member_joined':
    case 'member_left':
      // Navigate to member list
      console.log('Navigate to member list')
      break
  }

  // Close notifications panel
  showNotifications.value = false
}

const setupWebSocket = () => {
  try {
    // TODO: Replace with actual WebSocket URL
    // const wsUrl = `ws://localhost:8080/ws/groups/${props.groupId}/notifications`
    // wsConnection = new WebSocket(wsUrl)

    // Mock WebSocket for now
    console.log('Setting up WebSocket connection for real-time notifications')

    // Simulate real-time updates
    setInterval(() => {
      // Simulate new notification every 30 seconds
      if (Math.random() > 0.7) {
        const newNotification: GroupNotification = {
          id: Date.now().toString(),
          groupId: props.groupId,
          userId: 'system',
          type: 'new_post',
          title: 'New Activity',
          message: 'Someone posted a new message in the group',
          data: { postId: 'new-post', authorName: 'Group Member' },
          isRead: false,
          createdAt: new Date().toISOString(),
        }

        notifications.value.unshift(newNotification)
        updateUnreadCount()

        // Show toast notification
        notificationStore.addNotification({
          type: 'info',
          title: newNotification.title,
          message: newNotification.message,
          groupId: props.groupId,
        })
      }
    }, 30000)
  } catch (error) {
    console.error('Failed to setup WebSocket:', error)
  }
}

const cleanupWebSocket = () => {
  if (wsConnection) {
    wsConnection.close()
    wsConnection = null
  }
}

// Lifecycle
onMounted(() => {
  fetchNotifications()
  setupWebSocket()
})

onUnmounted(() => {
  cleanupWebSocket()
})
</script>

<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="showNotifications = !showNotifications"
      class="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-5 5v-5zM4.19 4H20c1.84 0 3.43 1.12 4.12 2.7A6 6 0 0122 11v5a4 4 0 01-4 4H4a4 4 0 01-4-4v-5a6 6 0 016-6z"
        />
      </svg>

      <!-- Unread Badge -->
      <div
        v-if="hasUnreadNotifications"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </button>

    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="absolute right-0 top-12 w-96 bg-white rounded-lg border border-gray-200 shadow-xl z-50"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          <div class="flex gap-2">
            <button
              v-if="hasUnreadNotifications"
              @click="markAllAsRead"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
            <button @click="showNotifications = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-gray-500">Loading notifications...</div>

        <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          No notifications yet
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="notification in recentNotifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            :class="{ 'bg-blue-50': !notification.isRead }"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <span class="text-2xl">{{ getNotificationIcon(notification.type) }}</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
                  <span v-if="!notification.isRead" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                </div>

                <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>

                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">
                    {{ formatTimeAgo(notification.createdAt) }}
                  </span>

                  <div class="flex gap-2">
                    <button
                      v-if="!notification.isRead"
                      @click.stop="markAsRead(notification.id)"
                      class="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark read
                    </button>
                    <button
                      @click.stop="deleteNotification(notification.id)"
                      class="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <button
          @click="fetchNotifications"
          class="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for notifications */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
