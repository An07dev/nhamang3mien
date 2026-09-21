import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu yêu cầu không hợp lệ' },
        { status: 400 }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' },
        { status: 400 }
      );
    }

    const { getStoredAdminCredentials, verifyAdminPassword } = await import('@/lib/admin-auth');
    const storedCreds = await getStoredAdminCredentials();

    // So khớp tên đăng nhập và mật khẩu
    const isUsernameMatch = username.trim().toLowerCase() === storedCreds.username.toLowerCase();
    const isPasswordMatch = verifyAdminPassword(password, storedCreds);

    if (!isUsernameMatch || !isPasswordMatch) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Tạo token bảo mật
    const token = createSessionToken(username.trim());

    // Thiết lập HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        username: username.trim(),
        role: 'admin',
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    return response;
  } catch (error) {
    console.error('Lỗi khi đăng nhập admin:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi hệ thống khi xác thực tài khoản' },
      { status: 500 }
    );
  }
}
