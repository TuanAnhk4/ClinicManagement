// src/app/(private)/patient/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PatientSidebar } from '@/components/layout/PatientSidebar'; // <-- 1. Import PatientSidebar
import { UserRole } from '@/types';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== UserRole.PATIENT) {
      router.replace('/');
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthenticated || user?.role !== UserRole.PATIENT) {
    return (
      <div className="flex items-center justify-center h-screen"><p>Đang kiểm tra quyền truy cập...</p></div>
    );
  }

  // --- 2. Render bố cục Sidebar + Body ---
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <PatientSidebar /> {/* <-- Sử dụng Sidebar Bệnh nhân */}
      {/* Phần Nội dung chính */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Không cần Header ở đây theo yêu cầu của bạn */}
        {children} {/* Nội dung của trang con sẽ hiển thị ở đây */}
      </main>
    </div>
  );
  // --- KẾT THÚC RENDER ---
}