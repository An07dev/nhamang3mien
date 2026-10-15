'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Lắp đặt mạng Wifi FPT 3 Miền mất bao lâu?',
    answer:
      'Sau khi tiếp nhận yêu cầu, kỹ thuật viên FPT 3 Miền sẽ khảo sát và triển khai lắp đặt hoàn tất trong vòng từ 12h đến tối đa 36h. Quý khách có thể chủ động hẹn khung giờ thuận tiện nhất.',
  },
  {
    question: 'Tôi là người thuê nhà / ở trọ có đăng ký được không?',
    answer:
      'Hoàn toàn được! Thủ tục cực kỳ đơn giản chỉ cần ảnh chụp CCCD/CMND. Đặc biệt, khi quý khách lựa chọn hình thức thanh toán trả trước từ 6 tháng trở lên sẽ được MIỄN 100% phí đặt cọc thiết bị ban đầu.',
  },
  {
    question: 'Modem Wi-Fi 6 của FPT 3 Miền có gì vượt trội so với modem thế hệ cũ?',
    answer:
      'Modem Wi-Fi 6 thế hệ mới nhất của FPT 3 Miền cung cấp tốc độ vượt trội gấp 3 lần, độ trễ giảm tới 75%, khả năng xuyên tường mạnh mẽ và chịu tải cùng lúc từ 30 đến 50 thiết bị mượt mà không bị nghẽn mạng.',
  },
  {
    question: 'Gói Combo Truyền Hình xem được những nội dung gì?',
    answer:
      'Gói Combo tích hợp gần 200 kênh truyền hình trong và ngoài nước (VTV, HTV, HBO, Cinemax...) và ĐỘC QUYỀN trọn vẹn 380 trận Ngoại Hạng Anh đỉnh cao, Cúp C1 UEFA Champions League cùng kho phim chiếu rạp 4K cập nhật hàng ngày.',
  },
  {
    question: 'FPT 3 Miền hỗ trợ xử lý sự cố kỹ thuật như thế nào?',
    answer:
      'FPT 3 Miền cam kết dịch vụ chăm sóc khách hàng 24/7. Mọi sự cố kỹ thuật sẽ được tiếp nhận và xử lý nhanh chóng qua hotline, kỹ thuật viên có mặt tại nhà hỗ trợ trong 2h - 4h.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    const isOpening = openIndex !== idx;
    setOpenIndex(isOpening ? idx : null);
    if (isOpening && FAQS[idx]) {
      import('@/lib/meta-pixel').then((m) =>
        m.trackCustomPixel('ViewFAQ', {
          question: FAQS[idx].question,
        })
      );
    }
  };

  return (
    <section id="faq" className="py-16 bg-gradient-to-b from-white via-orange-50/20 to-white border-t border-orange-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#FF6320] text-xs font-black uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Hỗ Trợ Khách Hàng
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Câu Hỏi Thường Gặp Khi Lắp Wifi FPT 3 Miền
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border-2 border-orange-100/90 hover:border-orange-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-[#FF6320] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF6320]' : ''
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-orange-50 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
