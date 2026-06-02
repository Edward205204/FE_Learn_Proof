'use client'

import {
  LogOut,
  User as UserIcon,
  Settings,
  BookOpen,
  History as HistoryIcon,
  LayoutDashboard,
  ShoppingCart,
  Award
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PATH } from '@/constants/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useHeader } from '@/hooks/use-header'
import { Role } from '@/@types/user'
import { useRef, useEffect } from 'react'
import { useCartQuery } from '@/app/(learner)/_hooks/use-cart'
import SearchInput from './search-input'
import { NotificationBell } from '@/app/(learner)/_components/notification-bell'

export default function Header() {
  const { user, isLoggedIn, isMenuOpen, toggleMenu, handleLogout, closeMenu } = useHeader()

  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAuthPage = [PATH.LOGIN, PATH.REGISTER].includes(pathname)

  const { data: cartData } = useCartQuery(isLoggedIn && !isAuthPage)
  const cartCount = cartData?.items?.length || 0

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

  // Lấy avatar từ store nếu có, không thì dùng mặc định
  const avatarUrl =
    user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`
  const initials =
    user?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'

  return (
    <header
      className='sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 md:px-10 py-3 
      border-[oklch(0.92_0.004_286.32)] 
      bg-white/80 
      dark:bg-[oklch(0.141_0.005_285.823)]/80 
      dark:border-[oklch(0.274_0.006_286.033)]'
    >
      <div className='mx-auto flex max-w-[1200px] items-center justify-between gap-8'>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-2 text-primary'>
            <Image
              src='/images/leaner/logo (2).png'
              alt='Learner Logo'
              width={56}
              height={56}
              className='object-contain'
              priority
            />
            <Link
              href='/'
              className='text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-xl font-bold tracking-tight'
            >
              Learn Proof
            </Link>
          </div>

          <div className='hidden md:flex items-center'>
            <SearchInput />
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <nav
            className='hidden lg:flex items-center gap-3 text-sm font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]'
            aria-label='Main navigation'
          >
            <Link
              href='/courses'
              className='liquid-glass-item relative px-4 py-2 transition-all duration-300 hover:text-primary'
            >
              <span className='liquid-glass-bg' />
              <span className='liquid-glass-shine' />
              <span className='relative z-10 font-bold'>Khám phá</span>
            </Link>
            <Link
              href={PATH.MY_COURSES || '/courses/list'}
              className='liquid-glass-item relative px-4 py-2 transition-all duration-300 hover:text-primary'
            >
              <span className='liquid-glass-bg' />
              <span className='liquid-glass-shine' />
              <span className='relative z-10 font-bold'>Học tập</span>
            </Link>
            <Link
              href='/wishlist'
              className='liquid-glass-item relative px-4 py-2 transition-all duration-300 hover:text-primary'
            >
              <span className='liquid-glass-bg' />
              <span className='liquid-glass-shine' />
              <span className='relative z-10 font-bold'>Yêu thích</span>
            </Link>
            <Link
              href='/cart'
              className='liquid-glass-item relative px-4 py-2 transition-all duration-300 hover:text-primary gap-2'
            >
              <span className='liquid-glass-bg' />
              <span className='liquid-glass-shine' />
              <span className='relative z-10 flex items-center gap-2 font-bold'>
                <span className='relative inline-flex items-center'>
                  <ShoppingCart size={16} />
                  {isLoggedIn && cartCount > 0 && (
                    <span className='absolute -right-2 -top-2 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] leading-4 font-black text-center'>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </span>
                Giỏ hàng
              </span>
            </Link>

            {/* CMS Button — chỉ hiện với ADMIN hoặc CONTENT_MANAGER */}
            {isLoggedIn && user && (user.role === Role.ADMIN || user.role === Role.CONTENT_MANAGER) && (
              <Link
                href={PATH.STUDIO_COURSES}
                className='flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
                  bg-primary text-primary-foreground
                  hover:bg-primary/90 hover:scale-105
                  transition-all duration-200 shadow-sm relative overflow-hidden group'
                aria-label='Vào trang quản trị CMS'
              >
                <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0' />
                <span className='relative z-10 flex items-center gap-1.5 font-bold'>
                  <LayoutDashboard size={15} />
                  Quản trị CMS
                </span>
              </Link>
            )}

            {/* Thông báo — sử dụng NotificationBell từ API thực */}
            {isLoggedIn && <NotificationBell />}
          </nav>

          <div
            className='flex items-center gap-4 relative group'
            ref={menuRef}
            onMouseEnter={() => {
              if (!isMenuOpen) toggleMenu()
            }}
            onMouseLeave={() => {
              if (isMenuOpen) closeMenu()
            }}
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
                >
                  <Avatar className='h-9 w-9 border-2 border-transparent hover:border-primary transition-all'>
                    <AvatarImage src={avatarUrl} alt={user.fullName} />
                    <AvatarFallback className='bg-primary text-white text-xs font-bold'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className='absolute right-0 top-full pt-3 w-56 z-50'>
                    <div className='overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-[oklch(0.141_0.005_285.823)] dark:border-[oklch(0.274_0.006_286.033)] animate-in fade-in zoom-in-95 duration-200 origin-top-right'>
                      <div className='px-4 py-3 border-b dark:border-[oklch(0.274_0.006_286.033)]'>
                        <p className='text-sm font-semibold text-[oklch(0.141_0.005_285.823)] dark:text-white truncate'>
                          {user.fullName}
                        </p>
                        <p className='text-xs text-[oklch(0.552_0.016_285.938)] truncate'>{user.email}</p>
                      </div>

                      <div className='p-1 flex flex-col gap-0.5'>
                        <Link
                          href={PATH.PROFILE || '/profile'}
                          className='liquid-glass-dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:text-primary dark:hover:text-primary border border-transparent transition-all duration-200'
                          onClick={closeMenu}
                        >
                          <UserIcon size={16} />
                          Hồ sơ của tôi
                        </Link>
                        <Link
                          href={PATH.MY_COURSES || '/courses/list'}
                          className='liquid-glass-dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:text-primary dark:hover:text-primary border border-transparent transition-all duration-200'
                          onClick={closeMenu}
                        >
                          <BookOpen size={16} />
                          Khóa học của tôi
                        </Link>
                        <Link
                          href='/my-certificates'
                          className='liquid-glass-dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:text-primary dark:hover:text-primary border border-transparent transition-all duration-200'
                          onClick={closeMenu}
                        >
                          <Award size={16} />
                          Chứng chỉ của tôi
                        </Link>
                        <Link
                          href={PATH.PAYMENT_HISTORY || '/payment-history'}
                          className='liquid-glass-dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:text-primary dark:hover:text-primary border border-transparent transition-all duration-200'
                          onClick={closeMenu}
                        >
                          <HistoryIcon size={16} />
                          Lịch sử thanh toán
                        </Link>
                        <Link
                          href={PATH.SETTINGS || '/settings'}
                          className='liquid-glass-dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:text-primary dark:hover:text-primary border border-transparent transition-all duration-200'
                          onClick={closeMenu}
                        >
                          <Settings size={16} />
                          Cài đặt
                        </Link>
                      </div>

                      <div className='border-t p-1 dark:border-[oklch(0.274_0.006_286.033)]'>
                        <button
                          onClick={handleLogout}
                          className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all duration-200'
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
                href='/login'
                className='flex h-10 min-w-[90px] items-center justify-center px-5 text-sm font-bold text-white transition-opacity hover:opacity-90
              bg-primary 
              rounded-[calc(0.5rem-2px)] 
              shadow-sm'
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
