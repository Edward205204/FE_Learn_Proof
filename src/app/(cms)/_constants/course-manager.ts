import type { CourseLevel, CourseStatus } from '../_utils/zod'

export const LEVEL_LABEL: Record<CourseLevel, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao'
}

export const LEVEL_CLASS: Record<CourseLevel, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  INTERMEDIATE: 'bg-blue-100 text-blue-700 border-blue-200',
  ADVANCED: 'bg-purple-100 text-purple-700 border-purple-200'
}

export const STATUS_LABEL: Record<CourseStatus, string> = {
  DRAFT: 'Bản nháp',
  PUBLISHED: 'Đã xuất bản',
  ARCHIVED: 'Đã lưu trữ'
}

export const STATUS_VARIANT: Record<CourseStatus, 'secondary' | 'default' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline'
}

export function formatPrice(price: number, isFree: boolean) {
  if (isFree || price === 0) return 'Miễn phí'
  return price.toLocaleString('vi-VN') + 'đ'
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

