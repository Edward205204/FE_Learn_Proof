'use client'

import { Bell, MessageSquare, Tag, CheckCircle, Clock, AlertTriangle, LucideIcon } from 'lucide-react'
import { useNotificationStore, NotificationType } from '@/store/notification.store'
import { useRouter } from 'next/navigation'

const TYPE_CONFIG: Record<NotificationType, { icon: LucideIcon; color: string }> = {
  system: {
    icon: Bell,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  promo: {
    icon: Tag,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  },
  course: {
    icon: MessageSquare,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  success: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
  }
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
  const router = useRouter()

  return (
    <div className='container mx-auto py-10 px-6 max-w-4xl'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>Thông báo</h1>
        <button
          onClick={markAllAsRead}
          className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors'
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className='bg-white dark:bg-[oklch(0.141_0.005_285.823)] rounded-2xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] shadow-sm overflow-hidden'>
        {notifications.length > 0 ? (
          notifications.map((noti) => {
            const config = TYPE_CONFIG[noti.type] || TYPE_CONFIG.system
            const Icon = config.icon

            return (
              <div
                key={noti.id}
                onClick={() => {
                  markAsRead(noti.id)
                  if (noti.link) router.push(noti.link)
                }}
                className={`p-5 flex gap-5 border-b border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] last:border-0 hover:bg-gray-50 dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors cursor-pointer ${noti.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${config.color}`}>
                  <Icon size={24} />
                </div>

                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-4 mb-1'>
                    <h3
                      className={`text-base font-semibold ${noti.unread ? 'text-gray-900 dark:text-white' : 'text-[oklch(0.552_0.016_285.938)]'}`}
                    >
                      {noti.title}
                    </h3>
                    {noti.unread && (
                      <span className='w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-sm'></span>
                    )}
                  </div>

                  <p
                    className={`text-sm mb-3 ${noti.unread ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-[oklch(0.552_0.016_285.938)]'}`}
                  >
                    {noti.message}
                  </p>

                  <div className='flex items-center gap-1.5 text-xs text-[oklch(0.552_0.016_285.938)]'>
                    <Clock size={14} />
                    <span>{noti.time}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className='p-20 text-center flex flex-col items-center justify-center'>
            <Bell size={48} className='text-gray-400 mb-4 opacity-20' />
            <p className='text-[oklch(0.552_0.016_285.938)]'>Bạn không có thông báo nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}
