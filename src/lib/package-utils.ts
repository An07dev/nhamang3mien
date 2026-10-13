import { PackageItem, CategoryItem, DEFAULT_FALLBACK_PACKAGES, DEFAULT_FALLBACK_CATEGORIES } from '@/lib/default-packages';

/**
 * Chuyển đổi chuỗi tiếng Việt thành slug URL an toàn, chuẩn SEO
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Lấy slug định danh của một gói cước để đưa vào URL
 */
export function getPackageSlug(pkg: { _id?: string; id?: string; name: string }): string {
  if (pkg.id && pkg.id.trim().length > 0) {
    return pkg.id.trim().toLowerCase();
  }
  return slugify(pkg.name);
}

/**
 * Kiểm tra xem một gói cước có khớp với slug yêu cầu không
 */
export function matchPackageSlug(
  pkg: { _id?: any; id?: string; name: string },
  slug: string
): boolean {
  if (!slug) return false;
  const targetSlug = slug.toLowerCase().trim();

  // 1. Khớp theo id cố định (vd: 'giga', 'sky', 'f-game', 'combo-giga')
  if (pkg.id && pkg.id.toLowerCase() === targetSlug) {
    return true;
  }

  // 2. Khớp theo MongoDB _id
  if (pkg._id && pkg._id.toString() === targetSlug) {
    return true;
  }

  // 3. Khớp theo slug tạo từ tên gói (vd: 'goi-sky' hoặc 'sky')
  const nameSlug = slugify(pkg.name);
  if (nameSlug === targetSlug) {
    return true;
  }

  // Khớp bỏ tiền tố 'goi-'
  const cleanNameSlug = nameSlug.replace(/^goi-/, '');
  const cleanTarget = targetSlug.replace(/^goi-/, '');
  if (cleanNameSlug === cleanTarget) {
    return true;
  }

  // 4. Khớp tên thô
  if (pkg.name.toLowerCase() === targetSlug) {
    return true;
  }

  return false;
}

/**
 * Tìm gói cước từ danh sách theo slug
 */
export function findPackageInList(slug: string, list: PackageItem[]): PackageItem | undefined {
  return list.find((p) => matchPackageSlug(p, slug));
}

/**
 * Lấy tên danh mục dựa trên key
 */
export function getCategoryTitle(
  categoryKey: string,
  categories: CategoryItem[] = DEFAULT_FALLBACK_CATEGORIES
): string {
  const cat = categories.find((c) => c.key === categoryKey);
  if (cat) return cat.name;
  if (categoryKey === 'personal') return 'Internet Cá Nhân & Hộ Gia Đình';
  if (categoryKey === 'combo') return 'Combo Internet & Truyền Hình';
  if (categoryKey === 'business') return 'Internet Doanh Nghiệp & Phòng Nét';
  return 'Gói Cước Internet Cáp Quang';
}

/**
 * Trả về thông số kỹ thuật chi tiết theo gói cước
 */
export function getPackageSpecs(pkg: PackageItem) {
  const isCombo = pkg.categoryKey === 'combo' || pkg.name.toLowerCase().includes('combo');
  const isBusiness = pkg.categoryKey === 'business' || pkg.name.toLowerCase().includes('doanh nghiệp');
  const isGamer = pkg.name.toLowerCase().includes('f-game') || pkg.name.toLowerCase().includes('game');

  let downloadSpeed = '300 Mbps';
  let uploadSpeed = '300 Mbps';

  if (pkg.speed.includes('1 Gbps') || pkg.speed.includes('1Gbps')) {
    downloadSpeed = '1.000 Mbps (1 Gbps)';
    uploadSpeed = pkg.speed.includes('1 Gbps / 1 Gbps') || pkg.name.toLowerCase().includes('meta')
      ? '1.000 Mbps (1 Gbps đối xứng)'
      : '300 Mbps - 500 Mbps';
  } else if (pkg.speed.includes('500 Mbps')) {
    downloadSpeed = '500 Mbps';
    uploadSpeed = '500 Mbps';
  } else if (pkg.speed.includes('800 Mbps')) {
    downloadSpeed = '800 Mbps';
    uploadSpeed = '800 Mbps';
  } else if (pkg.speed.includes('250 Mbps')) {
    downloadSpeed = '250 Mbps';
    uploadSpeed = '250 Mbps';
  }

  const device = isBusiness
    ? 'Router MikroTik / DrayTek Vigor chuyên dụng cân bằng tải cao'
    : isCombo
    ? 'Modem Wi-Fi 6 2 băng tần (AX1800/AX3000) + Đầu thu TV Box 4K điều khiển giọng nói'
    : isGamer
    ? 'Modem Wi-Fi 6 AX3000C chuyên biệt cho Gamer kèm chip giải mã Ultra Fast'
    : 'Modem Wi-Fi 6 chuẩn AX băng tần kép 2.4GHz & 5GHz cao cấp';

  const concurrentDevices = isBusiness
    ? '30 - 125 thiết bị cùng lúc'
    : isGamer
    ? '10 - 25 thiết bị (Ưu tiên luồng Gaming không gián đoạn)'
    : isCombo
    ? '5 - 15 thiết bị + Smart TV / TV Box'
    : pkg.speed.includes('1 Gbps')
    ? '8 - 15 thiết bị cùng lúc'
    : '3 - 8 thiết bị cùng lúc';

  const intlBandwidth = isBusiness
    ? 'Cam kết tối thiểu 10.8 Mbps - 18.5 Mbps quốc tế'
    : 'Băng thông quốc tế tiêu chuẩn cao cấp, định tuyến ưu tiên';

  const installationTime = 'Triển khai siêu tốc từ 12h đến tối đa 36h kể từ khi đăng ký';

  return {
    downloadSpeed,
    uploadSpeed,
    device,
    concurrentDevices,
    intlBandwidth,
    installationTime,
    standard: 'Wi-Fi 6 (802.11ax) thế hệ mới nhất',
    ipType: isBusiness ? 'Miễn phí 01 IP Tĩnh cố định' : 'IP Động chuẩn quốc tế (Hỗ trợ IPv4 & IPv6)',
  };
}

/**
 * Trả về danh sách câu hỏi thường gặp riêng cho từng gói
 */
export function getPackageFaq(pkg: PackageItem) {
  const isCombo = pkg.categoryKey === 'combo' || pkg.name.toLowerCase().includes('combo');
  const isBusiness = pkg.categoryKey === 'business' || pkg.name.toLowerCase().includes('doanh nghiệp');

  return [
    {
      q: `Gói cước ${pkg.name} có được trang bị thiết bị Modem Wi-Fi 6 miễn phí không?`,
      a: `Có, 100% khách hàng đăng ký lắp đặt gói ${pkg.name} đều được kỹ thuật viên trang bị miễn phí thiết bị Modem Wi-Fi 6 2 băng tần tiên tiến nhất. Thiết bị được bảo hành và đổi mới miễn phí trong suốt thời gian sử dụng dịch vụ.`,
    },
    {
      q: `Khi thanh toán trả trước cước từ 6 đến 12 tháng tôi được nhận ưu đãi gì?`,
      a: `Khi trả trước 6 tháng: Bạn được miễn 100% phí lắp đặt hòa mạng và tặng thêm tháng cước ưu đãi. Khi trả trước 12 tháng: Bạn được miễn phí lắp đặt hoàn toàn và tặng thêm từ 1 đến 2 tháng cước sử dụng miễn phí kèm nhiều phần quà tri ân.`,
    },
    {
      q: isCombo
        ? `Đầu thu truyền hình 4K kèm theo xem được những nội dung gì?`
        : `Thủ tục đăng ký gói ${pkg.name} cần những giấy tờ gì?`,
      a: isCombo
        ? `Đầu thu TV Box 4K tích hợp điều khiển giọng nói tiếng Việt, xem gần 200 kênh truyền hình HD trong nước & quốc tế, độc quyền trọn vẹn 380 trận Ngoại Hạng Anh, Cúp C1 và kho phim chiếu rạp bom tấn 4K cập nhật hàng ngày.`
        : isBusiness
        ? `Quý doanh nghiệp chỉ cần chuẩn bị bản scan hoặc ảnh chụp Giấy phép đăng ký kinh doanh (GPKD) và CCCD/CMND của người đại diện pháp luật.`
        : `Thủ tục cực kỳ tinh gọn: Chỉ cần chuẩn bị ảnh chụp 2 mặt Căn cước công dân (CCCD). Không yêu cầu hộ khẩu tại địa chỉ lắp đặt, người thuê trọ hay sinh viên đều đăng ký thuận tiện.`,
    },
    {
      q: `Sau khi đăng ký thì bao lâu nhân viên kỹ thuật tới lắp đặt hoàn tất?`,
      a: `FPT 3 Miền cam kết thời gian khảo sát và lắp đặt thần tốc từ 12h đến tối đa 36h kể từ thời điểm ký hợp đồng điện tử. Đội ngũ kỹ thuật viên trực xuyên suốt 7 ngày trong tuần, kể cả Thứ Bảy, Chủ Nhật và ngày Lễ.`,
    },
  ];
}
