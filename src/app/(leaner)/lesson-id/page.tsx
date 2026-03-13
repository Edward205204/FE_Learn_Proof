import { VideoPlayer } from '../_components/video-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LessonPage({ params }: { params: { id: string } }) {
    const lessonData = {
        id: params.id,
        title: "Thiết kế với OKLCH: Tương lai của không gian màu",
        videoUrl: "https://your-video-url.mp4",
        lastPosition: 125, // Ví dụ: 2 phút 5 giây
        content: "Trong bài học này, chúng ta sẽ đi sâu vào mô hình màu OKLCH..."
    };

    return (
        <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* PHẦN 1: VIDEO & TIÊU ĐỀ (Chiếm 2/3) */}
            <div className="lg:col-span-2 space-y-6">
                <VideoPlayer url={lessonData.videoUrl} lastPosition={lessonData.lastPosition} lessonId={lessonData.id} />

                <h1 className="text-2xl font-extrabold text-slate-900">{lessonData.title}</h1>

                {/* PHẦN 3: TABS NỘI DUNG / HỎI ĐÁP AI */}
                <Tabs defaultValue="mote" className="w-full">
                    <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
                        <TabsTrigger value="mote" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 font-bold">Mô tả</TabsTrigger>
                        <TabsTrigger value="ai" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 font-bold">Hỏi đáp AI <span className="ml-1 bg-rose-100 text-primary text-[10px] px-1 rounded">MỚI</span></TabsTrigger>
                        <TabsTrigger value="thaoluan" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 font-bold">Thảo luận</TabsTrigger>
                        <TabsTrigger value="tailieu" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2 font-bold">Tài liệu</TabsTrigger>

                    </TabsList>

                    <TabsContent value="mote" className="py-6 text-slate-600 leading-relaxed">
                        {lessonData.content}
                    </TabsContent>
                    <TabsContent value="ai">
                        {/* Tích hợp component AI Chat tại đây */}
                    </TabsContent>
                </Tabs>
            </div>

            {/* PHẦN 2: DANH SÁCH BÀI HỌC (Sidebar 1/3) */}
            <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-4">Nội dung khóa học</h3>
                    <div className="space-y-2">
                        {/* Map qua danh sách chương/bài học tại đây */}
                        <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl text-primary font-medium border border-rose-100">
                            <span className="text-sm">3. Thiết kế với OKLCH</span>
                            <span className="text-xs">32:10</span>
                        </div>
                        {/* Các bài học khác... */}
                    </div>

                    <button className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                        Bài học tiếp theo
                        <span className="text-xl">→</span>
                    </button>
                </div>
            </div>
        </main>
    );
}