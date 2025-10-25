'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { AxiosError } from 'axios';

export default function RegisterPage() {
  // 1. Khai báo thêm state cho các trường mới
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. Kiểm tra mật khẩu nhập lại ở phía client
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // 3. Gọi đến API /auth/register
      await api.post('/auth/register', {
        fullName,
        email,
        password,
      });

      // 4. Xử lý khi đăng ký thành công
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      router.push('/login'); // Chuyển hướng về trang đăng nhập

    } catch (err) {
      // Xử lý các lỗi từ server
      if (err instanceof AxiosError) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Tạo Tài Khoản Mới</h1>
          <p className="text-gray-500">Chỉ một vài bước để bắt đầu.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700">
              Họ và Tên
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
              Xác nhận Mật khẩu
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="large" className="w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}