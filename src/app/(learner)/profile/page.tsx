'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Upload, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useGetMeQuery } from '@/app/(auth)/_hooks/use-auth-mutation'

export default function ProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: user, isLoading } = useGetMeQuery()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  // Tách fullName thành firstName / lastName (word cuối là họ, phần còn lại là tên)
  const nameParts = user?.fullName?.trim().split(' ') ?? []
  const lastName = nameParts.length > 1 ? nameParts[0] : ''
  const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] ?? ''

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  const displayAvatar = avatarPreview ?? user?.avatar ?? null

  return (
    <div className='flex flex-col w-full'>
      {/* Header section */}
      <div className='py-6 border-b border-border text-center'>
        <h1 className='text-2xl font-bold text-foreground mb-2'>Hồ sơ công khai</h1>
        <p className='text-[15px] text-muted-foreground'>Thêm thông tin về bản thân bạn</p>
      </div>

      {/* Form section */}
      {isLoading ? (
        <div className='p-8 max-w-2xl mx-auto w-full flex items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <div className='p-8 max-w-2xl mx-auto w-full'>
          {/* Avatar/Photo upload */}
          <div className='mb-8 p-6 border border-border rounded-md shadow-sm bg-muted/20 flex flex-col md:flex-row items-center gap-8'>
            <Avatar className='w-32 h-32 border border-border shadow-sm bg-primary text-primary-foreground text-4xl font-bold'>
              {displayAvatar && (
                <AvatarImage src={displayAvatar} alt={user?.fullName ?? 'Avatar'} className='object-cover' />
              )}
              <AvatarFallback className='bg-primary text-primary-foreground'>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex-1 text-center md:text-left space-y-2'>
              <h3 className='text-[15px] font-bold text-foreground'>Ảnh đại diện</h3>
              <p className='text-[13px] text-muted-foreground'>
                Thêm một bức ảnh rõ nét của bạn để mọi người có thể dễ dàng nhận diện. Nên sử dụng
                chuẩn định dạng JPG, JPEG hoặc PNG.
              </p>
              <div className='flex justify-center md:justify-start gap-4 pt-2'>
                <input
                  type='file'
                  accept='image/jpeg, image/png, image/jpg'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className='bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm h-10 px-6 font-bold flex items-center gap-2'
                >
                  <Upload size={16} />
                  Tải ảnh lên
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className='mb-6 space-y-4'>
            <Label className='text-[15px] font-bold text-foreground'>Những điều cơ bản:</Label>
            <Input
              placeholder='Tên'
              defaultValue={firstName}
              className='h-[46px] rounded-sm border-input'
            />
            <Input
              placeholder='Họ'
              defaultValue={lastName}
              className='h-[46px] rounded-sm border-input'
            />

            <div className='relative'>
              <Input
                placeholder='Tiêu đề'
                className='h-[46px] rounded-sm border-input pr-12'
              />
              <span className='absolute right-3 top-3 text-muted-foreground text-[15px]'>60</span>
            </div>
            <p className='text-[13px] text-muted-foreground mt-1'>
              Hãy thêm tiêu đề chuyên nghiệp như &quot;Giảng viên tại Udemy&quot; hoặc
              &quot;Kiến trúc sư&quot;.
            </p>
          </div>

          {/* Email (read-only) */}
          <div className='mb-6 space-y-2'>
            <Label className='text-[15px] font-bold text-foreground'>Email</Label>
            <Input
              value={user?.email ?? ''}
              readOnly
              className='h-[46px] rounded-sm border-input bg-muted/50 cursor-not-allowed'
            />
            <p className='text-[13px] text-muted-foreground'>Email không thể thay đổi.</p>
          </div>

          {/* Bio */}
          <div className='mb-6 space-y-2'>
            <Label className='text-[15px] font-bold text-foreground'>Tiểu sử</Label>
            <div className='border border-input rounded-sm overflow-hidden flex flex-col focus-within:ring-1 focus-within:ring-ring'>
              <div className='flex items-center gap-2 p-2 border-b border-input bg-muted/20'>
                <button type='button' className='p-1 hover:bg-muted text-foreground rounded transition-colors'>
                  <Bold size={16} />
                </button>
                <button type='button' className='p-1 hover:bg-muted text-foreground rounded transition-colors'>
                  <Italic size={16} />
                </button>
              </div>
              <Textarea
                placeholder='Tiểu sử'
                className='min-h-[120px] rounded-none border-0 resize-y focus-visible:ring-0'
              />
            </div>
            <p className='text-[13px] text-muted-foreground mt-1'>
              Không được phép đăng tải liên kết và mã giảm giá trong phần này.
            </p>
          </div>

          {/* Separator line */}
          <div className='h-px bg-border my-6'></div>

          {/* Links */}
          <div className='mb-6 space-y-2'>
            <Label className='text-[15px] font-bold text-foreground'>Liên kết:</Label>
            <Input placeholder='Trang web (http(s)://..)' className='h-[46px] rounded-sm border-input' />
          </div>

          {/* Save button */}
          <div className='mt-8 flex justify-end'>
            <button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 rounded-sm transition-transform'>
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
