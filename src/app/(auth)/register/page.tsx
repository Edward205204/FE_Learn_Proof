'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import GoogleIcon from '@/components/common/google-icon'
import { useCountdown } from '@/hooks/use-countdown'
import { RegisterInput, RegisterSchema } from '../_utils/zod'
import { useRegisterMutation, useSendOtpMutation } from '../_hooks/use-auth-mutation'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'
import { HttpStatusCode } from '@/constants/http-status'

export default function RegisterPage() {
  const router = useRouter()
  const { countdown, start: startCountdown } = useCountdown(60)
  const registerMutation = useRegisterMutation()
  const sendOtpMutation = useSendOtpMutation()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      otpCode: ''
    }
  })

  function handleSendOtp() {
    const email = form.getValues('email')
    if (!email || form.getFieldState('email').invalid) {
      form.setError('email', { message: 'Vui lòng nhập email hợp lệ trước khi gửi OTP' })
      return
    }

    if (sendOtpMutation.isPending) return

    sendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          startCountdown()
          toast.success('Mã OTP đã được gửi đến email của bạn!')
        }
      }
    )
  }

  function onSubmit(values: RegisterInput) {
    if (registerMutation.isPending) return

    const { otpCode, ...rest } = values

    registerMutation.mutate(
      { ...rest, code: otpCode },
      {
        onSuccess: () => {
          toast.success('Đăng ký thành công!')
          router.push('/')
        },
        onError: (error) => {
          if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
            const { message } = error.response.data
            if (Array.isArray(message)) {
              message.forEach((err: ApiFieldError) => {
                const fieldMap: Record<string, keyof RegisterInput> = { code: 'otpCode' }
                const field = (fieldMap[err.path] ?? err.path) as keyof RegisterInput
                if (field in form.getValues()) {
                  form.setError(field, { message: err.message })
                }
              })
            }
          }
        }
      }
    )
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-foreground'>Đăng ký tài khoản</h1>
          <p className='text-muted-foreground text-sm mt-2'>Tạo tài khoản để bắt đầu học ngay hôm nay</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Họ và Tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Nguyen Van A' className='bg-input rounded-md focus:ring-ring' {...field} />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='example@gmail.com'
                      className='bg-input rounded-md focus:ring-ring'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground font-medium'>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••••' className='bg-input rounded-md' {...field} />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-foreground font-medium'>Xác nhận</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='••••••••' className='bg-input rounded-md' {...field} />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='otpCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Mã OTP</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input placeholder='123456' maxLength={6} className='bg-input rounded-md flex-1' {...field} />
                    </FormControl>
                    <Button
                      type='button'
                      variant='secondary'
                      disabled={countdown > 0 || sendOtpMutation.isPending}
                      onClick={handleSendOtp}
                      className='rounded-md whitespace-nowrap min-w-[100px]'
                    >
                      {sendOtpMutation.isPending ? 'Đang gửi...' : countdown > 0 ? `${countdown}s` : 'Gửi OTP'}
                    </Button>
                  </div>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={registerMutation.isPending}
              className='w-full bg-primary text-primary-foreground rounded-md py-6 text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]'
            >
              {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký ngay'}
            </Button>
          </form>
        </Form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-border'></span>
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card px-3 text-muted-foreground'>Hoặc tiếp tục với</span>
          </div>
        </div>

        <Button
          variant='outline'
          type='button'
          className='w-full border-border rounded-md py-6 flex gap-3 items-center hover:bg-accent hover:text-accent-foreground transition-all'
        >
          <GoogleIcon size={22} />
          <span className='font-medium'>Đăng nhập với Google</span>
        </Button>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Đã có tài khoản?{' '}
          <Link href='/login' className='text-primary font-semibold hover:underline'>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
