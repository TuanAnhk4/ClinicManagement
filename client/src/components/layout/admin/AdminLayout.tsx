'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // 1. Import usePathname
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  // 2. Lấy đường dẫn hiện tại
  const pathname = usePathname();

  // 3. Hàm helper để chuyển đổi URL thành Tiêu đề trang
  const getPageTitle = (path: string) => {
    if (path.includes('/doctors')) return 'Quản Lý Bác Sĩ';
    if (path.includes('/patients')) return 'Quản Lý Bệnh Nhân';
    if (path.includes('/dashboard')) return 'Dashboard Tổng Quan';
    if (path.includes('/appointments')) return 'Quản Lý Lịch Hẹn';
    if (path.includes('/settings')) return 'Cài Đặt Hệ Thống';
    
    return 'Admin Panel'; // Tiêu đề mặc định
  };

  const currentTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      
      <AdminSidebar />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        
        {/* 4. SỬA LỖI: Truyền prop pageTitle vào đây */}
        <AdminHeader pageTitle={currentTitle} />

        <main className="w-full flex-grow p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};