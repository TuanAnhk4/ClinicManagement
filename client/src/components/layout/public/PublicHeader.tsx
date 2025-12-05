'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Để highlight menu đang chọn
import { Menu, X, Stethoscope, User } from 'lucide-react'; // Icon chuẩn
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks'; // Để kiểm tra đăng nhập

export const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  // Danh sách menu
  const navItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Dịch Vụ', href: '/services' },
    { label: 'Đội Ngũ Bác Sĩ', href: '/doctors' },
    { label: 'Về Chúng Tôi', href: '/about' },
    { label: 'Liên Hệ', href: '/contact' },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Hàm xác định đường dẫn Dashboard dựa trên vai trò
  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      default: return '/patient';
    }
  };

  return (
    // Header dính (sticky) với nền kính mờ (backdrop-blur) hiện đại
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Health<span className="text-blue-600">Care</span>
              </span>
            </Link>
          </div>

          {/* 2. DESKTOP MENU (Ẩn trên mobile) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 3. ACTION BUTTONS (Bên phải) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              // A. Nếu ĐÃ ĐĂNG NHẬP -> Hiện nút vào Dashboard
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-500">Xin chào,</span>
                  <span className="text-sm font-semibold text-gray-700 leading-none">{user.fullName}</span>
                </div>
                <Link href={getDashboardLink()}>
                  <Button variant="primary" size="medium" className="flex items-center gap-2">
                    <User size={16} />
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              // B. Nếu CHƯA ĐĂNG NHẬP -> Hiện Login/Register
              <>
                <Link href="/login">
                  <Button variant="ghost" size="medium">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  {/* Nút Book Now thực chất là dẫn đến đăng ký/đặt lịch */}
                  <Button variant="primary" size="medium">
                    Đặt Lịch Ngay
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* 4. MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 5. MOBILE MENU CONTENT (Dropdown) */}
      {/* Chỉ hiện khi state isMobileMenuOpen = true */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5 z-40">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                   pathname === item.href 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
              {isAuthenticated ? (
                 <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button fullWidth>Vào Dashboard</Button>
                 </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth>Đăng nhập</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>Đặt Lịch Ngay</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};