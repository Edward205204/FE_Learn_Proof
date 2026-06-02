'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { toMediaUrl, useUploadImageMutation } from '@/app/(cms)/_hooks/use-media'
import { useAdminUpdateSettingMutation } from '@/app/admin/_hooks/use-admin-query'
import { toast } from 'sonner'

interface HeroPreviewProps {
  isAdmin: boolean
  initialHeroImage: string | null | undefined
}

export default function HeroPreview({ isAdmin, initialHeroImage }: HeroPreviewProps) {
  const [heroImage, setHeroImage] = useState<string | null>(initialHeroImage || null)
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const updateSettingMutation = useAdminUpdateSettingMutation()

  const { mutate: uploadImage, isPending: isUploading } = useUploadImageMutation({
    onUploaded: async (url) => {
      try {
        setIsUpdating(true)
        // Cập nhật cấu hình hệ thống
        await updateSettingMutation.mutateAsync({
          key: 'LANDING_HERO_IMAGE',
          value: url,
        })
        setHeroImage(url)
        toast.success('Đã lưu ảnh làm giao diện trang chủ!')
        router.refresh()
      } catch (err) {
        toast.error('Lưu cài đặt thất bại.')
        console.error(err)
      } finally {
        setIsUpdating(false)
      }
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const triggerFileInput = (e: React.MouseEvent) => {
    // Tránh click lan sang nút xóa
    if ((e.target as HTMLElement).closest('.btn-delete')) return
    fileInputRef.current?.click()
  }

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setIsUpdating(true)
      await updateSettingMutation.mutateAsync({
        key: 'LANDING_HERO_IMAGE',
        value: null,
      })
      setHeroImage(null)
      toast.success('Đã khôi phục giao diện mặc định!')
      router.refresh()
    } catch (err) {
      toast.error('Lưu cài đặt thất bại.')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const displayUrl = toMediaUrl(heroImage)
  const isLoading = isUploading || isUpdating

  return (
    <div className="relative lg:block hidden group w-full h-[550px]">
      {/* Background glow matching the hero design */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
      
      {/* Main container */}
      <div className="relative h-full w-full bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
        {displayUrl ? (
          // Custom Uploaded Image View
          <div className="relative w-full h-full">
            <Image
              src={displayUrl}
              alt="Custom Hero Preview"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          // Default Terminal Preview Code Mockup
          <div className="w-full h-full font-mono text-sm flex flex-col">
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                learnproof-main.tsx
              </span>
            </div>
            <div className="p-8 flex-1 space-y-2 select-none">
              <p className="text-blue-400">
                import <span className="text-foreground">LearnProof</span> from{' '}
                <span className="text-emerald-400">&apos;@/career-path&apos;</span>;
              </p>
              <p className="text-muted-foreground italic mt-4">{'// Setup your dream career'}</p>
              <p className="text-primary">
                const <span className="text-foreground">myFuture</span> = () =&gt; &#123;
              </p>
              <p className="pl-6 text-foreground">
                return LearnProof.start(&#123;
              </p>
              <p className="pl-12 text-foreground">
                skills: [<span className="text-emerald-400">&apos;Fullstack&apos;</span>,{' '}
                <span className="text-emerald-400">&apos;DevOps&apos;</span>],
              </p>
              <p className="pl-12 text-foreground">
                mentorship: <span className="text-amber-400">true</span>,
              </p>
              <p className="pl-12 text-foreground">
                jobReady: <span className="text-amber-400">true</span>
              </p>
              <p className="pl-6 text-foreground">&#125;);</p>
              <p className="text-primary">&#125;;</p>
              <div className="mt-8 pt-8 border-t border-border flex items-center gap-4 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <span className="text-emerald-500 text-xs font-bold">
                  Compiling Success: Future.exe is ready!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Admin hover controls (WordPress Mode) */}
        {isAdmin && (
          <div
            onClick={isLoading ? undefined : triggerFileInput}
            className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer z-20 rounded-[2.5rem] ${
              isLoading ? 'opacity-100 pointer-events-none' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <span className="text-white font-bold text-sm">Đang tải lên và xử lý...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center text-primary transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white">
                  <Upload className="w-8 h-8" />
                </div>
                <span className="text-white font-black text-sm tracking-wide bg-primary/80 backdrop-blur-sm px-5 py-2 rounded-full border border-primary/20 hover:bg-primary transition-colors">
                  Thay đổi ảnh nền (WordPress Mode)
                </span>
                
                {heroImage && (
                  <button
                    onClick={handleReset}
                    className="btn-delete mt-4 text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 rounded-xl border border-rose-500/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" />
                      Gỡ bỏ & Dùng mặc định
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      {isAdmin && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
      )}
    </div>
  )
}
