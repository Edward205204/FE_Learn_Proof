'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Save, Loader2, CheckCheck, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProfessionalEditor } from '@/components/common/professional-editor'
import type { HeadingItem } from '@/components/common/professional-editor'
import { LessonTocSidebar } from './_components/lesson-toc-sidebar'
import { useGetLessonDetailQuery, useUpdateLessonMutation } from '@/app/(cms)/_hooks/use-lesson'
import { toast } from 'sonner'

// ─── Save Status ──────────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'saved'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TextLessonEditPage() {
  const router = useRouter()
  const params = useParams<{ id: string; lessonId: string }>()
  const { id: courseId, lessonId } = params

  // ── Server data ──────────────────────────────────────────────────────────────
  const { data: lessonDetail, isLoading } = useGetLessonDetailQuery(lessonId)
  const updateMutation = useUpdateLessonMutation(lessonId)

  // ── Local state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [content, setContent] = useState('')
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [initialized, setInitialized] = useState(false)

  // Refs for heading anchor DOM nodes keyed by heading index
  const editorContainerRef = useRef<HTMLDivElement>(null)

  // ── Prefill when data arrives ─────────────────────────────────────────────
  useEffect(() => {
    if (!lessonDetail || initialized) return
    if (lessonDetail.type !== 'TEXT') {
      // Guard: redirect if this is not a text lesson
      toast.error('Bài học này không phải loại văn bản.')
      router.replace(`/studio/courses/${courseId}`)
      return
    }
    setTitle(lessonDetail.title)
    setShortDesc(lessonDetail.shortDesc ?? '')
    setContent(lessonDetail.textContent)
    // Extract headings from initial content
    const parser = new DOMParser()
    const doc = parser.parseFromString(lessonDetail.textContent, 'text/html')
    const nodes = Array.from(doc.querySelectorAll('h1,h2,h3'))
    const extracted: HeadingItem[] = nodes.map((el, i) => ({
      id: `heading-${i}`,
      level: parseInt(el.tagName[1]) as 1 | 2 | 3,
      text: el.textContent?.trim() ?? ''
    }))
    setHeadings(extracted.filter((h) => h.text))
    setInitialized(true)
  }, [lessonDetail, initialized, courseId, router])

  // ── Intersection Observer — track active heading ──────────────────────────
  useEffect(() => {
    const container = editorContainerRef.current
    if (!container || headings.length === 0) return

    const headingEls = container.querySelectorAll<HTMLElement>('h1,h2,h3')
    if (headingEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Array.from(headingEls).indexOf(entry.target as HTMLElement)
            if (idx >= 0 && idx < headings.length) {
              setActiveHeadingId(headings[idx].id)
            }
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings, content])

  // ── Scroll to heading ─────────────────────────────────────────────────────
  const handleScrollToHeading = useCallback((headingId: string) => {
    const container = editorContainerRef.current
    if (!container) return
    const idx = parseInt(headingId.replace('heading-', ''))
    const headingEls = container.querySelectorAll<HTMLElement>('h1,h2,h3')
    const target = headingEls[idx]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveHeadingId(headingId)
    }
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast.error('Tiêu đề bài học không được để trống!')
      return
    }
    setSaveStatus('saving')
    try {
      await updateMutation.mutateAsync({
        type: 'TEXT',
        title: title.trim(),
        shortDesc: shortDesc.trim() || undefined,
        textContent: content
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('idle')
    }
  }, [title, shortDesc, content, updateMutation])

  // ── Ctrl+S keyboard shortcut ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // ── Heading change from editor ────────────────────────────────────────────
  const handleHeadingsChange = useCallback((newHeadings: HeadingItem[]) => {
    setHeadings(newHeadings)
  }, [])

  // ── Content change ────────────────────────────────────────────────────────
  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading || !initialized) {
    return (
      <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 text-muted-foreground'>
        <Loader2 className='size-8 animate-spin text-primary' />
        <p className='text-sm font-medium'>Đang tải nội dung bài học...</p>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-40 flex flex-col bg-background overflow-hidden'>
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className='shrink-0 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-4 gap-3 z-20'>
        {/* Back button */}
        <Button
          variant='ghost'
          size='sm'
          className='gap-1.5 text-muted-foreground hover:text-foreground shrink-0 -ml-1'
          onClick={() => router.push(`/studio/courses/${courseId}`)}
        >
          <ChevronLeft className='size-4' />
          <span className='hidden sm:inline text-sm'>Quay lại</span>
        </Button>

        <div className='h-5 w-px bg-border shrink-0' />

        {/* Lesson type badge */}
        <Badge variant='secondary' className='shrink-0 gap-1.5 font-semibold text-xs'>
          <FileText className='size-3' />
          Văn bản
        </Badge>

        {/* Editable title - takes remaining space */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Tiêu đề bài học...'
          className='flex-1 h-9 border-transparent bg-transparent shadow-none text-base font-semibold placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:border-border hover:border-border transition-colors px-2 rounded-lg'
        />

        {/* Save status + button */}
        <div className='flex items-center gap-2 shrink-0'>
          {saveStatus === 'saved' && (
            <span className='hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
              <CheckCheck className='size-3.5' />
              Đã lưu
            </span>
          )}
          <Button
            size='sm'
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className='gap-2 shadow-sm shadow-primary/20 font-semibold'
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className='size-3.5 animate-spin' />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className='size-3.5' />
                <span>Lưu</span>
                <kbd className='hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono opacity-60 ml-0.5 bg-primary-foreground/20 px-1 rounded'>
                  Ctrl+S
                </kbd>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* ── Main Body: Editor + TOC Sidebar ───────────────────────────────── */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Editor area */}
        <main className='flex-1 overflow-y-auto' ref={editorContainerRef}>
          <div className='max-w-4xl mx-auto px-4 sm:px-8 py-8'>
            <ProfessionalEditor
              value={content}
              onChange={handleContentChange}
              onHeadingsChange={handleHeadingsChange}
              minHeight='75vh'
            />
            {/* Bottom spacer */}
            <div className='h-24' />
          </div>
        </main>

        {/* TOC Sidebar */}
        <LessonTocSidebar
          headings={headings}
          shortDesc={shortDesc}
          onShortDescChange={setShortDesc}
          contentHtml={content}
          onScrollToHeading={handleScrollToHeading}
          activeHeadingId={activeHeadingId}
        />
      </div>
    </div>
  )
}
