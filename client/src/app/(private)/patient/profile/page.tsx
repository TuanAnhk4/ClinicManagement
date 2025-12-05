'use client';

import React, { useEffect, useState } from 'react';
import { User as UserIcon, Activity } from 'lucide-react';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { UserForm } from '@/components/forms/user/UserForm';

// Services & Hooks
import { useAuth } from '@/hooks';
import { authService } from '@/services/auth.service'; // Dùng authService để lấy profile mới nhất
import { User } from '@/types/users';

export default function PatientProfilePage() {
  const { user: contextUser } = useAuth(); // Lấy user từ context (để hiển thị ban đầu)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu mới nhất từ Server
  // (Tránh trường hợp Context lưu dữ liệu cũ chưa cập nhật)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile();
      setCurrentUser(data);
    } catch (error) {
      console.error('Lỗi tải hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Callback sau khi lưu thành công
  const handleSaveSuccess = () => {
    // Reload lại dữ liệu để cập nhật UI
    fetchProfile();
    // Có thể trigger update context ở đây nếu cần (thường authService.getProfile đã update localstorage)
    window.location.reload(); // Reload nhẹ để Context đồng bộ hoàn toàn
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="large" />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Header Page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
        <p className="text-gray-500 mt-2">
          Quản lý thông tin cá nhân và các chỉ số sức khỏe quan trọng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: Avatar & Tóm tắt */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center pt-8 pb-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-blue-50 shadow-lg mb-4">
                  <AvatarImage 
                    src={`https://ui-avatars.com/api/?name=${currentUser.fullName}&background=0D8ABC&color=fff&size=256`} 
                    alt={currentUser.fullName} 
                  />
                  <AvatarFallback className="text-3xl font-bold">
                    {currentUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 bg-green-500 h-4 w-4 rounded-full border-2 border-white" title="Online"></div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{currentUser.fullName}</h2>
              <p className="text-sm text-gray-500 mb-4">{currentUser.email}</p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                BỆNH NHÂN
              </div>
            </div>
          </Card>

          {/* Thẻ tóm tắt sức khỏe (Hiện nhanh) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Chỉ Số Nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 pt-2">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">BMI:</span>
                <span className="font-semibold">{currentUser.bmi || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Hút thuốc:</span>
                <span className={currentUser.is_smoker ? 'text-red-600' : 'text-green-600'}>
                  {currentUser.is_smoker ? 'Có' : 'Không'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số con:</span>
                <span className="font-semibold">{currentUser.children ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI: Form Chỉnh Sửa */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                Cập Nhật Thông Tin
              </CardTitle>
              <CardDescription>
                Thông tin chính xác giúp bác sĩ chẩn đoán tốt hơn (đặc biệt là các chỉ số sức khỏe).
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Tái sử dụng UserForm - Sức mạnh của Component hóa */}
              <UserForm 
                initialData={currentUser} 
                onSave={handleSaveSuccess} 
                onCancel={() => {}} // Không cần nút Hủy ở trang này, hoặc có thể reset form
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}