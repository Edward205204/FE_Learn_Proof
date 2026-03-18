'use client'

import { Search, Bell, PlayCircle, PlusCircle, ArrowRight } from 'lucide-react'
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
        <div className="min-h-screen bg-[oklch(1_0_0)] dark:bg-transparent pb-20 pt-10">
            <div className="max-w-[1240px] mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Khóa học của tôi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                            Chào Long, bạn đã hoàn thành <span className="text-rose-500 font-bold">40%</span> lộ trình trong tháng này!
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-[360px]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                className="w-full pl-14 h-14 bg-white dark:bg-slate-800 border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] rounded-full text-base focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                placeholder="Tìm khóa học..."
                            />
                        </div>
                        <button className="relative p-4 bg-white dark:bg-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] rounded-full text-slate-500 hover:text-rose-500 transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-4 right-4 w-3 h-3 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Categories / Tabs */}
                <Tabs defaultValue="learning" className="w-full">
                    <TabsList className="bg-transparent h-auto p-0 gap-12 flex justify-start border-none mb-10">
                        <TabsTrigger
                            value="all"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=inactive]:text-slate-400 bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-rose-500 data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
                        >
                            Tất cả
                        </TabsTrigger>
                        <TabsTrigger
                            value="learning"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-rose-500 data-[state=inactive]:text-slate-400 bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-rose-500 data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
                        >
                            Đang học
                        </TabsTrigger>
                        <TabsTrigger
                            value="completed"
                            className="text-lg font-bold px-0 py-3 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=inactive]:text-slate-400 bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-rose-500 data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
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

                    <TabsContent value="all" className="mt-10 py-20 text-center text-slate-400 text-lg">
                        Khám phá thêm nhiều kiến thức mới tại trang khóa học.
                    </TabsContent>

                    <TabsContent value="completed" className="mt-10 py-20 text-center text-slate-400 text-lg">
                        Bạn chưa hoàn thành khóa học nào. Cố gắng lên nhé!
                    </TabsContent>
                </Tabs>

                {/* Discovery Box */}
                <div className="mt-20 group">
                    <Link
                        href={PATH.COURSES}
                        className="flex flex-col items-center justify-center py-20 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-all bg-slate-50/50 dark:bg-white/5"
                    >
                        <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 group-hover:rotate-90">
                            <PlusCircle className="text-rose-500" size={40} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                            Khám phá khóa học mới
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
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
        <div className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 transition-all duration-700">
            {/* Image and Badge */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                    <Badge className="bg-white/95 backdrop-blur-md shadow-sm text-slate-900 text-[12px] font-black px-5 py-2 rounded-full border-none tracking-tight uppercase">
                        {course.category}
                    </Badge>
                </div>
            </div>

            {/* Body */}
            <div className="p-10 pt-8 flex flex-col h-full">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.3] line-clamp-2 min-h-[3.8rem] group-hover:text-rose-500 transition-colors">
                    {course.title}
                </h3>

                {/* Progress Info */}
                <div className="mt-8 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <PlayCircle size={18} className="text-slate-400" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tiếp theo:</span>
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{course.nextLesson}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[12px] font-black tracking-widest uppercase text-slate-400">
                            <span>Tiến độ</span>
                            <span className="text-rose-500">{course.progress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Cta */}
                <Button
                    asChild
                    className="mt-10 w-full h-[64px] rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black text-base gap-2 border-none shadow-none group/btn transition-all active:scale-[0.98]"
                >
                    <Link href={`/courses/${course.slug}`}>
                        Tiếp tục học
                        <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-2" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
