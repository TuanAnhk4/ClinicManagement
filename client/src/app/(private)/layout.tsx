// src/app/(private)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// *** KHÔNG IMPORT Layout Ở ĐÂY NỮA ***

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Đang xác thực...</p>
      </div>
    );
  }

  // Nếu đã đăng nhập, chỉ render children.
  // Layout cụ thể sẽ do layout của admin/doctor/patient đảm nhiệm.
  return <>{children}</>; // Hoặc chỉ cần return children;
}