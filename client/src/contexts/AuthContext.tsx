'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/users';
import { LoginPayload, RegisterPayload, AuthContextType } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { UserRole } from '@/types/enums';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hàm điều hướng dựa trên vai trò (Helper)
  const handleRedirect = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        router.push('/admin/dashboard');
        break;
      case UserRole.DOCTOR:
        router.push('/doctor/dashboard');
        break;
      case UserRole.PATIENT:
        router.push('/patient');
        break;
      default:
        router.push('/');
    }
  };

  // 1. Kiểm tra đăng nhập khi tải trang (F5)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          // Gọi service để lấy thông tin user mới nhất
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
          // Lưu ý: Khi F5 (initAuth), ta KHÔNG tự động redirect 
          // để giữ người dùng ở trang họ đang đứng. Layout bảo vệ sẽ lo việc đá ra nếu cần.
        } catch (error) {
          console.error('Phiên đăng nhập hết hạn:', error);
          authService.logout(); // Xóa token rác
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. Hàm Đăng nhập
  const login = async (payload: LoginPayload) => {
    try {
      // Gọi API Login
      const data = await authService.login(payload);
      
      let currentUser = data.user;

      // Nếu login response chưa trả về user đầy đủ, gọi tiếp getProfile
      if (!currentUser) {
        currentUser = await authService.getProfile();
      }

      // Cập nhật State và Chuyển hướng
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // QUAN TRỌNG: Chuyển hướng ngay lập tức
        handleRedirect(currentUser.role);
      }
    } catch (error) {
      // Ném lỗi ra ngoài để LoginForm hiển thị thông báo
      throw error;
    }
  };

  // 3. Hàm Đăng ký
  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
    // Sau khi đăng ký thành công, không tự login mà để người dùng tự nhập lại
    // hoặc UI sẽ chuyển họ về trang Login.
  };

  // 4. Hàm Đăng xuất
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {loading ? (
        // Màn hình chờ khi đang khởi tạo Auth (Tránh nháy giao diện login)
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};