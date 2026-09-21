export interface SiteContactConfig {
  hotline: string;
  hotlineTel: string;
  zaloUrl: string;
  zaloPhone: string;
  supportHours: string;
  consultTitle: string;
}

export const DEFAULT_CONTACT_CONFIG: SiteContactConfig = {
  hotline: process.env.NEXT_PUBLIC_HOTLINE || '0819 900 530',
  hotlineTel: process.env.NEXT_PUBLIC_HOTLINE_TEL || '0819900530',
  zaloUrl: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0819900530',
  zaloPhone: '0819900530',
  supportHours: 'Phục vụ 24/7 (Kể cả Thứ 7, Chủ Nhật & Ngày Lễ)',
  consultTitle: 'Tư Vấn & Lắp Đặt Siêu Tốc Trong 24h',
};

// Chuẩn hóa số điện thoại quay số (chỉ lấy số và dấu + nếu có)
export function sanitizeTel(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

// Tạo link Zalo chuẩn từ số điện thoại hoặc link
export function normalizeZaloUrl(input: string): string {
  if (!input) return 'https://zalo.me/';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const cleanPhone = sanitizeTel(trimmed);
  return `https://zalo.me/${cleanPhone}`;
}
