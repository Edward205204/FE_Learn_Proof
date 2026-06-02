'use client'

import * as React from 'react'
import {
  Search,
  MoreHorizontal,
  ShieldCheck,
  UserCog,
  RefreshCw,
  GraduationCap,
  BookOpen,
  Crown
} from 'lucide-react'

import { useAdminUsersQuery, useAdminUpdateUserRoleMutation } from '@/app/admin/_hooks/use-admin-query'
import { AdminRole } from '@/app/admin/_utils/zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// ── Config từng tab ──────────────────────────────────────────────────────────
const TABS: {
  key: AdminRole | 'ALL'
  label: string
  icon: React.ElementType
  color: string
  badgeClass: string
  badgeLabel: string
}[] = [
  {
    key: 'LEARNER',
    label: 'Người học',
    icon: GraduationCap,
    color: 'text-slate-600',
    badgeClass: 'bg-slate-100 text-slate-600 hover:bg-slate-100 border-none',
    badgeLabel: 'LEARNER'
  },
  {
    key: 'CONTENT_MANAGER',
    label: 'Quản lý nội dung',
    icon: BookOpen,
    color: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none',
    badgeLabel: 'MANAGER'
  },
  {
    key: 'ADMIN',
    label: 'Quản trị viên',
    icon: Crown,
    color: 'text-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-none',
    badgeLabel: 'ADMIN'
  }
]

// ── Sub-component: User Table ─────────────────────────────────────────────────
function UserTable({ role }: { role: AdminRole }) {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const updateUserRole = useAdminUpdateUserRoleMutation()

  const { data, isLoading, refetch } = useAdminUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
    role
  })

  const tab = TABS.find((t) => t.key === role)!

  return (
    <div className='space-y-4'>
      {/* Thanh tìm kiếm */}
      <div className='flex gap-3 items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder={`Tìm kiếm ${tab.label.toLowerCase()}...`}
            className='pl-10'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button onClick={() => refetch()} variant='outline' size='icon' className='shrink-0 rounded-full'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      {/* Tổng số */}
      {!isLoading && data && (
        <p className='text-sm text-muted-foreground'>
          Tổng cộng <span className='font-semibold text-foreground'>{data.meta.total}</span> {tab.label.toLowerCase()}
        </p>
      )}

      {/* Bảng */}
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
                    <td colSpan={5} className='px-6 py-8 text-center text-muted-foreground'>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center text-muted-foreground'>
                    Không có {tab.label.toLowerCase()} nào.
                  </td>
                </tr>
              ) : (
                data?.items.map((user) => (
                  <tr key={user.id} className='hover:bg-muted/30 transition-colors'>
                    {/* Avatar + tên */}
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
                            <span className='font-semibold text-foreground truncate max-w-[160px]'>
                              {user.fullName}
                            </span>
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
                          <span className='text-xs text-muted-foreground truncate max-w-[160px]'>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Badge vai trò */}
                    <td className='px-6 py-4'>
                      <Badge variant='secondary' className={tab.badgeClass}>
                        {tab.badgeLabel}
                      </Badge>
                    </td>

                    {/* Thống kê */}
                    <td className='px-6 py-4'>
                      <div className='flex flex-col text-[11px] text-muted-foreground'>
                        <span>Khóa học: {user._count.coursesCreated}</span>
                        <span>Đã mua: {user._count.enrollments}</span>
                      </div>
                    </td>

                    {/* Ngày tham gia */}
                    <td className='px-6 py-4 text-muted-foreground'>
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Thao tác */}
                    <td className='px-6 py-4 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon' className='rounded-full'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-52'>
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {}}>
                            <UserCog className='mr-2 h-4 w-4' />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className='text-[10px] uppercase text-muted-foreground'>
                            Thay đổi quyền
                          </DropdownMenuLabel>
                          {TABS.map((t) => (
                            <DropdownMenuItem
                              key={t.key}
                              disabled={t.key === role}
                              onClick={() =>
                                t.key !== role &&
                                updateUserRole.mutate({ id: user.id, role: t.key as AdminRole })
                              }
                            >
                              <t.icon className='mr-2 h-4 w-4' />
                              Chuyển thành {t.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {data && data.meta.totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-4 bg-muted/20 border-t'>
            <div className='text-xs text-muted-foreground'>
              Trang {data.meta.page} / {data.meta.totalPages}
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

// ── Tổng count để hiển thị trên tab header ────────────────────────────────────
function TabCountBadge({ role }: { role: AdminRole }) {
  const { data } = useAdminUsersQuery({ page: 1, limit: 1, role })
  if (!data) return null
  return (
    <span className='ml-1.5 inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums'>
      {data.meta.total}
    </span>
  )
}

// ── Page chính ────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Quản lý người dùng</h1>
        <p className='text-muted-foreground'>Quản lý tất cả người dùng, phân quyền và trạng thái hoạt động trên hệ thống.</p>
      </div>

      <Tabs defaultValue='LEARNER'>
        <TabsList className='h-auto gap-1 bg-muted/60 p-1 rounded-xl'>
          {TABS.map(({ key, label, icon: Icon, color }) => (
            <TabsTrigger
              key={key}
              value={key}
              className='flex items-center gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span>{label}</span>
              <TabCountBadge role={key as AdminRole} />
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ key }) => (
          <TabsContent key={key} value={key} className='mt-6'>
            <UserTable role={key as AdminRole} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
