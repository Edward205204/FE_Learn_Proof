'use client'

import * as React from 'react'
import {
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  DollarSign
} from 'lucide-react'

import { useAdminDashboardOverviewQuery } from '@/app/admin/_hooks/use-admin-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboardOverviewQuery()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  if (isLoading) {
    return <div className='flex items-center justify-center h-[50vh]'>Đang tải dữ liệu...</div>
  }

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
          Xin chào, Quản trị viên
        </h1>
        <p className='text-muted-foreground mt-1'>Dưới đây là tổng quan về hoạt động của hệ thống LearnProof.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <StatCard
          title='Tổng người dùng'
          value={data?.totalUsers.toLocaleString() || '0'}
          change='+0%'
          increasing={true}
          icon={Users}
          description='Tổng số tài khoản đã đăng ký'
        />
        <StatCard
          title='Khóa học hiện có'
          value={data?.totalCourses.toLocaleString() || '0'}
          change={`${data?.totalPublishedCourses || 0} đã bán`}
          increasing={true}
          icon={BookOpen}
          description='Bao gồm cả bản nháp và đã đăng'
        />
        <StatCard
          title='Tổng doanh thu'
          value={formatCurrency(data?.totalRevenue || 0)}
          change={`Từ ${data?.totalTransactions || 0} giao dịch`}
          increasing={true}
          icon={DollarSign}
          description='Doanh thu tích lũy trên hệ thống'
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4 border-none shadow-sm bg-background/50'>
          <CardHeader>
            <CardTitle>Hoạt động hệ thống</CardTitle>
            <CardDescription>Số lượng ghi danh: {data?.totalEnrollments.toLocaleString() || 0}</CardDescription>
          </CardHeader>
          <CardContent className='h-[300px] flex items-end gap-3 px-6 pb-2'>
            {/* Mock Chart using CSS bars */}
            <div
              className='flex-1 bg-primary/20 rounded-t-lg h-[40%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Jan'
            ></div>
            <div
              className='flex-1 bg-primary/20 rounded-t-lg h-[55%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Feb'
            ></div>
            <div
              className='flex-1 bg-primary/30 rounded-t-lg h-[45%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Mar'
            ></div>
            <div
              className='flex-1 bg-primary/40 rounded-t-lg h-[70%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Apr'
            ></div>
            <div
              className='flex-1 bg-primary/50 rounded-t-lg h-[65%] hover:bg-primary/40 transition-all cursor-pointer'
              title='May'
            ></div>
            <div
              className='flex-1 bg-primary/80 rounded-t-lg h-[90%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Jun'
            ></div>
            <div
              className='flex-1 bg-primary/20 rounded-t-lg h-[30%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Jul'
            ></div>
            <div
              className='flex-1 bg-primary/40 rounded-t-lg h-[60%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Aug'
            ></div>
            <div
              className='flex-1 bg-primary/60 rounded-t-lg h-[75%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Sep'
            ></div>
            <div
              className='flex-1 bg-primary/10 rounded-t-lg h-[20%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Oct'
            ></div>
            <div
              className='flex-1 bg-primary/50 rounded-t-lg h-[65%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Nov'
            ></div>
            <div
              className='flex-1 bg-primary rounded-t-lg h-[100%] hover:bg-primary/40 transition-all cursor-pointer'
              title='Dec'
            ></div>
          </CardContent>
          <div className='flex justify-between px-6 pb-6 text-[10px] text-muted-foreground uppercase font-bold tracking-widest'>
            <span>T1</span>
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>T8</span>
            <span>T9</span>
            <span>T10</span>
            <span>T11</span>
            <span>T12</span>
          </div>
        </Card>

        <Card className='col-span-3 border-none shadow-sm bg-gradient-to-br from-primary/5 to-transparent'>
          <CardHeader>
            <CardTitle>Tình trạng hệ thống</CardTitle>
            <CardDescription>Sức khỏe và hiệu suất vận hành.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>Khóa học đã đăng</span>
                <span className='text-muted-foreground'>
                  {data?.totalPublishedCourses} / {data?.totalCourses}
                </span>
              </div>
              <Progress value={data ? (data.totalPublishedCourses / data.totalCourses) * 100 : 0} className='h-2' />
            </div>

            <div className='pt-4 border-t'>
              <div className='rounded-xl bg-background/50 p-4 border border-primary/10'>
                <div className='flex items-center gap-2 mb-1.5'>
                  <ShieldAlert size={14} className='text-primary' />
                  <span className='text-xs font-bold uppercase'>Sức khỏe hệ thống</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
                  <span className='text-xs font-medium'>Toàn bộ dịch vụ đang hoạt động tốt</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  increasing
}: {
  title: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  increasing: boolean
}) {
  return (
    <Card className='border-none shadow-sm hover:shadow-md transition-shadow group'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <div className='h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:rotate-12'>
          <Icon className='h-4 w-4' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='flex items-center gap-1.5 mt-1'>
          <span
            className={cn('flex items-center text-xs font-bold', increasing ? 'text-emerald-600' : 'text-rose-600')}
          >
            {increasing ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
          <span className='text-[10px] text-muted-foreground'>so với tháng trước</span>
        </div>
        <p className='text-[10px] text-muted-foreground mt-3 italic'>{description}</p>
      </CardContent>
    </Card>
  )
}

function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(' ')
}
