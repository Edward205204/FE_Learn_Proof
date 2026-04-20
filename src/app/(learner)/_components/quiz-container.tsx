'use client'

import { useState } from 'react'
import { ClipboardList, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QuizLesson } from '../_utils/lesson-types'
import { LessonDiscussion } from './lesson-discussion'

interface QuizContainerProps {
  courseId: string
  lesson: QuizLesson
  onSubmit?: (
    answers: Record<string, string>
  ) => Promise<{ correctCount: number; totalQuestions: number; score: number } | void>
}

export function QuizContainer({ courseId, lesson, onSubmit }: QuizContainerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [resultTotal, setResultTotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const answeredCount = Object.keys(answers).length
  const totalQuestions = lesson.questions.length

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const hasClientAnswerKey = lesson.questions.every((q) => Boolean(q.correctOptionId))
      if (hasClientAnswerKey) {
        const correct = lesson.questions.filter((q) => answers[q.id] === q.correctOptionId).length
        setScore(correct)
        setResultTotal(totalQuestions)
      } else {
        const result = await onSubmit?.(answers)
        const correct = result?.correctCount ?? 0
        const total = result?.totalQuestions ?? totalQuestions
        setScore(correct)
        setResultTotal(total)
      }
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-8'>
      {/* ---- HEADER ---- */}
      <div>
        <div className='flex items-center gap-2 mb-3'>
          <span className='inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20'>
            <ClipboardList size={11} />
            {lesson.isFinalExam ? 'Kiểm tra cuối khóa' : 'Quiz'}
          </span>
        </div>
        <h1 className='text-3xl font-bold text-foreground leading-tight tracking-tight'>{lesson.title}</h1>
        <p className='text-[15px] text-muted-foreground mt-2 leading-relaxed max-w-2xl'>
          {lesson.isFinalExam
            ? 'Vui lòng hoàn thành tất cả các câu hỏi dưới đây để nhận chứng chỉ hoàn thành khóa học. Bạn cần đạt tối thiểu 80% điểm số.'
            : `Hoàn thành ${totalQuestions} câu hỏi để kiểm tra kiến thức của bạn.`}
        </p>
      </div>

      {/* ---- KẾT QUẢ sau khi nộp ---- */}
      {submitted && (
        <div
          className={`rounded-xl p-8 text-center border ${
            score / (resultTotal || totalQuestions) >= 0.8
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-primary/10 border-primary/20'
          }`}
        >
          <Trophy
            size={40}
            className={`mx-auto mb-3 ${score / (resultTotal || totalQuestions) >= 0.8 ? 'text-emerald-500' : 'text-primary'}`}
          />
          <p className='text-2xl font-bold text-foreground'>
            {score}/{resultTotal || totalQuestions} câu đúng
          </p>
          <p
            className={`text-[15px] font-medium mt-1 ${
              score / (resultTotal || totalQuestions) >= 0.8 ? 'text-emerald-600' : 'text-primary'
            }`}
          >
            {score / (resultTotal || totalQuestions) >= 0.8
              ? '🎉 Xuất sắc! Bạn đã đạt yêu cầu.'
              : 'Cố gắng hơn nhé! Bạn chưa đạt 80%.'}
          </p>
        </div>
      )}

      {/* ---- DANH SÁCH CÂU HỎI ---- */}
      <div className='space-y-6'>
        {lesson.questions.map((q, idx) => {
          const selectedOption = answers[q.id]

          return (
            <div key={q.id} className='bg-background rounded-xl border border-border shadow-sm overflow-hidden'>
              {/* Tiêu đề câu hỏi */}
              <div className='px-7 pt-7 pb-4'>
                <div className='flex gap-3 items-start'>
                  <span className='shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20'>
                    {idx + 1}
                  </span>
                  <p className='text-[16px] font-semibold text-foreground leading-snug pt-0.5'>{q.text}</p>
                </div>
              </div>

              {/* Các lựa chọn */}
              <div className='px-7 pb-7 space-y-3'>
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
                                                ${
                                                  isCorrectOpt
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
                      <span
                        className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCorrectOpt
                            ? 'border-emerald-500 bg-emerald-500'
                            : isWrongOpt
                              ? 'border-primary bg-primary'
                              : isSelected
                                ? 'border-primary bg-primary'
                                : 'border-input bg-background/50'
                        }`}
                      >
                        {(isSelected || isCorrectOpt || isWrongOpt) && (
                          <span className='h-2 w-2 rounded-full bg-background' />
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
        <div className='sticky bottom-4 z-10 pt-4'>
          <div className='bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-lg shadow-input/50 px-6 py-4 flex items-center justify-between'>
            <p className='text-[15px] font-medium text-muted-foreground'>
              Câu hỏi <span className='text-primary font-bold'>{answeredCount}</span>/{totalQuestions}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions || isSubmitting}
              className='bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 h-11 font-semibold text-[15px] disabled:opacity-50 transition-all'
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài kiểm tra'}
            </Button>
          </div>
        </div>
      )}

      <LessonDiscussion courseId={courseId} lessonId={lesson.id} />
    </div>
  )
}
