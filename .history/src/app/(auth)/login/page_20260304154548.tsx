"use client";

import React from "react";
import Image from "next/image";
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
    <div className="min-h-screen w-full flex bg-background">
      
      {/* PHẦN 1: LEFT SIDE - BRAND & ABSTRACT SHAPES (Split Screen) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#8e5c54] p-12 relative overflow-hidden justify-between">
        {/* Hình khối trừu tượng trang trí (Abstract Shapes) */}
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[20%] right-[-5%] w-64 h-64 rounded-full bg-black/10 blur-2xl" />
        
        {/* Header: Logo & Slogan */}
        <div className="relative z-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-5xl font-black tracking-tighter">LEARN PROOF</h1>
            <p className="text-[#f5f5f5]/80 text-xl font-medium tracking-wide">
              LEARN SMART. PROVE IT.
            </p>
          </div>
        </div>

        {/* Footer: Thông tin thương hiệu mờ phía dưới */}
        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            © 2024 Learn Proof Platform. <br />
            Hệ thống quản lý học tập thông minh.
          </p>
        </div>
      </div>

      {/* PHẦN 2: RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo (Chỉ hiện trên màn hình nhỏ) */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-black text-foreground">LEARN PROOF</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Đăng nhập</h2>
            <p className="text-muted-foreground font-medium">Chào mừng bạn trở lại với khóa học</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        className="h-12 bg-input border-border rounded-md focus:ring-ring" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold text-foreground">Mật khẩu</FormLabel>
                      <Link href="#" className="text-xs font-bold text-muted-foreground hover:text-primary">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-12 bg-input border-border rounded-md focus:ring-ring" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground h-12 rounded-md font-bold text-base mt-2 transition-all hover:opacity-90"
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

          <p className="text-center text-sm text-muted-foreground mt-8">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}