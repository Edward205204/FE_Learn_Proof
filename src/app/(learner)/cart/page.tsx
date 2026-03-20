import { Star, Trash2, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

const MOCK_CART = [
  {
    id: '1',
    title: 'Khóa học Lập trình Web Fullstack với Next.js 14 & React',
    instructor: 'Tiến Sĩ Nguyễn Văn A',
    rating: 4.8,
    reviews: 1250,
    price: 1290000,
    originalPrice: 2500000,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
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
  }
];

export default function CartPage() {
  const totalPrice = MOCK_CART.reduce((sum, item) => sum + item.price, 0);
  const totalOriginalPrice = MOCK_CART.reduce((sum, item) => sum + item.originalPrice, 0);
  const discount = totalOriginalPrice - totalPrice;

  return (
    <div className="container mx-auto py-10 px-6 max-w-[1200px]">
      <h1 className="text-3xl font-bold mb-8 text-[oklch(0.141_0.005_285.823)] dark:text-white">
        Giỏ hàng của bạn ({MOCK_CART.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {MOCK_CART.map((course) => (
            <div key={course.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] relative pr-12 group transition-all hover:shadow-sm">
              <div className="w-full sm:w-40 aspect-video sm:aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white group-hover:text-[oklch(0.577_0.245_27.325)] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[oklch(0.552_0.016_285.938)] mt-1">
                    bởi <span className="text-blue-500">{course.instructor}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-[oklch(0.577_0.245_27.325)] text-sm">{course.rating}</span>
                    <div className="flex text-[oklch(0.577_0.245_27.325)]">
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-xs text-[oklch(0.552_0.016_285.938)]">({course.reviews} đánh giá)</span>
                  </div>
                </div>

                <div className="mt-4 flex sm:hidden items-center gap-3">
                  <span className="text-xl font-bold text-[oklch(0.577_0.245_27.325)]">
                    {course.price.toLocaleString('vi-VN')} đ
                  </span>
                  <span className="text-sm text-[oklch(0.552_0.016_285.938)] line-through">
                    {course.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Price Right side */}
              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 w-32 justify-between">
                <div className="text-right">
                  <div className="text-xl font-bold text-[oklch(0.577_0.245_27.325)] block">
                    {course.price.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-sm text-[oklch(0.552_0.016_285.938)] line-through mt-1">
                    {course.originalPrice.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button className="absolute top-4 right-4 text-[oklch(0.552_0.016_285.938)] hover:text-red-500 transition-colors p-1" title="Xóa khỏi giỏ hàng">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 p-6 rounded-2xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Tổng cộng</h2>

            <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-[oklch(0.552_0.016_285.938)]">
              <div className="flex items-center justify-between">
                <span>Tạm tính:</span>
                <span className="font-medium text-gray-900 dark:text-white">{totalOriginalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex items-center justify-between text-green-600 dark:text-green-500">
                <span>Giảm giá:</span>
                <span>-{discount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]">
                <Tag size={18} className="text-[oklch(0.552_0.016_285.938)]" />
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 dark:text-white placeholder:text-[oklch(0.552_0.016_285.938)]"
                />
                <button className="text-blue-600 dark:text-blue-500 font-medium whitespace-nowrap">Áp dụng</button>
              </div>
            </div>

            <div className="pt-4 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] mb-6">
              <div className="flex items-end justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">Thành tiền:</span>
                <span className="text-3xl font-bold text-[oklch(0.577_0.245_27.325)]">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <p className="text-xs text-[oklch(0.552_0.016_285.938)] text-right">Đã bao gồm thuế (nếu có)</p>
            </div>

            <button className="w-full py-4 px-6 bg-[oklch(0.577_0.245_27.325)] hover:opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity mb-4 shadow-lg shadow-[oklch(0.577_0.245_27.325)]/20">
              Tiến hành thanh toán <ArrowRight size={20} />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Đảm bảo hoàn tiền trong 30 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
