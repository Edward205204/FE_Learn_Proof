"use client";

import { Edit2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dữ liệu mẫu khóa học đã mua (Mock data)
const purchasedCourses = [
  {
    id: 1,
    title: "The Web Developer Bootcamp 2026",
    instructor: "Colt Steele",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    instructor: "Dr. Angela Yu",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    instructor: "Maximilian Schwarzmüller",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400",
  }
];

export default function PublicProfilePage() {
  return (
    <div className="w-full bg-background min-h-screen">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-muted/50 dark:to-transparent w-full h-[240px] relative border-b border-border">
        <div className="max-w-6xl mx-auto h-full flex items-center px-6 md:px-0 relative">
          
          <div className="space-y-3">
            <h5 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
              LEARNER
            </h5>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Mạnh Cường Trương
            </h1>
          </div>

          {/* Right Floating Card (Avatar & Edit Button) */}
          <div className="hidden md:flex absolute right-6 lg:right-0 top-16 w-[300px] bg-background shadow-sm border border-border rounded-2xl p-8 flex-col items-center gap-6 z-10 transition-shadow hover:shadow-md">
            <Avatar className="w-[140px] h-[140px] bg-primary/10 text-primary border-4 border-background shadow-sm text-5xl font-bold flex items-center justify-center">
              <AvatarFallback className="bg-primary text-primary-foreground select-none">M</AvatarFallback>
            </Avatar>
            <Link href="/profile" className="w-full">
              <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none font-bold rounded-xl h-12 text-[15px] flex items-center justify-center gap-2 shadow-none transition-all active:scale-[0.98]">
                <Edit2 size={16} />
                Chỉnh sửa hồ sơ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-0 py-12 md:py-20">
        
        {/* Mobile Info (shows only on small screens) */}
        <div className="md:hidden flex flex-col items-center mb-12 space-y-6">
          <Avatar className="w-28 h-28 bg-primary text-primary-foreground border-4 border-background shadow-sm text-4xl font-bold">
            <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
          </Avatar>
          <Link href="/profile" className="w-full max-w-[280px]">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none font-bold rounded-xl h-12 text-[15px] shadow-none flex items-center gap-2 transition-all">
              <Edit2 size={16} />
              Chỉnh sửa hồ sơ
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">
            Khóa học đã mua
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {purchasedCourses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 pt-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[16px] text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-[13px] font-medium text-muted-foreground flex-1">
                    {course.instructor}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
