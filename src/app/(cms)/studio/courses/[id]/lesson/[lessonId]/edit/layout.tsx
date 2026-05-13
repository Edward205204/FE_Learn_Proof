import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài học | LearnProof Studio'
}

/**
 * Layout override cho trang chỉnh sửa TEXT lesson.
 *
 * Intentionally renders children WITHOUT the ContentManagementShell wrapper
 * (no sidebar nav, no content padding) so the blog editor can use the
 * full viewport height with its own header and TOC sidebar.
 */
export default function TextLessonEditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
