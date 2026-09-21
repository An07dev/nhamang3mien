import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export interface CapiLogItem {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  province?: string;
  packageName?: string;
  eventName: string;
  eventId?: string;
  sentAt: string;
  success: boolean;
  response?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface CapiStats {
  totalEvents: number;
  leadEvents: number;
  contactEvents: number;
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

    // Lấy các lead có chứa capiEvents
    const leads = await Lead.find({ 'capiEvents.0': { $exists: true } })
      .select('name phone province packageInterest clientMetadata capiEvents createdAt')
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    let totalEvents = 0;
    let leadEvents = 0;
    let contactEvents = 0;
    let completedEvents = 0;
    let successfulEvents = 0;
    let failedEvents = 0;

    const allLogs: CapiLogItem[] = [];

    leads.forEach((lead: any) => {
      if (Array.isArray(lead.capiEvents)) {
        lead.capiEvents.forEach((evt: any) => {
          totalEvents += 1;

          if (evt.eventName === 'Lead') leadEvents += 1;
          else if (evt.eventName === 'Contact') contactEvents += 1;
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
      leadEvents,
      contactEvents,
      completedEvents,
      successfulEvents,
      failedEvents,
      successRate,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        logs: allLogs.slice(0, 50),
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
