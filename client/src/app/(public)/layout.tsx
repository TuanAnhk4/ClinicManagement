import React from 'react';

// Import các thành phần giao diện công khai
import { PublicHeader } from '@/components/layout/public/PublicHeader';
import { PublicFooter } from '@/components/layout/public/PublicFooter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    // 1. Container chính: Flex cột, chiều cao tối thiểu bằng màn hình
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 2. Header: Nằm trên cùng (Sticky đã được xử lý trong PublicHeader) */}
      <PublicHeader />

      {/* 3. Main Content: Chiếm phần không gian còn lại (flex-1) */}
      {/* Class 'flex-1' sẽ đẩy Footer xuống đáy nếu nội dung ngắn */}
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {/* 4. Footer: Nằm dưới cùng */}
      <PublicFooter />
      
    </div>
  );
}