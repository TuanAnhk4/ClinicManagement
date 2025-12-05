import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực người dùng | HealthCare',
  description: 'Đăng nhập hoặc Đăng ký để truy cập hệ thống HealthCare.',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // 1. Container bao phủ toàn màn hình (min-h-screen)
    // 2. Sử dụng Flexbox để căn giữa nội dung (items-center justify-center)
    // 3. Màu nền xám nhẹ (bg-gray-50) giúp Form trắng nổi bật hơn
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Container chứa Form. 
        Lưu ý: Chúng ta để width là w-full nhưng KHÔNG set max-width ở đây.
        Lý do: Form Login có thể nhỏ (max-w-md), nhưng Form Register có thể to hơn (max-w-2xl).
        Để từng Component con (LoginForm/RegisterForm) tự quyết định độ rộng của mình.
      */}
      <div className="w-full flex justify-center">
        {children}
      </div>

    </div>
  );
}