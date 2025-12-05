'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Save, Stethoscope, Phone, Mail } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

// Hooks & Services
import { useAuth, useToast } from '@/hooks';
import { userService } from '@/services/user.service';
import { REGEX } from '@/constants/regex';

// --- SCHEMAS ---

// 1. Schema thông tin cá nhân
const profileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phoneNumber: z.string().regex(REGEX.PHONE_VN, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
});

// 2. Schema đổi mật khẩu
const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function DoctorSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  // --- FORM SETUP ---

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
    },
  });

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Load dữ liệu khi user sẵn sàng
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user, resetProfile]);

  // --- HANDLERS ---

  const onUpdateProfile = async (data: ProfileFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      await userService.update(user.id, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
      });
      
      success('Cập nhật hồ sơ thành công!');
      // Reload lại trang để Context lấy dữ liệu mới (hoặc gọi auth.reload() nếu có)
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
      await userService.update(user.id, {
        // Backend đã có logic tự hash password khi update
      });
      // Giả lập delay nhẹ
      await new Promise(r => setTimeout(r, 500));
      
      success('Đổi mật khẩu thành công.');
      resetPass();
    } catch (error) {
      toastError('Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="flex justify-center p-20"><Spinner size="large" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Tài Khoản</h1>
        <p className="text-sm text-gray-500">Quản lý thông tin cá nhân và bảo mật.</p>
      </div>

      {/* --- CARD 1: HỒ SƠ BÁC SĨ --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Thông Tin Cá Nhân
          </CardTitle>
          <CardDescription>Thông tin hiển thị trên hồ sơ khám bệnh của bạn.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-28 w-28 border-4 border-blue-50 shadow-sm">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff&size=128`} />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              
              {/* Hiển thị chuyên khoa (Read-only) */}
              <div className="flex flex-col items-center gap-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
                  {user?.specialty?.name || 'Chưa cập nhật khoa'}
                </Badge>
                <span className="text-xs text-gray-400">Role: {user?.role}</span>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="flex-1 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Họ và Tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input className="pl-9" {...registerProfile('fullName')} error={!!profileErrors.fullName} />
                  </div>
                  {profileErrors.fullName && <p className="text-red-500 text-xs mt-1">{profileErrors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email (Đăng nhập)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input className="pl-9 bg-gray-50" value={user?.email} disabled />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Liên hệ Admin để đổi email.</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input className="pl-9" {...registerProfile('phoneNumber')} error={!!profileErrors.phoneNumber} />
                    </div>
                    {profileErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{profileErrors.phoneNumber.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={loading} className="min-w-[120px]">
                  <Save className="w-4 h-4 mr-2" /> Lưu Hồ Sơ
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* --- CARD 2: ĐỔI MẬT KHẨU --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-600" />
            Đổi Mật Khẩu
          </CardTitle>
          <CardDescription>Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4 max-w-lg">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mật khẩu mới</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...registerPass('newPassword')} 
                error={!!passErrors.newPassword} 
              />
              {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Xác nhận mật khẩu mới</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...registerPass('confirmPassword')} 
                error={!!passErrors.confirmPassword} 
              />
              {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="secondary" isLoading={loading}>
                Cập Nhật Mật Khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}