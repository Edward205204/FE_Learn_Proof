'use client'

import * as React from 'react'
import { Users, Search, MoreHorizontal, ShieldCheck, Ban, UserCog, RefreshCw } from 'lucide-react'

import { useAdminUsersQuery, useAdminUpdateUserRoleMutation } from '@/app/admin/_hooks/use-admin-query'
import { AdminRole } from '@/app/admin/_utils/zod'
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState('')
  const [role, setRole] = React.useState<AdminRole | undefined>(undefined)
  const [page, setPage] = React.useState(1)

  const { data, isLoading, refetch } = useAdminUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role: role as AdminRole | undefined
  })

  const updateUserRole = useAdminUpdateUserRoleMutation()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleRoleChange = (val: string) => {
    setRole(val === 'ALL' ? undefined : (val as AdminRole))
    setPage(1)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý người dùng</h1>
          <p className='text-muted-foreground'>
            Quản lý tất cả người dùng, phân quyền và trạng thái hoạt động trên hệ thống.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline' size='icon' className='shrink-0 rounded-full'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm người dùng theo tên hoặc email...'
            className='pl-10'
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Select onValueChange={handleRoleChange} value={role || 'ALL'}>
          <SelectTrigger className='w-full sm:w-[200px]'>
            <SelectValue placeholder='Lọc theo vai trò' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>Tất cả vai trò</SelectItem>
            <SelectItem value='LEARNER'>Người học (Learner)</SelectItem>
            <SelectItem value='CONTENT_MANAGER'>Quản lý nội dung</SelectItem>
            <SelectItem value='ADMIN'>Quản trị viên (Admin)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className='border-none shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='text-xs text-muted-foreground uppercase bg-muted/50 border-b'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Người dùng</th>
                <th className='px-6 py-4 font-semibold'>Vai trò</th>
                <th className='px-6 py-4 font-semibold'>Thống kê</th>
                <th className='px-6 py-4 font-semibold'>Ngày tham gia</th>
                <th className='px-6 py-4 font-semibold text-right'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td colSpan={6} className='px-6 py-8 text-center text-muted-foreground'>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-12 text-center text-muted-foreground'>
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                data?.items.map((user) => (
                  <tr key={user.id} className='hover:bg-muted/30 transition-colors'>
                    <td className='px-6 py-4 font-medium'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9 border'>
                          <AvatarImage src={user.avatar || ''} />
                          <AvatarFallback className='bg-primary/10 text-primary text-xs'>
                            {user.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1.5'>
                            <span className='font-semibold text-foreground truncate max-w-[150px]'>{user.fullName}</span>
                            {user.provider === 'GOOGLE' && (
                              <div
                                className='flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white shadow-sm border border-muted shrink-0'
                                title='Đăng nhập bằng Google'
                              >
                                <svg viewBox='0 0 24 24' className='w-2.5 h-2.5'>
                                  <path
                                    fill='#4285F4'
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                  />
                                  <path
                                    fill='#34A853'
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                  />
                                  <path
                                    fill='#FBBC05'
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                                  />
                                  <path
                                    fill='#EA4335'
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className='text-xs text-muted-foreground truncate max-w-[150px]'>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      {user.role === 'ADMIN' ? (
                        <Badge
                          variant='secondary'
                          className='bg-purple-100 text-purple-700 hover:bg-purple-100 border-none'
                        >
                          ADMIN
                        </Badge>
                      ) : user.role === 'CONTENT_MANAGER' ? (
                        <Badge variant='secondary' className='bg-blue-100 text-blue-700 hover:bg-blue-100 border-none'>
                          MANAGER
                        </Badge>
                      ) : (
                        <Badge
                          variant='secondary'
                          className='bg-slate-100 text-slate-600 hover:bg-slate-100 border-none'
                        >
                          LEARNER
                        </Badge>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col text-[11px] text-muted-foreground'>
                        <span>Khóa học: {user._count.coursesCreated}</span>
                        <span>Đã mua: {user._count.enrollments}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
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
                          <DropdownMenuItem onClick={() => {}}>
                            <UserCog className='mr-2 h-4 w-4' />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className='text-[10px] uppercase text-muted-foreground'>
                            Thay đổi quyền
                          </DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateUserRole.mutate({ id: user.id, role: 'LEARNER' })}>
                            Chuyển thành Learner
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateUserRole.mutate({ id: user.id, role: 'CONTENT_MANAGER' })}
                          >
                            Chuyển thành Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole.mutate({ id: user.id, role: 'ADMIN' })}>
                            Chuyển thành Admin
                          </DropdownMenuItem>
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
              Hiển thị trang {data.meta.page} / {data.meta.totalPages} ({data.meta.total} người dùng)
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
