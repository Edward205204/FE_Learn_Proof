'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useGetMeQuery, useUpdateProfileMutation } from '@/app/(auth)/_hooks/use-auth-mutation'

type ProfileForm = {
  firstName: string
  lastName: string
  headline: string
  bio: string
  website: string
}

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery()
  const updateMutation = useUpdateProfileMutation()

  // Tách fullName thành firstName / lastName
  const nameParts = user?.fullName?.trim().split(' ') ?? []
  const defaultLastName = nameParts.length > 1 ? nameParts[0] : ''
  const defaultFirstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] ?? ''

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      headline: '',
      bio: '',
      website: '',
    },
  })

  // Populate form khi data từ API về
  useEffect(() => {
    if (user) {
      reset({
        firstName: defaultFirstName,
        lastName: defaultLastName,
        headline: user.headline ?? '',
        bio: user.bio ?? '',
        website: user.website ?? '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const onSubmit = async (data: ProfileForm) => {
    const fullName = `${data.lastName} ${data.firstName}`.trim()
    try {
      await updateMutation.mutateAsync({
        fullName: fullName || undefined,
        headline: data.headline || null,
        bio: data.bio || null,
        website: data.website || null,
      })
      toast.success('Hồ sơ đã được cập nhật!')
      reset(data) // clear dirty state
    } catch {
      toast.error('Cập nhật thất bại, vui lòng thử lại.')
    }
  }

  return (
    <div className='flex flex-col w-full'>
      {/* Header section */}
      <div className='pb-8 mb-8 border-b border-border'>
        <h1 className='text-3xl font-bold text-foreground tracking-tight mb-2'>Hồ sơ công khai</h1>
        <p className='text-[15px] text-muted-foreground'>Thêm thông tin về bản thân bạn</p>
      </div>

      {/* Form section */}
      {isLoading ? (
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
          {/* Basic Info */}
          <div className='space-y-5'>
            <Label className='text-[15px] font-bold text-foreground'>Những điều cơ bản</Label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='space-y-2'>
                <Input
                  placeholder='Tên'
                  {...register('firstName')}
                  className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
              </div>
              <div className='space-y-2'>
                <Input
                  placeholder='Họ'
                  {...register('lastName')}
                  className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <Input
                  placeholder='Tiêu đề chuyên môn'
                  maxLength={60}
                  {...register('headline')}
                  className='h-11 rounded-md border-input bg-background pr-16 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
              </div>
              <p className='text-[13px] text-muted-foreground'>
                Hãy thêm tiêu đề chuyên nghiệp như &quot;Giảng viên tại Udemy&quot; hoặc &quot;Kiến trúc sư phần mềm&quot;.
              </p>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className='space-y-3'>
            <Label className='text-[15px] font-bold text-foreground'>Email liên hệ</Label>
            <Input
              value={user?.email ?? ''}
              readOnly
              className='h-11 rounded-md border-input bg-muted/50 text-muted-foreground cursor-not-allowed'
            />
            <p className='text-[13px] text-muted-foreground'>Bạn không thể thay đổi địa chỉ email liên kết với tài khoản này.</p>
          </div>

          {/* Bio */}
          <div className='space-y-3'>
            <Label className='text-[15px] font-bold text-foreground'>Tiểu sử</Label>
            <div className='border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-shadow'>
              <div className='flex items-center gap-1 p-2 border-b border-input bg-muted/30'>
                <button type='button' className='p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors'>
                  <Bold size={16} />
                </button>
                <button type='button' className='p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors'>
                  <Italic size={16} />
                </button>
              </div>
              <Textarea
                placeholder='Viết một vài dòng về bản thân bạn...'
                {...register('bio')}
                className='min-h-[140px] rounded-none border-0 resize-y focus-visible:ring-0 p-4'
              />
            </div>
            <p className='text-[13px] text-muted-foreground'>
              Không được phép đăng tải liên kết và mã giảm giá trong phần này.
            </p>
          </div>

          <div className='h-px bg-border' />

          {/* Links */}
          <div className='space-y-3'>
            <Label className='text-[15px] font-bold text-foreground'>Liên kết cá nhân</Label>
            <Input
              placeholder='Trang web (ví dụ: https://portfolio.com)'
              {...register('website')}
              className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
            />
          </div>

          {/* Save button */}
          <div className='pt-6 pb-8 flex'>
            <Button
              type='submit'
              disabled={updateMutation.isPending || !isDirty}
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-md transition-colors disabled:opacity-60'
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
