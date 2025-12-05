import React from 'react';
import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng Nhập | HealthCare',
  description: 'Đăng nhập vào hệ thống quản lý phòng khám HealthCare để đặt lịch và theo dõi sức khỏe.',
};

export default function LoginPage() {
  return (
    // Layout cha (auth/layout.tsx) đã lo phần căn giữa và nền xám
    // Page này chỉ cần render Form
    <LoginForm />
  );
}