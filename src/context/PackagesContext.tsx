'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PackageTheme =
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

export interface PackageItem {
  _id?: string;
  id?: string;
  name: string;
  categoryKey: string;
  speed: string;
  price: string;
  originalPrice?: string;
  isPopular?: boolean;
  tag?: string;
  theme?: PackageTheme | string;
  suitableFor?: string;
  features?: string[];
  order?: number;
  isActive?: boolean;
}

export interface CategoryItem {
  _id?: string;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export const DEFAULT_FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    key: 'personal',
    name: '1. Gói Internet Cá Nhân & Hộ Gia Đình',
    description: 'Tốc độ cao 300 Mbps - 1 Gbps, tối ưu cho học tập, giải trí và chơi game online.',
    icon: 'Wifi',
    order: 1,
    isActive: true,
  },
  {
    key: 'combo',
    name: '2. Gói Combo Internet + Truyền Hình Thông Minh',
    description: 'Xem 380 trận Ngoại Hạng Anh độc quyền, gần 200 kênh truyền hình, tặng đầu thu TV Box 4K.',
    icon: 'Tv',
    order: 2,
    isActive: true,
  },
  {
    key: 'business',
    name: '3. Gói Internet Doanh Nghiệp & Quán Cafe (Mesh Tải Lớn)',
    description: 'Chịu tải lớn lên đến 125 thiết bị đồng thời, cam kết băng thông quốc tế và IP tĩnh.',
    icon: 'Building2',
    order: 3,
    isActive: true,
  },
];

export const DEFAULT_FALLBACK_PACKAGES: PackageItem[] = [
  {
    id: 'giga',
    name: 'Gói Giga',
    categoryKey: 'personal',
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
    order: 1,
    isActive: true,
  },
  {
    id: 'sky',
    name: 'Gói Sky',
    categoryKey: 'personal',
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
    order: 2,
    isActive: true,
  },
  {
    id: 'f-game',
    name: 'Gói F-Game',
    categoryKey: 'personal',
    speed: '1 Gbps / 1 Gbps (Ultra Ping)',
    price: '265.000đ',
    originalPrice: '380.000đ',
    isPopular: false,
    tag: 'GAMING PRO',
    theme: 'purple',
    suitableFor: 'Gamer chuyên nghiệp, Streamer, Tải file nặng (10 - 20 thiết bị)',
    features: [
      'Tích hợp công nghệ Ultra Fast giảm ping game',
      'Modem Wi-Fi 6 AX3000C chuyên biệt',
      'Băng thông đối xứng 1 Gbps cả tải lên và tải xuống',
      'Hỗ trợ kỹ thuật vàng, phản hồi trong 1h',
    ],
    order: 3,
    isActive: true,
  },
  {
    id: 'combo-giga',
    name: 'Combo Giga Play',
    categoryKey: 'combo',
    speed: '300 Mbps + FPT Play / TV360',
    price: '235.000đ',
    originalPrice: '310.000đ',
    isPopular: false,
    tag: 'GIA ĐÌNH TIÊU CHUẨN',
    theme: 'teal',
    suitableFor: 'Hộ gia đình xem truyền hình, bóng đá, thời sự HD',
    features: [
      'Trang bị Modem Wi-Fi 6 2 băng tần',
      'Tặng tài khoản xem gần 200 kênh truyền hình',
      'Xem đồng thời trên 3 thiết bị (Smart TV, Box, Phone)',
      'Miễn phí lắp đặt hoàn toàn',
    ],
    order: 1,
    isActive: true,
  },
  {
    id: 'combo-sky',
    name: 'Combo Sky Premium',
    categoryKey: 'combo',
    speed: '1 Gbps + Truyền hình 4K / Ngoại Hạng Anh',
    price: '275.000đ',
    originalPrice: '390.000đ',
    isPopular: true,
    tag: 'COMBO HOT NHẤT',
    theme: 'blue',
    suitableFor: 'Gia đình đam mê giải trí đỉnh cao, thể thao trực tiếp 4K',
    features: [
      'Băng thông 1 Gbps không giới hạn',
      'Trang bị trọn bộ Modem Wi-Fi 6 + Box điều khiển giọng nói 4K',
      'Trọn vẹn các giải thể thao đỉnh cao: Cúp C1, Ngoại Hạng Anh',
      'Tặng đến 2 tháng cước vàng',
    ],
    order: 2,
    isActive: true,
  },
  {
    id: 'business-250',
    name: 'Doanh Nghiệp Super 250',
    categoryKey: 'business',
    speed: '250 Mbps quốc tế cam kết 10.8 Mbps',
    price: '545.000đ',
    originalPrice: '700.000đ',
    isPopular: false,
    tag: 'DOANH NGHIỆP VỪA & NHỎ',
    theme: 'amber',
    suitableFor: 'Văn phòng 15 - 30 nhân viên, camera giám sát liên tục',
    features: [
      'Trang bị Router Vigor / Mikrotik chịu tải cao',
      'Miễn phí 01 địa chỉ IP tĩnh',
      'Cam kết SLA 99.9% không ngắt quãng',
      'Kỹ thuật viên chuyên trách hỗ trợ riêng',
    ],
    order: 1,
    isActive: true,
  },
  {
    id: 'business-500',
    name: 'Doanh Nghiệp Super 500',
    categoryKey: 'business',
    speed: '500 Mbps quốc tế cam kết 18.5 Mbps',
    price: '1.090.000đ',
    originalPrice: '1.500.000đ',
    isPopular: true,
    tag: 'DOANH NGHIỆP LỚN',
    theme: 'emerald',
    suitableFor: 'Văn phòng 30 - 80 nhân viên, trung tâm dữ liệu, livestream bán hàng',
    features: [
      'Bộ thiết bị Router cân bằng tải chuyên dụng cao cấp',
      'Miễn phí dải IP tĩnh theo nhu cầu',
      'Băng thông quốc tế ưu tiên cao nhất',
      'Bảo hành đổi mới thiết bị trong 2h',
    ],
    order: 2,
    isActive: true,
  },
];

interface PackagesContextType {
  categories: CategoryItem[];
  packages: PackageItem[];
  isLoading: boolean;
  refreshPackages: () => Promise<void>;
}

const PackagesContext = createContext<PackagesContextType>({
  categories: DEFAULT_FALLBACK_CATEGORIES,
  packages: DEFAULT_FALLBACK_PACKAGES,
  isLoading: false,
  refreshPackages: async () => {},
});

export function PackagesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_FALLBACK_CATEGORIES);
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_FALLBACK_PACKAGES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.packages && data.packages.length > 0) {
            setPackages(data.packages);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách gói cước:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <PackagesContext.Provider
      value={{
        categories,
        packages,
        isLoading,
        refreshPackages: fetchPackages,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackagesContext);
  return (
    context || {
      categories: DEFAULT_FALLBACK_CATEGORIES,
      packages: DEFAULT_FALLBACK_PACKAGES,
      isLoading: false,
      refreshPackages: async () => {},
    }
  );
}
