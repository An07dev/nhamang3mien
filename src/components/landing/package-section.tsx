'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wifi, Tv, Building2, Check, Flame, Shield, ArrowRight, Phone, Eye } from 'lucide-react';
import { useContact } from '@/context/ContactContext';
import { usePackages, PackageItem, CategoryItem } from '@/context/PackagesContext';
import { getPackageSlug } from '@/lib/package-utils';

export type { PackageItem, CategoryItem };

interface PackageSectionProps {
  onSelectPackage: (packageName: string) => void;
}

// Dữ liệu dự phòng mặc định ban đầu
const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    key: 'personal',
    name: '1. Gói Internet Cá Nhân & Hộ Gia Đình',
    description: 'Tốc độ cao 300 Mbps - 1 Gbps, tối ưu cho học tập, giải trí và chơi game online.',
    icon: 'Wifi',
    order: 1,
  },
  {
    key: 'combo',
    name: '2. Gói Combo Internet + Truyền Hình Thông Minh',
    description: 'Xem 380 trận Ngoại Hạng Anh độc quyền, gần 200 kênh truyền hình, tặng đầu thu TV Box 4K.',
    icon: 'Tv',
    order: 2,
  },
  {
    key: 'business',
    name: '3. Gói Internet Doanh Nghiệp & Quán Cafe (Mesh Tải Lớn)',
    description: 'Chịu tải lớn lên đến 125 thiết bị đồng thời, cam kết băng thông quốc tế và IP tĩnh.',
    icon: 'Building2',
    order: 3,
  },
];

const FALLBACK_PACKAGES: PackageItem[] = [
  // 1. Cá nhân
  {
    id: 'giga',
    categoryKey: 'personal',
    name: 'Gói Giga',
    speed: '300 Mbps / 300 Mbps',
    price: '195.000đ',
    originalPrice: '250.000đ',
    isPopular: false,
    tag: 'TIẾT KIỆM',
    theme: 'orange',
    suitableFor: 'Hộ gia đình nhỏ, sinh viên (3 - 5 thiết bị)',
    features: [
      'Trang bị Modem Wi-Fi 6 2 băng tần',
      'Lắp đặt siêu tốc từ 12h - 36h',
      'Hỗ trợ kỹ thuật tận nơi 24/7',
      'Tặng đến 2 tháng cước khi trả trước',
    ],
  },
  {
    id: 'sky',
    categoryKey: 'personal',
    name: 'Gói Sky',
    speed: '1 Gbps / 300 Mbps',
    price: '225.000đ',
    originalPrice: '320.000đ',
    isPopular: true,
    tag: 'BÁN CHẠY NHẤT',
    theme: 'red',
    suitableFor: 'Gia đình đa thiết bị, xem phim 4K, video call (5 - 10 thiết bị)',
    features: [
      'Băng thông download không giới hạn 1 Gbps',
      'Trang bị Modem Wi-Fi 6 thế hệ mới nhất',
      'Độ phủ sóng rộng, xuyên tường mạnh',
      'Miễn phí lắp đặt 100% khi trả trước',
      'Hỗ trợ ưu tiên 24/7',
    ],
  },
  {
    id: 'fgame',
    categoryKey: 'personal',
    name: 'Gói F-Game',
    speed: '1 Gbps / 300 Mbps',
    price: '245.000đ',
    originalPrice: '350.000đ',
    isPopular: false,
    tag: 'CHUYÊN GAMER',
    theme: 'slate',
    suitableFor: 'Game thủ, streamer, đòi hỏi ping cực thấp',
    features: [
      'Tích hợp tính năng Ultra Fast giảm ping',
      'Tối ưu kết nối hơn 50+ tựa game online hot',
      'Trang bị Modem Wi-Fi 6 tối tân',
      'Không giật lag, rớt gói trong giờ cao điểm',
    ],
  },
  {
    id: 'meta',
    categoryKey: 'personal',
    name: 'Gói Meta',
    speed: '1 Gbps / 1 Gbps đối xứng',
    price: '295.000đ',
    originalPrice: '450.000đ',
    isPopular: false,
    tag: 'ĐỐI XỨNG CỰC ĐỈNH',
    theme: 'purple',
    suitableFor: 'Streamer, đồ họa, upload file dung lượng lớn',
    features: [
      'Tốc độ Download & Upload đều đạt 1.000 Mbps',
      'Trang bị Modem Wi-Fi 6 công suất lớn',
      'Truy xuất dữ liệu đám mây tức thì',
      'Hỗ trợ kỹ thuật chuyên biệt VIP',
    ],
  },

  // 2. Combo
  {
    id: 'combo-giga',
    categoryKey: 'combo',
    name: 'Combo Giga - V.VIP',
    speed: '300 Mbps + Truyền hình 4K',
    price: '220.000đ',
    originalPrice: '290.000đ',
    isPopular: false,
    tag: 'COMBO TIẾT KIỆM',
    theme: 'orange',
    suitableFor: 'Gia đình xem truyền hình cơ bản và lướt web',
    features: [
      'Internet 300 Mbps + 180 kênh truyền hình đặc sắc',
      'Xem trực tiếp Ngoại Hạng Anh trọn vẹn 380 trận',
      'Trang bị Modem Wi-Fi 6 + Đầu thu TV Box điều khiển giọng nói',
      'Đăng nhập xem đồng thời trên 3 - 5 thiết bị',
    ],
  },
  {
    id: 'combo-sky',
    categoryKey: 'combo',
    name: 'Combo Sky - V.VIP',
    speed: '1 Gbps + Truyền hình 4K',
    price: '239.000đ',
    originalPrice: '360.000đ',
    isPopular: true,
    tag: 'COMBO BÁN CHẠY',
    theme: 'red',
    suitableFor: 'Gia đình đam mê thể thao Ngoại Hạng Anh & giải trí 4K',
    features: [
      'Internet không giới hạn 1 Gbps siêu mượt mà',
      'Độc quyền trọn vẹn Ngoại Hạng Anh, Cúp C1, C2',
      'Kho phim chiếu rạp và bom tấn 4K cập nhật hàng ngày',
      'Trang bị đầy đủ Modem Wifi 6 + Đầu thu TV Box 4K',
      'Miễn phí hòa mạng khi trả trước',
    ],
  },
  {
    id: 'combo-meta',
    categoryKey: 'combo',
    name: 'Combo Meta - V.VIP',
    speed: '1 Gbps / 1 Gbps + Truyền hình',
    price: '339.000đ',
    originalPrice: '480.000đ',
    isPopular: false,
    tag: 'ĐẲNG CẤP CAO CẤP',
    theme: 'purple',
    suitableFor: 'Hộ gia đình cao cấp, biệt thự, smart home',
    features: [
      'Tốc độ tải lên và tải xuống 1.000 Mbps',
      'Gói truyền hình V.VIP cao cấp nhất của FPT 3 Miền',
      'Xem Ngoại Hạng Anh, phim 4K không độ trễ',
      'Trang bị thiết bị Wi-Fi 6 Mesh mở rộng sóng',
    ],
  },

  // 3. Doanh nghiệp
  {
    id: 'super-250',
    categoryKey: 'business',
    name: 'Gói Super 250',
    speed: '250 Mbps / 250 Mbps',
    price: '545.000đ',
    originalPrice: '700.000đ',
    isPopular: false,
    tag: 'DOANH NGHIỆP VỪA & NHỎ',
    theme: 'emerald',
    suitableFor: 'Văn phòng 15 - 30 nhân sự',
    features: [
      'Băng thông quốc tế cam kết tối thiểu',
      'Trang bị Router chuyên dụng chịu tải cao',
      'Hỗ trợ kỹ thuật 24/7 xử lý trong 2h',
      'Miễn phí địa chỉ IP tĩnh',
    ],
  },
  {
    id: 'lux-500',
    categoryKey: 'business',
    name: 'Gói Lux 500 (Mesh)',
    speed: '500 Mbps / 500 Mbps',
    price: '800.000đ',
    originalPrice: '1.100.000đ',
    isPopular: true,
    tag: 'CHỊU TẢI 125 THIẾT BỊ',
    theme: 'purple',
    suitableFor: 'Quán Cafe, Nhà hàng, Văn phòng 40 - 80 thiết bị',
    features: [
      'Công nghệ Wi-Fi 6 Mesh đa điểm cao cấp',
      'Chịu tải đồng thời lên đến 125 thiết bị cùng lúc',
      'Băng thông quốc tế siêu tốc, không nghẽn mạng',
      'Đội ngũ kỹ thuật viên VIP hỗ trợ riêng',
    ],
  },
  {
    id: 'lux-800',
    categoryKey: 'business',
    name: 'Gói Lux 800',
    speed: '800 Mbps / 800 Mbps',
    price: '1.000.000đ',
    originalPrice: '1.500.000đ',
    isPopular: false,
    tag: 'DOANH NGHIỆP LỚN',
    theme: 'slate',
    suitableFor: 'Công ty công nghệ, chuỗi cửa hàng, phòng Lab',
    features: [
      'Tốc độ cực khủng 800 Mbps đa luồng',
      'Cam kết băng thông quốc tế lớn nhất phân khúc',
      'Tặng thiết bị Router Vigor / Access Point cao cấp',
      'Cam kết SLA 99.9% uptime hoạt động',
    ],
  },
];

function PackageCard({
  pkg,
  onSelectPackage,
}: {
  pkg: PackageItem;
  onSelectPackage: (name: string) => void;
}) {
  const { contact } = useContact();
  const slug = getPackageSlug(pkg);

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
        pkg.isPopular
          ? 'bg-gradient-to-b from-orange-50/90 via-white to-white border-2 border-[#FF6320] ring-4 ring-orange-500/20 shadow-2xl shadow-orange-500/20'
          : 'bg-white border-2 border-orange-100/90 hover:border-orange-300 shadow-xl hover:shadow-2xl'
      }`}
    >
      {/* Popular / Tag Ribbon */}
      {pkg.tag && (
        <div className="absolute -top-3.5 right-6 z-10">
          <span
            className={`px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 ${
              pkg.isPopular
                ? 'bg-gradient-to-r from-[#FF6320] to-[#FF8540] text-white ring-2 ring-white shadow-orange-500/30'
                : 'bg-orange-100 text-[#FF6320] border border-orange-200'
            }`}
          >
            {pkg.isPopular && <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />}
            {pkg.tag}
          </span>
        </div>
      )}

      <div>
        {/* Package Title & Suitable */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <span>{pkg.name}</span>
            {pkg.isPopular && (
              <span className="w-2 h-2 rounded-full bg-[#FF6320] animate-ping" />
            )}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1 font-medium">{pkg.suitableFor}</p>
        </div>

        {/* Speed Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-orange-50/90 border border-orange-200/90 mb-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-orange-600 font-extrabold">
              Tốc độ truy cập
            </span>
            <span className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              {pkg.speed}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6320] to-[#FFA153] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
            <Wifi className="w-5 h-5" />
          </div>
        </div>

        {/* Price Box */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-[#FF6320] tracking-tight">
              {pkg.price}
            </span>
            <span className="text-xs text-zinc-500 font-bold">/ tháng</span>
          </div>
          {pkg.originalPrice && (
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <span>Giá niêm yết:</span>
              <span className="line-through font-medium">{pkg.originalPrice}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black border border-red-200">
                Ưu đãi 2026
              </span>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-800">
            Ưu đãi &amp; Quyền lợi:
          </div>
          <ul className="space-y-2.5">
            {(pkg.features || []).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 leading-snug">
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="font-semibold text-zinc-800">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="pt-3 space-y-2">
        <button
          onClick={() => onSelectPackage(pkg.name)}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF6320] via-[#FF7330] to-[#FFA153] hover:brightness-110 active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Đăng Ký Gói Này</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href={`/goi-cuoc/${slug}`}
          className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-orange-50 active:scale-[0.98] text-[#FF6320] font-extrabold text-xs sm:text-sm border-2 border-orange-200 hover:border-[#FF6320] transition-all flex items-center justify-center gap-1.5 shadow-xs group"
        >
          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Xem Chi Tiết Gói Cước</span>
        </Link>

        <a
          href={`tel:${contact.hotlineTel}`}
          className="block text-center pt-0.5 text-[11px] text-zinc-500 hover:text-[#FF6320] transition-colors font-medium"
        >
          <span>Hotline: {contact.hotline}</span>
        </a>
      </div>
    </div>
  );
}

export default function PackageSection({ onSelectPackage }: PackageSectionProps) {
  const { categories, packages } = usePackages();
  const [selectedFilter, setSelectedFilter] = useState<'all' | string>('all');

  const filterTabs = [
    { key: 'all', label: 'Tất Cả Gói Cước' },
    { key: 'personal', label: '1. Internet Cá Nhân' },
    { key: 'combo', label: '2. Combo Internet + TV' },
    { key: 'business', label: '3. Doanh Nghiệp & Mesh' },
  ];

  const visibleCategories =
    selectedFilter === 'all'
      ? categories
      : categories.filter((c) => c.key === selectedFilter);

  return (
    <section id="packages" className="py-16 bg-gradient-to-b from-white via-orange-50/25 to-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#FF6320] text-xs font-black uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-[#FF6320]" />
            Bảng Giá Lắp Mạng FPT 3 Miền 2026
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Chọn Gói Cước FPT 3 Miền Phù Hợp Với Bạn
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600">
            Tất cả các gói cước đều được miễn phí trang bị Modem Wi-Fi 6 thế hệ mới nhất và bảo hành trọn đời.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
                  selectedFilter === tab.key
                    ? 'bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-md shadow-orange-500/25 scale-105'
                    : 'bg-white hover:bg-orange-50 text-zinc-700 border border-orange-200 hover:border-orange-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Categories & Packages */}
        {visibleCategories.map((cat, catIdx) => {
          const catPackages = packages.filter((p) => p.categoryKey === cat.key);
          if (catPackages.length === 0) return null;

          const anchorId = cat.key === 'combo' ? 'combos' : cat.key === 'business' ? 'business' : undefined;

          // Icon choice
          let IconComponent = Wifi;
          let iconBg = 'bg-orange-500/10 text-[#FF6320]';
          if (cat.icon === 'Tv' || cat.key === 'combo') {
            IconComponent = Tv;
            iconBg = 'bg-purple-500/10 text-purple-600';
          } else if (cat.icon === 'Building2' || cat.key === 'business') {
            IconComponent = Building2;
            iconBg = 'bg-emerald-500/10 text-emerald-600';
          }

          // Grid columns
          const gridClass =
            catPackages.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : catPackages.length <= 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

          return (
            <div key={cat.key || catIdx} id={anchorId} className="space-y-6 scroll-mt-24 pt-2">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Package Cards */}
              <div className={`grid ${gridClass} gap-6 items-stretch`}>
                {catPackages.map((pkg) => (
                  <PackageCard
                    key={pkg._id || pkg.id || pkg.name}
                    pkg={pkg}
                    onSelectPackage={onSelectPackage}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-amber-50 border-2 border-orange-200/80 shadow-lg shadow-orange-500/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6320] to-[#FFA153] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-lg text-zinc-900">
                Cam Kết Chất Lượng Dịch Vụ Của FPT 3 Miền
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                Ký hợp đồng điện tử tại nhà &bull; Triển khai lắp đặt từ 12h - 36h &bull; Bảo trì trọn
                đời miễn phí
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectPackage('Tư vấn gói cước phù hợp nhất')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md shadow-orange-500/25"
            >
              Yêu Cầu Tư Vấn Miễn Phí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
