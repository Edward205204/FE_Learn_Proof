'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { ChevronLeft, Loader2, XCircle, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ResetPasswordBodySchema, ResetPasswordInput } from '../_utils/zod'
import { useForgotPasswordVerifyMutation, useResetPasswordMutation } from '../_hooks/use-auth-mutation'
import { HttpStatusCode } from '@/constants/http-status'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'
import { PATH } from '@/constants/path'

type VerifyStatus = 'verifying' | 'valid' | 'invalid'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const code = searchParams.get('code') ?? ''

  const [status, setStatus] = useState<VerifyStatus>('verifying')
  const hasVerified = useRef(false)

  const verifyMutation = useForgotPasswordVerifyMutation()
  const resetPasswordMutation = useResetPasswordMutation()

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordBodySchema),
    defaultValues: {
      email,
      password: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (hasVerified.current) return
    hasVerified.current = true

    if (!email || !code) {
      setStatus('invalid')
      return
    }

    verifyMutation.mutate(
      { email, code },
      {
        onSuccess: () => setStatus('valid'),
        onError: () => setStatus('invalid')
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(values: ResetPasswordInput) {
    if (resetPasswordMutation.isPending) return

    resetPasswordMutation.mutate(values, {
      onError: (error) => {
        if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
          const { message } = error.response.data
          if (Array.isArray(message)) {
            message.forEach((err: ApiFieldError) => {
              if (err.path in form.getValues()) {
                form.setError(err.path as keyof ResetPasswordInput, { message: err.message })
              }
            })
          }
        }
      }
    })
  }

  if (status === 'verifying') {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-card p-10 rounded-lg border border-border shadow-sm text-center'>
          <Loader2 className='h-14 w-14 animate-spin text-primary mx-auto mb-5' />
          <h2 className='text-xl font-semibold text-foreground'>Đang xác thực liên kết...</h2>
          <p className='text-muted-foreground text-sm mt-2'>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-card p-10 rounded-lg border border-border shadow-sm text-center'>
          <div className='w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5'>
            <XCircle className='h-7 w-7 text-destructive' />
          </div>
          <h2 className='text-xl font-semibold text-foreground'>Liên kết không hợp lệ</h2>
          <p className='text-muted-foreground text-sm mt-2'>
            Liên kết đặt lại mật khẩu đã hết hạn hoặc không đúng. Vui lòng thử lại.
          </p>
          <Link
            href={PATH.FORGOT_PASSWORD}
            className='inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-primary hover:underline'
          >
            <ChevronLeft size={15} />
            Gửi lại liên kết
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm'>
        <div className='mb-8'>
          <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
            <ShieldCheck className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-2xl font-bold text-foreground'>Đặt lại mật khẩu</h1>
          <p className='text-muted-foreground text-sm mt-2'>
            Nhập mật khẩu mới cho tài khoản <span className='font-medium text-foreground'>{email}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                      className='bg-input border-border rounded-md focus:ring-ring'
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
                  <FormLabel className='text-foreground font-medium'>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                      className='bg-input border-border rounded-md focus:ring-ring'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={resetPasswordMutation.isPending}
              className='w-full bg-primary text-primary-foreground rounded-md py-6 text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]'
            >
              {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>
          </form>
        </Form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          <Link href={PATH.LOGIN} className='inline-flex items-center gap-1 hover:text-primary transition-colors'>
            <ChevronLeft size={14} />
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
          <div className='w-full max-w-md bg-card p-10 rounded-lg border border-border shadow-sm text-center'>
            <Loader2 className='h-14 w-14 animate-spin text-primary mx-auto mb-5' />
            <h2 className='text-xl font-semibold text-foreground'>Đang tải...</h2>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
