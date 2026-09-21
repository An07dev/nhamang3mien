import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length,
    });
  } catch (error) {
    const res: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi máy chủ',
    };
    return NextResponse.json(res, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Họ tên và số điện thoại là bắt buộc' },
        { status: 400 }
      );
    }

    const cleanPhone = body.phone.replace(/\s+/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();
    const newLead = await Lead.create({
      name: body.name.trim(),
      phone: cleanPhone,
      province: body.province?.trim() || 'TP. Hồ Chí Minh',
      packageInterest: body.packageInterest?.trim() || 'Gói Sky (1 Gbps)',
      note: body.note?.trim() || '',
      source: body.source?.trim() || 'Website',
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        data: newLead,
        message: 'Đăng ký thành công! Chuyên viên Nhà Mạng 3 Miền sẽ liên hệ trong 5 phút.',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
}
