'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import GoogleIcon from '@/components/common/google-icon'
import { useCountdown } from '@/hooks/use-countdown'
import { RegisterInput, RegisterSchema } from '../_utils/zod'
import { useRegisterMutation, useSendOtpMutation } from '../_hooks/use-auth-mutation'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'
import { HttpStatusCode } from '@/constants/http-status'
import { PATH } from '@/constants/path'

export default function RegisterPage() {
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
      code: ''
    }
  })

  async function handleSendOtp() {
    const isEmailValid = await form.trigger('email')
    if (!isEmailValid || sendOtpMutation.isPending) return

    // toast được xử lý trong useSendOtpMutation onSuccess
    sendOtpMutation.mutate(
      { email: form.getValues('email') },
      {
        onSuccess: () => startCountdown(),
        onError: (error) => {
          if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
            const { message } = error.response.data
            if (Array.isArray(message)) {
              message.forEach((err: ApiFieldError) => {
                if (err.path in form.getValues()) {
                  form.setError(err.path as keyof RegisterInput, { message: err.message })
                }
              })
            }
          }
        }
      }
    )
  }

  function onSubmit(values: RegisterInput) {
    if (registerMutation.isPending) return

    const { code, ...rest } = values

    // toast + redirect được xử lý trong useRegisterMutation onSuccess
    registerMutation.mutate(
      { ...rest, code },
      {
        onError: (error) => {
          if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
            const { message } = error.response.data
            if (Array.isArray(message)) {
              message.forEach((err: ApiFieldError) => {
                const field = err.path as keyof RegisterInput
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
                    <Input
                      autoComplete='name'
                      placeholder='Nguyen Van A'
                      className='bg-input rounded-md focus:ring-ring'
                      {...field}
                    />
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
                      autoComplete='email'
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
                      <Input
                        type='password'
                        autoComplete='new-password'
                        placeholder='••••••••'
                        className='bg-input rounded-md'
                        {...field}
                      />
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
                      <Input
                        type='password'
                        autoComplete='new-password'
                        placeholder='••••••••'
                        className='bg-input rounded-md'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Mã OTP</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        autoComplete='one-time-code'
                        placeholder='123456'
                        maxLength={6}
                        className='bg-input rounded-md flex-1'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      variant={countdown > 0 ? 'outline' : 'secondary'}
                      disabled={countdown > 0 || sendOtpMutation.isPending}
                      onClick={handleSendOtp}
                      className='rounded-md whitespace-nowrap min-w-[110px] tabular-nums'
                    >
                      {sendOtpMutation.isPending
                        ? 'Đang gửi...'
                        : countdown > 0
                          ? `Gửi lại (${countdown}s)`
                          : 'Gửi OTP'}
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
          <Link href={PATH.LOGIN} className='text-primary font-semibold hover:underline'>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
