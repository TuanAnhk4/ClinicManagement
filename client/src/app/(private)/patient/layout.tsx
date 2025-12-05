'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import Hooks & Types chuẩn
import { useAuth } from '@/hooks'; 
import { UserRole } from '@/types/enums';

// Import UI Components chuẩn
import { Spinner } from '@/components/ui/Spinner';
import { PatientLayout } from '@/components/layout/patient/PatientLayout'; // <-- Dùng component này

export default function PatientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Lưu ý: PrivateLayout cha đã check isAuthenticated rồi.
    // Ở đây ta chỉ cần check đúng Role là PATIENT thôi.
    if (!loading) {
      if (user?.role !== UserRole.PATIENT) {
        // Nếu không phải bệnh nhân -> Đá về trang chủ (hoặc trang 403)
        router.replace('/'); 
      }
    }
  }, [user, loading, router]);

  // Màn hình chờ khi đang check quyền
  if (loading || user?.role !== UserRole.PATIENT) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="large" variant="primary" />
          <p className="text-sm text-gray-500 animate-pulse">Đang tải dữ liệu bệnh nhân...</p>
        </div>
      </div>
    );
  }

  // Render Layout chuẩn đã đóng gói
  return <PatientLayout>{children}</PatientLayout>;
}