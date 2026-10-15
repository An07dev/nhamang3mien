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

    // Ghi nhật ký vào CSDL để Quản trị viên theo dõi thời gian thực
    if (!capiRes.skipped) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const CapiLog = (await import('@/models/CapiLog')).default;
        await connectDB();

        let displayLeadName = userData.name || '';
        let displayPackageName = customData.content_name || customData.packageName || '';
        let displayProvince = customData.province || customData.content_category || '';

        if (!displayLeadName) {
          if (eventName === 'PageView') {
            displayLeadName = 'Khách xem trang';
            displayPackageName = customData.page_title || customData.pathname || 'Trang chủ';
          } else if (eventName === 'ViewContent') {
            displayLeadName = 'Khách xem gói cước';
          } else if (eventName === 'InitiateCheckout') {
            displayLeadName = 'Khách bắt đầu đăng ký';
          } else if (eventName === 'Contact') {
            displayLeadName = 'Khách bấm gọi / Zalo';
            displayPackageName = customData.method || customData.href || 'Liên hệ';
          } else if (eventName === 'FindLocation') {
            displayLeadName = 'Khách chọn khu vực';
            displayProvince = customData.content_name || displayProvince;
            displayPackageName = displayProvince ? `Khu vực: ${displayProvince}` : 'Chọn khu vực';
          } else if (eventName === 'Search') {
            displayLeadName = 'Khách lọc danh mục';
            displayPackageName = customData.search_string || customData.content_category || 'Lọc gói cước';
          } else if (eventName === 'CustomizeProduct') {
            displayLeadName = 'Khách tùy chọn gói';
            displayPackageName = customData.content_name
              ? `${customData.content_name} (${customData.custom_name || ''}: ${customData.custom_value || ''})`
              : 'Tùy chọn gói';
          } else if (eventName === 'ViewFAQ') {
            displayLeadName = 'Khách xem giải đáp FAQ';
            displayPackageName = customData.content_name || customData.question || 'Câu hỏi thường gặp';
          } else if (eventName === 'CompleteRegistration') {
            displayLeadName = 'Khách hoàn tất đăng ký';
          } else if (eventName === 'Lead') {
            displayLeadName = 'Khách gửi đơn đăng ký';
          } else {
            displayLeadName = `Khách thực hiện ${eventName}`;
          }
        }

        await CapiLog.create({
          eventName,
          eventId,
          leadName: displayLeadName,
          phone: userData.phone || '',
          province: displayProvince,
          packageName: displayPackageName,
          clientIp,
          userAgent,
          success: Boolean(capiRes.success),
          response: capiRes.success
            ? `Thành công (Events: ${capiRes.eventsReceived || 1})`
            : capiRes.error || 'Thất bại',
          fbtraceId: capiRes.fbtraceId || '',
          sentAt: new Date(),
        });
      } catch (logErr) {
        console.warn('[CapiLog Record Error]:', logErr);
      }
    }

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
