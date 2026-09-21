import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { ensureDefaultPackages } from '@/lib/seed-packages';
import Package from '@/models/Package';
import Category from '@/models/Category';

// GET /api/admin/packages - Lấy toàn bộ gói cước cho quản trị viên
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('categoryKey');

    const query: Record<string, unknown> = {};
    if (categoryKey && categoryKey !== 'all') {
      query.categoryKey = categoryKey;
    }

    const [packages, categories] = await Promise.all([
      Package.find(query).sort({ categoryKey: 1, order: 1 }).lean(),
      Category.find().sort({ order: 1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: packages,
      categories,
    });
  } catch (error) {
    console.error('Lỗi GET admin packages:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi tải danh sách gói cước quản trị' },
      { status: 500 }
    );
  }
}

// POST /api/admin/packages - Thêm mới gói cước
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
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const {
      name,
      categoryKey,
      speed,
      price,
      originalPrice,
      isPopular,
      tag,
      theme,
      suitableFor,
      features,
      order,
      isActive,
    } = body;

    if (!name || !categoryKey || !speed || !price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ Tên gói cước, Đầu mục, Tốc độ và Giá cước',
        },
        { status: 400 }
      );
    }

    await connectDB();

    const newPackage = await Package.create({
      name: name.trim(),
      categoryKey: categoryKey.trim(),
      speed: speed.trim(),
      price: price.trim(),
      originalPrice: (originalPrice && originalPrice.trim()) || '',
      isPopular: Boolean(isPopular),
      tag: (tag && tag.trim()) || '',
      theme: theme || 'orange',
      suitableFor: (suitableFor && suitableFor.trim()) || '',
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      order: typeof order === 'number' ? order : 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thêm gói cước mới thành công',
        data: newPackage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lỗi POST admin packages:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi khi tạo gói cước mới',
      },
      { status: 500 }
    );
  }
}
