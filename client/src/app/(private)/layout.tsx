'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks'; // 1. Dùng Hook chuẩn
import { Spinner } from '@/components/ui/Spinner'; // 2. Dùng UI chuẩn

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã tải xong mà chưa đăng nhập -> Đá về login
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // 3. Màn hình chờ xịn xò (Full màn hình, căn giữa)
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="large" variant="primary" />
          <p className="text-sm text-gray-500 animate-pulse">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, render nội dung bên trong
  // (Các layout con: admin/layout, doctor/layout sẽ lo phần giao diện)
  return <>{children}</>;
}