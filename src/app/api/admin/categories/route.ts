import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { ensureDefaultPackages } from '@/lib/seed-packages';
import Category from '@/models/Category';
import Package from '@/models/Package';

// GET /api/admin/categories - Lấy danh sách toàn bộ đầu mục
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu quyền Quản trị viên' },
        { status: 401 }
      );
    }

    await connectDB();
    await ensureDefaultPackages();

    const categories = await Category.find().sort({ order: 1 }).lean();

    // Đếm số lượng gói cước trong từng đầu mục
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Package.countDocuments({ categoryKey: cat.key });
        return {
          ...cat,
          packageCount: count,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    console.error('Lỗi GET admin categories:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi tải danh sách đầu mục' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Thêm mới đầu mục gói cước
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu quyền Quản trị viên' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.key || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập Mã đầu mục (key) và Tên đầu mục' },
        { status: 400 }
      );
    }

    await connectDB();

    const cleanKey = body.key.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const existing = await Category.findOne({ key: cleanKey });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Mã đầu mục "${cleanKey}" đã tồn tại` },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({
      key: cleanKey,
      name: body.name.trim(),
      description: body.description?.trim() || '',
      icon: body.icon?.trim() || 'Wifi',
      order: typeof body.order === 'number' ? body.order : 1,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thêm đầu mục gói cước thành công',
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi POST admin category:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo đầu mục mới' },
      { status: 500 }
    );
  }
}
