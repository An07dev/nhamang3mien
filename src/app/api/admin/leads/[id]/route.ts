import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import mongoose from 'mongoose';

// PATCH /api/admin/leads/[id] - Cập nhật trạng thái hoặc ghi chú
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu quyền Quản trị viên' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID khách hàng không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { status, note } = body;

    await connectDB();

    const currentLead = await Lead.findById(id);
    if (!currentLead) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy khách hàng' },
        { status: 404 }
      );
    }

    const previousStatus = currentLead.status;
    const updateData: Record<string, unknown> = {};
    let isStatusChanged = false;

    if (status && ['pending', 'contacted', 'completed'].includes(status)) {
      updateData.status = status;
      if (status !== previousStatus) {
        isStatusChanged = true;
      }
    }
    if (typeof note === 'string') {
      updateData.note = note.trim();
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy khách hàng' },
        { status: 400 }
      );
    }

    // Nếu trạng thái thay đổi, kích hoạt Meta CAPI theo dõi vòng đời khách hàng
    let capiResponseInfo: any = null;
    if (isStatusChanged && status) {
      try {
        const { sendMetaCapiEvent } = await import('@/lib/meta-capi');
        let capiEventName = '';

        if (status === 'contacted') {
          // Trạng thái đã liên hệ / đang tư vấn
          capiEventName = 'Contact';
        } else if (status === 'completed') {
          // Trạng thái đã hoàn tất / đã lắp đặt & nghiệm thu
          capiEventName = 'CompleteRegistration';
        }

        if (capiEventName) {
          const statusEventId = `status_${status}_${updatedLead._id}_${Date.now()}`;
          const capiRes = await sendMetaCapiEvent({
            eventName: capiEventName,
            eventId: statusEventId,
            eventSourceUrl: 'https://fpt3mien.com/crm/leads',
            userData: {
              phone: updatedLead.phone,
              name: updatedLead.name,
              clientIp: updatedLead.clientMetadata?.clientIp,
              userAgent: updatedLead.clientMetadata?.userAgent,
              fbp: updatedLead.clientMetadata?.fbp,
              fbc: updatedLead.clientMetadata?.fbc,
            },
            customData: {
              lead_id: updatedLead._id.toString(),
              previous_status: previousStatus,
              new_status: status,
              package_name: updatedLead.packageInterest,
              currency: 'VND',
            },
          });

          if (!capiRes.skipped) {
            capiResponseInfo = {
              eventName: capiEventName,
              success: capiRes.success,
              error: capiRes.error,
              eventsReceived: capiRes.eventsReceived,
            };

            await Lead.findByIdAndUpdate(updatedLead._id, {
              $push: {
                capiEvents: {
                  eventName: capiEventName,
                  eventId: statusEventId,
                  sentAt: new Date(),
                  success: capiRes.success,
                  response: capiRes.success
                    ? `Thành công (Events: ${capiRes.eventsReceived})`
                    : (capiRes.error || 'Thất bại'),
                },
              },
            });
          }
        }
      } catch (capiErr: any) {
        console.warn('[CAPI Status Transition Error]:', capiErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedLead,
      capi: capiResponseInfo,
    });
  } catch (error) {
    console.error('Lỗi PATCH lead:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi cập nhật khách hàng' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/leads/[id] - Xóa bản ghi khách hàng
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu quyền Quản trị viên' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID khách hàng không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();
    const deleted = await Lead.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy khách hàng để xóa' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bản ghi khách hàng',
    });
  } catch (error) {
    console.error('Lỗi DELETE lead:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi xóa khách hàng' },
      { status: 500 }
    );
  }
}
