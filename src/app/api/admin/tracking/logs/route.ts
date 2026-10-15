import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import CapiLog from '@/models/CapiLog';

export const dynamic = 'force-dynamic';

export interface CapiLogItem {
  id: string;
  leadId?: string;
  leadName: string;
  phone: string;
  province?: string;
  packageName?: string;
  eventName: string;
  eventId?: string;
  sentAt: string;
  success: boolean;
  response?: string;
  fbtraceId?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface CapiStats {
  totalEvents: number;
  pageViewEvents: number;
  viewContentEvents: number;
  initiateCheckoutEvents: number;
  leadEvents: number;
  contactEvents: number;
  findLocationEvents: number;
  searchEvents: number;
  customizeProductEvents: number;
  viewFaqEvents: number;
  completedEvents: number;
  successfulEvents: number;
  failedEvents: number;
  successRate: number;
}

// GET /api/admin/tracking/logs - Lấy thống kê và danh sách nhật ký sự kiện CAPI gần nhất
export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // 1. Lấy nhật ký từ collection CapiLog mới (giới hạn 150 sự kiện gần nhất)
    const capiLogs = await CapiLog.find()
      .sort({ sentAt: -1 })
      .limit(150)
      .lean();

    // 2. Lấy thêm nhật ký lịch sử gắn liền với Lead
    const leads = await Lead.find({ 'capiEvents.0': { $exists: true } })
      .select('name phone province packageInterest clientMetadata capiEvents createdAt')
      .sort({ updatedAt: -1 })
      .limit(150)
      .lean();

    const seenEventIds = new Set<string>();
    const allLogs: CapiLogItem[] = [];

    let totalEvents = 0;
    let pageViewEvents = 0;
    let viewContentEvents = 0;
    let initiateCheckoutEvents = 0;
    let leadEvents = 0;
    let contactEvents = 0;
    let findLocationEvents = 0;
    let searchEvents = 0;
    let customizeProductEvents = 0;
    let viewFaqEvents = 0;
    let completedEvents = 0;
    let successfulEvents = 0;
    let failedEvents = 0;

    // Nạp logs từ CapiLog collection trước
    capiLogs.forEach((log: any) => {
      const key = log.eventId || log._id.toString();
      seenEventIds.add(key);

      totalEvents += 1;
      if (log.eventName === 'PageView') pageViewEvents += 1;
      else if (log.eventName === 'ViewContent') viewContentEvents += 1;
      else if (log.eventName === 'InitiateCheckout') initiateCheckoutEvents += 1;
      else if (log.eventName === 'Lead') leadEvents += 1;
      else if (log.eventName === 'Contact') contactEvents += 1;
      else if (log.eventName === 'FindLocation') findLocationEvents += 1;
      else if (log.eventName === 'Search') searchEvents += 1;
      else if (log.eventName === 'CustomizeProduct') customizeProductEvents += 1;
      else if (log.eventName === 'ViewFAQ') viewFaqEvents += 1;
      else if (log.eventName === 'CompleteRegistration' || log.eventName === 'Purchase')
        completedEvents += 1;

      if (log.success) successfulEvents += 1;
      else failedEvents += 1;

      allLogs.push({
        id: log._id.toString(),
        leadId: log.leadId || '',
        leadName: log.leadName || 'Khách truy cập',
        phone: log.phone || '',
        province: log.province || '',
        packageName: log.packageName || '',
        eventName: log.eventName,
        eventId: log.eventId,
        sentAt: log.sentAt ? new Date(log.sentAt).toISOString() : new Date().toISOString(),
        success: Boolean(log.success),
        response: log.response || '',
        fbtraceId: log.fbtraceId || '',
        clientIp: log.clientIp,
        userAgent: log.userAgent,
      });
    });

    // Nạp thêm từ leads nếu chưa có trong seenEventIds
    leads.forEach((lead: any) => {
      if (Array.isArray(lead.capiEvents)) {
        lead.capiEvents.forEach((evt: any) => {
          const key = evt.eventId || `${lead._id}_${evt.sentAt}`;
          if (seenEventIds.has(key)) return;
          seenEventIds.add(key);

          totalEvents += 1;
          if (evt.eventName === 'PageView') pageViewEvents += 1;
          else if (evt.eventName === 'ViewContent') viewContentEvents += 1;
          else if (evt.eventName === 'InitiateCheckout') initiateCheckoutEvents += 1;
          else if (evt.eventName === 'Lead') leadEvents += 1;
          else if (evt.eventName === 'Contact') contactEvents += 1;
          else if (evt.eventName === 'FindLocation') findLocationEvents += 1;
          else if (evt.eventName === 'Search') searchEvents += 1;
          else if (evt.eventName === 'CustomizeProduct') customizeProductEvents += 1;
          else if (evt.eventName === 'ViewFAQ') viewFaqEvents += 1;
          else if (evt.eventName === 'CompleteRegistration' || evt.eventName === 'Purchase')
            completedEvents += 1;

          if (evt.success) successfulEvents += 1;
          else failedEvents += 1;

          allLogs.push({
            id: evt._id ? evt._id.toString() : `${lead._id}_${evt.sentAt}`,
            leadId: lead._id.toString(),
            leadName: lead.name,
            phone: lead.phone,
            province: lead.province,
            packageName: lead.packageInterest,
            eventName: evt.eventName,
            eventId: evt.eventId,
            sentAt: evt.sentAt ? new Date(evt.sentAt).toISOString() : new Date().toISOString(),
            success: Boolean(evt.success),
            response: evt.response || '',
            clientIp: lead.clientMetadata?.clientIp,
            userAgent: lead.clientMetadata?.userAgent,
          });
        });
      }
    });

    // Sắp xếp nhật ký theo thời gian giảm dần
    allLogs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    const successRate = totalEvents > 0 ? Math.round((successfulEvents / totalEvents) * 100) : 100;

    const stats: CapiStats = {
      totalEvents,
      pageViewEvents,
      viewContentEvents,
      initiateCheckoutEvents,
      leadEvents,
      contactEvents,
      findLocationEvents,
      searchEvents,
      customizeProductEvents,
      viewFaqEvents,
      completedEvents,
      successfulEvents,
      failedEvents,
      successRate,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        logs: allLogs.slice(0, 80),
      },
    });
  } catch (error: any) {
    console.error('Lỗi khi tải nhật ký CAPI:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi tải nhật ký CAPI' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tracking/logs - Xóa toàn bộ nhật ký sự kiện CAPI
export async function DELETE() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    // 1. Xóa toàn bộ collection CapiLog
    await CapiLog.deleteMany({});

    // 2. Xóa toàn bộ mảng capiEvents trên tất cả các Lead
    await Lead.updateMany({}, { $set: { capiEvents: [] } });

    // 3. Xóa các lead test nếu có
    await Lead.deleteMany({ source: 'Test CAPI Trực Tuyến' });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa toàn bộ nhật ký sự kiện CAPI thành công!',
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa nhật ký CAPI:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi xóa nhật ký CAPI' },
      { status: 500 }
    );
  }
}
