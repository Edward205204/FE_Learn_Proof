// src/app/(leaner)/_utils/zod.ts
import { z } from 'zod'

export const heartbeatSchema = z.object({
  lessonId: z.string(),
  lastPosition: z.number(), // Vị trí giây hiện tại (s)
  isCompleted: z.boolean().default(false)
})

export type HeartbeatValues = z.infer<typeof heartbeatSchema>

// 1. Schema cho việc áp dụng mã giảm giá
export const couponSchema = z.object({
  couponCode: z.string().min(1, 'Vui lòng nhập mã giảm giá'),
  courseId: z.string()
})

// 2. Schema cho xác nhận thanh toán cuối cùng
export const orderConfirmationSchema = z.object({
  courseId: z.string(),
  paymentMethod: z.enum(['visa_mastercard', 'momo', 'vnpay'], {
    message: 'Vui lòng chọn phương thức thanh toán'
  }),
  totalAmount: z.number().positive(),
  appliedCoupon: z.string().optional()
})

// Xuất các Type để dùng cho TypeScript an toàn
export type CouponValues = z.infer<typeof couponSchema>
export type OrderConfirmationValues = z.infer<typeof orderConfirmationSchema>

export const transactionSchema = z.object({
  id: z.string(),
  orderCode: z.string(),
  courseName: z.string(),
  amount: z.number(),
  paymentDate: z.string(),
  paymentMethod: z.string(),
  status: z.enum(['SUCCESS', 'PENDING', 'FAILED']) //
})

export type Transaction = z.infer<typeof transactionSchema>

export const certificateSchema = z.object({
  courseId: z.string().min(1, 'ID khóa học là bắt buộc'),
  courseName: z.string().min(1, 'Tên khóa học không được để trống'),
  learnerName: z.string().min(1, 'Tên học viên không được để trống'),

  // Logic quan trọng nhất: Ràng buộc Progress phải đạt đúng 100%
  progress: z.number().refine((val) => val === 100, {
    message: 'Tiến độ học tập phải đạt 100% để kích hoạt quá trình cấp chứng chỉ trên Blockchain'
  }),

  // Dữ liệu sau khi tạo Hash thành công (Optional khi bắt đầu, Required khi lưu trữ)
  blockchainHash: z.string().optional(),
  txId: z.string().optional(), // Transaction ID trên Blockchain
  issueDate: z.string().optional()
})

export type Certificate = z.infer<typeof certificateSchema>
