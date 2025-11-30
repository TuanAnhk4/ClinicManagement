'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import Select from 'react-select'; // Import react-select
import api from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Medicine } from '@/types'; // Giả sử bạn có Medicine type trong src/types
import { AxiosError } from 'axios';

// Định nghĩa kiểu dữ liệu cho một dòng thuốc trong form
type PrescriptionItemForm = {
  medicineId: { value: number; label: string } | null; // react-select dùng object {value, label}
  quantity: number | string; // Cho phép nhập string ban đầu
  dosage: string;
};

// Định nghĩa kiểu dữ liệu cho toàn bộ form
type ConsultationFormData = {
  symptoms?: string;
  diagnosis: string;
  notes?: string;
  prescriptionItems: PrescriptionItemForm[];
};

interface ConsultationFormProps {
  appointmentId: number; // ID của cuộc hẹn
  onSubmitSuccess: () => void; // Hàm gọi lại khi lưu thành công
}

export const ConsultationForm = ({ appointmentId, onSubmitSuccess }: ConsultationFormProps) => {
  const [medicines, setMedicines] = useState<{ value: number; label: string }[]>([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khởi tạo react-hook-form
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ConsultationFormData>({
    defaultValues: {
      symptoms: '',
      diagnosis: '',
      notes: '',
      prescriptionItems: [], // Bắt đầu với đơn thuốc trống
    },
  });

  // Quản lý các dòng thuốc động
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prescriptionItems',
  });

  // Lấy danh sách thuốc từ API khi component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get('/medicines'); // API lấy danh sách thuốc
        const options = response.data.map((med: Medicine) => {
          // Format giá tiền sang VND (ví dụ: 5.000 ₫)
          const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(med.price);

          return {
            value: med.id,
            // Hiển thị: Paracetamol (viên) - 5.000 ₫
            label: `${med.name} (${med.unit}) - ${formattedPrice}`,
          };
        });
        setMedicines(options);
      } catch (error) {
        console.error("Không thể tải danh mục thuốc:", error);
        setFormError("Lỗi tải danh mục thuốc.");
      }
    };
    fetchMedicines();
  }, []);

  // Hàm xử lý khi submit form
  const onSubmit: SubmitHandler<ConsultationFormData> = async (formData) => {
    setIsSubmitting(true);
    setFormError('');

    // Chuyển đổi dữ liệu đơn thuốc về đúng định dạng API yêu cầu
    const formattedPrescriptionItems = formData.prescriptionItems.map(item => ({
      medicineId: item.medicineId?.value,
      quantity: parseInt(String(item.quantity), 10), // Đảm bảo quantity là số
      dosage: item.dosage,
    })).filter(item => item.medicineId != null && !isNaN(item.quantity)); // Lọc bỏ dòng lỗi

    const payload = {
      appointmentId,
      diagnosis: formData.diagnosis,
      symptoms: formData.symptoms,
      notes: formData.notes,
      prescriptionItems: formattedPrescriptionItems,
    };

    try {
      await api.post('/medical-records', payload);
      alert('Lưu hồ sơ khám bệnh thành công!');
      reset(); // Reset form sau khi thành công
      onSubmitSuccess(); // Gọi hàm callback báo thành công
    } catch (err) {
      console.error("Lỗi khi lưu hồ sơ:", err);
      if (err instanceof AxiosError) {
        setFormError(err.response?.data?.message || 'Lỗi khi lưu hồ sơ.');
      } else {
        setFormError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2">Hồ Sơ Khám Bệnh</h2>

      {/* Triệu chứng */}
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
          Triệu chứng
        </label>
        <textarea
          id="symptoms"
          rows={3}
          className="w-full p-2 border rounded-md border-gray-300"
          {...register('symptoms')}
        />
      </div>

      {/* Chẩn đoán (bắt buộc) */}
      <div>
        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
          Chẩn đoán <span className="text-red-500">*</span>
        </label>
        <textarea
          id="diagnosis"
          rows={3}
          className={`w-full p-2 border rounded-md ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
          {...register('diagnosis', { required: 'Chẩn đoán là bắt buộc' })}
        />
        {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis.message}</p>}
      </div>

      {/* Ghi chú thêm */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú thêm
        </label>
        <textarea
          id="notes"
          rows={2}
          className="w-full p-2 border rounded-md border-gray-300"
          {...register('notes')}
        />
      </div>

      {/* Đơn thuốc */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-1">Đơn Thuốc</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2 border p-3 rounded-md bg-gray-50">
            {/* Tìm thuốc */}
            <div className="flex-1">
              <label className="text-xs text-gray-600">Thuốc</label>
              <Controller
                name={`prescriptionItems.${index}.medicineId`}
                control={control}
                rules={{ required: 'Vui lòng chọn thuốc' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={medicines}
                    placeholder="Tìm thuốc..."
                    isClearable
                    styles={{ // Thêm style nếu cần
                      control: (base) => ({
                        ...base,
                        borderColor: errors.prescriptionItems?.[index]?.medicineId ? 'red' : base.borderColor,
                      }),
                    }}
                  />
                )}
              />
              {errors.prescriptionItems?.[index]?.medicineId && <p className="text-red-500 text-xs mt-1">{errors.prescriptionItems[index]?.medicineId?.message}</p>}
            </div>
            {/* Số lượng */}
            <div className="w-20">
              <label className="text-xs text-gray-600">SL</label>
              <Input
                type="number"
                min="1"
                className={`w-full ${errors.prescriptionItems?.[index]?.quantity ? 'border-red-500' : 'border-gray-300'}`}
                {...register(`prescriptionItems.${index}.quantity`, { required: 'SL?', valueAsNumber: true })}
              />
            </div>
            {/* Cách dùng */}
            <div className="flex-1">
              <label className="text-xs text-gray-600">Cách dùng</label>
              <Input
                className={`w-full ${errors.prescriptionItems?.[index]?.dosage ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="VD: Sáng 1v, tối 1v sau ăn"
                {...register(`prescriptionItems.${index}.dosage`, { required: 'Cách dùng?' })}
              />
            </div>
            {/* Nút xóa */}
            <Button type="button" variant="danger" size="small" onClick={() => remove(index)} className="mt-5">
              Xóa
            </Button>
          </div>
        ))}
        {/* Nút thêm thuốc */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ medicineId: null, quantity: 1, dosage: '' })}
        >
          + Thêm Thuốc
        </Button>
      </div>

      {/* Hiển thị lỗi chung của form */}
      {formError && <p className="text-red-600 text-sm">{formError}</p>}

      {/* Nút Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Hoàn Tất Khám & Lưu'}
        </Button>
      </div>
    </form>
  );
};