'use client';

import { useState, useEffect } from 'react';
import { Wifi, Gift, Zap, ShieldCheck, CheckCircle2, Loader2, Sparkles, Tv } from 'lucide-react';
import { usePackages } from '@/context/PackagesContext';
import {
  trackPixel,
  generateEventId,
  getFbp,
  getFbc,
  trackInitiateCheckout,
  trackFindLocation,
  trackCustomizeProduct,
} from '@/lib/meta-pixel';

interface HeroBannerProps {
  onOpenModal?: (packageName?: string) => void;
}

export default function HeroBanner({ onOpenModal }: HeroBannerProps) {
  const { packages, categories } = usePackages();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [packageInterest, setPackageInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  // Auto select popular or first package
  useEffect(() => {
    if (!packageInterest && packages.length > 0) {
      const popular = packages.find((p) => p.isPopular && p.isActive !== false);
      const target = popular || packages[0];
      if (target) {
        setPackageInterest(`${target.name} (${target.speed})`);
      }
    }
  }, [packages, packageInterest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsLoading(true);

    // Tạo Event ID cho Deduplication giữa Pixel & CAPI
    const eventId = generateEventId('lead');
    const fbp = getFbp();
    const fbc = getFbc();

    // 1. Kích hoạt Pixel Client-side
    trackPixel(
      'Lead',
      {
        content_name: packageInterest,
        content_category: province,
        currency: 'VND',
      },
      { eventID: eventId }
    );

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
          eventId,
          fbp,
          fbc,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Bắn sự kiện CompleteRegistration cho Meta Ads
        trackPixel(
          'CompleteRegistration',
          {
            content_name: packageInterest,
            content_category: province,
            currency: 'VND',
            status: 'success',
          },
          { eventID: eventId }
        );

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
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-orange-50/30 text-zinc-900 py-12 lg:py-16 border-b border-orange-100">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Hero Value Proposition */}
          <div className="lg:col-span-7 space-y-6">

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-zinc-900">
              Lắp Wifi FPT 3 Miền <br />
              <span className="bg-gradient-to-r from-[#FF6320] via-[#E05216] to-[#FF8533] bg-clip-text text-transparent">
                Tốc Độ Cực Đỉnh &bull; Quà Khủng
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl">
              Trang bị miễn phí <strong className="text-zinc-900 font-bold">Modem Wi-Fi 6 thế hệ mới</strong>,
              tốc độ siêu việt lên đến <strong className="text-[#FF6320] font-bold">1 Gbps</strong>.
              Thưởng thức trọn vẹn 380 trận Ngoại Hạng Anh độc quyền 4K cùng truyền hình thông minh.
            </p>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-orange-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6320] mb-2">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-zinc-900">Modem Wi-Fi 6</div>
                <div className="text-[11px] text-zinc-500">Trang bị hoàn toàn miễn phí</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-orange-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-zinc-900">Lắp Nhanh 12h - 36h</div>
                <div className="text-[11px] text-zinc-500">Triển khai thần tốc mọi ngày</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-orange-100 shadow-sm col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 mb-2">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-zinc-900">Tặng Đến 2 Tháng Cước</div>
                <div className="text-[11px] text-zinc-500">Khi thanh toán trước 6 - 12T</div>
              </div>
            </div>

            {/* Quick Action Link - 1 single line on mobile */}
            <div className="pt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href="#packages"
                className="h-11 sm:h-12 px-2.5 sm:px-6 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-extrabold text-xs sm:text-sm hover:brightness-105 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center text-center whitespace-nowrap"
              >
                <span>Xem Bảng Giá Cước</span>
              </a>
              <a
                href="#combos"
                className="h-11 sm:h-12 px-2 sm:px-5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF6320] transition-all flex items-center justify-center gap-1 text-xs sm:text-sm font-bold text-center whitespace-nowrap"
              >
                <Tv className="w-3.5 h-3.5 shrink-0 text-[#FF6320]" />
                <span>Combo Truyền Hình &rarr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Lead Consultation Form */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white p-6 sm:p-8 border-2 border-orange-200 shadow-2xl shadow-orange-500/10">

              {/* Badge Form Header */}
              <div className="text-center pb-4 border-b border-zinc-100 mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-tight">
                  Đăng Ký Liền Tay
                </h2>
                <p className="text-xs sm:text-sm text-[#FF6320] font-bold mt-1">
                  Nhận ngay Modem Wi-Fi 6 Miễn Phí &amp; Giảm 30% Cước
                </p>
              </div>

              {result?.success ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">Đăng Ký Thành Công!</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed px-4">
                    {result.message}
                  </p>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-2 rounded-full border border-orange-200 bg-orange-50 text-xs font-semibold text-[#FF6320] hover:bg-orange-100"
                  >
                    Đăng ký số khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {result?.error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {result.error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Họ và tên khách hàng <span className="text-[#FF6320]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:bg-white focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Số điện thoại nhận tư vấn <span className="text-[#FF6320]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onFocus={() => {
                        trackInitiateCheckout({
                          packageName: packageInterest,
                          category: province,
                          source: 'Hero Banner Form',
                        });
                      }}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0987654321"
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:bg-white focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Khu vực lắp đặt
                      </label>
                      <select
                        value={province}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProvince(val);
                          trackFindLocation(val);
                        }}
                        className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-[#FF6320]"
                      >
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="Đồng Nai">Đồng Nai</option>
                        <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Gói cước quan tâm
                      </label>
                      <select
                        value={packageInterest}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPackageInterest(val);
                          trackCustomizeProduct(val, { name: 'Gói cước', value: val });
                        }}
                        className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:bg-white focus:outline-none focus:border-[#FF6320]"
                      >
                        {categories.map((cat) => {
                          const catPkgs = packages.filter(
                            (p) => p.categoryKey === cat.key && p.isActive !== false
                          );
                          if (catPkgs.length === 0) return null;
                          return (
                            <optgroup
                              key={cat.key}
                              label={cat.name}
                              className="font-bold text-zinc-900"
                            >
                              {catPkgs.map((pkg) => (
                                <option
                                  key={pkg._id || pkg.id || pkg.name}
                                  value={`${pkg.name} (${pkg.speed})`}
                                  className="text-zinc-800 font-normal"
                                >
                                  {pkg.name} ({pkg.speed}) - {pkg.price}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                        <option value="Tư vấn gói cước phù hợp" className="text-zinc-500">
                          -- Tư vấn gói cước khác --
                        </option>
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
