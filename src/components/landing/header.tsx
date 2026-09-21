'use client';

import { useState } from 'react';
import { Phone, MapPin, ChevronDown, Menu, X, Wifi } from 'lucide-react';

const PROVINCES = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Các tỉnh thành khác',
];

export default function Header() {
  const [selectedProvince, setSelectedProvince] = useState('TP. Hồ Chí Minh');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#" className="flex items-center gap-2 group">
            {/* Logo: Nhà Mạng Ba Miền */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt="Logo Nhà Mạng Ba Miền"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md object-contain border border-red-100 group-hover:scale-105 transition-transform shrink-0"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-2xl font-black tracking-tight text-zinc-900 leading-none">
                    NHÀ MẠNG <span className="text-[#B31010]">BA MIỀN</span>
                  </span>
                </div>
                <span className="hidden sm:flex text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-none items-center gap-1 mt-1">
                  <Wifi className="w-2.5 h-2.5 text-[#B31010]" /> Uy Tín &bull; Tận Tâm &bull; Nhiệt Tình
                </span>
                <span className="sm:hidden text-[9px] text-[#B31010] font-bold tracking-tight block mt-0.5">
                  Lắp Đặt Toàn Quốc 24/7
                </span>
              </div>
            </div>
          </a>

          {/* Province Selector Dropdown (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsProvinceOpen(!isProvinceOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/60 hover:bg-orange-100/60 text-zinc-700 text-xs font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF6320]" />
              <div className="text-left">
                <span className="block text-[10px] text-zinc-500 leading-none">Khu vực:</span>
                <span className="font-bold text-zinc-900 leading-tight">{selectedProvince}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isProvinceOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProvinceOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                {PROVINCES.map((prov) => (
                  <button
                    key={prov}
                    onClick={() => {
                      setSelectedProvince(prov);
                      setIsProvinceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-orange-50 transition-colors ${selectedProvince === prov ? 'font-bold text-[#FF6320] bg-orange-50/70' : 'text-zinc-700'
                      }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-700">
          <a href="#packages" className="hover:text-[#FF6320] transition-colors">
            Gói Cước
          </a>
          <a href="#wifi6" className="hover:text-[#FF6320] transition-colors flex items-center gap-1.5 font-semibold text-orange-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6320]"></span>
            </span>
            Wi-Fi 6 Mới
          </a>
          <a href="#reviews" className="hover:text-[#FF6320] transition-colors">
            Đánh Giá 3 Miền
          </a>
          <a href="#procedure" className="hover:text-[#FF6320] transition-colors">
            Thủ Tục
          </a>
          <a href="#faq" className="hover:text-[#FF6320] transition-colors">
            Hỏi Đáp
          </a>
        </nav>

        {/* Right: Hotline CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:0819900530"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white shadow-md hover:shadow-orange-500/25 hover:brightness-105 transition-all group font-bold text-xs sm:text-sm"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
            </div>
            <div className="text-left">
              <span className="hidden sm:block text-[9px] uppercase font-semibold text-orange-100 leading-none">
                Hotline 24/7
              </span>
              <span className="leading-tight tracking-tight font-black text-xs sm:text-sm whitespace-nowrap">0819 900 530</span>
            </div>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-700 hover:bg-orange-50 hover:text-[#FF6320] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-100 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="pb-3 border-b border-zinc-100">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
              Chọn khu vực lắp đặt:
            </span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 border border-orange-200 rounded-xl text-zinc-800 bg-orange-50/40 focus:outline-none focus:border-[#FF6320]"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 text-sm font-semibold text-zinc-800">
            <a
              href="#packages"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#FF6320] transition-colors flex items-center justify-between"
            >
              <span>1. Bảng Gói Cước Internet</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6320] font-bold">Từ 195k</span>
            </a>
            <a
              href="#wifi6"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl bg-orange-500/10 text-[#FF6320] font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6320] animate-ping" />
                2. Công Nghệ Modem Wi-Fi 6
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6320] text-white">Mới Nhất</span>
            </a>
            <a
              href="#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#FF6320] transition-colors flex items-center justify-between"
            >
              <span>3. Đánh Giá Khách Hàng 3 Miền</span>
              <span className="text-[10px] text-amber-600 font-bold">★ 4.9/5.0</span>
            </a>
            <a
              href="#procedure"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#FF6320] transition-colors"
            >
              4. Quy Trình &amp; Thủ Tục Lắp Đặt (12h - 36h)
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#FF6320] transition-colors"
            >
              5. Câu Hỏi Thường Gặp &amp; Tư Vấn
            </a>
          </div>

          {/* Quick Hotline in Mobile Menu */}
          <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2">
            <a
              href="tel:0819900530"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi 0819 900 530</span>
            </a>
            <a
              href="https://zalo.me/0819900530"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#0068FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <img src="/zalo.svg" alt="Zalo" className="w-4 h-4 rounded-xs" />
              <span>Nhắn Zalo 24/7</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
