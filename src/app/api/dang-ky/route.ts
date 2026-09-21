import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';

// POST /api/dang-ky - Lưu thông tin đăng ký của khách hàng vào CSDL
export async function POST(request: NextRequest) {
  try {
    let body: {
      name?: string;
      phone?: string;
      province?: string;
      packageInterest?: string;
      note?: string;
      source?: string;
      eventId?: string;
      fbp?: string;
      fbc?: string;
    } = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        province: formData.get('province') as string,
        packageInterest: formData.get('packageInterest') as string,
        note: formData.get('note') as string,
        source: formData.get('source') as string,
        eventId: formData.get('eventId') as string,
        fbp: formData.get('fbp') as string,
        fbc: formData.get('fbc') as string,
      };
    } else {
      body = await request.json().catch(() => ({}));
    }

    const { name, phone, province, packageInterest, note, source } = body;

    // Trích xuất metadata trình duyệt của khách hàng
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : (request.headers.get('x-real-ip') || '127.0.0.1');
    const userAgent = request.headers.get('user-agent') || '';
    const cookieFbp = request.cookies.get('_fbp')?.value || '';
    const cookieFbc = request.cookies.get('_fbc')?.value || '';

    const finalFbp = body.fbp || cookieFbp;
    const finalFbc = body.fbc || cookieFbc;
    const finalEventId =
      body.eventId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Kiểm tra họ và tên
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quý khách vui lòng nhập họ và tên (tối thiểu 2 ký tự)',
        },
        { status: 400 }
      );
    }

    // 2. Kiểm tra số điện thoại (đầu số Việt Nam: 03, 05, 07, 08, 09 hoặc +84)
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Quý khách vui lòng nhập số điện thoại liên hệ',
        },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Số điện thoại không đúng định dạng (Ví dụ: 0981234567 hoặc 0819900530)',
        },
        { status: 400 }
      );
    }

    // 3. Kết nối CSDL MongoDB
    await connectDB();

    // 4. Lưu vào CSDL
    const newLead = await Lead.create({
      name: name.trim(),
      phone: cleanPhone,
      province: (province && province.trim()) || 'TP. Hồ Chí Minh',
      packageInterest: (packageInterest && packageInterest.trim()) || 'Gói Sky (1 Gbps) - Bán chạy',
      note: (note && note.trim()) || '',
      source: (source && source.trim()) || 'Đăng Ký Liền Tay (Hero Banner)',
      status: 'pending',
      clientMetadata: {
        clientIp,
        userAgent,
        fbp: finalFbp,
        fbc: finalFbc,
        lastEventId: finalEventId,
      },
    });

    // 5. Kích hoạt Meta Conversions API (CAPI) cho sự kiện Lead (không chặn luồng nếu Meta lỗi)
    let capiStatus = { sent: false, error: '' };
    try {
      const { sendMetaCapiEvent } = await import('@/lib/meta-capi');
      const capiRes = await sendMetaCapiEvent({
        eventName: 'Lead',
        eventId: finalEventId,
        eventSourceUrl: request.headers.get('referer') || 'https://fpt3mien.com/',
        userData: {
          phone: cleanPhone,
          name: name.trim(),
          clientIp,
          userAgent,
          fbp: finalFbp,
          fbc: finalFbc,
        },
        customData: {
          content_name: newLead.packageInterest,
          lead_id: newLead._id.toString(),
          status: 'pending',
        },
      });

      if (!capiRes.skipped) {
        capiStatus = {
          sent: capiRes.success,
          error: capiRes.error || '',
        };

        await Lead.findByIdAndUpdate(newLead._id, {
          $push: {
            capiEvents: {
              eventName: 'Lead',
              eventId: finalEventId,
              sentAt: new Date(),
              success: capiRes.success,
              response: capiRes.success
                ? `Thành công (Events: ${capiRes.eventsReceived})`
                : (capiRes.error || 'Thất bại'),
            },
          },
        });
      }
    } catch (capiErr: any) {
      console.warn('[CAPI Trigger Error]:', capiErr?.message);
    }

    // 6. Trả về kết quả thành công
    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công! Chuyên viên FPT 3 Miền sẽ liên hệ quý khách trong vòng 5 phút.',
        data: {
          id: newLead._id.toString(),
          name: newLead.name,
          phone: newLead.phone,
          province: newLead.province,
          packageInterest: newLead.packageInterest,
          source: newLead.source,
          status: newLead.status,
          eventId: finalEventId,
          capi: capiStatus,
          createdAt: newLead.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi khi lưu đăng ký vào CSDL:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi hệ thống khi lưu đăng ký. Vui lòng thử lại.',
      },
      { status: 500 }
    );
  }
}

// GET /api/dang-ky - Lấy danh sách đăng ký gần nhất
export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Không thể kết nối CSDL',
      },
      { status: 500 }
    );
  }
}
