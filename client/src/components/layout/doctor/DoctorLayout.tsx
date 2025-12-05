'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DoctorSidebar } from './DoctorSidebar';
import { DoctorHeader } from './DoctorHeader';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export const DoctorLayout = ({ children }: DoctorLayoutProps) => {
  const pathname = usePathname();

  // Hàm xác định tiêu đề trang dựa trên URL
  const getPageTitle = (path: string) => {
    if (path.includes('/doctor/dashboard')) return 'Dashboard Bác Sĩ';
    if (path.includes('/doctor/schedule')) return 'Lịch Làm Việc Của Tôi';
    if (path.includes('/doctor/patients')) return 'Danh Sách Bệnh Nhân';
    if (path.includes('/doctor/appointments')) return 'Quản Lý Lịch Hẹn';
    if (path.includes('/doctor/consultation')) return 'Khám Bệnh & Kê Đơn';
    if (path.includes('/doctor/documents')) return 'Tài Liệu Y Khoa';
    if (path.includes('/doctor/settings')) return 'Cài Đặt Tài Khoản';
    
    return 'Doctor Portal'; // Tiêu đề mặc định
  };

  const currentTitle = getPageTitle(pathname);

  return (
    // 1. Khung chính: Full màn hình, không cuộn body
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      
      {/* 2. Sidebar dành riêng cho Bác sĩ */}
      <DoctorSidebar />

      {/* 3. Khu vực nội dung bên phải */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        
        {/* Header Bác sĩ (Nhận title động) */}
        <DoctorHeader pageTitle={currentTitle} />

        {/* Nội dung thay đổi */}
        <main className="w-full flex-grow p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};