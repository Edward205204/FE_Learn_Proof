import Header from '@/components/common/header'
import Footer from '@/components/common/footer'

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-background text-foreground' suppressHydrationWarning>
      <Header />

      <main className='flex-1 flex flex-col w-full relative' suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </div>
  )
}
