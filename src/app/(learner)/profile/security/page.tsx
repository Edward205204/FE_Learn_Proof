'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { useForgotPasswordMutation } from '@/app/(auth)/_hooks/use-auth-mutation'
import { useCountdown } from '@/hooks/use-countdown'

export default function SecurityPage() {
  const user = useAuthStore((state) => state.user)
  const forgotPasswordMutation = useForgotPasswordMutation()
  const { countdown, start: startCountdown } = useCountdown(60)

  function handleForgotPassword() {
    if (!user?.email || forgotPasswordMutation.isPending || countdown > 0) return

    forgotPasswordMutation.mutate(
      { email: user.email },
      { onSuccess: () => startCountdown() }
    )
  }

  return (
    <div className='flex flex-col w-full'>
      {/* Header section */}
      <div className='py-6 border-b border-border text-center'>
        <h1 className='text-2xl font-bold text-foreground mb-2'>Bảo mật tài khoản</h1>
        <p className='text-[15px] text-muted-foreground'>
          Chỉnh sửa cài đặt tài khoản của bạn và thay đổi mật khẩu tại đây.
        </p>
      </div>

      {/* Main Form section */}
      <div className='flex flex-col w-full'>

        {/* Change Password Section */}
        <div className='p-8 max-w-2xl mx-auto w-full border-b border-border'>
          <div className='space-y-6'>

            {/* Current Password */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-[15px] font-bold text-foreground'>
                  Mật khẩu hiện tại
                </Label>
                <button
                  type='button'
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordMutation.isPending || countdown > 0}
                  className='text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors tabular-nums'
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
                className='h-[46px] rounded-sm border-input'
              />
            </div>

            {/* New Password */}
            <div className='space-y-2'>
              <Label className='text-[15px] font-bold text-foreground block'>
                Mật khẩu mới
              </Label>
              <Input
                type='password'
                placeholder='Nhập mật khẩu mới'
                className='h-[46px] rounded-sm border-input'
              />
            </div>

            {/* Confirm New Password */}
            <div className='space-y-2'>
              <Label className='text-[15px] font-bold text-foreground block'>
                Xác nhận mật khẩu mới
              </Label>
              <Input
                type='password'
                placeholder='Nhập lại mật khẩu mới'
                className='h-[46px] rounded-sm border-input'
              />
            </div>

            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-[42px] px-6 rounded-sm'>
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

