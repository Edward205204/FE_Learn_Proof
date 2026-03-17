'use client'

import { useState } from 'react'
import { VideoPlayer } from '../../../../_components/video-player'
import { LessonTabs } from '../../../../_components/lesson-tabs'
import { CurriculumSidebar } from '../../../../_components/curriculum-sidebar'
import { ReadingContent } from '../../../../_components/reading-content'
import { QuizContainer } from '../../../../_components/quiz-container'
import type {
  LessonData,
  QuizLesson,
  ReadingLesson,
  SidebarChapter,
  VideoLesson
} from '../../../../_utils/lesson-types'

// Dữ liệu mẫu — thay bằng fetch API thực tế
const MOCK_CHAPTERS: SidebarChapter[] = [
  {
    id: 'ch1',
    title: 'Nền tảng thiết kế màu sắc',
    lessons: [
      {
        id: 'l1',
        title: 'Giới thiệu khóa học',
        duration: '5:30',
        isCompleted: true,
        isLocked: false,
        type: 'video' as const
      },
      {
        id: 'l2',
        title: 'Lý thuyết màu cơ bản (Bài đọc)',
        duration: '12:45',
        isCompleted: true,
        isLocked: false,
        type: 'reading' as const
      },
      {
        id: 'l3',
        title: 'Thiết kế với OKLCH',
        duration: '32:10',
        isCompleted: false,
        isLocked: false,
        type: 'video' as const
      },
      {
        id: 'l4',
        title: 'Quiz: Kiểm tra chương 1',
        duration: '10:00',
        isCompleted: false,
        isLocked: false,
        type: 'quiz' as const
      }
    ]
  },
  {
    id: 'ch2',
    title: 'Ứng dụng thực tế',
    lessons: [
      {
        id: 'l5',
        title: 'Xây dựng palette màu',
        duration: '20:00',
        isCompleted: false,
        isLocked: true,
        type: 'video' as const
      },
      {
        id: 'l6',
        title: 'Dark mode với OKLCH',
        duration: '18:30',
        isCompleted: false,
        isLocked: true,
        type: 'video' as const
      }
    ]
  }
]

const MOCK_VIDEO_LESSON: VideoLesson = {
  id: 'l3',
  type: 'video',
  title: 'Thiết kế với OKLCH: Tương lai của không gian màu',
  videoUrl: 'https://your-video-url.mp4',
  lastPosition: 125,
  description: `Trong bài học này, chúng ta sẽ đi sâu vào mô hình màu OKLCH — một bước tiến vượt bậc so với HSL/RGB truyền thống.

Bạn sẽ học được:
• Cách OKLCH biểu diễn màu sắc theo cảm nhận con người
• Tại sao OKLCH cho kết quả đồng đều hơn khi tạo palette
• Cách viết giá trị OKLCH trong CSS hiện đại
• Công cụ và workflow thực tế khi làm dự án`,
  materials: [
    { title: 'Giao diện mẫu OKLCH.fig', size: '12.4 MB', url: '#' },
    { title: 'Cheat-sheet mã màu CSS.pdf', size: '2.1 MB', url: '#' }
  ]
}

const MOCK_READING_LESSON: ReadingLesson = {
  id: 'l2',
  type: 'reading',
  title: 'Lý thuyết màu cơ bản (Bài đọc)',
  content: `OKLCH là một không gian màu mới được thiết kế để giải quyết những hạn chế của HSL và RGB.

Khác với HSL (nơi các màu có cùng độ sáng Lightness lại trông khác biệt rõ rệt về độ chói trên màn hình), OKLCH được xây dựng dựa trên cách mắt người thực sự cảm nhận ánh sáng. 

Cấu trúc của OKLCH:
- L (Lightness): Độ sáng thực sự từ 0 (đen) đến 1 (trắng)
- C (Chroma): Độ rực rỡ của màu sắc
- H (Hue): Vòng tròn màu 360 độ

Nhờ vậy, khi bạn tạo ra một palette màu bằng OKLCH, các màu sắc sẽ có độ đồng đều hoàn hảo, giúp giao diện trở nên chuyên nghiệp và dễ nhìn hơn rất nhiều so với cách tạo màu truyền thống.`,
  estimatedMinutes: 15,
  materials: [{ title: 'Cheat-sheet mã màu CSS.pdf', size: '2.1 MB', url: '#' }]
}

const MOCK_QUIZ_LESSON: QuizLesson = {
  id: 'l4',
  type: 'quiz',
  title: 'Quiz: Kiểm tra chương 1',
  isFinalExam: false,
  questions: [
    {
      id: 'q1',
      text: 'Mô hình màu OKLCH tập trung vào điều gì nhất so với RGB/HSL?',
      options: [
        { id: 'opt1', text: 'Dễ viết code hơn' },
        { id: 'opt2', text: 'Đồng nhất với cảm nhận thị giác của mắt người' },
        { id: 'opt3', text: 'Dung lượng nhẹ hơn khi render' }
      ],
      correctOptionId: 'opt2'
    },
    {
      id: 'q2',
      text: 'Chữ "L" trong OKLCH đại diện cho gì?',
      options: [
        { id: 'opt1', text: 'Luminance / Lightness' },
        { id: 'opt2', text: 'Linear' },
        { id: 'opt3', text: 'Level' }
      ],
      correctOptionId: 'opt1'
    }
  ]
}

export default function LessonPage() {
  const allLessons = MOCK_CHAPTERS.flatMap((c) => c.lessons)

  // Dùng state thay vì hằng số cứng để có thể chuyển bài
  const [currentLessonId, setCurrentLessonId] = useState<string>('l3')

  // Tìm full data của bài hiện tại. Nếu là bài l2 hoặc l4 thì merge thêm mock data cho reading/quiz
  const currentLessonMeta = allLessons.find((l) => l.id === currentLessonId) || allLessons[0]

  const activeLesson: LessonData =
    currentLessonMeta.type === 'reading'
      ? { ...MOCK_READING_LESSON, id: currentLessonMeta.id, title: currentLessonMeta.title }
      : currentLessonMeta.type === 'quiz'
        ? { ...MOCK_QUIZ_LESSON, id: currentLessonMeta.id, title: currentLessonMeta.title }
        : { ...MOCK_VIDEO_LESSON, id: currentLessonMeta.id, title: currentLessonMeta.title }

  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const prevLessonId = allLessons[currentIndex - 1]?.id ?? null
  const nextLessonId = allLessons[currentIndex + 1]?.id ?? null

  const handleNavigate = (id: string) => {
    // Cập nhật state để render lại UI thay vì chỉ log ra console
    setCurrentLessonId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleQuizSubmit = (answers: Record<string, string>, score: number) => {
    console.log('Quiz submitted:', { answers, score })
  }

  return (
    <main className='max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Lõi Render theo loại bài học */}
      <div className='lg:col-span-2 space-y-6'>
        {activeLesson.type === 'video' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <VideoPlayer
              url={activeLesson.videoUrl}
              lastPosition={activeLesson.lastPosition}
              lessonId={activeLesson.id}
            />
            <h1 className='text-2xl font-extrabold text-slate-900 mt-6'>{activeLesson.title}</h1>
            <LessonTabs
              lessonId={activeLesson.id}
              description={activeLesson.description}
              materials={activeLesson.materials}
            />
          </div>
        )}

        {activeLesson.type === 'reading' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <ReadingContent lesson={activeLesson} />
          </div>
        )}

        {activeLesson.type === 'quiz' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <QuizContainer lesson={activeLesson} onSubmit={handleQuizSubmit} />
          </div>
        )}
      </div>

      {/* Cột Sidebar */}
      <div className='lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]'>
        <CurriculumSidebar
          chapters={MOCK_CHAPTERS}
          currentLessonId={activeLesson.id}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
          onLessonClick={handleNavigate}
        />
      </div>
    </main>
  )
}
