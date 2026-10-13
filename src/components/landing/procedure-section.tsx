'use client';

import { PhoneCall, FileText, CheckCircle2, ShieldAlert, Clock, Headphones, MapPin, Sparkles } from 'lucide-react';
import { useContact } from '@/context/ContactContext';

interface ProcedureSectionProps {
  onOpenConsult: () => void;
}

export default function ProcedureSection({ onOpenConsult }: ProcedureSectionProps) {
  const { contact } = useContact();
  const steps = [
    {
      step: '01',
      title: 'Tiếp Nhận & Tư Vấn',
      desc: `Điền form đăng ký hoặc gọi Hotline ${contact.hotline}. Chuyên viên khu vực tư vấn gói cước tối ưu chi phí trong 5 phút.`,
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
      desc: 'Triển khai kéo cáp siêu tốc từ 12h - 36h. Bàn giao thiết bị Wi-Fi 6, đo kiểm tốc độ thực tế tại chỗ đạt chuẩn mới thanh toán.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="procedure" className="py-14 sm:py-20 bg-gradient-to-b from-white via-amber-50/20 to-white border-t border-orange-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#FF6320] text-xs font-black uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            Triển Khai Nhanh Chóng
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Thủ Tục Đơn Giản &bull; Lắp Đặt Siêu Tốc
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600">
            Kỹ thuật viên hoàn tất kết nối tận nhà từ 12h - 36h, đo kiểm đường truyền đạt chuẩn mới ký nghiệm thu.
          </p>
        </div>

        {/* Steps Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative mb-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl p-6 sm:p-7 bg-white border-2 border-orange-100/90 shadow-md hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Icon and Title on the same line, Step number on the right */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-3xl sm:text-4xl font-black text-orange-200 select-none shrink-0">
                      {item.step}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Miễn phí 100% khảo sát &amp; tư vấn</span>
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
              href={`tel:${contact.hotlineTel}`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/20 hover:bg-black/30 border border-white/30 text-white font-bold text-xs sm:text-sm transition-colors text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{contact.hotline}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
