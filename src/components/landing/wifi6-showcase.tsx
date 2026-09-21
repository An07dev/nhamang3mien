'use client';

import { Wifi, Cpu, Zap, ShieldCheck, Layers, Gauge, Check, X, ArrowRight, Sparkles } from 'lucide-react';

interface Wifi6ShowcaseProps {
  onOpenConsult: () => void;
}

export default function Wifi6Showcase({ onOpenConsult }: Wifi6ShowcaseProps) {
  return (
    <section id="wifi6" className="py-16 sm:py-20 bg-gradient-to-b from-zinc-950 via-[#131924] to-zinc-950 text-white relative overflow-hidden scroll-mt-20">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FF6320]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Khối Công Nghệ Modem Wi-Fi 6 <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FF6320] via-[#FFA153] to-[#FFCD6C] bg-clip-text text-transparent">
              Bứt Phá Giới Hạn &bull; So Sánh Khác Biệt
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            FPT 3 Miền tiên phong trang bị hoàn toàn <strong className="text-white">miễn phí Modem Wi-Fi 6 chuẩn AX</strong> cho tất cả khách hàng đăng ký mới. Trải nghiệm kết nối không độ trễ, xuyên tường vượt bậc.
          </p>
        </div>

        {/* Comparison Table: Wi-Fi 6 vs Wi-Fi 5 */}
        <div className="mb-14 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 sm:p-8 shadow-2xl">
          <div className="text-center sm:text-left mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base sm:text-xl font-black text-white">
                Bảng Đối Chiếu: Wi-Fi 6 (Chuẩn AX) &amp; Wi-Fi 5 (Chuẩn Cũ)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Xem sự khác biệt vượt trội khi nâng cấp lên công nghệ mới nhất</p>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="sm:hidden flex items-center justify-end text-[11px] text-[#FFA153] mb-2 font-medium">
            <span>&larr; Vuốt ngang để xem so sánh đầy đủ &rarr;</span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3 sm:px-4">Tiêu chí so sánh</th>
                  <th className="py-3 px-3 sm:px-4 text-zinc-400 bg-white/5 rounded-t-xl">Wi-Fi 5 Cũ (AC1200)</th>
                  <th className="py-3 px-3 sm:px-4 text-[#FFCD6C] bg-gradient-to-r from-[#FF6320]/25 to-transparent rounded-t-xl font-black">
                    Wi-Fi 6 Mới Của FPT 3 Miền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-200">
                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>Tốc độ truyền tải tối đa</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 text-zinc-400">~300 - 450 Mbps</td>
                  <td className="py-4 px-4 bg-[#FF6320]/10 font-bold text-white flex-1">
                    <span className="text-emerald-400 font-black">Lên đến 1.000 - 3.000 Mbps</span> (Nhanh gấp 3x)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Độ trễ tín hiệu (Latency)</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 text-zinc-400">30ms - 50ms (Dễ giật lag)</td>
                  <td className="py-4 px-4 bg-[#FF6320]/10 font-bold text-white">
                    <span className="text-emerald-400 font-black">&lt; 10ms</span> (Giảm 75%, tối ưu chơi game &amp; livestream)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Số thiết bị chịu tải cùng lúc</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 text-zinc-400">10 - 15 máy (Bắt đầu nghẽn)</td>
                  <td className="py-4 px-4 bg-[#FF6320]/10 font-bold text-white">
                    <span className="text-emerald-400 font-black">30 - 60 thiết bị đồng thời</span> (Cả nhà dùng mượt)
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Khả năng phủ sóng &amp; xuyên tường</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 text-zinc-400">Sóng suy giảm khi qua tường bê tông</td>
                  <td className="py-4 px-4 bg-[#FF6320]/10 font-bold text-white">
                    <span className="text-emerald-400 font-black">Beamforming định hướng chùm sóng</span>, xuyên tường tốt
                  </td>
                </tr>

                <tr>
                  <td className="py-4 px-4 font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tiêu chuẩn bảo mật</span>
                  </td>
                  <td className="py-4 px-4 bg-white/5 text-zinc-400">Chuẩn WPA2 cũ</td>
                  <td className="py-4 px-4 bg-[#FF6320]/10 font-bold text-white">
                    <span className="text-emerald-400 font-black">Chuẩn mã hóa WPA3 cao cấp</span> (Chống hack pass wifi)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#FF6320]/20 text-[#FFA153] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                Chip Xử Lý Thế Hệ Mới
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tích hợp vi xử lý đa nhân chuyên biệt, đảm bảo modem vận hành mát mẻ và ổn định liên tục 24/7/365 mà không cần khởi động lại.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                Công Nghệ OFDMA &amp; MU-MIMO
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Phân chia kênh truyền tải dữ liệu đến nhiều máy cùng một phần nghìn giây, loại bỏ hoàn toàn hiện tượng xếp hàng chờ đợi gói tin.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                Tiết Kiệm Pin Thiết Bị (TWT)
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Công nghệ Target Wake Time cho phép điện thoại và laptop chỉ kích hoạt wifi khi truyền nhận, giúp tăng đáng kể thời lượng pin thiết bị.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Wifi className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                Dễ Dàng Mở Rộng Mesh
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Khả năng liên kết thêm các cục phát phụ Mesh chỉ bằng 1 nút bấm, phủ kín biệt thự, nhà nhiều tầng với 1 tên wifi và mật khẩu duy nhất.
            </p>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FF6320]/20 via-white/5 to-[#FFA153]/20 border border-[#FFCD6C]/40 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-white">
              Muốn Trải Nghiệm Ngay Tốc Độ Vượt Trội Của Modem Wi-Fi 6?
            </h4>
            <p className="text-xs text-zinc-300">
              Đăng ký lắp đặt hôm nay để được trang bị miễn phí modem chuẩn AX trị giá 1.200.000đ.
            </p>
          </div>

          <button
            onClick={onOpenConsult}
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
