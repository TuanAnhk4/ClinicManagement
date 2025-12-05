'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/hooks';

// Services & Types
import { doctorScheduleService } from '@/services/doctor-schedule.service';
import { DoctorSchedule } from '@/types/doctor-schedules';

// Schema
import { scheduleSchema, ScheduleFormValues, defaultValues, DAY_OPTIONS } from './schema';

interface DoctorScheduleFormProps {
  initialData?: DoctorSchedule | null; // Nếu có -> Sửa
  onSave: () => void;
  onCancel: () => void;
}

export const DoctorScheduleForm = ({ initialData, onSave, onCancel }: DoctorScheduleFormProps) => {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      // Format lại giờ nếu backend trả về HH:mm:ss -> lấy HH:mm
      // Slice(0, 5) sẽ lấy 5 ký tự đầu
      const formattedStart = initialData.startTime.length > 5 
        ? initialData.startTime.slice(0, 5) 
        : initialData.startTime;
        
      const formattedEnd = initialData.endTime.length > 5 
        ? initialData.endTime.slice(0, 5) 
        : initialData.endTime;

      reset({
        dayOfWeek: initialData.dayOfWeek,
        startTime: formattedStart,
        endTime: formattedEnd,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ScheduleFormValues) => {
    setLoading(true);
    try {
      if (isEditMode && initialData) {
        await doctorScheduleService.update(initialData.id, data);
        success('Cập nhật lịch làm việc thành công!');
      } else {
        await doctorScheduleService.create(data);
        success('Đã thêm lịch làm việc mới!');
      }
      onSave();
    } catch (err) {
      if (err instanceof AxiosError) {
        // Hiển thị lỗi logic từ backend (ví dụ: Trùng lịch)
        toastError(err.response?.data?.message || 'Lỗi từ server.');
      } else {
        toastError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Chọn Ngày */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Ngày trong tuần <span className="text-red-500">*</span>
        </label>
        <Select 
          options={DAY_OPTIONS} 
          {...register('dayOfWeek')} 
          error={!!errors.dayOfWeek}
          disabled={loading}
        />
        {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message as string}</p>}
      </div>

      {/* 2. Chọn Giờ (Grid 2 cột) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Giờ bắt đầu <span className="text-red-500">*</span>
          </label>
          <Input 
            type="time" // Input type time của HTML5
            {...register('startTime')} 
            error={!!errors.startTime}
            disabled={loading}
          />
          {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message as string}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Giờ kết thúc <span className="text-red-500">*</span>
          </label>
          <Input 
            type="time" 
            {...register('endTime')} 
            error={!!errors.endTime}
            disabled={loading}
          />
          {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message as string}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Hủy bỏ
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditMode ? 'Lưu Thay Đổi' : 'Thêm Lịch'}
        </Button>
      </div>
    </form>
  );
};