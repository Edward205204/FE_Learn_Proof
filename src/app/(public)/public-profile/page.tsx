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
      <div className="bg-primary/5 dark:bg-muted w-full h-[220px] relative border-b border-border/50">
        <div className="max-w-6xl mx-auto h-full flex items-center px-4 md:px-0 relative">
          
          <div className="space-y-2">
            <h5 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wide">
              LEARNER
            </h5>
            <h1 className="text-[32px] md:text-4xl font-bold text-foreground">
              Mạnh Cường Trương
            </h1>
          </div>

          {/* Right Floating Card (Avatar & Edit Button) */}
          <div className="hidden md:flex absolute right-4 lg:right-0 top-16 w-[280px] bg-card shadow-lg border border-border rounded-lg p-8 flex-col items-center gap-6 z-10">
            <Avatar className="w-[120px] h-[120px] bg-primary text-primary-foreground text-4xl font-bold">
              <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
            </Avatar>
            <Link href="/profile" className="w-full">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 h-10 font-bold rounded-sm text-sm flex items-center gap-2">
                <Edit2 size={15} />
                Edit profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 py-12 md:py-20 mt-8 md:mt-0">
        
        {/* Mobile Info (shows only on small screens) */}
        <div className="md:hidden flex flex-col items-center mb-12 space-y-4">
          <Avatar className="w-24 h-24 bg-primary text-primary-foreground text-3xl font-bold">
            <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
          </Avatar>
          <Link href="/profile" className="w-full max-w-[200px]">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 h-10 font-bold rounded-sm text-sm">
              <Edit2 size={15} className="mr-2" />
              Edit profile
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Khóa học đã mua
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {purchasedCourses.map((course) => (
              <div 
                key={course.id} 
                className="group border border-transparent hover:border-border rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col h-full bg-card shadow-sm"
              >
                <div className="w-full h-[160px] bg-muted relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-[15px] text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground flex-1">
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
