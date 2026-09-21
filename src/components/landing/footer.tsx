'use client';

import { Phone, Mail, MapPin, ShieldCheck, Wifi } from 'lucide-react';
import { useContact } from '@/context/ContactContext';

export default function Footer() {
  const { contact } = useContact();
  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 text-xs">
      {/* Top Footer Callout */}
      <div className="border-b border-zinc-800 py-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="text-sm font-black text-white block">
              Tổng Đài Tư Vấn Lắp Đặt Wifi Nhà Mạng 3 Miền (24/7)
            </span>
            <span className="text-xs text-zinc-400">
              Tiếp nhận đăng ký trực tuyến toàn quốc, phủ sóng Bắc - Trung - Nam, lắp đặt thần tốc
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${contact.hotlineTel}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF6320] to-[#FFA153] text-white font-extrabold text-sm shadow-md hover:brightness-105 transition-all"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>{contact.hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Company Legal Info */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/logo.png"
              alt="Logo Nhà Mạng Ba Miền"
              className="w-12 h-12 rounded-full object-contain shadow-md border border-red-900/50"
            />
            <div>
              <span className="text-lg font-black text-white tracking-tight">
                NHÀ MẠNG <span className="text-[#FF6320]">BA MIỀN</span>
              </span>
              <span className="block text-[10px] text-zinc-400 font-semibold">
                Lắp Đặt Toàn Quốc &bull; Uy Tín &bull; Tận Tâm &bull; Nhiệt Tình
              </span>
            </div>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            <strong>Tổng công ty Viễn thông Nhà Mạng 3 Miền</strong>
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Hạ tầng mạng cáp quang băng rộng thế hệ mới phủ sóng toàn diện 3 miền Bắc - Trung - Nam với công nghệ Wi-Fi 6 tiên tiến.
          </p>

          <div className="pt-2 space-y-1.5 text-zinc-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#FF6320] shrink-0 mt-0.5" />
              <span>Văn phòng đại diện tại Hà Nội, Đà Nẵng, TP. Hồ Chí Minh và 63 tỉnh thành.</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF6320] shrink-0" />
              <span>Hotline tư vấn lắp đặt: <strong>{contact.hotline}</strong> (24/7)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF6320] shrink-0" />
              <span>Email: hotro@nhamang3mien.vn</span>
            </div>
          </div>
        </div>

        {/* Col 1 */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm">Gói Cước 3 Miền</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#packages" className="hover:text-white transition-colors">Internet Gói Giga (300 Mbps)</a></li>
            <li><a href="#packages" className="hover:text-white transition-colors">Internet Gói Sky (1 Gbps)</a></li>
            <li><a href="#packages" className="hover:text-white transition-colors">Internet Gói F-Game Ultra</a></li>
            <li><a href="#packages" className="hover:text-white transition-colors">Internet Gói Meta 1Gbps</a></li>
            <li><a href="#combos" className="hover:text-white transition-colors">Combo Internet + Truyền Hình</a></li>
            <li><a href="#business" className="hover:text-white transition-colors">Gói Doanh Nghiệp Lux 500</a></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm">Hỗ Trợ Khách Hàng</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#procedure" className="hover:text-white transition-colors">Hướng dẫn thủ tục hòa mạng</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href={`tel:${contact.hotlineTel}`} className="hover:text-white transition-colors">Tổng đài tiếp nhận: {contact.hotline}</a></li>
            <li><a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-blue-400">Tư vấn Zalo 24/7</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Khảo sát tuyến cáp miễn phí</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kiểm tra tốc độ Speedtest</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm">Về Nhà Mạng 3 Miền</h4>
          <ul className="space-y-2 text-zinc-400">
            <li><a href="#" className="hover:text-white transition-colors">Giới thiệu chung</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Hệ sinh thái hạ tầng viễn thông</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật thông tin</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Quy định và điều khoản</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Liên hệ đại lý 3 miền</a></li>
            <li className="pt-1">
              <a
                href="/admin"
                className="text-orange-400 hover:text-[#FFA153] transition-colors flex items-center gap-1.5 font-semibold text-xs"
              >
                <span>🛡️ Cổng Quản Trị (Admin)</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800 py-4 text-center text-zinc-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Bản quyền thuộc về Nhà Mạng 3 Miền. Tất cả quyền được bảo lưu.</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Website đăng ký trực tuyến chính thức có mã hóa SSL bảo mật</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
