'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import SubmitHandler
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Save } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PrescriptionInput } from './PrescriptionInput'; 
import { useToast } from '@/hooks';

// Services & Types
import { medicalRecordService } from '@/services/medical-record.service';
import { CreateMedicalRecordPayload } from '@/types/medical-records';
import { CreatePrescriptionItemPayload } from '@/types/prescription-items';

// Schema (Lưu ý import Type mới)
import { consultationSchema, ConsultationFormSchemaType, defaultValues } from './schema';

interface ConsultationFormProps {
  appointmentId: number;
  onSuccess: () => void;
}

export const ConsultationForm = ({ appointmentId, onSuccess }: ConsultationFormProps) => {
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  // SỬA LỖI 1: Bỏ Generic Type <ConsultationFormValues>
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues,
  });

  // SỬA LỖI 2: Dùng Type đã infer từ Zod
  const onSubmit: SubmitHandler<ConsultationFormSchemaType> = async (data) => {
    setLoading(true);
    try {
      const payload: CreateMedicalRecordPayload = {
        appointmentId,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        notes: data.notes,
        prescriptionItems: data.prescriptionItems?.map(item => ({
          medicineId: Number(item.medicineId),
          quantity: Number(item.quantity),
          dosage: item.dosage,
        } as CreatePrescriptionItemPayload))
      };

      await medicalRecordService.create(payload);
      
      success('Hoàn tất khám bệnh! Hồ sơ đã được lưu.');
      onSuccess();

    } catch (err) {
      if (err instanceof AxiosError) {
        toastError(err.response?.data?.message || 'Lỗi khi lưu hồ sơ.');
      } else {
        toastError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Phần 1: Thông tin lâm sàng */}
      <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          1. Thông Tin Lâm Sàng
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Chẩn đoán bệnh <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="VD: Viêm họng cấp..." 
              {...register('diagnosis')} 
              error={!!errors.diagnosis}
              disabled={loading}
              autoFocus
            />
            {errors.diagnosis && (
              <p className="text-red-500 text-xs mt-1">{errors.diagnosis.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Triệu chứng</label>
              <Textarea 
                placeholder="VD: Ho, sốt cao..." 
                rows={4}
                {...register('symptoms')} 
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ghi chú</label>
              <Textarea 
                placeholder="Ghi chú thêm..." 
                rows={4}
                {...register('notes')} 
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Phần 2: Kê Đơn Thuốc */}
      <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          2. Kê Đơn Thuốc
        </h2>
        
        {/* SỬA LỖI 3: Ép kiểu control thành any khi truyền xuống component con */}
        {/* Đây là cách nhanh nhất để fix lỗi "Type incompatibility" phức tạp của useFieldArray */}
        <PrescriptionInput 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={control as any} 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          register={register as any} 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errors={errors as any} 
          disabled={loading} 
        />
      </section>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          size="large" 
          isLoading={loading}
          className="px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Hoàn Tất & Lưu Hồ Sơ
        </Button>
      </div>
    </form>
  );
};