// src/app/(private)/doctor/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// Import Sidebar riêng cho Bác sĩ (nếu có) hoặc dùng Sidebar chung
import { DoctorSidebar } from '@/components/layout/DoctorSidebar'; // <-- Giả sử bạn tạo DoctorSidebar
import { DoctorHeader } from '@/components/layout/DoctorHeader'; // <-- 1. Import DoctorHeader
import { UserRole } from '@/types';

export default function PrivateDoctorLayout({ // Đổi tên để rõ ràng hơn
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== UserRole.DOCTOR) { router.replace('/'); }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthenticated || user?.role !== UserRole.DOCTOR) {
    return <div>Authenticating Doctor...</div>;
  }

  // Render Layout Bác sĩ với Header và Sidebar riêng
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
       <DoctorSidebar /> {/* <-- Sử dụng Sidebar của Bác sĩ */}
       <div className="flex-1 flex flex-col overflow-hidden">
         <DoctorHeader /> {/* <-- 2. Sử dụng Header của Bác sĩ */}
         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
           {children}
         </main>
       </div>
    </div>
  );
}