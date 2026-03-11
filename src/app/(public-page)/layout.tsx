import Header from '@/components/common/header'
import Footer from '@/components/common/footer'

export default function PublicPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='home-wrapper'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
