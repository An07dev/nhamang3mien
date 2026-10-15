'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wifi,
  Tv,
  Building2,
  Check,
  Flame,
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  Clock,
  Globe,
  HardDrive,
  Users,
  ChevronRight,
  ChevronDown,
  Gift,
  CheckCircle2,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText,
  BadgePercent,
  Home,
  Eye,
} from 'lucide-react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import ConsultModal from '@/components/landing/consult-modal';
import FloatingWidgets from '@/components/landing/floating-widgets';
import { useContact } from '@/context/ContactContext';
import { usePackages, PackageItem } from '@/context/PackagesContext';
import { getPackageSlug, getCategoryTitle, getPackageSpecs, getPackageFaq } from '@/lib/package-utils';
import {
  trackPixel,
  generateEventId,
  getFbp,
  getFbc,
  trackViewContent,
  trackInitiateCheckout,
  trackFindLocation,
  trackCustomizeProduct,
} from '@/lib/meta-pixel';

interface PackageDetailClientProps {
  packageData: PackageItem;
  relatedPackages?: PackageItem[];
}

const PROVINCES = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Các tỉnh thành khác',
];

export default function PackageDetailClient({
  packageData,
  relatedPackages = [],
}: PackageDetailClientProps) {
  const { contact } = useContact();
  const { packages: allPackages, categories } = usePackages();

  // Tìm gói cước mới nhất từ Context (nếu Admin cập nhật qua CSDL) hoặc dùng props ban đầu
  const currentPkg =
    allPackages.find(
      (p) =>
        p.id === packageData.id ||
        (p._id && packageData._id && p._id.toString() === packageData._id.toString()) ||
        p.name === packageData.name
    ) || packageData;

  const categoryName = getCategoryTitle(currentPkg.categoryKey, categories);
  const specs = getPackageSpecs(currentPkg);
  const faqs = getPackageFaq(currentPkg);

  // 1. Tự động bắn sự kiện ViewContent khi vào trang chi tiết gói cước
  React.useEffect(() => {
    trackViewContent({
      id: currentPkg.id,
      name: currentPkg.name,
      category: categoryName,
      price: currentPkg.price,
      speed: currentPkg.speed,
    });
  }, [currentPkg.id, currentPkg.name, categoryName]);

  // Form đăng ký nhanh tại trang chi tiết
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [payCycle, setPayCycle] = useState('6_months');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResult, setFormResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  // Modal tư vấn nhanh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPackageName, setModalPackageName] = useState(currentPkg.name);

  // Accordion FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenConsult = (pkgName?: string) => {
    const targetName = pkgName || currentPkg.name;
    setModalPackageName(targetName);
    setIsModalOpen(true);
    trackInitiateCheckout({
      packageName: targetName,
      category: categoryName,
      price: currentPkg.price,
      source: 'Nút Tư Vấn Trang Chi Tiết',
    });
  };

  const handleProvinceChange = (newProv: string) => {
    setProvince(newProv);
    trackFindLocation(newProv);
  };

  const handlePayCycleChange = (newCycle: string) => {
    setPayCycle(newCycle);
    const cycleLabel =
      newCycle === '12_months'
        ? 'Trả trước 12 tháng'
        : newCycle === '6_months'
        ? 'Trả trước 6 tháng'
        : 'Trả từng tháng';
    trackCustomizeProduct(currentPkg.name, {
      name: 'Kỳ thanh toán',
      value: cycleLabel,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormResult(null);
    setIsSubmitting(true);

    const eventId = generateEventId('lead_detail');
    const fbp = getFbp();
    const fbc = getFbc();

    const cycleText =
      payCycle === '12_months'
        ? 'Trả trước 12 tháng (Tặng 2T)'
        : payCycle === '6_months'
        ? 'Trả trước 6 tháng (Tặng 1T)'
        : 'Trả từng tháng';

    // 1. Kích hoạt Pixel Lead
    trackPixel(
      'Lead',
      {
        content_name: `${currentPkg.name} (${currentPkg.speed})`,
        content_category: categoryName,
        currency: 'VND',
        value: parseInt(currentPkg.price.replace(/\D/g, '') || '0', 10),
      },
      { eventID: eventId }
    );

    try {
      const res = await fetch('/api/dang-ky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          province,
          packageInterest: `${currentPkg.name} (${currentPkg.speed}) - [${cycleText}]`,
          note: address ? `Địa chỉ: ${address.trim()}` : `Hình thức: ${cycleText}`,
          source: 'trang-chi-tiet-goi-cuoc',
          eventId,
          fbp,
          fbc,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Bắn sự kiện CompleteRegistration cho Meta Ads
        trackPixel(
          'CompleteRegistration',
          {
            content_name: `${currentPkg.name} (${currentPkg.speed})`,
            content_category: categoryName,
            currency: 'VND',
            value: parseInt(currentPkg.price.replace(/\D/g, '') || '0', 10),
            status: 'success',
          },
          { eventID: eventId }
        );

        setFormResult({
          success: true,
          message: 'Đăng ký thành công! Nhân viên FPT 3 Miền sẽ liên hệ hỗ trợ bạn trong vòng 5 - 10 phút.',
        });
        setName('');
        setPhone('');
        setAddress('');
      } else {
        setFormResult({
          success: false,
          error: data.error || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại hoặc gọi hotline.',
        });
      }
    } catch (err) {
      setFormResult({
        success: false,
        error: 'Không thể kết nối tới máy chủ. Vui lòng gọi trực tiếp hotline để được hỗ trợ tức thì.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme Gradients - Bright, luminous and vibrant
  const themeGradients: Record<string, string> = {
    orange: 'from-[#FF6320] via-[#FF7A3D] to-[#E04F0E]',
    red: 'from-[#E11D48] via-[#F43F5E] to-[#BE123C]',
    purple: 'from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]',
    slate: 'from-[#475569] via-[#334155] to-[#1E293B]',
    emerald: 'from-[#059669] via-[#10B981] to-[#047857]',
    blue: 'from-[#2563EB] via-[#3B82F6] to-[#1D4ED8]',
    cyan: 'from-[#0891B2] via-[#06B6D4] to-[#0E7490]',
    amber: 'from-[#D97706] via-[#F59E0B] to-[#B45309]',
    rose: 'from-[#E11D48] via-[#FB7185] to-[#BE123C]',
    indigo: 'from-[#4F46E5] via-[#6366F1] to-[#4338CA]',
    teal: 'from-[#0D9488] via-[#14B8A6] to-[#0F766E]',
    dark: 'from-[#3F3F46] via-[#27272A] to-[#18181B]',
  };

  const gradientClass = themeGradients[currentPkg.theme || 'orange'] || themeGradients.orange;

  // Lọc gói cước liên quan (cùng danh mục hoặc khác gói hiện tại)
  const displayRelated =
    relatedPackages.length > 0
      ? relatedPackages.filter((p) => p.name !== currentPkg.name).slice(0, 3)
      : allPackages.filter((p) => p.name !== currentPkg.name).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#FF6320] selection:text-white">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Breadcrumbs Bar */}
      <div className="bg-white border-b border-zinc-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center text-xs font-medium text-zinc-500 space-x-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#FF6320] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <Link href="/#packages" className="hover:text-[#FF6320] transition-colors">
              Gói cước FPT 3 Miền
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-600">{categoryName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="font-bold text-[#FF6320]">{currentPkg.name}</span>
          </nav>
        </div>
      </div>

      {/* 3. Hero Product Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-orange-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visual Highlight Card */}
            <div className="lg:col-span-5">
              <div
                className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${gradientClass} text-white shadow-2xl relative overflow-hidden border border-white/20`}
              >
                {/* Background decorative pattern */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/20 blur-3xl pointer-events-none" />

                {/* Popular / Promo Ribbon */}
                <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-sm">
                    {currentPkg.isPopular ? (
                      <>
                        <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                        <span>BÁN CHẠY NHẤT</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{currentPkg.tag || 'CÔNG NGHỆ WI-FI 6'}</span>
                      </>
                    )}
                  </span>
                  <span className="text-[11px] font-semibold text-orange-100 bg-black/25 px-2.5 py-1 rounded-full border border-white/10">
                    Phủ sóng 3 Miền
                  </span>
                </div>

                {/* Package Title & Speed Badge */}
                <div className="relative z-10 space-y-3 mb-6">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                    {currentPkg.name}
                  </h2>
                  <p className="text-sm text-orange-100 leading-relaxed">
                    {currentPkg.suitableFor || 'Giải pháp Internet cáp quang tốc độ cao cho gia đình và cá nhân'}
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/35 border border-white/15 backdrop-blur-md mt-2">
                    <Wifi className="w-5 h-5 text-amber-300" />
                    <div>
                      <span className="block text-[10px] text-orange-200 uppercase font-bold tracking-wider">
                        Băng thông tốc độ
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white">{currentPkg.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Equipment Mockup Showcase Box */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md mb-6 relative z-10 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide">
                    <HardDrive className="w-4 h-4" />
                    <span>Thiết bị bàn giao chuẩn Wi-Fi 6</span>
                  </div>
                  <p className="text-xs text-zinc-100 leading-relaxed">
                    {specs.device}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/15 border border-white/20 font-medium">
                      2 Băng Tần 2.4 &amp; 5GHz
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/15 border border-white/20 font-medium">
                      Chuẩn AX Siêu Tốc
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/15 border border-white/20 font-medium">
                      Xuyên Tường Mạnh
                    </span>
                  </div>
                </div>

                {/* Key Checklist Features */}
                <div className="space-y-2.5 pt-4 border-t border-white/15 relative z-10">
                  <span className="text-xs font-bold text-orange-200 uppercase tracking-wider block">
                    Quyền lợi độc quyền:
                  </span>
                  <ul className="space-y-2">
                    {(currentPkg.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-100">
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/15 text-[11px] text-orange-100 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Bảo hành thiết bị trọn đời</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Lắp siêu tốc 12h - 36h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Detailed Overview & Lead Capture Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Header & Pricing */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-100/90 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-orange-100">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF6320] bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {categoryName}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
                      {currentPkg.name}
                    </h1>
                  </div>

                  {/* Price Block */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#FF6320] tracking-tight">
                        {currentPkg.price}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">/ tháng</span>
                    </div>
                    {currentPkg.originalPrice && (
                      <div className="text-xs text-zinc-400 flex items-center justify-end gap-1.5 mt-0.5">
                        <span>Giá niêm yết:</span>
                        <span className="line-through font-medium">{currentPkg.originalPrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Promo Billing Cycle Selector */}
                <div className="mt-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                    <BadgePercent className="w-4 h-4 text-[#FF6320]" />
                    Chọn hình thức đăng ký &amp; nhận khuyến mãi:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Option 1: 6 Months */}
                    <button
                      type="button"
                      onClick={() => handlePayCycleChange('6_months')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                        payCycle === '6_months'
                          ? 'border-[#FF6320] bg-orange-50/90 ring-4 ring-orange-500/15 shadow-sm'
                          : 'border-zinc-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-zinc-900">Trả trước 6 tháng</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF6320] text-white">
                          HOT
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-snug">
                        Tặng 1 tháng cước + Miễn phí lắp đặt 100%
                      </p>
                    </button>

                    {/* Option 2: 12 Months */}
                    <button
                      type="button"
                      onClick={() => handlePayCycleChange('12_months')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                        payCycle === '12_months'
                          ? 'border-[#FF6320] bg-orange-50/90 ring-4 ring-orange-500/15 shadow-sm'
                          : 'border-zinc-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-zinc-900">Trả trước 12 tháng</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                          Tiết kiệm
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-snug">
                        Tặng 2 tháng cước + Quà tặng tri ân VIP
                      </p>
                    </button>

                    {/* Option 3: Monthly */}
                    <button
                      type="button"
                      onClick={() => handlePayCycleChange('monthly')}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                        payCycle === 'monthly'
                          ? 'border-[#FF6320] bg-orange-50/90 ring-4 ring-orange-500/15 shadow-sm'
                          : 'border-zinc-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-zinc-900">Trả hàng tháng</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-snug">
                        Linh hoạt từng tháng, phí hòa mạng tiêu chuẩn
                      </p>
                    </button>
                  </div>
                </div>

                {/* Embedded Fast Registration Form */}
                <div className="mt-6 pt-6 border-t border-orange-100">
                  <div className="mb-4">
                    <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FF6320]" />
                      Đăng Ký Khảo Sát &amp; Lắp Đặt Gói {currentPkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Điền thông tin bên dưới, nhân viên phụ trách khu vực sẽ gọi lại tư vấn miễn phí trong 5 phút.
                    </p>
                  </div>

                  {formResult && (
                    <div
                      className={`p-4 rounded-2xl mb-4 text-xs font-medium flex items-start gap-2.5 ${
                        formResult.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {formResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{formResult.message || formResult.error}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                          Họ và tên quý khách *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn An"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[#FF6320] focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                          Số điện thoại liên hệ *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ví dụ: 0988 123 456"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[#FF6320] focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                          Khu vực tỉnh / thành phố *
                        </label>
                        <select
                          value={province}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[#FF6320] focus:ring-2 focus:ring-orange-500/20"
                        >
                          {PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                          Địa chỉ cụ thể (Không bắt buộc)
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Số nhà, tên đường, phường/xã"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[#FF6320] focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Đang gửi thông tin đăng ký...</span>
                          </>
                        ) : (
                          <>
                            <span>Gửi Yêu Cầu Lắp Đặt Gói {currentPkg.name}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Direct Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-100">
                    <a
                      href={`tel:${contact.hotlineTel}`}
                      className="py-2.5 px-3 rounded-xl border-2 border-orange-200 bg-orange-50/70 hover:bg-orange-100/70 text-[#FF6320] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Tổng đài: {contact.hotline}</span>
                    </a>

                    <a
                      href={contact.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl border-2 border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Zalo Tư Vấn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Detailed Technical Specifications Grid */}
      <section className="py-12 bg-gradient-to-b from-white via-orange-50/20 to-white border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6320] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Thông số chuẩn quốc tế
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-3">
              Bảng Thông Số Kỹ Thuật Gói {currentPkg.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Hạ tầng cáp quang 100% FTTH AON/GPON hiện đại, kết hợp chuẩn Wi-Fi 6 tối tân nhất hiện nay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Spec 1: Download */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-[#FF6320] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Tốc độ Tải xuống (Download)
              </span>
              <h4 className="text-lg font-black text-zinc-900 mt-1">
                {specs.downloadSpeed}
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Tải game, video 4K/8K và tập tin dung lượng lớn trong chớp mắt không bị nghẽn mạng.
              </p>
            </div>

            {/* Spec 2: Upload */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Tốc độ Tải lên (Upload)
              </span>
              <h4 className="text-lg font-black text-zinc-900 mt-1">
                {specs.uploadSpeed}
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Phù hợp cho streamer, họp trực tuyến Zoom/Teams, gửi tài liệu và sao lưu dữ liệu đám mây.
              </p>
            </div>

            {/* Spec 3: Wi-Fi Standard */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Chuẩn Công Nghệ Không Dây
              </span>
              <h4 className="text-lg font-black text-zinc-900 mt-1">
                {specs.standard}
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Tốc độ truyền dữ liệu cao gấp 4 lần, giảm 75% độ trễ ping và hỗ trợ công nghệ Beamforming.
              </p>
            </div>

            {/* Spec 4: Equipment */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Thiết Bị Đi Kèm Miễn Phí
              </span>
              <h4 className="text-sm font-black text-zinc-900 mt-1 leading-snug">
                {specs.device}
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Kỹ thuật viên bàn giao đầy đủ phụ kiện, bảo hành 1 đổi 1 trong suốt quá trình sử dụng.
              </p>
            </div>

            {/* Spec 5: Device capacity */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Khả Năng Chịu Tải Đồng Thời
              </span>
              <h4 className="text-lg font-black text-zinc-900 mt-1">
                {specs.concurrentDevices}
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Không lo nghẽn mạng hay rớt kết nối khi nhiều điện thoại, laptop, Smart TV cùng truy cập.
              </p>
            </div>

            {/* Spec 6: IP & Installation Time */}
            <div className="p-6 rounded-3xl border-2 border-orange-100/90 bg-white hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500">
                Thời Gian Triển Khai Lắp Đặt
              </span>
              <h4 className="text-lg font-black text-zinc-900 mt-1">
                12h - 36h Thần Tốc
              </h4>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Đội ngũ kỹ thuật trực 24/7 phục vụ kể cả Thứ Bảy, Chủ Nhật và các ngày Lễ Tết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-step Installation Procedure Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6320] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Quy trình chuẩn hóa 4 bước
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-3">
              Thủ Tục Đăng Ký &amp; Lắp Đặt Nhanh Gọn
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Chỉ với ảnh chụp CCCD, bạn có thể hoàn tất hợp đồng điện tử trong 3 phút mà không cần ra quầy giao dịch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-orange-100/90 shadow-sm hover:shadow-md transition-all relative">
              <span className="text-4xl font-black text-orange-200 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-[#FF6320] flex items-center justify-center font-black mb-4">
                1
              </div>
              <h4 className="text-base font-black text-zinc-900">
                Tiếp Nhận Nhu Cầu
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Khách hàng để lại thông tin hoặc gọi điện hotline, chuyên viên tư vấn hỗ trợ chọn gói và ưu đãi phù hợp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-orange-100/90 shadow-sm hover:shadow-md transition-all relative">
              <span className="text-4xl font-black text-orange-200 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black mb-4">
                2
              </div>
              <h4 className="text-base font-black text-zinc-900">
                Khảo Sát Tuyến Cáp
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Kỹ thuật viên kiểm tra hộp cáp quang gần nhà quý khách, đảm bảo khoảng cách tiêu chuẩn và tín hiệu tốt nhất.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-orange-100/90 shadow-sm hover:shadow-md transition-all relative">
              <span className="text-4xl font-black text-orange-200 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black mb-4">
                3
              </div>
              <h4 className="text-base font-black text-zinc-900">
                Ký HĐ Điện Tử
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Ký kết hợp đồng điện tử online minh bạch, gửi hóa đơn điện tử và mã khách hàng qua SMS ngay lập tức.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-orange-100/90 shadow-sm hover:shadow-md transition-all relative">
              <span className="text-4xl font-black text-orange-200 absolute top-4 right-4">
                04
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black mb-4">
                4
              </div>
              <h4 className="text-base font-black text-zinc-900">
                Lắp Đặt &amp; Bàn Giao
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Kéo cáp quang, cấu hình Modem Wi-Fi 6, đo kiểm tốc độ thực tế bằng Speedtest và hướng dẫn quý khách sử dụng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Package-Specific FAQs Accordion */}
      <section className="py-12 bg-gradient-to-b from-white via-orange-50/20 to-white border-t border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6320] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Giải đáp thắc mắc
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-3">
              Câu Hỏi Thường Gặp Về Gói {currentPkg.name}
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-orange-100/90 overflow-hidden bg-white shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-[#FF6320] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF6320]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-orange-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Related / Other Packages Section */}
      {displayRelated.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white via-orange-50/25 to-white border-t border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF6320] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                  Khám phá thêm lựa chọn
                </span>
                <h3 className="text-2xl font-black text-zinc-900 mt-3">
                  Các Gói Cước Liên Quan Khác
                </h3>
              </div>
              <Link
                href="/#packages"
                className="text-xs font-black text-[#FF6320] hover:underline flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-orange-200 shadow-xs"
              >
                <span>Xem tất cả gói cước FPT 3 Miền</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRelated.map((pkg, idx) => {
                const slug = getPackageSlug(pkg);
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 border-2 border-orange-100/90 hover:border-[#FF6320] shadow-md hover:shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#FF6320] uppercase">
                          {getCategoryTitle(pkg.categoryKey, categories)}
                        </span>
                        {pkg.isPopular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-xs">
                            Bán chạy
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-black text-zinc-900">
                        {pkg.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                        {pkg.suitableFor}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 my-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-600">Tốc độ:</span>
                        <span className="text-sm font-black text-[#FF6320]">{pkg.speed}</span>
                      </div>

                      <div className="mb-4">
                        <span className="text-2xl font-black text-[#FF6320]">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-zinc-500">/ tháng</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => handleOpenConsult(pkg.name)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-105 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                      >
                        <span>Đăng ký gói này</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/goi-cuoc/${slug}`}
                        className="w-full py-2 px-4 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-[#FF6320] text-[#FF6320] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết gói</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. Footer */}
      <Footer />

      {/* 9. Interactive Consult Modal */}
      <ConsultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPackage={modalPackageName}
      />

      {/* 10. Floating Widgets */}
      <FloatingWidgets onOpenConsult={() => handleOpenConsult(currentPkg.name)} />
    </div>
  );
}
