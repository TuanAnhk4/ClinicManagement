import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'; // Icon
import { Button } from '@/components/ui/Button'; // Component Button chuẩn

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 text-center relative overflow-hidden">
      
      {/* Hiệu ứng nền (Số 404 to mờ phía sau) */}
      <h1 className="text-[10rem] md:text-[15rem] font-black text-gray-100 dark:text-gray-800 absolute select-none -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        404
      </h1>

      {/* Icon minh họa */}
      <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-6 animate-in zoom-in duration-300">
        <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Tiêu đề chính */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        Trang không tồn tại
      </h2>

      {/* Mô tả */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-base md:text-lg leading-relaxed">
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn yêu cầu. Có thể đường dẫn bị sai hoặc trang đã bị xóa.
      </p>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row gap-4 z-10">
        {/* Nút Quay về (Dùng router.back() ở client component, nhưng ở đây dùng Link về Home cho an toàn) */}
        <Link href="/">
          <Button 
            size="large" 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Home size={18} />
            Về Trang Chủ
          </Button>
        </Link>
        
        {/* Nút Hỗ trợ (Optional - Dẫn đến trang liên hệ) */}
        {/* <Link href="/contact">
          <Button 
            variant="outline" 
            size="large"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <HelpCircle size={18} />
            Trung Tâm Hỗ Trợ
          </Button>
        </Link> */}
      </div>

    </div>
  );
}