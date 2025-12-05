import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/contexts/ThemeContext';

/**
 * Custom Hook để quản lý giao diện Sáng/Tối (Dark Mode)
 * Sử dụng: const { theme, toggleTheme } = useTheme();
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  // Kiểm tra an toàn: Đảm bảo hook được gọi bên trong <ThemeProvider>
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};