'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Shield, User as UserIcon, Ban, CheckCircle, Mail, Calendar } from 'lucide-react'
import { AdminUserItem } from '../../_types/admin'
import { Role } from '@/@types/user'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useUpdateUserRole, useUpdateBanStatus } from '../../_hooks/use-admin-users'

interface UserTableProps {
  users: AdminUserItem[]
  isLoading?: boolean
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const updateRoleMutation = useUpdateUserRole()
  const updateBanMutation = useUpdateBanStatus()

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateRoleMutation.mutate({ id: userId, body: { role: newRole } })
  }

  const handleBanToggle = (userId: string, currentBanStatus: boolean) => {
    updateBanMutation.mutate({ id: userId, body: { isBanned: !currentBanStatus } })
  }

  if (isLoading) {
    return (
      <div className='rounded-md border p-8 text-center text-muted-foreground italic'>
        Đang tải danh sách người dùng...
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/30'>
            <TableHead className='w-[300px]'>Người dùng</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tham gia</TableHead>
            <TableHead>Thống kê</TableHead>
            <TableHead className='text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                Không tìm thấy người dùng nào.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className='group transition-colors'>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 border group-hover:border-primary/50 transition-colors'>
                      <AvatarImage src={user.avatar || ''} alt={user.fullName} />
                      <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                        {user.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col min-w-0'>
                      <span className='font-semibold truncate text-sm'>{user.fullName}</span>
                      <span className='text-xs text-muted-foreground truncate flex items-center gap-1'>
                        <Mail className='h-3 w-3' /> {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === Role.ADMIN ? (
                    <Badge variant='default' className='bg-rose-500 hover:bg-rose-600'>
                      <Shield className='mr-1 h-3 w-3 text-white' /> Admin
                    </Badge>
                  ) : user.role === Role.CONTENT_MANAGER ? (
                    <Badge
                      variant='secondary'
                      className='bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                    >
                      Giảng viên
                    </Badge>
                  ) : (
                    <Badge variant='outline' className='text-muted-foreground'>
                      Học viên
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge variant='destructive' className='flex items-center gap-1'>
                      <Ban className='h-3 w-3 text-white' /> Bị khóa
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-emerald-500 border-emerald-500/30 bg-emerald-500/5 flex items-center gap-1'
                    >
                      <CheckCircle className='h-3 w-3' /> Hoạt động
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col text-xs space-y-0.5'>
                    <span className='text-muted-foreground flex items-center gap-1'>
                      <Calendar className='h-3 w-3' /> Joined
                    </span>
                    <span className='font-medium'>
                      {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col text-xs gap-1'>
                    <span className='whitespace-nowrap'>📚 {user._count.coursesCreated} Khóa học</span>
                    <span className='whitespace-nowrap'>🎓 {user._count.enrollments} Đăng ký</span>
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-primary/10'>
                        <span className='sr-only'>Mở menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-[200px]'>
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className='text-[10px] font-bold text-muted-foreground uppercase py-1 px-2'>
                        Thay đổi vai trò
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, Role.LEARNER)}
                        disabled={user.role === Role.LEARNER}
                        className='text-xs'
                      >
                        Trở thành Học viên
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, Role.CONTENT_MANAGER)}
                        disabled={user.role === Role.CONTENT_MANAGER}
                        className='text-xs'
                      >
                        Trở thành Giảng viên
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, Role.ADMIN)}
                        disabled={user.role === Role.ADMIN}
                        className='text-xs'
                      >
                        Trở thành Admin
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBanToggle(user.id, user.isBanned)}
                        className={
                          user.isBanned
                            ? 'text-emerald-600 focus:text-emerald-700 text-xs'
                            : 'text-destructive focus:text-destructive text-xs'
                        }
                      >
                        {user.isBanned ? (
                          <span className='flex items-center gap-2'>
                            <CheckCircle className='h-4 w-4' /> Mở khóa tài khoản
                          </span>
                        ) : (
                          <span className='flex items-center gap-2'>
                            <Ban className='h-4 w-4' /> Khóa tài khoản
                          </span>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
