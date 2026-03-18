"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Header section */}
      <div className="py-6 border-b border-border text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bảo mật tài khoản
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Chỉnh sửa cài đặt tài khoản của bạn và thay đổi mật khẩu tại đây.
        </p>
      </div>

      {/* Main Form section */}
      <div className="flex flex-col w-full">
        
        {/* Change Password Section */}
        <div className="p-8 max-w-2xl mx-auto w-full border-b border-border">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[15px] font-bold text-foreground block">
                Mật khẩu mới
              </Label>
              <Input 
                type="password"
                placeholder="Nhập mật khẩu mới" 
                className="h-[46px] rounded-sm border-input" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[15px] font-bold text-foreground block">
                Xác nhận mật khẩu mới
              </Label>
              <Input 
                type="password"
                placeholder="Nhập lại mật khẩu mới" 
                className="h-[46px] rounded-sm border-input" 
              />
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-[42px] px-6 rounded-sm">
              Đổi mật khẩu
            </Button>
          </div>
        </div>

        {/* MFA Section */}
        <div className="p-8 max-w-2xl mx-auto w-full">
          <div className="border border-input rounded-sm p-6 flex flex-col items-start gap-4">
            <h3 className="text-[15px] font-bold text-foreground">
              Xác thực đa yếu tố
            </h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[95%]">
              Tăng cường bảo mật tài khoản của bạn bằng cách yêu cầu nhập mã được gửi đến email khi bạn đăng nhập. Để biết thêm thông tin về cách thức hoạt động của xác thực đa yếu tố, vui lòng tham khảo{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Bài viết Trung tâm Trợ giúp
              </Link>.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-[42px] px-6 rounded-sm mt-2">
              Kích hoạt
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
