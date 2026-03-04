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
      {/* HEADER: Chứa Logo và Điều hướng nhanh */}
      <header className="w-full h-20 px-6 md:px-12 flex items-center justify-between border-b border-border z-20 bg-background/95 backdrop-blur">
        {/* Logo & Slogan góc trên bên trái */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none text-foreground">
            LEARN PROOF
          </h1>
          <span className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-widest uppercase">
            LEARN SMART. PROVE IT.
          </span>
        </div>

        {/* Nút điều hướng nhanh bên phải */}
        <div className="flex gap-2">
          <Button variant="ghost" asChild className="font-bold text-sm">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button variant="default" asChild className="bg-primary text-primary-foreground font-bold text-sm rounded-md">
            <Link href="/register">Đăng ký</Link>
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT: Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* BÊN TRÁI: Ảnh nền trừu tượng (Ảnh 2) */}
        <div className="hidden lg:block w-1/2 relative bg-[#8e5c54]">
          <div 
            className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
            style={{ 
              backgroundImage: `url('/path-to-your-image-2.jpg')`, // Thay bằng link ảnh 2 của bạn
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="max-w-md">
                <h2 className="text-4xl font-black text-white leading-tight">
                  Nâng tầm kiến thức của bạn
                </h2>
                <p className="text-white/80 text-lg font-medium mt-4">
                  Hệ thống quản lý học tập thông minh giúp bạn chứng minh năng lực thực tế.
                </p>
             </div>
          </div>
        </div>

        {/* BÊN PHẢI: Form đăng nhập */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
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
                      <FormLabel className="font-bold text-sm">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          className="h-12 bg-input border-border rounded-md focus-visible:ring-ring" 
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
                        <FormLabel className="font-bold text-sm">Mật khẩu</FormLabel>
                        <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="h-12 bg-input border-border rounded-md focus-visible:ring-ring" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground h-12 rounded-md font-bold text-base mt-2 transition-all hover:opacity-90 active:scale-[0.98]"
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

            <div className="text-center text-sm font-medium pt-4 border-t border-border">
              <span className="text-muted-foreground">Chưa có tài khoản?</span>{" "}
              <Link href="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}