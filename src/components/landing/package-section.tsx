'use client';

import { useState, useEffect } from 'react';
import { Wifi, Tv, Building2, Check, Flame, Shield, ArrowRight, Phone } from 'lucide-react';

export interface PackageItem {
  id?: string;
  _id?: string;
  name: string;
  speed: string;
  price: string;
  originalPrice?: string;
  isPopular?: boolean;
  tag?: string;
  theme?:
    | 'orange'
    | 'red'
    | 'purple'
    | 'slate'
    | 'emerald'
    | 'blue'
    | 'cyan'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'teal'
    | 'dark';
  features: string[];
  suitableFor: string;
  categoryKey?: string;
  order?: number;
}

export interface CategoryItem {
  _id?: string;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

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
      'Gói truyền hình V.VIP cao cấp nhất của Nhà Mạng 3 Miền',
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
  const themeGradients: Record<string, string> = {
    orange: 'bg-gradient-to-b from-[#8E3900] to-[#5C2300] text-white',
    red: 'bg-gradient-to-b from-[#9E1414] to-[#610808] text-white',
    purple: 'bg-gradient-to-b from-[#3A015C] to-[#24003B] text-white',
    slate: 'bg-gradient-to-b from-[#2A3447] to-[#171D29] text-white',
    emerald: 'bg-gradient-to-b from-[#1C5E28] to-[#0F3816] text-white',
    blue: 'bg-gradient-to-b from-[#0B3C8A] to-[#052254] text-white',
    cyan: 'bg-gradient-to-b from-[#005F73] to-[#003440] text-white',
    amber: 'bg-gradient-to-b from-[#78350F] to-[#451A03] text-white',
    rose: 'bg-gradient-to-b from-[#881337] to-[#4C0519] text-white',
    indigo: 'bg-gradient-to-b from-[#312E81] to-[#1E1B4B] text-white',
    teal: 'bg-gradient-to-b from-[#134E4A] to-[#042F2E] text-white',
    dark: 'bg-gradient-to-b from-[#222228] to-[#101014] text-white',
  };

  const cardBg = themeGradients[pkg.theme || 'orange'] || themeGradients.orange;

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border-2 ${
        pkg.isPopular ? 'border-[#FFCD6C] ring-4 ring-orange-500/20' : 'border-white/15'
      } ${cardBg}`}
    >
      {/* Popular / Tag Ribbon */}
      {pkg.tag && (
        <div className="absolute -top-3.5 right-6">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 ${
              pkg.isPopular
                ? 'bg-[#FF6C28] text-white ring-2 ring-white/40'
                : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
            }`}
          >
            {pkg.isPopular && <Flame className="w-3 h-3 fill-white" />}
            {pkg.tag}
          </span>
        </div>
      )}

      <div>
        {/* Package Title & Suitable */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-white tracking-tight">{pkg.name}</h3>
          <p className="text-xs text-orange-200/90 mt-1 line-clamp-1">{pkg.suitableFor}</p>
        </div>

        {/* Speed Box */}
        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xs mb-5">
          <span className="block text-[11px] uppercase tracking-wider text-orange-200/80 font-bold">
            Tốc độ truy cập
          </span>
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {pkg.speed}
          </span>
        </div>

        {/* Price Box */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
              {pkg.price}
            </span>
            <span className="text-xs text-orange-200 font-semibold">/ tháng</span>
          </div>
          {pkg.originalPrice && (
            <div className="text-xs text-orange-200/70 mt-1 flex items-center gap-1.5">
              <span>Giá niêm yết:</span>
              <span className="line-through font-mono font-medium">{pkg.originalPrice}</span>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-3 pt-4 border-t border-white/15 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-200/90">
            Ưu đãi &amp; Quyền lợi:
          </div>
          <ul className="space-y-2.5">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-100 leading-snug">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          onClick={() => onSelectPackage(pkg.name)}
          className="w-full py-3 px-4 rounded-2xl bg-white text-zinc-950 font-black text-sm hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Đăng Ký Gói Này</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href="tel:0819900530"
          className="block text-center mt-2.5 text-[11px] text-orange-200/80 hover:text-white transition-colors"
        >
          <span>Hotline: 0819 900 530</span>
        </a>
      </div>
    </div>
  );
}

export default function PackageSection({ onSelectPackage }: PackageSectionProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES);
  const [packages, setPackages] = useState<PackageItem[]>(FALLBACK_PACKAGES);

  // Load packages and categories dynamically from API
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicPackages() {
      try {
        const res = await fetch('/api/packages');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.packages && data.packages.length > 0) {
            setPackages(data.packages);
          }
        }
      } catch (err) {
        console.error('Lỗi tải gói cước từ API:', err);
      }
    }
    loadDynamicPackages();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="packages" className="py-16 bg-zinc-50 dark:bg-zinc-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Chọn Gói Cước Nhà Mạng 3 Miền Phù Hợp Với Bạn
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Tất cả các gói đều được trang bị miễn phí{' '}
            <span className="font-bold text-[#FF6320]">Modem Wi-Fi 6 2 băng tần</span>, miễn phí lắp
            đặt khi trả trước từ 6 tháng.
          </p>
        </div>

        {/* Dynamic Categories & Packages */}
        {categories.map((cat, catIdx) => {
          const catPackages = packages.filter((p) => p.categoryKey === cat.key);
          if (catPackages.length === 0) return null;

          const anchorId = cat.key === 'combo' ? 'combos' : cat.key === 'business' ? 'business' : undefined;

          // Icon choice
          let IconComponent = Wifi;
          let iconBg = 'bg-orange-500/10 text-[#FF6320]';
          if (cat.icon === 'Tv' || cat.key === 'combo') {
            IconComponent = Tv;
            iconBg = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
          } else if (cat.icon === 'Building2' || cat.key === 'business') {
            IconComponent = Building2;
            iconBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
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
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-[#FF6320] flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Cam Kết Chất Lượng Dịch Vụ Của Nhà Mạng 3 Miền
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Ký hợp đồng điện tử tại nhà &bull; Triển khai lắp đặt từ 12h - 36h &bull; Bảo trì trọn
                đời miễn phí
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectPackage('Tư vấn gói cước phù hợp nhất')}
              className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-sm"
            >
              Yêu Cầu Tư Vấn Miễn Phí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
