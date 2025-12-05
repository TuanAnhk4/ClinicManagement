import React from 'react';
import { cn } from '@/lib/utils';

import { InputProps } from '@/types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, disabled, ...props }, ref) => {
    
    return (
      <input
        type={type}
        className={cn(
          // Style cơ bản
          "flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm",

          "text-gray-900 dark:text-gray-100",

          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-gray-400",
          
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100", // 3. Style disabled tự động
          "transition-colors duration-200",
          
          // Xử lý trạng thái lỗi (Error State)
          error && "border-red-500 text-red-900 placeholder:text-red-300 focus-visible:ring-red-500",
          
          className // Class tùy chỉnh
        )}
        ref={ref}
        disabled={disabled} // Truyền thẳng prop disabled của HTML
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';