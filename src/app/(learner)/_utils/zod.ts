// src/app/(leaner)/_utils/zod.ts
import { z } from 'zod';

export const heartbeatSchema = z.object({
    lessonId: z.string(),
    lastPosition: z.number(), // Vị trí giây hiện tại (s)
    isCompleted: z.boolean().default(false)
});

export type HeartbeatValues = z.infer<typeof heartbeatSchema>;

// 1. Schema cho việc áp dụng mã giảm giá
export const couponSchema = z.object({
    couponCode: z.string().min(1, "Vui lòng nhập mã giảm giá"),
    courseId: z.string()
});



// 2. Schema cho xác nhận thanh toán cuối cùng
export const orderConfirmationSchema = z.object({
    courseId: z.string(),
    paymentMethod: z.enum(['visa_mastercard', 'momo', 'vnpay'], {
        message: "Vui lòng chọn phương thức thanh toán",
    }),
    totalAmount: z.number().positive(),
    appliedCoupon: z.string().optional(),
});

// Xuất các Type để dùng cho TypeScript an toàn
export type CouponValues = z.infer<typeof couponSchema>;
export type OrderConfirmationValues = z.infer<typeof orderConfirmationSchema>;

export const transactionSchema = z.object({
    id: z.string(),
    orderCode: z.string(),
    courseName: z.string(),
    amount: z.number(),
    paymentDate: z.string(),
    paymentMethod: z.string(),
    status: z.enum(['SUCCESS', 'PENDING', 'FAILED']), //
});

export type Transaction = z.infer<typeof transactionSchema>;