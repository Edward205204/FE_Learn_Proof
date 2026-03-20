import Link from 'next/link';
import { Star, Clock, BookOpen, Trash2, ChevronRight } from 'lucide-react';

const MOCK_WISHLIST = [
  {
    id: '1',
    title: 'Khóa học Lập trình Web Fullstack với Next.js 14 & React',
    instructor: 'Tiến Sĩ Nguyễn Văn A',
    rating: 4.8,
    reviews: 1250,
    price: 1290000,
    originalPrice: 2500000,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    duration: '32 giờ',
    lessons: 120
  },
  {
    id: '2',
    title: 'Thiết kế UI/UX Thực chiến với Figma - Từ Cơ bản đến Nâng cao',
    instructor: 'Trần Thị B',
    rating: 4.9,
    reviews: 3420,
    price: 890000,
    originalPrice: 1500000,
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=800&auto=format&fit=crop',
    duration: '18 giờ',
    lessons: 85
  },
  {
    id: '3',
    title: 'Mastering TypeScript & Clean Architecture',
    instructor: 'Lê Văn C',
    rating: 4.7,
    reviews: 890,
    price: 1500000,
    originalPrice: 3000000,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    duration: '45 giờ',
    lessons: 150
  }
];

export default function WishlistPage() {
  return (
    <div className="container mx-auto py-10 px-6 max-w-[1200px]">
      <nav className="flex items-center gap-2 text-[12px] font-black tracking-widest uppercase text-slate-400 mb-8 mt-2">
        <Link href="/" className="hover:text-[oklch(0.577_0.245_27.325)] transition-colors">Trang chủ</Link>
        <ChevronRight size={14} />
        <span className="text-[oklch(0.577_0.245_27.325)]">Yêu thích</span>
      </nav>
      <h1 className="text-3xl font-bold mb-8 text-[oklch(0.141_0.005_285.823)] dark:text-white">
        Khóa học Yêu thích
      </h1>
      
      {MOCK_WISHLIST.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_WISHLIST.map((course) => (
            <div key={course.id} className="group relative rounded-xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] overflow-hidden shadow-sm hover:shadow-md transition-all">
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all z-10 shadow-sm" title="Xóa khỏi yêu thích">
                  <Trash2 size={18} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white mb-2 group-hover:text-[oklch(0.577_0.245_27.325)] transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-[oklch(0.552_0.016_285.938)] mb-3">
                  {course.instructor}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-[oklch(0.577_0.245_27.325)]">{course.rating}</span>
                  <div className="flex text-[oklch(0.577_0.245_27.325)]">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <span className="text-xs text-[oklch(0.552_0.016_285.938)]">({course.reviews.toLocaleString()})</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-[oklch(0.552_0.016_285.938)] mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{course.lessons} bài học</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]">
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white block">
                      {course.price.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-sm text-[oklch(0.552_0.016_285.938)] line-through">
                      {course.originalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <button className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-[oklch(0.21_0.006_285.885)] rounded-2xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]">
          <p className="text-[oklch(0.552_0.016_285.938)] mb-4">Bạn chưa có khóa học nào trong danh sách yêu thích.</p>
          <Link href="/courses" className="inline-flex px-6 py-3 bg-[oklch(0.577_0.245_27.325)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Khám phá ngay
          </Link>
        </div>
      )}
    </div>
  );
}
