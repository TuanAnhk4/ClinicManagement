import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { AuthContextType } from '@/types/auth';

/**
 * Custom Hook để truy cập AuthContext
 * Giúp lấy thông tin user, login, logout từ bất kỳ component nào.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Kiểm tra an toàn: Đảm bảo hook được gọi bên trong <AuthProvider>
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
