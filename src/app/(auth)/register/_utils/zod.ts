import * as z from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải từ 8 ký tự trở lên"),
  confirmPassword: z.string(),
  otpCode: z.string().length(6, "Mã OTP phải có 6 chữ số"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;