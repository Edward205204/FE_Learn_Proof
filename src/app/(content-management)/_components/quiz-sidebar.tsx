import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Play } from 'lucide-react'

interface QuizSidebarProps {
  title: string
  infoLines: string[]
}

export function QuizSidebar({ title, infoLines }: QuizSidebarProps) {
  return (
    <aside className='w-64 border-r bg-sidebar p-6 flex flex-col'>
      <h2 className='text-lg font-bold text-primary mb-6'>Quiz Builder</h2>
      <nav className='space-y-2'>
        <Button variant='ghost' className='w-full justify-start'>
          <Lock className='mr-2 h-4 w-4' /> Nội dung khóa học
        </Button>
        <Button variant='secondary' className='w-full justify-start text-primary'>
          <Play className='mr-2 h-4 w-4' /> Trình soạn Quiz
        </Button>
      </nav>

      <div className='mt-auto pt-10'>
        <Card className='bg-muted/50 border-none'>
          <CardContent className='p-4 text-xs space-y-2'>
            <p className='font-bold flex items-center'>
              <Lock className='h-3 w-3 mr-1' /> THÔNG TIN EDITOR
            </p>
            {infoLines.map((line, i) => (
              <p key={i} className='text-muted-foreground'>
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
