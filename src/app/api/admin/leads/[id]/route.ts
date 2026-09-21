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

    const updateData: Record<string, unknown> = {};
    if (status && ['pending', 'contacted', 'completed'].includes(status)) {
      updateData.status = status;
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

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedLead,
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
