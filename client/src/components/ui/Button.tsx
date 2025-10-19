import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Định nghĩa props vẫn giữ nguyên
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) => {
  // Các style definitions vẫn giữ nguyên
  const baseStyles = 'font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  // 2. Sử dụng twMerge và clsx để ghép class một cách an toàn
  const finalClassName = twMerge(
    clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className // Class tùy chỉnh từ bên ngoài sẽ được đưa vào đây
    )
  );

  return (
    // 3. Sử dụng className đã được xử lý
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};