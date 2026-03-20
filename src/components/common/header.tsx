'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, LogOut, User as UserIcon, Settings, BookOpen, History as HistoryIcon } from "lucide-react";
import Link from 'next/link'
import Image from 'next/image'
import { PATH } from "@/constants/path";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useHeader } from "@/hooks/use-header";
import { useRef, useEffect, useState } from "react";

export default function Header() {
  const {
    user,
    isLoggedIn,
    isMenuOpen,
    toggleMenu,
    handleLogout,
    closeMenu
  } = useHeader();

  const menuRef = useRef<HTMLDivElement>(null);
  
  // Notification state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notif when clicking outside
  useEffect(() => {
    const handleClickOutsideNotif = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutsideNotif);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotif);
    };
  }, [isNotifOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  // Lấy avatar từ store nếu có, không thì dùng mặc định
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=random`;
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 md:px-10 py-3 
      border-[oklch(0.92_0.004_286.32)] 
      bg-white/80 
      dark:bg-[oklch(0.141_0.005_285.823)]/80 
      dark:border-[oklch(0.274_0.006_286.033)]">

      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[oklch(0.577_0.245_27.325)]">
            <Image src="/images/leaner/logo (2).png" alt="Learner Logo" width={56} height={56} className="object-contain" priority />
            <Link href="/" className="text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-xl font-bold tracking-tight">
              Learn Proof
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Label className="relative flex h-10 w-64 items-center overflow-hidden bg-[oklch(0.92_0.004_286.32)] dark:bg-[oklch(0.21_0.006_285.885)] rounded-[calc(0.5rem-2px)]">
              <div className="flex items-center justify-center pl-4 text-[oklch(0.552_0.016_285.938)]">
                <Search size={18} />
              </div>
              <Input
                className="w-full border-none bg-transparent px-3 text-sm focus-visible:ring-2 focus-visible:ring-[oklch(0.577_0.245_27.325)] placeholder:text-[oklch(0.552_0.016_285.938)]"
                placeholder="Search courses..."
                type="text"
                aria-label="Search courses"
              />
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]" aria-label="Main navigation">
            <Link className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="/courses">Khám phá</Link>
            <Link className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href={PATH.MY_COURSES || "/courses/list"}>Học tập</Link>
            <Link className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="/wishlist">Yêu thích</Link>
            <Link className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="/cart">Giỏ hàng</Link>
            
            <div 
              className="relative group flex items-center" 
              ref={notifRef}
              onMouseEnter={() => setIsNotifOpen(true)}
              onMouseLeave={() => setIsNotifOpen(false)}
            >
              <button
                className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors focus:outline-none"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                onFocus={() => setIsNotifOpen(true)}
                aria-expanded={isNotifOpen}
              >
                Thông báo
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-full pt-4 w-80 z-50">
                  <div className="overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-[oklch(0.141_0.005_285.823)] dark:border-[oklch(0.274_0.006_286.033)] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b dark:border-[oklch(0.274_0.006_286.033)] flex justify-between items-center bg-gray-50/50 dark:bg-transparent">
                      <p className="font-semibold text-sm text-[oklch(0.141_0.005_285.823)] dark:text-white">
                        Thông báo mới
                      </p>
                      <span className="text-[10px] text-white bg-rose-500 px-2 py-0.5 rounded-full font-bold">2</span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="p-4 border-b dark:border-[oklch(0.274_0.006_286.033)] hover:bg-[oklch(0.967_0.001_0)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors cursor-pointer bg-rose-50/30 dark:bg-rose-900/10">
                        <p className="text-sm font-semibold text-[oklch(0.141_0.005_285.823)] dark:text-gray-100">Cập nhật khóa học mới</p>
                        <p className="text-xs text-[oklch(0.552_0.016_285.938)] mt-1 line-clamp-2">Khóa học "Mastering Figma" vừa có bài giảng mới. Hãy vào xem ngay!</p>
                        <p className="text-[10px] text-[oklch(0.577_0.245_27.325)] mt-2 font-bold">2 giờ trước</p>
                      </div>
                      <div className="p-4 border-b/50 dark:border-[oklch(0.274_0.006_286.033)] hover:bg-[oklch(0.967_0.001_0)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-[oklch(0.141_0.005_285.823)] dark:text-gray-100">Thanh toán thành công</p>
                        <p className="text-xs text-[oklch(0.552_0.016_285.938)] mt-1 line-clamp-2">Đơn hàng #12938 đã được xác nhận. Bạn đã có thể bắt đầu học khóa UI/UX.</p>
                        <p className="text-[10px] text-[oklch(0.552_0.016_285.938)] mt-2 font-medium">1 ngày trước</p>
                      </div>
                    </div>
                    <div className="p-3 border-t dark:border-[oklch(0.274_0.006_286.033)] text-center bg-gray-50/50 dark:bg-transparent">
                      <Link href="/notifications" className="text-xs text-[oklch(0.577_0.245_27.325)] font-bold hover:underline transition-all">
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div 
            className="flex items-center gap-4 relative group" 
            ref={menuRef}
            onMouseEnter={() => { if (!isMenuOpen) toggleMenu(); }}
            onMouseLeave={() => { if (isMenuOpen) closeMenu(); }}
          >
            {isLoggedIn && user ? (
              <>
                <button
                  onClick={toggleMenu}
                  onFocus={() => { if (!isMenuOpen) toggleMenu(); }}
                  className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  <Avatar className="h-9 w-9 border-2 border-transparent hover:border-[oklch(0.577_0.245_27.325)] transition-all">
                    <AvatarImage src={avatarUrl} alt={user.fullName} />
                    <AvatarFallback className="bg-[oklch(0.577_0.245_27.325)] text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full pt-3 w-56 z-50">
                    <div className="overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-[oklch(0.141_0.005_285.823)] dark:border-[oklch(0.274_0.006_286.033)] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b dark:border-[oklch(0.274_0.006_286.033)]">
                        <p className="text-sm font-semibold text-[oklch(0.141_0.005_285.823)] dark:text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-[oklch(0.552_0.016_285.938)] truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1">
                        <Link
                          href={PATH.PROFILE || "/profile"}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.92_0.004_286.32)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors"
                          onClick={closeMenu}
                        >
                          <UserIcon size={16} />
                          Hồ sơ của tôi
                        </Link>
                        <Link
                          href={PATH.MY_COURSES || "/courses/list"}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.92_0.004_286.32)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors"
                          onClick={closeMenu}
                        >
                          <BookOpen size={16} />
                          Khóa học của tôi
                        </Link>
                        <Link
                          href={PATH.PAYMENT_HISTORY || "/payment-history"}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.92_0.004_286.32)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors"
                          onClick={closeMenu}
                        >
                          <HistoryIcon size={16} />
                          Lịch sử thanh toán
                        </Link>
                        <Link
                          href={PATH.SETTINGS || "/settings"}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] hover:bg-[oklch(0.92_0.004_286.32)] dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors"
                          onClick={closeMenu}
                        >
                          <Settings size={16} />
                          Cài đặt
                        </Link>
                      </div>

                      <div className="border-t p-1 dark:border-[oklch(0.274_0.006_286.033)]">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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
              <Link href="/login" className="flex h-10 min-w-[90px] items-center justify-center px-5 text-sm font-bold text-white transition-opacity hover:opacity-90
              bg-[oklch(0.577_0.245_27.325)] 
              rounded-[calc(0.5rem-2px)] 
              shadow-sm">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
