import http from '@/utils/http'

export type NotificationType = 'PAYMENT' | 'COURSE_UPDATE' | 'MESSAGE' | 'SYSTEM'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export type NotificationsResponse = {
  notifications: Notification[]
  unreadCount: number
  page: number
  limit: number
}

const notificationApi = {
  getMyNotifications: (page = 1, limit = 20) =>
    http.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),

  getUnreadCount: () => http.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: string) => http.patch(`/notifications/${id}/read`),

  markAllAsRead: () => http.patch('/notifications/read-all'),
}

export default notificationApi
