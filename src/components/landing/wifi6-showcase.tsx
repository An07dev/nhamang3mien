'use client';

import { Wifi, Cpu, Zap, ShieldCheck, Layers, Gauge, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { trackInitiateCheckout } from '@/lib/meta-pixel';

interface Wifi6ShowcaseProps {
  onOpenConsult: () => void;
}

export default function Wifi6Showcase({ onOpenConsult }: Wifi6ShowcaseProps) {
  return (
    <section id="wifi6" className="py-16 sm:py-20 bg-gradient-to-b from-white via-orange-50/30 to-white text-zinc-900 relative overflow-hidden scroll-mt-20 border-t border-zinc-100">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
            Khối Công Nghệ Modem Wi-Fi 6 <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FF6320] via-[#E05216] to-[#FF8533] bg-clip-text text-transparent">
              Bứt Phá Giới Hạn &bull; So Sánh Khác Biệt
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            FPT 3 Miền tiên phong trang bị hoàn toàn <strong className="text-zinc-900 font-bold">miễn phí Modem Wi-Fi 6 chuẩn AX</strong> cho tất cả khách hàng đăng ký mới. Trải nghiệm kết nối không độ trễ, xuyên tường vượt bậc.
          </p>
        </div>

        {/* Comparison Table: Wi-Fi 6 vs Wi-Fi 5 */}
        <div className="mb-14 rounded-2xl sm:rounded-3xl bg-white border-2 border-orange-100 shadow-xl p-4 sm:p-8">
          <div className="text-center sm:text-left mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base sm:text-xl font-black text-zinc-900">
                Bảng Đối Chiếu: Wi-Fi 6 (Chuẩn AX) &amp; Wi-Fi 5 (Chuẩn Cũ)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Xem sự khác biệt vượt trội khi nâng cấp lên công nghệ mới nhất</p>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden flex items-center justify-end text-[11px] text-[#FF6320] mb-2 font-medium">
            <span>&larr; Vuốt ngang để xem so sánh đầy đủ &rarr;</span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3 sm:px-4">Tiêu chí so sánh</th>
                  <th className="py-3 px-3 sm:px-4 text-zinc-500 bg-zinc-50 rounded-t-xl">Wi-Fi 5 Cũ (AC1200)</th>
                  <th className="py-3 px-3 sm:px-4 text-[#FF6320] bg-orange-50 rounded-t-xl font-black">
                    Wi-Fi 6 Mới Của FPT 3 Miền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Tốc độ truyền tải tối đa</span>
                  </td>
                  <td className="py-4 px-4 bg-zinc-50 text-zinc-500">~300 - 450 Mbps</td>
                  <td className="py-4 px-4 bg-orange-50/70 font-bold text-zinc-900 flex-1">
                    <span className="text-emerald-600 font-black">Lên đến 1.000 - 3.000 Mbps</span> (Nhanh gấp 3x)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Độ trễ tín hiệu (Latency)</span>
                  </td>
                  <td className="py-4 px-4 bg-zinc-50 text-zinc-500">30ms - 50ms (Dễ giật lag)</td>
                  <td className="py-4 px-4 bg-orange-50/70 font-bold text-zinc-900">
                    <span className="text-emerald-600 font-black">&lt; 10ms</span> (Giảm 75%, tối ưu chơi game &amp; livestream)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Số thiết bị chịu tải cùng lúc</span>
                  </td>
                  <td className="py-4 px-4 bg-zinc-50 text-zinc-500">10 - 15 máy (Bắt đầu nghẽn)</td>
                  <td className="py-4 px-4 bg-orange-50/70 font-bold text-zinc-900">
                    <span className="text-emerald-600 font-black">30 - 60 thiết bị đồng thời</span> (Cả nhà dùng mượt)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Khả năng phủ sóng &amp; xuyên tường</span>
                  </td>
                  <td className="py-4 px-4 bg-zinc-50 text-zinc-500">Sóng suy giảm khi qua tường bê tông</td>
                  <td className="py-4 px-4 bg-orange-50/70 font-bold text-zinc-900">
                    <span className="text-emerald-600 font-black">Beamforming định hướng chùm sóng</span>, xuyên tường tốt
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tiêu chuẩn bảo mật</span>
                  </td>
                  <td className="py-4 px-4 bg-zinc-50 text-zinc-500">Chuẩn WPA2 cũ</td>
                  <td className="py-4 px-4 bg-orange-50/70 font-bold text-zinc-900">
                    <span className="text-emerald-600 font-black">Chuẩn mã hóa WPA3 cao cấp</span> (Chống hack pass wifi)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#FF6320] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-snug">
                Chip Xử Lý Thế Hệ Mới
              </h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tích hợp vi xử lý đa nhân chuyên biệt, đảm bảo modem vận hành mát mẻ và ổn định liên tục 24/7/365 mà không cần khởi động lại.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-snug">
                Công Nghệ OFDMA &amp; MU-MIMO
              </h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Phân chia kênh truyền tải dữ liệu đến nhiều máy cùng một phần nghìn giây, loại bỏ hoàn toàn hiện tượng xếp hàng chờ đợi gói tin.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-snug">
                Tiết Kiệm Pin Thiết Bị (TWT)
              </h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Công nghệ Target Wake Time cho phép điện thoại và laptop chỉ kích hoạt wifi khi truyền nhận, giúp tăng đáng kể thời lượng pin thiết bị.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Wifi className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-snug">
                Dễ Dàng Mở Rộng Mesh
              </h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Khả năng liên kết thêm các cục phát phụ Mesh chỉ bằng 1 nút bấm, phủ kín biệt thự, nhà nhiều tầng với 1 tên wifi và mật khẩu duy nhất.
            </p>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-lg shadow-orange-500/5">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-zinc-900">
              Muốn Trải Nghiệm Ngay Tốc Độ Vượt Trội Của Modem Wi-Fi 6?
            </h4>
            <p className="text-xs text-zinc-600">
              Đăng ký lắp đặt hôm nay để được trang bị miễn phí modem chuẩn AX trị giá 1.200.000đ.
            </p>
          </div>

          <button
            onClick={() => {
              trackInitiateCheckout({
                packageName: 'Modem Wi-Fi 6 Chuẩn AX Miễn Phí',
                category: 'Thiết Bị Modem',
                source: 'Khối Giới Thiệu Wi-Fi 6',
              });
              onOpenConsult();
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Nhận Modem Wi-Fi 6 Miễn Phí</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
