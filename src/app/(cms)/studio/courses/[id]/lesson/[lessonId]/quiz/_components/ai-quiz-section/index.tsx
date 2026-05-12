import { useState } from 'react'
import { Sparkles, HelpCircle } from 'lucide-react'
import { useAiQuiz } from './use-ai-quiz'
import { GenerateButton } from './generate-button'
import { QuizDraftCard } from './quiz-draft-card'
import { DraftPreviewModal } from './draft-preview-modal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  lessonId: string
  lessonType: string
}

export function AiQuizSection({ lessonId, lessonType }: Props) {
  const { draft, isGenerating, isSubmitting, handleGenerate, handlePublish, handleReject } = useAiQuiz(lessonId)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Chỉ hỗ trợ TEXT và VIDEO. Nếu là bài học QUIZ thuần túy thì không dùng AI Quiz Gen.
  if (lessonType === 'QUIZ') return null

  const hasDraft = !!draft

  return (
    <section className='space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-lg font-extrabold flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-indigo-500' />
            AI Quiz Assistant
          </h2>
          <p className='text-sm text-muted-foreground'>
            Tự động tạo câu hỏi trắc nghiệm dựa trên nội dung của bài học này.
          </p>
        </div>
        {!hasDraft && (
          <GenerateButton onGenerate={handleGenerate} isGenerating={isGenerating} disabled={hasDraft || isSubmitting} />
        )}
      </div>

      {hasDraft ? (
        <QuizDraftCard
          draft={draft}
          onPreview={() => setIsPreviewOpen(true)}
          onPublish={handlePublish}
          onReject={() => setIsPreviewOpen(true)}
          isSubmitting={isSubmitting}
        />
      ) : (
        !isGenerating && (
          <Alert className='bg-muted/30 border-dashed'>
            <HelpCircle className='h-4 w-4' />
            <AlertTitle className='text-sm font-bold'>Chưa có bản nháp AI</AlertTitle>
            <AlertDescription className='text-xs'>
              Nhấn nút &quot;Sinh Quiz bằng AI&quot; để bắt đầu tạo câu hỏi. Quá trình này có thể mất khoảng 30-60 giây.
            </AlertDescription>
          </Alert>
        )
      )}

      {isGenerating && (
        <div className='p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 bg-muted/10 animate-pulse'>
          <div className='relative'>
            <Sparkles className='h-10 w-10 text-indigo-400 animate-bounce' />
            <div className='absolute inset-0 bg-indigo-500/20 blur-xl rounded-full'></div>
          </div>
          <div className='text-center space-y-1'>
            <p className='font-bold text-indigo-600'>AI đang phân tích bài học...</p>
            <p className='text-xs text-muted-foreground'>Vui lòng không đóng trang này.</p>
          </div>
        </div>
      )}

      <DraftPreviewModal
        draft={draft}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onPublish={handlePublish}
        onReject={handleReject}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}
