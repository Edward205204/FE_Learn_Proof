"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { label: "Xem hồ sơ công khai", href: "/public-profile" },
  { label: "Hồ sơ", href: "/profile" },
  { label: "Bảo mật tài khoản", href: "/profile/security" },
  { label: "Sự riêng tư", href: "/profile/privacy" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Section */}
      <Avatar className="w-[120px] h-[120px] mt-2 mb-4 text-4xl font-bold bg-primary text-primary-foreground border-2 border-border">
        <AvatarFallback className="bg-primary text-primary-foreground">MT</AvatarFallback>
      </Avatar>
      <h2 className="text-base font-bold mb-6 text-foreground text-center">
        Mạnh Cường Trương
      </h2>

      {/* Navigation Links */}
      <nav className="w-full flex flex-col">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-[15px] transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-normal"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
