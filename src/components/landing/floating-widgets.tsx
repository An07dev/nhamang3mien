'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useContact } from '@/context/ContactContext';

interface FloatingWidgetsProps {
  onOpenConsult: () => void;
}

export default function FloatingWidgets({ onOpenConsult }: FloatingWidgetsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { contact } = useContact();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-2.5 sm:gap-3">
      {/* 1. Scroll-To-Top Bubble */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-orange-50 hover:text-[#FF6320] transition-all cursor-pointer active:scale-95 group relative"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:block absolute right-14 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Lên đầu trang
          </span>
        </button>
      )}

      {/* 2. Call Hotline Bubble (Liên hệ gọi ngay) */}
      <a
        href={`tel:${contact.hotlineTel}`}
        onClick={() => {
          import('@/lib/meta-pixel').then((m) =>
            m.trackPixel('Contact', { method: 'hotline_floating', phone: contact.hotlineTel })
          );
        }}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl shadow-green-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group cursor-pointer"
        aria-label={`Gọi ngay hotline ${contact.hotline}`}
      >
        <span className="absolute inset-0 rounded-full bg-[#4ADE80] animate-ping opacity-40 pointer-events-none" />
        <img
          src="/phone-icon.png"
          alt="Gọi hotline liên hệ"
          className="w-full h-full object-contain rounded-full relative z-10"
        />
        <span className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Gọi {contact.hotline}
        </span>
      </a>

      {/* 3. Official Zalo Chat Bubble */}
      <a
        href={contact.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          import('@/lib/meta-pixel').then((m) =>
            m.trackPixel('Contact', { method: 'zalo_floating', url: contact.zaloUrl })
          );
        }}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl shadow-xl shadow-blue-500/35 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative cursor-pointer overflow-hidden border border-white/20 bg-[#0068FF]"
        aria-label="Chat Zalo hỗ trợ"
      >
        <img
          src="/zalo.svg"
          alt="Zalo"
          className="w-full h-full object-cover"
        />
        <span className="hidden sm:block absolute right-15 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Chat Zalo 24/7
        </span>
      </a>

      {/* 4. Quick Consultation Form Bubble (Tư vấn khách hàng) */}
      <button
        onClick={onOpenConsult}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group relative border-2 border-[#FF6320] p-1.5"
        aria-label="Đăng ký tư vấn khách hàng"
      >
        <img
          src="/consult-icon.png"
          alt="Tư vấn khách hàng"
          className="w-full h-full object-contain"
        />
        <span className="hidden sm:block absolute right-15 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Đăng ký tư vấn
        </span>
      </button>
    </div>
  );
}
