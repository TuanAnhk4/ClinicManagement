'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';

// Import Components
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthWrapper } from './AuthWrapper';

// Import Logic
import { authService } from '@/services/auth.service';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lấy token từ URL: ví dụ domain.com/reset-password?token=xyz...
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Kiểm tra xem có token không khi vừa vào trang
  useEffect(() => {
    if (!token) {
      setError('Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Thiếu mã xác thực (Token). Vui lòng kiểm tra lại link trong email.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({ 
        token: token, 
        newPassword: password 
      });
      setIsSuccess(true); // Chuyển sang màn hình thành công
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.');
      } else {
        setError('Lỗi kết nối đến server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- TRƯỜNG HỢP 1: THÀNH CÔNG ---
  if (isSuccess) {
    return (
      <AuthWrapper
        title="Thành công!"
        subtitle="Mật khẩu của bạn đã được cập nhật."
      >
        <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          
          <p className="text-center text-gray-600">
            Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
          </p>

          <Button 
            size="large" 
            fullWidth 
            onClick={() => router.push('/login')}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </AuthWrapper>
    );
  }

  // --- TRƯỜNG HỢP 2: FORM ĐỔI MẬT KHẨU ---
  return (
    <AuthWrapper
      title="Đặt lại mật khẩu"
      subtitle="Nhập mật khẩu mới cho tài khoản của bạn."
    >
      {/* Nếu không có token thì hiển thị lỗi ngay lập tức và ẩn form */}
      {!token ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
          <AlertCircle size={32} />
          <p>{error}</p>
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
                required
                error={password !== confirmPassword && confirmPassword.length > 0}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            size="large" 
            fullWidth 
            isLoading={isLoading}
          >
            Xác nhận thay đổi
          </Button>
          
          <div className="text-center mt-4">
             <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                Hủy bỏ
             </Link>
          </div>
        </form>
      )}
    </AuthWrapper>
  );
};