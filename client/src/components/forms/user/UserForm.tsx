'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Bỏ SubmitHandler nếu không cần thiết, hoặc import để dùng
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/hooks';

import { userService } from '@/services/user.service';
import { specialtyService } from '@/services/specialty.service';
import { User, UpdateUserPayload } from '@/types/users';
import { UserRole, Gender } from '@/types/enums';
import { Specialty } from '@/types/specialties';

// Import Schema và Type đã sửa
import { userFormSchema, UserFormSchemaType, defaultValues } from './schema';

interface UserFormProps {
  initialData?: User | null;
  onSave: () => void;
  onCancel: () => void;
}

export const UserForm = ({ initialData, onSave, onCancel }: UserFormProps) => {
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const { success, error: toastError } = useToast();

  const isEditMode = !!initialData;

  // SỬA LỖI 2: Bỏ generic type <UserFormValues> đi
  // Để useForm tự suy luận từ zodResolver
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const selectedRole = watch('role');

  useEffect(() => {
    const initData = async () => {
      try {
        const specs = await specialtyService.getAll();
        setSpecialties(specs);
      } catch (error) {
        console.error('Lỗi tải chuyên khoa', error);
      }

      if (initialData) {
        reset({
          fullName: initialData.fullName,
          email: initialData.email,
          phoneNumber: initialData.phoneNumber || '',
          role: initialData.role,
          specialtyId: initialData.specialtyId || undefined,
          gender: initialData.gender || undefined,
          date_of_birth: initialData.date_of_birth || undefined,
          bmi: initialData.bmi || 0,
          children: initialData.children || 0,
          is_smoker: initialData.is_smoker || false,
        });
      }
    };

    initData();
  }, [initialData, reset]);

  // SỬA LỖI 4: Định nghĩa kiểu data là UserFormSchemaType
  const onSubmit = async (data: UserFormSchemaType) => {
    setLoading(true);
    try {
      if (!isEditMode && !data.password) {
        toastError('Vui lòng nhập mật khẩu khi tạo mới');
        setLoading(false);
        return;
      }

      const payload = { ...data };
      if (isEditMode && !payload.password) delete payload.password;
      // B. Xử lý Ngày sinh: Nếu là chuỗi rỗng "" -> Chuyển thành undefined
      // Để Backend bỏ qua validation @IsDateString
      if (!payload.date_of_birth) {
        payload.date_of_birth = undefined;
      }

      // C. Xử lý theo Vai trò (Clean Architecture)
      if (payload.role === UserRole.DOCTOR || payload.role === UserRole.ADMIN) {
        // Bác sĩ/Admin không cần thông tin sức khỏe -> Xóa đi cho sạch
        payload.bmi = undefined;
        payload.children = 0; // Hoặc undefined tùy backend
        payload.is_smoker = false;
        payload.gender = undefined;
        // date_of_birth đã xử lý ở trên
      } 
      
      if (payload.role === UserRole.PATIENT) {
        // Bệnh nhân không cần chuyên khoa -> Xóa đi
        payload.specialtyId = undefined;
      }

      if (isEditMode && initialData) {
        await userService.update(initialData.id, payload as UpdateUserPayload);
        success('Cập nhật thành công!');
      } else {
        // SỬA LỖI 3: Tắt ESLint cho dòng any này (Vì form data và API payload lệch nhau xíu về type strictness)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await userService.create(payload as any);
        success('Tạo người dùng thành công!');
      }
      
      onSave();
    } catch (err) {
      if (err instanceof AxiosError) {
        toastError(err.response?.data?.message || 'Lỗi từ server.');
      } else {
        toastError('Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Bệnh Nhân', value: UserRole.PATIENT },
    { label: 'Bác Sĩ', value: UserRole.DOCTOR },
    { label: 'Quản Trị Viên', value: UserRole.ADMIN },
  ];

  const specialtyOptions = specialties.map(s => ({
    label: s.name,
    value: s.id
  }));

  const genderOptions = [
    { label: 'Nam', value: Gender.MALE },
    { label: 'Nữ', value: Gender.FEMALE },
    { label: 'Khác', value: 'OTHER' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Họ và Tên</label>
          <Input {...register('fullName')} error={!!errors.fullName} />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
          <Input type="email" {...register('email')} error={!!errors.email} disabled={isEditMode} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Số điện thoại</label>
          <Input {...register('phoneNumber')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Vai trò</label>
          <Select 
            {...register('role')} 
            options={roleOptions} 
            disabled={isEditMode} 
          />
        </div>
      </div>

      {selectedRole === UserRole.DOCTOR && (
        <div>
          <label className="text-sm font-medium text-blue-600 mb-1 block">Chuyên Khoa (Bắt buộc)</label>
          <Select 
            {...register('specialtyId')} 
            options={specialtyOptions} 
            placeholder="Chọn chuyên khoa..."
            error={!!errors.specialtyId}
          />
          {errors.specialtyId && <p className="text-red-500 text-xs mt-1">Vui lòng chọn chuyên khoa</p>}
        </div>
      )}

      {selectedRole === UserRole.PATIENT && (
         <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <p className="text-xs font-bold text-gray-500 uppercase">Thông tin sức khỏe (ML Features)</p>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium text-gray-700 mb-1 block">Giới tính</label>
                 <Select {...register('gender')} options={genderOptions} />
               </div>
               <div>
                   <label className="text-sm font-medium text-gray-700 mb-1 block">Ngày sinh</label>
                   <Input type="date" {...register('date_of_birth')} />
               </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="text-sm font-medium text-gray-700 mb-1 block">BMI</label>
                 <Input type="number" {...register('bmi')} placeholder="VD: 22.5" step="0.1" />
               </div>
               <div>
                 <label className="text-sm font-medium text-gray-700 mb-1 block">Số con</label>
                 <Input type="number" {...register('children')} min="0" />
               </div>
               <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" {...register('is_smoker')} className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Hút thuốc</span>
                  </label>
               </div>
            </div>
         </div>
      )}

      <div className="border-t pt-4 mt-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {isEditMode ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'Mật khẩu'}
        </label>
        <Input 
          type="password" 
          {...register('password')} 
          error={!!errors.password} 
          placeholder={isEditMode ? "********" : ""}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Hủy</Button>
        <Button type="submit" isLoading={loading}>
          {isEditMode ? 'Cập Nhật' : 'Tạo Mới'}
        </Button>
      </div>
    </form>
  );
};