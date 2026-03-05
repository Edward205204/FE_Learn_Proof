import * as z from 'zod'

const PasswordSchema = z
  .string()
  .min(1, 'Mật khẩu là bắt buộc')
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .max(100, 'Mật khẩu quá dài')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ viết hoa')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
  .regex(/[^A-Za-z0-9]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt')

export const LoginSchema = z
  .object({
    email: z.string().trim().min(1, 'Email là bắt buộc').max(255, 'Email quá dài').email('Email không đúng định dạng'),

    password: PasswordSchema
  })
  .strict()

export const RegisterSchema = z
  .object({
    email: z.string().trim().min(1, 'Email là bắt buộc').max(255, 'Email quá dài').email('Email không đúng định dạng'),
    fullName: z.string().trim().min(1, 'Tên là bắt buộc').max(255, 'Tên quá dài'),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
    code: z.string().trim().length(6, 'Mã otp không đúng định dạng')
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type RegisterInput = z.infer<typeof RegisterSchema>

export type LoginInput = z.infer<typeof LoginSchema>
