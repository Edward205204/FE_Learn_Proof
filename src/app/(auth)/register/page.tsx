"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import  GoogleIcon  from "@/components/common/google-icon"; // Giả sử bạn có component này
import { RegisterInput, RegisterSchema } from "./_utils/zod";
import { useCountdown } from "@/hooks/use-countdown";


export default function RegisterPage() {    
  const { countdown, start: startCountdown } = useCountdown(60);

  // 1. Khởi tạo Form
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "", email: "", password: "", confirmPassword: "", otpCode: "",
    },
  });

  const handleSendOtp = () => {
    const email = form.getValues("email");
    if (!email || form.getFieldState("email").invalid) {
      form.setError("email", { message: "Vui lòng nhập email hợp lệ trước khi gửi OTP" });
      return;
    }
    // Giả lập gọi API gửi OTP
    startCountdown();
    console.log("Sending OTP to:", email);
  };

  // 3. Xử lý Submit
  async function onSubmit(values: RegisterInput) {
    console.log("Submit Data:", values);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      // Xử lý kết quả sau khi gọi API...
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm">
        <h1 className="text-2xl font-bold text-foreground text-center mb-6">Đăng ký tài khoản</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Họ và Tên */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Họ và Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyen Van A" className="bg-input rounded-md focus:ring-ring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" className="bg-input rounded-md focus:ring-ring" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mật khẩu & Xác nhận mật khẩu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-input rounded-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Xác nhận</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="bg-input rounded-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* OTP Section */}
            <FormField
              control={form.control}
              name="otpCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Mã OTP</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="123456" className="bg-input rounded-md flex-1" {...field} />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="secondary"
                      disabled={countdown > 0}
                      onClick={handleSendOtp}
                      className="bg-secondary rounded-md whitespace-nowrap min-w-[100px]"
                    >
                      {countdown > 0 ? `${countdown}s` : "Gửi OTP"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-6 text-lg font-semibold hover:bg-primary/90 transition-colors">
              Đăng ký ngay
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Hoặc tiếp tục với</span>
          </div>
        </div>

        {/* Google Login UI Only */}
        <Button variant="outline" className="w-full border-border rounded-md py-6 flex gap-3 items-center hover:bg-accent transition-all">
          <GoogleIcon size={24} />
          <span>Đăng nhập với Google</span>
        </Button>
      </div>
    </div>
  );
}