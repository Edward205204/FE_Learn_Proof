'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive, BookOpen, FilePenLine, LayoutDashboard, MessageSquareText, PlusCircle } from 'lucide-react'

import { SidebarCountBadge } from '@/components/common/sidebar-count-badge'
import { PATH } from '@/constants/path'
import { cn } from '@/lib/utils'
import { useGetMyCoursesManagerQuery } from '../_hooks/use-course-mutation'
import type { CourseStatus } from '../_utils/zod'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  match?: (pathname: string) => boolean
  countStatus?: Extract<CourseStatus, 'DRAFT' | 'ARCHIVED'>
  countClassName?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '#',
    label: 'Dashboard',
    icon: LayoutDashboard,
    match: () => false
  },
  {
    href: PATH.STUDIO_COURSES,
    label: 'Khóa học',
    icon: BookOpen,
    match: (p) =>
      p.startsWith(PATH.STUDIO_COURSES) &&
      !p.startsWith('/studio/courses/new') &&
      !p.startsWith(PATH.STUDIO_COURSES_DRAFT) &&
      !p.startsWith(PATH.STUDIO_COURSES_ARCHIVE)
  },
  {
    href: PATH.COURSE_NEW_STEP1,
    label: 'Tạo khóa học',
    icon: PlusCircle,
    match: (p) => p.startsWith('/studio/courses/new')
  },

  {
    href: PATH.FEEDBACK_LIST,
    label: 'Feedback',
    icon: MessageSquareText
  },
  {
    href: PATH.STUDIO_COURSES_DRAFT,
    label: 'Bản nháp',
    icon: FilePenLine,
    match: (p) => p.startsWith(PATH.STUDIO_COURSES_DRAFT),
    countStatus: 'DRAFT',
    countClassName: 'bg-sky-100 text-sky-700 border-sky-200'
  },
  {
    href: PATH.STUDIO_COURSES_ARCHIVE,
    label: 'Lưu trữ',
    icon: Archive,
    match: (p) => p.startsWith(PATH.STUDIO_COURSES_ARCHIVE),
    countStatus: 'ARCHIVED',
    countClassName: 'bg-amber-100 text-amber-800 border-amber-200'
  }
  // {
  //   href: PATH.QUIZ_LESSON,
  //   label: 'Quiz',
  //   icon: HelpCircle,
  //   match: (p) => p.startsWith(PATH.STUDIO_COURSES + '/quiz/')
  // }
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
  const { data: draftCourses } = useGetMyCoursesManagerQuery({ status: 'DRAFT', page: 1, limit: 1 })
  const { data: archivedCourses } = useGetMyCoursesManagerQuery({ status: 'ARCHIVED', page: 1, limit: 1 })

  const courseCounts: Partial<Record<Extract<CourseStatus, 'DRAFT' | 'ARCHIVED'>, number | null>> = {
    DRAFT: draftCourses?.meta.total ?? null,
    ARCHIVED: archivedCourses?.meta.total ?? null
  }

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
                  'inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md whitespace-nowrap transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {item.countStatus && (
                  <SidebarCountBadge
                    count={courseCounts[item.countStatus]}
                    className={cn('ml-0 h-5 min-w-5 px-1.5 text-[10px]', item.countClassName)}
                  />
                )}
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
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Icon className='h-4 w-4' />
              <span className='truncate'>{item.label}</span>
              {item.countStatus && (
                <SidebarCountBadge count={courseCounts[item.countStatus]} className={item.countClassName} />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
