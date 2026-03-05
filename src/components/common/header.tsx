import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, User } from "lucide-react";
import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md px-6 md:px-10 py-3 
      /* Viền và nền áp dụng oklch từ source [cite: 1, 5] */
      border-[oklch(0.92_0.004_286.32)] 
      bg-white/80 
      dark:bg-[oklch(0.141_0.005_285.823)]/80 
      dark:border-[oklch(0.274_0.006_286.033)]">
      
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[oklch(0.577_0.245_27.325)]">
            <Star size={28} strokeWidth={3} fill="currentColor" />
            <Link href="/" className="text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] text-xl font-bold tracking-tight">
              LearnPoorf
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Label className="relative flex h-10 w-64 items-center overflow-hidden bg-[oklch(0.92_0.004_286.32)] dark:bg-[oklch(0.21_0.006_285.885)] rounded-[calc(0.5rem-2px)]">
              <div className="flex items-center justify-center pl-4 text-[oklch(0.552_0.016_285.938)]">
                <Search size={18} />
              </div>
              <Input 
                className="w-full border-none bg-transparent px-3 text-sm focus-visible:ring-2 focus-visible:ring-[oklch(0.577_0.245_27.325)] placeholder:text-[oklch(0.552_0.016_285.938)]" 
                placeholder="Search courses..." 
                type="text"
              />
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)]">
            <a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Courses</a>
            <a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Mentors</a>
            <a className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors" href="#">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="flex h-10 min-w-[90px] items-center justify-center px-5 text-sm font-bold text-white transition-opacity hover:opacity-90
              bg-[oklch(0.577_0.245_27.325)] 
              rounded-[calc(0.5rem-2px)] 
              shadow-sm">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}