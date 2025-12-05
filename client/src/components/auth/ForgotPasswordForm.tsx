'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { AxiosError } from 'axios';

// Import Components
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthWrapper } from './AuthWrapper';

// Import Logic
import { authService } from '@/services/auth.service';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State để chuyển đổi giao diện khi gửi thành công
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true); // Chuyển sang màn hình thông báo thành công
    } catch (err) {
      if (err instanceof AxiosError) {
        // Nếu lỗi 404 (Email không tồn tại), ta vẫn nên báo thành công (Security best practice)
        // hoặc báo lỗi cụ thể tùy requirement của bạn. Ở đây tớ để báo lỗi thật để dễ debug.
        setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      } else {
        setError('Lỗi kết nối đến server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- GIAO DIỆN 1: THÔNG BÁO THÀNH CÔNG ---
  if (isSubmitted) {
    return (
      <AuthWrapper
        title="Kiểm tra email"
        subtitle={`Chúng tôi đã gửi liên kết đặt lại mật khẩu đến ${email}`}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Icon Success */}
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle size={32} />
          </div>

          <p className="text-center text-sm text-gray-500">
            Nếu không thấy email, hãy kiểm tra mục Spam hoặc thử lại sau vài phút.
          </p>

          <div className="w-full space-y-3">
            <Link href="/login" className="w-full block">
              <Button size="large" fullWidth>
                Quay lại đăng nhập
              </Button>
            </Link>
            
            <button 
              onClick={() => setIsSubmitted(false)}
              className="w-full text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Gửi lại email?
            </button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  // --- GIAO DIỆN 2: FORM NHẬP EMAIL ---
  return (
    <AuthWrapper
      title="Quên mật khẩu?"
      subtitle="Đừng lo, chúng tôi sẽ giúp bạn lấy lại mật khẩu."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email đăng ký
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10" // Padding left để chừa chỗ cho icon
              required
              error={!!error}
              autoFocus
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
          Gửi liên kết đặt lại
        </Button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
};