'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Không làm gì cả khi context đang trong quá trình xác thực ban đầu
    if (loading) {
      return;
    }

    // Nếu quá trình xác thực đã xong và user chưa đăng nhập, đá về trang login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Nếu đã đăng nhập nhưng không phải Admin, đá về trang chủ
    if (user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [loading, isAuthenticated, user, router]);

  // Trong khi đang loading, hoặc chưa đủ điều kiện, hiển thị trạng thái chờ
  // Điều này ngăn việc render nội dung con (children) một cách không an toàn
  if (loading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Authenticating...</p>
      </div>
    );
  }

  // Nếu mọi thứ đều ổn, hiển thị layout admin và nội dung
  return <Layout>{children}</Layout>;
}