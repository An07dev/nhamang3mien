import { NextResponse } from 'next/server';
import { getTrackingConfig } from '@/lib/meta-capi';
import { PublicTrackingConfig } from '@/lib/tracking-config';

export const dynamic = 'force-dynamic';

// GET /api/settings/tracking - Lấy cấu hình Pixel công khai (chỉ trả về pixelId và isEnabled)
export async function GET() {
  try {
    const config = await getTrackingConfig();

    const publicConfig: PublicTrackingConfig = {
      pixelId: config.pixelId || '',
      isEnabled: Boolean(config.isEnabled && config.pixelId),
    };

    return NextResponse.json({
      success: true,
      data: publicConfig,
    });
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình tracking công khai:', error);
    return NextResponse.json({
      success: true,
      data: { pixelId: '', isEnabled: false },
    });
  }
}
