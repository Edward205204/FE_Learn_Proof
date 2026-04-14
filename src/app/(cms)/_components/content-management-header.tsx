'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Settings, User as UserIcon, Home } from 'lucide-react'

import { PATH } from '@/constants/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useHeader } from '@/hooks/use-header'
import { useEffect, useRef } from 'react'

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: PATH.COURSE_NEW_STEP1, title: 'Tạo khóa học' },
  { prefix: PATH.STUDIO_COURSES, title: 'Khóa học' },
  { prefix: PATH.FEEDBACK_LIST, title: 'Feedback' },
  { prefix: PATH.QUIZ_LESSON, title: 'Quiz' },
  { prefix: PATH.QUIZ_STANDALONE, title: 'Quiz' },
  { prefix: PATH.STUDIO_COURSES, title: 'Khóa học' }
]

function pickTitle(pathname: string) {
  return TITLE_BY_PREFIX.find((x) => pathname.startsWith(x.prefix))?.title ?? 'Content Management'
}

export function ContentManagementHeader() {
  const pathname = usePathname()
  const title = pickTitle(pathname)
  const { user, isLoggedIn, isMenuOpen, toggleMenu, handleLogout, closeMenu } = useHeader()

  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!isMenuOpen) toggleMenu()
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      closeMenu()
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

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
    <header className='sticky top-0 z-20 border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md'>
      <div className='w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 min-w-0'>
          <LayoutDashboard className='h-5 w-5 text-muted-foreground' />
          <div className='min-w-0'>
            <p className='text-sm font-medium truncate'>{title}</p>
            <p className='text-xs text-muted-foreground truncate'>Khu vực quản trị nội dung</p>
          </div>
        </div>

        <div className='flex items-center gap-2 ml-auto'>
          {/* Button độc lập — không kích hoạt dropdown */}
          <Link
            href={PATH.HOME}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              border border-border text-foreground
              hover:bg-muted hover:scale-105
              transition-all duration-200'
            aria-label='Về trang chủ'
          >
            <Home size={15} />
            Về trang chủ
          </Link>

          {/* Avatar + dropdown — tách riêng, không bị lẫn với button trên */}
          <div className='relative' ref={menuRef} onMouseEnter={openMenu} onMouseLeave={handleMouseLeave}>
            {isLoggedIn && user ? (
              <>
                <button
                  onClick={toggleMenu}
                  onFocus={() => {
                    if (!isMenuOpen) toggleMenu()
                  }}
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
                  <div className='absolute right-0 top-full mt-2 w-56 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50'>
                    {/* Bridge element to fill the gap - ensures no mouseLeave when moving to menu */}
                    <div className='absolute -top-2 left-0 right-0 h-4 bg-transparent' />

                    <div className='overflow-hidden rounded-xl border bg-background shadow-xl'>
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
                          className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors'
                          type='button'
                        >
                          <LogOut size={16} />
                          Log out
                        </button>
                      </div>
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
      </div>
    </header>
  )
}
