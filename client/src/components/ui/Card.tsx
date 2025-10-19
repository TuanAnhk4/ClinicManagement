// src/components/ui/Card.tsx

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Định nghĩa props, chủ yếu là để nhận className và children
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  // Định nghĩa style mặc định cho Card
  // - border: Viền xám nhạt
  // - rounded-xl: Bo góc nhiều hơn cho mềm mại
  // - bg-white: Nền trắng
  // - shadow-sm: Đổ bóng nhẹ nhàng
  const baseStyles = 'border border-gray-200 rounded-xl bg-white shadow-sm';

  // Ghép class mặc định với class tùy chỉnh từ bên ngoài
  const finalClassName = twMerge(clsx(baseStyles, className));

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
};