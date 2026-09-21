import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { DEFAULT_CONTACT_CONFIG, SiteContactConfig } from '@/lib/contact-config';

export const dynamic = 'force-dynamic';

// GET /api/settings - Lấy cấu hình liên hệ công khai
export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'contact_config' }).lean();

    if (doc && doc.value) {
      const mergedConfig: SiteContactConfig = {
        ...DEFAULT_CONTACT_CONFIG,
        ...(doc.value as Partial<SiteContactConfig>),
      };
      return NextResponse.json({
        success: true,
        data: mergedConfig,
      });
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_CONTACT_CONFIG,
    });
  } catch (error) {
    console.error('Lỗi khi tải cấu hình:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_CONTACT_CONFIG,
      fromFallback: true,
    });
  }
}
