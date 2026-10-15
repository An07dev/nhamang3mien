import { NextRequest, NextResponse } from 'next/server';
import { sendMetaCapiEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

// POST /api/tracking/event - Gửi sự kiện CAPI bất kỳ từ phía client lên Meta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      eventName,
      eventId,
      userData = {},
      customData = {},
      fbp,
      fbc,
      eventSourceUrl,
      testEventCode,
      overrideTestCode,
    } = body;

    if (!eventName) {
      return NextResponse.json(
        { success: false, error: 'Thiếu eventName' },
        { status: 400 }
      );
    }

    // Lấy IP và User Agent từ request headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || 'https://fpt3mien.com/';

    const capiRes = await sendMetaCapiEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || referer,
      userData: {
        phone: userData.phone,
        name: userData.name,
        email: userData.email,
        clientIp,
        userAgent,
        fbp: fbp || userData.fbp,
        fbc: fbc || userData.fbc,
      },
      customData,
      overrideTestCode: testEventCode || overrideTestCode,
    });

    return NextResponse.json({
      success: capiRes.success,
      skipped: capiRes.skipped || false,
      eventsReceived: capiRes.eventsReceived,
      fbtraceId: capiRes.fbtraceId,
      error: capiRes.error,
    });
  } catch (error: any) {
    console.error('[API Tracking Event Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý sự kiện tracking' },
      { status: 500 }
    );
  }
}
