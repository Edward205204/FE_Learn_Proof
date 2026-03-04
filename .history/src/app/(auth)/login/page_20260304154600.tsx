"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginInput, LoginSchema } from "./_utils/zod";
import GoogleIcon from "@/components/common/google-icon";

export default function LoginPage() {
  // 1. Khởi tạo Form
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Xử lý Submit gọi API
  async function onSubmit(values: LoginInput) {
    console.log("Login Data:", values);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        // Xử lý logic khi đăng nhập thành công (Lưu token, redirect...)
        console.log("Đăng nhập thành công!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-card p-8 rounded-lg border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Chào mừng trở lại</h1>
          <p className="text-muted-foreground text-sm mt-2">Vui lòng nhập thông tin để truy cập khóa học</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Trường Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      className="bg-input border-border rounded-md focus:ring-ring focus:border-ring" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Trường Mật khẩu */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-foreground font-medium">Mật khẩu</FormLabel>
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-input border-border rounded-md focus:ring-ring" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Nút Đăng nhập chính */}
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground rounded-md py-6 text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Đăng nhập
            </Button>
          </form>
        </Form>

        {/* Ngăn cách hoặc */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">Hoặc đăng nhập với</span>
          </div>
        </div>

        {/* Nút Google (UI Only) */}
        <Button 
          variant="outline" 
          type="button"
          className="w-full border-border rounded-md py-6 flex gap-3 items-center hover:bg-accent hover:text-accent-foreground transition-all"
        >
          <GoogleIcon size={22} />
          <span className="font-medium">Google</span>
        </Button>

        {/* Link chuyển sang Đăng ký */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}