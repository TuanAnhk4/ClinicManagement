import React from 'react';
import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Đăng Ký | HealthCare',
  description: 'Tạo tài khoản mới tại HealthCare để đặt lịch khám và quản lý hồ sơ sức khỏe trực tuyến.',
};

export default function RegisterPage() {
  return (
    // Layout cha (auth/layout.tsx) đã lo phần căn giữa và nền xám
    // Page này chỉ cần render Form
    <RegisterForm />
  );
}