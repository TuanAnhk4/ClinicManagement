'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Bỏ SubmitHandler ở đây nếu không dùng explicit type
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks';

import { specialtyService } from '@/services/specialty.service';
import { Specialty } from '@/types/specialties';

// Import Schema và Type
import { specialtySchema, SpecialtyFormValues, defaultValues } from './schema';

interface SpecialtyFormProps {
  initialData?: Specialty | null;
  onSave: () => void;
  onCancel: () => void;
}

export const SpecialtyForm = ({ initialData, onSave, onCancel }: SpecialtyFormProps) => {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const isEditMode = !!initialData;

  // --- SỬA LỖI TẠI ĐÂY ---
  // 1. Bỏ <SpecialtyFormValues> đi.
  // 2. useForm sẽ tự hiểu kiểu dữ liệu dựa trên 'specialtySchema'
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ 
    resolver: zodResolver(specialtySchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        base_cost: initialData.baseCost,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  // --- SỬA LỖI TẠI ĐÂY ---
  // 3. Khai báo kiểu dữ liệu cho biến 'data' trực tiếp trong hàm
  const onSubmit = async (data: SpecialtyFormValues) => {
    setLoading(true);
    try {
      if (isEditMode && initialData) {
        await specialtyService.update(initialData.id, data);
        success('Cập nhật chuyên khoa thành công!');
      } else {
        await specialtyService.create(data);
        success('Tạo chuyên khoa mới thành công!');
      }
      onSave();
    } catch (err) {
      if (err instanceof AxiosError) {
        toastError(err.response?.data?.message || 'Lỗi từ server.');
      } else {
        toastError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // handleSubmit sẽ tự động khớp với kiểu của onSubmit
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tên chuyên khoa <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Ví dụ: Tim Mạch, Da Liễu..." 
            {...register('name')} 
            error={!!errors.name}
            disabled={loading}
          />
          {/* Ép kiểu lỗi sang any hoặc string để tránh lỗi TS khi truy cập message */}
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Phí khám cơ bản (VNĐ) <span className="text-red-500">*</span>
          </label>
          <Input 
            type="number"
            placeholder="0" 
            {...register('base_cost')} 
            error={!!errors.base_cost}
            disabled={loading}
            min={0}
            step={1000}
          />
          {errors.base_cost && <p className="text-red-500 text-xs mt-1">{errors.base_cost.message as string}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Mô tả (Tùy chọn)
          </label>
          <Textarea 
            placeholder="Mô tả chi tiết về chuyên khoa..." 
            rows={3}
            {...register('description')} 
            error={!!errors.description}
            disabled={loading}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Hủy bỏ
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Mới'}
        </Button>
      </div>
    </form>
  );
};