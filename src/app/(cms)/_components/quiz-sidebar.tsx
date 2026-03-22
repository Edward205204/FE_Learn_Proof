import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Play } from 'lucide-react'

interface QuizSidebarProps {
  title: string
  infoLines: string[]
}

export function QuizSidebar({ title, infoLines }: QuizSidebarProps) {
  return (
    <aside className='w-64 md:w-72 bg-muted/20 border-r border-border/50 p-6 flex flex-col shrink-0'>
      <h2 className='text-lg font-extrabold text-foreground mb-6'>{title}</h2>
      <nav className='space-y-2'>
        <Button variant='ghost' className='w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-10'>
          <Lock className='mr-2 h-4 w-4' /> Nội dung khóa học
        </Button>
        <Button variant='secondary' className='w-full justify-start bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-xl h-10'>
          <Play className='mr-2 h-4 w-4' /> Trình soạn Quiz
        </Button>
      </nav>

      <div className='mt-auto pt-10'>
        <Card className='bg-background/50 border border-border/50 shadow-sm rounded-xl'>
          <CardContent className='p-4 text-xs space-y-2.5'>
            <p className='font-bold flex items-center tracking-wider uppercase text-[10px] text-muted-foreground'>
              <Lock className='h-3 w-3 mr-1' /> Thông tin Editor
            </p>
            {infoLines.map((line, i) => (
              <p key={i} className='text-muted-foreground font-medium'>
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
