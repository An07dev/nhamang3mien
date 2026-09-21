'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Wifi, Phone } from 'lucide-react';
import { useContact } from '@/context/ContactContext';
import { usePackages } from '@/context/PackagesContext';
import { trackPixel, generateEventId, getFbp, getFbc } from '@/lib/meta-pixel';

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

export default function ConsultModal({ isOpen, onClose, selectedPackage }: ConsultModalProps) {
  const { contact } = useContact();
  const { packages, categories } = usePackages();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [packageInterest, setPackageInterest] = useState(selectedPackage || 'Gói Sky (1 Gbps)');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  useEffect(() => {
    if (selectedPackage) {
      setPackageInterest(selectedPackage);
    }
  }, [selectedPackage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
          note: note.trim(),
          source: 'Bong Bóng / Nút Tư Vấn',
          eventId,
          fbp,
          fbc,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: data.message || 'Đăng ký thành công! Chuyên viên FPT 3 Miền sẽ liên hệ hỗ trợ quý khách trong 5 phút.',
        });
        setName('');
        setPhone('');
        setNote('');
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
        error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/20 text-white hover:bg-black/30 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FF6320] to-[#FFA153] px-5 py-4 sm:px-6 sm:py-5 text-white flex items-center gap-3 sm:gap-4 shrink-0 pr-12">
          <img
            src="/logo.png"
            alt="Logo FPT 3 Miền"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain shadow-md border-2 border-white/40 shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[9px] sm:text-[10px] font-bold uppercase mb-0.5">
              <span>FPT 3 Miền &bull; Hỗ Trợ 24/7</span>
            </div>
            <h3 className="text-base sm:text-xl font-black tracking-tight leading-tight">
              Đăng Ký Tư Vấn Lắp Đặt
            </h3>
            <p className="text-[11px] sm:text-xs text-orange-100 mt-0.5">
              Chuyên viên khu vực sẽ gọi lại khảo sát miễn phí trong 5 phút.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {result?.success ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-zinc-900 dark:text-white">
                Đăng Ký Thành Công!
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed px-2">
                {result.message}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-bold text-xs shadow-md hover:brightness-105 cursor-pointer"
                >
                  Xác Nhận &amp; Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {result?.error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                  {result.error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Họ và tên của bạn <span className="text-[#FF6320]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base sm:text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Số điện thoại nhận tư vấn <span className="text-[#FF6320]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base sm:text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Khu vực lắp đặt
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#FF6320]"
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
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Gói cước quan tâm
                  </label>
                  <select
                    value={packageInterest}
                    onChange={(e) => setPackageInterest(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#FF6320]"
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
                          className="font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-800"
                        >
                          {catPkgs.map((pkg) => (
                            <option
                              key={pkg._id || pkg.id || pkg.name}
                              value={`${pkg.name} (${pkg.speed})`}
                              className="font-normal text-zinc-900 dark:text-white bg-white dark:bg-zinc-800"
                            >
                              {pkg.name} ({pkg.speed}) - {pkg.price}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                    <option value="Tư vấn gói cước phù hợp nhất">
                      -- Tư vấn gói cước khác theo nhu cầu --
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Địa chỉ lắp đặt hoặc ghi chú thêm (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Số nhà, ngõ/hẻm, tên toà nhà..."
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide uppercase shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang lưu đăng ký vào hệ thống...</span>
                  </>
                ) : (
                  <>
                    <span>Hoàn Tất Đăng Ký</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bảo mật tuyệt đối &bull; Miễn phí khảo sát &amp; tư vấn</span>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Hotline */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span>Hỗ trợ trực tiếp qua tổng đài:</span>
          <a
            href={`tel:${contact.hotlineTel}`}
            className="font-bold text-[#FF6320] hover:underline flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{contact.hotline}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
