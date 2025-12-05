import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    // Container: Chiếm toàn bộ chiều cao màn hình, căn giữa mọi thứ
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 z-50">
      
      <div className="flex flex-col items-center gap-4">
        {/* Spinner kích thước lớn */}
        <Spinner size="large" variant="primary" />
        
        {/* Dòng chữ thông báo nhẹ nhàng (có hiệu ứng nhấp nháy) */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
      
    </div>
  );
}