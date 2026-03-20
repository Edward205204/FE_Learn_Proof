'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetMeQuery } from '@/app/(auth)/_hooks/use-auth-mutation'

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery()

  // Tách fullName thành firstName / lastName (word cuối là họ, phần còn lại là tên)
  const nameParts = user?.fullName?.trim().split(' ') ?? []
  const lastName = nameParts.length > 1 ? nameParts[0] : ''
  const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] ?? ''

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
        <div className='space-y-10'>
          {/* Basic Info */}
          <div className='space-y-5'>
            <Label className='text-[15px] font-bold text-foreground'>Những điều cơ bản</Label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='space-y-2'>
                <Input
                  placeholder='Tên'
                  defaultValue={firstName}
                  className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
              </div>
              <div className='space-y-2'>
                <Input
                  placeholder='Họ'
                  defaultValue={lastName}
                  className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <Input
                  placeholder='Tiêu đề chuyên môn'
                  className='h-11 rounded-md border-input bg-background pr-12 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary'
                />
                <span className='absolute right-4 top-3 text-muted-foreground text-[15px]'>0/60</span>
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
                className='min-h-[140px] rounded-none border-0 resize-y focus-visible:ring-0 p-4'
              />
            </div>
            <p className='text-[13px] text-muted-foreground'>
              Không được phép đăng tải liên kết và mã giảm giá trong phần này.
            </p>
          </div>

          <div className='h-px bg-border'></div>

          {/* Links */}
          <div className='space-y-3'>
            <Label className='text-[15px] font-bold text-foreground'>Liên kết cá nhân</Label>
            <Input 
              placeholder='Trang web (ví dụ: https://portfolio.com)' 
              className='h-11 rounded-md border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary' 
            />
          </div>

          {/* Save button */}
          <div className='pt-6 pb-8 flex'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-8 rounded-md transition-colors'>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
