'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, FileText, Download, Bot } from 'lucide-react'

interface LessonTabsProps {
    lessonId: string
    description: string
    materials: { title: string; size: string; url: string }[]
}

export function LessonTabs({ lessonId, description, materials }: LessonTabsProps) {
    const [aiInput, setAiInput] = useState('')
    const [discussionInput, setDiscussionInput] = useState('')

    const handleSendAi = () => {
        if (!aiInput.trim()) return
        console.log('Sending to AI:', { lessonId, content: aiInput })
        setAiInput('')
    }

    const handleSendDiscussion = () => {
        if (!discussionInput.trim()) return
        console.log('Sending discussion:', { lessonId, content: discussionInput })
        setDiscussionInput('')
    }

    return (
        <Tabs defaultValue="description" className="w-full">
            {/* Tab Headers */}
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-6">
                <TabsTrigger value="description" className="tab-style">Mô tả</TabsTrigger>
                <TabsTrigger value="ai" className="tab-style flex items-center gap-1.5">
                    Hỏi đáp AI{' '}
                    <span className="bg-rose-100 text-primary text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide">
                        Mới
                    </span>
                </TabsTrigger>
                <TabsTrigger value="discussion" className="tab-style">Thảo luận</TabsTrigger>
                <TabsTrigger value="materials" className="tab-style">Tài liệu</TabsTrigger>
            </TabsList>

            {/* --- PHẦN MÔ TẢ --- */}
            <TabsContent value="description" className="mt-6">
                <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {description}
                </div>
            </TabsContent>

            {/* --- PHẦN HỎI ĐÁP AI --- */}
            <TabsContent value="ai" className="mt-6">
                <div className="bg-slate-50/80 rounded-3xl p-6 min-h-[400px] flex flex-col justify-between border border-slate-100">
                    {/* Luồng tin nhắn */}
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[85%] border border-slate-50 leading-relaxed">
                                Chào mừng bạn đến với trợ lý AI của LearnProof! Tôi đã nắm vững nội dung bài học về{' '}
                                <b>OKLCH</b>. Bạn có bất kỳ thắc mắc nào về lý thuyết hay cách áp dụng thực tế không?
                            </div>
                        </div>
                    </div>

                    {/* Form nhập liệu Pill-style */}
                    <div className="relative mt-4">
                        <input
                            type="text"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                            placeholder="Đặt câu hỏi về bài học này..."
                            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                        <Button
                            onClick={handleSendAi}
                            size="icon"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-11 w-11 bg-primary hover:bg-primary/90 shadow-md shadow-rose-200"
                        >
                            <Send size={18} className="text-white" />
                        </Button>
                    </div>
                </div>
            </TabsContent>

            {/* --- PHẦN THẢO LUẬN --- */}
            <TabsContent value="discussion" className="mt-6 space-y-8">
                <div className="flex gap-4 items-start">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src="/user-avatar.jpg" />
                        <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-sm">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <Textarea
                            value={discussionInput}
                            onChange={(e) => setDiscussionInput(e.target.value)}
                            placeholder="Chia sẻ suy nghĩ của bạn về bài học này..."
                            className="min-h-[120px] rounded-2xl border-slate-200 focus-visible:ring-primary/20 p-4 text-sm resize-none"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSendDiscussion}
                                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 font-bold text-xs h-11 shadow-lg shadow-rose-100"
                            >
                                Gửi thảo luận
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Danh sách các thảo luận cũ có thể render tại đây */}
            </TabsContent>

            {/* --- PHẦN TÀI LIỆU --- */}
            <TabsContent value="materials" className="mt-6 space-y-3">
                {materials.length > 0 ? (
                    materials.map((file, idx) => (
                        <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group cursor-pointer shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-primary transition-colors">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                                        {file.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-tighter">
                                        {file.size}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-300 hover:text-primary hover:bg-transparent"
                                asChild
                            >
                                <span>
                                    <Download size={20} />
                                </span>
                            </Button>
                        </a>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Chưa có tài liệu đính kèm cho bài học này.
                    </div>
                )}
            </TabsContent>

            <style jsx global>{`
                .tab-style {
                    border-radius: 0 !important;
                    border-bottom: 2px solid transparent !important;
                    background: transparent !important;
                    padding: 12px 20px !important;
                    font-weight: 700 !important;
                    font-size: 14px !important;
                    color: #64748b !important;
                    transition: all 0.2s !important;
                }
                .tab-style[data-state='active'] {
                    color: #e11d48 !important;
                    border-bottom-color: #e11d48 !important;
                }
            `}</style>
        </Tabs>
    )
}