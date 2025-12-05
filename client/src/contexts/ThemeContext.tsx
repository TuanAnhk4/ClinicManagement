'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage-keys';

type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  
  // State để kiểm tra xem đã mount xong chưa (tránh lỗi hydration)
  const [mounted, setMounted] = useState(false);

  // 1. Khởi tạo theme khi load trang
  useEffect(() => {
    setMounted(true);
    
    // Kiểm tra LocalStorage trước
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Nếu chưa lưu, kiểm tra setting của hệ điều hành (System Preference)
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
      } else {
        setThemeState('light');
      }
    }
  }, []);

  // 2. Cập nhật DOM và LocalStorage mỗi khi theme thay đổi
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Xóa class cũ và thêm class mới
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Lưu vào storage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme, mounted]);

  // Hàm chuyển đổi
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Hàm set trực tiếp (nếu cần)
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Tránh render sai phía server (Hydration Mismatch)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
