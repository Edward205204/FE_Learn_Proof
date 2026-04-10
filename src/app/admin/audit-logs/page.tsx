'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { History, Search, Filter, AlertCircle, Info } from 'lucide-react'
import { useAdminAuditLogs } from '../_hooks/use-admin-audit-logs'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import Pagination from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function AdminAuditLogsPage() {
  const [params, setParams] = useState({
    page: 1,
    limit: 15,
    action: 'ALL',
    entity: 'ALL'
  })

  const { data, isLoading } = useAdminAuditLogs({
    ...params,
    action: params.action === 'ALL' ? undefined : params.action,
    entity: params.entity === 'ALL' ? undefined : params.entity
  })

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }))
  }

  const getActionBadge = (action: string) => {
    if (action.includes('BAN')) return <Badge variant='destructive'>{action}</Badge>
    if (action.includes('UPDATE'))
      return (
        <Badge variant='secondary' className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
          {action}
        </Badge>
      )
    if (action.includes('DELETE')) return <Badge variant='destructive'>{action}</Badge>
    return <Badge variant='outline'>{action}</Badge>
  }

  return (
    <div className='space-y-6 pb-10'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <History className='h-6 w-6 text-primary' />
          <h1 className='text-3xl font-bold tracking-tight'>Nhật ký hoạt động</h1>
        </div>
        <p className='text-muted-foreground'>Theo dõi lịch sử các thao tác của quản trị viên trên hệ thống.</p>
      </div>

      <Card className='border-none shadow-sm'>
        <CardHeader>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-muted-foreground' />
                <Select
                  value={params.entity}
                  onValueChange={(v) => setParams((prev) => ({ ...prev, entity: v, page: 1 }))}
                >
                  <SelectTrigger className='w-[160px]'>
                    <SelectValue placeholder='Đối tượng' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL'>Tất cả đối tượng</SelectItem>
                    <SelectItem value='USER'>Người dùng (USER)</SelectItem>
                    <SelectItem value='COURSE'>Khóa học (COURSE)</SelectItem>
                    <SelectItem value='SYSTEM_SETTING'>Cấu hình (SETTING)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={params.action}
                onValueChange={(v) => setParams((prev) => ({ ...prev, action: v, page: 1 }))}
              >
                <SelectTrigger className='w-[160px]'>
                  <SelectValue placeholder='Hành động' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>Tất cả hành động</SelectItem>
                  <SelectItem value='UPDATE_ROLE'>Đổi Role</SelectItem>
                  <SelectItem value='BAN_USER'>Khóa User</SelectItem>
                  <SelectItem value='UPDATE_COURSE_STATUS'>Duyệt Khóa học</SelectItem>
                  <SelectItem value='UPDATE_SYSTEM_SETTING'>Sửa Cấu hình</SelectItem>
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
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Quản trị viên</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>ID Đối tượng</TableHead>
                  <TableHead className='text-right'>Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className='h-4 w-32' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-40' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-6 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-20' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-8 w-8 ml-auto' />
                        </TableCell>
                      </TableRow>
                    ))
                  : data?.items.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className='text-sm text-muted-foreground'>
                          {format(new Date(log.createdAt), 'HH:mm:ss dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium'>{log.admin.fullName}</span>
                            <span className='text-xs text-muted-foreground'>{log.admin.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <Badge variant='outline'>{log.entity}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className='text-xs bg-muted px-1.5 py-0.5 rounded'>{log.entityId}</code>
                        </TableCell>
                        <TableCell className='text-right'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant='ghost' size='icon'>
                                  <Info className='h-4 w-4 text-muted-foreground' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side='left' className='max-w-xs'>
                                <pre className='text-[10px] whitespace-pre-wrap'>
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
              <p className='text-muted-foreground'>Chưa có hoạt động nào được ghi lại.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
