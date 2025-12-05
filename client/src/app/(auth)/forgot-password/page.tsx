import React from 'react';
import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Quên Mật Khẩu | HealthCare',
  description: 'Khôi phục mật khẩu tài khoản HealthCare của bạn.',
};

export default function ForgotPasswordPage() {
  return (
    // Layout cha (auth/layout.tsx) đã lo phần căn giữa và nền xám
    // Page này chỉ cần render Form
    <ForgotPasswordForm />
  );
}