'use client'

import { useState } from 'react'
import { ClipboardList, Trophy, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import type { QuizLesson } from '../_utils/lesson-types'

interface QuizContainerProps {
    lesson: QuizLesson
    onSubmit?: (answers: Record<string, string>, score: number) => void
}

export function QuizContainer({ lesson, onSubmit }: QuizContainerProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [discussion, setDiscussion] = useState('')

    const answeredCount = Object.keys(answers).length
    const totalQuestions = lesson.questions.length

    const handleSelect = (questionId: string, optionId: string) => {
        if (submitted) return
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    }

    const handleSubmit = () => {
        const correct = lesson.questions.filter(
            (q) => answers[q.id] === q.correctOptionId
        ).length
        setScore(correct)
        setSubmitted(true)
        onSubmit?.(answers, correct)
    }

    return (
        <div className="space-y-8">
            {/* ---- HEADER ---- */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-rose-100">
                        <ClipboardList size={11} />
                        {lesson.isFinalExam ? 'Kiểm tra cuối khóa' : 'Quiz'}
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    {lesson.title}
                </h1>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {lesson.isFinalExam
                        ? 'Vui lòng hoàn thành tất cả các câu hỏi dưới đây để nhận chứng chỉ hoàn thành khóa học. Bạn cần đạt tối thiểu 80% điểm số.'
                        : `Hoàn thành ${totalQuestions} câu hỏi để kiểm tra kiến thức của bạn.`}
                </p>
            </div>

            {/* ---- KẾT QUẢ sau khi nộp ---- */}
            {submitted && (
                <div className={`rounded-3xl p-8 text-center border ${
                    score / totalQuestions >= 0.8
                        ? 'bg-emerald-50 border-emerald-100'
                        : 'bg-rose-50 border-rose-100'
                }`}>
                    <Trophy size={40} className={`mx-auto mb-3 ${
                        score / totalQuestions >= 0.8 ? 'text-emerald-500' : 'text-rose-400'
                    }`} />
                    <p className="text-2xl font-extrabold text-slate-800">
                        {score}/{totalQuestions} câu đúng
                    </p>
                    <p className={`text-sm font-bold mt-1 ${
                        score / totalQuestions >= 0.8 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                        {score / totalQuestions >= 0.8
                            ? '🎉 Xuất sắc! Bạn đã đạt yêu cầu.'
                            : 'Cố gắng hơn nhé! Bạn chưa đạt 80%.'}
                    </p>
                </div>
            )}

            {/* ---- DANH SÁCH CÂU HỎI ---- */}
            <div className="space-y-6">
                {lesson.questions.map((q, idx) => {
                    const selectedOption = answers[q.id]

                    return (
                        <div key={q.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Tiêu đề câu hỏi */}
                            <div className="px-7 pt-7 pb-4">
                                <div className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 h-7 w-7 rounded-full bg-rose-50 text-primary text-xs font-extrabold flex items-center justify-center border border-rose-100">
                                        {idx + 1}
                                    </span>
                                    <p className="text-[15px] font-bold text-slate-800 leading-snug pt-0.5">
                                        {q.text}
                                    </p>
                                </div>
                            </div>

                            {/* Các lựa chọn */}
                            <div className="px-7 pb-7 space-y-3">
                                {q.options.map((opt) => {
                                    const isSelected = selectedOption === opt.id
                                    const isCorrectOpt = submitted && opt.id === q.correctOptionId
                                    const isWrongOpt = submitted && isSelected && !isCorrectOpt

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(q.id, opt.id)}
                                            disabled={submitted}
                                            className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left text-sm transition-all
                                                ${isCorrectOpt
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                                                    : isWrongOpt
                                                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
                                                    : isSelected
                                                    ? 'bg-rose-50 border-primary text-primary font-semibold shadow-sm'
                                                    : 'bg-slate-50/60 border-slate-100 text-slate-600 hover:border-primary/30 hover:bg-rose-50/50'
                                                }
                                            `}
                                        >
                                            {/* Radio indicator */}
                                            <span className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isCorrectOpt
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : isWrongOpt
                                                    ? 'border-rose-400 bg-rose-400'
                                                    : isSelected
                                                    ? 'border-primary bg-primary'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {(isSelected || isCorrectOpt) && (
                                                    <span className="h-2 w-2 rounded-full bg-white" />
                                                )}
                                            </span>
                                            {opt.text}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ---- FOOTER NỘP BÀI ---- */}
            {!submitted && (
                <div className="sticky bottom-4 z-10">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl px-6 py-4 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-500">
                            Câu hỏi{' '}
                            <span className="text-primary">{answeredCount}</span>
                            /{totalQuestions}
                        </p>
                        <Button
                            onClick={handleSubmit}
                            disabled={answeredCount < totalQuestions}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-11 font-extrabold text-sm shadow-lg shadow-rose-200 disabled:opacity-40 active:scale-[0.98] transition-all"
                        >
                            Nộp bài kiểm tra
                        </Button>
                    </div>
                </div>
            )}

            {/* ---- THẢO LUẬN BÊN DƯỚI (theo ảnh mẫu) ---- */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    <h3 className="font-extrabold text-slate-800">Thảo luận khóa học</h3>
                </div>

                {/* Form gửi thảo luận */}
                <div className="flex gap-3 items-start">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src="/user-avatar.jpg" />
                        <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <Textarea
                            value={discussion}
                            onChange={(e) => setDiscussion(e.target.value)}
                            placeholder="Đặt câu hỏi về bài kiểm tra hoặc thảo luận với các học viên khác..."
                            className="min-h-[90px] rounded-2xl border-slate-200 focus-visible:ring-primary/20 p-4 text-sm resize-none"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setDiscussion('')}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-10 font-bold text-xs shadow-lg shadow-rose-100"
                            >
                                <Send size={14} className="mr-1.5" />
                                Gửi thảo luận
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
