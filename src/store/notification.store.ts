import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type NotificationType = 'system' | 'promo' | 'course' | 'success' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  createdAt: number
  unread: boolean
  link?: string
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'unread'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (noti) =>
        set((state) => ({
          notifications: [
            {
              ...noti,
              id: Math.random().toString(36).substring(2, 9),
              createdAt: Date.now(),
              unread: true
            },
            ...state.notifications
          ]
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false }))
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        })),

      clearAll: () => set({ notifications: [] })
    }),
    {
      name: 'learn-proof-notifications',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
