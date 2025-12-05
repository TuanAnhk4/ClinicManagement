'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks';

// Services & Types
import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types/medicines';

// Schema
import { medicineSchema, MedicineFormValues, defaultValues } from './schema';

interface MedicineFormProps {
  initialData?: Medicine | null; // Nếu có -> Chế độ Sửa
  onSave: () => void;            // Callback khi lưu thành công
  onCancel: () => void;          // Callback đóng form
}

export const MedicineForm = ({ initialData, onSave, onCancel }: MedicineFormProps) => {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast(); // Lấy hàm thông báo

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues,
  });

  // Đổ dữ liệu vào form khi sửa
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        unit: initialData.unit,
        price: initialData.price,
        description: initialData.description || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<MedicineFormValues> = async (data) => {
    setLoading(true);
    try {
      if (isEditMode && initialData) {
        await medicineService.update(initialData.id, data);
        success(`Đã cập nhật thuốc "${data.name}" thành công!`);
      } else {
        await medicineService.create(data);
        success(`Đã thêm thuốc "${data.name}" vào kho!`);
      }
      onSave(); // Refresh danh sách
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        
        {/* Tên thuốc */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tên thuốc <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="VD: Paracetamol 500mg" 
            {...register('name')} 
            error={!!errors.name}
            disabled={loading}
            autoFocus // Tự động focus khi mở form
          />
          {/* Ép kiểu message sang string để tránh lỗi TS */}
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Đơn vị tính */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Đơn vị <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="VD: Viên, Vỉ, Chai" 
              {...register('unit')} 
              error={!!errors.unit}
              disabled={loading}
            />
            {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message as string}</p>}
          </div>

          {/* Giá tiền */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Đơn giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <Input 
              type="number"
              placeholder="0"
              {...register('price')} 
              error={!!errors.price}
              disabled={loading}
              min={0}
              step={100}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message as string}</p>}
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Mô tả / Ghi chú
          </label>
          <Textarea 
            placeholder="Công dụng, cách dùng sơ lược..." 
            rows={3}
            {...register('description')} 
            error={!!errors.description}
            disabled={loading}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Hủy bỏ
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditMode ? 'Lưu Thay Đổi' : 'Thêm Thuốc'}
        </Button>
      </div>
    </form>
  );
};