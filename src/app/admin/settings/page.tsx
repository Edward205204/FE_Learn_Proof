'use client'

import * as React from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Lock,
  Wrench,
  AlertTriangle
} from 'lucide-react'

import { useAdminSettingsQuery, useAdminUpdateSettingMutation } from '@/app/admin/_hooks/use-admin-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function AdminSettingsPage() {
  const { data: settings, isLoading, refetch } = useAdminSettingsQuery()
  const updateSetting = useAdminUpdateSettingMutation()

  const [localSettings, setLocalSettings] = React.useState<Record<string, unknown>>({})

  React.useEffect(() => {
    if (settings) {
      const mapped = settings.reduce<Record<string, unknown>>((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
      setLocalSettings(mapped)
    }
  }, [settings])

  const handleToggle = (key: string, val: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }))
    updateSetting.mutate({ key, value: val })
  }

  const handleSave = (key: string) => {
    updateSetting.mutate({ key, value: localSettings[key] })
  }

  if (isLoading) return <div className='flex items-center justify-center h-64'><RefreshCw className='animate-spin h-8 w-8 text-primary' /></div>

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Cài đặt hệ thống</h1>
        <p className='text-muted-foreground'>Cấu hình các tham số vận hành toàn hệ thống LearnProof.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
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
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, APP_NAME: e.target.value }))}
                />
                <Button size='sm' onClick={() => handleSave('APP_NAME')}>Lưu</Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Button variant='destructive' size='sm'>Thực thi ngay</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
