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
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    // 1. Nâng cấp nền: Thêm gradient chuyển động nhẹ hoặc mesh background
    <div className="min-h-screen bg-[#f7f9fa] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* 2. Phần tử trang trí (Decorations) để bớt trống */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl" />

      {/* 3. Container Card với shadow sâu hơn và border tinh tế */}
      <div className="w-full max-w-[450px] z-10">
        <div className="bg-card p-8 md:p-10 border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl">
          
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Đăng nhập để tiếp tục hành trình học tập
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="font-bold text-[13px] uppercase tracking-wider text-muted-foreground/80">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        className="h-12 bg-white border-2 border-border focus-visible:ring-0 focus-visible:border-black rounded-none transition-all" 
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
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-bold text-[13px] uppercase tracking-wider text-muted-foreground/80">
                        Mật khẩu
                      </FormLabel>
                      <Link href="#" className="text-xs font-bold text-primary hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-12 bg-white border-2 border-border focus-visible:ring-0 focus-visible:border-black rounded-none transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white h-12 rounded-none font-bold text-base transition-all"
              >
                Đăng nhập
              </Button>
            </form>
          </Form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="bg-card px-4">Hoặc đăng nhập với</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-2 border-border h-12 rounded-none flex gap-3 font-bold hover:bg-muted/50 transition-all"
          >
            <GoogleIcon size={20} />
            <span>Google</span>
          </Button>

          <div className="text-center mt-10 pt-6 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* 4. Thêm Footer nhỏ phía dưới Card */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60 font-medium">
            © 2024 LMS Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}