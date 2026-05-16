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

  const hasDraft = !!draft

  return (
    <section className='space-y-8 py-8 px-8 bg-card/50 backdrop-blur-sm border border-white/10 rounded-[2.5rem] shadow-xl relative overflow-hidden'>
      {/* Decorative background glow */}
      <div className='absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none' />

      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20'>
              <Sparkles className='h-5 w-5' />
            </div>
            <h2 className='text-2xl font-black tracking-tight text-foreground'>AI Quiz Studio</h2>
          </div>
          <p className='text-sm text-muted-foreground font-medium max-w-md'>
            Sử dụng trí tuệ nhân tạo để phân tích nội dung bài học và tự động soạn thảo bộ câu hỏi trắc nghiệm chất lượng cao.
          </p>
        </div>
        {!hasDraft && !isGenerating && (
          <GenerateButton onGenerate={handleGenerate} isGenerating={isGenerating} disabled={hasDraft || isSubmitting} />
        )}
      </div>

      <div className='relative z-10'>
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
            <div className='group p-8 border-2 border-dashed border-white/10 rounded-[2rem] bg-muted/20 flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-muted/30 hover:border-primary/20'>
              <div className='w-16 h-16 rounded-[1.5rem] bg-background shadow-lg flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                <HelpCircle className='h-8 w-8' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-sm font-black text-foreground uppercase tracking-widest'>Chưa có bản nháp AI</h3>
                <p className='text-xs text-muted-foreground font-medium max-w-[280px]'>
                  Hệ thống sẵn sàng tạo câu hỏi từ nội dung bài học. Nhấn nút phía trên để bắt đầu!
                </p>
              </div>
            </div>
          )
        )}

        {isGenerating && (
          <div className='p-12 border-2 border-dashed border-indigo-500/30 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 bg-indigo-500/5 overflow-hidden relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none' />
            
            <div className='relative'>
              <div className='absolute inset-0 bg-indigo-500/40 blur-3xl rounded-full animate-pulse'></div>
              <div className='relative w-20 h-20 rounded-[2rem] bg-indigo-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50'>
                <Sparkles className='h-10 w-10 animate-bounce' />
              </div>
            </div>

            <div className='text-center space-y-4 max-w-xs'>
              <div className='space-y-1'>
                <p className='text-lg font-black text-indigo-600 tracking-tight'>AI đang phân tích & biên soạn...</p>
                <p className='text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60'>
                  Tiến trình: 45% (Ước tính 30-60s)
                </p>
              </div>
              <div className='w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden'>
                <div className='h-full bg-indigo-500 rounded-full animate-[progress_30s_linear_infinite]' style={{ width: '45%' }}></div>
              </div>
              <p className='text-[10px] text-muted-foreground italic font-medium'>
                Mẹo: Nội dung bài học càng chi tiết, câu hỏi AI tạo ra càng chất lượng.
              </p>
            </div>
          </div>
        )}
      </div>

      <DraftPreviewModal
        draft={draft}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onPublish={handlePublish}
        onReject={handleReject}
        isSubmitting={isSubmitting}
      />

      <style jsx>
        {`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 95%; }
          }
        `}
      </style>
    </section>
  )
}
