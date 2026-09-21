import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

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
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    const headers = [
      'STT',
      'Họ và Tên',
      'Số Điện Thoại',
      'Tỉnh/Thành Phố',
      'Gói Cước Quan Tâm',
      'Nguồn Đăng Ký',
      'Trạng Thái',
      'Ghi Chú',
      'Thời Gian Đăng Ký',
    ];

    const statusMap: Record<string, string> = {
      pending: 'Chờ liên hệ',
      contacted: 'Đã gọi tư vấn',
      completed: 'Hoàn tất lắp đặt',
    };

    const rows = leads.map((l, index) => {
      const createdDate = l.createdAt ? new Date(l.createdAt).toLocaleString('vi-VN') : '';
      return [
        index + 1,
        escapeCsvCell(l.name),
        escapeCsvCell(`'${l.phone}`), // Dấu nháy đơn để Excel không làm mất số 0 đầu
        escapeCsvCell(l.province || ''),
        escapeCsvCell(l.packageInterest || ''),
        escapeCsvCell(l.source || 'Website'),
        escapeCsvCell(statusMap[l.status] || l.status),
        escapeCsvCell(l.note || ''),
        escapeCsvCell(createdDate),
      ].join(',');
    });

    // Thêm BOM (\uFEFF) để Excel hiển thị đúng tiếng Việt có dấu
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="khach-hang-nhamang3mien-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error('Lỗi xuất file CSV:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo file xuất báo cáo' },
      { status: 500 }
    );
  }
}
