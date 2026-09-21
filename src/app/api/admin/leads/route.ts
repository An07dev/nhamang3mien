import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(request: NextRequest) {
  try {
    // 1. Kiểm tra xác thực Admin
    const session = await getAdminSession();
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu quyền Quản trị viên để truy cập' },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. Phân tích các tham số tìm kiếm & lọc
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '50', 10)));

    // 3. Xây dựng điều kiện truy vấn
    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { province: searchRegex },
        { packageInterest: searchRegex },
        { note: searchRegex },
      ];
    }

    // 4. Lấy dữ liệu phân trang
    const skip = (page - 1) * limit;
    const [leads, filteredTotal] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query),
    ]);

    // 5. Thống kê KPI tổng quan
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalAll, pendingCount, contactedCount, completedCount, todayCount] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ status: 'pending' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'completed' }),
      Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit) || 1,
      },
      stats: {
        total: totalAll,
        pending: pendingCount,
        contacted: contactedCount,
        completed: completedCount,
        today: todayCount,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách leads admin:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách khách hàng' },
      { status: 500 }
    );
  }
}
