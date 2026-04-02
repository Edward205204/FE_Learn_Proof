'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Trash2, ChevronRight, ShoppingCart } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAddToCartMutation } from '@/app/(learner)/_hooks/use-cart'
import { useWishlistQuery, useRemoveFromWishlistMutation } from '../_hooks/use-wishlist'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { data: wishlistData, isLoading } = useWishlistQuery()
  const removeMutation = useRemoveFromWishlistMutation()
  const addCartMutation = useAddToCartMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const wishlistItems = useMemo(() => wishlistData || [], [wishlistData])

  const deletingCourse = useMemo(
    () => wishlistItems.find((item) => item.courseId === deletingId)?.course,
    [wishlistItems, deletingId]
  )

  const handleDeleteWishlist = () => {
    if (deletingId) {
      removeMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null)
          toast.success('Đã xóa khóa học khỏi danh sách yêu thích')
        }
      })
    }
  }


  if (isLoading) {
    return (
      <div className='container mx-auto py-10 px-6 max-w-[1200px]' suppressHydrationWarning>
        <div className='h-[400px] flex items-center justify-center'>
          <div className='w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin' />
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10 px-6 max-w-[1200px]' suppressHydrationWarning>
      <nav className='flex items-center gap-2 text-[12px] font-black tracking-widest uppercase text-slate-400 mb-8 mt-2'>
        <Link href='/' className='hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className='text-[oklch(0.577_0.245_27.325)]'>Yêu thích</span>
      </nav>
      <h1 className='text-3xl font-bold mb-8 text-[oklch(0.141_0.005_285.823)] dark:text-white'>
        Khóa học Yêu thích ({wishlistItems.length})
      </h1>

      {wishlistItems.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className='group relative rounded-xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] overflow-hidden shadow-sm hover:shadow-md transition-all'
            >
              {/* Image */}
              <div className='aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800'>
                <Image
                  src={item.course.thumbnail || ''}
                  alt={item.course.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <button
                  onClick={() => setDeletingId(item.courseId)}
                  className='absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all z-10 shadow-sm'
                  title='Xóa khỏi yêu thích'
                  disabled={removeMutation.isPending}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content */}
              <div className='p-5 flex flex-col h-[280px]'>
                <div>
                  <h3 className='font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white mb-2 group-hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
                    <Link href={`/courses/${item.course.id}`}>{item.course.title}</Link>
                  </h3>
                  <p className='text-sm text-[oklch(0.552_0.016_285.938)] mb-3'>{item.course.creator.fullName}</p>

                  <div className='flex items-center gap-2 mb-4'>
                    <span className='font-bold text-[oklch(0.577_0.245_27.325)]'>5.0</span>
                    <div className='flex text-[oklch(0.577_0.245_27.325)]'>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill='currentColor' />
                      ))}
                    </div>
                  </div>

                  <div className='flex items-center gap-4 text-xs text-[oklch(0.552_0.016_285.938)] mb-4'>
                    <div className='flex items-center gap-1 font-black uppercase tracking-tighter'>
                      {item.course.level}
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between mt-auto pt-4 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]'>
                  <div>
                    <span className='text-xl font-bold text-gray-900 dark:text-white block'>
                      {item.course.price.toLocaleString('vi-VN')} đ
                    </span>
                    {item.course.originalPrice && item.course.originalPrice > item.course.price && (
                      <span className='text-sm text-[oklch(0.552_0.016_285.938)] line-through'>
                        {item.course.originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addCartMutation.mutate(item.courseId)}
                    disabled={addCartMutation.isPending}
                    className='flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50'
                  >
                    <ShoppingCart size={18} />
                    {addCartMutation.isPending ? '...' : 'Thêm giỏ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-20 bg-gray-50 dark:bg-[oklch(0.21_0.006_285.885)] rounded-2xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]'>
          <p className='text-[oklch(0.552_0.016_285.938)] mb-4'>
            Bạn chưa có khóa học nào trong danh sách yêu thích.
          </p>
          <Link
            href='/courses'
            className='inline-flex px-6 py-3 bg-[oklch(0.577_0.245_27.325)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
          >
            Khám phá ngay
          </Link>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khóa học{' '}
              <span className='font-semibold text-foreground'>&quot;{deletingCourse?.title}&quot;</span> khỏi danh sách
              yêu thích không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex sm:justify-end gap-2'>
            <Button variant='outline' onClick={() => setDeletingId(null)}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleDeleteWishlist} disabled={removeMutation.isPending}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
