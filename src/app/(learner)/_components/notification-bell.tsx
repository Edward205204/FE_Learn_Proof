'use client'

import Link from 'next/link'
import { Bell, CheckCheck, ShoppingCart, BookOpen, MessageSquare, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  useUnreadCountQuery,
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../_hooks/use-notification'
import type { Notification, NotificationType } from '../_api/notification.api'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

function NotificationIcon({ type }: { type: NotificationType }) {
  const cls = 'h-4 w-4 shrink-0'
  switch (type) {
    case 'PAYMENT':
      return <ShoppingCart className={cn(cls, 'text-emerald-500')} />
    case 'COURSE_UPDATE':
      return <BookOpen className={cn(cls, 'text-blue-500')} />
    case 'MESSAGE':
      return <MessageSquare className={cn(cls, 'text-violet-500')} />
    default:
      return <Info className={cn(cls, 'text-amber-500')} />
  }
}

function NotificationItem({
  notif,
  onRead,
}: {
  notif: Notification
  onRead: (id: string) => void
}) {
  const timeAgo = formatDistanceToNow(new Date(notif.createdAt), {
    addSuffix: true,
    locale: vi,
  })

  const inner = (
    <div
      onClick={() => !notif.isRead && onRead(notif.id)}
      className={cn(
        'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/60',
        !notif.isRead && 'bg-primary/5',
      )}
    >
      <div className='mt-0.5 shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
        <NotificationIcon type={notif.type} />
      </div>
      <div className='flex-1 min-w-0'>
        <p className={cn('text-sm font-semibold leading-tight truncate', !notif.isRead && 'text-foreground')}>
          {notif.title}
        </p>
        <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed'>
          {notif.message}
        </p>
        <p className='text-[10px] text-muted-foreground/60 mt-1'>{timeAgo}</p>
      </div>
      {!notif.isRead && <div className='mt-2 h-2 w-2 rounded-full bg-primary shrink-0' />}
    </div>
  )

  return notif.link ? <Link href={notif.link}>{inner}</Link> : <>{inner}</>
}

export function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadCountQuery()
  const { data, isLoading } = useNotificationsQuery(1)
  const markAsRead = useMarkAsReadMutation()
  const markAllAsRead = useMarkAllAsReadMutation()

  const notifications = data?.notifications ?? []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative rounded-full'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center leading-none'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-96 p-0 rounded-2xl shadow-2xl border border-border/50 overflow-hidden'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30'>
          <div>
            <p className='text-sm font-bold'>Thông báo</p>
            {unreadCount > 0 && (
              <p className='text-xs text-muted-foreground'>{unreadCount} chưa đọc</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='text-xs text-primary hover:text-primary h-7 gap-1'
              onClick={(e) => {
                e.stopPropagation()
                markAllAsRead.mutate()
              }}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className='h-3 w-3' />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className='h-[360px]'>
          {isLoading ? (
            <div className='flex h-40 items-center justify-center'>
              <div className='h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex flex-col h-40 items-center justify-center gap-3 text-muted-foreground'>
              <Bell className='h-8 w-8 opacity-30' />
              <p className='text-sm font-medium'>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className='py-1 divide-y divide-border/30'>
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onRead={(id) => markAsRead.mutate(id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
