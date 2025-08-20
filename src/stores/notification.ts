import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  groupId?: string
  resourceId?: string
  isRead: boolean
  createdAt: string
  expiresAt?: string
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const unreadNotifications = computed(() =>
    notifications.value.filter(n => !n.isRead)
  )

  const groupNotifications = computed(() => (groupId: string) =>
    notifications.value.filter(n => n.groupId === groupId)
  )

  const recentNotifications = computed(() =>
    notifications.value
      .filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  )

  // Actions
  const addNotification = (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString()
    }

    notifications.value.unshift(newNotification)

    // Auto-remove after 5 seconds for info/success notifications
    if (['info', 'success'].includes(notification.type)) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const clearExpiredNotifications = () => {
    const now = new Date()
    notifications.value = notifications.value.filter(n =>
      !n.expiresAt || new Date(n.expiresAt) > now
    )
  }

  // Auto-cleanup expired notifications every minute
  setInterval(clearExpiredNotifications, 60000)

  return {
    // State
    notifications,
    loading,
    error,

    // Getters
    unreadNotifications,
    groupNotifications,
    recentNotifications,

    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    clearExpiredNotifications
  }
})
