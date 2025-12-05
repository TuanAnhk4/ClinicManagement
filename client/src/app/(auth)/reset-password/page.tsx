import React from 'react';
import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Đặt Lại Mật Khẩu | HealthCare',
  description: 'Thiết lập mật khẩu mới để bảo mật tài khoản HealthCare của bạn.',
};

export default function ResetPasswordPage() {
  return (
    // Layout cha (auth/layout.tsx) đã lo phần căn giữa và nền xám
    // Page này chỉ cần render Form chính
    <ResetPasswordForm />
  );
}