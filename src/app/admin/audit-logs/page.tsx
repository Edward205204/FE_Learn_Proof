'use client'

import * as React from 'react'
import { History, Search, RefreshCw, Info, Calendar, Shield, Activity } from 'lucide-react'

import { useAdminAuditLogsQuery } from '@/app/admin/_hooks/use-admin-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1)
  const { data, isLoading, refetch } = useAdminAuditLogsQuery({ page, limit: 15 })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Audit Logs</h1>
          <p className='text-muted-foreground'>
            Nhật ký ghi lại mọi hành động nhạy cảm của các quản trị viên trên hệ thống.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline' size='icon' className='rounded-full'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-muted-foreground uppercase bg-muted/50 border-b'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Thời gian</th>
                <th className='px-6 py-4 font-semibold'>Quản trị viên</th>
                <th className='px-6 py-4 font-semibold'>Hành động</th>
                <th className='px-6 py-4 font-semibold'>Đối tượng</th>
                <th className='px-6 py-4 font-semibold'>ID đối tượng</th>
                <th className='px-6 py-4 font-semibold text-right'>Chi tiết</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td colSpan={6} className='px-6 py-8 text-center text-muted-foreground'>
                      Đang tải nhật ký...
                    </td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>
                    Chưa có hoạt động nào được ghi lại.
                  </td>
                </tr>
              ) : (
                data?.items.map((log) => (
                  <tr key={log.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='px-6 py-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar size={12} />
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Shield size={14} className='text-primary' />
                        <span className='font-medium'>{log.admin.fullName}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        variant='secondary'
                        className={
                          log.action.includes('BAN') || log.action.includes('DELETE')
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className='px-6 py-4'>
                      <Badge variant='outline' className='font-normal uppercase text-[10px]'>
                        {log.entity}
                      </Badge>
                    </td>
                    <td className='px-6 py-4 font-mono text-[10px] text-muted-foreground'>{log.entityId}</td>
                    <td className='px-6 py-4 text-right'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary'
                          >
                            <Info className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle className='flex items-center gap-2'>
                              <Activity className='h-5 w-5 text-primary' />
                              Chi tiết hành động
                            </DialogTitle>
                            <DialogDescription>
                              Thông tin chi tiết về thay đổi được thực hiện bởi {log.admin.fullName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className='space-y-4 py-4'>
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                              <div className='space-y-1'>
                                <p className='text-muted-foreground'>Hành động</p>
                                <p className='font-bold text-primary'>{log.action}</p>
                              </div>
                              <div className='space-y-1'>
                                <p className='text-muted-foreground'>Thời gian</p>
                                <p className='font-medium'>{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                              </div>
                            </div>
                            <div className='space-y-2'>
                              <p className='text-sm text-muted-foreground'>Dữ liệu thay đổi (JSON)</p>
                              <pre className='p-4 rounded-xl bg-muted font-mono text-xs overflow-auto max-h-[300px]'>
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-4 bg-muted/20 border-t'>
            <div className='text-xs text-muted-foreground text-center sm:text-left'>
              Trang {data.meta.page} / {data.meta.totalPages} ({data.meta.total} bản ghi)
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Trước
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={page === data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
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
