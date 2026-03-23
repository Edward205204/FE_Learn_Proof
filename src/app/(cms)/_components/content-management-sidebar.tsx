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
    href: PATH.COURSE_NEW_STEP1,
    label: 'Tạo khóa học',
    icon: PlusCircle,
    match: (p) => p.startsWith(PATH.COURSE_NEW_STEP1)
  },
  {
    href: PATH.STUDIO_COURSES,
    label: 'Khóa học',
    icon: BookOpen,
    match: (p) => p === PATH.STUDIO_COURSES || p.startsWith(PATH.STUDIO_COURSES + '/courses/')
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
    match: (p) => p.startsWith(PATH.STUDIO_COURSES + '/quiz/')
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
      <nav className='md:hidden border-b bg-background sticky top-[56px] z-10'>
        <div className='mx-auto max-w-7xl px-4 h-12 flex items-center gap-2 overflow-x-auto scrollbar-hide'>
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
      <div className='p-6 pb-2'>
        <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>Content Management</p>
      </div>
      <nav className='px-4 pb-4 space-y-1.5'>
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
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
