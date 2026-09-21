import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { getAdminSession } from '@/lib/auth';
import {
  DEFAULT_CONTACT_CONFIG,
  SiteContactConfig,
  sanitizeTel,
  normalizeZaloUrl,
} from '@/lib/contact-config';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings - Lấy cấu hình cho Admin
export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'contact_config' }).lean();

    const config: SiteContactConfig = {
      ...DEFAULT_CONTACT_CONFIG,
      ...(doc?.value || {}),
    };

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lấy cấu hình' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Cập nhật cấu hình
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const hotline = (body.hotline || '').trim();
    if (!hotline) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập số điện thoại Hotline' },
        { status: 400 }
      );
    }

    const hotlineTel = (body.hotlineTel || '').trim() || sanitizeTel(hotline);
    const zaloUrl = normalizeZaloUrl((body.zaloUrl || '').trim() || hotlineTel);
    const zaloPhone = (body.zaloPhone || '').trim() || sanitizeTel(zaloUrl);
    const supportHours = (body.supportHours || '').trim() || DEFAULT_CONTACT_CONFIG.supportHours;
    const consultTitle = (body.consultTitle || '').trim() || DEFAULT_CONTACT_CONFIG.consultTitle;

    const newConfig: SiteContactConfig = {
      hotline,
      hotlineTel,
      zaloUrl,
      zaloPhone,
      supportHours,
      consultTitle,
    };

    await connectDB();
    const updated = await Setting.findOneAndUpdate(
      { key: 'contact_config' },
      { $set: { value: newConfig } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Đã lưu cấu hình liên hệ thành công!',
      data: updated.value,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lưu cấu hình' },
      { status: 500 }
    );
  }
}
