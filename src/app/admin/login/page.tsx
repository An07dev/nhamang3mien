'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 600);
      } else {
        setError(data.error || 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6320]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500">Cổng Quản Trị v2.0</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#182030]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6320] to-[#FFA153] p-0.5 shadow-lg shadow-orange-500/30 mx-auto">
              <div className="w-full h-full bg-[#182030] rounded-[14px] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo FPT 3 Miền" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#182030] flex items-center justify-center text-[10px]">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            FPT 3 Miền
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Hệ Thống Quản Lý Đơn Đăng Ký Khách Hàng
          </p>
        </div>

        {/* Notification Feedback */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Đăng nhập thành công! Đang chuyển hướng...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tài khoản admin..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Mật khẩu quản trị
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full h-11 pl-10 pr-11 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6320] focus:ring-1 focus:ring-[#FF6320] transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint for Local Dev */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 leading-relaxed">
            <span className="font-semibold text-zinc-300">Tài khoản mặc định: </span>
            <code className="text-[#FFA153] font-mono font-bold">admin</code> / <code className="text-[#FFA153] font-mono font-bold">admin123</code>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6320] via-[#FF7D3B] to-[#FFA153] text-white font-extrabold text-sm tracking-wide uppercase shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng Nhập Quản Trị</span>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500 z-10">
        &copy; {new Date().getFullYear()} FPT 3 Miền. Bảo mật dữ liệu nội bộ.
      </div>
    </div>
  );
}
