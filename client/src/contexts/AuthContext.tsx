'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User } from '@/types'; // Import User từ file types chung

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('jwt_token');
        }
      }
      // Dù thành công hay thất bại, quá trình kiểm tra ban đầu đã xong
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (token: string): Promise<User | null> => {
    localStorage.setItem('jwt_token', token);
    // Cập nhật lại header của axios instance ngay lập tức
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      logout();
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    // Xóa header Authorization khỏi axios instance
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };
  
  const value = { isAuthenticated, user, loading, login, logout };

  // Quan trọng: Chỉ render children khi quá trình loading ban đầu đã hoàn tất
  // Điều này giúp tránh lỗi Hydration
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;