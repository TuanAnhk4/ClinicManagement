'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react'; // Dùng icon chuẩn
import { cn } from '@/lib/utils'; // Dùng hàm gộp class chuẩn

import { ModalProps } from '@/types/ui';

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className,
  title,
  size = 'md' 
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  // 1. Đảm bảo chỉ render ở Client (tránh lỗi Hydration với Portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Xử lý khóa cuộn trang & Phím ESC
  useEffect(() => {
    if (isOpen) {
      // Khóa cuộn body
      document.body.style.overflow = 'hidden';
      
      // Lắng nghe phím ESC
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);

      return () => {
        // Cleanup: Mở lại cuộn và bỏ lắng nghe
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Xử lý click vào nền
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Không render nếu chưa mount hoặc chưa mở
  if (!mounted || !isOpen) return null;

  // Cấu hình kích thước
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // 3. Dùng Portal để đưa Modal ra ngoài cùng của DOM (vào body)
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      {/* Panel chính */}
      <div
        className={cn(
          "relative w-full bg-white rounded-xl shadow-2xl transform transition-all animate-in zoom-in-95 duration-200",
          "max-h-[90vh] flex flex-col", // Đảm bảo không cao quá màn hình
          sizeClasses[size],
          className
        )}
      >
        {/* Header (nếu có title hoặc nút đóng) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {title || ' '}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (có thanh cuộn nếu nội dung dài) */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body // Render vào thẻ body
  );
};