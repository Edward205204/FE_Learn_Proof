'use client'

import { useState } from 'react'
import { BookOpen, Clock, CheckCircle2, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReadingLesson } from '../_utils/lesson-types'

interface ReadingContentProps {
    lesson: ReadingLesson
    onComplete?: () => void
}

export function ReadingContent({ lesson, onComplete }: ReadingContentProps) {
    const [completed, setCompleted] = useState(false)

    const handleComplete = () => {
        setCompleted(true)
        onComplete?.()
    }

    return (
        <div className="space-y-6">
            {/* Card nội dung chính */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-10 pt-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                            <BookOpen size={11} />
                            Bài đọc
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                            <Clock size={11} />
                            ~{lesson.estimatedMinutes} phút
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        {lesson.title}
                    </h1>
                </div>

                {/* Nội dung bài đọc */}
                <div className="px-10 py-8 text-slate-700 text-[15px] leading-[1.9] whitespace-pre-line">
                    {lesson.content}
                </div>

                {/* Nút hoàn thành */}
                <div className="px-10 pb-10">
                    <Button
                        onClick={handleComplete}
                        disabled={completed}
                        className={`h-12 px-8 rounded-2xl font-bold text-sm transition-all ${
                            completed
                                ? 'bg-emerald-500 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                                : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-rose-100 active:scale-[0.98]'
                        }`}
                    >
                        {completed ? (
                            <>
                                <CheckCircle2 size={16} className="mr-2" />
                                Đã hoàn thành bài đọc
                            </>
                        ) : (
                            'Đánh dấu hoàn thành ✓'
                        )}
                    </Button>
                </div>
            </div>

            {/* Tài liệu đính kèm (nếu có) */}
            {lesson.materials && lesson.materials.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 px-1">
                        Tài liệu đính kèm
                    </h3>
                    {lesson.materials.map((file, idx) => (
                        <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-primary transition-colors">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                                        {file.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase font-mono">{file.size}</p>
                                </div>
                            </div>
                            <Download size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}
