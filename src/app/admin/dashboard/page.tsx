'use client'

import * as React from 'react'
import {
  Users,
  BookOpen,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react'

import {
  useAdminDashboardOverviewQuery,
  useAdminDashboardRevenueQuery,
  useAdminDashboardTopCoursesQuery,
  useAdminDashboardHardLessonsQuery
} from '@/app/admin/_hooks/use-admin-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export default function AdminDashboardPage() {
  const currentMonth = new Date().toISOString()
  
  const { data, isLoading } = useAdminDashboardOverviewQuery()
  const { data: revenueData } = useAdminDashboardRevenueQuery()
  const { data: topCourses } = useAdminDashboardTopCoursesQuery(currentMonth)
  const { data: hardLessons } = useAdminDashboardHardLessonsQuery()

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
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>Biểu đồ doanh thu trong năm nay.</CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:p-6'>
            <ChartContainer
              config={{
                revenue: {
                  label: "Doanh thu",
                  color: "hsl(var(--primary))",
                },
              }}
              className="aspect-auto h-[300px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={revenueData || []}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `T${date.getMonth() + 1}`
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="revenue"
                      formatter={(val) => formatCurrency(Number(val))}
                    />
                  }
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
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

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Top Courses */}
        <Card className='border-none shadow-sm'>
          <CardHeader>
            <CardTitle>Top khóa học bán chạy tháng này</CardTitle>
            <CardDescription>Danh sách các khóa học mang lại doanh thu cao nhất.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topCourses?.map((course) => (
                <div key={course.courseId} className='flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none line-clamp-1'>{course.title}</p>
                    <p className='text-xs text-muted-foreground'>{course.totalSales} lượt mua</p>
                  </div>
                  <div className='font-medium text-sm'>{formatCurrency(course.revenue)}</div>
                </div>
              ))}
              {(!topCourses || topCourses.length === 0) && (
                <div className='text-sm text-muted-foreground text-center py-4'>Chưa có dữ liệu giao dịch trong tháng.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hard Lessons */}
        <Card className='border-none shadow-sm'>
          <CardHeader>
            <CardTitle>Bài học có tỷ lệ Drop cao</CardTitle>
            <CardDescription>Học viên thường bỏ cuộc tại các bài học này.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {hardLessons?.map((lesson) => (
                <div key={lesson.lessonId} className='flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0'>
                  <div className='space-y-1 w-2/3'>
                    <p className='text-sm font-medium leading-none line-clamp-1'>{lesson.title}</p>
                    <p className='text-xs text-muted-foreground'>{lesson.totalAttempts} lượt học</p>
                  </div>
                  <div className='flex flex-col items-end'>
                    <div className='text-sm font-bold text-rose-500'>{(lesson.dropRate * 100).toFixed(1)}%</div>
                    <Progress value={lesson.dropRate * 100} className='h-1.5 w-16 mt-1 [&>div]:bg-rose-500 bg-rose-100' />
                  </div>
                </div>
              ))}
              {(!hardLessons || hardLessons.length === 0) && (
                <div className='text-sm text-muted-foreground text-center py-4'>Chưa có dữ liệu bài học.</div>
              )}
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
