import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { DEFAULT_TRACKING_CONFIG, TrackingConfig } from '@/lib/tracking-config';

export const dynamic = 'force-dynamic';

// GET /api/admin/tracking - Lấy cấu hình Tracking cho Quản trị viên
export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'tracking_config' }).lean();

    const config: TrackingConfig = {
      ...DEFAULT_TRACKING_CONFIG,
      ...(doc?.value || {}),
    };

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lấy cấu hình tracking' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tracking - Lưu cấu hình Tracking
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const pixelId = (body.pixelId || '').trim();
    const capiToken = (body.capiToken || '').trim();
    const testEventCode = (body.testEventCode || '').trim();
    const isEnabled = Boolean(body.isEnabled);

    const newConfig: TrackingConfig = {
      pixelId,
      capiToken,
      testEventCode,
      isEnabled,
    };

    await connectDB();
    const updated = await Setting.findOneAndUpdate(
      { key: 'tracking_config' },
      { $set: { value: newConfig } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Đã lưu cấu hình Meta Pixel & CAPI thành công!',
      data: updated.value,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lưu cấu hình tracking' },
      { status: 500 }
    );
  }
}
