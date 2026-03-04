"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginInput, LoginSchema } from "./_utils/zod";
import GoogleIcon from "@/components/common/google-icon";

export default function LoginPage() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. HEADER: Logo bên trái, Nút điều hướng bên phải */}
      <header className="fixed top-0 w-full h-20 px-6 md:px-12 flex items-center justify-between z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none text-foreground">
            LEARN PROOF
          </h1>
          <span className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mt-1">
            LEARN SMART. PROVE IT.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="font-bold text-sm hidden sm:flex">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button variant="default" asChild className="bg-primary text-primary-foreground font-bold text-sm rounded-md px-6">
            <Link href="/register">Đăng ký</Link>
          </Button>
        </div>
      </header>

      {/* 2. MAIN CONTENT: Split Screen */}
      <main className="flex-1 flex pt-20">
        {/* PANEL TRÁI: Sử dụng Ảnh 3 làm nền */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#8e5c54]">
          {/* Lớp ảnh nền trừu tượng (Ảnh 3) */}
          <div 
            className="absolute inset-0 w-full h-full opacity-20 grayscale brightness-150"
            style={{ 
              backgroundImage: `url('/path-to-your-abstract-image-3.jpg')`, // Link ảnh 3 của bạn
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Lớp phủ Gradient để hài hòa với màu Logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e5c54]/80 via-[#8e5c54]/90 to-black/40" />

          {/* Nội dung text trên nền ảnh */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-16 text-center">
             <div className="max-w-md space-y-6">
                <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                  Nâng tầm kiến thức của bạn
                </h2>
                <div className="w-20 h-1.5 bg-white mx-auto rounded-full" />
                <p className="text-white/80 text-lg font-medium">
                  Hệ thống quản lý học tập thông minh giúp bạn chứng minh năng lực thực tế.
                </p>
             </div>
          </div>
        </div>

        {/* PANEL PHẢI: Form đăng nhập */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-background">
          <div className="w-full max-w-[400px] space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Chào mừng trở lại</h2>
              <p className="text-muted-foreground font-medium">Vui lòng nhập thông tin để truy cập khóa học</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-sm text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          className="h-12 bg-input border-border rounded-md focus-visible:ring-ring focus-visible:border-primary transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-bold text-sm text-foreground">Mật khẩu</FormLabel>
                        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-12 bg-input border-border rounded-md focus-visible:ring-ring focus-visible:border-primary transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground h-12 rounded-md font-bold text-base mt-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Đăng nhập
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="bg-background px-4">Hoặc đăng nhập với</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-border h-12 rounded-md flex gap-3 font-bold hover:bg-accent transition-all"
            >
              <GoogleIcon size={20} />
              <span>Tiếp tục với Google</span>
            </Button>

            <footer className="text-center text-sm font-medium pt-8 border-t border-border">
              <span className="text-muted-foreground">Chưa có tài khoản?</span>{" "}
              <Link href="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Đăng ký ngay
              </Link>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}