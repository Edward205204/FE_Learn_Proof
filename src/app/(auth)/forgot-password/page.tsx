'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ForgotPasswordInput, ForgotPasswordSchema } from '../_utils/zod'
import { useForgotPasswordMutation } from '../_hooks/use-auth-mutation'
import { HttpStatusCode } from '@/constants/http-status'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'

export default function ForgotPasswordPage() {
    const forgotPasswordMutation = useForgotPasswordMutation()

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    function onSubmit(values: ForgotPasswordInput) {
        if (forgotPasswordMutation.isPending) return

        forgotPasswordMutation.mutate(values, {
            onError: (error) => {
                if (isAxiosError<ApiErrorResponse>(error) && error.response?.status === HttpStatusCode.UnprocessableEntity) {
                    const { message } = error.response.data
                    if (Array.isArray(message)) {
                        message.forEach((err: ApiFieldError) => {
                            if (err.path in form.getValues()) {
                                form.setError(err.path as keyof ForgotPasswordInput, { message: err.message })
                            }
                        })
                    }
                }
            }
        })
    }

    return (
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm'>
                <div className='mb-8'>
                    <Link
                        href='/login'
                        className='inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6'
                    >
                        <ChevronLeft size={16} className='mr-1' />
                        Quay lại đăng nhập
                    </Link>
                    <h1 className='text-2xl font-bold text-foreground'>Quên mật khẩu?</h1>
                    <p className='text-muted-foreground text-sm mt-2'>
                        Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-foreground font-medium'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete='email'
                                            placeholder='name@example.com'
                                            className='bg-input border-border rounded-md focus:ring-ring focus:border-ring'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )}
                        />

                        <Button
                            type='submit'
                            disabled={forgotPasswordMutation.isPending}
                            className='w-full bg-primary text-primary-foreground rounded-md py-6 text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]'
                        >
                            {forgotPasswordMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}