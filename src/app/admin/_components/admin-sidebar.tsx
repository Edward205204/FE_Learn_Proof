'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, BookOpen, History, Settings, LayoutDashboard, ShieldAlert } from 'lucide-react'

import { PATH } from '@/constants/path'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  match?: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    href: PATH.ADMIN_DASHBOARD,
    label: 'Bảng điều khiển',
    icon: LayoutDashboard
  },
  {
    href: PATH.ADMIN_USERS,
    label: 'Người dùng',
    icon: Users
  },
  {
    href: PATH.ADMIN_COURSES,
    label: 'Khóa học',
    icon: BookOpen
  },
  {
    href: PATH.ADMIN_LOGS,
    label: 'Audit Logs',
    icon: History
  },
  {
    href: PATH.ADMIN_SETTINGS,
    label: 'Cài đặt',
    icon: Settings
  }
]

type Props = {
  variant?: 'desktop' | 'mobile'
}

function isActive(item: NavItem, pathname: string) {
  if (item.match) return item.match(pathname)
  return pathname === item.href
}

export function AdminSidebar({ variant = 'desktop' }: Props) {
  const pathname = usePathname()

  if (variant === 'mobile') {
    return (
      <nav className='md:hidden border-b bg-background sticky top-[56px] z-10'>
        <div className='mx-auto max-w-7xl px-4 h-12 flex items-center gap-2 overflow-x-auto scrollbar-hide'>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md whitespace-nowrap transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <aside className='hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r bg-background/50 backdrop-blur-sm'>
      <div className='p-6 pb-2'>
        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>Hệ thống quản trị</p>
      </div>
      <nav className='px-4 pb-4 space-y-1'>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 shrink-0'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  active ? 'scale-110' : 'group-hover:scale-110'
                )}
              />
              <span className='truncate'>{item.label}</span>
              {active && <div className='ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/50' />}
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto p-4 mb-4'>
        <div className='rounded-2xl bg-amber-50 p-4 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30'>
          <div className='flex items-center gap-2 mb-2'>
            <ShieldAlert className='h-4 w-4 text-amber-600' />
            <span className='text-xs font-bold text-amber-700 uppercase'>Cấp quyền Cao</span>
          </div>
          <p className='text-[10px] text-amber-600/80 leading-relaxed'>
            Bạn đang truy cập với quyền Administrator. Mọi thay đổi đều được ghi lại trong Audit Logs.
          </p>
        </div>
      </div>
    </aside>
  )
}
