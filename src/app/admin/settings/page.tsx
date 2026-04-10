'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Settings, UserPlus, ShieldAlert, Mail, Globe, Save } from 'lucide-react'
import { useAdminSettings, useUpdateSettingMutation } from '../_hooks/use-admin-settings'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettings()
  const updateMutation = useUpdateSettingMutation()

  const getSettingValue = <T,>(key: string, defaultValue: T): T => {
    const setting = settings?.find((s) => s.key === key)
    return setting ? (setting.value as T) : defaultValue
  }

  const handleToggle = (key: string, currentValue: boolean) => {
    updateMutation.mutate({ key, value: !currentValue })
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-40 w-full' />
          ))}
        </div>
      </div>
    )
  }

  const allowRegistration = getSettingValue('ALLOW_REGISTRATION', true)
  const maintenanceMode = getSettingValue('MAINTENANCE_MODE', false)
  const emailVerificationRequired = getSettingValue('EMAIL_VERIFICATION_REQUIRED', true)
  const siteName = getSettingValue('SITE_NAME', 'Learn Proof')

  return (
    <div className='space-y-6 pb-10'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Settings className='h-6 w-6 text-primary' />
          <h1 className='text-3xl font-bold tracking-tight'>Cấu hình hệ thống</h1>
        </div>
        <p className='text-muted-foreground'>Quản lý các thiết lập toàn cầu cho ứng dụng Learn Proof.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Registration Settings */}
        <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden group'>
          <div className='h-1 w-full bg-blue-500' />
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <UserPlus className='h-5 w-5 text-blue-500' />
              Đăng ký & Người dùng
            </CardTitle>
            <CardDescription>Cấu hình luồng đăng ký tài khoản mới.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='text-base'>Cho phép đăng ký mới</Label>
                <p className='text-sm text-muted-foreground'>Nếu tắt, người dùng mới sẽ không thể tạo tài khoản.</p>
              </div>
              <Switch
                checked={allowRegistration}
                onCheckedChange={() => handleToggle('ALLOW_REGISTRATION', allowRegistration)}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='text-base'>Bắt buộc xác thực Email</Label>
                <p className='text-sm text-muted-foreground'>
                  Người dùng phải xác thực OTP trước khi có thể đăng nhập.
                </p>
              </div>
              <Switch
                checked={emailVerificationRequired}
                onCheckedChange={() => handleToggle('EMAIL_VERIFICATION_REQUIRED', emailVerificationRequired)}
                disabled={updateMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Operations */}
        <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden'>
          <div className='h-1 w-full bg-red-500' />
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <ShieldAlert className='h-5 w-5 text-red-500' />
              Vận hành hệ thống
            </CardTitle>
            <CardDescription>Các thiết lập quan trọng về trạng thái website.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label className='text-base'>Chế độ bảo trì</Label>
                <p className='text-sm text-muted-foreground'>Chỉ có quản trị viên mới có thể truy cập hệ thống.</p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={() => handleToggle('MAINTENANCE_MODE', maintenanceMode)}
                disabled={updateMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Brand & Identity */}
        <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden'>
          <div className='h-1 w-full bg-primary' />
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Globe className='h-5 w-5 text-primary' />
              Thương hiệu & Identity
            </CardTitle>
            <CardDescription>Cấu hình thông tin cơ bản hiển thị trên website.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 text-center'>
              <Save className='h-8 w-8 text-muted-foreground/50' />
              <p className='text-sm text-muted-foreground'>Chức năng chỉnh sửa text/logo đang được phát triển...</p>
              <p className='text-xs font-bold text-primary'>{siteName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Email Service */}
        <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden'>
          <div className='h-1 w-full bg-purple-500' />
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Mail className='h-5 w-5 text-purple-500' />
              Dịch vụ Email
            </CardTitle>
            <CardDescription>Trạng thái kết nối với cổng gửi mail (Resend/Nodemailer).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-3 p-3 rounded-md bg-green-500/10 border border-green-500/20'>
              <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
              <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                Đang hoạt động (Connected via Environment)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
