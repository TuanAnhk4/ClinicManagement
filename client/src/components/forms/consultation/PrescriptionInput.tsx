'use client';

import React, { useEffect, useState } from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// Services & Types
import { medicineService } from '@/services/medicine.service';
import { Medicine } from '@/types/medicines';
import { ConsultationFormSchemaType } from './schema';

interface PrescriptionInputProps {
  control: Control<ConsultationFormSchemaType>;
  register: UseFormRegister<ConsultationFormSchemaType>;
  errors: FieldErrors<ConsultationFormSchemaType>;
  disabled?: boolean;
}

export const PrescriptionInput = ({ control, register, errors, disabled }: PrescriptionInputProps) => {
  // State lưu danh sách thuốc để đổ vào Select
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  // Hook quản lý mảng động
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prescriptionItems',
  });

  // Load danh sách thuốc khi mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await medicineService.getAll();
        setMedicines(data);
      } catch (error) {
        console.error('Lỗi tải danh sách thuốc:', error);
      }
    };
    fetchMedicines();
  }, []);

  // Tạo options cho Select (Hiển thị Tên + Giá tiền)
  const medicineOptions = medicines.map((med) => ({
    label: `${med.name} (${med.unit}) - ${formatCurrency(med.price)}`,
    value: med.id,
  }));

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-700 uppercase">Kê Đơn Thuốc</h3>
        <Button
          type="button"
          size="small"
          variant="outline"
          onClick={() => append({ medicineId: 0, quantity: 1, dosage: '' })}
          disabled={disabled}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Thêm thuốc
        </Button>
      </div>

      {/* Nếu chưa có thuốc nào */}
      {fields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4 italic">
            Chưa có thuốc nào trong đơn. Nhấn &quot;Thêm thuốc&quot; để kê đơn.
        </p>
      )}

      {/* Danh sách các dòng thuốc */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          // Lấy lỗi của dòng hiện tại (nếu có)
          const itemErrors = errors.prescriptionItems?.[index];

          return (
            <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-start bg-white p-3 rounded border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
              
              {/* 1. Chọn thuốc */}
              <div className="flex-1 w-full sm:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Tên thuốc</label>
                <Select
                  {...register(`prescriptionItems.${index}.medicineId`)}
                  options={medicineOptions}
                  placeholder="-- Chọn thuốc --"
                  error={!!itemErrors?.medicineId}
                  disabled={disabled}
                />
              </div>

              {/* 2. Số lượng */}
              <div className="w-full sm:w-24">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Số lượng</label>
                <Input
                  type="number"
                  min={1}
                  {...register(`prescriptionItems.${index}.quantity`)}
                  error={!!itemErrors?.quantity}
                  disabled={disabled}
                />
              </div>

              {/* 3. Liều dùng */}
              <div className="flex-[2] w-full sm:w-auto">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Cách dùng</label>
                <Input
                  placeholder="Sáng 1v, Tối 1v sau ăn..."
                  {...register(`prescriptionItems.${index}.dosage`)}
                  error={!!itemErrors?.dosage}
                  disabled={disabled}
                />
              </div>

              {/* 4. Nút xóa */}
              <div className="mt-auto pt-1">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Xóa thuốc này"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};