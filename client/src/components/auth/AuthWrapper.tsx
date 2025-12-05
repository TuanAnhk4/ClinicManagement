import React from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react'; // Icon y tế
import { cn } from '@/lib/utils';

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  // Tùy chọn: Text footer (Ví dụ: "Chưa có tài khoản? Đăng ký")
  footerLink?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export const AuthWrapper = ({ 
  children, 
  title, 
  subtitle, 
  className,
  footerLink 
}: AuthWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={cn(
        "max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100", 
        className
      )}>
        
        {/* 1. Logo & Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Health<span className="text-blue-600">Care</span>
            </span>
          </Link>
          
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* 2. Form Content (Children) */}
        <div className="mt-8">
          {children}
        </div>

        {/* 3. Footer Link (Optional) */}
        {footerLink && (
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{footerLink.text} </span>
            <Link 
              href={footerLink.href} 
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all"
            >
              {footerLink.linkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};