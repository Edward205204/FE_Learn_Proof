'use client'

import { Archive, Search, Pencil, Eye, EyeOff, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function ArchivedCoursesPage() {
  const [isVisible, setIsVisible] = useState(false)

  // Giả lập dữ liệu từ API (Sau này sẽ map từ useGetArchivedCoursesQuery)
  const mockData = {
    archivedAt: new Date('2026-03-08T09:00:00'), // Ngày lưu trữ mẫu
    studentCount: 156,
  }

  // --- Logic xử lý thời gian ---
  const formattedDate = format(mockData.archivedAt, 'dd/MM/yyyy', { locale: vi })
  const relativeTime = formatDistanceToNow(mockData.archivedAt, { 
    addSuffix: true, 
    locale: vi 
  })

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Archive className="h-10 w-10 text-primary" /> Kho Lưu Trữ
          </h1>
          <p className="text-muted-foreground mt-2 italic text-sm">
            Các khóa học đã Archive chỉ hiển thị với học viên cũ.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm khóa học cũ..." className="pl-10 rounded-xl border-border focus-visible:ring-primary" />
        </div>
      </header>

      <div className="grid gap-4">
        <Card className="overflow-hidden border-2 border-primary/10 rounded-3xl shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-6 flex items-center gap-6">
            {/* Thumbnail Placeholder */}
            <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
              <span className="text-primary font-black text-sm uppercase">Next.js</span>
            </div>

            {/* Course Info */}
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                Khóa học Fullstack Next.js 2024
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Lưu trữ: <span className="font-medium text-foreground">{formattedDate}</span> 
                  <span className="text-[12px]">({relativeTime})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Học viên cũ: <span className="font-medium text-foreground">{mockData.studentCount}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-11 w-11 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                title="Chỉnh sửa khóa học"
              >
                <Pencil className="h-5 w-5" />
              </Button>

              <Button 
                onClick={() => setIsVisible(!isVisible)}
                variant={isVisible ? "default" : "secondary"}
                className={`rounded-full h-11 flex gap-2 px-6 transition-all font-bold shadow-sm ${
                  isVisible 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isVisible ? (
                  <>
                    <Eye className="h-5 w-5" /> Hiện khóa học
                  </>
                ) : (
                  <>
                    <EyeOff className="h-5 w-5" /> Ẩn khóa học
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}