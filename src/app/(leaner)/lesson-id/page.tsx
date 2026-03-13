'use client'

import { VideoPlayer } from '../_components/video-player'
import { LessonTabs } from '../_components/lesson-tabs'
import { CurriculumSidebar } from '../_components/curriculum-sidebar'

// Dữ liệu mẫu — thay bằng fetch API thực tế
const MOCK_CHAPTERS = [
    {
        id: 'ch1',
        title: 'Nền tảng thiết kế màu sắc',
        lessons: [
            { id: 'l1', title: 'Giới thiệu khóa học', duration: '5:30', isCompleted: true, isLocked: false, type: 'video' as const },
            { id: 'l2', title: 'Lý thuyết màu cơ bản', duration: '12:45', isCompleted: true, isLocked: false, type: 'video' as const },
            { id: 'l3', title: 'Thiết kế với OKLCH', duration: '32:10', isCompleted: false, isLocked: false, type: 'video' as const },
            { id: 'l4', title: 'Quiz: Kiểm tra chương 1', duration: '10:00', isCompleted: false, isLocked: true, type: 'quiz' as const },
        ],
    },
    {
        id: 'ch2',
        title: 'Ứng dụng thực tế',
        lessons: [
            { id: 'l5', title: 'Xây dựng palette màu', duration: '20:00', isCompleted: false, isLocked: true, type: 'video' as const },
            { id: 'l6', title: 'Dark mode với OKLCH', duration: '18:30', isCompleted: false, isLocked: true, type: 'video' as const },
        ],
    },
]

const MOCK_LESSON = {
    id: 'l3',
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
        { title: 'Cheat-sheet mã màu CSS.pdf', size: '2.1 MB', url: '#' },
    ],
}

export default function LessonPage() {
    // Tính prev/next lesson từ danh sách phẳng
    const allLessons = MOCK_CHAPTERS.flatMap((c) => c.lessons)
    const currentIndex = allLessons.findIndex((l) => l.id === MOCK_LESSON.id)
    const prevLessonId = allLessons[currentIndex - 1]?.id ?? null
    const nextLessonId = allLessons[currentIndex + 1]?.id ?? null

    const handleNavigate = (id: string) => {
        // TODO: thay bằng router.push(`/lesson/${id}`) khi có dynamic route
        console.log('Navigating to lesson:', id)
    }

    return (
        <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* PHẦN 1: VIDEO & TABS — chiếm 2/3 */}
            <div className="lg:col-span-2 space-y-6">
                <VideoPlayer
                    url={MOCK_LESSON.videoUrl}
                    lastPosition={MOCK_LESSON.lastPosition}
                    lessonId={MOCK_LESSON.id}
                />

                <h1 className="text-2xl font-extrabold text-slate-900">{MOCK_LESSON.title}</h1>

                <LessonTabs
                    lessonId={MOCK_LESSON.id}
                    description={MOCK_LESSON.description}
                    materials={MOCK_LESSON.materials}
                />
            </div>

            {/* PHẦN 2: SIDEBAR DANH SÁCH BÀI HỌC — 1/3 */}
            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
                <CurriculumSidebar
                    chapters={MOCK_CHAPTERS}
                    currentLessonId={MOCK_LESSON.id}
                    prevLessonId={prevLessonId}
                    nextLessonId={nextLessonId}
                    onLessonClick={handleNavigate}
                />
            </div>
        </main>
    )
}