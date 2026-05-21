'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import notificationApi from '../_api/notification.api'

const NOTIF_KEYS = {
  list: ['notifications'],
  unreadCount: ['notifications', 'unread-count'],
}

export function useNotificationsQuery(page = 1) {
  return useQuery({
    queryKey: [...NOTIF_KEYS.list, page],
    queryFn: async () => {
      const res = await notificationApi.getMyNotifications(page)
      return res.data
    },
    staleTime: 30_000, // 30s
  })
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: NOTIF_KEYS.unreadCount,
    queryFn: async () => {
      const res = await notificationApi.getUnreadCount()
      return res.data.count
    },
    refetchInterval: 60_000, // Poll every 60s
    staleTime: 30_000,
  })
}

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.list })
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.unreadCount })
    },
  })
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.list })
      queryClient.invalidateQueries({ queryKey: NOTIF_KEYS.unreadCount })
    },
  })
}
