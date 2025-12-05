import React from 'react';
import { cn } from '@/lib/utils'; // Sử dụng hàm tiện ích gộp class

import { BadgeProps } from '@/types/ui';

export const Badge = ({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}: BadgeProps) => {
  
  // Cấu hình style cho từng loại
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-transparent', // Màu xám (Mặc định)
    primary: 'bg-blue-100 text-blue-800 border-transparent', // Màu xanh dương (Role Doctor/Admin)
    secondary: 'bg-purple-100 text-purple-800 border-transparent', // Màu tím
    success: 'bg-green-100 text-green-800 border-transparent', // Màu xanh lá (COMPLETED)
    warning: 'bg-yellow-100 text-yellow-800 border-transparent', // Màu vàng (PENDING)
    danger: 'bg-red-100 text-red-800 border-transparent', // Màu đỏ (CANCELLED)
    outline: 'bg-transparent text-gray-700 border-gray-300', // Chỉ có viền
  };

  return (
    <span
      className={cn(
        // Style cơ bản (Base styles)
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        "transition-colors duration-200 ease-in-out",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};