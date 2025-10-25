'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  // --- PHẦN LOGIC (Đã cung cấp trước đó) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = await auth.login(response.data.access_token);
      
      // ĐÂY LÀ LOGIC ĐIỀU HƯỚNG MỚI
      if (user) {
        if (user.role === 'ADMIN') {
          router.push('/admin/users'); // Admin thì vào trang quản lý users
        } else if (user.role === 'DOCTOR') {
          router.push('/dashboard'); // Bác sĩ thì vào dashboard
        } else {
          router.push('/book-appointment'); // Bệnh nhân thì về trang đặt lịch
        }
      }

    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  // --- PHẦN GIAO DIỆN (JSX - Phần bổ sung) ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant={error ? 'error' : 'default'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant={error ? 'error' : 'default'}
            />
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="large" className="w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Các phần khác như "Quên mật khẩu", "Đăng ký"... có thể thêm vào đây */}
      </div>
    </div>
  );
}