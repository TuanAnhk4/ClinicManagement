'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

// Import Components chuẩn
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthWrapper } from './AuthWrapper';
import { SocialButtons } from './SocialButtons';

// Import Logic & Service
import { useAuth } from '@/hooks';
import { authService } from '@/services/auth.service'; // Dùng service thay vì gọi api trực tiếp

interface LoginFormProps {
  onLoginSuccess?: () => void; // (Optional) Nếu dùng trong Modal
  onSwitchToRegister?: () => void; // (Optional) Nếu dùng trong Modal
}

export const LoginForm = ({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: contextLogin } = useAuth(); // Lấy hàm login từ context để update state toàn cục
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Gọi API Login qua Service (để lấy token và user)
      const response = await authService.login({ email, password });

      // 2. Cập nhật Context (quan trọng để App biết là đã login)
      // Lưu ý: Hàm contextLogin của bạn hiện tại có thể đang gọi lại API. 
      // Tốt nhất là sửa context để nhận luôn data user, hoặc cứ gọi lại nếu chấp nhận 2 request.
      // Ở đây giả sử ta gọi hàm login của Context để nó lo mọi việc.
      await contextLogin({ email, password });
      
      // 3. Chuyển hướng (Nếu context chưa tự chuyển hướng)
      // Logic chuyển hướng đã có trong AuthContext mới, nên ở đây có thể không cần nữa.
      // Nhưng nếu bạn muốn xử lý riêng cho Modal:
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Fallback nếu Context không tự chuyển hướng
        // const role = response.user?.role;
        // if (role === 'ADMIN') router.push('/admin/dashboard');
        // else if (role === 'DOCTOR') router.push('/doctor/dashboard');
        // else router.push('/patient');
      }

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

  return (
    <AuthWrapper
      title="Chào mừng trở lại"
      subtitle="Vui lòng đăng nhập để tiếp tục"
      footerLink={
        // Nếu dùng trong Modal thì xử lý nút chuyển đổi riêng
        !onSwitchToRegister ? {
          text: "Chưa có tài khoản?",
          linkText: "Đăng ký ngay",
          href: "/register"
        } : undefined
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!error} // Hiển thị viền đỏ nếu lỗi
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!error}
          />
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <Button type="submit" size="large" className="w-full" isLoading={loading} fullWidth>
          Đăng nhập
        </Button>
      </form>

      {/* Nút Social */}
      <SocialButtons isLoading={loading} />

      {/* Nếu dùng trong Modal thì hiện nút chuyển đổi ở đây */}
      {onSwitchToRegister && (
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      )}
    </AuthWrapper>
  );
};