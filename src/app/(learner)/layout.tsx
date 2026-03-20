import Header from '@/components/common/header'
import Footer from '@/components/common/footer'

export default function LearnerLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground'>
      <Header />
      {/* 
        Tham chiếu màu từ globals.css (bg-background, text-foreground)
        để tất cả các trang learner (hồ sơ, khóa học, thanh toán...)
        đều nhất quán và tối ưu cả light/dark mode.
      */}
      <main className='flex-1 flex flex-col w-full relative'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
