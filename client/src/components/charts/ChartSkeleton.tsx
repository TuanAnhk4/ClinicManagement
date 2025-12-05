import React from 'react';
import { cn } from '@/lib/utils';

interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string; // Tùy chọn chiều cao (mặc định h-[350px])
}

export const ChartSkeleton = ({ className, height = "h-[350px]", ...props }: ChartSkeletonProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm w-full", 
        className
      )} 
      {...props}
    >
      {/* 1. Skeleton Title (Mô phỏng tiêu đề biểu đồ) */}
      <div className="mb-6 space-y-2">
        <div className="h-6 w-1/3 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-100 rounded-md animate-pulse" />
      </div>

      {/* 2. Skeleton Content (Mô phỏng vùng biểu đồ) */}
      <div className={cn("flex items-end justify-between gap-2 w-full", height)}>
        {/* Vẽ các cột giả với chiều cao ngẫu nhiên (Hard-coded để tránh lỗi Hydration) */}
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[40%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[80%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[60%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[30%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[90%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[50%]" />
        <div className="w-full bg-gray-100 rounded-t-md animate-pulse h-[70%]" />
      </div>
      
      {/* 3. Skeleton Axis (Mô phỏng trục hoành) */}
      <div className="mt-4 flex justify-between">
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
         <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
};