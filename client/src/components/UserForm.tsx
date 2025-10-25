// src/components/UserForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '@/lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User, UserRole } from '@/types';
import { AxiosError } from 'axios'; // 1. Import AxiosError

// Định nghĩa kiểu dữ liệu cho form
type UserFormData = {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
};

interface UserFormProps {
  initialData?: User | null;
  onSave: () => void;
  onCancel: () => void;
}

export const UserForm = ({ initialData, onSave, onCancel }: UserFormProps) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ fullName: '', email: '', password: '', role: UserRole.PATIENT });
    }
  }, [initialData, reset]);

  const isEditMode = !!initialData;

  const onSubmit: SubmitHandler<UserFormData> = async (formData) => {
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await api.patch(`/users/${initialData?.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      onSave();
    } catch (err) { // 2. Bỏ kiểu ": any"
      // 3. Sử dụng type guard để xử lý lỗi một cách an toàn
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Đã có lỗi xảy ra từ server.');
      } else {
        setError('Đã có lỗi không xác định xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">
        {isEditMode ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
      </h2>

      {/* --- Các trường input cho form --- */}
      <div>
        <label htmlFor="fullName">Họ và Tên</label>
        <Input
          id="fullName"
          {...register('fullName', { required: 'Họ tên là bắt buộc' })}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          {...register('email', { required: 'Email là bắt buộc' })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {!isEditMode && (
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: 'Mật khẩu là bắt buộc',
              minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            })}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="role">Vai trò</label>
        <select
          id="role"
          {...register('role')}
          className="w-full p-2 border rounded-md border-gray-300" // Thêm style cho select
        >
          <option value={UserRole.PATIENT}>Patient</option>
          <option value={UserRole.DOCTOR}>Doctor</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
      </div>
      {/* --- Kết thúc các trường input --- */}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </form>
  );
};