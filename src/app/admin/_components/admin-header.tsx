'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, LogOut, Settings, User as UserIcon } from 'lucide-react'

import { PATH } from '@/constants/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useHeader } from '@/hooks/use-header'
import { useEffect, useRef } from 'react'

const TITLE_BY_PREFIX: Array<{ prefix: string; title: string }> = [
  { prefix: PATH.ADMIN_DASHBOARD, title: 'Bảng điều khiển' },
  { prefix: PATH.ADMIN_USERS, title: 'Quản lý người dùng' },
  { prefix: PATH.ADMIN_COURSES, title: 'Quản lý khóa học' },
  { prefix: PATH.ADMIN_LOGS, title: 'Nhật ký hệ thống' },
  { prefix: PATH.ADMIN_SETTINGS, title: 'Cài đặt hệ thống' }
]

function pickTitle(pathname: string) {
  return TITLE_BY_PREFIX.find((x) => pathname.startsWith(x.prefix))?.title ?? 'Admin Control Center'
}

export function AdminHeader() {
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
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-bold truncate leading-none mb-1'>{title}</p>
            <p className='text-[10px] text-muted-foreground truncate uppercase tracking-tighter'>
              Hệ thống quản trị tối cao
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2 ml-auto'>
          <div className='relative' ref={menuRef} onMouseEnter={openMenu} onMouseLeave={handleMouseLeave}>
            {isLoggedIn && user ? (
              <>
                <button
                  onClick={toggleMenu}
                  className='flex items-center gap-2 focus:outline-none transition-transform active:scale-95'
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
                    <div className='absolute -top-2 left-0 right-0 h-4 bg-transparent' />

                    <div className='overflow-hidden rounded-xl border bg-background shadow-xl'>
                      <div className='px-4 py-3 border-b bg-muted/30'>
                        <p className='text-sm font-semibold text-foreground truncate'>{user.fullName}</p>
                        <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                        <div className='mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary'>
                          Administrator
                        </div>
                      </div>

                      <div className='p-1'>
                        <Link
                          href={PATH.PROFILE}
                          className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors'
                          onClick={closeMenu}
                        >
                          <UserIcon size={16} />
                          Hồ sơ của tôi
                        </Link>
                        <Link
                          href={PATH.ADMIN_SETTINGS}
                          className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors'
                          onClick={closeMenu}
                        >
                          <Settings size={16} />
                          Cài đặt hệ thống
                        </Link>
                      </div>

                      <div className='border-t p-1'>
                        <button
                          onClick={handleLogout}
                          className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors'
                          type='button'
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
