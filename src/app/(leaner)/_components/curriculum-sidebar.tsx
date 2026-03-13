'use client'

import { CheckCircle2, PlayCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils' // Giả định bạn dùng shadcn/ui utils

interface Lesson {
    id: string
    title: string
    duration: string
    isCompleted: boolean
    isLocked: boolean
    type: 'video' | 'quiz'
}

interface Chapter {
    id: string
    title: string
    lessons: Lesson[]
}

interface CurriculumSidebarProps {
    chapters: Chapter[]
    currentLessonId: string
}

export function CurriculumSidebar({ chapters, currentLessonId }: CurriculumSidebarProps) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full overflow-y-auto">
            <div className="mb-6">
                <h3 className="font-bold text-lg text-slate-800">Nội dung khóa học</h3>
                <p className="text-xs text-slate-500 mt-1">Hoàn thành 4 trên 12 bài học</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-primary h-full w-1/3 transition-all" /> {/* Progress bar hồng */}
                </div>
            </div>

            <div className="space-y-6">
                {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Chương {index + 1}: {chapter.title}
                        </h4>

                        <div className="space-y-2">
                            {chapter.lessons.map((lesson) => {
                                const isActive = lesson.id === currentLessonId

                                return (
                                    <div
                                        key={lesson.id}
                                        className={cn(
                                            "group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border border-transparent",
                                            isActive
                                                ? "bg-rose-50 text-primary border-rose-100 shadow-sm" // Highlight bài hiện tại
                                                : "hover:bg-slate-50 text-slate-600",
                                            lesson.isLocked && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Trạng thái Icon */}
                                            {lesson.isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> // Icon tích xanh
                                            ) : lesson.isLocked ? (
                                                <Lock className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <PlayCircle className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-400")} />
                                            )}

                                            <span className={cn(
                                                "text-sm font-medium line-clamp-1",
                                                isActive ? "font-bold" : "font-normal"
                                            )}>
                                                {lesson.title}
                                            </span>
                                        </div>

                                        <span className="text-[10px] font-mono text-slate-400">
                                            {lesson.isLocked ? 'Quiz' : lesson.duration}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Nút điều hướng cuối trang như trong thiết kế */}
            <button className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-rose-200">
                Bài học tiếp theo
                <span className="text-xl">→</span>
            </button>
        </div>
    )
}