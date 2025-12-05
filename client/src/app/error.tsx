'use client'; // Bắt buộc

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Next.js tự động truyền 2 props này vào component Error
interface ErrorProps {
  error: Error & { digest?: string }; // Thông tin lỗi
  reset: () => void; // Hàm để thử render lại trang (Try again)
}

export default function Error({ error, reset }: ErrorProps) {
  
  // Ghi log lỗi ra console (hoặc gửi lên Sentry/Log service) khi component mount
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      
      {/* Icon lỗi lớn */}
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-6 animate-in zoom-in duration-300">
        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
      </div>

      {/* Tiêu đề */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Đã có lỗi xảy ra!
      </h2>

      {/* Thông báo lỗi chi tiết (Chỉ hiện digest hoặc message ngắn gọn để bảo mật) */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Hệ thống gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi này.
        {error.digest && (
          <span className="block mt-2 text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">
            Mã lỗi: {error.digest}
          </span>
        )}
      </p>

      {/* Các nút hành động */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Nút Thử lại: Gọi hàm reset() để Next.js render lại segment bị lỗi */}
        <Button 
          onClick={() => reset()} 
          variant="primary"
          size="medium"
          className="flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} />
          Thử lại
        </Button>

        {/* Nút Về trang chủ: Giải pháp an toàn nhất */}
        <Link href="/">
          <Button 
            variant="outline"
            size="medium"
            className="w-full flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Về trang chủ
          </Button>
        </Link>
      </div>

    </div>
  );
}