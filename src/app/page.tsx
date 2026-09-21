import type { Metadata } from 'next';
import LandingPageClient from '@/components/landing/landing-page-client';

export const metadata: Metadata = {
  title: 'Lắp Wifi Nhà Mạng 3 Miền Giá Tốt, Tốc Độ Cao 1 Gbps | Khuyến Mãi Lớn',
  description:
    'Đăng ký lắp mạng Internet cáp quang Nhà Mạng 3 Miền khuyến mãi 2026. Phủ sóng Bắc - Trung - Nam, tốc độ cực đỉnh lên đến 1 Gbps, trang bị Modem Wi-Fi 6 miễn phí, lắp đặt nhanh 12h - 36h.',
  keywords: [
    'Nhà mạng 3 miền',
    'Lắp wifi Nhà mạng 3 miền',
    'Cáp quang 3 miền',
    'Internet 3 miền',
    'Wifi 6 Nhà mạng 3 miền',
    'Khuyến mãi lắp wifi',
  ],
  openGraph: {
    title: 'Lắp Wifi Nhà Mạng 3 Miền Giá Tốt, Tốc Độ Cao 1 Gbps | Modem Wi-Fi 6 Miễn Phí',
    description:
      'Đăng ký lắp mạng Internet cáp quang Nhà Mạng 3 Miền khuyến mãi 2026. Tốc độ cực đỉnh lên đến 1 Gbps, trang bị Modem Wi-Fi 6 miễn phí.',
    type: 'website',
  },
};

export default function Home() {
  return <LandingPageClient />;
}
