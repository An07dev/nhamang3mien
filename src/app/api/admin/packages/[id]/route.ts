import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';

// PATCH /api/admin/packages/[id] - Chỉnh sửa thông tin gói cước
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
        { success: false, error: 'ID gói cước không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name.trim();
    if (body.categoryKey) updateData.categoryKey = body.categoryKey.trim();
    if (body.speed) updateData.speed = body.speed.trim();
    if (body.price) updateData.price = body.price.trim();
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice.trim();
    if (body.isPopular !== undefined) updateData.isPopular = Boolean(body.isPopular);
    if (body.tag !== undefined) updateData.tag = body.tag.trim();
    if (body.theme) updateData.theme = body.theme;
    if (body.suitableFor !== undefined) updateData.suitableFor = body.suitableFor.trim();
    if (Array.isArray(body.features)) updateData.features = body.features.filter(Boolean);
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy gói cước để cập nhật' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật gói cước thành công',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Lỗi PATCH package:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi cập nhật gói cước' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packages/[id] - Xóa gói cước
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
        { success: false, error: 'ID gói cước không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();
    const deleted = await Package.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy gói cước để xóa' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa gói cước thành công',
    });
  } catch (error) {
    console.error('Lỗi DELETE package:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa gói cước' },
      { status: 500 }
    );
  }
}
