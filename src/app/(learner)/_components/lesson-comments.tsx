'use client'

import { useState } from 'react'
import { MoreVertical, MessageSquare, Pencil, Trash2, Reply } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/store/auth.store'
import {
  useLessonCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyMutation,
  useUpdateReplyMutation,
  useDeleteReplyMutation
} from '../../(cms)/_hooks/use-interaction'
import { DiscussionItem, DiscussionReply } from '../../(cms)/_utils/zod'
import { cn } from '@/lib/utils'

interface LessonCommentsProps {
  courseId: string
  lessonId: string
  isEnrolled: boolean
}

export function LessonComments({ courseId, lessonId, isEnrolled }: LessonCommentsProps) {
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)
  const [content, setContent] = useState('')

  const { data, isLoading } = useLessonCommentsQuery(courseId, lessonId, page, 100)
  const createMutation = useCreateCommentMutation(courseId, lessonId)

  const handleSubmit = () => {
    if (!content.trim() || !isEnrolled) return
    createMutation.mutate(content, {
      onSuccess: () => setContent('')
    })
  }

  return (
    <div className='space-y-10'>
      {/* Input Section */}
      <div className='flex gap-4 items-start'>
        <Avatar className='h-10 w-10 shrink-0 border border-border shadow-sm'>
          <AvatarImage src={user?.avatar || undefined} />
          <AvatarFallback className='bg-muted text-muted-foreground font-bold text-sm'>
            {user?.fullName?.substring(0, 1).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-3'>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isEnrolled || createMutation.isPending}
            placeholder={isEnrolled ? 'Bạn thắc mắc điều gì về bài học này?' : 'Đăng nhập và mua khóa học để thảo luận'}
            className='min-h-[100px] rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary/20 p-4 text-[15px] resize-none shadow-sm'
          />
          <div className='flex justify-end'>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || !isEnrolled || createMutation.isPending}
              className='rounded-full px-8 font-black text-xs uppercase tracking-widest h-11 bg-slate-900 dark:bg-white dark:text-slate-950 hover:opacity-90 transition-all'
            >
              <MessageSquare className='w-4 h-4 mr-2' />
              Gửi thảo luận
            </Button>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className='space-y-6'>
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-24 w-full bg-muted/40 animate-pulse rounded-2xl' />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((item) => (
            <CommentItem key={item.id} item={item} currentUserId={user?.id} isEnrolled={isEnrolled} />
          ))
        ) : (
          <div className='text-center py-12 text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-border'>
            <p className='text-sm font-medium'>Chưa có thảo luận nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CommentItem({
  item,
  currentUserId,
  isEnrolled
}: {
  item: DiscussionItem
  currentUserId?: string
  isEnrolled: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(item.content)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const updateMutation = useUpdateCommentMutation()
  const deleteMutation = useDeleteCommentMutation()
  const replyMutation = useReplyMutation()

  const handleUpdate = () => {
    if (!editContent.trim()) return
    updateMutation.mutate(
      { commentId: item.id, content: editContent },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xoá thảo luận này?')) {
      deleteMutation.mutate(item.id)
    }
  }

  const handleReply = () => {
    if (!replyContent.trim()) return
    replyMutation.mutate(
      { commentId: item.id, content: replyContent },
      {
        onSuccess: () => {
          setIsReplying(false)
          setReplyContent('')
        }
      }
    )
  }

  const isOwner = item.userId === currentUserId

  return (
    <div className='group'>
      <div className='flex gap-4'>
        <Avatar className='h-10 w-10 shrink-0 border border-border'>
          <AvatarImage src={item.user?.avatar || undefined} />
          <AvatarFallback>{item.user?.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1 space-y-1.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-[14px] leading-none'>{item.user?.fullName}</span>
              <span className='text-[11px] text-muted-foreground leading-none'>·</span>
              <span className='text-[11px] text-muted-foreground font-medium leading-none'>
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}
              </span>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity'>
                    <MoreVertical className='h-3.5 w-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='rounded-xl border-border/50'>
                  <DropdownMenuItem onClick={() => setIsEditing(true)} className='gap-2 text-xs font-bold'>
                    <Pencil className='h-3.5 w-3.5' /> Sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className='gap-2 text-xs font-bold text-destructive hover:!text-destructive'>
                    <Trash2 className='h-3.5 w-3.5' /> Xoá
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className='space-y-3 mt-2'>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className='min-h-[80px] rounded-xl text-sm p-3'
              />
              <div className='flex justify-end gap-2'>
                <Button variant='ghost' size='sm' onClick={() => setIsEditing(false)} className='text-xs h-8 font-bold'>Hủy</Button>
                <Button size='sm' onClick={handleUpdate} className='text-xs h-8 font-bold'>Lưu thay đổi</Button>
              </div>
            </div>
          ) : (
            <>
              <p className='text-[15px] leading-relaxed text-foreground/90 font-medium whitespace-pre-line'>{item.content}</p>
              <div className='flex items-center gap-4 mt-2'>
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  disabled={!isEnrolled}
                  className='text-[12px] font-black text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5'
                >
                  <Reply className='w-3.5 h-3.5' />
                  TRẢ LỜI
                </button>
              </div>
            </>
          )}

          {isReplying && (
            <div className='mt-4 space-y-3 pl-4 border-l-2 border-primary/10'>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder='Nhập phản hồi của bạn...'
                className='min-h-[80px] rounded-xl text-sm p-3'
              />
              <div className='flex justify-end gap-2'>
                <Button variant='ghost' size='sm' onClick={() => setIsReplying(false)} className='text-xs h-8 font-bold'>Hủy</Button>
                <Button size='sm' onClick={handleReply} className='text-xs h-8 font-bold'>Gửi trả lời</Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {item.replies && item.replies.length > 0 && (
            <div className='mt-5 space-y-5 pl-4 border-l border-slate-100 dark:border-slate-800'>
              {item.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} currentUserId={currentUserId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReplyItem({ reply, currentUserId }: { reply: DiscussionReply; currentUserId?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)

  const updateMutation = useUpdateReplyMutation()
  const deleteMutation = useDeleteReplyMutation()

  const handleUpdate = () => {
    if (!editContent.trim()) return
    updateMutation.mutate(
      { replyId: reply.id, content: editContent },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xoá phản hồi này?')) {
      deleteMutation.mutate(reply.id)
    }
  }

  const isOwner = reply.userId === currentUserId

  return (
    <div className='group/reply-item flex gap-3'>
      <Avatar className='h-8 w-8 shrink-0 border border-border'>
        <AvatarImage src={reply.user?.avatar || undefined} />
        <AvatarFallback className='text-[10px]'>{reply.user?.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-1'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-[13px]'>{reply.user?.fullName}</span>
            <span className='text-[10px] text-muted-foreground font-medium'>
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}
            </span>
          </div>
          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='h-6 w-6 text-muted-foreground opacity-0 group-hover/reply-item:opacity-100 transition-opacity'>
                  <MoreVertical className='h-3 w-3' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='rounded-lg text-[11px]'>
                <DropdownMenuItem onClick={() => setIsEditing(true)} className='gap-1.5 font-bold'>
                  <Pencil className='h-3 w-3' /> Sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className='gap-1.5 font-bold text-destructive'>
                  <Trash2 className='h-3 w-3' /> Xoá
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className='space-y-2 mt-1'>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='min-h-[60px] rounded-lg text-sm p-2.5'
            />
            <div className='flex justify-end gap-1.5'>
              <Button variant='ghost' size='sm' onClick={() => setIsEditing(false)} className='text-[10px] h-7 font-bold'>Hủy</Button>
              <Button size='sm' onClick={handleUpdate} className='text-[10px] h-7 font-bold'>Lưu</Button>
            </div>
          </div>
        ) : (
          <p className='text-[14px] text-foreground/80 leading-relaxed font-medium'>{reply.content}</p>
        )}
      </div>
    </div>
  )
}
