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
    limit: 10,
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
                          <span className='font-semibold text-foreground truncate max-w-[150px]'>{user.fullName}</span>
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
