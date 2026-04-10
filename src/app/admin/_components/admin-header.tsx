'use client'

import Link from 'next/link'
import { Shield, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { PATH } from '@/constants/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useHeader } from '@/hooks/use-header'

export function AdminHeader() {
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
    user?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Admin')}&background=random`
  const initials =
    user?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD'

  return (
    <header className='sticky top-0 z-20 border-b bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md'>
      <div className='w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 min-w-0'>
          <Shield className='h-6 w-6 text-primary' />
          <div className='min-w-0'>
            <p className='text-sm font-bold text-primary truncate'>Learn Proof</p>
            <p className='text-[10px] uppercase font-semibold text-muted-foreground tracking-wide truncate'>
              Hệ thống quản trị
            </p>
          </div>
        </div>

        <div
          className='flex items-center gap-4 relative'
          ref={menuRef}
          onMouseEnter={openMenu}
          onMouseLeave={handleMouseLeave}
        >
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
                  <div className='absolute -top-2 left-0 right-0 h-4 bg-transparent' />

                  <div className='overflow-hidden rounded-xl border bg-background shadow-xl'>
                    <div className='px-4 py-3 border-b'>
                      <p className='text-sm font-semibold text-foreground truncate'>{user.fullName}</p>
                      <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                      <span className='inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full'>
                        Admin
                      </span>
                    </div>

                    <div className='p-1'>
                      <Link
                        href='/admin/settings'
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
                        className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors'
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
