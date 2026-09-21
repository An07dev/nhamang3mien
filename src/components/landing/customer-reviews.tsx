'use client';

import { Star, CheckCircle, Quote, ThumbsUp, MessageSquare, MapPin } from 'lucide-react';

interface CustomerReviewsProps {
  onOpenConsult: () => void;
}

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  location: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  packageName: string;
  rating: number;
  comment: string;
  date: string;
  avatarColor: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Hoàng Quốc Tuấn',
    role: 'Kỹ sư phần mềm & Gia đình 4 người',
    location: 'Chung cư Times City, Hà Nội',
    region: 'Bắc',
    packageName: 'Gói Sky (1 Gbps)',
    rating: 5,
    comment:
      'Nhà mình tối đến 2 cháu học online, vợ xem Netflix 4K, mình làm việc và chơi game cùng lúc mà ping vẫn luôn xanh 4ms - 6ms. Modem Wi-Fi 6 phát sóng rất mạnh, phòng ngủ đóng cửa vẫn bắt đầy vạch sóng. Kỹ thuật viên lắp đặt gọn gàng, nhiệt tình.',
    date: '3 ngày trước',
    avatarColor: 'from-orange-500 to-amber-500',
  },
  {
    id: '2',
    name: 'Lê Thanh Thảo',
    role: 'Chủ Homestay & Cafe Biển',
    location: 'Đường Võ Nguyên Giáp, Đà Nẵng',
    region: 'Trung',
    packageName: 'Gói Lux 500 Mesh Wi-Fi 6',
    rating: 5,
    comment:
      'Quán cafe kết hợp homestay của mình thường xuyên có 50 - 70 khách ngồi làm việc từ xa. Trước đây dùng mạng cũ hay bị nghẽn giờ cao điểm, từ khi chuyển sang gói Lux 500 của Nhà Mạng Ba Miền thì khách khen nức nở. Sóng phủ kín 3 tầng không cần đổi mạng.',
    date: '1 tuần trước',
    avatarColor: 'from-purple-600 to-pink-500',
  },
  {
    id: '3',
    name: 'Trần Minh Quân',
    role: 'Streamer & Sáng tạo nội dung',
    location: 'Khu đô thị Phú Mỹ Hưng, Quận 7, TP.HCM',
    region: 'Nam',
    packageName: 'Gói Meta (1 Gbps) + Combo Truyền Hình',
    rating: 5,
    comment:
      'Gói Meta tốc độ Upload 1 Gbps tải video 4K lên YouTube và livestream chỉ mất vài chục giây. Bố mẹ mình ở nhà thì mê tít xem giải Ngoại Hạng Anh trên đầu thu điều khiển giọng nói, chuyển kênh cực nhanh và hình ảnh sắc nét.',
    date: '2 tuần trước',
    avatarColor: 'from-blue-600 to-cyan-500',
  },
  {
    id: '4',
    name: 'Nguyễn Văn Hậu',
    role: 'Chủ Doanh nghiệp Thủy Sản',
    location: 'Quận Ninh Kiều, Cần Thơ',
    region: 'Nam',
    packageName: 'Gói Doanh Nghiệp Super 250',
    rating: 5,
    comment:
      'Tôi đăng ký online qua website lúc 9h sáng, đến 2h chiều kỹ thuật viên đã có mặt kéo cáp hoàn thiện và bàn giao mật khẩu modem. Thủ tục rất nhanh chỉ cần chụp ảnh CCCD, được miễn toàn bộ tiền cọc khi thanh toán trước.',
    date: '3 tuần trước',
    avatarColor: 'from-emerald-600 to-teal-500',
  },
];

export default function CustomerReviews({ onOpenConsult }: CustomerReviewsProps) {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">

          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Đánh Giá Thực Tế Từ Khách Hàng 3 Miền
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Hơn <strong className="text-zinc-900 dark:text-white font-bold">2.500.000+</strong> cá nhân, hộ gia đình và doanh nghiệp khắp Bắc - Trung - Nam tin dùng và hài lòng.
          </p>
        </div>

        {/* Overall Ratings Overview Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 mb-10 sm:mb-12 shadow-sm text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
              ))}
            </div>
            <div className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">4.9 / 5.0</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">Mức độ hài lòng chung</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-black text-[#FF6320]">98.6%</div>
            <div className="text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-semibold">Khách hàng sẵn sàng giới thiệu</div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400">Cho bạn bè và người thân</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">12h - 36h</div>
            <div className="text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-semibold">Thời gian kéo mạng siêu tốc</div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400">Nghiệm thu đạt chuẩn tại nhà</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">24/7/365</div>
            <div className="text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-300 font-semibold">Tổng đài tiếp nhận sự cố</div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400">Xử lý kỹ thuật tận nơi trong 2h</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-200 dark:text-zinc-700 pointer-events-none group-hover:text-orange-200 dark:group-hover:text-orange-950 transition-colors" />

              <div>
                {/* Rating Stars & Region Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/60 text-[#FF6320] border border-orange-200 dark:border-orange-900/60">
                    Miền {rev.region}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${rev.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0`}
                  >
                    {rev.name.split(' ').slice(-1)[0][0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        {rev.name}
                      </h4>
                      <span title="Khách hàng đã xác thực" className="inline-flex">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 text-white" />
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FF6320]" />
                      <span>{rev.location}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-md">
                    {rev.packageName}
                  </span>
                  <span className="block text-[10px] text-zinc-400 mt-1">{rev.date}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="text-center">
          <button
            onClick={onOpenConsult}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trở Thành Khách Hàng Tiếp Theo Của Chúng Tôi</span>
          </button>
        </div>

      </div>
    </section>
  );
}
