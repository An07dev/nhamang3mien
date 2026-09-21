import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminDashboardClient from './admin-dashboard-client';

export const metadata = {
  title: 'Quản Trị Khách Hàng | Nhà Mạng 3 Miền',
  description: 'Hệ thống tiếp nhận và quản lý khách hàng đăng ký lắp đặt internet và truyền hình',
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session.authenticated) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient username={session.username || 'admin'} />;
}
