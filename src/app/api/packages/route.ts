import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ensureDefaultPackages } from '@/lib/seed-packages';
import Category from '@/models/Category';
import Package from '@/models/Package';

// GET /api/packages - Lấy danh sách đầu mục và các gói cước hiển thị ra trang chủ
export async function GET() {
  try {
    await connectDB();
    await ensureDefaultPackages();

    const [categories, packages] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1 }).lean(),
      Package.find({ isActive: true }).sort({ order: 1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      packages,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách gói cước:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Không thể tải danh sách gói cước',
      },
      { status: 500 }
    );
  }
}
