'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks'; // Dùng hook chuẩn
import { Spinner } from '@/components/ui/Spinner';
import { DoctorLayout } from '@/components/layout/doctor/DoctorLayout'; // Import Component giao diện đã đóng gói
import { UserRole } from '@/types/enums';

export default function DoctorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã tải xong
    if (!loading) {
      // 1. Chưa đăng nhập -> Về Login
      if (!isAuthenticated) {
        router.replace('/login');
      } 
      // 2. Đăng nhập rồi nhưng không phải Bác sĩ -> Về trang chủ (hoặc 403)
      else if (user?.role !== UserRole.DOCTOR) {
        router.replace('/'); 
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Màn hình chờ khi đang check quyền
  if (loading || !isAuthenticated || user?.role !== UserRole.DOCTOR) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="large" variant="primary" />
          <p className="text-sm text-gray-500 animate-pulse">Đang xác thực quyền bác sĩ...</p>
        </div>
      </div>
    );
  }

  // Nếu đúng là Bác sĩ -> Render Layout Bác sĩ (đã bao gồm Sidebar, Header, Content)
  return <DoctorLayout>{children}</DoctorLayout>;
}