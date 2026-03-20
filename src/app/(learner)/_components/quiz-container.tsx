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
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
                        <ClipboardList size={11} />
                        {lesson.isFinalExam ? 'Kiểm tra cuối khóa' : 'Quiz'}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
                    {lesson.title}
                </h1>
                <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed max-w-2xl">
                    {lesson.isFinalExam
                        ? 'Vui lòng hoàn thành tất cả các câu hỏi dưới đây để nhận chứng chỉ hoàn thành khóa học. Bạn cần đạt tối thiểu 80% điểm số.'
                        : `Hoàn thành ${totalQuestions} câu hỏi để kiểm tra kiến thức của bạn.`}
                </p>
            </div>

            {/* ---- KẾT QUẢ sau khi nộp ---- */}
            {submitted && (
                <div className={`rounded-xl p-8 text-center border ${
                    score / totalQuestions >= 0.8
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-primary/10 border-primary/20'
                }`}>
                    <Trophy size={40} className={`mx-auto mb-3 ${
                        score / totalQuestions >= 0.8 ? 'text-emerald-500' : 'text-primary'
                    }`} />
                    <p className="text-2xl font-bold text-foreground">
                        {score}/{totalQuestions} câu đúng
                    </p>
                    <p className={`text-[15px] font-medium mt-1 ${
                        score / totalQuestions >= 0.8 ? 'text-emerald-600' : 'text-primary'
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
                        <div key={q.id} className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                            {/* Tiêu đề câu hỏi */}
                            <div className="px-7 pt-7 pb-4">
                                <div className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
                                        {idx + 1}
                                    </span>
                                    <p className="text-[16px] font-semibold text-foreground leading-snug pt-0.5">
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
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-[15px] transition-all
                                                ${isCorrectOpt
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                                                    : isWrongOpt
                                                    ? 'bg-primary/10 border-primary/50 text-foreground font-semibold'
                                                    : isSelected
                                                    ? 'bg-primary/10 border-primary text-primary font-semibold shadow-sm'
                                                    : 'bg-muted/30 border-border text-foreground/90 hover:border-primary/50 hover:bg-primary/5'
                                                }
                                            `}
                                        >
                                            {/* Radio indicator */}
                                            <span className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isCorrectOpt
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : isWrongOpt
                                                    ? 'border-primary bg-primary'
                                                    : isSelected
                                                    ? 'border-primary bg-primary'
                                                    : 'border-input bg-background/50'
                                            }`}>
                                                {(isSelected || isCorrectOpt || isWrongOpt) && (
                                                    <span className="h-2 w-2 rounded-full bg-background" />
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
                <div className="sticky bottom-4 z-10 pt-4">
                    <div className="bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-lg shadow-input/50 px-6 py-4 flex items-center justify-between">
                        <p className="text-[15px] font-medium text-muted-foreground">
                            Câu hỏi{' '}
                            <span className="text-primary font-bold">{answeredCount}</span>
                            /{totalQuestions}
                        </p>
                        <Button
                            onClick={handleSubmit}
                            disabled={answeredCount < totalQuestions}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 h-11 font-semibold text-[15px] disabled:opacity-50 transition-all"
                        >
                            Nộp bài kiểm tra
                        </Button>
                    </div>
                </div>
            )}

            {/* ---- THẢO LUẬN BÊN DƯỚI (theo ảnh mẫu) ---- */}
            <div className="bg-background rounded-xl border border-border shadow-sm p-8 space-y-6 mt-12">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    <h3 className="font-bold text-foreground text-lg">Thảo luận bài kiểm tra</h3>
                </div>

                {/* Form gửi thảo luận */}
                <div className="flex gap-4 items-start">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src="/user-avatar.jpg" />
                        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-sm">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <Textarea
                            value={discussion}
                            onChange={(e) => setDiscussion(e.target.value)}
                            placeholder="Đặt câu hỏi về bài kiểm tra hoặc thảo luận với các học viên khác..."
                            className="min-h-[100px] rounded-xl border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary p-4 text-[15px] resize-none"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setDiscussion('')}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium text-sm transition-colors"
                            >
                                <Send size={16} className="mr-2" />
                                Gửi thảo luận
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
