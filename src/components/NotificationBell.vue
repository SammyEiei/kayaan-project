<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'bg-blue-50 text-blue-600': isDropdownOpen }"
    >
      <!-- Bell Icon -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-5 5v-5zM9 17h6m-6 0V7a3 3 0 013-3h0a3 3 0 013 3v10m-6 0v5h6v-5m-6 0h6"
        />
      </svg>

      <!-- Notification Badge -->
      <div
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          <div class="flex items-center gap-2">
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all as read
            </button>
            <button
              @click="clearAll"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5v-5zM9 17h6m-6 0V7a3 3 0 013-3h0a3 3 0 013 3v10m-6 0v5h6v-5m-6 0h6"
                />
              </svg>
            </div>
            <p class="text-gray-500">No notifications yet</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50': !notification.isRead }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="getNotificationDotColor(notification.type)"
                  ></div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 mt-2">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex-shrink-0">
                  <button
                    @click.stop="removeNotification(notification.id)"
                    class="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notifications.length > 0" class="p-4 border-t border-gray-200 text-center">
          <button
            @click="viewAllNotifications"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/stores/notification'

const notificationStore = useNotificationStore()

const isDropdownOpen = ref(false)
const unreadCount = computed(() => notificationStore.unreadNotifications.length)
const notifications = computed(() => notificationStore.recentNotifications)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const clearAll = () => {
  notificationStore.clearAllNotifications()
}

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id)
}

const handleNotificationClick = (notification: Notification) => {
  // Mark as read
  notificationStore.markAsRead(notification.id)

  // Navigate to group if it's a group notification
  if (notification.groupId) {
    // You can add navigation logic here
    console.log('Navigate to group:', notification.groupId)
  }

  // Close dropdown
  closeDropdown()
}

const viewAllNotifications = () => {
  // You can add navigation to a full notifications page here
  console.log('View all notifications')
  closeDropdown()
}

const getNotificationDotColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-blue-500'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notification-bell')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
