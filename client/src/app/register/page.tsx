'use client';

import { RegisterForm } from '@/components/auth/RegisterForm'; // Import form component

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Hiển thị RegisterForm ở đây */}
      <RegisterForm />
    </div>
  );
}