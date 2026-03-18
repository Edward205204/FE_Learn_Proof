import { CertificateAction } from '../../_components/certificate-action'
import { CheckCircle2, Award, Zap } from 'lucide-react'

// Giả lập dữ liệu fetch từ Server (Sau này bạn sẽ thay bằng gọi API/Database)
async function getCourseProgress(_courseId: string) {
    // Demo: Trả về 100 để test trạng thái đủ điều kiện
    return {
        progress: 100,
        courseName: "LearnProof Masterclass: Blockchain Development",
        isCompleted: true
    }
}

export default async function CertificatePage({ params }: { params: { courseId: string } }) {
    const courseData = await getCourseProgress(params.courseId)

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            {/* Header đơn giản có Logo */}
            <header className="max-w-7xl mx-auto p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">L</div>
                    <span className="font-black text-xl tracking-tight text-slate-900">LearnProof</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                        <img src="/api/placeholder/40/40" alt="Avatar" />
                    </div>
                </div>
            </header>

            <main className="mt-10">
                {/* Component xử lý logic và hiển thị nút cấp bằng */}
                <CertificateAction
                    progress={courseData.progress}
                    courseName={courseData.courseName}
                />

                {/* Thông tin bổ sung dưới chân trang */}
                <div className="max-w-4xl mx-auto mt-12 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-[30px] border border-slate-50 shadow-sm">
                            <div className="w-12 h-12 bg-rose-50 text-primary rounded-2xl flex items-center justify-center mb-4">
                                <Zap size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">Cấp bằng tức thì</h4>
                            <p className="text-[11px] text-slate-400 mt-2">Nhận chứng chỉ ngay sau khi hoàn thành bài học cuối cùng.</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-[30px] border border-slate-50 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle2 size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">Xác thực vĩnh viễn</h4>
                            <p className="text-[11px] text-slate-400 mt-2">Dữ liệu được lưu trữ trên mạng lưới Blockchain minh bạch.</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-[30px] border border-slate-50 shadow-sm">
                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
                                <Award size={24} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">Giá trị quốc tế</h4>
                            <p className="text-[11px] text-slate-400 mt-2">Chứng chỉ có mã QR code để nhà tuyển dụng dễ dàng kiểm tra.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <span className="w-10 h-[1px] bg-slate-200"></span>
                            Secured by Blockchain Technology
                            <span className="w-10 h-[1px] bg-slate-200"></span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-4">© 2024 LearnProof Education. All rights reserved.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}