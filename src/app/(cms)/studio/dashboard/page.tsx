'use client'

import * as React from 'react'
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  FileText,
  Archive,
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import { useInstructorDashboardQuery } from '../../_hooks/use-course-mutation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_LABEL: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; color: string }> = {
  PUBLISHED: { label: 'Đã đăng', variant: 'default', color: 'bg-emerald-500' },
  DRAFT: { label: 'Bản nháp', variant: 'secondary', color: 'bg-sky-500' },
  ARCHIVED: { label: 'Lưu trữ', variant: 'outline', color: 'bg-amber-500' }
}

export default function InstructorDashboardPage() {
  const [range, setRange] = React.useState('6m')
  const { data, isLoading } = useInstructorDashboardQuery(range)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin' />
          <p className='text-sm font-medium text-muted-foreground animate-pulse'>Đang tải dữ liệu giảng viên...</p>
        </div>
      </div>
    )
  }

  const publishedCount = data?.courseStats.find((s) => s.status === 'PUBLISHED')?._count.id ?? 0
  const draftCount = data?.courseStats.find((s) => s.status === 'DRAFT')?._count.id ?? 0
  const archivedCount = data?.courseStats.find((s) => s.status === 'ARCHIVED')?._count.id ?? 0
  const totalCourses = publishedCount + draftCount + archivedCount

  return (
    <div className='space-y-8 pb-10'>
      {/* Welcome Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent'>
            Chào buổi sáng, Giảng viên
          </h1>
          <p className='text-muted-foreground mt-2 flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
            Hệ thống đang hoạt động ổn định. Dưới đây là hiệu suất của bạn.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge
            variant='outline'
            className='px-3 py-1 text-xs font-semibold border-primary/20 bg-primary/5 text-primary'
          >
            Cập nhật lần cuối: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue='overview' className='space-y-6'>
        <TabsList className='bg-muted/50 p-1'>
          <TabsTrigger value='overview' className='px-6'>
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value='analytics' className='px-6'>
            Phân tích chi tiết
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-8'>
          {/* Key Stats Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              title='Học viên mới'
              value={data?.totalStudents.toLocaleString() ?? '0'}
              icon={Users}
              trend='+12.5%'
              description='Trong 30 ngày qua'
              className='bg-blue-500/5 border-blue-500/10'
              iconClassName='text-blue-500 bg-blue-500/10'
            />
            <StatCard
              title='Doanh thu'
              value={formatCurrency(data?.totalRevenue ?? 0)}
              icon={DollarSign}
              trend='+8.2%'
              description={`Từ ${data?.totalTransactions ?? 0} lượt mua`}
              className='bg-emerald-500/5 border-emerald-500/10'
              iconClassName='text-emerald-500 bg-emerald-500/10'
            />
            <StatCard
              title='Khóa học'
              value={totalCourses.toString()}
              icon={BookOpen}
              description={`${publishedCount} đã đăng • ${draftCount} nháp`}
              className='bg-violet-500/5 border-violet-500/10'
              iconClassName='text-violet-500 bg-violet-500/10'
            />
            <StatCard
              title='Rating TB'
              value={(totalCourses > 0
                ? (data?.topCourses.reduce((acc, c) => acc + c.avgRating, 0) ?? 0) / (data?.topCourses.length ?? 1)
                : 0
              ).toFixed(1)}
              icon={Star}
              description='Đánh giá từ học viên'
              className='bg-amber-500/5 border-amber-500/10'
              iconClassName='text-amber-500 bg-amber-500/10'
            />
          </div>

          <div className='grid gap-8 lg:grid-cols-7'>
            {/* Revenue Chart Container */}
            <Card className='lg:col-span-4 border-none shadow-sm overflow-hidden bg-background/50 backdrop-blur-sm'>
              <CardHeader className='flex flex-row items-center justify-between pb-8'>
                <div>
                  <CardTitle className='text-xl font-bold'>Biểu đồ doanh thu</CardTitle>
                  <CardDescription>Theo dõi biến động doanh thu theo thời gian</CardDescription>
                </div>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger className='w-[140px] bg-background/50'>
                    <SelectValue placeholder='Chọn khoảng thời gian' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='today'>Hôm nay</SelectItem>
                    <SelectItem value='7d'>7 ngày qua</SelectItem>
                    <SelectItem value='30d'>30 ngày qua</SelectItem>
                    <SelectItem value='6m'>6 tháng qua</SelectItem>
                    <SelectItem value='1y'>1 năm qua</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className='pl-2'>
                <ChartContainer
                  config={{
                    revenue: {
                      label: 'Doanh thu',
                      color: 'hsl(var(--primary))'
                    }
                  }}
                  className='h-[300px] w-full'
                >
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart key={range} data={data?.revenueChart ?? []}>
                      <defs>
                        <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='0%' stopColor='#10b981' stopOpacity={0.8} />
                          <stop offset='100%' stopColor='#10b981' stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-muted/30' />
                      <XAxis
                        dataKey='month'
                        tickLine={false}
                        axisLine={false}
                        tickMargin={12}
                        tickFormatter={(value) => {
                          if (!value) return ''
                          const date = new Date(value)
                          if (isNaN(date.getTime())) return ''

                          if (range === 'today') return `${date.getHours()}h`
                          if (range === '7d' || range === '30d') return `${date.getDate()}/${date.getMonth() + 1}`
                          return `T${date.getMonth() + 1}`
                        }}
                        className='text-[10px] font-medium text-muted-foreground/60'
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            nameKey='revenue'
                            formatter={(val) => formatCurrency(Number(val))}
                            className='w-[160px] border-primary/10 shadow-xl'
                          />
                        }
                      />
                      <Bar dataKey='revenue' fill='url(#revenueGradient)' radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Course Status Summary */}
            <Card className='lg:col-span-3 border-none shadow-sm bg-background/50 backdrop-blur-sm flex flex-col'>
              <CardHeader>
                <CardTitle className='text-xl font-bold'>Trạng thái khóa học</CardTitle>
                <CardDescription>Phân bổ theo trạng thái phát hành</CardDescription>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col justify-center space-y-8'>
                <div className='space-y-6'>
                  <StatusItem
                    label='Đã đăng (Published)'
                    count={publishedCount}
                    total={totalCourses}
                    color='bg-emerald-500'
                  />
                  <StatusItem label='Bản nháp (Draft)' count={draftCount} total={totalCourses} color='bg-sky-500' />
                  <StatusItem
                    label='Lưu trữ (Archived)'
                    count={archivedCount}
                    total={totalCourses}
                    color='bg-amber-500'
                  />
                </div>
                <Separator className='my-4 opacity-50' />
                <div className='p-4 rounded-2xl bg-primary/5 border border-primary/10'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className='text-sm font-bold'>Tăng trưởng nội dung</p>
                      <p className='text-[11px] text-muted-foreground'>
                        Bạn đã thêm {publishedCount} khóa học mới tháng này
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-8 lg:grid-cols-2'>
            {/* Popular Courses */}
            <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm'>
              <CardHeader className='flex flex-row items-center justify-between pb-6'>
                <div className='space-y-1'>
                  <CardTitle className='text-xl font-bold flex items-center gap-2'>
                    <TrendingUp size={20} className='text-primary' />
                    Khóa học nổi bật
                  </CardTitle>
                  <CardDescription>Sắp xếp theo số lượng ghi danh</CardDescription>
                </div>
                <button className='text-xs font-semibold text-primary hover:underline flex items-center gap-1'>
                  Xem tất cả <ChevronRight size={14} />
                </button>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {data?.topCourses.map((course, i) => (
                    <div
                      key={course.id}
                      className='group flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-all cursor-pointer'
                    >
                      <div className='relative h-14 w-24 rounded-xl overflow-hidden shadow-sm'>
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className='object-cover group-hover:scale-110 transition-transform duration-500'
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center bg-muted'>
                            <BookOpen size={18} className='text-muted-foreground/50' />
                          </div>
                        )}
                        <div className='absolute inset-0 bg-black/5' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-bold truncate group-hover:text-primary transition-colors'>
                          {course.title}
                        </p>
                        <div className='flex items-center gap-3 mt-1.5'>
                          <span className='text-[11px] font-medium text-muted-foreground flex items-center gap-1'>
                            <Users size={12} className='text-primary' />
                            {course._count.enrollments} học viên
                          </span>
                          <span className='text-[11px] font-medium text-muted-foreground flex items-center gap-1'>
                            <Star size={12} className='text-amber-500 fill-amber-500' />
                            {course.avgRating.toFixed(1)}
                          </span>
                          <Badge
                            className={cn(
                              'h-4 text-[9px] px-1.5 font-bold uppercase',
                              STATUS_LABEL[course.status]?.color
                            )}
                          >
                            {STATUS_LABEL[course.status]?.label}
                          </Badge>
                        </div>
                      </div>
                      <div className='h-8 w-8 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background'>
                        <ArrowUpRight size={14} className='text-muted-foreground' />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews with Avatar */}
            <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm'>
              <CardHeader className='flex flex-row items-center justify-between pb-6'>
                <div className='space-y-1'>
                  <CardTitle className='text-xl font-bold flex items-center gap-2'>
                    <MessageSquare size={20} className='text-primary' />
                    Học viên nhận xét
                  </CardTitle>
                  <CardDescription>Đánh giá mới nhất từ khóa học của bạn</CardDescription>
                </div>
                <button className='text-xs font-semibold text-primary hover:underline flex items-center gap-1'>
                  Phản hồi <ChevronRight size={14} />
                </button>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {data?.recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className='relative pl-6 border-l-2 border-primary/10 py-1 hover:border-primary/40 transition-colors'
                    >
                      <div className='flex items-center gap-3 mb-3'>
                        <Avatar className='h-10 w-10 border-2 border-background ring-2 ring-primary/5 shadow-sm'>
                          <AvatarImage src={review.user.avatar ?? ''} />
                          <AvatarFallback className='bg-primary/5 text-primary font-bold text-xs'>
                            {review.user.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-bold'>{review.user.fullName}</p>
                          <p className='text-[10px] font-medium text-primary/70'>{review.course.title}</p>
                        </div>
                        <div className='ml-auto flex items-center gap-0.5'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div className='bg-muted/30 p-3 rounded-2xl rounded-tl-none'>
                        <p className='text-xs leading-relaxed text-muted-foreground italic font-medium'>
                          &quot;{review.comment ?? 'Học viên không để lại nhận xét.'}&quot;
                        </p>
                      </div>
                      <p className='text-[10px] text-muted-foreground mt-3 font-medium flex items-center gap-1 opacity-70'>
                        <span className='h-1 w-1 rounded-full bg-muted-foreground' />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {(!data?.recentReviews || data.recentReviews.length === 0) && (
                    <div className='text-center py-10 space-y-3 opacity-50'>
                      <MessageSquare size={40} className='mx-auto text-muted-foreground' />
                      <p className='text-sm font-medium'>Chưa có nhận xét nào được gửi đến.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='analytics'>
          <Card className='border-none shadow-sm bg-background/50 backdrop-blur-sm min-h-[400px] flex items-center justify-center border-dashed border-2'>
            <div className='text-center space-y-4'>
              <div className='h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto'>
                <TrendingUp size={32} className='text-primary opacity-50' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-bold text-lg'>Tính năng đang phát triển</h3>
                <p className='text-sm text-muted-foreground w-64 mx-auto'>
                  Phân tích chi tiết về hành vi học tập và chuyển đổi sẽ có mặt trong bản cập nhật tới.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  iconClassName
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  description: string
  className?: string
  iconClassName?: string
}) {
  return (
    <Card
      className={cn(
        'border border-transparent shadow-none hover:shadow-lg transition-all duration-300 rounded-[2rem]',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between pb-4 pt-8'>
        <CardTitle className='text-xs font-bold uppercase tracking-widest text-muted-foreground/70'>{title}</CardTitle>
        <div className={cn('h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner', iconClassName)}>
          <Icon className='h-5 w-5' />
        </div>
      </CardHeader>
      <CardContent className='pb-8'>
        <div className='flex items-baseline gap-2'>
          <div className='text-3xl font-black tracking-tight'>{value}</div>
          {trend && (
            <div className='text-[10px] font-bold text-emerald-600 bg-emerald-600/10 px-1.5 py-0.5 rounded-full flex items-center'>
              <ArrowUpRight size={10} className='mr-0.5' />
              {trend}
            </div>
          )}
        </div>
        <p className='text-[11px] font-medium text-muted-foreground mt-3 opacity-80'>{description}</p>
      </CardContent>
    </Card>
  )
}

function StatusItem({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm font-semibold'>
        <div className='flex items-center gap-2'>
          <div className={cn('h-2 w-2 rounded-full', color)} />
          <span>{label}</span>
        </div>
        <span className='font-mono'>{count}</span>
      </div>
      <Progress
        value={percentage}
        className='h-1.5 bg-muted-foreground/10 [&>div]:bg-current'
        style={{ color: color.replace('bg-', '') }}
      />
    </div>
  )
}
