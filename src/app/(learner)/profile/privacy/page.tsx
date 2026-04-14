'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function PrivacyPage() {
  return (
    <div className='flex flex-col w-full'>
      {/* Header section */}
      <div className='pb-8 mb-8 border-b border-border'>
        <h1 className='text-3xl font-bold text-foreground tracking-tight mb-2'>Sự riêng tư</h1>
        <p className='text-[15px] text-muted-foreground'>
          Bạn có thể thay đổi cài đặt quyền riêng tư của mình tại đây.
        </p>
      </div>

      {/* Main Form section */}
      <div className='max-w-xl'>
        <div className='space-y-8'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold text-foreground'>Cài đặt trang hồ sơ</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Quản lý những gì người khác có thể thấy trên hồ sơ công khai của bạn.
            </p>
          </div>

          {/* Checkboxes */}
          <div className='space-y-5'>
            <div className='flex items-start space-x-4'>
              <Checkbox
                id='show-profile'
                defaultChecked
                className='w-5 h-5 mt-0.5 rounded-sm border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary'
              />
              <div className='space-y-1'>
                <Label
                  htmlFor='show-profile'
                  className='text-[15px] font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Hiển thị hồ sơ công khai
                </Label>
                <p className='text-sm text-muted-foreground'>Hiển thị hồ sơ của bạn cho người dùng đã đăng nhập.</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <Checkbox
                id='show-courses'
                defaultChecked
                className='w-5 h-5 mt-0.5 rounded-sm border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary'
              />
              <div className='space-y-1'>
                <Label
                  htmlFor='show-courses'
                  className='text-[15px] font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Hiển thị các khóa học
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Hiển thị các khóa học bạn đang tham gia trên trang cá nhân của bạn.
                </p>
              </div>
            </div>
          </div>

          <div className='pt-6'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-8 rounded-md transition-colors'>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
