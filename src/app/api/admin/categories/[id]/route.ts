import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Package from '@/models/Package';
import mongoose from 'mongoose';

// PATCH /api/admin/categories/[id] - Cập nhật đầu mục
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
        { success: false, error: 'ID đầu mục không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.icon) updateData.icon = body.icon.trim();
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const updated = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đầu mục để cập nhật' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật đầu mục thành công',
      data: updated,
    });
  } catch (error) {
    console.error('Lỗi PATCH category:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi cập nhật đầu mục' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Xóa đầu mục
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
        { success: false, error: 'ID đầu mục không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đầu mục' },
        { status: 404 }
      );
    }

    // Kiểm tra xem có gói cước nào đang thuộc đầu mục này không
    const pkgCount = await Package.countDocuments({ categoryKey: category.key });
    if (pkgCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Không thể xóa đầu mục này vì đang có ${pkgCount} gói cước bên trong. Vui lòng chuyển hoặc xóa các gói cước trước.`,
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa đầu mục thành công',
    });
  } catch (error) {
    console.error('Lỗi DELETE category:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa đầu mục' },
      { status: 500 }
    );
  }
}
