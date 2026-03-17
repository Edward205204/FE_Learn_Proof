'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Settings, User as UserIcon } from 'lucide-react'

import { PATH } from '@/constants/path'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useHeader } from '@/hooks/use-header'
import { useEffect, useRef } from 'react'

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: PATH.COURSE_NEW_STEP1, title: 'Tạo khóa học' },
  { prefix: PATH.STUDIO + '/courses/', title: 'Khóa học' },
  { prefix: PATH.FEEDBACK_LIST, title: 'Feedback' },
  { prefix: PATH.QUIZ_LESSON, title: 'Quiz' },
  { prefix: PATH.QUIZ_STANDALONE, title: 'Quiz' },
  { prefix: PATH.STUDIO, title: 'Khóa học' }
]

function pickTitle(pathname: string) {
  return TITLE_BY_PREFIX.find((x) => pathname.startsWith(x.prefix))?.title ?? 'Content Management'
}

export function ContentManagementHeader() {
  const pathname = usePathname()
  const title = pickTitle(pathname)
  const { user, isLoggedIn, isMenuOpen, toggleMenu, handleLogout, closeMenu } = useHeader()

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, closeMenu])

  const avatarUrl =
    user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`
  const initials =
    user?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'

  return (
    <header className='sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 min-w-0'>
          <LayoutDashboard className='h-5 w-5 text-muted-foreground' />
          <div className='min-w-0'>
            <p className='text-sm font-medium truncate'>{title}</p>
            <p className='text-xs text-muted-foreground truncate'>Khu vực quản trị nội dung</p>
          </div>
        </div>

        <div className='flex items-center gap-3 relative' ref={menuRef}>
          <Link
            href={PATH.STUDIO}
            className={cn(
              'text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap',
              pathname === PATH.STUDIO && 'text-foreground'
            )}
          >
            Về khóa học
          </Link>

          {isLoggedIn && user ? (
            <>
              <button
                onClick={toggleMenu}
                className='flex items-center gap-2 focus:outline-none transition-transform active:scale-95'
                aria-expanded={isMenuOpen}
                aria-haspopup='true'
                type='button'
              >
                <Avatar className='h-9 w-9 border-2 border-transparent hover:border-primary transition-all'>
                  <AvatarImage src={avatarUrl} alt={user.fullName} />
                  <AvatarFallback className='bg-primary text-primary-foreground text-xs font-bold'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>

              {isMenuOpen && (
                <div className='absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border bg-background shadow-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right'>
                  <div className='px-4 py-3 border-b'>
                    <p className='text-sm font-semibold text-foreground truncate'>{user.fullName}</p>
                    <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                  </div>

                  <div className='p-1'>
                    <Link
                      href={PATH.PROFILE}
                      className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors'
                      onClick={closeMenu}
                    >
                      <UserIcon size={16} />
                      Profile
                    </Link>
                    <Link
                      href='/settings'
                      className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors'
                      onClick={closeMenu}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>

                  <div className='border-t p-1'>
                    <button
                      onClick={handleLogout}
                      className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'
                      type='button'
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              href={PATH.LOGIN}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap'
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
