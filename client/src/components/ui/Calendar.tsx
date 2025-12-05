'use client';

import React from 'react';
import ReactCalendar from 'react-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Định nghĩa kiểu cho giá trị của Calendar (có thể là 1 ngày hoặc 1 khoảng ngày)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarProps {
  value?: Date;
  onChange?: (value: Date) => void;
  className?: string;
  minDate?: Date; // Ngày tối thiểu được chọn (thường là hôm nay)
  tileDisabled?: (props: { date: Date; view: string }) => boolean;
}

export const Calendar = ({
  value,
  onChange,
  className,
  minDate = new Date(), // Mặc định không cho chọn ngày quá khứ
  tileDisabled,
}: CalendarProps) => {
  
  // Xử lý khi chọn ngày
  const handleChange = (newValue: Value) => {
    // Chúng ta chỉ quan tâm đến chọn 1 ngày (không phải khoảng)
    if (onChange && newValue instanceof Date) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("p-4 bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
      <ReactCalendar
        locale="vi-VN" // Sử dụng tiếng Việt
        onChange={handleChange}
        value={value}
        minDate={minDate} // Chặn ngày quá khứ
        tileDisabled={tileDisabled}
        
        // Thay thế icon mũi tên mặc định bằng Icon Lucide đẹp hơn
        prevLabel={<ChevronLeft className="h-5 w-5" />}
        nextLabel={<ChevronRight className="h-5 w-5" />}
        next2Label={null} // Ẩn nút tua nhanh năm
        prev2Label={null}
        
        // Cấu hình hiển thị
        view="month"
        formatShortWeekday={(locale, date) => {
            // Format thứ: T2, T3... hoặc CN
            const day = date.getDay();
            return day === 0 ? 'CN' : `T${day + 1}`;
        }}
      />
    </div>
  );
};