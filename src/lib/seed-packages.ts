import Category from '@/models/Category';
import Package from '@/models/Package';

export const INITIAL_CATEGORIES = [
  {
    key: 'personal',
    name: '1. Gói Internet Cá Nhân & Hộ Gia Đình',
    description: 'Băng thông siêu tốc từ 300 Mbps đến 1 Gbps, trang bị Wi-Fi 6 miễn phí',
    icon: 'Wifi',
    order: 1,
    isActive: true,
  },
  {
    key: 'combo',
    name: '2. Gói Combo Internet + Truyền Hình Thông Minh',
    description: 'Tích hợp internet Wi-Fi 6 và truyền hình 4K, trọn vẹn 380 trận Ngoại Hạng Anh',
    icon: 'Tv',
    order: 2,
    isActive: true,
  },
  {
    key: 'business',
    name: '3. Gói Internet Doanh Nghiệp Tốc Độ Cao',
    description: 'Băng thông quốc tế lớn, cam kết SLA 99.9%, hỗ trợ IP tĩnh & Router chịu tải cao',
    icon: 'Building2',
    order: 3,
    isActive: true,
  },
];

export const INITIAL_PACKAGES = [
  // 1. Cá nhân & Hộ gia đình
  {
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
    name: 'Gói F-Game',
    categoryKey: 'personal',
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
    order: 3,
    isActive: true,
  },
  {
    name: 'Gói Meta',
    categoryKey: 'personal',
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
    order: 4,
    isActive: true,
  },

  // 2. Combo Internet + Truyền hình
  {
    name: 'Combo Giga - V.VIP',
    categoryKey: 'combo',
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
    order: 1,
    isActive: true,
  },
  {
    name: 'Combo Sky - V.VIP',
    categoryKey: 'combo',
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
    order: 2,
    isActive: true,
  },
  {
    name: 'Combo Meta - V.VIP',
    categoryKey: 'combo',
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
    order: 3,
    isActive: true,
  },

  // 3. Doanh nghiệp
  {
    name: 'Gói Super 250',
    categoryKey: 'business',
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
    order: 1,
    isActive: true,
  },
  {
    name: 'Gói Lux 500 (Mesh)',
    categoryKey: 'business',
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
    order: 2,
    isActive: true,
  },
  {
    name: 'Gói Lux 800',
    categoryKey: 'business',
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
    order: 3,
    isActive: true,
  },
];

export async function ensureDefaultPackages() {
  // 1. Khởi tạo danh mục nếu chưa có
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany(INITIAL_CATEGORIES);
  }

  // 2. Khởi tạo gói cước nếu chưa có
  const pkgCount = await Package.countDocuments();
  if (pkgCount === 0) {
    await Package.insertMany(INITIAL_PACKAGES);
  }
}
