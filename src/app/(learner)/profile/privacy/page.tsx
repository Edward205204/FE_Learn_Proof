"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Header section */}
      <div className="py-6 border-b border-border text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Sự riêng tư
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Bạn có thể thay đổi cài đặt quyền riêng tư của mình tại đây.
        </p>
      </div>

      {/* Main Form section */}
      <div className="p-8 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <h3 className="text-[15px] font-bold text-foreground">
            Cài đặt trang hồ sơ
          </h3>
          
          {/* Checkboxes */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="show-profile" 
                defaultChecked 
                className="w-5 h-5 rounded-sm border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary" 
              />
              <Label 
                htmlFor="show-profile" 
                className="text-[15px] text-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hiển thị hồ sơ của bạn cho người dùng đã đăng nhập.
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="show-courses" 
                defaultChecked 
                className="w-5 h-5 rounded-sm border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary" 
              />
              <Label 
                htmlFor="show-courses" 
                className="text-[15px] text-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hiển thị các khóa học bạn đang tham gia trên trang cá nhân của bạn.
              </Label>
            </div>
          </div>

          <div className="pt-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-[42px] px-8 py-2 rounded-md">
              Cứu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
