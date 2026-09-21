'use client';

import { useState } from 'react';
import { Wifi, Gift, Zap, ShieldCheck, CheckCircle2, Loader2, Sparkles, Tv } from 'lucide-react';

interface HeroBannerProps {
  onOpenModal?: (packageName?: string) => void;
}

export default function HeroBanner({ onOpenModal }: HeroBannerProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [packageInterest, setPackageInterest] = useState('Gói Sky (1 Gbps) - Bán chạy');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/dang-ky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          province,
          packageInterest,
          source: 'Đăng Ký Liền Tay (Hero Banner)',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Đăng ký thành công! Chuyên viên FPT 3 Miền sẽ liên hệ hỗ trợ trong vòng 5 phút.',
        });
        setName('');
        setPhone('');
      } else {
        setResult({
          success: false,
          error: data.error || 'Có lỗi xảy ra, quý khách vui lòng thử lại.',
        });
      }
    } catch (err) {
      console.error('Lỗi khi gửi đăng ký:', err);
      setResult({
        success: false,
        error: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#121826] via-[#1F2636] to-[#0D111A] text-white py-12 lg:py-16">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6320]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Hero Value Proposition */}
          <div className="lg:col-span-7 space-y-6">

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
              Lắp Wifi FPT 3 Miền <br />
              <span className="bg-gradient-to-r from-[#FF6320] via-[#FFA153] to-[#FFCD6C] bg-clip-text text-transparent">
                Tốc Độ Cực Đỉnh &bull; Quà Khủng
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
              Trang bị miễn phí <strong className="text-white font-bold">Modem Wi-Fi 6 thế hệ mới</strong>,
              tốc độ siêu việt lên đến <strong className="text-orange-400 font-bold">1 Gbps</strong>.
              Thưởng thức trọn vẹn 380 trận Ngoại Hạng Anh độc quyền 4K cùng truyền hình thông minh.
            </p>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FF6320]/20 flex items-center justify-center text-[#FFA153] mb-2">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Modem Wi-Fi 6</div>
                <div className="text-[11px] text-zinc-400">Trang bị hoàn toàn miễn phí</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Lắp Nhanh 12h - 36h</div>
                <div className="text-[11px] text-zinc-400">Triển khai thần tốc mọi ngày</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white">Tặng Đến 2 Tháng Cước</div>
                <div className="text-[11px] text-zinc-400">Khi thanh toán trước 6 - 12T</div>
              </div>
            </div>

            {/* Quick Action Link - 1 single line on mobile */}
            <div className="pt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href="#packages"
                className="h-11 sm:h-12 px-2.5 sm:px-6 rounded-full bg-white text-zinc-900 font-extrabold text-xs sm:text-sm hover:bg-zinc-100 transition-colors shadow-lg flex items-center justify-center text-center whitespace-nowrap"
              >
                <span>Xem Bảng Giá Cước</span>
              </a>
              <a
                href="#combos"
                className="h-11 sm:h-12 px-2 sm:px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-orange-300 hover:text-white transition-all flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-center whitespace-nowrap"
              >
                <Tv className="w-3.5 h-3.5 shrink-0 text-orange-400" />
                <span>Combo Truyền Hình &rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Lead Consultation Form */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#242424]/85 backdrop-blur-2xl p-6 sm:p-8 border border-[#FFCD6C]/60 shadow-2xl">

              {/* Badge Form Header */}
              <div className="text-center pb-4 border-b border-white/10 mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Đăng Ký Liền Tay
                </h2>
                <p className="text-xs sm:text-sm text-[#FFCD6C] font-semibold mt-1">
                  Nhận ngay Modem Wi-Fi 6 Miễn Phí &amp; Giảm 30% Cước
                </p>
              </div>

              {result?.success ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Đăng Ký Thành Công!</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed px-4">
                    {result.message}
                  </p>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-2 rounded-full border border-white/30 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Đăng ký số khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {result?.error && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-medium">
                      {result.error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Họ và tên khách hàng <span className="text-[#FF6320]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Số điện thoại nhận tư vấn <span className="text-[#FF6320]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0987654321"
                      className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/20 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Khu vực lắp đặt
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#FF6320]"
                      >
                        <option value="TP. Hồ Chí Minh" className="bg-zinc-900">TP. Hồ Chí Minh</option>
                        <option value="Hà Nội" className="bg-zinc-900">Hà Nội</option>
                        <option value="Đà Nẵng" className="bg-zinc-900">Đà Nẵng</option>
                        <option value="Hải Phòng" className="bg-zinc-900">Hải Phòng</option>
                        <option value="Cần Thơ" className="bg-zinc-900">Cần Thơ</option>
                        <option value="Bình Dương" className="bg-zinc-900">Bình Dương</option>
                        <option value="Đồng Nai" className="bg-zinc-900">Đồng Nai</option>
                        <option value="Tỉnh thành khác" className="bg-zinc-900">Tỉnh thành khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Gói cước quan tâm
                      </label>
                      <select
                        value={packageInterest}
                        onChange={(e) => setPackageInterest(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-[#FF6320]"
                      >
                        <option value="Gói Giga (300 Mbps)" className="bg-zinc-900">Gói Giga (300 Mbps)</option>
                        <option value="Gói Sky (1 Gbps) - Bán chạy" className="bg-zinc-900">Gói Sky (1 Gbps)</option>
                        <option value="Gói Meta (1 Gbps đối xứng)" className="bg-zinc-900">Gói Meta (1 Gbps)</option>
                        <option value="Gói F-Game (Siêu tốc chơi game)" className="bg-zinc-900">Gói F-Game</option>
                        <option value="Combo Sky + Truyền hình 4K" className="bg-zinc-900">Combo TV Ngoại Hạng Anh</option>
                        <option value="Doanh nghiệp Lux 500" className="bg-zinc-900">Doanh nghiệp Lux 500</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang lưu đăng ký vào hệ thống...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Đăng Ký Liền Tay</span>
                      </>
                    )}
                  </button>


                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
