'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks'; // Dùng hook chuẩn
import { Spinner } from '@/components/ui/Spinner';
import { AdminLayout } from '@/components/layout/admin/AdminLayout'; // Dùng component Layout đã đóng gói
import { UserRole } from '@/types/enums'; // Import Enum

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã tải xong mà chưa đăng nhập hoặc không phải Admin -> Đá ra ngoài
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role !== UserRole.ADMIN) {
        router.replace('/'); // Hoặc trang 403 Forbidden
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Màn hình chờ khi đang check quyền
  if (loading || !isAuthenticated || user?.role !== UserRole.ADMIN) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="large" />
          <p className="text-sm text-gray-500 animate-pulse">Kiểm tra quyền quản trị...</p>
        </div>
      </div>
    );
  }

  // Nếu đúng là Admin -> Render Layout Admin
  return <AdminLayout>{children}</AdminLayout>;
}