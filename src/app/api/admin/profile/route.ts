import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import {
  getStoredAdminCredentials,
  verifyAdminPassword,
  saveAdminCredentials,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/profile - Lấy thông tin tài khoản admin hiện tại
export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const creds = await getStoredAdminCredentials();
    return NextResponse.json({
      success: true,
      data: {
        username: creds.username,
        isCustom: creds.isCustom,
        updatedAt: creds.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lấy thông tin tài khoản' },
      { status: 500 }
    );
  }
}

// POST /api/admin/profile - Đổi Tên đăng nhập và/hoặc Mật khẩu Admin
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { currentPassword, newUsername, newPassword } = body;

    // 1. Kiểm tra mật khẩu hiện tại
    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mật khẩu hiện tại để xác thực' },
        { status: 400 }
      );
    }

    const storedCreds = await getStoredAdminCredentials();
    const isCurrentPasswordValid = verifyAdminPassword(currentPassword, storedCreds);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu hiện tại không chính xác' },
        { status: 400 }
      );
    }

    // 2. Kiểm tra tên đăng nhập mới (nếu có đổi)
    const targetUsername = (newUsername || storedCreds.username).trim();
    if (targetUsername.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập mới phải có ít nhất 3 ký tự' },
        { status: 400 }
      );
    }

    // 3. Kiểm tra mật khẩu mới (nếu có đổi)
    let targetPassword: string | undefined = undefined;
    if (newPassword && newPassword.trim()) {
      const cleanNewPassword = newPassword.trim();
      if (cleanNewPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
          { status: 400 }
        );
      }
      targetPassword = cleanNewPassword;
    }

    // 4. Lưu vào CSDL MongoDB
    const result = await saveAdminCredentials(targetUsername, targetPassword);

    // 5. Cập nhật lại session token với username mới
    const token = createSessionToken(result.username);
    const response = NextResponse.json({
      success: true,
      message: 'Cập nhật tài khoản quản trị thành công!',
      data: {
        username: result.username,
        isCustom: result.isCustom,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Lỗi khi cập nhật tài khoản admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi cập nhật tài khoản quản trị' },
      { status: 500 }
    );
  }
}
