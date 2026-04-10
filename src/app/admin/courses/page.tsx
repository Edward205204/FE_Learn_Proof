'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  Filter,
  BookOpen,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Archive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAdminCourses, useUpdateCourseBanMutation, useUpdateCourseStatusMutation } from '../_hooks/use-admin-courses'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import Pagination from '@/components/common/pagination'

export default function AdminCoursesPage() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: 'ALL',
    isBanned: 'ALL'
  })

  const { data, isLoading } = useAdminCourses({
    ...params,
    status: params.status === 'ALL' ? undefined : params.status,
    isBanned: params.isBanned === 'ALL' ? undefined : params.isBanned
  })

  const statusMutation = useUpdateCourseStatusMutation()
  const banMutation = useUpdateCourseBanMutation()

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className='bg-green-500 hover:bg-green-600'>Đang bán</Badge>
      case 'DRAFT':
        return <Badge variant='secondary'>Bản nháp</Badge>
      case 'ARCHIVED':
        return <Badge variant='outline'>Đã lưu trữ</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className='space-y-6 pb-10'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-6 w-6 text-primary' />
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý khóa học</h1>
        </div>
        <p className='text-muted-foreground'>Theo dõi và kiểm soát nội dung các khóa học trên hệ thống.</p>
      </div>

      <Card className='border-none shadow-sm'>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Tìm tên khóa học, slug...'
                className='pl-9'
                value={params.search}
                onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>

            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <Select
                  value={params.status}
                  onValueChange={(v) => setParams((prev) => ({ ...prev, status: v, page: 1 }))}
                >
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder='Trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL'>Tất cả trạng thái</SelectItem>
                    <SelectItem value='PUBLISHED'>Đang bán</SelectItem>
                    <SelectItem value='DRAFT'>Bản nháp</SelectItem>
                    <SelectItem value='ARCHIVED'>Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={params.isBanned}
                onValueChange={(v) => setParams((prev) => ({ ...prev, isBanned: v, page: 1 }))}
              >
                <SelectTrigger className='w-[140px]'>
                  <SelectValue placeholder='Bị khóa' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>Tất cả</SelectItem>
                  <SelectItem value='false'>Hoạt động</SelectItem>
                  <SelectItem value='true'>Đang khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[300px]'>Khóa học</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className='h-12 w-full' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-6 w-20' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-12' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-8 w-8 ml-auto' />
                        </TableCell>
                      </TableRow>
                    ))
                  : data?.items.map((course) => (
                      <TableRow key={course.id} className={course.isBanned ? 'bg-red-50/50 dark:bg-red-950/20' : ''}>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div className='h-10 w-16 bg-muted rounded overflow-hidden flex-shrink-0'>
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt='' className='h-full w-full object-cover' />
                              ) : (
                                <div className='h-full w-full flex items-center justify-center'>
                                  <BookOpen className='h-4 w-4 text-muted-foreground' />
                                </div>
                              )}
                            </div>
                            <div className='flex flex-col min-w-0'>
                              <span className='font-medium truncate'>{course.title}</span>
                              <span className='text-xs text-muted-foreground truncate'>{course.slug}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='text-sm'>{course.creator.fullName}</span>
                            <span className='text-xs text-muted-foreground'>{course.creator.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {getStatusBadge(course.status)}
                            {course.isBanned && (
                              <Badge variant='destructive' className='flex items-center gap-1'>
                                <ShieldAlert className='h-3 w-3' />
                                VI PHẠM
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className='font-mono'>{course._count.enrollments}</span>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {format(new Date(course.createdAt), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48'>
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                                <Eye className='h-4 w-4 mr-2' /> Xem trang khóa học
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              <DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
                                Thay đổi trạng thái
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                disabled={statusMutation.isPending || course.status === 'PUBLISHED'}
                                onClick={() => statusMutation.mutate({ id: course.id, status: 'PUBLISHED' })}
                              >
                                <CheckCircle2 className='h-4 w-4 mr-2 text-green-500' /> Công khai
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={statusMutation.isPending || course.status === 'ARCHIVED'}
                                onClick={() => statusMutation.mutate({ id: course.id, status: 'ARCHIVED' })}
                              >
                                <Archive className='h-4 w-4 mr-2 text-yellow-500' /> Lưu trữ
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              {course.isBanned ? (
                                <DropdownMenuItem
                                  className='text-green-600'
                                  onClick={() => banMutation.mutate({ id: course.id, isBanned: false })}
                                >
                                  <ShieldCheck className='h-4 w-4 mr-2' /> Gỡ khóa nội dung
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className='text-red-600'
                                  onClick={() => banMutation.mutate({ id: course.id, isBanned: true })}
                                >
                                  <ShieldAlert className='h-4 w-4 mr-2' /> Khóa do vi phạm
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {!isLoading && data && data.meta.totalPages > 1 && (
            <div className='mt-6'>
              <Pagination currentPage={params.page} totalPages={data.meta.totalPages} onPageChange={handlePageChange} />
            </div>
          )}

          {!isLoading && data?.items.length === 0 && (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <AlertCircle className='h-12 w-12 text-muted-foreground/20 mb-4' />
              <p className='text-muted-foreground'>Không tìm thấy khóa học nào phù hợp.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
