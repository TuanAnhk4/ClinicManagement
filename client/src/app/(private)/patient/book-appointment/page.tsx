'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck } from 'lucide-react';

// Import Form đã đóng gói sẵn
import { BookingForm } from '@/components/forms/appointment/BookingForm';
import { Card } from '@/components/ui/Card';

export default function BookAppointmentPage() {
  const router = useRouter();

  // Callback khi đặt lịch thành công
  const handleSuccess = () => {
    // Chuyển hướng về trang danh sách lịch hẹn của tôi
    router.push('/patient/my-appointments');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header của trang */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <CalendarCheck size={32} />
          </div>
          Đặt Lịch Khám Mới
        </h1>
        <p className="mt-2 text-gray-500">
          Chọn chuyên khoa, bác sĩ và khung giờ phù hợp với bạn.
        </p>
      </div>

      {/* Form Container */}
      <Card className="p-6 md:p-8 shadow-lg border-blue-100/50">
        <BookingForm onSuccess={handleSuccess} />
      </Card>

    </div>
  );
}