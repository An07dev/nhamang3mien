import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json(
      { authenticated: false, error: 'Chưa đăng nhập' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: 'admin',
    },
  });
}
