'use client'

import { ChevronRight, CreditCard, Star, ShieldCheck } from 'lucide-react'

export default function OrderConfirmationPage() {
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            {/* Tiêu đề trang */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Xác nhận Đơn hàng</h1>
                <p className="text-slate-500 mt-2">Vui lòng kiểm tra lại thông tin khóa học trước khi thanh toán</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI: Chi tiết & Phương thức */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Section 1: Chi tiết khóa học */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                        <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                            <span className="p-2 bg-rose-50 text-primary rounded-lg">🛍️</span>
                            Chi tiết khóa học
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-56 h-36 bg-slate-200 rounded-2xl flex items-center justify-center">
                                {/* Placeholder cho ảnh khóa học */}
                                <div className="w-12 h-12 bg-white rounded-full opacity-50" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Khóa học trực tuyến</span>
                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                                    Thiết kế UI/UX Chuyên nghiệp 2024
                                </h3>
                                <p className="text-sm text-slate-500">👤 Giảng viên: Nguyễn Văn A</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1 text-sm font-bold">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        4.9 <span className="font-normal text-slate-400">(1,240 đánh giá)</span>
                                    </div>
                                    <span className="text-lg font-black text-slate-900">1.200.000đ</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Phương thức thanh toán */}
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                        <h2 className="font-bold text-slate-800 mb-6 text-lg">Phương thức thanh toán</h2>
                        <div className="p-5 rounded-2xl border-2 border-rose-100 bg-rose-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Thẻ Visa / Mastercard</p>
                                    <p className="text-xs text-slate-500">Đuôi thẻ **** 1234</p>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI: Tóm tắt thanh toán */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 sticky top-6">
                        <h2 className="font-bold text-slate-800 mb-6 text-lg">Tóm tắt thanh toán</h2>

                        <div className="space-y-4 pb-6 border-b border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tạm tính</span>
                                <span className="font-bold text-slate-800">1.200.000đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Giảm giá</span>
                                <span className="font-bold text-emerald-500">0đ</span>
                            </div>
                            <div className="flex justify-between items-center bg-rose-50/50 p-3 rounded-xl">
                                <span className="text-xs text-slate-500">Mã giảm giá (Coupon)</span>
                                <button className="text-xs font-bold text-primary hover:underline">Áp dụng ngay</button>
                            </div>
                        </div>

                        <div className="py-6 flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
                            <span className="text-2xl font-black text-slate-900">1.200.000đ</span>
                        </div>

                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-100 active:scale-[0.98]">
                            Xác nhận Thanh toán
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="mt-6 space-y-3">
                            <p className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
                                <ShieldCheck className="w-3 h-3" />
                                Thanh toán bảo mật SSL 128-bit
                            </p>
                            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                                Bằng việc xác nhận thanh toán, bạn đồng ý với các Điều khoản và Chính sách bảo mật của LearnProof.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}