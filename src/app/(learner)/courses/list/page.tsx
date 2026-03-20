'use client'

import { Search, Bell, PlayCircle, PlusCircle, ArrowRight, ChevronRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'
import { PATH } from '@/constants/path'

const MY_COURSES = [
    {
        id: '1',
        title: 'Lập trình ReactJS: Từ cơ bản đến nâng cao',
        slug: 'lap-trinh-reactjs-pro',
        category: 'PHÁT TRIỂN WEB',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80',
        nextLesson: 'Tìm hiểu React Hooks',
        progress: 75,
        status: 'learning'
    },
    {
        id: '2',
        title: 'Mastering Figma for UI/UX Designers',
        slug: 'mastering-figma-design',
        category: 'THIẾT KẾ',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80',
        nextLesson: 'Hệ thống Auto Layout 3.0',
        progress: 32,
        status: 'learning'
    },
    {
        id: '3',
        title: 'Data Science with Python & Seaborn',
        slug: 'data-science-python-pro',
        category: 'DỮ LIỆU',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
        nextLesson: 'Trực quan hóa với Seaborn',
        progress: 15,
        status: 'learning'
    }
]

export default function MyCoursesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 pt-10">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header Section */}
                <nav className="flex items-center gap-2 text-[12px] font-black tracking-widest uppercase text-slate-400 mb-8 mt-2">
                    <Link href="/" className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors">Trang chủ</Link>
                    <ChevronRight size={14} />
                    <span className="text-[oklch(0.577_0.245_27.325)]">Học tập</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Khóa học của tôi
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium">
                            Chào Long, bạn đã hoàn thành <span className="text-primary font-bold">40%</span> lộ trình trong tháng này!
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-[360px]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                className="w-full pl-14 h-14 bg-background border border-input shadow-sm rounded-full text-[15px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                                placeholder="Tìm khóa học..."
                            />
                        </div>
                        <button className="relative p-4 bg-background border border-border shadow-sm rounded-full text-muted-foreground hover:text-primary transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-4 right-4 w-3 h-3 bg-primary border-2 border-background rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Categories / Tabs */}
                <Tabs defaultValue="learning" className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-12 flex justify-start border-none mb-10">
                        <TabsTrigger
                            value="all"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
                        >
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger
                            value="learning"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
                        >
                            Đang học
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
                        >
                            Đã hoàn thành
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="learning" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {MY_COURSES.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="all" className="mt-10 py-20 text-center text-muted-foreground text-lg">
                        Khám phá thêm nhiều kiến thức mới tại trang khóa học.
                    </TabsContent>

                    <TabsContent value="completed" className="mt-10 py-20 text-center text-muted-foreground text-lg">
                        Bạn chưa hoàn thành khóa học nào. Cố gắng lên nhé!
                    </TabsContent>
                </Tabs>

                {/* Discovery Box */}
                <div className="mt-20 group">
                    <Link
                        href={PATH.COURSES}
                        className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-muted/20"
                    >
                        <div className="w-16 h-16 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-90">
                            <PlusCircle className="text-primary" size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            Khám phá khóa học mới
                        </h3>
                        <p className="text-muted-foreground text-[16px] font-medium">
                            Mở khóa tiềm năng của bạn ngay hôm nay
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function CourseCard({ course }: { course: typeof MY_COURSES[0] }) {
    return (
        <div className="group bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-500">
            {/* Image and Badge */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <Badge className="bg-background/95 backdrop-blur-md shadow-sm text-foreground text-[11px] font-bold px-4 py-1.5 rounded-full border-none tracking-tight uppercase">
                        {course.category}
                    </Badge>
                </div>
            </div>

            {/* Body */}
            <div className="p-8 pt-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-foreground leading-[1.3] line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                {/* Progress Info */}
                <div className="mt-6 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <PlayCircle size={18} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Tiếp theo:</span>
                            <p className="text-sm font-bold text-foreground truncate">{course.nextLesson}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                            <span>Tiến độ</span>
                            <span className="text-primary">{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Cta */}
                <Button
                    asChild
                    className="mt-8 w-full h-[48px] rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold text-[15px] gap-2 border-none shadow-none group/btn transition-all active:scale-[0.98]"
                >
                    <Link href={`/courses/${course.slug}`}>
                        Tiếp tục học
                        <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1.5" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
