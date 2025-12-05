import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


// import { 
//   AuthProvider, 
//   UIProvider, 
//   ToastProvider, 
//   ThemeProvider 
// } from '@/contexts'; 

import { AuthProvider } from '@/contexts/AuthContext';
import { UIProvider } from '@/contexts/UIContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | HealthCare', // Tiêu đề động: "Trang Chủ | HealthCare"
    default: 'Hệ Thống Quản Lý Phòng Khám',
  },
  description: 'Giải pháp quản lý phòng khám tư nhân toàn diện, tích hợp AI dự đoán.',
  icons: {
    icon: '/favicon.ico', // Đảm bảo bạn có file này trong folder public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: Bắt buộc khi dùng ThemeProvider để tránh lỗi React warning
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        
        {/* 1. AuthProvider: Quản lý User (Quan trọng nhất, bọc ngoài cùng) */}
        <AuthProvider>
          
          {/* 2. ThemeProvider: Quản lý Dark Mode */}
          <ThemeProvider>
            
            {/* 3. UIProvider: Quản lý Sidebar, Loading toàn cục */}
            <UIProvider>
              
              {/* 4. ToastProvider: Quản lý thông báo nổi (Nên nằm trong cùng để đè lên mọi thứ) */}
              <ToastProvider>
                
                {children}
                
              </ToastProvider>
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}