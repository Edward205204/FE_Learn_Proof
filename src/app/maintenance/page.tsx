'use client'

import { ShieldAlert, Clock, Hammer, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PATH } from '@/constants/path'
import { useAuthStore } from '@/store/auth.store'

export default function MaintenancePage() {
  const { user, clearAuth } = useAuthStore()
  const isLoggedIn = !!user

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white overflow-hidden relative'>
      {/* Background Decorative Elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20'>
        <div className='absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]'></div>
        <div className='absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]'></div>
      </div>

      <div className='z-10 flex flex-col items-center max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
        <div className='relative'>
          <div className='absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full'></div>
          <div className='relative bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl'>
            <Hammer className='h-16 w-16 text-yellow-500 animate-bounce' />
          </div>
        </div>

        <div className='space-y-4'>
          <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400'>
            Hệ Thống Đang Bảo Trì
          </h1>
          <p className='text-lg md:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed'>
            Chúng tôi đang cập nhật và nâng cấp hệ thống để mang lại trải nghiệm tốt nhất cho bạn. Quá trình này sẽ hoàn
            tất sớm thôi.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4'>
          <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col items-center space-y-2'>
            <Clock className='text-blue-400 h-6 w-6' />
            <span className='text-sm font-medium text-slate-300'>Dự kiến hoàn tất</span>
            <span className='text-xs text-slate-500 italic'>Khoảng 1 - 2 tiếng nữa</span>
          </div>
          <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col items-center space-y-2'>
            <ShieldAlert className='text-yellow-400 h-6 w-6' />
            <span className='text-sm font-medium text-slate-300'>Dữ liệu an toàn</span>
            <span className='text-xs text-slate-500'>Mọi dữ liệu đã được bảo vệ</span>
          </div>
          <div className='bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col items-center space-y-2'>
            <Hammer className='text-purple-400 h-6 w-6' />
            <span className='text-sm font-medium text-slate-300'>Nâng cấp tính năng</span>
            <span className='text-xs text-slate-500'>Nhanh hơn, mượt mà hơn</span>
          </div>
        </div>

        <div className='pt-8 flex flex-wrap justify-center gap-4'>
          <Button
            asChild
            variant='outline'
            className='rounded-full px-8 py-6 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 transition-all duration-300'
          >
            <Link href='/'>Tải lại trang</Link>
          </Button>

          {isLoggedIn ? (
            <Button
              onClick={() => clearAuth()}
              variant='ghost'
              className='rounded-full px-8 py-6 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all duration-300'
            >
              <LogOut className='mr-2 h-4 w-4' /> Đăng xuất ({user?.fullName})
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant='ghost'
                className='rounded-full px-8 py-6 text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300'
              >
                <Link href={PATH.LOGIN}>Đăng nhập</Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='rounded-full px-8 py-6 text-slate-500 hover:text-white transition-all duration-300'
              >
                <Link href={PATH.REGISTER}>Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        <footer className='pt-12 text-slate-500 text-sm'>
          &copy; {new Date().getFullYear()} BC Learn Proof. Đội ngũ kỹ thuật đang làm việc hết công suất.
        </footer>
      </div>
    </div>
  )
}
