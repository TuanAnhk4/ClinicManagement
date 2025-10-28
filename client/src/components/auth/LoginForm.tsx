// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { AxiosError } from 'axios'; // Import AxiosError để xử lý lỗi an toàn

// Props giữ nguyên
interface LoginFormProps {
  onLoginSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) => {
  // --- BẮT ĐẦU PHẦN LOGIC TỪ LoginPage CŨ ---
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

if (user) {
  // LUÔN LUÔN THỰC HIỆN CHUYỂN HƯỚNG SAU KHI LOGIN
  const redirectPaths = {
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    PATIENT: '/patient/book-appointment', // Hoặc '/' nếu bạn muốn bệnh nhân về trang chủ riêng tư
  };
  // Giả sử user.role là string: 'ADMIN', 'DOCTOR', 'PATIENT'
  router.push(redirectPaths[user.role as keyof typeof redirectPaths] || '/');

} else {
  // Trường hợp auth.login trả về null (lỗi lấy profile)
  setError('Đăng nhập thành công nhưng không thể lấy thông tin người dùng.');
}
    // Sửa lại cách bắt lỗi cho an toàn
    } catch (err) {
       if (err instanceof AxiosError) {
          setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
       } else {
         setError('Đã có lỗi không xác định xảy ra.');
       }
    } finally {
      setLoading(false);
    }
  };
  // --- KẾT THÚC PHẦN LOGIC ---

  // --- PHẦN JSX GIỮ NGUYÊN NHƯ FILE LoginForm TRƯỚC ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Cột trái */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 p-8 rounded-l-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mt-4">
          Chăm sóc sức khỏe toàn diện cho bạn và gia đình.
        </h2>
      </div>

      {/* Cột phải (Form) */}
      <div className="p-8 space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-gray-500 text-sm">Vui lòng đăng nhập để tiếp tục.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input id="login-email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required variant={error ? 'error' : 'default'} />
          </div>
          {/* Password input */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <Input id="login-password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required variant={error ? 'error' : 'default'} />
          </div>
          {/* Forgot password link */}
          <div className="text-right text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">Forgot password?</Link>
          </div>
          {/* Error message */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {/* Submit button */}
          <Button type="submit" size="large" className="w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Login'}</Button>
          {/* OR separator */}
          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div></div>
          {/* Social buttons */}
          <div className="flex gap-4">
            <Button variant="secondary" className="w-full">Google</Button>
            <Button variant="secondary" className="w-full">Facebook</Button>
          </div>
          {/* Switch to Register */}
          <p className="text-sm text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-blue-600 hover:underline">Register Now</button>
          </p>
        </form>
      </div>
    </div>
  );
};