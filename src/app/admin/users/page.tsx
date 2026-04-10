'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, RotateCcw, Filter, UserCog } from 'lucide-react'
import { UserTable } from './_components/user-table'
import { useAdminUsers } from '../_hooks/use-admin-users'
import { GetUsersQuery } from '../_types/admin'
import { Role } from '@/@types/user'

export default function AdminUsersPage() {
  const [params, setParams] = useState<GetUsersQuery>({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    isBanned: '',
    sort: 'newest'
  })

  // Debounce search state
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchValue, page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue])

  const { data, isLoading } = useAdminUsers(params)

  const resetFilters = () => {
    setSearchValue('')
    setParams({
      page: 1,
      limit: 10,
      search: '',
      role: '',
      isBanned: '',
      sort: 'newest'
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <UserCog className='h-6 w-6 text-primary' />
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý người dùng</h1>
        </div>
        <p className='text-muted-foreground'>
          Xem danh sách và quản lý quyền hạn của tất cả người dùng trong hệ thống.
        </p>
      </div>

      <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm'>
        <CardHeader className='pb-3 border-b'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <Filter className='h-4 w-4' /> Danh sách người dùng
            </CardTitle>
            <Button variant='outline' size='sm' onClick={resetFilters} className='h-8 text-xs flex items-center gap-1'>
              <RotateCcw className='h-3 w-3' />
              Đặt lại bộ lọc
            </Button>
          </div>
          <CardDescription>{data?.meta?.total || 0} người dùng tìm thấy</CardDescription>
        </CardHeader>
        <CardContent className='pt-6 space-y-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Tìm tên hoặc email...'
                value={searchValue}
                className='pl-9 h-10 border-muted focus-visible:ring-primary/20'
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <Select
              value={params.role || 'ALL_ROLES'}
              onValueChange={(val) =>
                setParams((prev) => ({ ...prev, role: val === 'ALL_ROLES' ? '' : (val as Role), page: 1 }))
              }
            >
              <SelectTrigger className='h-10 border-muted focus:ring-primary/20'>
                <SelectValue placeholder='Tất cả vai trò' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL_ROLES'>Tất cả vai trò</SelectItem>
                <SelectItem value={Role.ADMIN}>Administrator</SelectItem>
                <SelectItem value={Role.CONTENT_MANAGER}>Giảng viên</SelectItem>
                <SelectItem value={Role.LEARNER}>Học viên</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.isBanned || 'ALL_STATUS'}
              onValueChange={(val) =>
                setParams((prev) => ({ ...prev, isBanned: val === 'ALL_STATUS' ? '' : (val as any), page: 1 }))
              }
            >
              <SelectTrigger className='h-10 border-muted focus:ring-primary/20'>
                <SelectValue placeholder='Trạng thái' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL_STATUS'>Tất cả trạng thái</SelectItem>
                <SelectItem value='false'>Đang hoạt động</SelectItem>
                <SelectItem value='true'>Bị khóa</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.sort || 'newest'}
              onValueChange={(val) => setParams((prev) => ({ ...prev, sort: val as any, page: 1 }))}
            >
              <SelectTrigger className='h-10 border-muted focus:ring-primary/20'>
                <SelectValue placeholder='Sắp xếp' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Mới nhất</SelectItem>
                <SelectItem value='oldest'>Cũ nhất</SelectItem>
                <SelectItem value='name-asc'>Tên (A-Z)</SelectItem>
                <SelectItem value='name-desc'>Tên (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UserTable users={data?.items || []} isLoading={isLoading} />

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className='flex items-center justify-between py-2'>
              <p className='text-sm text-muted-foreground'>
                Trang {data.meta.page} của {data.meta.totalPages}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={data.meta.page === 1 || isLoading}
                  onClick={() => setParams((prev) => ({ ...prev, page: prev.page! - 1 }))}
                  className='h-8 transition-all hover:bg-primary/5 active:scale-95'
                >
                  Trước
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={data.meta.page === data.meta.totalPages || isLoading}
                  onClick={() => setParams((prev) => ({ ...prev, page: prev.page! + 1 }))}
                  className='h-8 transition-all hover:bg-primary/5 active:scale-95'
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
