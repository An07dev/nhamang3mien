'use client';

import { PhoneCall, FileText, CheckCircle2, ShieldAlert, Clock, Headphones, MapPin, Sparkles } from 'lucide-react';

interface ProcedureSectionProps {
  onOpenConsult: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Tiếp Nhận & Tư Vấn',
    desc: 'Điền form đăng ký hoặc gọi Hotline 0819 900 530. Chuyên viên khu vực tư vấn gói cước tối ưu chi phí trong 5 phút.',
    icon: Headphones,
    color: 'from-orange-500 to-amber-500',
  },
  {
    step: '02',
    title: 'Khảo Sát Tuyến Cáp',
    desc: 'Kỹ thuật viên kiểm tra hạ tầng tủ cáp quang gần nhất, đảm bảo 100% đường truyền sợi quang chuẩn GPON không suy hao.',
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '03',
    title: 'Lắp Đặt & Bàn Giao',
    desc: 'Thi công gọn gàng thẩm mỹ trong 12h - 36h. Bàn giao Modem Wi-Fi 6 thế hệ mới, nghiệm thu tốc độ đạt chuẩn.',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function ProcedureSection({ onOpenConsult }: ProcedureSectionProps) {
  return (
    <section id="procedure" className="py-14 sm:py-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">

          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Thủ Tục Đơn Giản &bull; Lắp Đặt Siêu Tốc
          </h2>
        </div>

        {/* 3 Steps Grid (Balanced for PC & Mobile) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-12">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Icon and Title on the same line, Step number on the right */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-zinc-300 dark:text-zinc-700 select-none shrink-0">
                      {item.step}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-700/40 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Miễn phí 100%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Callout */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FF6320] to-[#FFA153] p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-lg sm:text-2xl font-black tracking-tight">
              Đăng ký ngay hôm nay để nhận ưu đãi Modem Wi-Fi 6!
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-2xl leading-relaxed">
              Kỹ thuật viên khu vực sẽ đến tận nhà khảo sát và hỗ trợ thủ tục miễn phí trong vòng 5 phút sau khi đăng ký.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenConsult}
              className="px-6 py-3 rounded-full bg-white text-zinc-900 font-extrabold text-xs sm:text-sm hover:bg-zinc-100 transition-colors shadow-md cursor-pointer text-center"
            >
              Đăng Ký Tư Vấn Miễn Phí
            </button>
            <a
              href="tel:0819900530"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold text-xs sm:text-sm transition-colors text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>0819 900 530</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
