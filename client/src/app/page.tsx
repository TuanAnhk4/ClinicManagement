'use client';
import Link from 'next/link';
import { useState } from 'react';
import { PublicHeader } from '@/components/landing/PublicHeader';
import { PublicFooter } from '@/components/landing/PublicFooter';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { DepartmentsSection } from '@/components/landing/DepartmentsSection';
import { RecentArticlesSection } from '@/components/landing/RecentArticlesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactBannerSection } from '@/components/landing/ContactBannerSection';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function PublicHomePage() {
  // State quản lý modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Hàm mở modal Login
  const openLoginModal = () => {
    setIsRegisterModalOpen(false); // Đóng modal kia
    setIsLoginModalOpen(true);
  };

  // Hàm mở modal Register
  const openRegisterModal = () => {
    setIsLoginModalOpen(false); // Đóng modal kia
    setIsRegisterModalOpen(true);
  };

  // Hàm đóng tất cả modal
  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="bg-white">
      <PublicHeader onBookNowClick={openLoginModal} />
      <HeroSection />
      <WhyChooseUsSection />
      <ServicesSection />
      <AboutUsSection />
      <DepartmentsSection />
      <TestimonialsSection />
      <RecentArticlesSection />
      <ContactBannerSection />
      <PublicFooter />








      <Modal isOpen={isLoginModalOpen} onClose={closeModal}>
        <LoginForm
          onLoginSuccess={closeModal}
          onSwitchToRegister={() => { closeModal(); openRegisterModal(); }}
        />
      </Modal>
      <Modal isOpen={isRegisterModalOpen} onClose={closeModal}>
        <RegisterForm
          onRegisterSuccess={() => { closeModal(); /* openLoginModal(); */ }}
          onSwitchToLogin={() => { closeModal(); openLoginModal(); }}
        />
      </Modal>

    </div>
  );
}