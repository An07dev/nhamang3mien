import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getTrackingConfig } from '@/lib/meta-capi';
import { normalizeAndHashPhone, normalizeAndHashName } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

// POST /api/admin/tracking/test - Bắn sự kiện test lên Meta CAPI
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const savedConfig = await getTrackingConfig();

    const pixelId = (body.pixelId || savedConfig.pixelId || '').trim();
    const capiToken = (body.capiToken || savedConfig.capiToken || '').trim();
    const testEventCode = (body.testEventCode || savedConfig.testEventCode || '').trim();

    if (!pixelId) {
      return NextResponse.json(
        { success: false, error: 'Chưa có Pixel ID. Vui lòng nhập Pixel ID.' },
        { status: 400 }
      );
    }

    if (!capiToken) {
      return NextResponse.json(
        { success: false, error: 'Chưa có CAPI Access Token. Vui lòng nhập Access Token từ Meta Events Manager.' },
        { status: 400 }
      );
    }

    const testEventId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const eventTime = Math.floor(Date.now() / 1000);

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'FPT-3-Mien-Admin-Test';

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: 'Lead',
          event_time: eventTime,
          event_id: testEventId,
          event_source_url: 'https://fpt3mien.com/admin/test',
          action_source: 'website',
          user_data: {
            ph: [normalizeAndHashPhone('0819900530')],
            fn: [normalizeAndHashName('Admin Test')],
            client_ip_address: clientIp,
            client_user_agent: userAgent,
          },
          custom_data: {
            test_mode: true,
            message: 'Sự kiện kiểm tra kết nối CAPI từ Quản trị viên FPT 3 Miền',
            package_name: 'Gói Sky (1 Gbps) - Test CAPI',
          },
        },
      ],
    };

    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${encodeURIComponent(
      capiToken
    )}`;

    const response = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: result?.error?.message || `Meta Graph API báo lỗi HTTP ${response.status}`,
        details: result,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Bắn test event CAPI thành công lên Meta Graph API!',
      data: {
        eventsReceived: result.events_received ?? 1,
        fbtraceId: result.fbtrace_id,
        testEventId,
        testEventCode: testEventCode || '(Không dùng test_event_code)',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi gửi test event CAPI' },
      { status: 500 }
    );
  }
}
