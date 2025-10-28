// src/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { useAuth } from '@/contexts/AuthContext';
// Import Sidebar riêng cho Admin nếu có, hoặc Layout chung rồi tùy chỉnh
import { Layout } from '@/components/layout/Layout'; // Layout chung
import { AdminHeader } from '@/components/layout/AdminHeader'; // <-- Import AdminHeader
import { AdminSidebar } from '@/components/layout/AdminSidebar'; // <-- Import AdminSidebar (nếu có)
import { UserRole } from '@/types';

// Hàm lấy tiêu đề trang dựa trên đường dẫn
const getPageTitle = (pathname: string): string => {
  if (pathname.includes('/admin/users')) return 'Quản lý Người Dùng';
  if (pathname.includes('/admin/dashboard')) return 'Dashboard Tổng Quan';
  // Thêm các trang khác
  return 'Trang Quản Trị'; // Default
};


export default function PrivateAdminLayout({ // Đổi tên để rõ ràng hơn
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Hook để lấy đường dẫn hiện tại
  const pageTitle = getPageTitle(pathname); // Lấy tiêu đề động

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!authLoading && user?.role !== UserRole.ADMIN) {
      router.replace('/');
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthenticated || user?.role !== UserRole.ADMIN) {
    return <div>Authenticating...</div>;
  }

  // Render Layout Admin với Header và Sidebar riêng (hoặc tùy chỉnh Layout chung)
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden"> {/* Thêm overflow-hidden */}
      <AdminSidebar /> {/* <-- 2. Sử dụng Sidebar của Admin */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}