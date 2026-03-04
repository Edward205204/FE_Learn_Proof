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
import { LoginInput, LoginSchema } from '../_utils/zod'
import GoogleIcon from '@/components/common/google-icon'
import { useLoginMutation } from '../_hooks/use-auth-mutation'
import { HttpStatusCode } from '@/constants/http-status'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLoginMutation()

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: LoginInput) {
    if (loginMutation.isPending) return

    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Đăng nhập thành công!')
        router.push('/')
      },
      onError: (error) => {
        if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
          const { message } = error.response.data
          if (Array.isArray(message)) {
            message.forEach((err: ApiFieldError) => {
              if (err.path in form.getValues()) {
                form.setError(err.path as keyof LoginInput, { message: err.message })
              }
            })
          }
        }
      }
    })
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      {/* Container Card */}
      <div className='w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-foreground'>Chào mừng trở lại</h1>
          <p className='text-muted-foreground text-sm mt-2'>Vui lòng nhập thông tin để truy cập khóa học</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            {/* Trường Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='name@example.com'
                      className='bg-input border-border rounded-md focus:ring-ring focus:border-ring'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            {/* Trường Mật khẩu */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-foreground font-medium'>Mật khẩu</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-xs text-muted-foreground hover:text-primary transition-colors'
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      className='bg-input border-border rounded-md focus:ring-ring'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />

            {/* Nút Đăng nhập chính */}
            <Button
              type='submit'
              disabled={loginMutation.isPending}
              className='w-full bg-primary text-primary-foreground rounded-md  py-6 text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]'
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </Form>

        {/* Ngăn cách hoặc */}
        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-border'></span>
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card px-3 text-muted-foreground'>Hoặc đăng nhập với</span>
          </div>
        </div>

        {/* Nút Google (UI Only) */}
        <Button
          variant='outline'
          type='button'
          className='w-full border-border rounded-md py-6 flex gap-3 items-center hover:bg-accent hover:text-accent-foreground transition-all'
        >
          <GoogleIcon size={22} />
          <span className='font-medium'>Google</span>
        </Button>

        {/* Link chuyển sang Đăng ký */}
        <p className='text-center text-sm text-muted-foreground mt-8'>
          Chưa có tài khoản?{' '}
          <Link href='/register' className='text-primary font-semibold hover:underline'>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
