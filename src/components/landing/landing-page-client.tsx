'use client';

import { useState } from 'react';
import Header from './header';
import HeroBanner from './hero-banner';
import PromotionTicker from './promotion-ticker';
import PackageSection from './package-section';
import Wifi6Showcase from './wifi6-showcase';
import CustomerReviews from './customer-reviews';
import ProcedureSection from './procedure-section';
import FAQSection from './faq-section';
import Footer from './footer';
import ConsultModal from './consult-modal';
import FloatingWidgets from './floating-widgets';
import LeadListModal from './lead-list-modal';

export default function LandingPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();

  const handleOpenConsult = (packageName?: string) => {
    setSelectedPackage(packageName || 'Gói Sky (1 Gbps) - Bán chạy');
    setIsModalOpen(true);
  };

  const handleCloseConsult = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-[#FF6320] selection:text-white">
      {/* 1. Header with Region Dropdown & Hotline */}
      <Header />

      {/* 2. Hero Banner with Embedded Lead Registration Form */}
      <HeroBanner onOpenModal={handleOpenConsult} />

      {/* 3. Realtime Live Notification Marquee */}
      <PromotionTicker />

      {/* 4. Interactive Packages Section (Personal, Combo TV, Business) */}
      <PackageSection onSelectPackage={handleOpenConsult} />

      {/* 5. Khối Công Nghệ Modem Wi-Fi 6 & So Sánh Khác Biệt (Wi-Fi 6 Tech Showcase) */}
      <Wifi6Showcase onOpenConsult={() => handleOpenConsult('Tư vấn Modem Wi-Fi 6')} />

      {/* 6. Đánh Giá Thực Tế Từ Khách Hàng 3 Miền (Customer Reviews & Social Proof) */}
      <CustomerReviews onOpenConsult={() => handleOpenConsult('Tư vấn đăng ký gói cước')} />

      {/* 7. 4-step Procedure & Installation Guide */}
      <ProcedureSection onOpenConsult={() => handleOpenConsult('Tư vấn thủ tục lắp đặt')} />

      {/* 8. FAQ Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Comprehensive Footer */}
      <Footer />

      {/* Interactive Modal */}
      <ConsultModal
        isOpen={isModalOpen}
        onClose={handleCloseConsult}
        selectedPackage={selectedPackage}
      />

      {/* Floating Action Buttons */}
      <FloatingWidgets onOpenConsult={() => handleOpenConsult('Tư vấn nhanh')} />

      {/* MongoDB Leads Inspector */}
      <LeadListModal />
    </div>
  );
}
