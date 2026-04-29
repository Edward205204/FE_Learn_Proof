import { CertificateAction } from '../../_components/certificate-action'
import { CheckCircle2, Award, Zap } from 'lucide-react'

export default async function CertificatePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params
  const courseId = resolvedParams.courseId

  return (
    <div className='min-h-screen bg-[#fafafa] pb-20 pt-10'>
      <main>
        {/* Component xử lý logic và hiển thị nút cấp bằng */}
        <CertificateAction courseId={courseId} />
      </main>
    </div>
  )
}
