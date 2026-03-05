'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ResetPasswordInput, ResetPasswordSchema } from '../_utils/zod'
import { useResetPasswordMutation, useVerifyResetPasswordMutation } from '../_hooks/use-auth-mutation'
import { HttpStatusCode } from '@/constants/http-status'
import { ApiErrorResponse, ApiFieldError } from '../_types/auth'

function ResetPasswordForm({ code }: { code: string }) {
    const resetPasswordMutation = useResetPasswordMutation()
    const [isVerified, setIsVerified] = useState(false)
    const [isVerifying, setIsVerifying] = useState(true)
    const verifyMutation = useVerifyResetPasswordMutation()
    const router = useRouter()

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    useEffect(() => {
        if (code) {
            verifyMutation.mutate({ code }, {
                onSuccess: () => {
                    setIsVerified(true)
                    setIsVerifying(false)
                    toast.success('Mã xác nhận hợp lệ. Vui lòng thiết lập mật khẩu mới.')
                },
                onError: () => {
                    setIsVerifying(false)
                    // Error toast is handled by axios interceptor
                    // Redirecting after a short delay
                    setTimeout(() => {
                        router.push('/login')
                    }, 3000)
                }
            })
        } else {
            setIsVerifying(false)
            toast.error('Mã xác nhận không tìm thấy.')
            router.push('/login')
        }
    }, [code, verifyMutation, router])

    function onSubmit(values: ResetPasswordInput) {
        if (resetPasswordMutation.isPending) return

        resetPasswordMutation.mutate({ ...values, code }, {
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

    if (isVerifying) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                <div className='relative'>
                    <div className='w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin'></div>
                    <Loader2 className='absolute inset-0 m-auto text-primary animate-pulse' size={24} />
                </div>
                <div className='text-center'>
                    <h2 className='text-xl font-semibold text-foreground'>Đang xác thực...</h2>
                    <p className='text-muted-foreground text-sm'>Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        )
    }

    if (!isVerified) {
        return (
            <div className='flex flex-col items-center justify-center space-y-4 py-8 text-center'>
                <div className='w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-2'>
                    <AlertCircle size={32} />
                </div>
                <h2 className='text-xl font-bold text-foreground'>Xác thực thất bại</h2>
                <p className='text-muted-foreground text-sm max-w-xs'>
                    Mã xác nhận đã hết hạn hoặc không hợp lệ. Bạn sẽ được chuyển hướng về trang đăng nhập.
                </p>
                <Button variant='outline' onClick={() => router.push('/login')} className='mt-4'>
                    Quay lại đăng nhập
                </Button>
            </div>
        )
    }

    return (
        <>
            <div className='mb-8 text-center'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4'>
                    <ShieldCheck size={32} />
                </div>
                <h1 className='text-2xl font-bold text-foreground'>Đặt lại mật khẩu</h1>
                <p className='text-muted-foreground text-sm mt-2'>
                    Vui lòng nhập mật khẩu mới của bạn bên dưới.
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
                                    <div className='relative'>
                                        <Input
                                            type='password'
                                            placeholder='••••••••'
                                            className='bg-input border-border rounded-md focus:ring-ring focus:border-ring pl-10'
                                            {...field}
                                        />
                                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={18} />
                                    </div>
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
                                <FormLabel className='text-foreground font-medium'>Xác nhận mật khẩu mới</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Input
                                            type='password'
                                            placeholder='••••••••'
                                            className='bg-input border-border rounded-md focus:ring-ring focus:border-ring pl-10'
                                            {...field}
                                        />
                                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' size={18} />
                                    </div>
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
                        {resetPasswordMutation.isPending ? (
                            <>
                                <Loader2 className='mr-2 animate-spin' size={18} />
                                Đang xử lý...
                            </>
                        ) : 'Cập nhật mật khẩu'}
                    </Button>
                </form>
            </Form>
        </>
    )
}

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code') || ''

    return <ResetPasswordForm code={code} />
}

export default function ResetPasswordPage() {
    return (
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden'>
                {/* Subtle background decoration */}
                <div className='absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl'></div>

                <Suspense fallback={
                    <div className='flex flex-col items-center justify-center py-12'>
                        <Loader2 className='text-primary animate-spin mb-4' size={40} />
                        <p className='text-muted-foreground'>Đang tải...</p>
                    </div>
                }>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    )
}
