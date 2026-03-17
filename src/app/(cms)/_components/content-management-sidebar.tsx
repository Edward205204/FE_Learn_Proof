'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, MessageSquareText, PlusCircle, LayoutDashboard, HelpCircle } from 'lucide-react'

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
    href: '#',
    label: 'Dashboard',
    icon: LayoutDashboard,
    match: () => false
  },
  {
    href: PATH.STUDIO + '/courses/new/step1',
    label: 'Tạo khóa học',
    icon: PlusCircle,
    match: (p) => p.startsWith(PATH.STUDIO + '/courses/new/')
  },
  {
    href: PATH.STUDIO,
    label: 'Khóa học',
    icon: BookOpen,
    match: (p) => p === PATH.STUDIO || p.startsWith(PATH.STUDIO + '/courses/')
  },
  {
    href: PATH.FEEDBACK_LIST,
    label: 'Feedback',
    icon: MessageSquareText
  },
  {
    href: PATH.QUIZ_LESSON,
    label: 'Quiz',
    icon: HelpCircle,
    match: (p) => p.startsWith(PATH.STUDIO + '/quiz/')
  }
]

type Props = {
  variant?: 'desktop' | 'mobile'
}

function isActive(item: NavItem, pathname: string) {
  if (item.match) return item.match(pathname)
  return pathname === item.href
}

export function ContentManagementSidebar({ variant = 'desktop' }: Props) {
  const pathname = usePathname()

  if (variant === 'mobile') {
    return (
      <nav className='border-b bg-background'>
        <div className='mx-auto max-w-7xl px-4 md:px-6 h-11 flex items-center gap-2 overflow-x-auto'>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname)
            const disabled = item.href === '#'
            return disabled ? (
              <span
                key={item.href + item.label}
                className='text-sm px-3 py-1.5 rounded-md whitespace-nowrap text-muted-foreground/50 cursor-not-allowed'
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-md whitespace-nowrap transition-colors',
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
    <aside className='hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r bg-background'>
      <div className='p-4'>
        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>Content Management</p>
      </div>
      <nav className='px-2 pb-4 space-y-1'>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname)
          const disabled = item.href === '#'
          const Icon = item.icon

          return disabled ? (
            <div
              key={item.href + item.label}
              className='flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed'
            >
              <Icon className='h-4 w-4' />
              <span className='truncate'>{item.label}</span>
            </div>
          ) : (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className='h-4 w-4' />
              <span className='truncate'>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
