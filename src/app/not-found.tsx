import Link from 'next/link';
import { ArrowLeft, Wifi, Home, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#FF6320] flex items-center justify-center mx-auto">
          <Wifi className="w-8 h-8" />
        </div>

        <div>
          <span className="text-4xl sm:text-5xl font-black text-[#FF6320] block">404</span>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-2">
            Không Tìm Thấy Trang Hoặc Gói Cước
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Gói cước bạn đang tìm kiếm có thể đã được cập nhật hoặc không còn tồn tại trên hệ thống.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full py-3 px-5 rounded-2xl bg-[#FF6320] hover:bg-[#e05517] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ FPT 3 Miền</span>
          </Link>

          <Link
            href="/#packages"
            className="w-full py-2.5 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Danh Sách Gói Cước Khác</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
