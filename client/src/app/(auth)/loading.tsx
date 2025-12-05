import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function AuthLoading() {
  return (
    // Tạo một khung trắng (Card) giả lập giống AuthWrapper
    // Để khi chuyển trang, người dùng thấy cái khung vẫn nằm đó, chỉ có nội dung xoay
    <div className="w-full max-w-md bg-white p-12 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
      
      {/* Spinner chính */}
      <Spinner size="large" variant="primary" className="mb-4" />
      
      {/* Text thông báo */}
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Đang tải dữ liệu...
      </p>

    </div>
  );
}