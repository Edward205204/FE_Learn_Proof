'use client'

import * as React from 'react'
import { 
  BookOpen, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  Ban, 
  Eye,
  RefreshCw,
  Trophy,
  Users
} from 'lucide-react'

import { useAdminCoursesQuery, useAdminUpdateCourseStatusMutation } from '@/app/admin/_hooks/use-admin-query'
import { AdminCourseStatus } from '@/app/admin/_utils/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminCoursesPage() {
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<AdminCourseStatus | undefined>(undefined)
  const [page, setPage] = React.useState(1)

  const { data, isLoading, refetch } = useAdminCoursesQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: status as AdminCourseStatus | undefined
  })

  const updateCourseStatus = useAdminUpdateCourseStatusMutation()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStatusChange = (val: string) => {
    setStatus(val === 'ALL' ? undefined : (val as AdminCourseStatus))
    setPage(1)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý khóa học</h1>
          <p className='text-muted-foreground'>Theo dõi chất lượng, trạng thái phê duyệt và xử lý các khóa học vi phạm.</p>
        </div>
        <Button onClick={() => refetch()} variant='outline' size='icon' className='shrink-0 rounded-full'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input 
            placeholder='Tìm kiếm theo tên khóa học...' 
            className='pl-10'
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Select onValueChange={handleStatusChange} value={status || 'ALL'}>
          <SelectTrigger className='w-full sm:w-[200px]'>
            <SelectValue placeholder='Lọc theo trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
            <SelectItem value='DRAFT'>Bản nháp (Draft)</SelectItem>
            <SelectItem value='PUBLISHED'>Đang bán (Published)</SelectItem>
            <SelectItem value='ARCHIVED'>Đã lưu trữ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-muted-foreground uppercase bg-muted/50 border-b'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Khóa học</th>
                <th className='px-6 py-4 font-semibold'>Người tạo</th>
                <th className='px-6 py-4 font-semibold'>Chi tiết</th>
                <th className='px-6 py-4 font-semibold'>Trạng thái</th>
                <th className='px-6 py-4 font-semibold'>Ngày tạo</th>
                <th className='px-6 py-4 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td colSpan={6} className='px-6 py-8 text-center text-muted-foreground'>Đang tải dữ liệu...</td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>Không tìm thấy khóa học nào.</td>
                </tr>
              ) : (
                data?.items.map((course) => (
                  <tr key={course.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='px-6 py-4 font-medium'>
                      <div className='flex items-center gap-3'>
                        <div className='h-12 w-20 rounded-lg overflow-hidden border bg-muted shrink-0'>
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className='h-full w-full object-cover' />
                          ) : (
                            <div className='h-full w-full flex items-center justify-center text-muted-foreground/30'>
                              <BookOpen size={20} />
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col min-w-0'>
                          <span className='font-bold text-foreground truncate max-w-[200px]'>{course.title}</span>
                          <span className='text-[10px] text-primary font-medium tracking-wide'>{course.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='font-medium text-xs'>{course.creator.fullName}</span>
                        <span className='text-xs text-muted-foreground'>{course.creator.email}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3 text-muted-foreground'>
                        <div className='flex items-center gap-1 shrink-0' title='Số học viên'>
                          <Users size={12} />
                          <span className='text-xs'>{course._count.enrollments}</span>
                        </div>
                        <div className='flex items-center gap-1 shrink-0' title='Số chương học'>
                          <Trophy size={12} />
                          <span className='text-xs'>{course._count.chapters}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col gap-1'>
                        {course.status === 'PUBLISHED' ? (
                          <Badge variant='secondary' className='w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none'>ĐANG BÁN</Badge>
                        ) : course.status === 'ARCHIVED' ? (
                          <Badge variant='secondary' className='w-fit bg-slate-100 text-slate-600 hover:bg-slate-100 border-none'>GỠ XUỐNG</Badge>
                        ) : (
                          <Badge variant='secondary' className='w-fit bg-amber-100 text-amber-700 hover:bg-amber-100 border-none'>ĐỢI DUYỆT</Badge>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-muted-foreground whitespace-nowrap text-xs'>
                      {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon' className='rounded-full'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48'>
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                            <Eye className='mr-2 h-4 w-4' />
                            Xem ở trang chủ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className='text-[10px] uppercase text-muted-foreground text-center'>Cập nhật trạng thái</DropdownMenuLabel>
                          {course.status !== 'PUBLISHED' && (
                            <DropdownMenuItem onClick={() => updateCourseStatus.mutate({ id: course.id, status: 'PUBLISHED' })}>
                              <CheckCircle className='mr-2 h-4 w-4 text-emerald-500' />
                              Phê duyệt (Publish)
                            </DropdownMenuItem>
                          )}
                          {course.status !== 'ARCHIVED' && (
                            <DropdownMenuItem onClick={() => updateCourseStatus.mutate({ id: course.id, status: 'ARCHIVED' })}>
                              <Ban className='mr-2 h-4 w-4 text-slate-400' />
                              Gỡ xuống (Archive)
                            </DropdownMenuItem>
                          )}
                          {course.status === 'ARCHIVED' && (
                            <DropdownMenuItem onClick={() => updateCourseStatus.mutate({ id: course.id, status: 'PUBLISHED' })}>
                              <RefreshCw className='mr-2 h-4 w-4 text-blue-500' />
                              Mở lại khóa học
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {data && data.meta.totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-4 bg-muted/20 border-t'>
            <div className='text-xs text-muted-foreground'>
              Hiển thị trang {data.meta.page} / {data.meta.totalPages} ({data.meta.total} khóa học)
            </div>
            <div className='flex gap-2'>
              <Button 
                variant='outline' 
                size='sm' 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Trước
              </Button>
              <Button 
                variant='outline' 
                size='sm' 
                disabled={page === data.meta.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
