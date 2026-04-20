'use client'

import { useState } from 'react'
import { Star, MessageCircle, Send, CornerDownRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } from '@/app/(learner)/_hooks/use-course'
import { CourseDetailResponse, CourseReview } from '@/schemas/course.schema'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useAuthStore } from '@/store/auth.store'
import { Trash2, Edit2, X } from 'lucide-react'

interface CourseReviewsProps {
  courseId: string
  isEnrolled: boolean
  userReview?: CourseReview | null
  reviews: CourseDetailResponse['reviews']
  instructorName: string
  instructorAvatar?: string | null
}

export function CourseReviews({ 
  courseId, 
  isEnrolled, 
  userReview: initialUserReview,
  reviews, 
  instructorName,
  instructorAvatar 
}: CourseReviewsProps) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isWriting, setIsWriting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const submitMutation = useSubmitReviewMutation(courseId)
  const updateMutation = useUpdateReviewMutation(courseId)
  const deleteMutation = useDeleteReviewMutation(courseId)

  const handleSubmit = async () => {
    if (!comment.trim()) return
    if (editingId) {
      await updateMutation.mutateAsync({ rating, comment })
    } else {
      await submitMutation.mutateAsync({ rating, comment })
    }
    setComment('')
    setEditingId(null)
    setIsWriting(false)
  }

  const handleEdit = (review: CourseReview) => {
    setEditingId(review.id)
    setRating(review.rating)
    setComment(review.comment || '')
    setIsWriting(true)
    window.scrollTo({ top: document.getElementById('review-form')?.offsetTop ? document.getElementById('review-form')!.offsetTop - 100 : 0, behavior: 'smooth' })
  }

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
      await deleteMutation.mutateAsync()
    }
  }

  const userReview = initialUserReview || reviews.find(r => r.user.id === user?.id)
  const isMyReview = (review: CourseReview) => review.user.id === user?.id || review.id === userReview?.id

  return (
    <section className='space-y-10'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center'>
            <Star size={16} className='text-rose-600' />
          </div>
          <h2 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider'>
            Đánh giá học viên
          </h2>
        </div>

        {isEnrolled && !isWriting && !userReview && (
          <Button 
            onClick={() => setIsWriting(true)}
            className='bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-6 h-11 font-black shadow-lg shadow-rose-200 dark:shadow-none'
          >
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Write Review Section */}
      {isWriting && (
        <div id='review-form' className='bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-rose-100 dark:border-rose-900/30 shadow-xl animate-in fade-in zoom-in-95 duration-300'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='font-black text-lg text-slate-800 dark:text-white'>
                {editingId ? 'Chỉnh sửa đánh giá của bạn' : 'Cảm nhận của bạn về khóa học?'}
              </h3>
              <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className='transition-transform hover:scale-125 focus:outline-none'
                  >
                    <Star
                      size={28}
                      fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                      strokeWidth={2}
                      className={cn(
                        'transition-colors',
                        (hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Hãy chia sẻ những điều bạn thích hoặc cần cải thiện của khóa học này...'
              className='min-h-[140px] rounded-3xl p-5 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-rose-500 font-medium'
            />

            <div className='flex justify-end gap-3'>
              <Button 
                variant='ghost' 
                onClick={() => {
                  setIsWriting(false)
                  setEditingId(null)
                  setComment('')
                  setRating(5)
                }}
                className='rounded-xl font-bold text-slate-500'
              >
                Hủy bỏ
              </Button>
              <Button 
                disabled={!comment.trim() || submitMutation.isPending || updateMutation.isPending}
                onClick={handleSubmit}
                className='bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 h-11 font-black'
              >
                {submitMutation.isPending || updateMutation.isPending ? 'Đang gửi...' : editingId ? 'Cập nhật' : 'Đăng đánh giá'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className='space-y-6'>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className='group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all'
            >
              <div className='flex items-start justify-between mb-6'>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-12 w-12 border-2 border-slate-50 shadow-sm'>
                    <AvatarImage src={review.user.avatar || undefined} />
                    <AvatarFallback className='font-black bg-rose-50 text-rose-600'>
                      {review.user.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='font-black text-slate-900 dark:text-white leading-none mb-1.5'>
                      {review.user.fullName}
                    </h4>
                    <div className='flex items-center gap-3'>
                      <div className='flex gap-0.5'>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            fill={s <= review.rating ? 'currentColor' : 'none'}
                            strokeWidth={s <= review.rating ? 0 : 2}
                            className={s <= review.rating ? 'text-amber-400' : 'text-slate-200'}
                          />
                        ))}
                      </div>
                      <span className='text-[10px] font-bold text-slate-400'>
                        {format(new Date(review.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                      </span>
                    </div>
                  </div>
                </div>

                {isMyReview(review) && (
                  <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(review)}
                      className='h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5'
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={handleDelete}
                      className='h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>

              <div className='relative'>
                <p className='text-slate-600 dark:text-slate-400 font-medium leading-[1.7]'>
                  {review.comment}
                </p>
                
                {/* Instructor Reply */}
                {review.instructorReply && (
                  <div className='mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-4'>
                    <div className='shrink-0 pt-1'>
                      <CornerDownRight size={20} className='text-rose-500' />
                    </div>
                    <div className='flex-1 space-y-3'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8 border border-rose-100'>
                          <AvatarImage src={instructorAvatar || undefined} />
                          <AvatarFallback className='bg-rose-600 text-white text-[10px] font-black'>
                            INST
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-[11px] font-black text-slate-900 dark:text-white'>
                            {instructorName} 
                            <span className='ml-2 text-[9px] text-white bg-rose-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter'>Giảng viên</span>
                          </p>
                          {review.instructorReplyAt && (
                             <p className='text-[9px] font-bold text-slate-400'>
                               {format(new Date(review.instructorReplyAt), 'dd MMMM, yyyy', { locale: vi })}
                             </p>
                          )}
                        </div>
                      </div>
                      <p className='text-sm text-slate-600 dark:text-slate-300 font-bold bg-rose-50/30 dark:bg-rose-900/10 p-5 rounded-2xl rounded-tl-none border-l-2 border-rose-500 leading-relaxed italic'>
                        &quot;{review.instructorReply}&quot;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-20 bg-slate-50/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800'>
             <MessageCircle size={40} className='mx-auto text-slate-200 mb-4' />
             <p className='text-slate-400 font-bold'>Chưa có đánh giá nào cho khóa học này.</p>
          </div>
        )}
      </div>
    </section>
  )
}
