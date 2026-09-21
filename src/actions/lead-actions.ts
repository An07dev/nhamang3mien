'use server';

import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { revalidatePath } from 'next/cache';

export interface LeadSubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface RecentLeadItem {
  id: string;
  name: string;
  phoneMasked: string;
  packageInterest: string;
  timeAgo: string;
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 10) {
    return clean.slice(0, 3) + '******' + clean.slice(-3);
  }
  return clean.slice(0, 2) + '****' + clean.slice(-2);
}

export async function createLeadAction(formData: FormData): Promise<LeadSubmissionResult> {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const province = (formData.get('province') as string) || 'TP. Hồ Chí Minh';
    const packageInterest = (formData.get('packageInterest') as string) || 'Gói Sky (1 Gbps)';
    const note = (formData.get('note') as string) || '';

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Quý khách vui lòng nhập họ và tên' };
    }

    const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';
    // Vietnamese phone number regex: starts with 0 and has 10 digits
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return { success: false, error: 'Số điện thoại không hợp lệ (ví dụ: 0987654321)' };
    }

    await connectDB();

    await Lead.create({
      name: name.trim(),
      phone: cleanPhone,
      province: province.trim(),
      packageInterest: packageInterest.trim(),
      note: note.trim(),
      status: 'pending',
    });

    revalidatePath('/');
    return {
      success: true,
      message: 'Đăng ký thành công! Chuyên viên Nhà Mạng 3 Miền sẽ liên hệ hỗ trợ trong vòng 5 phút.',
    };
  } catch (error) {
    console.error('Lỗi khi lưu thông tin khách hàng:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại sau.',
    };
  }
}

export async function getRecentLeadsAction(): Promise<RecentLeadItem[]> {
  try {
    await connectDB();
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const dbLeads: RecentLeadItem[] = leads.map((l) => ({
      id: l._id.toString(),
      name: l.name,
      phoneMasked: maskPhone(l.phone),
      packageInterest: l.packageInterest || 'Gói Sky (1 Gbps)',
      timeAgo: 'vừa xong',
    }));

    // Danh sách mẫu phong phú dự phòng
    const defaultLeads: RecentLeadItem[] = [
      { id: 'd1', name: 'Nguyễn Văn Tuấn', phoneMasked: '098******218', packageInterest: 'Combo Sky - V.VIP', timeAgo: '2 phút trước' },
      { id: 'd2', name: 'Trần Thị Mai', phoneMasked: '090******562', packageInterest: 'Gói Giga (300 Mbps)', timeAgo: '5 phút trước' },
      { id: 'd3', name: 'Lê Hoàng Long', phoneMasked: '091******789', packageInterest: 'Gói Sky (1 Gbps)', timeAgo: '12 phút trước' },
      { id: 'd4', name: 'Phạm Minh Đức', phoneMasked: '038******451', packageInterest: 'Gói F-Game Ultra', timeAgo: '15 phút trước' },
      { id: 'd5', name: 'Vũ Thị Hạnh', phoneMasked: '097******632', packageInterest: 'Combo Meta - V.VIP', timeAgo: '22 phút trước' },
      { id: 'd6', name: 'Đặng Quốc Anh', phoneMasked: '086******990', packageInterest: 'Doanh nghiệp Lux 500', timeAgo: '30 phút trước' },
    ];

    return [...dbLeads, ...defaultLeads].slice(0, 10);
  } catch (err) {
    console.error('Lỗi getRecentLeadsAction:', err);
    return [
      { id: 'd1', name: 'Nguyễn Văn Tuấn', phoneMasked: '098******218', packageInterest: 'Combo Sky - V.VIP', timeAgo: '2 phút trước' },
      { id: 'd2', name: 'Trần Thị Mai', phoneMasked: '090******562', packageInterest: 'Gói Giga (300 Mbps)', timeAgo: '5 phút trước' },
      { id: 'd3', name: 'Lê Hoàng Long', phoneMasked: '091******789', packageInterest: 'Gói Sky (1 Gbps)', timeAgo: '12 phút trước' },
    ];
  }
}
