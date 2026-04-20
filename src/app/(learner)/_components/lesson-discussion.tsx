'use client'

import { useMemo, useState } from 'react'
import { Loader2, MessageSquare, Pin, Reply, Send } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/store/auth.store'

import {
  useCreateLessonCommentMutation,
  useCreateLessonReplyMutation,
  useLessonCommentsQuery
} from '../_hooks/use-interaction'

interface LessonDiscussionProps {
  courseId: string
  lessonId: string
}

function getInitials(name?: string | null) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}

export function LessonDiscussion({ courseId, lessonId }: LessonDiscussionProps) {
  const user = useAuthStore((state) => state.user)
  const [commentInput, setCommentInput] = useState('')
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})

  const { data, isLoading, isError } = useLessonCommentsQuery(courseId, lessonId)
  const createCommentMutation = useCreateLessonCommentMutation(courseId, lessonId)
  const createReplyMutation = useCreateLessonReplyMutation(courseId, lessonId)

  const comments = useMemo(() => data?.data ?? [], [data?.data])

  const handleSendComment = async () => {
    const content = commentInput.trim()
    if (!content) return
    await createCommentMutation.mutateAsync(content)
    setCommentInput('')
  }

  const handleSendReply = async (commentId: string) => {
    const content = replyDrafts[commentId]?.trim()
    if (!content) return
    await createReplyMutation.mutateAsync({ commentId, content })
    setReplyDrafts((prev) => ({ ...prev, [commentId]: '' }))
    setReplyTarget(null)
  }

  return (
    <div className='bg-background rounded-xl border border-border shadow-sm p-6 md:p-8 space-y-6'>
      <div className='flex items-center gap-2'>
        <MessageSquare size={18} className='text-primary' />
        <div>
          <h3 className='font-bold text-foreground text-lg'>Thảo luận bài học</h3>
          <p className='text-sm text-muted-foreground'>Trao đổi theo dạng 1 bình luận - nhiều phản hồi.</p>
        </div>
      </div>

      <div className='flex gap-4 items-start'>
        <Avatar className='h-10 w-10 shrink-0'>
          <AvatarImage src={user?.avatar || undefined} />
          <AvatarFallback className='bg-muted text-muted-foreground font-bold text-sm'>
            {getInitials(user?.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-3'>
          <Textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder='Đặt câu hỏi hoặc chia sẻ suy nghĩ về bài học này...'
            className='min-h-[100px] rounded-xl border-input bg-background focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary p-4 text-[15px] resize-none'
          />
          <div className='flex justify-end'>
            <Button
              onClick={handleSendComment}
              disabled={!commentInput.trim() || createCommentMutation.isPending}
              className='bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium text-sm transition-colors'
            >
              <Send size={16} className='mr-2' />
              {createCommentMutation.isPending ? 'Đang gửi...' : 'Gửi thảo luận'}
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className='flex items-center justify-center py-10 text-muted-foreground'>
          <Loader2 className='h-5 w-5 animate-spin' />
        </div>
      )}

      {isError && (
        <div className='rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
          Không thể tải thảo luận của bài học này.
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className='rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground'>
          Chưa có thảo luận nào. Hãy là người mở đầu.
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <div className='space-y-4'>
          {comments.map((comment) => (
            <div key={comment.id} className='rounded-xl border border-border bg-card p-5 space-y-4'>
              <div className='flex items-start gap-3'>
                <Avatar className='h-10 w-10 shrink-0'>
                  <AvatarImage src={comment.user?.avatar || undefined} />
                  <AvatarFallback className='bg-muted text-muted-foreground font-bold text-sm'>
                    {getInitials(comment.user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-semibold text-foreground'>{comment.user?.fullName || 'Người dùng'}</p>
                    <span className='text-xs text-muted-foreground'>{formatRelativeTime(comment.createdAt)}</span>
                    {comment.isPinned && (
                      <span className='inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary'>
                        <Pin className='h-3 w-3' />
                        Đã ghim
                      </span>
                    )}
                  </div>
                  <p className='mt-2 whitespace-pre-line wrap-break-word text-sm leading-6 text-foreground/90'>
                    {comment.content}
                  </p>
                  <div className='mt-3'>
                    <button
                      type='button'
                      onClick={() => setReplyTarget((prev) => (prev === comment.id ? null : comment.id))}
                      className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80'
                    >
                      <Reply className='h-4 w-4' />
                      Phản hồi
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className='space-y-3 pl-4 md:pl-12'>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className='rounded-xl bg-muted/40 px-4 py-3'>
                      <div className='flex items-start gap-3'>
                        <Avatar className='h-8 w-8 shrink-0'>
                          <AvatarImage src={reply.user?.avatar || undefined} />
                          <AvatarFallback className='bg-background text-muted-foreground text-xs font-bold'>
                            {getInitials(reply.user?.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <p className='text-sm font-semibold text-foreground'>
                              {reply.user?.fullName || 'Người dùng'}
                            </p>
                            <span className='text-xs text-muted-foreground'>{formatRelativeTime(reply.createdAt)}</span>
                          </div>
                          <p className='mt-1 whitespace-pre-line wrap-break-word text-sm leading-6 text-foreground/85'>
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyTarget === comment.id && (
                <div className='pl-4 md:pl-12'>
                  <div className='rounded-xl border border-border bg-background p-4 space-y-3'>
                    <Textarea
                      value={replyDrafts[comment.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value
                        }))
                      }
                      placeholder='Viết phản hồi của bạn...'
                      className='min-h-[90px] resize-none'
                    />
                    <div className='flex justify-end gap-2'>
                      <Button type='button' variant='outline' onClick={() => setReplyTarget(null)}>
                        Hủy
                      </Button>
                      <Button
                        type='button'
                        onClick={() => handleSendReply(comment.id)}
                        disabled={!replyDrafts[comment.id]?.trim() || createReplyMutation.isPending}
                      >
                        {createReplyMutation.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
