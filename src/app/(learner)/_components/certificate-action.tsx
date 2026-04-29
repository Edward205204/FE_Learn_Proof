'use client'

import { useState, useRef, useEffect } from 'react'
import { Award, ShieldCheck, Lock, Sparkles, Download, Copy, ExternalLink, Check, Eye, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CertificateTemplate } from './certificate-template'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { useAuthStore } from '@/store/auth.store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import enrollmentApi from '../_api/enrollment.api'
import certificateApi from '../_api/certificate.api'

interface CertificateActionProps {
  courseId: string
}

export function CertificateAction({ courseId }: CertificateActionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [mintError, setMintError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const certificateRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Get real user from store
  const { user } = useAuthStore()
  const userName = user?.fullName || 'Học Viên'

  // Fetch enrollments to get course details and progress
  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.getMyEnrollments().then((res) => res.data)
  })

  const enrolledCourse = enrollmentsData?.find((e) => e.course.id === courseId || e.course.slug === courseId)
  const progress = enrolledCourse?.progressPercent || 0
  const courseName = enrolledCourse?.course.title || 'Tên khóa học'

  const isEligible = progress === 100

  // Lấy dữ liệu chứng chỉ thật từ DB (nếu đã được mint)
  const { data: existingCertificate } = useQuery({
    queryKey: ['certificate', courseId],
    queryFn: () =>
      certificateApi.getMyCertificates().then((res) => res.data.find((c) => c.courseId === enrolledCourse?.course.id)),
    enabled: !!enrolledCourse
  })

  const isSuccess = existingCertificate?.status === 'COMPLETED'
  const txHash = existingCertificate?.txHash || ''
  const certificateId = existingCertificate
    ? `CT-${existingCertificate.courseId.slice(0, 8).toUpperCase()}`
    : `CT-${courseId.slice(0, 8).toUpperCase()}`
  const issueDate = existingCertificate
    ? new Date(existingCertificate.issuedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    : enrolledCourse?.completedAt
      ? new Date(enrolledCourse.completedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

  const mintMutation = useMutation({
    mutationFn: () => certificateApi.mintCertificate(enrolledCourse!.course.id),
    onSuccess: () => {
      // Invalidate để refetch chứng chỉ mới từ DB
      queryClient.invalidateQueries({ queryKey: ['certificate', courseId] })
      queryClient.invalidateQueries({ queryKey: ['my-certificates'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const msg = err?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!'
      setMintError(msg)
    }
  })

  const handleIssueCertificate = async () => {
    if (!isEligible || mintMutation.isPending) return
    setMintError(null)
    mintMutation.mutate()
  }

  if (!isMounted) return null

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return

    try {
      setIsDownloading(true)

      // Sử dụng html-to-image thay vì html2canvas để tránh lỗi compile của Turbopack
      const imgData = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2, // Chất lượng cao hơn
        cacheBust: true
      })

      // Calculate aspect ratio for A4 landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1056, 816] // Match our template dimensions
      })

      pdf.addImage(imgData, 'PNG', 0, 0, 1056, 816)
      pdf.save(`Certificate_${userName.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại!')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyHash = () => {
    if (!txHash) return
    navigator.clipboard.writeText(txHash)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto space-y-10 p-6 flex flex-col items-center justify-center min-h-[400px]'>
        <div className='w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
        <p className='text-slate-500 font-medium'>Đang tải thông tin chứng chỉ...</p>
      </div>
    )
  }

  if (!enrolledCourse && !isLoading) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='bg-rose-50 border border-rose-100 p-10 rounded-[40px] text-center'>
          <ShieldCheck size={48} className='mx-auto text-rose-500 mb-4' />
          <h2 className='text-xl font-bold text-rose-900'>Không tìm thấy thông tin khóa học</h2>
          <p className='text-rose-600 mt-2'>Bạn chưa đăng ký khóa học này hoặc khóa học không tồn tại.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto space-y-10 p-6'>
      {/* Hidden div for PDF generation to ensure 100% scale rendering in viewport */}
      <div
        className='fixed top-0 left-0 pointer-events-none overflow-hidden'
        style={{ zIndex: -9999, opacity: 0.01 }} // Dùng 0.01 thay vì 0 để tránh trình duyệt bỏ qua render
      >
        <CertificateTemplate
          ref={certificateRef}
          userName={userName}
          courseName={courseName}
          issueDate={issueDate}
          certificateId={certificateId}
          hash={txHash}
        />
      </div>

      {/* TRẠNG THÁI TIẾN ĐỘ */}
      <div className='bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 relative overflow-hidden'>
        <div className='relative z-10'>
          <span className='text-[10px] font-black uppercase text-primary tracking-[0.2em]'>Trạng thái hiện tại</span>
          <div className='flex justify-between items-end mt-2 mb-6'>
            <h2 className='text-4xl font-black text-slate-900'>Tiến độ học tập</h2>
            <div className='text-right'>
              <span className='text-5xl font-black text-primary leading-none'>{progress}%</span>
              <p className='text-xs font-bold text-slate-400 mt-1'>Hoàn thành khóa học</p>
            </div>
          </div>

          {/* Thanh Progress Bar bám sát thiết kế */}
          <div className='w-full bg-slate-100 h-4 rounded-full overflow-hidden'>
            <div
              className='bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              style={{ width: `${progress}%` }}
            />
          </div>

          {isEligible && (
            <div className='mt-6 flex items-center gap-2 text-sm font-bold text-emerald-500'>
              <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white'>
                <ShieldCheck size={12} />
              </div>
              <span>Chúc mừng! Bạn đã đủ điều kiện để nhận chứng chỉ.</span>
            </div>
          )}
        </div>
      </div>

      {/* KHU VỰC CẤP CHỨNG CHỈ */}
      <div className='bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
        <div className='space-y-6'>
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Cấp chứng chỉ khóa học</h3>
          <p className='text-sm text-slate-500 leading-relaxed font-medium'>
            Chứng chỉ của bạn sẽ được lưu trữ vĩnh viễn và bảo mật trên Blockchain. Bạn có thể sử dụng mã Hash để xác
            thực năng lực với nhà tuyển dụng.
          </p>

          {isEligible ? (
            <div className='space-y-4'>
              <button
                onClick={handleIssueCertificate}
                disabled={mintMutation.isPending || isSuccess}
                className={cn(
                  'w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl',
                  isSuccess
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-primary hover:bg-rose-600 text-white shadow-rose-100 active:scale-[0.98]'
                )}
              >
                {mintMutation.isPending ? (
                  <span className='flex items-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Đang tạo Hash...
                  </span>
                ) : isSuccess ? (
                  <>
                    <Sparkles size={20} /> Đã cấp chứng chỉ thành công
                  </>
                ) : (
                  <>
                    <Award size={20} /> Nhận chứng chỉ ngay
                  </>
                )}
              </button>

              {mintError && (
                <div className='p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-medium'>
                  {mintError}
                </div>
              )}

              {isSuccess && (
                <div className='p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4'>
                  <div className='flex items-start gap-3'>
                    <ShieldCheck className='text-emerald-500 shrink-0 mt-0.5' />
                    <div className='flex-1'>
                      <p className='font-bold text-emerald-800'>Chứng chỉ đã được xác thực trên Blockchain!</p>
                      <p className='text-emerald-600 text-sm mt-1 mb-2'>
                        Dữ liệu của bạn đã được ghi lại vĩnh viễn trên mạng lưới.
                      </p>

                      {/* Hash Info Box */}
                      <div className='bg-white border border-emerald-200 rounded-lg p-3 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                            Transaction Hash
                          </span>
                          <button
                            onClick={handleCopyHash}
                            className='text-slate-400 hover:text-emerald-600 transition-colors'
                            title='Copy Hash'
                          >
                            {isCopied ? <Check size={16} className='text-emerald-500' /> : <Copy size={16} />}
                          </button>
                        </div>
                        <p className='font-mono text-[10px] sm:text-xs text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-100'>
                          {txHash}
                        </p>
                      </div>

                      {/* View on Explorer Button */}
                      <a
                        href={`https://amoy.polygonscan.com/tx/${txHash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group'
                      >
                        Xem trên Blockchain Explorer
                        <ExternalLink
                          size={14}
                          className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Nút khi chưa đủ điều kiện */
            <div className='bg-slate-50 border border-slate-100 p-6 rounded-[30px] flex items-center justify-between opacity-60 cursor-not-allowed'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400'>
                  <Lock size={20} />
                </div>
                <div>
                  <p className='text-sm font-bold text-slate-800 uppercase tracking-tight'>
                    Chưa đủ điều kiện nhận chứng chỉ
                  </p>
                  <p className='text-[10px] font-bold text-slate-400'>Hoàn thành 100% khóa học để nhận chứng chỉ</p>
                </div>
              </div>
              <button disabled className='px-6 py-3 bg-slate-200 text-slate-400 rounded-xl font-black text-xs'>
                Nhận chứng chỉ
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Preview Chứng chỉ */}
        <div
          className='relative group border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center w-full'
          style={{ aspectRatio: '4/3' }}
        >
          {isSuccess ? (
            <div className='w-full h-full flex items-center justify-center overflow-hidden bg-white'>
              <div style={{ transform: 'scale(0.35)', transformOrigin: 'center' }}>
                <CertificateTemplate
                  userName={userName}
                  courseName={courseName}
                  issueDate={issueDate}
                  certificateId={certificateId}
                  hash={txHash}
                />
              </div>

              {/* Hover overlay for download */}
              <div className='absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4'>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className='bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg'
                >
                  <Eye size={20} />
                  Xem trước
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className='bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-600 transition-colors shadow-lg'
                >
                  {isDownloading ? (
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  ) : (
                    <Download size={20} />
                  )}
                  Tải PDF
                </button>
              </div>
            </div>
          ) : (
            <div className='text-center p-6'>
              <Award size={64} className='mx-auto text-slate-300 mb-4' />
              <p className='text-sm text-slate-500 font-medium'>Hoàn thành khóa học để xem chứng chỉ của bạn</p>
            </div>
          )}
        </div>
      </div>
      {/* Preview Modal */}
      {isPreviewOpen && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 sm:p-10 backdrop-blur-sm'
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            onClick={() => setIsPreviewOpen(false)}
            className='absolute top-6 right-6 text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors'
          >
            <X size={24} />
          </button>

          <div
            className='bg-white shadow-2xl rounded-sm overflow-auto max-w-[1056px] max-h-[100vh]'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scale down slightly on very small screens if needed, otherwise it just scrolls */}
            <div className='min-w-[1056px]'>
              <CertificateTemplate
                userName={userName}
                courseName={courseName}
                issueDate={issueDate}
                certificateId={certificateId}
                hash={txHash}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
