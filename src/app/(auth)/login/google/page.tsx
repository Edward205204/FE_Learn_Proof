'use client'
import { useEffect, useState, startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import authApi from '@/app/(auth)/_api/auth.api'
import GoogleIcon from '@/components/common/google-icon'
import { PATH } from '@/constants/path'

type CallbackStatus = 'loading' | 'success' | 'error'

import { Suspense } from 'react'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>('loading')

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const errorMessage = searchParams.get('errorMessage')

    if (errorMessage) {
      startTransition(() => setStatus('error'))
      toast.error(errorMessage)
      setTimeout(() => router.replace(PATH.LOGIN), 2000)
      return
    }

    if (!accessToken || !refreshToken) {
      startTransition(() => setStatus('error'))
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
      setTimeout(() => router.replace(PATH.LOGIN), 2000)
      return
    }
    authApi
      .getProfile(accessToken)
      .then((response) => {
        const user = response.data
        useAuthStore.getState().setAuth({ accessToken, refreshToken, user })
        setStatus('success')
        toast.success('Đăng nhập với Google thành công!')

        setTimeout(() => {
          if (user.role === 'CONTENT_MANAGER') {
            router.replace(PATH.STUDIO_COURSES)
          } else if (user.role === 'ADMIN') {
            router.replace(PATH.ADMIN)
          } else {
            router.replace(`${PATH.ONBOARDING}/survey/step-1`)
          }
        }, 1000)
      })
      .catch(() => {
        setStatus('error')
        setTimeout(() => router.replace(PATH.LOGIN), 2000)
      })
  }, [searchParams, router])

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-sm bg-card border border-border rounded-lg shadow-sm p-10 flex flex-col items-center gap-7'>
        {/* Icon area */}
        <div className='relative flex items-center justify-center'>
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-[#16a34a]/10' : status === 'error' ? 'bg-destructive/10' : 'bg-primary/10'}`}
          >
            {status === 'loading' && <GoogleIcon size={36} />}
            {status === 'success' && <CheckCircle2 className='w-10 h-10 text-[#16a34a]' strokeWidth={1.5} />}
            {status === 'error' && <XCircle className='w-10 h-10 text-destructive' strokeWidth={1.5} />}
          </div>

          {status === 'loading' && (
            <span className='absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin' />
          )}
        </div>

        {/* Text */}
        <div className='text-center space-y-2'>
          {status === 'loading' && (
            <>
              <h2 className='text-lg font-semibold text-foreground'>Đang xử lý đăng nhập</h2>
              <p className='text-sm text-muted-foreground'>Vui lòng chờ trong giây lát...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <h2 className='text-lg font-semibold text-foreground'>Đăng nhập thành công!</h2>
              <p className='text-sm text-muted-foreground'>Đang chuyển hướng đến trang chủ...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <h2 className='text-lg font-semibold text-foreground'>Đăng nhập thất bại</h2>
              <p className='text-sm text-muted-foreground'>Đang quay lại trang đăng nhập...</p>
            </>
          )}
        </div>

        {/* Loading dots */}
        {status === 'loading' && (
          <div className='flex items-center gap-1.5'>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className='w-2 h-2 rounded-full bg-primary animate-bounce'
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
        )}

        {/* Status badge */}
        {status !== 'loading' && (
          <div
            className={`text-xs font-medium px-4 py-1.5 rounded-full border ${
              status === 'success'
                ? 'bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}
          >
            {status === 'success' ? 'Xác thực thành công' : 'Xác thực thất bại'}
          </div>
        )}
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallbackContent />
    </Suspense>
  )
}
