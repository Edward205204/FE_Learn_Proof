'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetMeQuery } from '@/app/(auth)/_hooks/use-auth-mutation'
import { useAuthStore } from '@/store/auth.store'
import { Pencil, CloudUpload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const navItems = [
  { label: 'Xem hồ sơ công khai', href: '/public-profile' },
  { label: 'Hồ sơ', href: '/profile' },
  { label: 'Bảo mật tài khoản', href: '/profile/security' },
  { label: 'Sự riêng tư', href: '/profile/privacy' }
]

export function Sidebar() {
  const pathname = usePathname()
  const storeUser = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const { data: user } = useGetMeQuery()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [optimisticAvatar, setOptimisticAvatar] = useState<string | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [inputKey, setInputKey] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const displayUser = user ?? storeUser
  // Sử dụng avatar mới cập nhật nếu có, nếu không thì dùng avatar từ db
  const finalAvatar = optimisticAvatar ?? displayUser?.avatar
  const initials = displayUser?.fullName
    ? displayUser.fullName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <div className='flex flex-col'>
      {/* Avatar Section */}
      <div className='flex flex-col items-center mb-10'>
        <Dialog
          open={isAvatarModalOpen}
          onOpenChange={(open) => {
            setIsAvatarModalOpen(open)
            if (!open) {
              setTimeout(() => {
                setAvatarPreview(null)
                setInputKey((k) => k + 1)
              }, 300)
            }
          }}
        >
          <DialogTrigger asChild>
            <div className='relative w-28 h-28 mb-4 rounded-full cursor-pointer group flex-shrink-0'>
              <Avatar className='w-full h-full text-4xl font-bold bg-primary/10 text-primary border-4 border-background shadow-sm'>
                {finalAvatar && (
                  <AvatarImage src={finalAvatar} alt={displayUser?.fullName ?? 'Avatar'} className='object-cover' />
                )}
                <AvatarFallback className='bg-primary/10 text-primary select-none'>{initials}</AvatarFallback>
              </Avatar>
              <div className='absolute inset-0 rounded-full bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center duration-300'>
                <Pencil size={24} className='text-white drop-shadow-md' strokeWidth={2.5} />
              </div>
            </div>
          </DialogTrigger>

          <DialogContent
            className='sm:max-w-md p-0 overflow-hidden rounded-[24px] border border-border shadow-lg bg-background'
            aria-describedby={undefined}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              handleDrop(e)
              setInputKey((k) => k + 1) // attempt to destroy input to close OS File Dialog
            }}
          >
            <DialogHeader className='p-6 pb-2 border-none'>
              <DialogTitle className='text-2xl font-bold text-center text-foreground tracking-tight'>
                Cập nhật ảnh đại diện
              </DialogTitle>
            </DialogHeader>
            <div className='flex flex-col items-center justify-center p-6 pt-0 gap-6'>
              {/* Upload area */}
              {!avatarPreview ? (
                <div
                  className={`w-full border-2 border-dashed border-border ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'hover:border-primary/50 bg-muted/20 hover:bg-muted/50'} transition-all duration-300 rounded-3xl p-12 flex flex-col items-center justify-center gap-5 cursor-pointer text-center group/upload relative min-h-[260px]`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className='w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center shadow-sm group-hover/upload:scale-110 transition-transform duration-500'>
                    <CloudUpload size={36} className='text-primary' strokeWidth={2} />
                  </div>
                  <div className='space-y-1.5 px-4'>
                    <p className='font-bold text-[16px] text-foreground leading-snug'>
                      Nhấn hoặc kéo thả để tải ảnh lên
                    </p>
                    <p className='text-[14px] text-muted-foreground font-medium'>
                      Định dạng JPG, JPEG hoặc PNG. Tối đa 5MB.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[260px] justify-center p-4 rounded-3xl border-2 border-dashed border-transparent transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : ''}`}
                >
                  <div className='relative w-44 h-44 rounded-full overflow-hidden border-4 border-background shadow-md ring-4 ring-primary/10 pointer-events-none'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarPreview} alt='Preview' className='w-full h-full object-cover' />
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                    className='rounded-xl font-bold h-11 px-6 border-border shadow-sm text-foreground hover:bg-muted transition-all w-fit'
                  >
                    Chọn ảnh khác
                  </Button>
                </div>
              )}

              <input
                key={inputKey}
                type='file'
                accept='image/jpeg, image/png, image/jpg'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {avatarPreview && (
                <Button
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl text-[16px] shadow-sm transition-all active:scale-[0.98]'
                  onClick={() => {
                    if (avatarPreview) {
                      setOptimisticAvatar(avatarPreview)
                      updateUser({ avatar: avatarPreview })
                    }
                    // Thực tế sẽ gọi API upload lên S3 hay backend ở đây
                    setIsAvatarModalOpen(false)
                  }}
                >
                  Lưu ảnh
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <h2 className='text-lg font-bold text-foreground text-center'>{displayUser?.fullName ?? '...'}</h2>
      </div>

      {/* Navigation Links */}
      <nav className='w-full flex flex-col gap-1.5'>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 text-[15px] font-medium transition-all rounded-md flex items-center ${
                isActive
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
