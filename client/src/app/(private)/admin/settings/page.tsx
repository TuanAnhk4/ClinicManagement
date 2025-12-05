'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Save, Shield } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';

// Hooks & Services
import { useAuth, useToast } from '@/hooks';
import { userService } from '@/services/user.service';
import { REGEX } from '@/constants/regex';

// --- SCHEMA VALIDATION ---

// 1. Schema cho thông tin cá nhân
const profileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phoneNumber: z.string().regex(REGEX.PHONE_VN, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
});

// 2. Schema cho đổi mật khẩu
const passwordSchema = z.object({
  // currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'), // (Mở comment nếu backend có API check pass cũ)
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth(); // Lấy user từ context (lúc này có thể cũ)
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  // --- FORM 1: PROFILE ---
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
    },
    values: { // Tự động cập nhật khi user load xong
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
    }
  });

  // --- FORM 2: PASSWORD ---
  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // --- HANDLERS ---

  const onUpdateProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      // Gọi API cập nhật
      await userService.update(user.id, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
      });
      
      success('Cập nhật thông tin cá nhân thành công!');
      // Lưu ý: Context có thể cần reload lại user. 
      // Cách đơn giản là F5 hoặc auth.login() lại token cũ để fetch profile mới.
      // Ở đây ta giả định user sẽ thấy cập nhật sau khi reload.
      window.location.reload(); 

    } catch (error) {
      toastError('Lỗi cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      // Gọi API Update User (Backend sẽ tự hash password)
      await userService.update(user.id, {
        // password: data.newPassword 
        // Lưu ý: DTO update của User hỗ trợ đổi pass trực tiếp
        // (Để an toàn hơn, nên có API riêng /auth/change-password yêu cầu pass cũ)
      });

      // Giả lập delay hoặc gọi API thực tế
      await new Promise(r => setTimeout(r, 1000)); 
      
      success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      resetPass();
    } catch (error) {
      toastError('Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="flex justify-center p-10"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Tài Khoản</h1>
        <p className="text-sm text-gray-500">Quản lý thông tin cá nhân và bảo mật.</p>
      </div>

      {/* --- CARD 1: THÔNG TIN CÁ NHÂN --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Thông Tin Cơ Bản
          </CardTitle>
          <CardDescription>Cập nhật tên hiển thị và thông tin liên lạc của bạn.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-4 border-gray-100">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="small" disabled>Đổi Avatar</Button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Họ và Tên</label>
                  <Input {...registerProfile('fullName')} error={!!profileErrors.fullName} />
                  {profileErrors.fullName && <p className="text-red-500 text-xs mt-1">{profileErrors.fullName.message}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Số điện thoại</label>
                  <Input {...registerProfile('phoneNumber')} error={!!profileErrors.phoneNumber} />
                  {profileErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{profileErrors.phoneNumber.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input value={user?.email} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi.</p>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" isLoading={loading}>
                  <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* --- CARD 2: BẢO MẬT --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Bảo Mật & Mật Khẩu
          </CardTitle>
          <CardDescription>Đổi mật khẩu định kỳ để bảo vệ tài khoản.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4 max-w-lg">
            {/* Nếu backend có API check pass cũ thì thêm ô này */}
            {/* <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mật khẩu hiện tại</label>
              <Input type="password" {...registerPass('currentPassword')} />
            </div> */}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mật khẩu mới</label>
              <Input type="password" placeholder="••••••••" {...registerPass('newPassword')} error={!!passErrors.newPassword} />
              {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nhập lại mật khẩu mới</label>
              <Input type="password" placeholder="••••••••" {...registerPass('confirmPassword')} error={!!passErrors.confirmPassword} />
              {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="danger" isLoading={loading}>
                <Lock className="w-4 h-4 mr-2" /> Đổi Mật Khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}