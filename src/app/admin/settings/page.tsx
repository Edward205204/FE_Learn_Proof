'use client'

import * as React from 'react'
import {
  RefreshCw,
  Globe,
  AlertTriangle,
  ImageIcon,
  Upload,
  Trash2,
  Loader2,
  ExternalLink
} from 'lucide-react'

import { useAdminSettingsQuery, useAdminUpdateSettingMutation } from '@/app/admin/_hooks/use-admin-query'
import { useUploadImageMutation, toMediaUrl } from '@/app/(cms)/_hooks/use-media'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettingsQuery()
  const updateSetting = useAdminUpdateSettingMutation()

  const [localSettings, setLocalSettings] = React.useState<Record<string, unknown>>({})
  const [heroUploading, setHeroUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (settings) {
      const mapped = settings.reduce<Record<string, unknown>>((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
      setLocalSettings(mapped)
    }
  }, [settings])

  const handleToggle = (key: string, val: boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: val }))
    updateSetting.mutate({ key, value: val })
  }

  const handleSave = (key: string) => {
    updateSetting.mutate({ key, value: localSettings[key] })
  }

  // ── Hero Image ──────────────────────────────────────────────────────────
  const currentHeroImage = localSettings['LANDING_HERO_IMAGE'] as string | null | undefined
  const heroDisplayUrl = toMediaUrl(currentHeroImage)

  const { mutate: uploadImage, isPending: isImageUploading } = useUploadImageMutation({
    onUploaded: async (url) => {
      try {
        setHeroUploading(true)
        await updateSetting.mutateAsync({ key: 'LANDING_HERO_IMAGE', value: url })
        setLocalSettings((prev) => ({ ...prev, LANDING_HERO_IMAGE: url }))
        toast.success('Đã cập nhật ảnh trang chủ thành công!')
      } catch {
        toast.error('Không thể lưu cài đặt ảnh.')
      } finally {
        setHeroUploading(false)
      }
    }
  })

  const handleHeroReset = async () => {
    try {
      setHeroUploading(true)
      await updateSetting.mutateAsync({ key: 'LANDING_HERO_IMAGE', value: null })
      setLocalSettings((prev) => ({ ...prev, LANDING_HERO_IMAGE: null }))
      toast.success('Đã khôi phục về Terminal Preview mặc định!')
    } catch {
      toast.error('Không thể xóa cài đặt ảnh.')
    } finally {
      setHeroUploading(false)
    }
  }

  const isHeroPending = isImageUploading || heroUploading

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-64'>
        <RefreshCw className='animate-spin h-8 w-8 text-primary' />
      </div>
    )

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Cài đặt hệ thống</h1>
        <p className='text-muted-foreground'>Cấu hình các tham số vận hành toàn hệ thống LearnProof.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* ── Cấu hình chung ── */}
        <Card className='border-none shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Globe className='h-5 w-5 text-blue-500' />
              <CardTitle>Cấu hình chung</CardTitle>
            </div>
            <CardDescription>Các thiết lập cơ bản của nền tảng.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Bảo trì hệ thống</Label>
                <p className='text-xs text-muted-foreground'>Chặn mọi truy cập của người dùng để bảo trì.</p>
              </div>
              <Switch
                checked={localSettings['MAINTENANCE_MODE'] === true}
                onCheckedChange={(val) => handleToggle('MAINTENANCE_MODE', val)}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Tên ứng dụng hiển thị</Label>
              <div className='flex gap-2'>
                <Input
                  value={(localSettings['APP_NAME'] as string) || 'LearnProof'}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, APP_NAME: e.target.value }))}
                />
                <Button size='sm' onClick={() => handleSave('APP_NAME')}>
                  Lưu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Landing Page Hero Image ── */}
        <Card className='border-none shadow-sm'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <ImageIcon className='h-5 w-5 text-primary' />
              <CardTitle>Ảnh trang chủ (Hero Section)</CardTitle>
            </div>
            <CardDescription>
              Tải lên ảnh để thay thế Terminal Preview bên phải trang chủ. Không có ảnh sẽ dùng giao diện code mặc định.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Preview */}
            <div className='relative w-full h-48 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center'>
              {heroDisplayUrl ? (
                <Image
                  src={heroDisplayUrl}
                  alt='Hero Preview'
                  fill
                  unoptimized
                  className='object-cover'
                />
              ) : (
                <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                  <ImageIcon className='w-10 h-10 opacity-30' />
                  <span className='text-xs font-medium'>Đang dùng Terminal Preview mặc định</span>
                </div>
              )}
              {isHeroPending && (
                <div className='absolute inset-0 bg-background/70 flex items-center justify-center'>
                  <Loader2 className='w-8 h-8 animate-spin text-primary' />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-3'>
              <Button
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                disabled={isHeroPending}
                className='flex items-center gap-2'
              >
                <Upload className='w-4 h-4' />
                {heroDisplayUrl ? 'Đổi ảnh' : 'Tải lên ảnh'}
              </Button>

              {heroDisplayUrl && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleHeroReset}
                  disabled={isHeroPending}
                  className='flex items-center gap-2 text-destructive hover:text-destructive'
                >
                  <Trash2 className='w-4 h-4' />
                  Xóa & dùng mặc định
                </Button>
              )}

              <Link href='/' target='_blank'>
                <Button size='sm' variant='ghost' className='flex items-center gap-2'>
                  <ExternalLink className='w-4 h-4' />
                  Xem trang chủ
                </Button>
              </Link>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              disabled={isHeroPending}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadImage(file)
                e.target.value = ''
              }}
            />
          </CardContent>
        </Card>

        {/* ── Khu vực nguy hiểm ── */}
        <Card className='border-none shadow-sm md:col-span-2 bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900/20'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-500' />
              <CardTitle className='text-red-700 dark:text-red-400'>Khu vực nguy hiểm</CardTitle>
            </div>
            <CardDescription>Các hành động có thể ảnh hưởng nghiêm trọng đến hệ thống.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='space-y-0.5'>
                <p className='font-bold text-sm'>Dọn dẹp Audit Logs cũ</p>
                <p className='text-xs text-muted-foreground'>Xóa tất cả nhật ký hệ thống đã hơn 90 ngày tuổi.</p>
              </div>
              <Button variant='destructive' size='sm'>
                Thực thi ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
