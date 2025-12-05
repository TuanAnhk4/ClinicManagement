'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { format, isPast, parse } from 'date-fns';

// Định nghĩa cấu trúc cho một slot
export interface TimeSlot {
  time: string;   // "08:00"
  isBusy: boolean; // true nếu bác sĩ đã có lịch
}

interface TimeSlotPickerProps {
  date: Date;           // Ngày đang chọn (để check quá khứ)
  slots: TimeSlot[];    // Danh sách các slot được generate
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export const TimeSlotPicker = ({ 
  date, 
  slots, 
  selectedTime, 
  onSelect 
}: TimeSlotPickerProps) => {
  
  // Hàm kiểm tra xem slot này có phải quá khứ không
  // (Ví dụ: Bây giờ là 10h, thì slot 9h sáng nay phải bị disable)
  const isSlotInPast = (timeString: string) => {
    // Tạo object Date cho slot này: Ngày đang chọn + Giờ của slot
    const slotDate = parse(timeString, 'HH:mm', date);
    return isPast(slotDate);
  };

  if (!slots || slots.length === 0) {
    return <p className="text-sm text-gray-500 italic">Vui lòng chọn bác sĩ và ngày khám trước.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">
        Khung giờ trống ngày {format(date, 'dd/MM/yyyy')}
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {slots.map(({ time, isBusy }) => {
          const disabled = isBusy || isSlotInPast(time);
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(time)}
              className={cn(
                "py-2 px-1 text-sm font-medium rounded-lg border transition-all duration-200",
                // 1. Trạng thái Selected (Ưu tiên cao nhất)
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200"
                  : "bg-white",
                
                // 2. Trạng thái Disabled (Bận hoặc Quá khứ)
                disabled 
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed decoration-slice line-through decoration-gray-400" 
                  : !isSelected && "text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm"
              )}
              title={isBusy ? "Giờ này đã có người đặt" : isSlotInPast(time) ? "Giờ này đã qua" : ""}
            >
              {time}
            </button>
          );
        })}
      </div>
      
      {/* Chú thích */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
          <span>Trống</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span>Đã đặt / Qua</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Đang chọn</span>
        </div>
      </div>
    </div>
  );
};