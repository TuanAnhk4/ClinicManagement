// src/app/login/page.tsx
'use client';

// 1. Import LoginForm từ components/auth
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    // 2. Tạo một layout đơn giản cho trang login (nền xám, căn giữa)
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* 3. Chỉ cần render LoginForm ở đây */}
      <LoginForm />
    </div>
  );
}