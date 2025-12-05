'use client';

import React from 'react';
import { CheckCircle, Stethoscope } from 'lucide-react';
import { User } from '@/types/users';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';

interface DoctorListProps {
  doctors: User[];
  selectedDoctorId: number;
  onSelect: (doctorId: number) => void;
  isLoading?: boolean;
}

export const DoctorList = ({ 
  doctors, 
  selectedDoctorId, 
  onSelect,
  isLoading 
}: DoctorListProps) => {

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Đang tải danh sách bác sĩ...</div>;
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500">Không tìm thấy bác sĩ nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doc) => {
        const isSelected = selectedDoctorId === doc.id;

        return (
          <Card
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            className={cn(
              "relative cursor-pointer transition-all duration-200 hover:shadow-md",
              "border-2", // Tăng độ dày viền để làm nổi bật khi chọn
              isSelected 
                ? "border-blue-600 bg-blue-50/50" 
                : "border-transparent hover:border-blue-200"
            )}
          >
            {/* Icon check khi được chọn */}
            {isSelected && (
              <div className="absolute top-3 right-3 text-blue-600 animate-in zoom-in duration-200">
                <CheckCircle size={20} fill="currentColor" className="text-white" />
              </div>
            )}

            <div className="p-4 flex flex-col items-center text-center space-y-3">
              <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                <AvatarImage 
                  src={`https://ui-avatars.com/api/?name=${doc.fullName}&background=0D8ABC&color=fff`} 
                  alt={doc.fullName} 
                />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-bold text-gray-900">{doc.fullName}</h4>
                {/* Hiển thị chuyên khoa nếu có */}
                {doc.specialty && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-fit mx-auto">
                    <Stethoscope size={12} />
                    <span>{doc.specialty.name}</span>
                  </div>
                )}
              </div>

              {/* (Optional) Hiển thị giá khám nếu cần */}
               {doc.specialty?.baseCost && (
                 <p className="text-sm text-gray-500">
                   Phí khám: <span className="font-semibold text-gray-700">{new Intl.NumberFormat('vi-VN').format(doc.specialty.baseCost)}đ</span>
                 </p>
               )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};