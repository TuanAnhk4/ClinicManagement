'use client';

import React from 'react';
import { PatientSidebar } from './PatientSidebar';
import { PatientHeader } from './PatientHeader';
import { useUI } from '@/hooks';
import { cn } from '@/lib/utils';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export const PatientLayout = ({ children }: PatientLayoutProps) => {
  // Sử dụng context để kiểm soát việc hiển thị Sidebar trên Mobile
  const { isSidebarCollapsed, toggleSidebar } = useUI();

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* 1. SIDEBAR (Desktop & Mobile)
        - Desktop (md:flex): Luôn hiển thị.
        - Mobile: Mặc định ẩn, hiện khi isSidebarCollapsed = false (Logic ngược xíu tùy cách bạn set context)
        Hoặc đơn giản hơn: Dùng class fixed cho mobile để đè lên
      */}
      
      {/* Overlay đen mờ trên Mobile khi mở menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          !isSidebarCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar} // Bấm ra ngoài để đóng
      />

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 md:relative md:z-auto transition-transform duration-300 transform",
        // Logic Responsive:
        // - Desktop: Luôn hiện (translate-x-0)
        // - Mobile: Nếu !collapsed (đang mở) -> hiện. Nếu collapsed (đóng) -> ẩn (-translate-x-full)
        !isSidebarCollapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <PatientSidebar />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header chỉ hiện ở Mobile */}
        <PatientHeader />

        {/* Nội dung chính */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};