import React from 'react';
import { Metadata } from 'next';

// Import các Section (Khối nội dung)
import { HeroSection } from '@/components/landing/HeroSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { DepartmentsSection } from '@/components/landing/DepartmentsSection';
import { RecentArticlesSection } from '@/components/landing/RecentArticlesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactBannerSection } from '@/components/landing/ContactBannerSection';

export const metadata: Metadata = {
  title: 'Trang Chủ | HealthCare',
  description: 'Hệ thống phòng khám đa khoa hiện đại, đặt lịch khám nhanh chóng.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-white">
      
      {/* LƯU Ý: 
        - Không cần <PublicHeader /> vì đã có trong layout.tsx
        - Không cần <PublicFooter /> vì đã có trong layout.tsx
        - Không cần Modal Login/Register vì đã chuyển sang trang riêng (/login, /register)
      */}

      {/* 1. Banner Chính */}
      <HeroSection />

      {/* 2. Tại sao chọn chúng tôi */}
      <WhyChooseUsSection />

      {/* 3. Dịch vụ nổi bật */}
      <ServicesSection />

      {/* 4. Giới thiệu */}
      <AboutUsSection />

      {/* 5. Các chuyên khoa */}
      <DepartmentsSection />

      {/* 6. Đánh giá khách hàng */}
      <TestimonialsSection />

      {/* 7. Tin tức mới nhất */}
      <RecentArticlesSection />

      {/* 8. Banner liên hệ */}
      <ContactBannerSection />

    </div>
  );
}