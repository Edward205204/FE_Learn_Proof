'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { useAuthStore } from '@/store/auth.store'
import { useForgotPasswordMutation } from '@/app/(auth)/_hooks/use-auth-mutation'
import { useCountdown } from '@/hooks/use-countdown'

export default function SecurityPage() {
  const user = useAuthStore((state) => state.user)
  const forgotPasswordMutation = useForgotPasswordMutation()
  const { countdown, start: startCountdown } = useCountdown(60)

  function handleForgotPassword() {
    if (!user?.email || forgotPasswordMutation.isPending || countdown > 0) return

    forgotPasswordMutation.mutate({ email: user.email }, { onSuccess: () => startCountdown() })
  }

  return (
    <div className='flex flex-col w-full'>
      {/* Header section */}
      <div className='pb-8 mb-8 border-b border-border'>
        <h1 className='text-3xl font-bold text-foreground tracking-tight mb-2'>Bảo mật tài khoản</h1>
        <p className='text-[15px] text-muted-foreground'>
          Chỉnh sửa cài đặt tài khoản của bạn và thay đổi mật khẩu tại đây.
        </p>
      </div>

      {/* Main Form section */}
      <div className='flex flex-col w-full space-y-10'>
        {/* Change Password Section */}
        <div className='max-w-xl'>
          <div className='space-y-6'>
            {/* Current Password */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between mb-2'>
                <Label className='text-[15px] font-semibold text-foreground'>Mật khẩu hiện tại</Label>
                <button
                  type='button'
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordMutation.isPending || countdown > 0}
                  className='text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors tabular-nums font-medium'
                >
                  {forgotPasswordMutation.isPending
                    ? 'Đang gửi...'
                    : countdown > 0
                      ? `Gửi lại (${countdown}s)`
                      : 'Quên mật khẩu?'}
                </button>
              </div>
              <Input
                type='password'
                placeholder='Nhập mật khẩu hiện tại'
                className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
              />
            </div>

            {/* New Password */}
            <div className='space-y-2'>
              <Label className='text-[15px] font-semibold text-foreground block mb-2'>Mật khẩu mới</Label>
              <Input
                type='password'
                placeholder='Nhập mật khẩu mới'
                className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
              />
            </div>

            {/* Confirm New Password */}
            <div className='space-y-2'>
              <Label className='text-[15px] font-semibold text-foreground block mb-2'>Xác nhận mật khẩu mới</Label>
              <Input
                type='password'
                placeholder='Nhập lại mật khẩu mới'
                className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
              />
            </div>

            <div className='pt-4'>
              <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-8 rounded-md transition-colors'>
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
