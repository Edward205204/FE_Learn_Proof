'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ManagerFilterStatus } from '../_utils/zod'

const STATUS_OPTIONS: { value: ManagerFilterStatus; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'ARCHIVED', label: 'Đã lưu trữ' }
]

interface CourseManagerFilterProps {
  status: ManagerFilterStatus
  onStatusChange: (status: ManagerFilterStatus) => void
}

export default function CourseManagerFilter({ status, onStatusChange }: CourseManagerFilterProps) {
  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm text-muted-foreground whitespace-nowrap'>Trạng thái:</span>
      <Select value={status} onValueChange={(val) => onStatusChange(val as ManagerFilterStatus)}>
        <SelectTrigger className='w-[160px]' size='sm'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
