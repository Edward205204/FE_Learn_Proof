'use client'

import { useState } from 'react'
import { ClipboardList, CheckCircle2, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizQuestion {
  id: string
  content: string
  answers: { id: string; content: string }[]
}

interface LessonQuizReviewProps {
  questions: QuizQuestion[]
  lessonTitle: string
}

/**
 * Hiện phần câu hỏi trắc nghiệm tổng kết cho bài học VIDEO / BLOG.
 * Tự chấm điểm phía client — KHÔNG cần gọi API (không có đáp án đúng từ server).
 * Mục đích: tóm tắt nội dung, không tính điểm chính thức.
 */
export function LessonQuizReview({ questions, lessonTitle }: LessonQuizReviewProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length

  const handleSelect = (questionId: string, answerId: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }))
  }

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) return
    setSubmitted(true)
  }

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  if (totalQuestions === 0) return null

  return (
    <div className='mt-8 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden'>
      {/* Header — có thể collapse */}
      <button
        type='button'
        className='w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/10 transition-colors'
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary'>
            <ClipboardList className='h-5 w-5' />
          </div>
          <div>
            <p className='text-sm font-bold text-foreground'>Câu hỏi tổng kết bài học</p>
            <p className='text-xs text-muted-foreground'>{totalQuestions} câu hỏi · Kiểm tra nhanh kiến thức</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className='h-4 w-4 text-muted-foreground shrink-0' />
        ) : (
          <ChevronDown className='h-4 w-4 text-muted-foreground shrink-0' />
        )}
      </button>

      {/* Body */}
      {isExpanded && (
        <div className='px-6 pb-6 space-y-5 border-t border-primary/10 pt-4'>
          {/* Kết quả */}
          {submitted && (
            <div className='rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center dark:bg-emerald-950/20 dark:border-emerald-900/30'>
              <Trophy className='h-8 w-8 text-emerald-500 mx-auto mb-2' />
              <p className='text-base font-bold text-emerald-800 dark:text-emerald-300'>
                Bạn đã hoàn thành tổng kết bài học!
              </p>
              <p className='text-xs text-emerald-600 dark:text-emerald-400 mt-1'>
                Đã trả lời {totalQuestions}/{totalQuestions} câu hỏi
              </p>
              <Button size='sm' variant='outline' className='mt-3' onClick={handleRetry}>
                Làm lại
              </Button>
            </div>
          )}

          {/* Danh sách câu hỏi */}
          <div className='space-y-4'>
            {questions.map((q, idx) => {
              const selectedAnswer = answers[q.id]

              return (
                <div key={q.id} className='bg-background rounded-xl border border-border shadow-sm overflow-hidden'>
                  {/* Tiêu đề câu hỏi */}
                  <div className='px-5 pt-5 pb-3'>
                    <div className='flex gap-3 items-start'>
                      <span className='shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20'>
                        {idx + 1}
                      </span>
                      <p className='text-[15px] font-semibold text-foreground leading-snug pt-0.5'>{q.content}</p>
                    </div>
                  </div>

                  {/* Các lựa chọn */}
                  <div className='px-5 pb-5 space-y-2'>
                    {q.answers.map((opt) => {
                      const isSelected = selectedAnswer === opt.id
                      const isAnswered = submitted && isSelected

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(q.id, opt.id)}
                          disabled={submitted}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-[14px] transition-all
                            ${
                              isAnswered
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold dark:bg-emerald-950/20 dark:border-emerald-700 dark:text-emerald-300'
                                : isSelected
                                  ? 'bg-primary/10 border-primary text-primary font-semibold shadow-sm'
                                  : 'bg-muted/30 border-border text-foreground/90 hover:border-primary/50 hover:bg-primary/5'
                            }`}
                        >
                          <span
                            className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isAnswered
                                ? 'border-emerald-500 bg-emerald-500'
                                : isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-input bg-background/50'
                            }`}
                          >
                            {(isSelected || isAnswered) && <span className='h-2 w-2 rounded-full bg-background' />}
                          </span>
                          {opt.content}
                          {isAnswered && <CheckCircle2 className='ml-auto h-4 w-4 text-emerald-500 shrink-0' />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nút nộp */}
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions}
              className='w-full h-11 font-semibold rounded-xl'
            >
              Nộp câu trả lời ({answeredCount}/{totalQuestions})
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
