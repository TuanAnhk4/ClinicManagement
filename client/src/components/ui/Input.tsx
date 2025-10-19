import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Định nghĩa các "props" mà component Input có thể nhận vào
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'disabled';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    // Định nghĩa style cơ bản cho tất cả các ô input
    const baseStyles =
      'flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200';

    // Định nghĩa style cho từng loại "variant" (trạng thái)
    const variantStyles = {
      default: 'border-gray-300 focus-visible:border-blue-500',
      error: 'border-red-500 text-red-700 focus-visible:ring-red-500',
      disabled: 'cursor-not-allowed opacity-50 bg-gray-100',
    };

    // Ghép các class lại một cách an toàn
    const finalClassName = twMerge(
      clsx(
        baseStyles, 
        variantStyles[variant], 
        className
      )
    );

    return (
      <input
        type={type}
        className={finalClassName}
        ref={ref}
        disabled={variant === 'disabled'} // Tự động vô hiệu hóa nếu variant là 'disabled'
        {...props}
      />
    );
  }
);

// Thêm một displayName để dễ debug
Input.displayName = 'Input';